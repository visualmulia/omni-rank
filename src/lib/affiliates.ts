export interface Affiliate {
  id: string;
  name: string;
  url: string;
  displayText: string;
  description: string;
  commission: string;
  category: string;
  active: boolean;
  utmParams?: Record<string, string>;
}

export const affiliates: Record<string, Affiliate> = {
  "surfer-seo": {
    id: "surfer-seo",
    name: "Surfer SEO",
    url: "https://surferseo.com",
    displayText: "Surfer SEO",
    description: "Content optimization and SEO tool built to help you write high-ranking content.",
    commission: "25% recurring",
    category: "SEO Tools",
    active: true,
    utmParams: { ref: "onmirank", utm_source: "blog" }
  },
  "notion-ai": {
    id: "notion-ai",
    name: "Notion AI",
    url: "https://notion.so/product/ai",
    displayText: "Notion AI",
    description: "AI-powered workspace and planning assistant that boosts note-taking and formatting.",
    commission: "50% first year",
    category: "Productivity",
    active: true,
    utmParams: { ref: "onmirank" }
  },
  "writesonic": {
    id: "writesonic",
    name: "Writesonic",
    url: "https://writesonic.com",
    displayText: "Writesonic",
    description: "AI writing assistant focused on blogs, articles, ads, and product descriptions.",
    commission: "30% recurring",
    category: "AI Writing",
    active: true,
    utmParams: { ref: "onmirank" }
  }
};
