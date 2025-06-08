"use client";


import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronDown, ChevronUp, FileText, Layout, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateBlogModal } from "./CreateBlogModal";

// Mock Blog Data Type
export interface UserBlog {
    id: string;
    name: string;
    subdomain: string;
    logo?: string;
    postsCount: number;
}

// Mock Data
const mockBlogs: UserBlog[] = [
    {
        id: "blog-1",
        name: "Shubham's Den",
        subdomain: "shubh305",
        logo: "https://api.dicebear.com/7.x/identicon/svg?seed=shubh305",
        postsCount: 12
    },
    {
        id: "blog-2",
        name: "Test Blog",
        subdomain: "testblog",
        logo: "https://api.dicebear.com/7.x/identicon/svg?seed=testblog",
        postsCount: 3
    }
];

export function OnboardingLanding() {
  const { theme } = useTheme();
  const [isBlogsOpen, setIsBlogsOpen] = useState(true);
  const [blogs, setBlogs] = useState<UserBlog[]>(mockBlogs);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const isNoir = theme === 'classic';

  return (
    <div className={cn(
        "min-h-screen p-6 md:p-16 transition-colors",
        isNoir ? "bg-[#121212] text-white font-sans" : "bg-[#050505] text-gray-300 font-mono"
    )}>
      {/* Background Grid for Cyber */}
      {!isNoir && (
          <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'linear-gradient(#00ff9d 1px, transparent 1px), linear-gradient(90deg, #00ff9d 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h1 className={cn(
                "text-3xl md:text-5xl font-bold max-w-2xl leading-tight",
                isNoir ? "font-serif tracking-tight" : "uppercase tracking-widest text-signal-green"
            )}>
                Build your community
            </h1>
            
            {/* New Blog Button (Action Card) */}
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className={cn(
                    "group flex items-center gap-3 transition-all shrink-0",
                    isNoir 
                        ? "bg-[#111] border border-white/10 hover:border-white/20 rounded-full p-1.5 pr-5"
                        : "border border-signal-green/30 hover:border-signal-green bg-signal-green/5 hover:bg-signal-green/10 rounded-none p-1 pr-6"
                )}
            >
                <div className={cn(
                    "flex items-center justify-center transition-colors",
                    isNoir
                        ? "w-8 h-8 bg-emerald-900/30 text-emerald-500 rounded-full"
                        : "w-12 h-12 bg-signal-green/20 text-signal-green rounded-none"
                )}>
                    <Layout size={isNoir ? 16 : 20} />
                </div>
                <div className="text-left">
                     <span className={cn(
                         "font-bold block",
                         isNoir ? "text-emerald-500 text-sm" : "text-signal-green uppercase tracking-wider text-sm"
                     )}>New blog</span>
                </div>
            </button>
        </header>

        {/* Your Blogs Section */}
        <section className="mt-12">
            <div 
                className="flex items-center justify-between cursor-pointer mb-6 select-none"
                onClick={() => setIsBlogsOpen(!isBlogsOpen)}
            >
                <h2 className={cn(
                    "font-medium tracking-wide",
                    isNoir ? "text-gray-400 text-sm" : "text-gray-500 uppercase tracking-widest text-xs"
                )}>
                    {isNoir ? "Your blogs" : "YOUR BLOGS"}
                </h2>
                <div className={cn(
                    "flex items-center gap-2 text-xs transition-colors px-3 py-1",
                    isNoir 
                        ? "text-gray-600 bg-[#1A1A1A] rounded-full hover:text-gray-400"
                        : "text-signal-green bg-signal-green/10 rounded-none" 
                )}>
                    {isBlogsOpen ? 'Collapse section' : 'Expand section'}
                    {isBlogsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </div>
            </div>

            {isBlogsOpen && (
                <div className="grid gap-6">
                    {blogs.length === 0 ? (
                         <div className={cn(
                             "border border-dashed p-12 flex flex-col items-center justify-center text-center",
                             isNoir ? "border-white/10 rounded-2xl bg-[#0A0A0A]" : "border-white/10 rounded-none bg-black"
                         )}>
                            <div className={cn("w-16 h-16 mb-4 animate-pulse bg-white/5", isNoir ? "rounded-xl" : "rounded-none")} />
                            <p className="text-gray-500">No blog created yet. Start by creating a blog.</p>
                         </div>
                    ) : (
                        blogs.map(blog => (
                            <div key={blog.id} className={cn(
                                "border p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all group",
                                isNoir 
                                    ? "bg-[#0A0A0A] border-[#1A1A1A] hover:border-[#333] rounded-2xl" 
                                    : "bg-black border-white/10 hover:border-signal-green/50 rounded-none"
                            )}>
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "w-14 h-14 overflow-hidden border shrink-0",
                                        isNoir ? "rounded-xl border-white/5 bg-[#141414]" : "rounded-none border-signal-green/20 bg-signal-green/5"
                                    )}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={blog.logo} alt={blog.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "text-lg font-bold mb-1", 
                                            isNoir ? "text-gray-100 font-sans tracking-tight" : "text-gray-200 font-mono uppercase"
                                        )}>{blog.name}</h3>
                                        <div className={cn(
                                            "text-sm",
                                            isNoir ? "text-emerald-500 font-medium" : "text-signal-green font-mono"
                                        )}>
                                            {blog.subdomain}.conduit.dev
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Link href="/studio/editor" className="flex-1 md:flex-none">
                                        <Button variant="secondary" className={cn(
                                            "flex items-center justify-center gap-2 h-10 px-6 w-full md:w-auto",
                                            isNoir 
                                                ? "bg-[#141414] hover:bg-[#1F1F1F] border border-[#333] text-gray-300 hover:text-white rounded-md font-mono text-xs uppercase tracking-wider" 
                                                : "bg-white/5 hover:bg-signal-green/10 hover:text-signal-green border border-white/10 hover:border-signal-green rounded-none text-gray-400 font-mono text-xs uppercase tracking-wider"
                                        )}>
                                            <FileText size={14} className="opacity-70" />
                                            Editor
                                        </Button>
                                    </Link>
                                    <Link href="/studio" className="flex-1 md:flex-none">
                                        <Button variant="secondary" className={cn(
                                            "flex items-center justify-center gap-2 h-10 px-6 w-full md:w-auto",
                                            isNoir 
                                                ? "bg-[#141414] hover:bg-[#1F1F1F] border border-[#333] text-gray-300 hover:text-white rounded-md font-mono text-xs uppercase tracking-wider" 
                                                : "bg-white/5 hover:bg-signal-green/10 hover:text-signal-green border border-white/10 hover:border-signal-green rounded-none text-gray-400 font-mono text-xs uppercase tracking-wider"
                                        )}>
                                            <Settings size={14} className="opacity-70" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                     <a 
                                        href={`http://${blog.subdomain}.conduit.dev`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={cn(
                                         "h-10 w-10 flex items-center justify-center transition-colors",
                                         isNoir 
                                            ? "hover:bg-[#1F1F1F] rounded-md border border-transparent hover:border-[#333] text-gray-500 hover:text-white" 
                                            : "hover:bg-sidebar-accent/10 hover:text-signal-green rounded-none text-gray-500"
                                     )}>
                                        <ArrowUpRight size={18} />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </section>

      </div>
      
      <CreateBlogModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={(newBlog: UserBlog) => setBlogs([...blogs, newBlog])}
      />
    </div>
  );
}
