"use client"

import { Difficulty } from "@/lib/generated/prisma/enums";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation"
import { Badge } from "../ui/badge";


interface ProblemType{
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    tags: string[];
}

export const AllProblems = ({problems} : { problems : ProblemType[]})=>{
    const router = useRouter();
    return (
        <div className="space-y-3">
          {problems.map((problem, index) => {
            const number = String(index + 1).padStart(2, "0")
            return (
              <div
                key={problem.id}
                className="group relative flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/50 hover:bg-background/80 transition-all duration-300 cursor-pointer overflow-hidden
                "
                onClick={()=>{
                  router.push(`/problems/${problem.slug}`)
                }}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" 
                
                />

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
    )
}

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