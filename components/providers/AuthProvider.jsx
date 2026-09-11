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
            const result = await signInWithPopup(auth, provider);
            await syncWithBackend(result.user, 'google');
            const token = await result.user.getIdToken();
            storeAuthCookie(token);
            setUser(result.user);
            router.replace('/dashboard');
        } catch (error) {
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
                'auth/popup-blocked': 'Your browser blocked Google sign-in. Allow popups for this site and try again.',
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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            // Google sign-in commits the app session only after backend sync succeeds.
            if (googleSignInInFlight.current) {
                setLoading(false);
                return;
            }
            setUser(firebaseUser);
            // console.log(" User details ", firebaseUser)
            if (firebaseUser) {
                // User is signed in, store token in cookie
                try {
                    const token = await firebaseUser.getIdToken();
                    storeAuthCookie(token);

                } catch (error) {
                    console.error("Error getting token:", error);
                }
            } else {
                // User is signed out, clear cookie
                clearAuthCookie();
            }

            setLoading(false);
        });
        return () => unsubscribe();
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
