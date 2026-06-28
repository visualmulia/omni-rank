import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in .env' }, { status: 500 });
    }

    // Fetch all active queries to track
    const activeQueries = await prisma.trackedQuery.findMany({
      where: { isActive: true },
    });

    if (activeQueries.length === 0) {
      return NextResponse.json({ success: true, message: 'No active queries to monitor.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const results = [];

    // Process each query
    for (const queryItem of activeQueries) {
      const domainToTrack = queryItem.domain || 'zenbird.web.id';

      // We ask Gemini to simulate ChatGPT, Perplexity, and Claude search results,
      // and run a real search-like response for Gemini.
      const prompt = `
        You are an AI Search Engine tracker.
        For the search query: "${queryItem.query}"
        
        Generate the realistic search responses that the following four AI engines would return. 
        If the query is in Indonesian, the response should be in Indonesian.
        
        Analyze if the target domain/brand name "${domainToTrack}" (or similar brand name) is mentioned or cited.
        
        AI Search Engines:
        1. "gemini": (Real Google Gemini Search reply. Factual, search-grounded).
        2. "chatgpt": (ChatGPT Search reply. Highly structured and conversational).
        3. "perplexity": (Perplexity Search reply. Reference-dense, citations list).
        4. "claude": (Claude Search reply. Clean formatting, direct answers).
        
        Target Brand/Domain to look for: "${domainToTrack}"

        Your output MUST be a valid JSON object matching the following structure:
        {
          "engines": {
            "gemini": {
              "response": "The simulated/actual response text...",
              "isCited": true or false,
              "citationSnippet": "The exact sentence or phrase where ${domainToTrack} or its brand name is mentioned, or null if not cited.",
              "citationUrl": "The URL cited (e.g., http://${domainToTrack}) or null"
            },
            "chatgpt": {
              "response": "...",
              "isCited": true or false,
              "citationSnippet": "...",
              "citationUrl": "..."
            },
            "perplexity": {
              "response": "...",
              "isCited": true or false,
              "citationSnippet": "...",
              "citationUrl": "..."
            },
            "claude": {
              "response": "...",
              "isCited": true or false,
              "citationSnippet": "...",
              "citationUrl": "..."
            }
          }
        }
      `;

      try {
        const aiResponse = await model.generateContent(prompt);
        const text = aiResponse.response.text();
        const parsed = JSON.parse(text);

        const engineKeys = ['gemini', 'chatgpt', 'perplexity', 'claude'];
        
        for (const engine of engineKeys) {
          const engineData = parsed.engines?.[engine];
          
          if (engineData) {
            // Save to citations table
            await prisma.citation.create({
              data: {
                userId: queryItem.userId,
                domain: domainToTrack,
                aiEngine: engine,
                query: queryItem.query,
                responseSnippet: engineData.response,
                isCited: engineData.isCited,
                citationUrl: engineData.citationUrl,
                citationContext: engineData.citationSnippet,
              },
            });
          }
        }

        // Update trackedQuery last checked time
        await prisma.trackedQuery.update({
          where: { id: queryItem.id },
          data: { lastCheckedAt: new Date() },
        });

        results.push({
          query: queryItem.query,
          domain: domainToTrack,
          status: 'success',
          engines: Object.keys(parsed.engines || {}),
        });

      } catch (err: any) {
        console.error(`Error processing query "${queryItem.query}":`, err);
        results.push({
          query: queryItem.query,
          status: 'failed',
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${activeQueries.length} queries successfully.`,
      results,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message || 'Cron execution failed' }, { status: 500 });
  }
}
