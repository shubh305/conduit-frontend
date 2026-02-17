import { 
  Globe, 
  Bookmark, 
  LayoutDashboard, 
  FileText, 
  Palette, 
  Settings, 
  PenTool,
  User,
  Search
} from "lucide-react";
import { Step } from "./types";

/**
 * BASE DATA: Data for walkthrough step content.
 */
const baseSteps: Record<string, Step> = {
  home: {
    id: 1,
    title: "Home Feed",
    description: "Discover a global stream of articles from professional writers across the network. Stay updated with the latest stories in real-time.",
    icon: Globe,
    location: "Home (/)",
    spotlightId: "nav-home",
    imagePlaceholder: "Main Network Feed",
    simulationImage: "home.png",
    details: [
      { title: "Articles", items: ["Real-time post updates", "Global creator feed"] },
      { title: "Discovery", items: ["Trending topics", "Following feed"] }
    ]
  },
  library: {
    id: 2,
    title: "Your Library",
    description: "A dedicated space for your saved stories. Easily bookmark articles to read later and track your recently viewed content.",
    icon: Bookmark,
    location: "Library (/me/library)",
    spotlightId: "nav-library",
    imagePlaceholder: "Reading Library",
    simulationImage: "library.png",
    details: [
      { title: "Saved Stories", items: ["One-click bookmarking", "Personal reading list"] },
      { title: "History", items: ["Recently viewed posts", "Reading history search"] }
    ]
  },
  dashboard: {
    id: 3,
    title: "Dashboard",
    description: "Everything you need to build your own blog. Access tools to manage multiple sites from one central place.",
    icon: LayoutDashboard,
    location: "Sidebar > Dashboard",
    spotlightId: "nav-mySites",
    imagePlaceholder: "Studio Overview",
    simulationImage: "site.png",
    details: [
      { title: "Site Manager", items: ["Add multiple blogs", "Easy blog switching"] },
      { title: "Studio Navigation", items: ["Quick access to tools", "Creator dashboard"] }
    ]
  },
  search: {
    id: 4,
    title: "Advanced Search",
    description: "Find exactly what you're looking for with precision. Use standard keywords or our AI-powered semantic search for better results.",
    icon: Search,
    location: "Search (/search)",
    spotlightId: "nav-search",
    imagePlaceholder: "Search Interface",
    simulationImage: "search.png",
    details: [
      { title: "Search Tools", items: ["Keyword matching", "AI-powered semantic search"] },
      { title: "Filters", items: ["Search by author", "Date-range filtering", "Search by tags"] }
    ]
  },
  profile: {
    id: 5,
    title: "Your Account",
    description: "Manage your account settings and public profile. Update your bio and credentials to stay secured and connected.",
    icon: User,
    location: "Nav > Profile",
    spotlightId: ["nav-profile"],
    imagePlaceholder: "Profile Menu",
    simulationImage: "profile_nav.png",
    details: [
      { title: "Identity", items: ["Public profile settings", "Personal bio"] },
      { title: "Account", items: ["Security settings", "Studio Navigation"] }
    ]
  }
};

// Desktop: Home -> Library -> Dashboard -> Search -> Profile
export const desktopDiscoverySteps: Step[] = [
  baseSteps.home,
  baseSteps.library,
  baseSteps.dashboard,
  baseSteps.search,
  baseSteps.profile
];

// Mobile: Home -> Search -> Dashboard -> Library -> Profile
export const mobileDiscoverySteps: Step[] = [
  baseSteps.home,
  baseSteps.search,
  baseSteps.dashboard,
  baseSteps.library,
  baseSteps.profile
];

// Creator studio steps
export const creatorSteps: Step[] = [
  {
    id: 7,
    title: "Post Management",
    description: "Manage your entire blog archive from one place. Quickly organize your published articles, refine drafts, and schedule posts.",
    icon: FileText,
    location: "Studio > Posts",
    spotlightId: "studio-posts",
    imagePlaceholder: "Post Management Dashboard",
    simulationImage: "transmissions.png",
    details: [
      { title: "Organization", items: ["Published articles", "Saved drafts", "Archive management"] },
      { title: "Quick Actions", items: ["Edit posts", "Delete posts"] }
    ]
  },
  {
    id: 8,
    title: "The Editor",
    description: "A professional writing experience with rich text support. Use slash commands for fast formatting and 'Void Mode' for a distraction-free environment.",
    icon: PenTool,
    location: "Studio > Editor",
    spotlightId: "studio-editor",
    imagePlaceholder: "Writing Interface",
    simulationImage: "editor.png",
    details: [
      { title: "Writing Tools", items: ["Rich text formatting", "Slash command shortcuts"] },
      { title: "Void Mode", items: ["Full-screen writing", "Minimalist distraction-free UI"] }
    ]
  },
  {
    id: 9,
    title: "Blog Settings",
    description: "Tailor your blog to your needs. Configure your blog title, description, and image.",
    icon: Settings,
    location: "Studio > Settings",
    spotlightId: "studio-publications",
    imagePlaceholder: "Settings Interface",
    simulationImage: "studio_core.png",
    details: [
      { title: "Optimization", items: ["SEO & Search settings", "Site-wide configuration"] },
      { title: "General", items: ["Blog title & description", "Navigation management"] }
    ]
  },
  {
    id: 10,
    title: "Theme & Style",
    description: "Personalize the look and feel of your blog. Choose from a library of professional themes and adjust layout to match your brand.",
    icon: Palette,
    location: "Studio > Appearance",
    spotlightId: "studio-appearance",
    imagePlaceholder: "Theme Selector",
    simulationImage: "appearance.png",
    details: [
      { title: "Theme Library", items: ["Professional pre-sets", "Instant theme switching"] },
      { title: "Customization", items: ["Visual layout options"] }
    ]
  },
  {
    id: 11,
    title: "Profile & Account",
    description: "Manage your personal profile and security settings. Update your bio, profile picture, and account credentials in seconds.",
    icon: User,
    location: "Studio > Profile",
    spotlightId: "studio-settings",
    imagePlaceholder: "User Profile Settings",
    simulationImage: "profile_settings.png",
    details: [
      { title: "Personal Info", items: ["Display name & Bio", "Profile image"] },
      { title: "Security", items: ["Password updates", "Account security"] }
    ]
  },
];
