import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
} from "lucide-react";
import { getProblems } from "@/lib/problems/queries";
import { AllProblems } from "@/components/problem/problems_all";


export default async function ProblemsDashboard() {
  const problems = await getProblems();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary/10">
      <Navbar />

      {/* --- BACKGROUND CONTAINER (Reusable) --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] left-0 right-0 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]"></div>
      </div>

      <main className="container max-w-5xl mx-auto px-4 py-12">

        {/* 2. Header Section: Title & Stats
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Problems</h1>
            <p className="text-muted-foreground">
              Sharpen your skills.
            </p>
          </div>
        </div> */}


        {/* 3. Controls: Search & Filter */}
        <div className="flex gap-4 mb-6 ">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="pl-10 bg-background/60 backdrop-blur-sm border-muted/40 focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* 4. The Problem List */}
        <AllProblems problems={problems}/>

      </main >
    </div >
  );
}

// Helper Component for consistent styling
