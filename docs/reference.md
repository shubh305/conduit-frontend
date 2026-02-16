# Frontend Configuration & Reference — Conduit Frontend

## 1. Internal Shared Dependencies
Key libraries utilized by the frontend for UI orchestration, state, and aesthetic transitions.

| Dependency | Purpose |
| :--- | :--- |
| **next** | Core application framework and App Router. |
| **react** | UI library for component development. |
| **@tanstack/react-query** | Async server state synchronization and pre-fetching. |
| **framer-motion** | High-performance animations and theme interpolation. |
| **@tiptap/react** | Headless rich-text editor engine for the Studio. |
| **recharts** | Data visualization for creator analytics. |
| **lucide-react** | SVG icon system across all UI aesthetics. |

---

## 2. Environment Variables Index (Conduit Frontend)

These variables are defined in the `.env` file and control client-side connectivity and branding.

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL for the public Conduit Core API. | **Yes** | `http://localhost:4001/api` |
| `CONDUIT_INTERNAL_API_URL`| Internal URL for server-side fetches. | No | `http://localhost:4001/api` |
| `NEXT_PUBLIC_BASE_DOMAIN` | Root platform domain for cookie scoping. | No | `conduit.dev` |
| `NEXT_PUBLIC_STORAGE_URL` | CDN/Storage base URL for media assets. | No | `https://storage.octanebrew.dev` |
| `NEXT_PUBLIC_DEFAULT_TENANT_ID`| Fallback tenant ID for root routes. | No | - |
| `NEXT_PUBLIC_PWA_VERSION` | Cache busting token for PWA manifests. | No | `1.0.0` |

---

## 3. Atomic Theme Definition (DSL)
Themes are defined in `src/lib/theme/variants` using HSL tokens.

| Token | UI Role |
| :--- | :--- |
| `--noir-bg` | Primary canvas background color. |
| `--noir-accent` | Primary brand/engagement highlight color. |
| `--font-scale` | Base typographic multiplier. |
| `--radius-ui` | Shared border-radius for buttons and cards. |

---

## 4. Local Development specific
- **Subdomain Simulation**: Requires mapping subdomains in the local `hosts` file (e.g., `127.0.0.1 alice.localhost`).
- **SSR Mode**: Controlled via `force-dynamic` or `revalidate` segments in individual page routes.
