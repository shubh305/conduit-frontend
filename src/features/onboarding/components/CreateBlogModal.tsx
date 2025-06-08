"use client";

import { Button } from "@/components/ui/button";
import { X, Check, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { UserBlog } from "./OnboardingLanding";
import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";

interface CreateBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (blog: UserBlog) => void;
}

export function CreateBlogModal({ isOpen, onClose, onCreate }: CreateBlogModalProps) {
    const { theme } = useTheme();
    const [name, setName] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        
        if (!subdomain || subdomain === name.toLowerCase().replace(/[^a-z0-9]/g, '')) {
             setSubdomain(newName.toLowerCase().replace(/[^a-z0-9]/g, ''));
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!subdomain) {
                setIsSubdomainAvailable(null);
            } else {
                setIsSubdomainAvailable(subdomain.length > 3); // Simple mock rule
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [subdomain]);

    const handleSubmit = () => {
        const newBlog: UserBlog = {
            id: `blog-${Date.now()}`,
            name,
            subdomain,
            logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${subdomain}`,
            postsCount: 0
        };
        onCreate(newBlog);
        onClose();
    };

    if (!isOpen) return null;

    const isNoir = theme === 'classic';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={cn(
                "w-full max-w-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                isNoir 
                    ? "bg-[#121212] border border-white/20" 
                    : "bg-[#050505] border border-white/10 rounded-2xl shadow-2xl"
            )}>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <h2 className={cn(
                        "text-2xl font-bold text-white mb-8",
                        isNoir ? "font-mono uppercase tracking-tight" : "font-sans"
                    )}>
                        Create new blog
                    </h2>

                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Form Side */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <label className={cn(
                                    "block text-sm font-medium text-gray-400 mb-2",
                                    isNoir ? "font-mono uppercase tracking-wider text-xs" : ""
                                )}>Blog name</label>
                                <input 
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="E.G. SHUBHAM'S DEN"
                                    className={cn(
                                        "w-full bg-transparent outline-none transition-colors",
                                        isNoir 
                                            ? "border-b border-white/20 h-10 text-white font-mono placeholder:text-gray-700 focus:border-white rounded-none"
                                            : "bg-white/5 border border-white/10 rounded-lg h-12 px-4 text-lg focus:border-signal-green text-white placeholder:text-gray-600"
                                    )}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className={cn(
                                    "block text-sm font-medium text-gray-400 mb-2",
                                    isNoir ? "font-mono uppercase tracking-wider text-xs" : ""
                                )}>Blog URL</label>
                                <p className={cn(
                                    "text-xs text-gray-500 mb-3",
                                    isNoir ? "font-mono" : ""
                                )}>You can map a custom domain later.</p>
                                
                                <div className={cn(
                                    "flex items-center overflow-hidden transition-colors",
                                    isNoir 
                                        ? "border-b border-white/20 h-10 rounded-none focus-within:border-white"
                                        : "bg-white/5 border border-white/10 rounded-lg h-12 px-3 focus-within:border-signal-green",
                                    isSubdomainAvailable === true && !isNoir && "border-emerald-500/50"
                                )}>
                                    <input 
                                        value={subdomain}
                                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className={cn(
                                            "bg-transparent border-none text-white w-full focus:ring-0 placeholder:text-gray-700 outline-none font-mono",
                                            isNoir ? "placeholder:text-gray-700" : "placeholder:text-gray-600"
                                        )}
                                        placeholder="subdomain"
                                    />
                                    <span className={cn(
                                        "text-gray-500 font-mono text-sm whitespace-nowrap",
                                        isNoir ? "" : "border-l border-white/10 pl-3 ml-2"
                                    )}>
                                        .octanebrew.dev
                                    </span>
                                    {isSubdomainAvailable === true && (
                                        <div className={cn(
                                            "ml-3 flex-shrink-0",
                                            isNoir ? "text-white" : "text-emerald-500"
                                        )}>
                                            <Check size={18} />
                                        </div>
                                    )}
                                </div>
                                {isSubdomainAvailable === true && (
                                    <p className={cn(
                                        "text-sm mt-2 font-mono",
                                        isNoir ? "text-gray-400" : "text-emerald-500"
                                    )}>{
                                        isNoir ? ">> SUBDOMAIN AVAILABLE" : "Congrats, subdomain is available"
                                    }</p>
                                )}
                            </div>
                        </div>

                        {/* Visual Side */}
                        <div className="w-full md:w-48 flex flex-col items-center">
                            <div className={cn(
                                "w-32 h-32 flex items-center justify-center mb-4 group cursor-pointer transition-all relative overflow-hidden",
                                isNoir 
                                    ? "bg-white/5 border border-dashed border-white/20 hover:border-white rounded-none"
                                    : "bg-white/5 border border-white/10 rounded-full hover:border-white/30"
                            )}>
                                {name ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${subdomain || 'temp'}`} alt="Preview" className="w-full h-full opacity-50 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <ImageIcon className="text-gray-600" size={32} />
                                )}
                                <div className={cn(
                                    "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono uppercase",
                                    isNoir ? "bg-black/80 text-white" : "bg-black/50 text-white"
                                )}>
                                    Change
                                </div>
                            </div>
                            <div className="text-center">
                                <p className={cn(
                                    "text-white font-medium mb-1",
                                    isNoir ? "font-mono uppercase text-xs tracking-wider" : ""
                                )}>Logo</p>
                                <p className={cn(
                                    "text-xs text-gray-500",
                                    isNoir ? "font-mono" : ""
                                )}>Recommended size 500x500px</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cn(
                    "p-6 flex justify-end gap-3",
                    isNoir 
                        ? "border-t border-white/10 bg-[#121212]" 
                        : "border-t border-white/5 bg-white/5"
                )}>
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        className={cn(
                            "hover:text-white hover:bg-white/5",
                            isNoir ? "text-gray-400 font-mono uppercase tracking-wider rounded-none" : "text-gray-400"
                        )}
                        >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!name || !subdomain || !isSubdomainAvailable}
                        className={cn(
                            "transition-colors",
                            isNoir 
                                ? "bg-white text-black hover:bg-gray-200 rounded-none font-mono uppercase font-bold tracking-widest px-8"
                                : "bg-signal-green/10 text-signal-green border border-signal-green hover:bg-signal-green/20 rounded-lg px-8 font-mono uppercase tracking-widest"
                        )}
                    >
                        Create
                    </Button>
                </div>
            </div>
        </div>
    );
}
