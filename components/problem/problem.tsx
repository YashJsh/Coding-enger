"use client"
import { ChevronLeft } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { getProblemBySlug } from "@/lib/problems/queries"
import { Problem } from "@/lib/generated/prisma/client"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"

export const SpecificProblem = ({problem} : {problem : Problem})=>{
    const router = useRouter();
    
    const difficultyColors: Record<string, string> = {
        EASY: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        MEDIUM: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
        HARD: "text-red-500 bg-red-500/10 border-red-500/20",
    };
    
    return (
        <div className="w-1/2 flex flex-col border-r border-border/40 bg-background/50 backdrop-blur-sm">
            <div className="h-12 flex items-center px-4 border-b border-border/40 gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>{
                    router.push("/problems");
                }}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{problem?.title}</span>
                    <Badge variant="outline" className={`${difficultyColors[problem?.difficulty || "EASY"]} text-[10px] h-5`}>{problem?.difficulty}</Badge>
                </div>
            </div>

            <ScrollArea className="h-0 flex-1 p-6">
                <article className="prose prose-sm dark:prose-invert max-w-none 
                    prose-headings:font-semibold prose-headings:tracking-tight
                    prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                    prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-medium
                    prose-pre:bg-muted prose-pre:border prose-pre:border-border
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-li:marker:text-primary prose-li:text-muted-foreground
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
                ">
                    <ReactMarkdown>{problem?.statement}</ReactMarkdown>
                </article>  
            </ScrollArea>
        </div>
    )
}