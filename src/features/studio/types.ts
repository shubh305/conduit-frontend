export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export interface ActivityItem {
  id: string;
  type: "post" | "comment" | "system";
  content: string;
  time: string;
}
