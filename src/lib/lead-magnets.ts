export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "zip" | "notion" | "email-course";
  fileUrl: string;
  thumbnail: string;
  category: string;
  emailRequired: boolean;
  convertKitTag?: string;
}

export const leadMagnets: Record<string, LeadMagnet> = {
  "geo-checklist": {
    id: "geo-checklist",
    title: "The Complete GEO Checklist 2026",
    description: "25 actionable steps to optimize your brand for AI search engines like ChatGPT and Perplexity.",
    type: "pdf",
    fileUrl: "/downloads/geo-checklist-2026.pdf",
    thumbnail: "/images/lead-magnets/checklist-thumb.jpg",
    category: "GEO Fundamentals",
    emailRequired: true,
    convertKitTag: "lead-magnet-checklist"
  },
  "llms-templates": {
    id: "llms-templates",
    title: "llms.txt Template Pack",
    description: "10 ready-to-use llms.txt and llms-full.txt templates for any niche or industry.",
    type: "zip",
    fileUrl: "/downloads/llms-templates.zip",
    thumbnail: "/images/lead-magnets/llms-thumb.jpg",
    category: "Technical",
    emailRequired: true,
    convertKitTag: "lead-magnet-llms"
  },
  "schema-snippets": {
    id: "schema-snippets",
    title: "Schema.org JSON-LD Snippet Library",
    description: "50+ copy-paste schema snippets (Article, FAQ, HowTo, Product) for maximum AI citation.",
    type: "zip",
    fileUrl: "/downloads/schema-snippets.zip",
    thumbnail: "/images/lead-magnets/schema-thumb.jpg",
    category: "Technical",
    emailRequired: true,
    convertKitTag: "lead-magnet-schema"
  }
};
