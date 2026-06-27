import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

export interface ArticleMetadata {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  readingTime?: number;
  affiliateLinks?: string[];
  schema?: string[];
  slug: string;
}

export interface Article {
  metadata: ArticleMetadata;
  content: string;
}

// Calculate reading time based on word count
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

// Read all articles and sort them by date (newest first)
export function getArticles(): ArticleMetadata[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR);
  
  const articles = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(CONTENT_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      return {
        ...data,
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        author: data.author || 'Anonymous',
        category: data.category || 'General',
        tags: data.tags || [],
        featured: !!data.featured,
        coverImage: data.coverImage || '/images/blog/default-cover.jpg',
        readingTime: data.readingTime || calculateReadingTime(content),
        affiliateLinks: data.affiliateLinks || [],
        schema: data.schema || ['Article'],
      } as ArticleMetadata;
    });

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Fetch a single article by its slug
export function getArticleBySlug(slug: string): Article | null {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const metadata: ArticleMetadata = {
      ...data,
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Anonymous',
      category: data.category || 'General',
      tags: data.tags || [],
      featured: !!data.featured,
      coverImage: data.coverImage || '/images/blog/default-cover.jpg',
      readingTime: data.readingTime || calculateReadingTime(content),
      affiliateLinks: data.affiliateLinks || [],
      schema: data.schema || ['Article'],
    };

    return { metadata, content };
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error);
    return null;
  }
}

// Fetch related articles based on category and tags
export function getRelatedArticles(currentSlug: string, category: string, tags: string[] = [], limit = 3): ArticleMetadata[] {
  const allArticles = getArticles();
  
  return allArticles
    .filter((article) => article.slug !== currentSlug) // Exclude current article
    .map((article) => {
      let score = 0;
      if (article.category.toLowerCase() === category.toLowerCase()) {
        score += 5; // Direct category match
      }
      
      // Calculate matching tags
      const matchingTags = article.tags.filter(t => tags.map(item => item.toLowerCase()).includes(t.toLowerCase()));
      score += matchingTags.length * 2;
      
      return { article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.article)
    .slice(0, limit);
}

// Get list of unique categories
export function getCategories(): { name: string; slug: string; count: number }[] {
  const articles = getArticles();
  const counts: Record<string, number> = {};
  
  articles.forEach((a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    count
  }));
}

// Get list of unique tags
export function getTags(): { name: string; slug: string; count: number }[] {
  const articles = getArticles();
  const counts: Record<string, number> = {};

  articles.forEach((a) => {
    a.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    count
  }));
}

export interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

export function extractHeadings(content: string): HeadingItem[] {
  // Regex to match markdown headings (H2 ## and H3 ###)
  const headingRegex = /^(##|###)\s+(.*)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    
    // Convert to URL-friendly slug
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    headings.push({ text, id, level });
  }

  return headings;
}

