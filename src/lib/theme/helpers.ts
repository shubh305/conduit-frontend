import { ThemeVariant } from "./types";
import { TRANSPARENT_THEMES } from "./constants";

export function needsTransparency(theme: ThemeVariant): boolean {
  return (TRANSPARENT_THEMES as readonly string[]).includes(theme);
}
