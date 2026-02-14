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
    Code2,
    XCircle,
    Clock,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { SpecificProblem } from "@/components/problem/problem";
import { Problem } from "@/lib/validations/problem";
import { submitCode, getSubmissionStatus, SubmissionStatus, TestResults } from "@/lib/problems/api";

export const ProblemClient = ({ problem }: { problem: Problem }) => {
    const [activeTab, setActiveTab] = useState("description");
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<SubmissionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editorTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'light';
    if (!mounted) return null;

    const handleSubmit = async () => {
        if (!code.trim()) {
            setError("Code cannot be empty");
            return;
        }

        setError(null);
        setIsSubmitting(true);
        setSubmissionResult(null);

        try {
            const result = await submitCode(code, problem.slug, language as "javascript" | "python");
            console.log("Submission result:", result);

            const pollStatus = async () => {
                let status: SubmissionStatus;
                let attempts = 0;
                const maxAttempts = 20;

                do {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    status = await getSubmissionStatus(result.submissionId);
                    attempts++;
                } while (status.status === "PENDING" && attempts < maxAttempts);

                setSubmissionResult(status);
                setConsoleOpen(true);
                setIsSubmitting(false);
            };

            pollStatus();
            
        } catch (err: any) {
            setError(err.message || "Failed to submit code");
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "TIME_LIMIT":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "RUNTIME_ERROR":
            case "WRONG_ANSWER":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return "Accepted";
            case "TIME_LIMIT":
                return "Time Limit Exceeded";
            case "RUNTIME_ERROR":
                return "Runtime Error";
            case "WRONG_ANSWER":
                return "Wrong Answer";
            case "PENDING":
                return "Processing...";
            default:
                return status;
        }
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4 mr-2" />
                                )}
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </div>

                    {/* Console Drawer */}
                    {(consoleOpen || submissionResult) && (
                        <div className="h-64 border-t border-border/40 bg-muted/30 backdrop-blur animate-in slide-in-from-bottom-10 flex flex-col z-20 absolute bottom-0 w-full">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/40">
                                <span className="text-xs font-medium text-muted-foreground">Test Results</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setConsoleOpen(false); setSubmissionResult(null); }}>
                                    <Maximize2 className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="p-4 font-mono text-xs flex-1 overflow-auto">
                                {error && (
                                    <div className="flex items-center gap-2 mb-2 text-red-500">
                                        <XCircle className="h-4 w-4" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {submissionResult && (
                                    <>
                                        <div className="flex items-center gap-2 mb-3">
                                            {getStatusIcon(submissionResult.status)}
                                            <span className={
                                                submissionResult.status === "ACCEPTED" ? "text-emerald-500" :
                                                submissionResult.status === "TIME_LIMIT" ? "text-yellow-500" :
                                                "text-red-500"
                                            }>
                                                {getStatusText(submissionResult.status)}
                                            </span>
                                            {submissionResult.testResults && (
                                                <span className="text-muted-foreground ml-2">
                                                    ({submissionResult.testResults.passed}/{submissionResult.testResults.total} test cases passed)
                                                </span>
                                            )}
                                        </div>
                                        
                                        {submissionResult.testResults && submissionResult.testResults.results.length > 0 && (
                                            <div className="space-y-3">
                                                {submissionResult.testResults.results.map((result, index) => (
                                                    <div key={index} className={`p-2 rounded border ${
                                                        result.passed ? "border-emerald-500/30 bg-emerald-500/10" : 
                                                        result.isSample ? "border-red-500/30 bg-red-500/10" : 
                                                        "border-yellow-500/30 bg-yellow-500/10"
                                                    }`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {result.passed ? (
                                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                            ) : (
                                                                <XCircle className={`h-3 w-3 ${result.isSample ? "text-red-500" : "text-yellow-500"}`} />
                                                            )}
                                                            <span className={`text-xs ${
                                                                result.passed ? "text-emerald-500" :
                                                                result.isSample ? "text-red-500" : 
                                                                "text-yellow-500"
                                                            }`}>
                                                                Test Case {index + 1} {result.isSample && "(Sample)"}
                                                            </span>
                                                        </div>
                                                        
                                                        {result.error ? (
                                                            <div className="text-red-400 text-xs mt-1">
                                                                {result.error}
                                                            </div>
                                                        ) : result.isSample ? (
                                                            <>
                                                                <div className="text-muted-foreground">
                                                                    <span className="select-none">Input: </span>
                                                                    {result.input}
                                                                </div>
                                                                <div className="text-muted-foreground">
                                                                    <span className="select-none">Expected: </span>
                                                                    {result.expectedOutput}
                                                                </div>
                                                                <div className={result.passed ? "text-emerald-400" : "text-red-400"}>
                                                                    <span className="select-none">Output: </span>
                                                                    {result.actualOutput}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-muted-foreground text-xs">
                                                                {result.passed ? "Passed" : "Failed"}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                                {!submissionResult && !error && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Waiting for results...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}