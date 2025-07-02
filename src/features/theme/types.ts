export type ThemeId =
  | "cyber"
  | "classic"
  | "sakura"
  | "classic-white"
  | "professional"
  | "ronin"
  | "octane"
  | "journal"
  | "terminal"
  | "techie"

export interface FluidicTokens {
  layoutType: "grid" | "stack" | "terminal"
  containerPadding: number
  borderRadius: number
  borderWidth: number
  fontScale: number
  innerSpacing: number
}

export interface ThemeConfig {
  id: ThemeId
  label: string
  labelJp?: string
  description: string
  copyTone:
    | "cyber"
    | "classic"
    | "sakura"
    | "minimal"
    | "professional"
    | "ronin"
    | "octane"
    | "journal"
    | "terminal"
    | "techie"
  isDark: boolean
  fontFamily: "mono" | "serif" | "sans"
  tokens: FluidicTokens
}
