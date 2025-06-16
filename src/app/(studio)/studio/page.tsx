import { DashboardStats } from "@/features/studio/components/DashboardStats";
import { mockStats, mockActivity } from "@/features/studio/data/mock-studio";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Conduit Studio",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <header className="flex items-center justify-between pb-6 border-b border-noir-border">
        <div>
          <h1 className="text-3xl font-sans font-bold tracking-tight">OVERVIEW</h1>
          <p className="font-mono text-sm text-gray-500 mt-1">
            {`// TERMINAL.STATUS: ONLINE`}
          </p>
        </div>
        <Link href="/studio/editor">
          <Button className="gap-2">
            <Plus size={16} />
            NEW TRANSMISSION
          </Button>
        </Link>
      </header>

      <DashboardStats stats={mockStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {/* Chart placeholder would go here */}
           <div className="bg-noir-panel border border-noir-border h-[300px] flex items-center justify-center">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                 [ANALYTICS VISUALIZATION MODULE UPLINK STANDBY]
              </span>
           </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-wider text-gray-400">Recent Activity</h2>
          <div className="space-y-4 border border-noir-border bg-noir-panel p-4">
             {mockActivity.map(item => (
                <div key={item.id} className="flex flex-col gap-1 pb-3 border-b border-noir-border last:border-0 last:pb-0">
                   <p className="font-mono text-sm text-gray-300">{item.content}</p>
                   <span className="font-mono text-[10px] text-gray-500 uppercase">{item.time}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
