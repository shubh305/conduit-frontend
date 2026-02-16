# Conduit Frontend — Fluidic UI Platform

**Conduit** is a Next.js application built for the **Fluidic UI** philosophy - an artisan design system that enables real-time, high-fidelity transitions between diverse aesthetic states. Engineered for enterprise-scale multi-tenancy, it features deep-integrated NLP semantic search, subdomain-driven routing, and a polymorphic UI/UX that morphs across identities like *Cyber*, *Journal*, and *Terminal* while maintaining strict data isolation.

## Quick Start

1. **Setup**:
   ```bash
   npm install
   ```
2. **Launch**:
   ```bash
   npm run dev
   ```
3. **Access**: `http://localhost:3000` (ensure `conduit-core` is running).

### Prerequisites
- **Node.js**: v22 or later
- **Backend**: `conduit-core` running on port 4000/4001
- **Subdomain Config**: Local `hosts` entry for testing tenants (e.g., `127.0.0.1 alice.localhost`)

## Architecture
Conduit Frontend implements the following core philosophies:
- **Aesthetic Morphing**: Instant transition engine using HSL interpolation and Framer Motion.
- **Micro-Frontend Patterns**: Feature-first domain isolation for scalability.
- **Edge Intelligence**: Subdomain-to-tenant resolution via Next.js middleware.

## Technical Documentation Suite

The authoritative documentation for the frontend platform is available in the `docs` directory:

| Document | Description |
| :--- | :--- |
| [**Architecture**](./docs/architecture.md) | Fluidic UI philosophy, subdomain resolution, and FE structure. |
| [**Frontend Deep Dive**](./docs/frontend.md) | Theme catalog, component portfolio, and responsive strategy. |
| [**Operations**](./docs/operations.md) | CI/CD, PWA capabilities, and FE deployment stack. |
| [**User Flows**](./docs/flows.md) | Visual sequence diagrams for morphing, editing, and discovery. |
| [**Configuration**](./docs/reference.md) | Client environment variables and shared UI libraries. |

---

## Primary Capabilities
- **Terminal Editor**: A specialized monospaced editing environment for developers.
- **Journal Layout**: Sophisticated editorial design for long-form literary content.
- **Semantic Discovery**: Integrated search bars with vector-based type-ahead.
- **Global Signal**: Aggregated discovery feed syncing thousands of creators.

---

## Technology Stack
- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + CSS Variables
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org)
- **Editor**: [Tiptap](https://tiptap.dev)
- **Icons**: [Lucide React](https://lucide.dev)
- **Persistence**: [React Query](https://tanstack.com/query)
