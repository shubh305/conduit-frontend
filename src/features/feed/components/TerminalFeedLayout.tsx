"use client";

import { FeedItem } from "../types";
import { getMediaUrl, getPostUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { TerminalBlogShell } from "@/components/terminal/TerminalBlogShell";
import { TerminalDirectory, TerminalListItem } from "@/components/terminal/TerminalDirectory";

interface TerminalFeedLayoutProps {
  items: FeedItem[];
  blogDescription?: string;
  blogTitle?: string;
  currentTenantSlug?: string;
}

export function TerminalFeedLayout({ items, blogDescription, blogTitle, currentTenantSlug }: TerminalFeedLayoutProps) {
  const featured = items[0];
  const rest = items.slice(1);
  const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";

  const directoryItems: TerminalListItem[] = rest.map(item => ({
    id: item.postId,
    permissions: "-rwxr-xr-x",
    user: `root@${item.authorUsername || "user"}`,
    size: "4096",
    date: new Date(item.publishedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    name: item.title,
    link: getPostUrl(item, currentTenantSlug),
    extraInfo: item.tags?.join(", ") || "post",
  }));

  return (
    <TerminalBlogShell
      showSystemPanels={false}
      tenant={{
        name: blogTitle || "Conduit",
        slug: "conduit",
        description: blogDescription,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
        <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
          <div className="flex-none h-1/2 border border-accent p-4 relative overflow-hidden group">
            <div className="absolute top-2 left-4 text-[10px] bg-black px-2 z-10 border border-accent text-accent">
              ./Start_Engine.sh --featured
            </div>

            {featured && (
              <div className="h-full w-full flex flex-col justify-center pl-8 relative z-0">
                {featured.featuredImage && (
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 mix-blend-screen pointer-events-none">
                    <Image
                      src={getMediaUrl(featured.featuredImage) || "/images/placeholders/featured.jpg"}
                      className="w-full h-full object-cover grayscale opacity-50"
                      alt={featured.title}
                      fill
                      priority
                    />
                    <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-20" />
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter max-w-2xl mb-4 text-accent">
                  {featured.title}
                </h1>
                <p className="max-w-xl text-foreground-muted mb-6 line-clamp-2 text-sm">
                  {featured.excerpt || ">> No description provided for this transmission."}
                </p>

                <Link
                  href={getPostUrl(featured, currentTenantSlug)}
                  className="bg-accent text-black px-4 py-1 w-fit font-bold hover:bg-white transition-colors"
                >
                  [EXECUTE_READ]
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar border border-accent/20">
            <TerminalDirectory
              path="/var/log/blog_posts.log"
              command="tail -f"
              items={directoryItems}
              totalItems={rest.length}
              username="root"
            />
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-8">
          <div className="border border-accent p-4 relative font-mono text-xs">
            <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">neofetch</div>
            <div className="flex gap-4 mt-2">
              <div className="text-accent hidden xl:block">
                <pre className="leading-none text-[8px] sm:text-[10px]">
                  {`
       .---.
      /     \\
      | (_) |
      \\     /
       '---'
`}
                </pre>
              </div>
              <div className="space-y-1 text-foreground-muted">
                <div>
                  <span className="text-accent">OS:</span> ConduitOS v1.0
                </div>
                <div>
                  <span className="text-accent">Host:</span> {hostname}
                </div>
                <div>
                  <span className="text-accent">Kernel:</span> React 19.0.0
                </div>
                <div>
                  <span className="text-accent">Shell:</span> ZSH 5.9
                </div>
                <div>
                  <span className="text-accent">Theme:</span> TERMINAL (Phosphor)
                </div>
              </div>
            </div>
          </div>

          {/* Shortcuts Widget */}
          <div className="border border-accent p-4 relative font-mono text-xs h-fit">
            <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">man shortcuts</div>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between border-b border-accent/20 pb-1">
                <span className="text-foreground-muted">Navigation</span>
                <span className="text-accent">[TAB]</span>
              </div>
              <div className="flex justify-between border-b border-accent/20 pb-1">
                <span className="text-foreground-muted">Scroll</span>
                <span className="text-accent">[j] / [k]</span>
              </div>
              <div className="flex justify-between border-b border-accent/20 pb-1">
                <span className="text-foreground-muted">Search</span>
                <span className="text-accent">[/]</span>
              </div>
              <div className="flex justify-between border-b border-accent/20 pb-1">
                <span className="text-foreground-muted">Home</span>
                <span className="text-accent">[g] [g]</span>
              </div>
            </div>
          </div>

          {/* MOTD Widget */}
          <div className="border border-accent p-4 relative font-mono text-xs flex-none">
            <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">cat /etc/motd</div>
            <div className="mt-2 text-foreground-muted leading-relaxed">
              {">"} Welcome to the OctaneBrew Network.
              <br />
              {">"} Authorized personnel only.
              <br />
              {">"} All transmissions are monitored.
            </div>
            <div className="mt-6 border-t border-accent/30 pt-4">
              <div className="text-[10px] text-foreground-subtle mb-1">Last Login:</div>
              <div className="text-accent">{new Date().toDateString()} from 127.0.0.1</div>
            </div>
          </div>
        </div>
      </div>
    </TerminalBlogShell>
  );
}
