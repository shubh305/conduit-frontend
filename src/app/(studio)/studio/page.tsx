"use client";

import { DashboardStats } from "@/features/studio/components/DashboardStats";
import { BarChart2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme, useStudioLabels, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { getPosts } from "@/features/blog/api";
import { Post } from "@/features/blog/types";
import { AnalyticsChart } from "@/features/studio/components/AnalyticsChart";
import { FrequencyPerformanceList } from "@/features/studio/components/FrequencyPerformanceList";
import { TerminalProcessList } from "@/components/terminal/TerminalProcessList"
import { redirect } from "next/navigation";
import { ThemePage, ThemeCard, getHeadingClasses } from "@/components/theme";
import { getSubtitleClasses, ThemeVariant } from "@/lib/theme-variants";

export default function DashboardPage() {
  // TODO: Remove this redirect ans restore analytics
  redirect("/studio/posts");
  const { user } = useAuth();
  const { theme } = useTheme();
  const { isTechieCopy } = useThemeHelpers();
  const { getLabel } = useStudioLabels();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const title = getLabel("analytics");
  const perfLabel = getLabel("perf_visualization");
  const performancesLabel = getLabel("performances");

  useEffect(() => {
    const fetchStats = async () => {
      const currentUser = user;
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      const activeTenantId = currentUser.tenantId || currentUser.tenants?.[0]?.id;
      if (!activeTenantId) {
        setLoading(false);
        return;
      }

      try {
        const res = await getPosts(activeTenantId, { limit: 50, author: currentUser.id });
        setPosts(res.data || []);
      } catch (e) {
        console.error("Failed to load studio data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const totalViews = useMemo(() => posts.reduce((acc, p) => acc + (p.viewsCount || 0), 0), [posts]);

  const stats = [
    {
      label: getLabel("stats_total_views"),
      value: totalViews.toLocaleString(),
      change: "+14%",
      isPositive: true,
      trend: "up" as const,
    },
    {
      label: getLabel("stats_30_days"),
      value: Math.floor(totalViews * 0.4).toLocaleString(),
      change: "+2%",
      isPositive: true,
      trend: "up" as const,
    },
    {
      label: getLabel("stats_7_days"),
      value: Math.floor(totalViews * 0.1).toLocaleString(),
      change: "+8%",
      isPositive: true,
      trend: "up" as const,
    },
    { label: getLabel("stats_engagement"), value: "4.2%", change: "+0.5%", isPositive: true, trend: "up" as const },
  ];

  // Mock Chart Data
  const chartData = useMemo(() => {
    const isCyberCopy = theme === "cyber";
    const days = isCyberCopy
      ? ["28 JAN", "29 JAN", "30 JAN", "31 JAN", "01 FEB", "02 FEB", "03 FEB"]
      : ["Jan 28", "Jan 29", "Jan 30", "Jan 31", "Feb 01", "Feb 02", "Feb 03"];
    return days.map((day, i) => ({
      label: day,
      value:
        i === 6
          ? Math.floor(totalViews * 0.05)
          : i === 5
            ? Math.floor(totalViews * 0.01)
            : i === 4
              ? Math.floor(totalViews * 0.008)
              : 0,
    }));
  }, [totalViews, theme]);

  // --- TERMINAL SYSTEM MONITOR ---
  const isTerminalCopy = theme === "terminal";
  if (isTerminalCopy) {
    return (
      <TerminalDashboard
        stats={stats}
        chartData={chartData}
        posts={posts}
        loading={loading}
        user={user}
        getLabel={getLabel}
      />
    );
  }

  return (
    <ThemePage
      className={cn(
        "max-w-7xl mx-auto px-0 md:px-6 py-4 md:py-12",
        isTechieCopy &&
          "bg-[linear-gradient(rgba(var(--bg-rgb),0.8)_50%,rgba(0,0,0,0.9)_100%),linear-gradient(90deg,rgba(var(--accent-rgb),0.03)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[length:100%_100%,40px_40px,40px_40px] border-x border-noir-border/30 min-h-screen",
      )}
    >
      <header
        className={cn(
          "flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 md:pb-10 border-b border-noir-border transition-all",
          isTechieCopy && "border-noir-border",
        )}
      >
        <div>
          <h1 className={cn("text-4xl font-bold tracking-tighter", getHeadingClasses(theme))}>{title}</h1>
          <p className={cn("text-sm mt-2 opacity-70", getSubtitleClasses(theme as ThemeVariant))}>
            {getLabel("analytics_desc")}
          </p>
        </div>
        {/* Create button removed from analytics per user request */}
      </header>

      <div className="mt-4 md:mt-12">
        <DashboardStats stats={stats} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-12 mt-6 md:mt-16">
        {/* Main Analytics Visualization */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-accent" />
            </div>
            <h2 className={cn("text-sm font-bold uppercase tracking-[0.2em]", getHeadingClasses(theme))}>
              {perfLabel}
            </h2>
          </div>

          <ThemeCard className="p-0 overflow-hidden border-noir-border/50">
            <div className="p-8 h-[450px]">
              <AnalyticsChart
                data={chartData}
                title={getLabel("traffic_title")}
                subtitle={getLabel("traffic_subtitle")}
              />
            </div>
          </ThemeCard>
        </section>

        {/* Frequencies Performance List */}
        <section className={cn("pt-16 border-t border-noir-border", isTechieCopy && "border-noir-border")}>
          <FrequencyPerformanceList
            posts={posts.filter(p => p.status === "published")}
            isLoading={loading}
            title={performancesLabel}
          />
        </section>
      </div>
    </ThemePage>
  );
}

// =============================================================================
// Terminal Dashboard Sub-Component
// =============================================================================

interface TerminalDashboardProps {
  stats: Array<{ label: string; value: string; change: string; isPositive: boolean; trend: "up" | "down" }>
  chartData: Array<{ label: string; value: number }>
  posts: Post[]
  loading: boolean
  user: ReturnType<typeof useAuth>["user"]
  getLabel: (key: import("@/features/theme/studio-labels").StudioLabelKey) => string
}

function TerminalDashboard({ stats, chartData, posts, loading, user, getLabel }: TerminalDashboardProps) {
  return (
    <div className="min-h-screen bg-black text-accent font-mono text-xs md:text-sm p-4 pt-10 max-w-7xl mx-auto">
      {/* Top Bar Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>CPU [|||||||||||||||||||||||||||| 84.0%]</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>MEM [||||||||||||||| 42.1%]</span>
          </div>
          <div className="flex justify-between">
            <span>SWP [||||| 12.5%]</span>
          </div>
        </div>
        <div className="text-right text-foreground-muted">
          <div>
            Tasks: {posts.length} total, 1 running, {posts.length} sleeping
          </div>
          <div>Load average: 1.05 0.76 0.54</div>
          <div>Uptime: 14 days, 22:15:04</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-b border-accent/20 pb-8">
        {stats.map((stat, i) => (
          <div key={i} className="border border-accent/30 p-2 bg-accent/5">
            <div className="text-accent/50 mb-1 uppercase text-[10px]">{stat.label}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-green-500">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="text-accent mb-8 border border-accent/30 p-4 relative">
        <div className="absolute top-0 left-0 bg-black text-accent px-2 -mt-2 ml-4 text-xs border border-accent/30">
          Network Traffic (Views)
        </div>
        <div className="h-[300px]">
          <AnalyticsChart data={chartData} title={getLabel("traffic_title")} subtitle={getLabel("traffic_subtitle")} />
        </div>
      </div>

      {/* Process List */}
      <TerminalProcessList posts={posts} loading={loading} user={user} />
    </div>
  )
}
