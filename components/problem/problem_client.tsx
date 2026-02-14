"use client"

import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Play,
    Send,
    Settings,
    RotateCcw,
    Maximize2,
    PanelBottom,
    CheckCircle2,
    Code2
} from "lucide-react";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes"; // 1. Import useTheme hook
import { SpecificProblem } from "@/components/problem/problem";
import { Problem } from "@/lib/validations/problem";
import { submitCode } from "@/lib/problems/queries";

export const ProblemClient = ({ problem }: { problem: Problem }) => {
    const [activeTab, setActiveTab] = useState("description");
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");

    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editorTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'light';
    if (!mounted) return null;

    const handleSubmit = async () => {
        const result = await submitCode(code, problem.slug, language as "javascript" | "python");
        console.log("Submission result:", result);
    };

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <Navbar />

            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background">
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            <div className="flex-1 flex overflow-hidden">

                {/* --- LEFT PANEL --- */}
                <SpecificProblem problem={problem} />


                {/* --- RIGHT PANEL: CODE EDITOR --- */}
                {/* Changed static bg-[#1e1e1e] to dynamic 'bg-muted/20' or 'bg-zinc-950' for dark mode */}
                <div className="w-1/2 flex flex-col relative border-l border-border/40 bg-background">

                    {/* Editor Toolbar - Made dynamic */}
                    <div className="h-12 flex items-center justify-between px-4 border-b border-border/40 bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-primary" />
                            {/* Fixed onSelect to onChange for standard <select> */}
                            <select
                                className="bg-transparent text-xs font-medium text-muted-foreground focus:outline-none cursor-pointer hover:text-foreground"
                                onChange={(e) => setLanguage(e.target.value)}
                                value={language}
                            >
                                <option value="javascript">JavaScript (Node.js)</option>
                                <option value="python">Python 3</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative overflow-visible">
                        <Editor
                            height="100%"
                            language={language}
                            theme={editorTheme}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                readOnly: false,
                                automaticLayout: true,
                                fontFamily: "monospace",
                                padding: { top: 16 }
                            }}
                        />

                        {/* Floating Actions */}
                        <div className="absolute bottom-6 right-6 flex gap-2 z-50">
                            <Button
                                variant="secondary"
                                className="bg-background/80 backdrop-blur-md border border-border/50 shadow-sm"
                                onClick={() => setConsoleOpen(!consoleOpen)}
                            >
                                <PanelBottom className="h-4 w-4 mr-2" />
                                Console
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <Play className="h-4 w-4 mr-2 fill-current" />
                                Run
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleSubmit}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Submit
                            </Button>
                        </div>
                    </div>

                    {/* Console Drawer */}
                    {consoleOpen && (
                        <div className="h-48 border-t border-border/40 bg-muted/30 backdrop-blur animate-in slide-in-from-bottom-10 flex flex-col z-20 absolute bottom-0 w-full">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/40">
                                <span className="text-xs font-medium text-muted-foreground">Test Results</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setConsoleOpen(false)}>
                                    <Maximize2 className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="p-4 font-mono text-xs">
                                <div className="flex items-center gap-2 mb-2 text-emerald-500">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Accepted</span>
                                </div>
                                <div className="bg-background p-3 rounded border border-border/50">
                                    <span className="text-muted-foreground select-none mr-3">Input:</span> nums = [2,7,11,15], target = 9 <br />
                                    <span className="text-muted-foreground select-none mr-3">Output:</span> [0,1] <br />
                                    <span className="text-muted-foreground select-none mr-3">Expected:</span> [0,1]
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}