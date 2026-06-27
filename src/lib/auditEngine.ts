import { CrawledData } from './crawler';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AuditResult {
  overallScore: number;
  grade: string;
  technicalScore: number;
  contentScore: number;
  brandScore: number;
  freshnessScore: number;
  summary: string;
  categoryDetails: {
    technical: CategoryDetail;
    content: CategoryDetail;
    brand: CategoryDetail;
    freshness: CategoryDetail;
  };
  actionItems: ActionItemSuggestion[];
  suggestedKeywords: { keyword: string; strategy: string }[];
}

export interface CategoryDetail {
  score: number;
  maxScore: number;
  findings: string[];
  recommendations: string;
}

export interface ActionItemSuggestion {
  title: string;
  description: string;
  category: 'technical' | 'content' | 'brand' | 'freshness';
  impact: 'high' | 'medium' | 'low';
  effort: 'quick' | 'medium' | 'complex';
  estimatedScoreGain: number;
}

export async function runAudit(data: CrawledData): Promise<AuditResult> {
  // 1. Calculate base algorithmic scores
  
  // pilars: Technical (25%), Content (30%), Brand (25%), Freshness (20%)
  
  // -- A. Technical Score (Max 100)
  let technicalScore = 0;
  const techFindings: string[] = [];
  
  if (data.robotsTxt.exists) {
    if (data.robotsTxt.blocksAi) {
      techFindings.push('Critical: robots.txt is present but disallows AI crawlers (like GPTBot, ClaudeBot, etc.).');
    } else {
      technicalScore += 30;
      techFindings.push('robots.txt is present and allows AI crawlers.');
    }
  } else {
    techFindings.push('robots.txt is missing from root domain.');
  }

  if (data.llmsTxt.exists) {
    technicalScore += 30;
    techFindings.push('llms.txt content guide for LLMs is present.');
  } else {
    techFindings.push('llms.txt is missing. Creating this file helps LLMs index your most important pages.');
  }

  if (data.aiTxt.exists) {
    technicalScore += 20;
    techFindings.push('ai.txt purpose-based crawler control file is present.');
  } else {
    techFindings.push('ai.txt is missing.');
  }

  if (data.pageData.schemas.length > 0) {
    technicalScore += 20;
    techFindings.push(`Schema.org markup detected: Found ${data.pageData.schemas.length} schema definitions.`);
  } else {
    techFindings.push('No Structured Data (Schema.org JSON-LD) detected on the homepage.');
  }

  // -- B. Content Score (Max 100)
  let contentScore = 0;
  const contentFindings: string[] = [];

  const headersCount = data.pageData.h1s.length + data.pageData.h2s.length + data.pageData.h3s.length;
  if (headersCount >= 3) {
    contentScore += 20;
    contentFindings.push('Healthy heading structure hierarchy (H1, H2, H3 tags).');
  } else {
    contentFindings.push('Poor heading usage. Standardize structure with H1 and nested H2/H3 tags.');
  }

  // Question-based headers
  const qHeaders = [...data.pageData.h2s, ...data.pageData.h3s].filter(h => h.endsWith('?'));
  if (qHeaders.length > 0) {
    contentScore += 25;
    contentFindings.push(`Question-based headers detected: Found ${qHeaders.length} headers phrased as questions.`);
  } else {
    contentFindings.push('No question-based headers detected. AI engines frequently answer query prompts that match question headers.');
  }

  // Comparison tables
  if (data.pageData.tablesCount > 0) {
    contentScore += 25;
    contentFindings.push('Comparison or structured data tables found.');
  } else {
    contentFindings.push('No comparison tables detected. AI models prefer tabular data for comparing features or pricing.');
  }

  // Text length / evidence base
  if (data.pageData.wordCount >= 400) {
    contentScore += 30;
    contentFindings.push(`Good content length (${data.pageData.wordCount} words) allowing for deep knowledge extraction.`);
  } else {
    contentFindings.push(`Content is thin (${data.pageData.wordCount} words). Thin content is harder for LLMs to cite.`);
  }

  // -- C. Brand Entity Score (Max 100)
  let brandScore = 0;
  const brandFindings: string[] = [];

  // Check if organization or product schema exists
  const hasOrgSchema = data.pageData.schemas.some(s => 
    s['@type'] === 'Organization' || 
    s['@type'] === 'Brand' || 
    s['@type'] === 'Corporation' ||
    (Array.isArray(s['@type']) && s['@type'].some((t: string) => ['Organization', 'Brand', 'Corporation'].includes(t)))
  );

  if (hasOrgSchema) {
    brandScore += 40;
    brandFindings.push('Organization/Brand schema markup detected.');
    
    // Check sameAs property
    const orgWithSameAs = data.pageData.schemas.find(s => 
      (s['@type'] === 'Organization' || s['@type'] === 'Brand') && 
      (s['sameAs'] !== undefined && s['sameAs'] !== null)
    );
    if (orgWithSameAs) {
      brandScore += 30;
      brandFindings.push('sameAs identity properties link your brand to social profiles, Crunchbase, etc.');
    } else {
      brandFindings.push('Organization schema is missing sameAs attributes to link social/corporate profiles.');
    }
  } else {
    brandFindings.push('Organization schema is missing. AI engines struggle to identify corporate entity connections.');
  }

  // Simple NAP check (name, email/phone/address)
  const htmlLower = data.pageData.htmlContent.toLowerCase();
  const hasContact = htmlLower.includes('contact') || htmlLower.includes('hubungi') || htmlLower.includes('@') || /[\d-]{7,15}/.test(htmlLower);
  if (hasContact) {
    brandScore += 30;
    brandFindings.push('Contact and location identity signals detected on page.');
  } else {
    brandFindings.push('No clear contact channels or NAP consistency indicators found.');
  }

  // -- D. Freshness Score (Max 100)
  let freshnessScore = 0;
  const freshnessFindings: string[] = [];

  if (data.sitemapXml.exists) {
    freshnessScore += 20;
    freshnessFindings.push('sitemap.xml is active, assisting discovery of fresh content.');
  } else {
    freshnessFindings.push('sitemap.xml not detected.');
  }

  const hasDateModified = data.pageData.schemas.some(s => 
    s['dateModified'] !== undefined || 
    s['datePublished'] !== undefined || 
    s['uploadDate'] !== undefined
  ) || htmlLower.includes('datemodified') || htmlLower.includes('last updated') || htmlLower.includes('diperbarui');

  if (hasDateModified) {
    freshnessScore += 80;
    freshnessFindings.push('Time-context signals (dateModified / publish schema) are visible.');
  } else {
    freshnessFindings.push('No dateModified schema or update times detected. AI crawlers favor content with explicit freshness tags.');
  }

  // 2. Fetch AI-powered audit recommendations using Gemini 1.5 Flash (Google AI Studio Free Tier)
  const apiKey = process.env.GEMINI_API_KEY;
  let aiSummary = 'Detailed audit completed successfully. View the score breakdown and action items below to optimize for AI search visibility.';
  let aiActionItems: ActionItemSuggestion[] = [];
  let aiSuggestedKeywords: { keyword: string; strategy: string }[] = [];
  let aiTechnicalRecs = 'Optimize crawlability (robots.txt, llms.txt) and schema markup.';
  let aiContentRecs = 'Restructure content for answer-first patterns and evidence density.';
  let aiBrandRecs = 'Set up consistent NAP (Name, Address, Phone) signals across social profiles.';
  let aiFreshnessRecs = 'Include dateModified properties and maintain an updated sitemap.';

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const prompt = `
        You are a Generative Engine Optimization (GEO) auditing expert.
        Analyze the following crawl data of a website and output a JSON object advising them on how to optimize their website to be highly visible and cited in AI Search Engines (ChatGPT, Perplexity, Gemini, etc.).

        Crawl Details:
        - URL: ${data.url}
        - Domain: ${data.domain}
        - robots.txt Exists: ${data.robotsTxt.exists} (blocks AI: ${data.robotsTxt.blocksAi})
        - llms.txt Exists: ${data.llmsTxt.exists}
        - ai.txt Exists: ${data.aiTxt.exists}
        - sitemap.xml Exists: ${data.sitemapXml.exists}
        
        Page content summary:
        - Title: ${data.pageData.title}
        - Description: ${data.pageData.description}
        - Headers: H1s: [${data.pageData.h1s.slice(0, 5).join(', ')}], H2s: [${data.pageData.h2s.slice(0, 5).join(', ')}]
        - Content Sample (First few paragraphs):
          ${data.pageData.paragraphs.slice(0, 3).join('\n\n')}
        - Word Count: ${data.pageData.wordCount}
        - Comparison tables count: ${data.pageData.tablesCount}
        - Schemas (JSON-LD types): [${data.pageData.schemas.map(s => s['@type']).filter(Boolean).join(', ')}]

        Your output MUST be a valid JSON object matching the following structure:
        {
          "summary": "2-3 sentences overview of the website's AI search visibility readiness.",
          "technicalRecommendations": "Actionable feedback for technical files and schema structure.",
          "contentRecommendations": "Actionable feedback on copywriting, SCUs (self-contained units), answer-first structure.",
          "brandRecommendations": "Actionable feedback on NAP, sameAs properties, and entity representation.",
          "freshnessRecommendations": "Actionable feedback on update frequency and date signals.",
          "suggestedActionItems": [
            {
              "title": "Short title of action item",
              "description": "Clear step-by-step description of what to fix",
              "category": "technical" | "content" | "brand" | "freshness",
              "impact": "high" | "medium" | "low",
              "effort": "quick" | "medium" | "complex",
              "estimatedScoreGain": 5 to 25
            }
          ],
          "suggestedKeywords": [
            {
              "keyword": "suggested search keyword query phrase that would naturally lead to this website content",
              "strategy": "explain how they can optimize content to win citations for this query"
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsedAiData = JSON.parse(responseText);

      if (parsedAiData.summary) aiSummary = parsedAiData.summary;
      if (parsedAiData.technicalRecommendations) aiTechnicalRecs = parsedAiData.technicalRecommendations;
      if (parsedAiData.contentRecommendations) aiContentRecs = parsedAiData.contentRecommendations;
      if (parsedAiData.brandRecommendations) aiBrandRecs = parsedAiData.brandRecommendations;
      if (parsedAiData.freshnessRecommendations) aiFreshnessRecs = parsedAiData.freshnessRecommendations;
      if (Array.isArray(parsedAiData.suggestedActionItems)) {
        aiActionItems = parsedAiData.suggestedActionItems;
      }
      if (Array.isArray(parsedAiData.suggestedKeywords)) {
        aiSuggestedKeywords = parsedAiData.suggestedKeywords;
      }
    } catch (e) {
      console.error('Gemini API Audit Error:', e);
      // Fallback if AI Studio limits hit or parser fails
    }
  }

  // Combine algorithmic action items if AI didn't return any, or merge them
  const fallbackActionItems: ActionItemSuggestion[] = [];
  if (!data.robotsTxt.exists) {
    fallbackActionItems.push({
      title: 'Create a robots.txt File',
      description: 'Create a robots.txt file at your root domain and make sure it does not disallow GPTBot, ClaudeBot, and other AI agents.',
      category: 'technical',
      impact: 'high',
      effort: 'quick',
      estimatedScoreGain: 15
    });
  } else if (data.robotsTxt.blocksAi) {
    fallbackActionItems.push({
      title: 'Unblock AI Crawlers in robots.txt',
      description: 'Remove Disallow blocks for GPTBot, ClaudeBot, PerplexityBot, and Google-Extended to allow AI search engines to read your content.',
      category: 'technical',
      impact: 'high',
      effort: 'quick',
      estimatedScoreGain: 25
    });
  }

  if (!data.llmsTxt.exists) {
    fallbackActionItems.push({
      title: 'Implement llms.txt File',
      description: 'Create a markdown formatted llms.txt file containing key information about your site structure, services, and summaries. This acts as an optimization guide for LLMs.',
      category: 'technical',
      impact: 'medium',
      effort: 'quick',
      estimatedScoreGain: 15
    });
  }

  if (data.pageData.schemas.length === 0) {
    fallbackActionItems.push({
      title: 'Add Schema.org JSON-LD structured data',
      description: 'Add Organization and FAQ schemas inside the HTML <head> section to help AI index your entity correctly.',
      category: 'technical',
      impact: 'high',
      effort: 'medium',
      estimatedScoreGain: 20
    });
  }

  if (data.pageData.tablesCount === 0) {
    fallbackActionItems.push({
      title: 'Add Feature or Price Comparison Tables',
      description: 'Create markdown or HTML <table> grids summarizing comparisons or pricing. AI models are highly trained to crawl tables for quick comparison answers.',
      category: 'content',
      impact: 'medium',
      effort: 'medium',
      estimatedScoreGain: 15
    });
  }

  const finalActionItems = aiActionItems.length > 0 ? aiActionItems : fallbackActionItems;

  const brandName = data.domain.split('.')[0].toUpperCase();

  const fallbackKeywords = [
    {
      keyword: `best local ${brandName.toLowerCase()} services`,
      strategy: `Add an Organization schema and contact NAP details to rank for local searches.`
    },
    {
      keyword: `how to hire ${brandName.toLowerCase()} developer`,
      strategy: `Create an FAQ section addressing rates and timeline of freelance projects.`
    },
    {
      keyword: `${brandName.toLowerCase()} portfolio review`,
      strategy: `Display comparison tables of your works and pricing in an answer-first design.`
    }
  ];
  const finalKeywords = aiSuggestedKeywords.length > 0 ? aiSuggestedKeywords : fallbackKeywords;

  // 3. Compute final weighted overall score
  const overallScore = Math.round(
    (technicalScore * 0.25) +
    (contentScore * 0.30) +
    (brandScore * 0.25) +
    (freshnessScore * 0.20)
  );

  // Determine Grade
  let grade = 'F';
  if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else if (overallScore >= 50) grade = 'D';

  return {
    overallScore,
    grade,
    technicalScore,
    contentScore,
    brandScore,
    freshnessScore,
    summary: aiSummary,
    categoryDetails: {
      technical: {
        score: technicalScore,
        maxScore: 100,
        findings: techFindings,
        recommendations: aiTechnicalRecs
      },
      content: {
        score: contentScore,
        maxScore: 100,
        findings: contentFindings,
        recommendations: aiContentRecs
      },
      brand: {
        score: brandScore,
        maxScore: 100,
        findings: brandFindings,
        recommendations: aiBrandRecs
      },
      freshness: {
        score: freshnessScore,
        maxScore: 100,
        findings: freshnessFindings,
        recommendations: aiFreshnessRecs
      }
    },
    actionItems: finalActionItems,
    suggestedKeywords: finalKeywords
  };
}
