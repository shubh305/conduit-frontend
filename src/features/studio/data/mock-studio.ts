import { DashboardStat, ActivityItem } from "../types";

export const mockStats: DashboardStat[] = [
  { label: "Total Views", value: "45.2K", change: "+12.5%", trend: "up" },
  { label: "Active Subscribers", value: "1,203", change: "+3.2%", trend: "up" },
  { label: "Avg. Read Time", value: "4m 12s", change: "-0.5%", trend: "down" },
  { label: "Engagement Rate", value: "8.4%", change: "+0.0%", trend: "neutral" },
];

export const mockActivity: ActivityItem[] = [
  { id: "a1", type: "post", content: 'Published "Getting Started with Rust"', time: "2 hours ago" },
  { id: "a2", type: "comment", content: "New comment on system architecture post", time: "5 hours ago" },
  { id: "a3", type: "system", content: "Weekly backup completed successfuly", time: "1 day ago" },
];
