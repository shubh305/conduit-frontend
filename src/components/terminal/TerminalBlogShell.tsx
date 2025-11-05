"use client";

import { ReactNode, useState, useEffect } from "react";

import { DiskUsageWidget } from "./widgets/DiskUsageWidget";
import { ActiveProcessesWidget, ConfigPost } from "./widgets/ActiveProcessesWidget";
import { cn } from "@/lib/utils";

interface TerminalBlogShellProps {
  children: ReactNode;
  tenant?: {
    name: string;
    slug: string;
    description?: string;
  };
  tags?: { name: string; count: number }[];
  trendingPosts?: ConfigPost[];
  showSystemPanels?: boolean;
  childrenClassName?: string;
}

/**
 * Terminal Blog Shell
 */
export function TerminalBlogShell({ children, tenant = { name: "Conduit", slug: "conduit" }, tags = [], trendingPosts = [], showSystemPanels = true, childrenClassName }: TerminalBlogShellProps) {
  const [isBooting, setIsBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [uptime, setUptime] = useState(0);


  useEffect(() => {
    const logs = [
      { text: "> INITIALIZING_KERNEL...", delay: 50 },
      { text: "> MOUNTING_VIRTUAL_FS...", delay: 300 },
      { text: "> LOADING_LAYOUT_MODULE...", delay: 600 },
      { text: "> STARTING_STREAM...", delay: 900 },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    logs.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setBootLogs(prev => [...prev, text]);
      }, delay);
      timeouts.push(t);
    });

    const completionTimeout = setTimeout(() => {
      setIsBooting(false);
    }, 1100);
    timeouts.push(completionTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, []);


  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setUptime(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";

  return (
    <div className="h-screen bg-black font-mono text-accent p-2 md:p-4 pt-16 flex flex-col overflow-hidden">
      {/* Top Bar - Command Prompt */}
      <div className="mb-6 border border-accent p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent">root@{tenant?.slug || "conduit"}:~$</span>
          <span className="text-foreground-muted">search_query | grep</span>
          <span className="w-2 h-4 bg-accent animate-pulse" />
        </div>
        <div className="text-xs text-foreground-muted hidden md:block">[TTY: pts/0] [IP: 127.0.0.1]</div>
      </div>

      {/* System Dashboard (Top) */}
      {showSystemPanels && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {/* Panel 1: Neofetch (System Info) */}
          <div className="border border-accent p-4 relative font-mono text-xs overflow-hidden">
            <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">neofetch</div>
            <div className="flex gap-4 mt-2 h-full items-start">
              <div className="text-accent hidden xl:block shrink-0">
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
                  <span className="text-accent">OS:</span> {tenant.name} v1.0
                </div>
                <div>
                  <span className="text-accent">Host:</span> {hostname}
                </div>
                <div>
                  <span className="text-accent">Kernel:</span> React 19.0.0
                </div>
                <div>
                  <span className="text-accent">Uptime:</span> {formatUptime(uptime)}
                </div>
                <div>
                  <span className="text-accent">Shell:</span> ZSH 5.9
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Disk Usage */}
          <div className="h-full">
            {tags.length > 0 ? (
              <DiskUsageWidget tags={tags} className="h-full" />
            ) : (
              <div className="border border-accent p-4 h-full flex items-center justify-center text-accent/30 text-xs italic">
                /dev/sda1: No tags mounted
              </div>
            )}
          </div>

          {/* Panel 3: Active Processes */}
          <div className="h-full">
            {trendingPosts.length > 0 ? (
              <ActiveProcessesWidget posts={trendingPosts} tenantSlug={tenant.slug} className="h-full" />
            ) : (
              <div className="border border-accent p-4 h-full flex items-center justify-center text-accent/30 text-xs italic">
                top: No active processes
              </div>
            )}
          </div>

          {/* Panel 4: Status / MOTD */}
          <div className="border border-accent p-4 relative font-mono text-xs flex flex-col justify-between h-full">
            <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">status</div>
            <div className="text-foreground-muted leading-relaxed text-[11px] line-clamp-4">
              {tenant.description ? `> ${tenant.description}` : `> Welcome to the ${tenant.name} Network.`}
              <br />
              {">"} All transmissions monitored.
              <span className="animate-pulse">_</span>
            </div>
            <div className="mt-2 pt-2 border-t border-accent/20 flex justify-between text-[10px] text-accent/50">
              <span>Last: {new Date().toLocaleDateString()}</span>
              <span>IP: 127.0.0.1</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "w-full h-full min-h-0 overflow-hidden border border-accent/20 p-2 md:p-4",
          showSystemPanels ? "h-[60vh] flex-none" : "flex-1",
          childrenClassName,
        )}
      >
        {isBooting ? (
          <div className="border border-accent p-8 h-full flex flex-col justify-end">
            <div className="text-foreground-muted space-y-1 font-mono text-sm">
              {bootLogs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-100">
                  {log}
                </div>
              ))}
              <div className="animate-blink inline-block w-2 h-4 bg-accent mt-1" />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 h-full overflow-hidden">{children}</div>
        )}
      </div>
    </div>
  );
}
