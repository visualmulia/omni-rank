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
