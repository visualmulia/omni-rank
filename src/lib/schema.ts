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
  if (article.slug === 'what-is-geo') {
    const url = `${siteConfig.url}/blog/${article.slug}`;
    const coverImageUrl = article.coverImage ? `${siteConfig.url}${article.coverImage}` : `${siteConfig.url}/images/blog/what-is-geo.jpg`;

    return [
      // 1. ARTICLE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "What is Generative Engine Optimization (GEO)?",
        "description": "Learn what Generative Engine Optimization (GEO) is, why it matters in 2026, and how to optimize your brand for AI search engines like ChatGPT, Perplexity, and Gemini.",
        "image": {
          "@type": "ImageObject",
          "url": coverImageUrl,
          "width": 1200,
          "height": 630
        },
        "author": {
          "@type": "Person",
          "name": "Ardyan Permana",
          "url": "https://www.linkedin.com/in/ardyanpermana/",
          "jobTitle": "Founder, OnmiRank",
          "description": "Tech founder, SEO/GEO researcher, and full-stack developer passionate about helping indie hackers and local businesses rank in the AI search era."
        },
        "publisher": {
          "@type": "Organization",
          "name": "OnmiRank",
          "url": siteConfig.url,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteConfig.url}/logo.png`,
            "width": 512,
            "height": 512
          },
          "sameAs": [
            "https://twitter.com/onmirank",
            "https://linkedin.com/company/onmirank",
            "https://github.com/onmirank"
          ]
        },
        "datePublished": "2026-06-30T00:00:00+07:00",
        "dateModified": "2026-06-30T00:00:00+07:00",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "articleSection": "GEO Fundamentals",
        "wordCount": 1800,
        "inLanguage": "en-US",
        "isAccessibleForFree": true,
        "educationalLevel": "beginner",
        "audience": {
          "@type": "Audience",
          "audienceType": "Digital marketers, solo developers, content creators, SEO professionals"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Generative Engine Optimization",
            "alternateName": "GEO",
            "description": "The practice of optimizing content for AI search engines like ChatGPT and Perplexity"
          },
          {
            "@type": "Thing",
            "name": "AI Search",
            "description": "Search engines that use large language models to generate answers"
          }
        ]
      },
      // 2. FAQPAGE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is GEO and how is it different from SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "GEO (Generative Engine Optimization) is the practice of optimizing your content to be discovered, cited, and trusted by AI search engines like ChatGPT, Perplexity, and Gemini. While SEO focuses on ranking in traditional search engines like Google, GEO focuses on being the source that AI engines cite when generating answers. Key differences: SEO targets blue links rankings, GEO targets AI citations; SEO uses keywords, GEO uses answer-first content; SEO needs backlinks, GEO needs schema and brand entity."
            }
          },
          {
            "@type": "Question",
            "name": "Why does GEO matter in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "GEO matters because 60% of AI searches end without a click, only 16% of brands appear in AI-generated answers, and AI traffic converts at 14.2% — nearly 5x higher than traditional organic traffic. As AI search engines like ChatGPT, Perplexity, and Gemini become primary information sources, brands that are not optimized for AI search will become invisible to their target audience."
            }
          },
          {
            "@type": "Question",
            "name": "What are the 3 pillars of GEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The 3 pillars of GEO are: (1) Technical Signals — ensuring AI crawlers can access your site, implementing schema markup, and creating AI-specific files like llms.txt; (2) Content Structure — using answer-first format, self-contained units (SCUs), and evidence-based writing with statistics every 150-200 words; (3) Brand Entity — maintaining NAP consistency, building third-party presence, and establishing authority signals across platforms."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take for GEO to work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most websites see initial AI citation improvements within 4-8 weeks of implementing GEO best practices. Full results typically appear within 3 months. However, this depends on your starting point — sites with existing SEO foundations see faster results, while new sites may need 6 months to build sufficient authority signals."
            }
          },
          {
            "@type": "Question",
            "name": "Can I do GEO without technical skills?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, basic GEO can be implemented without coding. Content optimization (answer-first structure, FAQ sections, evidence-based writing) requires no technical skills. Technical GEO (schema markup, llms.txt, AI.txt) requires minimal technical knowledge that most marketers can learn. Tools like OnmiRank can automate technical GEO implementation, allowing non-technical users to optimize for AI search."
            }
          }
        ]
      },
      // 3. BREADCRUMB SCHEMA
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
            "name": "GEO Fundamentals",
            "item": `${siteConfig.url}/blog/category/geo-fundamentals`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "What is Generative Engine Optimization (GEO)?",
            "item": url
          }
        ]
      },
      // 4. WEBPAGE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "What is Generative Engine Optimization (GEO)?",
        "description": "Learn what GEO is, why it matters in 2026, and how to optimize for AI search engines.",
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
              "name": "What is GEO?",
              "item": url
            }
          ]
        },
        "mainEntity": {
          "@type": "Article",
          "headline": "What is Generative Engine Optimization (GEO)?"
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".article-title", ".article-body"]
        }
      },
      // 5. SOFTWARE APPLICATION SCHEMA (OnmiRank Tool)
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
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "42"
        },
        "operatingSystem": "Web",
        "description": "AI Visibility Intelligence platform that helps websites analyze their GEO scores and discover technical improvements for AI citation."
      }
    ];
  }

  if (article.slug === 'geo-vs-seo') {
    const url = `${siteConfig.url}/blog/${article.slug}`;
    const coverImageUrl = article.coverImage ? `${siteConfig.url}${article.coverImage}` : `${siteConfig.url}/images/blog/geo-vs-seo.jpg`;

    return [
      // 1. ARTICLE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "GEO vs SEO: The Key Differences You Need to Know",
        "description": "Is traditional SEO dead? Compare search engine optimization with generative engine optimization side-by-side. Learn the key differences and how to rank in both.",
        "image": {
          "@type": "ImageObject",
          "url": coverImageUrl,
          "width": 1200,
          "height": 630
        },
        "author": {
          "@type": "Person",
          "name": "Ardyan Permana",
          "url": "https://www.linkedin.com/in/ardyanpermana/",
          "jobTitle": "Founder, OnmiRank",
          "description": "Tech founder, SEO/GEO researcher, and full-stack developer passionate about helping indie hackers and local businesses rank in the AI search era."
        },
        "publisher": {
          "@type": "Organization",
          "name": "OnmiRank",
          "url": siteConfig.url,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteConfig.url}/logo.png`,
            "width": 512,
            "height": 512
          },
          "sameAs": [
            "https://twitter.com/onmirank",
            "https://linkedin.com/company/onmirank",
            "https://github.com/onmirank"
          ]
        },
        "datePublished": "2026-07-02T00:00:00+07:00",
        "dateModified": "2026-07-02T00:00:00+07:00",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "articleSection": "Technical",
        "wordCount": 1650,
        "inLanguage": "en-US",
        "isAccessibleForFree": true,
        "educationalLevel": "intermediate",
        "audience": {
          "@type": "Audience",
          "audienceType": "Digital marketers, solo developers, content creators, SEO professionals"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Generative Engine Optimization",
            "alternateName": "GEO",
            "description": "The practice of optimizing content for AI search engines like ChatGPT and Perplexity"
          },
          {
            "@type": "Thing",
            "name": "Search Engine Optimization",
            "alternateName": "SEO",
            "description": "The practice of optimizing websites to rank on Google search results"
          }
        ]
      },
      // 2. FAQPAGE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the main difference between GEO and SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SEO optimizes for traditional search engines like Google to rank in blue links, whereas GEO (Generative Engine Optimization) optimizes for AI search engines like ChatGPT, Gemini, and Perplexity to get cited as a source in generated answers."
            }
          },
          {
            "@type": "Question",
            "name": "Does GEO replace traditional SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, GEO does not replace SEO. They are complementary. SEO drives clicks through organic listings, while GEO drives visibility and trust through AI citations. A successful strategy integrates both."
            }
          },
          {
            "@type": "Question",
            "name": "What is the click-through rate of AI search citations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI search citations drive highly qualified traffic. While many queries end without a click, traffic coming from AI citations has a 14.2% conversion rate, which is nearly 5 times higher than traditional organic search traffic."
            }
          },
          {
            "@type": "Question",
            "name": "How do AI engines select websites to cite?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI engines select sources based on relevance, factual accuracy, schema markup metadata, presence of statistics, and overall brand authority. Structuring content in Self-Contained Units (SCUs) makes it easier for AI to extract and cite."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use SEO tools like Surfer SEO for GEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Traditional SEO tools help optimize readability and keyword relevance, which AI engines still value. However, you must supplement them with GEO techniques like adding schema markup, creating an llms.txt file, and writing in an answer-first format."
            }
          }
        ]
      },
      // 3. BREADCRUMB SCHEMA
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
            "name": "GEO vs SEO: The Key Differences",
            "item": url
          }
        ]
      },
      // 4. WEBPAGE SCHEMA
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "GEO vs SEO: The Key Differences You Need to Know",
        "description": "Compare search engine optimization with generative engine optimization side-by-side. Learn the key differences and how to rank in both.",
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
              "name": "GEO vs SEO",
              "item": url
            }
          ]
        },
        "mainEntity": {
          "@type": "Article",
          "headline": "GEO vs SEO: The Key Differences You Need to Know"
        }
      },
      // 5. SOFTWARE APPLICATION SCHEMA (OnmiRank Tool)
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
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "42"
        },
        "operatingSystem": "Web",
        "description": "AI Visibility Intelligence platform that helps websites analyze their GEO scores and discover technical improvements for AI citation."
      }
    ];
  }

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
