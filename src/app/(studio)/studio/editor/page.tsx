"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TiptapEditor } from "@/features/studio/components/TiptapEditor";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";
import { ArticlePageWrapper } from "@/features/blog/components/ArticlePageWrapper";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";

export default function EditorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<TiptapContent>({ type: 'doc', content: [] }); 
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // New Preview State

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Draft saved successfully");
    }, 1000);
  };

  // Mock Post Data for Preview
  const mockPreviewPost: FeedItem & { content: TiptapContent; readingTimeMinutes: number } = {
    tenantId: "current-tenant",
    tenantSlug: "my-blog",
    tenantName: "My Blog",
    postId: "preview-id",
    postSlug: "preview-slug",
    title: title || "Untitled Draft",
    content: content,
    excerpt: "This is a preview of your post content...",
    featuredImage: undefined,
    tags: ["preview", "draft"],
    authorName: "You (Preview)",
    publishedAt: new Date().toISOString(),
    viewsCount: 0,
    likesCount: 0,
    commentsCount: 0,
    readingTimeMinutes: 5,
  };

  const mockTenant = {
    id: "current-tenant",
    name: "My Blog",
    slug: "my-blog",
  };

  if (isPreviewOpen) {
    return (
       <div className="relative">
          {/* Close Preview Action Bar */}
          <div className="fixed top-24 right-96 z-[60] flex gap-4">
             <Button onClick={() => setIsPreviewOpen(false)} variant="secondary" className="shadow-lg border border-white/20">
                CLOSE PREVIEW <X size={16} className="ml-2" />
             </Button>
          </div>

          <ArticlePageWrapper post={mockPreviewPost} tenant={mockTenant} />
       </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-noir-border">
        <div className="flex items-center gap-4">
          <Link href="/studio" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="font-sans font-bold text-xl tracking-tight">NEW TRANSMISSION</h1>
             <span className="font-mono text-xs text-gray-500 uppercase">Saving to drafts...</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setIsPreviewOpen(true)}>
             PREVIEW
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save size={16} />
            {isSaving ? "SAVING..." : "PUBLISH"}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <Input 
          placeholder="ENTER TITLE..." 
          className="text-4xl font-sans font-bold bg-transparent border-none px-0 h-auto placeholder:text-gray-700 focus:ring-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <TiptapEditor 
          className="flex-1 min-h-0 border-none bg-transparent" 
          content={content}
          onChange={(newContent) => setContent(newContent)}
        />
      </div>
    </div>
  );
}
