"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Check, User, Bell, Shield, Palette } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { mockUser } from "@/features/auth/data/mock-user";

type SettingsTab = 'profile' | 'account' | 'appearance' | 'notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  const tabs = [
      { id: 'profile', label: 'Public Profile', icon: User },
      { id: 'account', label: 'Account', icon: Shield },
      { id: 'appearance', label: 'Appearance', icon: Palette },
      { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div className="max-w-6xl">
       <header className="pb-8 mb-8 border-b border-white/10">
         <h1 className="text-3xl font-sans font-bold tracking-tight mb-2">SETTINGS</h1>
         <p className="font-mono text-sm text-gray-500">
           {`// USER.CONFIGURATION_MATRIX`}
         </p>
       </header>

       <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0">
             <nav className="flex flex-col space-y-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wide transition-all border-l-2 text-left",
                            activeTab === tab.id
                                ? (theme === 'cyber' ? "bg-white/5 border-signal-green text-white" : "bg-[#1A1A1A] border-white text-white")
                                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
             </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 max-w-2xl">
             <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-500">
                
                {/* PROFILE SECTION */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Public Profile</h2>
                            <p className="text-sm text-gray-500 font-mono">Manage how others see you on Conduit.</p>
                        </div>
                        
                        <div className="space-y-4">
                             <div className="flex items-center gap-6">
                                 <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border border-white/20">
                                     <span className="text-2xl font-bold">{mockUser.username[0].toUpperCase()}</span>
                                 </div>
                                 <Button type="button" variant="secondary" size="sm">CHANGE AVATAR</Button>
                             </div>

                             <div className="space-y-2">
                                <label className="font-mono text-xs text-gray-500 uppercase">Display Name</label>
                                <Input defaultValue={mockUser.displayName} className="bg-transparent" />
                             </div>

                             <div className="space-y-2">
                                <label className="font-mono text-xs text-gray-500 uppercase">Bio</label>
                                <textarea 
                                    className="flex w-full min-h-[100px] border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
                                    defaultValue={mockUser.bio}
                                />
                             </div>
                        </div>
                    </div>
                )}

                {/* APPEARANCE SECTION */}
                {activeTab === 'appearance' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Appearance</h2>
                            <p className="text-sm text-gray-500 font-mono">Customize your visual interface.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="font-mono text-xs text-gray-500 uppercase block">Interface Theme</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setTheme("cyber")}
                                    className={cn(
                                    "p-6 border text-left transition-all relative group",
                                    theme === "cyber" 
                                        ? "bg-[#050505] border-signal-green text-white ring-1 ring-signal-green/20" 
                                        : "bg-black border-white/10 text-gray-400 hover:border-white/30"
                                    )}
                                >
                                    <div className="font-mono text-xs text-signal-green mb-2 opacity-80">System.Theme_01</div>
                                    <div className="font-sans font-black text-lg mb-2">CYBER</div>
                                    <div className="font-mono text-xs opacity-60 leading-relaxed">
                                        High contrast. Digital artefacts. Neon accents. Optimized for low-light environments.
                                    </div>
                                    {theme === "cyber" && <Check size={18} className="absolute top-4 right-4 text-signal-green" />}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setTheme("classic")}
                                    className={cn(
                                    "p-6 border text-left transition-all relative group",
                                    theme === "classic" 
                                        ? "bg-[#1A1A1A] border-white text-white ring-1 ring-white/20" 
                                        : "bg-[#121212] border-white/10 text-gray-400 hover:border-white/30"
                                    )}
                                >
                                    <div className="font-serif italic text-xs text-white mb-2 opacity-80">The Classic Collection</div>
                                    <div className="font-sans font-black text-lg mb-2">NOIR</div>
                                    <div className="font-mono text-xs opacity-60 leading-relaxed">
                                        Premium dark mode. Clean typography. Minimalist layout for reading focus.
                                    </div>
                                    {theme === "classic" && <Check size={18} className="absolute top-4 right-4 text-white" />}
                                </button>
                             </div>
                        </div>
                    </div>
                )}

                {/* ACCOUNT SECTION (Stub) */}
                {activeTab === 'account' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Account Security</h2>
                            <p className="text-sm text-gray-500 font-mono">Update login credentials.</p>
                        </div>
                        <div className="space-y-4 opacity-50 pointer-events-none">
                             <div className="space-y-2">
                                <label className="font-mono text-xs text-gray-500 uppercase">Email</label>
                                <Input defaultValue={mockUser.email} disabled />
                             </div>
                             <div className="p-4 border border-white/10 bg-white/5 text-sm font-mono text-gray-400">
                                 [SECURITY MODULE LOCKED]
                             </div>
                        </div>
                    </div>
                )}
                 
                {/* NOTIFICATIONS SECTION (Stub) */}
                 {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <div>
                             <h2 className="text-xl font-bold mb-1">Notifications</h2>
                             <p className="text-sm text-gray-500 font-mono">Manage signal reception.</p>
                        </div>
                        <div className="space-y-4">
                             {['Email Digest', 'New Followers', 'Mentions', 'Product Updates'].map(item => (
                                 <div key={item} className="flex items-center justify-between p-4 border border-white/10 bg-white/5">
                                     <span className="font-mono text-sm">{item}</span>
                                     <div className="w-8 h-4 bg-gray-700 rounded-full relative cursor-not-allowed">
                                         <div className="w-4 h-4 bg-gray-500 rounded-full absolute left-0" />
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                 )}

                <div className="pt-8 border-t border-white/10 flex justify-end">
                    <Button type="submit" disabled={isSaving} className="gap-2 min-w-[200px]">
                        <Save size={16} />
                        {isSaving ? "SAVING..." : "SAVE CHANGES"}
                    </Button>
                </div>
             </form>
          </div>
       </div>
    </div>
  );
}
