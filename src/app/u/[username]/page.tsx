"use client";

import { useParams } from "next/navigation";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileFeed } from "@/features/profile/components/ProfileFeed";
import { mockUser, mockRecommendedUsers } from "@/features/auth/data/mock-user";
import { mockFeedItems } from "@/features/feed/data/mock-feed";
import { useMemo } from "react";
import { useTheme } from "@/features/theme/ThemeProvider";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { theme } = useTheme();

  // 1. Fetch User (Mock)
  const user = useMemo(() => {
     if (mockUser.username === username) return mockUser;
     return mockRecommendedUsers.find(u => u.username === username) || null;
  }, [username]);
  
  const displayUser = user || {
    ...mockUser,
    username: username,
    displayName: username.toUpperCase(), 
    bio: "User profile simulation. This is a generated placeholder."
  };

  // 2. Fetch User's Posts (Mock)
  const userPosts = useMemo(() => {
     return mockFeedItems.filter(item => item.tenantSlug === username);
  }, [username]);

  return (
    <div className="w-full">
          {theme === 'cyber' ? (
             // Cyber Layout
             <>
               <ProfileHeader user={displayUser} isOwner={true} />
               <ProfileFeed posts={userPosts} />
             </>
          ) : (
             // Classic Layout
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                   <div className="md:hidden">
                       <ProfileHeader user={displayUser} isOwner={true} />
                   </div>
                   <div className="hidden md:block mb-8">
                       <h2 className="text-4xl font-sans font-black mb-4 uppercase text-white">{displayUser.displayName}</h2>
                   </div>
                   <ProfileFeed posts={userPosts} />
                </div>
                <div className="hidden lg:block lg:col-span-4 pl-0 md:pl-6 border-l border-white/10">
                   <div className="sticky top-24">
                       <ProfileHeader user={displayUser} isOwner={true} />
                       
                       <div className="mt-8 space-y-4">
                          <h3 className="font-mono text-xs uppercase text-gray-500">Following</h3>
                          <div className="flex gap-2">
                             {[1,2,3].map(i => (
                                 <div key={i} className="w-8 h-8 rounded bg-gray-800" />
                             ))}
                          </div>
                       </div>
                   </div>
                </div>
             </div>
          )}
    </div>
  );
}
