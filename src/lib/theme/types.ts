import { ThemeId } from "@/features/theme/ThemeProvider";

export type ThemeVariant = ThemeId;

export interface CardVariantStyles {
  base: string;
  hover: string;
  border: string;
  radius: string;
}

export interface ButtonVariantStyles {
  primary: string;
  ghost: string;
}
