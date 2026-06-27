import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CLICKS_FILE = path.join(process.cwd(), 'src/data/affiliate_clicks.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tool, url, article } = body;

    if (!tool || !url) {
      return NextResponse.json({ error: 'Tool and URL are required.' }, { status: 400 });
    }

    const dir = path.dirname(CLICKS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let clicks = [];
    if (fs.existsSync(CLICKS_FILE)) {
      try {
        const fileContent = fs.readFileSync(CLICKS_FILE, 'utf-8');
        clicks = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading clicks file:', err);
      }
    }

    clicks.push({
      tool,
      url,
      article: article || 'unknown',
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(CLICKS_FILE, JSON.stringify(clicks, null, 2));

    console.log(`[AFFILIATE CLICK] Tool: ${tool} | URL: ${url} | Article: ${article || 'unknown'}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Affiliate click endpoint error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
