import { useSpring } from "framer-motion";
import { useTheme } from "../ThemeProvider";

export function useThemeInterpolation() {
  const { config } = useTheme();
  const { tokens } = config;

  const springConfig = { stiffness: 120, damping: 20, mass: 1 };


  const containerPadding = useSpring(tokens.containerPadding, springConfig);
  const borderRadius = useSpring(tokens.borderRadius, springConfig);
  const borderWidth = useSpring(tokens.borderWidth, springConfig);
  const fontScale = useSpring(tokens.fontScale, springConfig);
  const innerSpacing = useSpring(tokens.innerSpacing, springConfig);

  return {
    containerPadding,
    borderRadius,
    borderWidth,
    fontScale,
    innerSpacing,
  };
}
