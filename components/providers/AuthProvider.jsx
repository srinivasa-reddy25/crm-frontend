'use client';

import { createContext, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { auth, provider } from '@/lib/firebase';
import { toast } from 'sonner';

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    updateProfile,
} from 'firebase/auth';
const storeAuthCookie = (token) => {
    document.cookie = `auth=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
};


const clearAuthCookie = () => {
    document.cookie = "auth=; path=/; max-age=0; SameSite=Strict; Secure";
};















const AuthContext = createContext();


export function AuthProvider({ children }) {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleSignInInFlight = useRef(false);
    const [googleLoading, setGoogleLoading] = useState(false);


    const syncWithBackend = async (firebaseUser, endpoint) => {
        const token = await firebaseUser.getIdToken();

        const metadata = {
            name: firebaseUser.displayName,
            profilePicture: firebaseUser.photoURL,
            preference: "light",
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(metadata),
            });

            const result = await response.json();
            if (!response.ok) {
                console.error(`Backend ${endpoint} error:`, result);
                throw new Error(result.error || 'Failed to sync with backend');
            }

            return result;
        } catch (err) {
            console.error(`Backend ${endpoint} error:`, err);
            throw err;
        }
    };

    const loginWithGoogle = async () => {
        // Start the popup directly from the click to preserve browser user activation.
        if (googleSignInInFlight.current) return;
        googleSignInInFlight.current = true;
        setGoogleLoading(true);

        try {
            // Redirect only when the auth helper shares this site's origin.
            // Cross-origin redirects can lose their result to storage partitioning.
            if (auth.config.authDomain === window.location.host) {
                sessionStorage.setItem('googleRedirectPending', 'true');
                await signInWithRedirect(auth, provider);
                return;
            }
            const result = await signInWithPopup(auth, provider);
            await syncWithBackend(result.user, 'google');
            const token = await result.user.getIdToken();
            storeAuthCookie(token);
            setUser(result.user);
            router.replace('/dashboard');
        } catch (error) {
            sessionStorage.removeItem('googleRedirectPending');
            clearAuthCookie();
            setUser(null);
            // Do not restore an incomplete Google session on the next page load.
            try {
                await signOut(auth);
            } catch (signOutError) {
                console.error('Could not clear Google session:', signOutError.code);
            }
            console.error('Google login failed:', error.code || error.message);
            const messages = {
                'auth/popup-blocked': 'Google sign-in could not open a popup. A browser setting or extension may be preventing it.',
                'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again.',
                'auth/cancelled-popup-request': 'Google sign-in was cancelled. Please try again.',
                'auth/unauthorized-domain': 'This site is not authorized for Google sign-in. Add its hostname to Firebase Authentication authorized domains.',
                'auth/operation-not-allowed': 'Google sign-in is not enabled in Firebase Authentication.',
                'auth/network-request-failed': 'Could not reach Google sign-in. Check your connection and try again.',
            };
            toast.error(messages[error.code] || (error instanceof TypeError
                ? 'Could not reach the CRM server. Make sure the backend is running and try again.'
                : error.message || 'Google sign-in failed. Please try again.'));
        } finally {
            googleSignInInFlight.current = false;
            setGoogleLoading(false);
        }
    };


    useEffect(() => {
        let cancelled = false;
        let unsubscribe;

        const restoreSession = async () => {
            let redirectResult;
            try {
                redirectResult = await getRedirectResult(auth);
            } catch (error) {
                sessionStorage.removeItem('googleRedirectPending');
                clearAuthCookie();
                console.error('Google redirect failed:', error.code || error.message);
                if (!cancelled) toast.error(error.message || 'Google sign-in could not finish. Please try again.');
            }
            if (cancelled) return;

            unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (googleSignInInFlight.current) return;
                const pending = sessionStorage.getItem('googleRedirectPending') === 'true';
                const signedInUser = redirectResult?.user || firebaseUser;
                redirectResult = null;

                if (pending) {
                    googleSignInInFlight.current = true;
                    setGoogleLoading(true);
                    try {
                        if (!signedInUser || !signedInUser.providerData.some(({ providerId }) => providerId === 'google.com')) {
                            throw new Error('Google sign-in did not complete. Please try again.');
                        }
                        await syncWithBackend(signedInUser, 'google');
                        const token = await signedInUser.getIdToken();
                        if (cancelled) return;
                        storeAuthCookie(token);
                        setUser(signedInUser);
                        sessionStorage.removeItem('googleRedirectPending');
                        router.replace('/dashboard');
                    } catch (error) {
                        sessionStorage.removeItem('googleRedirectPending');
                        clearAuthCookie();
                        setUser(null);
                        await signOut(auth).catch(() => {});
                        console.error('Google backend sign-in failed:', error.message);
                        if (!cancelled) toast.error(error instanceof TypeError
                            ? 'Could not reach the CRM server. Please try again.'
                            : error.message);
                    } finally {
                        googleSignInInFlight.current = false;
                        if (!cancelled) {
                            setGoogleLoading(false);
                            setLoading(false);
                        }
                    }
                    return;
                }

                setUser(firebaseUser);
                if (firebaseUser) {
                    try {
                        const token = await firebaseUser.getIdToken();
                        if (!cancelled) storeAuthCookie(token);
                    } catch (error) {
                        console.error('Error getting token:', error.code);
                    }
                } else {
                    clearAuthCookie();
                }
                if (!cancelled) setLoading(false);
            });
        };

        restoreSession();
        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, []);


    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            storeAuthCookie(token);
            await syncWithBackend(userCredential.user, "login");
            router.push('/dashboard');
        } catch (error) {
            console.log("Login error:", error);
            throw error; // rethrow the actual Firebase error
        }
    };


    const register = async (displayName, email, password) => {
        if (!/\S+@\S+\.\S+/.test(email)) {
            throw new Error("Invalid email format");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        console.log("first step done, user created: ", userCredential);

        await updateProfile(userCredential.user, { displayName });

        const token = await userCredential.user.getIdToken();
        storeAuthCookie(token);

        await syncWithBackend(userCredential.user, "register");

        router.push('/dashboard');
    };


    const logout = () => {
        console.log("Logging out user:", user?.email);
        try {
            clearAuthCookie();
            signOut(auth)
            console.log("User logged out successfully");
            router.push('/auth/login');
        }
        catch (err) {
            console.error("Logout failed:", err)
        }
    };

    const updateUserProfile = (updates) => updateProfile(auth.currentUser, updates);

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, loginWithGoogle, googleLoading, logout, updateUserProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
