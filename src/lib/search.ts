import { ArticleMetadata, getArticles, getArticleBySlug } from './mdx';

export interface SearchResult {
  metadata: ArticleMetadata;
  score: number;
  matches: string[];
}

export function searchArticles(query: string): SearchResult[] {
  if (!query) {
    return getArticles().map(article => ({ metadata: article, score: 0, matches: [] }));
  }

  const terms = query.toLowerCase().trim().split(/\s+/);
  const articles = getArticles();
  const results: SearchResult[] = [];

  articles.forEach((metadata) => {
    let score = 0;
    const matches: string[] = [];
    
    // Fetch content to index body as well
    const fullArticle = getArticleBySlug(metadata.slug);
    const bodyContent = fullArticle ? fullArticle.content.toLowerCase() : "";

    const titleLower = metadata.title.toLowerCase();
    const descLower = metadata.description.toLowerCase();
    const categoryLower = metadata.category.toLowerCase();
    const tagsLower = metadata.tags.map(t => t.toLowerCase());

    terms.forEach((term) => {
      let termMatched = false;

      // Title matches (highest weight)
      if (titleLower.includes(term)) {
        score += 15;
        termMatched = true;
        if (!matches.includes('title')) matches.push('title');
      }

      // Description matches
      if (descLower.includes(term)) {
        score += 5;
        termMatched = true;
        if (!matches.includes('description')) matches.push('description');
      }

      // Category matches
      if (categoryLower.includes(term)) {
        score += 8;
        termMatched = true;
        if (!matches.includes('category')) matches.push('category');
      }

      // Tag matches
      const tagMatch = tagsLower.some(t => t.includes(term));
      if (tagMatch) {
        score += 8;
        termMatched = true;
        if (!matches.includes('tags')) matches.push('tags');
      }

      // Content matches (lowest weight)
      if (bodyContent.includes(term)) {
        score += 2;
        termMatched = true;
        if (!matches.includes('content')) matches.push('content');
      }
    });

    if (score > 0) {
      results.push({
        metadata,
        score,
        matches
      });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}
