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
      <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-none">
          <div className="lg:col-span-8 border border-accent p-6 relative overflow-hidden group min-h-[400px]">
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

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-accent p-4 relative font-mono text-xs bg-black/50">
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
                    <span className="text-accent">Kernel:</span> React 19.x
                  </div>
                  <div>
                    <span className="text-accent">Shell:</span> ZSH 5.9
                  </div>
                  <div>
                    <span className="text-accent">Theme:</span> PHOSPHOR
                  </div>
                </div>
              </div>
            </div>

            {/* Shortcuts Widget */}
            <div className="border border-accent p-4 relative font-mono text-xs h-fit bg-black/50">
              <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">man shortcuts</div>
              <div className="space-y-2 mt-2">
                {[
                  { label: "Navigation", key: "[TAB]" },
                  { label: "Scroll", key: "[j] / [k]" },
                  { label: "Search", key: "[/]" },
                  { label: "Home", key: "[g] [g]" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between border-b border-accent/20 pb-1">
                    <span className="text-foreground-muted">{item.label}</span>
                    <span className="text-accent">{item.key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* cat /etc/motd */}
            <div className="border border-accent p-4 relative font-mono text-xs bg-black/50 flex-1">
              <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">cat /etc/motd</div>
              <div className="mt-2 text-foreground-muted leading-relaxed">
                {">"} Welcome to the OctaneBrew Network.
                <br />
                {">"} Authorized personnel only.
                <br />
                {">"} All transmissions are monitored.
              </div>
              <div className="mt-4 pt-4 border-t border-accent/30 text-[10px] text-accent/50 text-right">
                {new Date().toDateString()} @ 127.0.0.1
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-none border border-accent/20 bg-black/30 p-2 md:p-4 min-h-[600px] mb-12">
          <TerminalDirectory
            path="/var/log/blog_posts.log"
            command="tail -f"
            items={directoryItems}
            totalItems={rest.length}
            username="root"
          />
        </div>
      </div>
    </TerminalBlogShell>
  );
}
