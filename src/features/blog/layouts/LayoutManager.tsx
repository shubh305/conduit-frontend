"use client";

import { StackedLayout } from "./StackedLayout";
import { GridLayout } from "./GridLayout";
import { MagazineLayout } from "./MagazineLayout";
import { SingleRowLayout } from "./SingleRowLayout";
import { MinimalLayout } from "./MinimalLayout";
import { SplitLayout } from "./SplitLayout";
import { LayoutProps } from "./types";

export type LayoutType = "stacked" | "grid" | "magazine" | "single-row" | "minimal" | "split";

export function LayoutManager(props: LayoutProps & { layout?: string }) {
  const { layout = "stacked", ...rest } = props;

  const renderLayout = () => {
    switch (layout) {
      case "magazine":
        return <MagazineLayout {...rest} />;
      case "grid":
        return <GridLayout {...rest} />;
      case "single-row":
        return <SingleRowLayout {...rest} />;
      case "minimal":
        return <MinimalLayout {...rest} />;
      case "split":
        return <SplitLayout {...rest} />;
      case "stacked":
      default:
        return <StackedLayout {...rest} />;
    }
  };

  return renderLayout();
}
