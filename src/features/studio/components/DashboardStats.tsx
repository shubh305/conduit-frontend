import { Card, CardContent } from "@/components/ui/card";
import { DashboardStat } from "../types";
import { cn } from "@/lib/utils";

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-noir-bg border-noir-border">
          <CardContent className="p-6">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-2">
              {stat.label}
            </span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-sans font-bold text-white">
                {stat.value}
              </span>
              <span className={cn(
                "font-mono text-xs px-1.5 py-0.5 border",
                stat.trend === "up" ? "text-signal-green border-signal-green" : 
                stat.trend === "down" ? "text-signal-red border-signal-red" : 
                "text-gray-500 border-gray-500"
              )}>
                {stat.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
