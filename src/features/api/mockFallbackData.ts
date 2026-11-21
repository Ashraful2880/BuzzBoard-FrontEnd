import type {
  Post,
  User,
  SeriesItem,
  AdCampaign,
  CommentItem,
  NotificationItem,
} from "@/types";

export const DEMO_AUTHOR: User = {
  _id: "678900000000000000000001",
  name: "Md Ashraful Islam",
  email: "contact.ashraful1@gmail.com",
  role: "admin",
  bio: "Senior Frontend & Full-Stack Engineer (5+ yrs) shipping production SaaS, Fintech, and Enterprise ERP platforms with React, Next.js, Fastify & Node.js.",
  website: "https://ashrafulislam.netlify.app",
  isVerified: true,
  followersCount: 1420,
  followingCount: 86,
  socialLinks: {
    github: "https://github.com/ashraful2880",
    linkedin: "https://linkedin.com/in/islam-ashraful1",
  },
};

export const FALLBACK_POSTS: Post[] = [
  {
    _id: "678900000000000000000101",
    title:
      "Architecting Multi-Tenant Cloud ERP Systems with Fastify, PostgreSQL & Redis",
    slug: "architecting-multi-tenant-cloud-erp-systems-fastify-101",
    excerpt:
      "How we designed row-level tenant isolation, RBAC permission pipelines, and AI-driven predictive stock forecasting for high-throughput enterprise workloads.",
    content: `Building a production-grade Multi-Tenant Cloud ERP requires strict tenant isolation, predictable sub-50ms query latency, and rock-solid Role-Based Access Control (RBAC).

## 1. Tenant Context & Request Lifecycle
Every incoming API request passes through a lightweight Fastify preHandler hook that resolves the tenant identifier from the signed JWT claims and attaches a scoped Prisma/PostgreSQL transaction context.

## 2. Redis Caching & BullMQ Background Workers
By offloading invoice PDF generation, webhook retries, and AI stock forecasting to BullMQ workers backed by Redis, main thread p99 latency dropped by 42%.

## 3. Predictive Inventory Intelligence
Integrating LLM-assisted demand analysis allows store owners to detect damaged stock anomalies and seasonal reorder points automatically before stockouts occur.`,
    author: DEMO_AUTHOR,
    category: "Technology",
    tags: ["fastify", "postgresql", "redis", "saas", "architecture"],
    status: "published",
    readingTime: 6,
    isAdSafe: true,
    aiAssisted: true,
    aiSummary:
      "TL;DR — Architecting Multi-Tenant Cloud ERP Systems:\n• Enforce strict tenant isolation and RBAC at the middleware & database query layer.\n• Offload heavy invoicing and AI forecasting workloads to BullMQ & Redis queues.\n• Use predictive stock analytics to prevent inventory stockouts in real time.",
    likes: [],
    likesCount: 128,
    reactions: { love: 42, fire: 67, insightful: 54, clap: 190 },
    commentsCount: 14,
    views: 3420,
    liveReaders: 9,
    engagementRate: 12.8,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "678900000000000000000102",
    title: "Scaling Real-Time WebSockets & WebRTC for 50k+ Concurrent Profiles",
    slug: "scaling-real-time-websockets-webrtc-50k-profiles-102",
    excerpt:
      "Lessons learned from engineering real-time presence, instant messaging, and 100+ concurrent encrypted video consultations with Jitsi Meet and React 19.",
    content: `Real-time user experiences demand resilient connection management, optimistic UI updates, and graceful reconnection strategies.

## 1. Optimistic State Synchronization with RTK Query
Combining RTK Query cache updates with WebSocket event streams eliminates duplicate network requests and keeps unread counters synchronized across browser tabs.

## 2. WebRTC Video Consultation Architecture
Integrating Jitsi Meet with short-lived room tokens and RESTful session handshakes enabled encrypted 1-on-1 consultations at scale without dropping frames on mobile networks.`,
    author: DEMO_AUTHOR,
    category: "Technology",
    tags: ["websockets", "webrtc", "react", "rtk-query", "performance"],
    status: "published",
    readingTime: 5,
    isAdSafe: true,
    aiAssisted: false,
    likes: [],
    likesCount: 94,
    reactions: { love: 31, fire: 49, insightful: 38, clap: 145 },
    commentsCount: 8,
    views: 2190,
    liveReaders: 6,
    engagementRate: 11.4,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: "678900000000000000000103",
    title:
      "Eliminating Duplicate Network Requests: Redux Toolkit & RTK Query in Fintech",
    slug: "eliminating-duplicate-network-requests-rtk-query-fintech-103",
    excerpt:
      "A practical breakdown of how refactoring legacy state fetching to RTK Query improved fintech dashboard page load speeds by 35% while enforcing strict data security.",
    content: `In high-traffic fintech platforms, redundant API calls slow down interactive loan calculators and degrade Core Web Vitals.

## 1. Automated Cache Deduplication
RTK Query automatically deduplicates identical in-flight requests across multiple dashboard widgets, cutting bandwidth overhead by 35%.

## 2. Fine-Grained Tag Invalidation
Using entity-specific cache tags ensures that updating a single user portfolio refreshes only the affected financial comparison cards.`,
    author: DEMO_AUTHOR,
    category: "Business",
    tags: ["fintech", "redux-toolkit", "rtk-query", "core-web-vitals"],
    status: "published",
    readingTime: 4,
    isAdSafe: true,
    isSponsored: true,
    sponsorName: "ByShelp Cloud ERP",
    sponsorUrl: "https://byshelp.com",
    likes: [],
    likesCount: 76,
    reactions: { love: 19, fire: 35, insightful: 44, clap: 112 },
    commentsCount: 6,
    views: 1850,
    liveReaders: 4,
    engagementRate: 10.9,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export const FALLBACK_SERIES: SeriesItem[] = [
  {
    _id: "678900000000000000000201",
    title: "Production Full-Stack SaaS Engineering Masterclass",
    slug: "production-full-stack-saas-engineering-masterclass-201",
    description:
      "End-to-end architectural blueprint covering multi-tenant RBAC, RTK Query state caching, AI Co-Pilot integration, and Ad-Tech monetization.",
    author: DEMO_AUTHOR,
    category: "Technology",
    status: "ongoing",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    _id: "678900000000000000000202",
    title: "High-Performance React 19 & Core Web Vitals Deep Dive",
    slug: "high-performance-react-19-core-web-vitals-202",
    description:
      "Mastering bundle splitting, zero-layout-shift ad slots, and 60fps 3D spatial interfaces.",
    author: DEMO_AUTHOR,
    category: "Technology",
    status: "ongoing",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];

export const FALLBACK_ADS: AdCampaign[] = [
  {
    _id: "678900000000000000000301",
    title: "ByShelp — Multi-Tenant Cloud ERP with AI Stock Forecasting",
    sponsorName: "Madmind Digitals",
    targetUrl: "https://byshelp.com",
    description:
      "Automate invoicing, damaged stock tracking, RBAC, and predictive inventory analytics in one unified cloud platform.",
    ctaText: "Explore ByShelp ERP",
    placement: "in_article",
    targetCategories: ["Technology", "Business", "All"],
    status: "active",
    impressions: 4820,
    clicks: 312,
    ctr: 6.47,
    budget: 500,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "678900000000000000000302",
    title: "Hire Senior React, Next.js & Node.js Engineering Talent",
    sponsorName: "Ashraful Islam Portfolio",
    targetUrl: "https://ashrafulislam.netlify.app",
    description:
      "5+ years shipping production Fintech, SaaS & Enterprise ERP platforms. View live architectural case studies.",
    ctaText: "View Portfolio",
    placement: "sidebar",
    targetCategories: ["All"],
    status: "active",
    impressions: 3190,
    clicks: 245,
    ctr: 7.68,
    budget: 300,
    createdAt: new Date().toISOString(),
  },
];

export const FALLBACK_COMMENTS: CommentItem[] = [
  {
    _id: "678900000000000000000401",
    post: "678900000000000000000101",
    author: {
      _id: "678900000000000000000009",
      name: "Tanvir Hasan",
      email: "tanvir@example.com",
      role: "user",
      bio: "Backend Architect",
    },
    content:
      "The BullMQ + Redis approach for offloading predictive stock forecasting is super clean. How did you handle tenant-level rate limiting?",
    likesCount: 7,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    replies: [
      {
        _id: "678900000000000000000402",
        post: "678900000000000000000101",
        parentComment: "678900000000000000000401",
        author: DEMO_AUTHOR,
        content:
          "Thanks Tanvir! We used a sliding-window key per tenantId in Redis so a single heavy tenant never starves shared worker queues.",
        likesCount: 4,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
  },
];

export const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: "678900000000000000000501",
    recipient: DEMO_AUTHOR._id,
    sender: { _id: "678900000000000000000009", name: "Tanvir Hasan" },
    type: "comment",
    post: {
      _id: FALLBACK_POSTS[0]._id,
      title: FALLBACK_POSTS[0].title,
      slug: FALLBACK_POSTS[0].slug,
    },
    message: `Tanvir Hasan commented on "${FALLBACK_POSTS[0].title}"`,
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "678900000000000000000502",
    recipient: DEMO_AUTHOR._id,
    sender: { _id: "678900000000000000000010", name: "Nusrat Jahan" },
    type: "reaction",
    post: {
      _id: FALLBACK_POSTS[1]._id,
      title: FALLBACK_POSTS[1].title,
      slug: FALLBACK_POSTS[1].slug,
    },
    message: `Nusrat Jahan reacted (fire) to "${FALLBACK_POSTS[1].title}"`,
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];
