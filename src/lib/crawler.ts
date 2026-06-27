import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface CrawledData {
  url: string;
  domain: string;
  robotsTxt: {
    exists: boolean;
    content: string;
    blocksAi: boolean;
  };
  llmsTxt: {
    exists: boolean;
    content: string;
  };
  aiTxt: {
    exists: boolean;
    content: string;
  };
  sitemapXml: {
    exists: boolean;
  };
  pageData: {
    title: string;
    description: string;
    h1s: string[];
    h2s: string[];
    h3s: string[];
    paragraphs: string[];
    schemas: any[];
    tablesCount: number;
    wordCount: number;
    textLength: number;
    htmlContent: string;
  };
}

// Set standard User-Agent to mimic a typical search bot
const META_AXIOS_CONFIG = {
  headers: {
    'User-Agent': 'OnmiRankBot/1.0 (+https://onmirank.com/bot)',
  },
  timeout: 3000, // 3 seconds max for robots/sitemap to keep it fast
  validateStatus: () => true,
};

const TARGET_AXIOS_CONFIG = {
  headers: {
    'User-Agent': 'OnmiRankBot/1.0 (+https://onmirank.com/bot)',
  },
  timeout: 10000, // 10 seconds max for target URL (resilient to slow hosts)
  validateStatus: () => true,
};

export async function crawlPage(targetUrl: string): Promise<CrawledData> {
  // Normalize URL
  let urlString = targetUrl.trim();
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = 'http://' + urlString;
  }

  const parsedUrl = new URL(urlString);
  const domain = parsedUrl.hostname;
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

  const robotsUrl = `${baseUrl}/robots.txt`;
  const llmsUrl = `${baseUrl}/llms.txt`;
  const aiUrl = `${baseUrl}/ai.txt`;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  // Fetch meta files concurrently to save time
  const [robotsRes, llmsRes, aiRes, sitemapRes, targetRes] = await Promise.all([
    axios.get(robotsUrl, META_AXIOS_CONFIG).catch(() => null),
    axios.get(llmsUrl, META_AXIOS_CONFIG).catch(() => null),
    axios.get(aiUrl, META_AXIOS_CONFIG).catch(() => null),
    axios.get(sitemapUrl, META_AXIOS_CONFIG).catch(() => null),
    axios.get(urlString, TARGET_AXIOS_CONFIG).catch((err) => {
      let friendlyMessage = `Website "${domain}" tidak dapat diakses. `;
      if (err.code === 'ENOTFOUND') {
        friendlyMessage += 'Domain tidak ditemukan. Pastikan penulisan URL/domain sudah benar (contoh: dekoruma.com, bukan dekoruma.id).';
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        friendlyMessage += 'Waktu koneksi habis (timeout 10s). Website Anda mungkin sedang lambat atau memblokir bot kami.';
      } else if (err.code === 'ECONNREFUSED') {
        friendlyMessage += 'Koneksi ditolak oleh server. Pastikan website tidak sedang down.';
      } else {
        friendlyMessage += `Detail: ${err.message}`;
      }
      throw new Error(friendlyMessage);
    }),
  ]);

  // Process robots.txt
  let robotsContent = '';
  let existsRobots = false;
  let blocksAi = false;
  if (robotsRes && robotsRes.status === 200 && typeof robotsRes.data === 'string') {
    existsRobots = true;
    robotsContent = robotsRes.data;
    const lowerRobots = robotsContent.toLowerCase();
    const aiBots = ['gptbot', 'chatgpt-user', 'claudebot', 'perplexitybot', 'google-extended', 'kimibot'];
    
    // Simple check: does it disallow any AI crawler?
    blocksAi = aiBots.some(bot => {
      // Find position of Bot agent
      const agentIndex = lowerRobots.indexOf(`user-agent: ${bot}`);
      if (agentIndex !== -1) {
        // Look for Disallow: / in the lines immediately following
        const searchBlock = lowerRobots.substring(agentIndex, agentIndex + 200);
        return searchBlock.includes('disallow: /') && !searchBlock.includes('disallow: /wp-admin');
      }
      return false;
    });
  }

  // Process llms.txt
  let llmsContent = '';
  let existsLlms = false;
  if (llmsRes && llmsRes.status === 200 && typeof llmsRes.data === 'string') {
    existsLlms = true;
    llmsContent = llmsRes.data;
  }

  // Process ai.txt
  let aiContent = '';
  let existsAi = false;
  if (aiRes && aiRes.status === 200 && typeof aiRes.data === 'string') {
    existsAi = true;
    aiContent = aiRes.data;
  }

  // Process sitemap.xml
  const existsSitemap = sitemapRes ? sitemapRes.status === 200 : false;

  // Process Target Page HTML
  const htmlContent = targetRes && targetRes.data ? String(targetRes.data) : '';
  const $ = cheerio.load(htmlContent);

  // Extract Metadata
  const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content')?.trim() || '';
  const description = $('meta[name="description"]').attr('content')?.trim() || $('meta[property="og:description"]').attr('content')?.trim() || '';

  const h1s: string[] = [];
  $('h1').each((_, el) => {
    const txt = $(el).text().trim();
    if (txt) h1s.push(txt);
  });

  const h2s: string[] = [];
  $('h2').each((_, el) => {
    const txt = $(el).text().trim();
    if (txt) h2s.push(txt);
  });

  const h3s: string[] = [];
  $('h3').each((_, el) => {
    const txt = $(el).text().trim();
    if (txt) h3s.push(txt);
  });

  const paragraphs: string[] = [];
  $('p').each((_, el) => {
    const txt = $(el).text().trim();
    if (txt && txt.length > 20) {
      paragraphs.push(txt);
    }
  });

  // Extract Schemas (JSON-LD)
  const schemas: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const rawJson = $(el).html();
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          schemas.push(...parsed);
        } else {
          schemas.push(parsed);
        }
      }
    } catch {
      // Ignore JSON parse errors in user website schemas
    }
  });

  const tablesCount = $('table').length;
  
  // Calculate text and word count
  const allText = $('body').text() || '';
  const cleanText = allText.replace(/\s+/g, ' ').trim();
  const wordCount = cleanText ? cleanText.split(' ').length : 0;

  return {
    url: urlString,
    domain,
    robotsTxt: {
      exists: existsRobots,
      content: robotsContent,
      blocksAi,
    },
    llmsTxt: {
      exists: existsLlms,
      content: llmsContent,
    },
    aiTxt: {
      exists: existsAi,
      content: aiContent,
    },
    sitemapXml: {
      exists: existsSitemap,
    },
    pageData: {
      title,
      description,
      h1s,
      h2s,
      h3s,
      paragraphs,
      schemas,
      tablesCount,
      wordCount,
      textLength: cleanText.length,
      htmlContent: htmlContent.substring(0, 100000), // Max 100kb html content saved
    },
  };
}
