'use client';

import { createContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/lib/firebase';
import queryClient from '@/lib/queryClient';
import { authErrorMessage } from '@/lib/auth-errors';
import { toast } from 'sonner';
import {
    onIdTokenChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, signInWithRedirect, getRedirectResult, signOut,
    updateProfile, sendEmailVerification,
} from 'firebase/auth';

const cookieOptions = () => `path=/; SameSite=Strict${window.location.protocol === 'https:' ? '; Secure' : ''}`;
const storeAuthCookie = token => { document.cookie = `auth=${token}; max-age=3600; ${cookieOptions()}`; };
const clearAuthCookie = () => { document.cookie = `auth=; max-age=0; ${cookieOptions()}`; };
const AuthContext = createContext();

async function syncWithBackend(firebaseUser, endpoint = 'login') {
    const token = await firebaseUser.getIdToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: firebaseUser.displayName, profilePicture: firebaseUser.photoURL }),
        signal: AbortSignal.timeout(60000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(result.error || 'Could not finish signing in. Please try again.'), { code: result.code });
    return token;
}

export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [verificationSentAt, setVerificationSentAt] = useState(0);
    const inFlight = useRef(false);

    const finishSignIn = async (firebaseUser, endpoint = 'login') => {
        if (!firebaseUser.emailVerified) throw new Error('Verify your email before continuing.');
        const token = await syncWithBackend(firebaseUser, endpoint);
        if (auth.currentUser?.uid !== firebaseUser.uid) throw new Error('Your session changed. Please sign in again.');
        queryClient.clear();
        storeAuthCookie(token);
        setUser(firebaseUser);
        router.replace('/dashboard');
    };

    const sendVerification = async () => {
        const current = auth.currentUser;
        if (!current) throw new Error('Please sign in again to verify your email.');
        if (Date.now() - verificationSentAt < 60000) throw new Error('Please wait a minute before requesting another email.');
        await sendEmailVerification(current, { url: `${window.location.origin}/auth/verify-email` });
        setVerificationSentAt(Date.now());
        setVerificationError('');
    };

    const requireVerification = async (current, send = false) => {
        clearAuthCookie();
        queryClient.clear();
        setUser(current);
        setVerificationError('');
        if (send) {
            try { await sendVerification(); }
            catch (error) { setVerificationError(authErrorMessage(error)); }
        }
        router.replace('/auth/verify-email');
        return { verificationRequired: true };
    };

    const checkVerification = async () => {
        if (inFlight.current) return false;
        inFlight.current = true;
        try {
            const current = auth.currentUser;
            if (!current) throw new Error('Please sign in again to continue.');
            await current.reload();
            if (!current.emailVerified) return false;
            await current.getIdToken(true);
            await finishSignIn(current);
            return true;
        } finally { inFlight.current = false; }
    };

    const login = async (email, password) => {
        inFlight.current = true;
        clearAuthCookie();
        try {
            const { user: current } = await signInWithEmailAndPassword(auth, email.trim(), password);
            if (!current.emailVerified) return await requireVerification(current);
            await finishSignIn(current);
            return { verificationRequired: false };
        } catch (error) {
            clearAuthCookie();
            setUser(null);
            await signOut(auth).catch(() => {});
            throw error;
        } finally { inFlight.current = false; }
    };

    const register = async (displayName, email, password) => {
        inFlight.current = true;
        clearAuthCookie();
        try {
            const { user: current } = await createUserWithEmailAndPassword(auth, email.trim(), password);
            await updateProfile(current, { displayName: displayName.trim() });
            return await requireVerification(current, true);
        } catch (error) {
            clearAuthCookie();
            setUser(null);
            await signOut(auth).catch(() => {});
            throw error;
        } finally { inFlight.current = false; }
    };

    const loginWithGoogle = async () => {
        if (inFlight.current) return;
        inFlight.current = true;
        setGoogleLoading(true);
        try {
            if (auth.config.authDomain === window.location.host) {
                sessionStorage.setItem('googleRedirectPending', 'true');
                await signInWithRedirect(auth, provider);
                return;
            }
            const result = await signInWithPopup(auth, provider);
            await finishSignIn(result.user, 'google');
        } catch (error) {
            sessionStorage.removeItem('googleRedirectPending');
            clearAuthCookie();
            setUser(null);
            await signOut(auth).catch(() => {});
            toast.error(authErrorMessage(error));
        } finally {
            inFlight.current = false;
            setGoogleLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        let unsubscribe;
        async function restore() {
            let redirectResult;
            try { redirectResult = await getRedirectResult(auth); }
            catch (error) {
                sessionStorage.removeItem('googleRedirectPending');
                clearAuthCookie();
                if (!cancelled) toast.error(authErrorMessage(error));
            }
            if (cancelled) return;
            unsubscribe = onIdTokenChanged(auth, async firebaseUser => {
                if (inFlight.current || cancelled) return;
                inFlight.current = true;
                const current = redirectResult?.user || firebaseUser;
                redirectResult = null;
                try {
                    if (!current) {
                        setUser(null);
                        clearAuthCookie();
                        queryClient.clear();
                    } else if (!current.emailVerified) {
                        clearAuthCookie();
                        queryClient.clear();
                        setUser(current);
                        if (window.location.pathname !== '/auth/verify-email') router.replace('/auth/verify-email');
                    } else {
                        const token = await syncWithBackend(current, sessionStorage.getItem('googleRedirectPending') ? 'google' : 'session');
                        if (cancelled || auth.currentUser?.uid !== current.uid) return;
                        storeAuthCookie(token);
                        setUser(current);
                        sessionStorage.removeItem('googleRedirectPending');
                        if (['/auth/login', '/auth/register', '/auth/verify-email'].includes(window.location.pathname)) router.replace('/dashboard');
                    }
                } catch (error) {
                    clearAuthCookie();
                    setUser(null);
                    sessionStorage.removeItem('googleRedirectPending');
                    await signOut(auth).catch(() => {});
                    if (!cancelled) toast.error(authErrorMessage(error));
                } finally {
                    inFlight.current = false;
                    if (!cancelled) setLoading(false);
                }
            });
        }
        restore();
        return () => { cancelled = true; unsubscribe?.(); };
    }, []);

    const logout = async () => {
        clearAuthCookie();
        queryClient.clear();
        setUser(null);
        await signOut(auth);
        router.replace('/auth/login');
    };

    return <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, googleLoading, logout,
        sendVerification, checkVerification, verificationError, verificationSentAt,
        updateUserProfile: updates => updateProfile(auth.currentUser, updates),
    }}>{children}</AuthContext.Provider>;
}
export default AuthContext;
