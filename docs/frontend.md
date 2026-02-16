# Frontend Specification — Conduit Frontend

## 1. Product Capabilities

### 1.1 Fluidic UI Theme Engine
The core differentiator of Conduit. It manages real-time transitions between vastly different styles.
- **Variable Injection**: Themes are defined as HSL maps in `lib/theme/variants`.
- **Interpolation**: Uses `framer-motion` to animate background blurs, border-radii, and grain overlays during theme swaps.
- **Immersive Mode ("Void Mode")**: Triggered by high-contrast themes (cyber, ronin) to expand content boundaries.

### 1.2 Theme Evolution Catalog
| Theme ID | Aesthetic DNA | Typography | Tone & Vibe |
|:---|:---|:---|:---|
| `terminal` | Retro CRT, monospaced | `JetBrains Mono` | CLI Commands, Root access |
| `ronin` | Cinematic ink-and-brush | `Noto Serif JP` | Poetic, Crimson accents |
| `cyber` | Neon-drenched, digital noise | `Outfit (Mono)` | Technical, ALL_CAPS |
| `journal` | Warm artisan-paper | `Crimson Text` | Artisan, Warm Parchment |
| `techie` | Industrial hardware | `Roboto Mono` | Spec Sheet, Electric Cyan |
| `octane` | Industrial automotive | `Outfit` | Workshop, High-performance |
| `sakura` | Cherry blossom, ephemeral | `Playfair Display` | Zen, Sakura Pink |
| `professional`| Corporate data-focused | `Inter` | Precise, Analytical |
| `classic` | Noir elegance | `Lora` | Refined, Literary |

---

## 2. Component Portfolio

- **ArticlePageWrapper**: Polymorphic layout resolver.
- **TiptapEditor**: Custom headless rich-text suite with Bubble Menu & Media Manager.
- **DashboardStats**: Real-time traffic visualization using `recharts`.
- **TerminalFeedCard**: Specialized aesthetic variant for monospaced browsing.

---

## 3. Responsive Design strategy

- **Desktop**: Three-column adaptive grid.
- **Mobile**: Dynamic Sheet overlays for navigation and settings.
- **Adaptive Article Layouts**: Each theme defines its own typographic breakpoints to ensure optimal reading density.

---

## 4. Frontend State Management
- **Query Context**: React Query for paginated feed synchronization.
- **Auth Context**: Persistent JWT session management via cookies.
- **Library Context**: Local persistence for history, bookmarks, and draft local-backups.
