"use client";

import { User } from "@/features/auth/types";
import { useTheme } from "@/features/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Link as LinkIcon, Calendar, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  user: User;
  isOwner?: boolean;
}

export function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const { theme } = useTheme();

  if (theme === 'cyber') {
    return (
      <div className="border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8 mb-8 relative overflow-hidden group">
        {/* Cyber Decorative Elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-signal-green/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-signal-green/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-signal-green/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-signal-green/50" />
        <div className="absolute -right-12 -top-12 w-24 h-24 bg-signal-green/10 blur-3xl rounded-full" />

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          {/* Avatar Area */}
          <div className="relative shrink-0">
             <div className="w-24 h-24 md:w-32 md:h-32 border border-white/20 bg-black overflow-hidden relative">
                <Image 
                  src={user.avatar || "/placeholder-avatar.png"} 
                  alt={user.username}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
             </div>
             {user.isVerified && (
               <div className="absolute -bottom-2 -right-2 bg-black border border-signal-green text-signal-green p-1">
                 <ShieldCheck size={16} />
               </div>
             )}
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-white/20 px-2 py-0.5 text-[10px] font-mono text-gray-500 uppercase tracking-wider whitespace-nowrap">
                ID: {user.id}
             </div>
          </div>

          {/* Info Area */}
          <div className="flex-1 space-y-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-3xl md:text-5xl font-sans font-black text-white uppercase tracking-tighter flex items-center gap-2">
                     {user.displayName}
                   </h1>
                   <div className="font-mono text-signal-green text-sm flex items-center gap-2 mt-1">
                      <span>@{user.username}</span>
                      {user.isPro && <span className="bg-signal-green/20 text-signal-green px-1.5 py-0.5 text-[10px] border border-signal-green/30">PRO_OPERATOR</span>}
                   </div>
                </div>
                
                {isOwner && (
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Settings size={14} /> CONFIG_PROFILE
                  </Button>
                )}
             </div>

             <p className="font-mono text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed border-l-2 border-white/10 pl-4">
                {user.bio || "No description available for this unit."}
             </p>

             {/* Meta Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                {user.location && (
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <MapPin size={12} /> {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <LinkIcon size={12} /> 
                    <a href={user.website} target="_blank" className="hover:text-signal-green truncate">{user.website.replace('https://', '')}</a>
                  </div>
                )}
                {user.joinedAt && (
                   <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                     <Calendar size={12} /> JOINED {new Date(user.joinedAt).getFullYear()}
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic Theme
  return (
    <div className="mb-12">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-8">
         <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-sans font-black tracking-tight text-white mb-2">
              {user.displayName}
            </h1>
            <p className="font-sans text-lg text-gray-400 leading-relaxed">
              {user.bio}
            </p>
            
            <div className="flex flex-wrap gap-6 py-4 border-b border-noir-border">
               {user.stats && (
                 <>
                   <div className="font-mono text-sm">
                      <span className="text-white font-bold">{user.stats.following}</span> <span className="text-gray-500">Following</span>
                   </div>
                   <div className="font-mono text-sm">
                      <span className="text-white font-bold">{user.stats.followers}</span> <span className="text-gray-500">Followers</span>
                   </div>
                 </>
               )}
            </div>

            {isOwner ? (
               <button className="text-signal-green hover:underline text-sm font-mono uppercase">
                  Edit profile
               </button>
            ) : (
               <Button className="rounded-full px-6">Follow</Button>
            )}
         </div>
         
         <div className="shrink-0">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-noir-panel shadow-2xl relative">
                <Image 
                   src={user.avatar || "/placeholder-avatar.png"} 
                   alt={user.username}
                   fill
                   className="object-cover"
                />
             </div>
         </div>
      </div>
    </div>
  );
}
