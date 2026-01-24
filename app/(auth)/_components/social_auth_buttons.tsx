"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { usePathname } from "next/navigation";

export const SocialAuthButtons = () => {
  const pathname = usePathname();

  const isSignIn = pathname?.includes("signin");

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full bg-background"
      onClick={() => console.log("Github Login Clicked")}
    >
      {isSignIn ? "Sign In with Github" : "Sign Up with Github"}
      <Github className="mr-2 h-4 w-4" />
    </Button>
  );
};
