"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";


const signUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type SignUpFormType = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<SignUpFormType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username : "",
            email: "",
            password: ""
        }
    });

    const handleSignUp = async (data: SignUpFormType) => {
        try {
            setLoading(true);
            const resposne = await authClient.signUp.email(
                {
                    name: data.username,
                    email: data.email,
                    password: data.password,
                    callbackURL: "/problems"
                },
                {
                    onError: (ctx) => {
                        console.log("Error context : ",ctx);
                        toast.error(ctx?.error?.message);
                    },
                    onSuccess : ()=>{
                        toast.success("Account created successfully!");
                        router.push("/problems");
                        router.refresh();
                    }
                },
            );
        } catch (error) {
            console.error("Error is : ",error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            {/* 2. Added space-y-4 for consistent spacing between fields */}
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="enger"
                                    {...field}
                                    disabled={loading} // Disable input while loading
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
                                    {...field}
                                    disabled={loading} // Disable input while loading
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                {/* 3. Added type="password" to hide characters */}
                                <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 4. Made button full width and added loading state */}
                <Button className="w-full mt-2" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>

                <div className="flex justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign In</Link>
                    </p>
                </div>
            </form>
        </Form>
    );
}