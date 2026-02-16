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


const signInSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type SignInFormType = z.infer<typeof signInSchema>;

export const SignInForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<SignInFormType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleSignIn = async (data: SignInFormType) => {
        try {
            setLoading(true);
            const response = await authClient.signIn.email(
                {
                    email: data.email,
                    password: data.password,
                    callbackURL: "/problems"
                },
                {
                    onError: (ctx) => {
                        console.log("Error context : ", ctx);
                        const message =
                            ctx?.error?.message ||
                            ctx?.error?.error ||
                            "Signup failed";

                        toast.error(message);
                    },
                    onSuccess: () => {
                        toast.success("Signed In successfully!");
                        router.push("/problems");
                        router.refresh();
                    }
                },
            );
        } catch (error) {
            console.error("Error is : ", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            {/* 2. Added space-y-4 for consistent spacing between fields */}
            <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">


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
                            Signing in...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </Button>

                <div className="flex justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                        New to enger? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
                    </p>
                </div>
            </form>
        </Form>
    );
}