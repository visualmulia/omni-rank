import { ArticleMetadata } from './mdx';
import { siteConfig } from '@/config/site';

// Clean schema text to avoid syntax issues
function cleanText(text: string): string {
  return text.replace(/<[^>]*>/g, '').replace(/"/g, '\\"').trim();
}

// Generate the primary Article schema
export function generateArticleSchema(article: ArticleMetadata) {
  const url = `${siteConfig.url}/blog/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.coverImage ? `${siteConfig.url}${article.coverImage}` : siteConfig.ogImage,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": siteConfig.author.url,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

// Generate FAQPage schema by parsing FAQ component in MDX content
export function generateFAQSchema(content: string) {
  const faqItems: { question: string; answer: string }[] = [];
  
  // Regex to extract FAQ item objects like { question: "...", answer: "..." }
  const faqRegex = /{\s*question:\s*["']([\s\S]*?)["']\s*,\s*answer:\s*["']([\s\S]*?)["']\s*}/g;
  let match;
  
  while ((match = faqRegex.exec(content)) !== null) {
    faqItems.push({
      question: cleanText(match[1]),
      answer: cleanText(match[2])
    });
  }

  if (faqItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

// Generate HowTo schema by parsing "### Step X: ..." in MDX content
export function generateHowToSchema(article: ArticleMetadata, content: string) {
  const steps: { name: string; text: string; position: number }[] = [];
  
  // Regex to find "### Step X: Title" followed by paragraph text until the next heading or element
  // Or just find the headings
  const stepRegex = /### Step (\d+):\s*(.*)/g;
  let match;
  
  while ((match = stepRegex.exec(content)) !== null) {
    const position = parseInt(match[1], 10);
    const name = cleanText(match[2]);
    
    // Attempt to extract the text of this step (content following the heading until the next heading or empty line)
    const index = match.index + match[0].length;
    const remainingText = content.substring(index).trim();
    const nextHeadingIndex = remainingText.search(/(##|###|---|<LeadMagnet|<FAQ|<OnmiRankAuditCTA)/);
    const stepText = nextHeadingIndex !== -1 
      ? remainingText.substring(0, nextHeadingIndex).trim() 
      : remainingText.trim();

    steps.push({
      name,
      text: cleanText(stepText.substring(0, 150) + (stepText.length > 150 ? '...' : '')),
      position
    });
  }

  if (steps.length === 0) return null;

  const url = `${siteConfig.url}/blog/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": article.title,
    "description": article.description,
    "step": steps
      .sort((a, b) => a.position - b.position)
      .map((step) => ({
        "@type": "HowToStep",
        "name": step.name,
        "text": step.text,
        "url": `${url}#step-${step.position}`,
        "position": step.position
      }))
  };
}

// Helper to bundle all relevant schemas for a given post
export function getSchemasForArticle(article: ArticleMetadata, content: string): any[] {
  if (article.slug === 'how-to-write-llms-txt') {
    const url = `${siteConfig.url}/blog/${article.slug}`;
    const coverImageUrl = article.coverImage ? `${siteConfig.url}${article.coverImage}` : `${siteConfig.url}/images/blog/llms-txt-guide.jpg`;

    return [
      // 1. ARTICLE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Write an llms.txt File for Your Website",
        "description": "A practical, step-by-step guide to creating an llms.txt file for your website to improve AI search visibility.",
        "image": coverImageUrl,
        "author": {
          "@type": "Person",
          "name": "Ardyan Permana",
          "url": "https://www.linkedin.com/in/ardyanpermana/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "OnmiRank",
          "url": siteConfig.url,
          "logo": `${siteConfig.url}/logo.png`
        },
        "datePublished": "2026-07-05T00:00:00+07:00",
        "dateModified": "2026-07-05T00:00:00+07:00",
        "mainEntityOfPage": url
      },
      // 2. HOWTO SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Write an llms.txt File for Your Website",
        "description": "Learn how to create and deploy an llms.txt file to help AI search engines understand your website.",
        "totalTime": "PT10M",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "0"
        },
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Create a plain text file named llms.txt",
            "text": "Create a new file named llms.txt and place it in the public folder so it resolves at yoursite.com/llms.txt.",
            "url": `${url}#step-1`
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Write a summary of your website",
            "text": "Start with a single level-1 heading followed by a short paragraph explaining what your site is.",
            "url": `${url}#step-2`
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Outline key pages and documentation",
            "text": "Use bullet points and markdown links to list your most important pages.",
            "url": `${url}#step-3`
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Validate and deploy your file",
            "text": "Ensure the file has no broken links, then push it to production.",
            "url": `${url}#step-4`
          }
        ]
      },
      // 3. FAQPAGE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is llms.txt officially supported by AI search engines?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "llms.txt is a proposed standard by Anthropic and has been adopted by several major AI crawlers including ClaudeBot, GPTBot, and PerplexityBot."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need both robots.txt and llms.txt?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. robots.txt controls crawler access; llms.txt guides AI crawlers on what content to prioritize. They serve complementary purposes."
            }
          },
          {
            "@type": "Question",
            "name": "How often should I update my llms.txt file?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Update whenever you add major new sections or change your core offering. Review quarterly as a best practice."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between llms.txt and llms-full.txt?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "llms.txt provides a concise summary. llms-full.txt contains complete content of important pages, allowing AI crawlers to ingest full context."
            }
          },
          {
            "@type": "Question",
            "name": "Will llms.txt improve my visibility in ChatGPT and Perplexity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While not a guarantee, llms.txt significantly improves your chances by helping AI crawlers understand your site quickly. Combined with other GEO practices, it can boost AI citation rates."
            }
          }
        ]
      },
      // 4. BREADCRUMB SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteConfig.url
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${siteConfig.url}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Technical",
            "item": `${siteConfig.url}/blog/category/technical`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "How to Write an llms.txt File",
            "item": url
          }
        ]
      },
      // 5. ORGANIZATION SCHEMA (Global)
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "OnmiRank",
        "url": siteConfig.url,
        "logo": `${siteConfig.url}/logo.png`,
        "description": "AI Visibility Intelligence for Indie Hackers & UMKM.",
        "sameAs": [
          "https://twitter.com/onmirank",
          "https://linkedin.com/company/onmirank",
          "https://github.com/onmirank"
        ]
      },
      // 6. WEBPAGE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "How to Write an llms.txt File for Your Website",
        "description": "A practical guide to creating an llms.txt file for AI search visibility.",
        "url": url,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": siteConfig.url
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": `${siteConfig.url}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "How to Write an llms.txt File",
              "item": url
            }
          ]
        }
      },
      // 7. SOFTWARE APPLICATION SCHEMA (OnmiRank Tool)
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "OnmiRank",
        "applicationCategory": "SEOApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "operatingSystem": "Web",
        "description": "AI Visibility Intelligence platform that helps websites analyze their GEO scores."
      }
    ];
  }

  const schemas: any[] = [];
  
  // 1. Article is always generated
  schemas.push(generateArticleSchema(article));
  
  // 2. FAQPage if frontmatter has schema FAQPage or content has <FAQ
  if ((article.schema && article.schema.includes('FAQPage')) || content.includes('<FAQ')) {
    const faqSchema = generateFAQSchema(content);
    if (faqSchema) schemas.push(faqSchema);
  }
  
  // 3. HowTo if frontmatter has schema HowTo or content has "Step 1:"
  if ((article.schema && article.schema.includes('HowTo')) || content.includes('Step 1:')) {
    const howToSchema = generateHowToSchema(article, content);
    if (howToSchema) schemas.push(howToSchema);
  }

  return schemas;
}
