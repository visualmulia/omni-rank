import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    // Default target email if none provided
    const targetEmail = email || 'guest@omnirank.com';

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        stats: {
          totalQueries: 0,
          citationRate: 0,
          totalCitationsCount: 0,
          engineStats: {},
        },
        citations: [],
      });
    }

    // Fetch citations
    const citations = await prisma.citation.findMany({
      where: { userId: user.id },
      orderBy: { trackedAt: 'desc' },
      take: 100, // limit to latest 100 for performance
    });

    // Fetch queries count
    const totalQueries = await prisma.trackedQuery.count({
      where: { userId: user.id, isActive: true },
    });

    // Calculate overall stats
    const totalCitationsCount = citations.length;
    const citedCount = citations.filter(c => c.isCited).length;
    const citationRate = totalCitationsCount > 0 ? Math.round((citedCount / totalCitationsCount) * 100) : 0;

    // Calculate engine breakdown
    const engines = ['gemini', 'chatgpt', 'perplexity', 'claude'];
    const engineStats: Record<string, { total: number; cited: number; rate: number }> = {};

    engines.forEach(engine => {
      const engineCitations = citations.filter(c => c.aiEngine === engine);
      const eTotal = engineCitations.length;
      const eCited = engineCitations.filter(c => c.isCited).length;
      const eRate = eTotal > 0 ? Math.round((eCited / eTotal) * 100) : 0;
      
      engineStats[engine] = {
        total: eTotal,
        cited: eCited,
        rate: eRate,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalQueries,
        citationRate,
        totalCitationsCount,
        engineStats,
      },
      citations,
    });
  } catch (error: any) {
    console.error('Fetch Citations Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch citations' }, { status: 500 });
  }
}
