import { Tenant, Post } from "../types";

export const mockTenants: Record<string, Tenant> = {
  alice: {
    id: "t1",
    slug: "alice",
    name: "Alice's Tech Blog",
    description: "Exploring systems programming, Rust, and the future of web development.",
    status: "active",
    plan: "pro",
  },

  sarah_edo: {
    id: "t4",
    slug: "sarah_edo",
    name: "Sarah's Engineering Blog",
    description: "Thoughts on engineering management and frontend architecture.",
    status: "active",
    plan: "pro"
  },
  dan_abramov: {
    id: "t5",
    slug: "dan_abramov",
    name: "Overreacted",
    description: "A blog by Dan Abramov.",
    status: "active",
    plan: "pro"
  },
  rich_harris: {
    id: "t6",
    slug: "rich_harris",
    name: "Rich's Svelte Blog",
    description: "Cybernetically enhanced web apps.",
    status: "active",
    plan: "pro"
  }
};

export const mockPosts: Record<string, Post[]> = {
  alice: [
    {
      id: "p12",
      slug: "new-platform-features",
      title: "Platform Update: Announcements & Features",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We are excited to announce a major update to our platform. This release focuses on improving the developer experience and providing more control over your content."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "New Filtering Capabilities" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "You can now filter posts by multiple tags and author. This makes it easier to find exactly what you are looking for."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "WYSIWYG Editing" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Our new editor provides a true What You See Is What You Get experience. Formatting your posts has never been easier."
              }
            ]
          }
        ]
      },
      excerpt: "We've added new filtering capabilities and WYSIWYG editing.",
      featuredImage: "https://picsum.photos/seed/announce/800/600",
      tags: ["announcements", "platform", "update"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-30T10:00:00Z",
      viewsCount: 3500,
      likesCount: 120,
      commentsCount: 45,
      readingTimeMinutes: 3,
    },
    {
      id: "p10",
      slug: "weekly-roundup-jan-28",
      title: "Weekly Roundup: Rust 1.85 Released",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The Rust team has announced the release of Rust 1.85.0. This version brings several key improvements to the language and its ecosystem."
              }
            ]
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Async Trait Stabilization" }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "One of the most anticipated features, async functions in traits, is now stable. This opens up a wide range of patterns for asynchronous programming."
              }
            ]
          }
        ]
      },
      excerpt: "A summary of the most important tech news from this week.",
      featuredImage: "https://picsum.photos/seed/weekly/800/600",
      tags: ["weekly", "news", "rust"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-28T09:00:00Z",
      viewsCount: 1200,
      likesCount: 85,
      commentsCount: 12,
      readingTimeMinutes: 5,
    },
    {
      id: "p1",
      slug: "getting-started-with-rust",
      title: "Getting Started with Rust",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety."
              }
            ]
          },
          {
            type: "heading", 
            attrs: { level: 2 },
            content: [{ type: "text", text: "Why Rust?" }]
          },
          {
             type: "paragraph",
             content: [
               {
                 type: "text",
                 text: "Rust memory safety guarantees are validated at compile time, eliminating an entire class of runtime bugs."
               }
             ]
          }
        ]
      },
      excerpt: "A beginner's guide to memory safety and performance in Rust programming language.",
      featuredImage: "https://picsum.photos/seed/rust/800/600",
      tags: ["rust", "programming", "tutorial"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-28T10:00:00Z",
      viewsCount: 1250,
      readingTimeMinutes: 5,
    },
    {
      id: "p11",
      slug: "dao-governance-experiment",
      title: "Governance Experiments in our DAO",
      content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "Lessons learned from our latest community voting round." }]
            },
            {
                 type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Quadratic Voting" }]
            },
            {
                type: "paragraph",
                content: [{ type: "text", text: "We experimented with quadratic voting to prevent whale dominance. The results were surprising." }]
            }
        ]
      },
      excerpt: "Lessons learned from our latest community voting round.",
      featuredImage: "https://picsum.photos/seed/dao/800/600",
      tags: ["dao", "governance", "web3"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-20T14:00:00Z",
      viewsCount: 2200,
      readingTimeMinutes: 8,
    },
    {
      id: "p4",
      slug: "async-await-rust",
      title: "Understanding Async/Await in Rust",
      content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "Deep dive into Rust's asynchronous runtime model. Understanding Promise vs Future." }]
            },
            {
                 type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "The Executor Pattern" }]
            },
            {
                type: "paragraph",
                content: [{ type: "text", text: "Rust's async model requires an executor to poll futures. We compare Tokio vs async-std." }]
            }
        ]
      },
      excerpt: "Deep dive into Rust's asynchronous runtime model.",
      featuredImage: "https://picsum.photos/seed/async/800/600",
      tags: ["rust", "async"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-15T14:20:00Z",
      viewsCount: 890,
      readingTimeMinutes: 12,
    },
    {
      id: "p5",
      slug: "webassembly-future",
      title: "WebAssembly: The Future of the Browser",
      content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "Why Wasm is changing how we build high-performance web applications. It brings near-native performance to the browser." }]
            },
            {
                 type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Beyond the Browser" }]
            },
            {
                type: "paragraph",
                content: [{ type: "text", text: "WASI is taking WebAssembly to the server, enabling a new wave of edge computing." }]
            }
        ]
      },
      excerpt: "Why Wasm is changing how we build high-performance web applications.",
      featuredImage: "https://picsum.photos/seed/wasm/800/600",
      tags: ["wasm", "web", "performance"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-14T09:15:00Z",
      viewsCount: 2100,
      readingTimeMinutes: 8,
    },
    {
      id: "p6",
      slug: "building-cli-clap",
      title: "Building a Robust CLI with Clap",
      content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "A step-by-step tutorial on creating user-friendly command line tools in Rust." }]
            },
            {
                 type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Why Clap?" }]
            },
            {
                type: "paragraph",
                content: [{ type: "text", text: "Clap is the de-facto standard for argument parsing in Rust. It's fast, efficient, and generates help messages for you." }]
            }
        ]
      },
      excerpt: "A step-by-step tutorial on creating user-friendly command line tools in Rust.",
      featuredImage: "https://picsum.photos/seed/cli/800/600",
      tags: ["rust", "cli", "tutorial"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-10T11:45:00Z",
      viewsCount: 1560,
      readingTimeMinutes: 10,
    },
    {
      id: "p7",
      slug: "zero-cost-abstractions",
      title: "Zero-Cost Abstractions in Practice",
      content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "How Rust achieves safety without sacrificing runtime performance." }]
            },
            {
                 type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "What are Zero-Cost Abstractions?" }]
            },
            {
                type: "paragraph",
                content: [{ type: "text", text: "In Rust, abstractions like iterators and closures compile down to the same machine code as if you wrote the low-level loops yourself." }]
            }
        ]
      },
      excerpt: "How Rust achieves safety without sacrificing runtime performance.",
      featuredImage: "https://picsum.photos/seed/systems/800/600",
      tags: ["rust", "performance", "systems"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-05T16:30:00Z",
      viewsCount: 3200,
      readingTimeMinutes: 15,
    },
    {
      id: "p8",
      slug: "error-handling-rust",
      title: "Mastering Error Handling: Result vs Option",
      content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "Best practices for handling errors and optional values in your Rust code." }]
            },
            {
                 type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Result<T, E>" }]
            },
            {
                type: "paragraph",
                content: [{ type: "text", text: "Rust forces you to handle errors explicitly, which leads to more robust software." }]
            }
        ]
      },
      excerpt: "Best practices for handling errors and optional values in your Rust code.",
      featuredImage: "https://picsum.photos/seed/error/800/600",
      tags: ["rust", "patterns", "code-quality"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-02T08:00:00Z",
      viewsCount: 1800,
      readingTimeMinutes: 7,
    },
    {
      id: "p9",
      slug: "future-of-ai-agents",
      title: "The Rise of AI Agents in 2026",
      content: {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text: "How autonomous agents are reshaping software development workflows." }]
            },
            {
                 type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "The Agentic Workflow" }]
            },
            {
                type: "paragraph",
                content: [{ type: "text", text: "Agents like Antigravity are allowing developers to focus on higher-level architecture while the AI handles the implementation details." }]
            }
        ]
      },
      excerpt: "How autonomous agents are reshaping software development workflows.",
      featuredImage: "https://picsum.photos/seed/agents/800/600",
      tags: ["ai", "agents", "future"],
      status: "published",
      authorId: "u1",
      authorName: "Alice Chen",
      publishedAt: "2026-01-01T10:00:00Z",
      viewsCount: 4200,
      readingTimeMinutes: 20,
    },
  ],


  sarah_edo: [
    {
      id: "p20",
      slug: "engineering-management-101",
      title: "Engineering Management 101",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Transitioning to management is a career change, not a promotion. It requires a completely different set of skills." }] }] },
      excerpt: "Lessons learned transitioning from individual contributor to engineering manager.",
      featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      tags: ["management", "career", "leadership"],
      status: "published",
      authorId: "u2",
      authorName: "Sarah Drasner",
      publishedAt: "2026-01-25T10:00:00Z",
      viewsCount: 5000,
      likesCount: 800,
      commentsCount: 150,
      readingTimeMinutes: 8
    },
    {
      id: "p21",
      slug: "css-grid-v2",
      title: "The State of CSS Grid in 2026",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Subgrid is now universally supported and changes everything about how we layout components." }] }] },
      excerpt: "New features coming to CSS Grid and how to use them effectively.",
      featuredImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop",
      tags: ["css", "frontend", "design"],
      status: "published",
      authorId: "u2",
      authorName: "Sarah Drasner",
      publishedAt: "2026-01-20T10:00:00Z",
      viewsCount: 3000,
      likesCount: 400,
      commentsCount: 50,
      readingTimeMinutes: 6
    }
  ],
  dan_abramov: [
    {
      id: "p30",
      slug: "goodbye-clean-code",
      title: "Goodbye, Clean Code",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "I once wrote a clean code guide. I regret it. Patterns are useful, but dogmatic adherence kills productivity." }] }] },
      excerpt: "Why obsession with 'clean code' can be counterproductive and what to aim for instead.",
      featuredImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
      tags: ["react", "philosophy", "cleaning"],
      status: "published",
      authorId: "u3",
      authorName: "Dan Abramov",
      publishedAt: "2026-01-22T10:00:00Z",
      viewsCount: 15000,
      likesCount: 2000,
      commentsCount: 500,
      readingTimeMinutes: 10
    },
    {
      id: "p31",
      slug: "react-server-components-verified",
      title: "React Server Components: Verified",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "RSCs are not about server-side rendering. They are about component-oriented data fetching." }] }] },
      excerpt: "A deep dive into how RSCs are changing the way we build web apps.",
      featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
      tags: ["react", "rsc", "performance"],
      status: "published",
      authorId: "u3",
      authorName: "Dan Abramov",
      publishedAt: "2026-01-18T10:00:00Z",
      viewsCount: 12000,
      likesCount: 1500,
      commentsCount: 300,
      readingTimeMinutes: 15
    }
  ],
  rich_harris: [
    {
      id: "p40",
      slug: "svelte-6-preview",
      title: "Svelte 6: The Compilation Era",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "We are moving compilation to the cloud. What does this mean for your local dev environment?" }] }] },
      excerpt: "Previewing the new features in the upcoming Svelte 6 release.",
      featuredImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
      tags: ["svelte", "javascript", "frameworks"],
      status: "published",
      authorId: "u4",
      authorName: "Rich Harris",
      publishedAt: "2026-01-24T10:00:00Z",
      viewsCount: 8000,
      likesCount: 1200,
      commentsCount: 200,
      readingTimeMinutes: 12
    },
    {
      id: "p41",
      slug: "virtual-dom-is-pure-overhead",
      title: "Virtual DOM is Pure Overhead",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Diffing objects that don't exist in the DOM to update objects that do is inefficient." }] }] },
      excerpt: "Revisiting the classic argument in 2026. Is it still true?",
      featuredImage: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop",
      tags: ["performance", "dom", "engineering"],
      status: "published",
      authorId: "u4",
      authorName: "Rich Harris",
      publishedAt: "2026-01-15T10:00:00Z",
      viewsCount: 9000,
      likesCount: 1000,
      commentsCount: 250,
      readingTimeMinutes: 20
    }
  ]
};
