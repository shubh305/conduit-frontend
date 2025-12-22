"use client";

import dynamic from "next/dynamic";

const GlobalStatusBar = dynamic(
  () => import("./GlobalStatusBar").then(mod => mod.GlobalStatusBar),
  { ssr: false }
);

export function StatusBarLoader() {
  return <GlobalStatusBar />;
}
