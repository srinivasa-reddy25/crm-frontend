'use client';

import { createContext, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { auth, provider } from '@/lib/firebase';

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
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
    const googleSyncInFlight = useRef(false);


    const syncWithBackend = async (firebaseUser, endpoint) => {
        console.log("second step, syncing with backend : ", firebaseUser);
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
            console.log(`Backend ${endpoint} success:`, result);

            return result;
        } catch (err) {
            console.error(`Backend ${endpoint} error:`, err);
            throw err;
        }
    };

    const completeGoogleLogin = async (firebaseUser) => {
        if (googleSyncInFlight.current) return;

        googleSyncInFlight.current = true;
        try {
            await syncWithBackend(firebaseUser, 'google');
            const token = await firebaseUser.getIdToken();
            storeAuthCookie(token);
            sessionStorage.removeItem('googleRedirectPending');
            router.replace('/dashboard');
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        } finally {
            googleSyncInFlight.current = false;
        }
    };

    const loginWithGoogle = async () => {
        console.log('Starting Google sign-in process');
        sessionStorage.setItem('googleRedirectPending', 'true');
        await signInWithRedirect(auth, provider);
    };


    useEffect(() => {
        let cancelled = false;

        getRedirectResult(auth)
            .then(async (result) => {
                if (!cancelled && result?.user) {
                    await completeGoogleLogin(result.user);
                }
            })
            .catch((error) => {
                sessionStorage.removeItem('googleRedirectPending');
                console.error('Google redirect error:', error);
            });

        return () => {
            cancelled = true;
        };
    }, []);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            // console.log(" User details ", firebaseUser)
            if (firebaseUser) {
                // User is signed in, store token in cookie
                try {
                    const token = await firebaseUser.getIdToken();
                    storeAuthCookie(token);

                    // Some browsers restore the Firebase user after a redirect but
                    // return null from getRedirectResult. The pending marker lets us
                    // still finish the backend sync and dashboard navigation.
                    if (sessionStorage.getItem('googleRedirectPending') === 'true') {
                        await completeGoogleLogin(firebaseUser);
                    }
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
            value={{ user, loading, login, register, loginWithGoogle, logout, updateUserProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
