"use client"

import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Send, 
  Settings, 
  ChevronLeft, 
  RotateCcw, 
  Maximize2,
  PanelBottom,
  CheckCircle2,
  Code2
} from "lucide-react";
import { useState } from "react";

export default function ProblemPage() {
  const [activeTab, setActiveTab] = useState("description");
  const [consoleOpen, setConsoleOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Navbar />
      
      {/* BACKGROUND (Subtler version for workspace focus) */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background">
         <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* WORKSPACE MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* --- LEFT PANEL: PROBLEM DESCRIPTION --- */}
        <div className="w-1/2 flex flex-col border-r border-border/40 bg-background/50 backdrop-blur-sm">
            {/* Header */}
            <div className="h-12 flex items-center px-4 border-b border-border/40 gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">1. Two Sum</span>
                    <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20 text-[10px] h-5">Easy</Badge>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-1 p-2 bg-muted/20">
                {['Description', 'Solutions', 'Submissions'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            activeTab === tab.toLowerCase() 
                            ? 'bg-background shadow-sm text-primary' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Scrollable Description Area */}
            <ScrollArea className="flex-1 p-6">
                <div className="prose prose-invert prose-sm max-w-none">
                    <h3 className="text-lg font-bold mb-4">Problem Description</h3>
                    <p className="text-muted-foreground mb-4">
                        Given an array of integers <code className="bg-muted px-1 py-0.5 rounded text-primary">nums</code> and an integer <code className="bg-muted px-1 py-0.5 rounded text-primary">target</code>, return indices of the two numbers such that they add up to <code className="bg-muted px-1 py-0.5 rounded text-primary">target</code>.
                    </p>
                    <p className="text-muted-foreground mb-6">
                        You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
                    </p>

                    <div className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Example 1</h4>
                            <div className="font-mono text-xs space-y-1">
                                <p><span className="text-blue-400">Input:</span> nums = [2,7,11,15], target = 9</p>
                                <p><span className="text-emerald-400">Output:</span> [0,1]</p>
                                <p className="text-muted-foreground">// Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>


        {/* --- RIGHT PANEL: CODE EDITOR --- */}
        <div className="w-1/2 flex flex-col relative bg-[#1e1e1e] border-l border-border/40">
            
            {/* Editor Toolbar */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-[#333] bg-[#1e1e1e]">
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-blue-400" />
                    <select className="bg-transparent text-xs font-medium text-gray-300 focus:outline-none cursor-pointer hover:text-white">
                        <option>JavaScript (Node.js)</option>
                        <option>Python 3</option>
                        <option>Rust</option>
                        <option>C++</option>
                    </select>
                </div>
                
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#333] text-gray-400">
                        <Settings className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#333] text-gray-400">
                        <RotateCcw className="h-4 w-4" />
                   </Button>
                </div>
            </div>

            {/* The Code Editor Area (Simulated) */}
            <div className="flex-1 relative font-mono text-sm group">
                {/* Line Numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end pr-3 pt-4 text-gray-600 select-none">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                </div>
                
                {/* Text Area */}
                <textarea 
                    className="w-full h-full bg-[#1e1e1e] text-gray-200 p-4 pl-16 outline-none resize-none font-mono leading-6"
                    spellCheck={false}
                    defaultValue={`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here...
    
};`}
                />

                {/* Floating Actions (Run/Submit) */}
                <div className="absolute bottom-6 right-6 flex gap-2 z-10">
                     <Button 
                        variant="secondary" 
                        className="bg-muted/80 backdrop-blur-md hover:bg-muted text-foreground border border-border/50 shadow-lg"
                        onClick={() => setConsoleOpen(!consoleOpen)}
                    >
                         <PanelBottom className="h-4 w-4 mr-2" />
                         Console
                     </Button>
                     <Button 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                     >
                         <Play className="h-4 w-4 mr-2 fill-current" />
                         Run
                     </Button>
                     <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                     >
                         <Send className="h-4 w-4 mr-2" />
                         Submit
                     </Button>
                </div>
            </div>

            {/* Collapsible Console Drawer */}
            {consoleOpen && (
                <div className="h-48 border-t border-[#333] bg-[#1e1e1e] animate-in slide-in-from-bottom-10 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526]">
                        <span className="text-xs font-medium text-gray-400">Test Results</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setConsoleOpen(false)}>
                            <Maximize2 className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="p-4 font-mono text-xs text-gray-300">
                        <div className="flex items-center gap-2 mb-2 text-emerald-500">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Accepted</span>
                        </div>
                        <div className="bg-[#2d2d2d] p-3 rounded border border-[#333]">
                            <span className="text-gray-500 select-none mr-3">Input:</span> nums = [2,7,11,15], target = 9 <br/>
                            <span className="text-gray-500 select-none mr-3">Output:</span> [0,1] <br/>
                            <span className="text-gray-500 select-none mr-3">Expected:</span> [0,1]
                        </div>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}