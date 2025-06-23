import Link from "next/link";
import { Post } from "../types";


export function PostCard({ post, tenantSlug }: { post: Post; tenantSlug: string }) {
  return (
    <Link 
      href={`/${tenantSlug}/${post.slug}`}
      className="group block py-12 border-b border-noir-border hover:bg-noir-panel transition-colors -mx-4 px-4"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase">
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span>{post.readingTimeMinutes} min read</span>
          </div>
          
          <h2 className="text-3xl font-sans font-bold leading-tight group-hover:text-white group-hover:underline decoration-1 underline-offset-4 decoration-gray-500">
            {post.title}
          </h2>
          
          <p className="font-mono text-gray-400 leading-relaxed text-sm md:text-base max-w-3xl">
            {post.excerpt}
          </p>
          
          <div className="flex gap-2 pt-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-mono text-signal-red">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        {post.featuredImage && (
          <div className="w-full md:w-64 aspect-[4/3] bg-noir-bg shrink-0 overflow-hidden border border-noir-border grayscale group-hover:grayscale-0 transition-all duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
