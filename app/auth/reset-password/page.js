'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';


import { useRouter } from 'next/navigation';


function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await sendPasswordResetEmail(auth, email);

            setMessage("If an account exists for this email, a password reset link has been sent. Please check your inbox and spam folder.");
            setTimeout(() => {
                router.push("/auth/login");
            }, 4000);

        } catch (err) {
            console.error('Reset error:', err);
            if (err.code === 'auth/user-not-found') {
                setError('No user found with this email.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                        {message && <p className="text-sm text-green-600 mt-1">{message}</p>}
                    </div>
                    <Button type="submit" className="w-full">
                        Send Reset Link
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordPage;
