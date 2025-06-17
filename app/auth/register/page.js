'use client';

import { useState, useContext } from "react";
import Link from "next/link";
// import { AuthContext } from "@/components/providers/AuthProvider";

// import { auth, provider } from '@/lib/firebase';


// import {
//     onAuthStateChanged,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     signInWithPopup,
//     signOut,
//     updateProfile,
// } from 'firebase/auth';





import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";



import AuthContext from "@/components/providers/AuthProvider";

function Register() {


    const { register ,loginWithGoogle} = useContext(AuthContext);

    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);



    const onClickingRegister = async (e) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            console.log("Attempting Registration...");
            await register(name, email, password);
            console.log("Registration successful for:", { name, email });
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setTermsAccepted(false);
            alert("Registration successful! Please check your email for confirmation.");

        }
        catch (err) {
            console.error("Registration failed:", err);
            alert("Registration failed. Please try again.");
            return;
        }
    }





    return (
        <div className="flex items-center justify-center min-h-screen  p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <div className="text-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Hey there!
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Please enter your email and password to register
                        </p>
                    </div>
                    <form className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Sai Teja"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="prodgain@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="conform-password" className="text-gray-700">
                                conform Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={termsAccepted}
                                onCheckedChange={setTermsAccepted}
                                className="cursor-pointer"
                            />
                            <Label htmlFor="terms" className="text-gray-700">
                                I accept the{" "}
                                <a href="#" className="text-black hover:underline">
                                    Terms and Conditions
                                </a>
                            </Label>
                        </div>
                        <Button
                            type="submit"
                            className="w-full cursor-pointer bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                            disabled={!termsAccepted || !name || !email || !password || !confirmPassword}
                            onClick={onClickingRegister}
                        >
                            Register
                        </Button>
                    </form>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm text-gray-500 uppercase">
                            <span className="bg-white px-2">Or continue with</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Button variant="outline" className="w-full cursor-pointer" onClick={loginWithGoogle}>
                            <Mail size={18} />
                            <span>Google</span>
                        </Button>
                        <Button variant="outline" className="w-full cursor-not-allowed">
                            <Github size={18} />
                            <span>GitHub</span>
                        </Button>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-black hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Register