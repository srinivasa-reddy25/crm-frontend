'use client';

import { useState, useContext } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import AuthContext from "@/components/providers/AuthProvider";

import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
        errorMap: () => ({ message: "You must accept the Terms and Conditions" })
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});



function Register() {
    const { register, loginWithGoogle } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    const onClickingRegister = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            email,
            password,
            confirmPassword,
            termsAccepted
        };

        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const errors = {};
            // console.error("Validation errors:", result.error.errors);
            result.error.errors.forEach(err => {
                errors[err.path[0]] = err.message;
            });
            setFormErrors(errors);
            return;
        }

        try {
            await register(name, email, password);
            alert("Registration successful! Please check your email.");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setTermsAccepted(false);
            setFormErrors({});
        } catch (err) {
            console.error("Registration failed:", err);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen  p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hey there!</h1>
                    <p className="text-muted-foreground text-sm">
                        Please enter your email and password to register
                    </p>
                </div>
                <form className="mt-6 space-y-4" onSubmit={onClickingRegister}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Sai Teja"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="prodgain@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {formErrors.confirmPassword && (
                            <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                        />
                        <Label htmlFor="terms">
                            I accept the{" "}
                            <a href="#" className="text-black hover:underline">
                                Terms and Conditions
                            </a>
                        </Label>
                    </div>
                    {formErrors.termsAccepted && (
                        <p className="text-sm text-red-500">{formErrors.termsAccepted}</p>
                    )}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer bg-black text-white hover:bg-gray-800 transition-colors duration-200"
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
                    <Button variant="outline" className="w-full" onClick={loginWithGoogle}>
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
            </motion.div>
        </div>
    );
}

export default Register;
