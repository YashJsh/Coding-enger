import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn button
import { Code2 } from "lucide-react"; // Icon for the logo
import { ModeToggle } from "./theme/toggle-theme";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-tight text-foreground">enger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-6 md:pl-6 text-sm font-medium text-muted-foreground">
            <Link href="/problems" className="transition-colors hover:text-primary">
              Problems
            </Link>
            <Link href="/playground" className="transition-colors hover:text-primary">
              Playground
            </Link>
            <Link href="/discuss" className="transition-colors hover:text-primary">
              Discuss
            </Link>
          </div>
        </div>
        
        <div className="flex justify-end">
            <ModeToggle/>
        </div>
      </div>
    </nav>
  );
};