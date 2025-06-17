'use client';

import { useState } from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Github } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";



import { useContext } from "react";
import AuthContext from "@/components/providers/AuthProvider";


function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login, loginWithGoogle } = useContext(AuthContext);



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // redirect or show success (optional)
            console.log("Logged in successfully!");
        } catch (error) {
            console.error("Login error:", error.message);
            // show error to user (optional)
        }
    };




    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
            >
                <div className="bg-white rounded-2xl  space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Please enter your email and password to continue.
                        </p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2" >
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm">
                                    Remember me
                                </Label>
                            </div>
                            <a href="#" className="text-sm hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm text-gray-500 uppercase">
                            <span className="bg-white px-2">Or continue with</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-black hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage





















































// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent } from '@/components/ui/card';
// import { Eye, EyeOff } from 'lucide-react';
// import Link from 'next/link';

// import { cn } from "@/lib/utils";

// export default function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async () => {
//         setEmailError('');
//         setPasswordError('');
//         setLoading(true);

//         // Email validation
//         if (!email || !/\S+@\S+\.\S+/.test(email)) {
//             setEmailError('Invalid email address');
//             setLoading(false);
//             return;
//         }

//         // Password validation
//         if (password.length < 6) {
//             setPasswordError('Password must be at least 6 characters long');
//             setLoading(false);
//             return;
//         }

//         try {
//             // Your Firebase login logic here
//             // await login(email, password);
//         } catch (err) {
//             setPasswordError('Login failed. Please try again.');
//         }

//         setLoading(false);
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen px-4">
//             <Card className="w-full max-w-md rounded-2xl shadow-xl">
//                 <CardContent className="space-y-6 p-6">
//                     <div className="text-center">
//                         <h2 className="text-2xl font-bold">Login</h2>
//                         <p className="text-sm text-muted-foreground">
//                             Enter your email and password to login to your account.
//                         </p>
//                     </div>

//                     {/* Email */}
//                     <div className="space-y-2">
//                         <Label htmlFor="email" className={emailError ? 'text-red-600' : ''}>Email</Label>
//                         <Input
//                             id="email"
//                             type="email"
//                             placeholder="you@example.com"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className={cn(
//                                 "border",
//                                 emailError ? "border-red-500 focus-visible:ring-red-500" : "border-input"
//                             )}
//                         />
//                         {emailError && <p className="text-sm text-red-600">{emailError}</p>}
//                     </div>

//                     {/* Password */}
//                     <div className="space-y-2">
//                         <div className="flex justify-between items-center">
//                             <Label htmlFor="password" className={passwordError ? 'text-red-600' : ''}>
//                                 Password
//                             </Label>
//                             <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
//                                 Forgot your password?
//                             </Link>
//                         </div>
//                         <div className="relative">
//                             <Input
//                                 id="password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 placeholder="••••••"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className={cn(
//                                     "pr-10",
//                                     passwordError ? "border-red-500 focus-visible:ring-red-500" : "border-input"
//                                 )}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
//                             >
//                                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                             </button>
//                         </div>
//                         {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
//                     </div>

//                     {/* Buttons */}
//                     <Button onClick={handleLogin} disabled={loading} className="w-full">
//                         {loading ? 'Logging in...' : 'Login'}
//                     </Button>

//                     <Button variant="outline" className="w-full">
//                         Login with Google
//                     </Button>

//                     <p className="text-center text-sm text-muted-foreground">
//                         Don't have an account?{' '}
//                         <Link href="/register" className="text-blue-600 hover:underline">
//                             Sign up
//                         </Link>
//                     </p>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

































// 'use client'

// import { FormProvider } from 'react-hook-form'


// import Link from 'next/link'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { toast } from 'sonner'

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from '@/components/ui/form'

// import { Button } from '@/components/ui/button'
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { PasswordInput } from '@/components/ui/password-input'

// // Schema using Zod
// const formSchema = z.object({
//     email: z.string().email({ message: 'Invalid email address' }),
//     password: z
//         .string()
//         .min(6, { message: 'Password must be at least 6 characters long' })
//         .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
// })

// export default function LoginPreview() {
//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: '',
//             password: '',
//         },
//     })

//     async function onSubmit(values) {
//         try {
//             console.log(values)
//             toast(
//                 <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//                     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
//                 </pre>
//             )
//         } catch (error) {
//             console.error('Form submission error', error)
//             toast.error('Failed to submit the form. Please try again.')
//         }
//     }

//     return (
//         <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
//             <Card className="mx-auto max-w-sm">
//                 <CardHeader>
//                     <CardTitle className="text-2xl">Login</CardTitle>
//                     <CardDescription>
//                         Enter your email and password to login to your account.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <FormProvider {...form}>
//                         <Form {...form}>
//                             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                                 <div className="grid gap-4">
//                                     <FormField 
//                                         control={form.control}
//                                         name="email"
//                                         render={({ field }) => (
//                                             <FormItem className="grid gap-2">
//                                                 <FormLabel htmlFor="email">Email</FormLabel>
//                                                 <FormControl>
//                                                     <Input
//                                                         id="email"
//                                                         placeholder="johndoe@mail.com"
//                                                         type="email"
//                                                         autoComplete="email"
//                                                         {...field}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name="password"
//                                         render={({ field }) => (
//                                             <FormItem className="grid gap-2">
//                                                 <div className="flex justify-between items-center">
//                                                     <FormLabel htmlFor="password">Password</FormLabel>
//                                                     <Link
//                                                         href="#"
//                                                         className="ml-auto inline-block text-sm underline"
//                                                     >
//                                                         Forgot your password?
//                                                     </Link>
//                                                 </div>
//                                                 <FormControl>
//                                                     <PasswordInput
//                                                         id="password"
//                                                         placeholder="******"
//                                                         autoComplete="current-password"
//                                                         {...field}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <Button type="submit" className="w-full">
//                                         Login
//                                     </Button>
//                                     <Button variant="outline" className="w-full">
//                                         Login with Google
//                                     </Button>
//                                 </div>
//                             </form>
//                         </Form>

//                     </FormProvider>

//                     <div className="mt-4 text-center text-sm">
//                         Don&apos;t have an account?{' '}
//                         <Link href="#" className="underline">
//                             Sign up
//                         </Link>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }
