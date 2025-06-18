"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/features/studio/components/TiptapEditor";
import { toast } from "sonner";
import { useState, use } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { mockPosts } from "@/features/blog/data/mock-blogs";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock data fetch
  const post = mockPosts["alice"]?.find(p => p.id === id);
  const [title, setTitle] = useState(post?.title || "Untitled");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Changes saved");
    }, 1000);
  };

  if (!post) {
      return <div className="p-12 font-mono text-gray-500">POST NOT FOUND</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-noir-border">
        <div className="flex items-center gap-4">
          <Link href="/studio/posts" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="font-sans font-bold text-xl tracking-tight">EDIT TRANSMISSION</h1>
             <span className="font-mono text-xs text-gray-500 uppercase">{id}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save size={16} />
            {isSaving ? "SAVING..." : "UPDATE"}
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
          content={post.content}
          onChange={(content) => console.log(content)}
        />
      </div>
    </div>
  );
}
