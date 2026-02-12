
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Search,
  Filter,
  TrendingUp,
  Clock
} from "lucide-react";
import { getProblems } from "@/lib/problems/queries";


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
        <div className="space-y-3">
          {problems.map((problem, index) => {
            const number = String(index + 1).padStart(2, "0")
            return (
              <div
                key={problem.id}
                className="group relative flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/50 hover:bg-background/80 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="flex items-center gap-4 z-10">
                  {/* Status Icon */}
                  {/* <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {problem.status === "solved" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div> */}

                  {/* Title & Category */}
                  <div className="gap-1 flex flex-col">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">

                      {number}. {problem.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 flex gap-2 justify-start items-center">
                      {problem.tags.map((tag)=><Badge key={tag}>{tag}</Badge>)}
                    </p>
                </div>
              </div>

              {/* Right Side: Difficulty & Stats */ }
            <div className="flex items-center gap-6 z-10">
              {/* <div className="hidden md:block text-xs text-muted-foreground font-mono">
                  acc: {problem.acceptance}
                </div> */}

              <DifficultyBadge level={problem.difficulty} />

              <ArrowRight className="h-4 w-4 text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
            </div>
            </div>
          )})}
    </div>

      </main >
    </div >
  );
}

// Helper Component for consistent styling
function DifficultyBadge({ level }: { level: string }) {
  const styles = {
    EASY: "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20",
    MEDIUM: "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20",
    HARD: "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20",
  };

  // @ts-ignore
  const currentStyle = styles[level] || styles.EASY;

  return (
    <Badge variant="outline" className={`${currentStyle} font-mono font-normal transition-colors`}>
      {level}
    </Badge>
  );
}