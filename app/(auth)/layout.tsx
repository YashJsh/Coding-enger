import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "./_components/social_auth_buttons";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList
  });
  
  if (session?.user) {
    redirect("/problems");
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <Navbar />
      
      <div className="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:32px_32px]">
  <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
</div>




      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-sm">
          <Card className="border-border/60 shadow-lg backdrop-blur-sm bg-background/95">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight uppercase">
                Welcome to enger
              </CardTitle>
              <CardDescription>
                Enter your details to join enger
              </CardDescription>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
            <Separator/>
            <CardFooter>
              <SocialAuthButtons/>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}