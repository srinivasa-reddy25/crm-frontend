'use client';

import { createContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { auth, provider } from '@/lib/firebase';

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    signInWithRedirect,
    getRedirectResult
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

    const loginWithGoogle = async () => {
        try {
            console.log('Starting Google sign-in process');
            const result = await signInWithPopup(auth, provider);
            console.log("Google sign-in successful:", result.user.email);

            const userData = {
                name: result.user.displayName,
                profilePicture: result.user.photoURL,
                preference: "light",
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await result.user.getIdToken()}`,
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Google auth backend error:", data);
                throw new Error(data.error || 'Failed to authenticate with Google');
            }

            const token = await result.user.getIdToken();
            storeAuthCookie(token); // Store token in cookie

            console.log("Google auth backend response:", data);

            // Navigate based on whether this is a new user or not
            if (data.isNewUser) {
                // Maybe show onboarding or welcome screen
                router.push('/dashboard');
            } else {
                // Regular login flow
                router.push('/dashboard');
            }

            return result;
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
            value={{ user, loading, login, register, loginWithGoogle, logout, updateUserProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;