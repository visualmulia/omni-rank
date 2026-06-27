import { NextRequest, NextResponse } from 'next/server';
import { crawlPage } from '@/lib/crawler';
import { runAudit } from '@/lib/auditEngine';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const domain = searchParams.get('domain');

    if (!email || !domain) {
      return NextResponse.json({ error: 'Missing email or domain' }, { status: 400 });
    }

    const audit = await prisma.audit.findFirst({
      where: {
        domain,
        user: { email },
        status: 'completed',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        details: true,
        actionItems: true,
      },
    });

    if (!audit) {
      return NextResponse.json({ error: 'No completed audits found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, audit });
  } catch (error: any) {
    console.error('Fetch latest audit error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch audit' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, email } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Normalize and validate URL
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'http://' + normalizedUrl;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const domain = parsedUrl.hostname;

    // 2. Perform Crawling
    const crawledData = await crawlPage(normalizedUrl);

    // 3. Perform Scoring & AI Analysis
    const auditResult = await runAudit(crawledData);

    // 4. Save to Database
    // Check if we can find or create a user if email is provided
    let dbUser = null;
    if (email) {
      dbUser = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: email.split('@')[0],
          subscriptionTier: 'free',
        },
      });
    }

    // Create Audit record
    const audit = await prisma.audit.create({
      data: {
        userId: dbUser?.id || null,
        url: normalizedUrl,
        domain,
        overallScore: auditResult.overallScore,
        grade: auditResult.grade,
        technicalScore: auditResult.technicalScore,
        contentScore: auditResult.contentScore,
        brandScore: auditResult.brandScore,
        freshnessScore: auditResult.freshnessScore,
        summary: auditResult.summary,
        suggestedKeywords: auditResult.suggestedKeywords,
        status: 'completed',
        completedAt: new Date(),
        details: {
          create: [
            {
              category: 'technical',
              subcategory: 'signals',
              score: auditResult.categoryDetails.technical.score,
              maxScore: auditResult.categoryDetails.technical.maxScore,
              findings: auditResult.categoryDetails.technical.findings,
              recommendations: auditResult.categoryDetails.technical.recommendations,
            },
            {
              category: 'content',
              subcategory: 'structure',
              score: auditResult.categoryDetails.content.score,
              maxScore: auditResult.categoryDetails.content.maxScore,
              findings: auditResult.categoryDetails.content.findings,
              recommendations: auditResult.categoryDetails.content.recommendations,
            },
            {
              category: 'brand',
              subcategory: 'entity',
              score: auditResult.categoryDetails.brand.score,
              maxScore: auditResult.categoryDetails.brand.maxScore,
              findings: auditResult.categoryDetails.brand.findings,
              recommendations: auditResult.categoryDetails.brand.recommendations,
            },
            {
              category: 'freshness',
              subcategory: 'signals',
              score: auditResult.categoryDetails.freshness.score,
              maxScore: auditResult.categoryDetails.freshness.maxScore,
              findings: auditResult.categoryDetails.freshness.findings,
              recommendations: auditResult.categoryDetails.freshness.recommendations,
            },
          ],
        },
        actionItems: {
          create: auditResult.actionItems.map(item => ({
            title: item.title,
            description: item.description,
            category: item.category,
            impact: item.impact,
            effort: item.effort,
            estimatedScoreGain: item.estimatedScoreGain,
          })),
        },
      },
      include: {
        details: true,
        actionItems: true,
      },
    });

    return NextResponse.json({
      success: true,
      auditId: audit.id,
      audit,
    });
  } catch (error: any) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the audit' },
      { status: 500 }
    );
  }
}
