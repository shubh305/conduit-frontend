"use client";

import { TerminalStackedLayout } from "./terminal/TerminalStackedLayout";
import { TerminalGridLayout } from "./terminal/TerminalGridLayout";
import { TerminalDashboardLayout } from "./terminal/TerminalDashboardLayout";
import { TerminalSingleLayout } from "./terminal/TerminalSingleLayout";
import { TerminalMinimalLayout } from "./terminal/TerminalMinimalLayout";
import { TerminalSplitLayout } from "./terminal/TerminalSplitLayout";
import { LayoutProps } from "./types";

export type TerminalLayoutType = "stacked" | "grid" | "magazine" | "single-row" | "minimal" | "split";

/**
 * Terminal-specific layout manager.
 */
export function TerminalLayoutManager(props: LayoutProps & { layout?: string }) {
  const { layout = "stacked", ...rest } = props;

  switch (layout) {
    case "magazine":
      return <TerminalDashboardLayout {...rest} />;
    case "grid":
      return <TerminalGridLayout {...rest} />;
    case "single-row":
      return <TerminalSingleLayout {...rest} />;
    case "minimal":
      return <TerminalMinimalLayout {...rest} />;
    case "split":
      return <TerminalSplitLayout {...rest} />;
    case "list":
    case "stacked":
    default:
      return <TerminalStackedLayout {...rest} />;
  }
}
