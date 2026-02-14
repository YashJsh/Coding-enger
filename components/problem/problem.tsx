import { ChevronLeft } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { getProblemBySlug } from "@/lib/problems/queries"
import { Problem } from "@/lib/generated/prisma/client"

export const SpecificProblem = ({problem} : {problem : Problem})=>{
    return (
        <div className="w-1/2 flex flex-col border-r border-border/40 bg-background/50 backdrop-blur-sm">
            <div className="h-12 flex items-center px-4 border-b border-border/40 gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">1. {problem?.title}</span>
                    <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20 text-[10px] h-5">{problem?.difficulty}</Badge>
                </div>
            </div>

            <ScrollArea className="flex-1 p-6">
                <div className="prose dark:prose-invert prose-sm max-w-none">
                    <h3 className="text-lg font-bold mb-4">Problem Description</h3>
                    <p className="text-muted-foreground mb-4">
                       {problem?.statement}
                    </p>
                </div>
            </ScrollArea>
        </div>
    )
}