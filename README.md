# Conduit Frontend: The Multi Tenant Publishing Platform

Conduit is a high-performance, multi-tenant publishing platform. The frontend is built on the **Fluidic UI** philosophy—a design system that allows for seamless, real-time transitions between drastically different aesthetic states.

## 🌈 The Fluidic UI Engine

Conduit features a custom theme interpolation engine built on **Framer Motion** and high-precision CSS variables. Unlike standard theme systems that simply swap colors, Conduit performs a **"Physical Morph"**—reflowing the entire layout, changing border radii, font scales, and decorative artifacts (like scanlines or paper textures) in a single fluid animation.

### 🎨 Theme Catalog

| Theme ID | Aesthetic DNA | Typography | Tone & Vibe |
|:---|:---|:---|:---|
| `terminal` | Retro CRT, monospaced, green screen simulation | `JetBrains Mono` | CLI Commands, Root access |
| `ronin` | Cinematic ink-and-brush, samurai inspired | `Noto Serif JP` | Poetic, Crimson accents |
| `cyber` | Neon-drenched, digital noise, grid systems | `Outfit (Mono)` | Technical, ALL_CAPS |
| `journal` | Warm artisan-paper, литературный (literary) editorial | `Crimson Text` | Artisan, Warm Parchment |
| `techie` | Industrial hardware-reviewer, module-based | `Roboto Mono` | Spec Sheet, Electric Cyan |
| `octane` | Industrial automotive, gunmetal gradients | `Outfit` | Workshop, High-performance |
| `sakura` | Cherry blossom, light and ephemeral Japanese | `Playfair Display` | Zen, Sakura Pink |
| `professional`| Corporate data-focused, slate dual-tone | `Inter` | Precise, Analytical |
| `classic` | Noir elegance, high contrast, minimalist | `Lora` | Refined, Literary |
| `classic-white`| Clean white, blue accents, professional standard | `Geist` | Straightforward, Minimalist |

---

## 🏗 Modular Architecture

The codebase follows a **Feature-First Architecture** to ensure independent scalability of domains:

- **`src/features/theme`**: The core Interpolation Engine and `ThemeProvider`.
- **`src/features/studio`**: A high-density suite for creators with real-time **Analytics** (Recharts).
- **`src/features/blog`**: Highly-themed reader experiences with **Advanced Layout Awareness** (Grid, Stack, Magazine).
- **`src/features/feed`**: Global discovery engine using reactive interaction patterns.
- **`src/features/search`**: Global predictive search with type-ahead suggestions for tags and authors.

### 📐 Layout Management
- **The LayoutManager**: A central authority ensuring zero "layout drift" across themes.
- **BasePostCard**: A universal component that adapts its visual style (flat, bordered, horizontal) based on the current theme's physical tokens.
- **Terminal Pattern**: Specialized "windowed" views for administrative tasks that override the standard scroll model.

---

## 🚀 Advanced Platform Features

### 1. Studio Suite
- **Live Performance Tracking**: Visualizing engagement, traffic sources, and reader demographics.
- **Project Console**: Manage multiple blogs (Relay Stations) from a unified dashboard.
- **Resource Management**: Built-in File Library and Media management.

### 2. The Creative Editor
- **Tiptap Core**: Native support for structured rich-text content via JSON storage.
- **Dynamic Prose**: Typography that adapts its weight, leading, and scale in real-time.
- **Dual-Mode Editing**: Switch between a standard canvas and a simulated Terminal editor.

### 3. Discovery & Social
- **Global Signal**: Aggregated discovery feed across all platform tenants.
- **Social Graph**: Tenant-scoped following systems and personalized discovery paths.
- **Reactive Interactions**: Smooth animations for Likes, Saves, and nested Comment trees.

---

## 🛠 Technology Stack

- **Framework**: [Next.js 16+](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + CSS Variables
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org)
- **Editor**: [Tiptap](https://tiptap.dev)
- **Icons**: [Lucide React](https://lucide.dev)

---

## 🚦 Getting Started

### Installation
```bash
git clone https://github.com/shubh305/conduit-frontend.git
cd conduit-frontend
npm install
```

### Development
1. Configure `.env.local` to point to your `conduit-core` instance.
2. Launch the development server: `npm run dev`
3. Access the platform at `http://localhost:3000`.

