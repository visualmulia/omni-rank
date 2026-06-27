export const siteConfig = {
  name: "OmniRank",
  description: "AI Visibility Intelligence for Indie Hackers & SME. Audit, optimize, and track your brand's presence in ChatGPT, Perplexity, Gemini, and Claude.",
  url: "https://omnirank.web.id",
  ogImage: "https://omnirank.web.id/og/default.jpg",
  author: {
    name: "Ardyan Permana",
    url: "https://omnirank.web.id/about",
    avatar: "/images/blog/authors/ardyan.jpg",
    bio: "Tech founder, SEO/GEO researcher, and full-stack developer passionate about helping indie hackers and local businesses rank in the AI search era.",
    socials: {
      twitter: "https://twitter.com/ardyan_permana",
      linkedin: "https://linkedin.com/in/ardyan-permana",
      github: "https://github.com/ardyan-permana",
    }
  },
  defaultSEO: {
    title: "OmniRank Blog | Generative Engine Optimization (GEO) & SEO Guides",
    description: "Complete and actionable technical guides to ranking your site on ChatGPT, Perplexity, Gemini, and Claude.",
  }
};

export type SiteConfig = typeof siteConfig;
