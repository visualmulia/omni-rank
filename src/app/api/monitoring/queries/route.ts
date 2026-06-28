import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all tracked queries for a user email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const domain = searchParams.get('domain');

    if (!email) {
      // If no email, return all active tracked queries globally for MVP simplicity
      const queries = await prisma.trackedQuery.findMany({
        where: { 
          isActive: true,
          ...(domain ? { domain: { equals: domain, mode: 'insensitive' } } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, queries });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: true, queries: [] });
    }

    const queries = await prisma.trackedQuery.findMany({
      where: { 
        userId: user.id, 
        isActive: true,
        ...(domain ? { domain: { equals: domain, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, queries });
  } catch (error: any) {
    console.error('Fetch Queries Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch queries' }, { status: 500 });
  }
}

// POST: Add a new query keyword to track
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, email, domain } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query keyword is required' }, { status: 400 });
    }

    const targetEmail = email || 'guest@omnirank.com';

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email: targetEmail },
      update: {},
      create: {
        email: targetEmail,
        name: targetEmail.split('@')[0],
        subscriptionTier: 'free',
      },
    });

    // Resolve domain to save
    let targetDomain = domain;
    if (!targetDomain) {
      const latestAudit = await prisma.audit.findFirst({
        where: { userId: user.id, status: 'completed' },
        orderBy: { createdAt: 'desc' },
      });
      targetDomain = latestAudit?.domain || 'zenbird.web.id';
    }

    // Check if query is already tracked for this domain
    const existing = await prisma.trackedQuery.findFirst({
      where: {
        userId: user.id,
        domain: targetDomain,
        query: query.trim(),
        isActive: true,
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, query: existing });
    }

    const newQuery = await prisma.trackedQuery.create({
      data: {
        userId: user.id,
        domain: targetDomain,
        query: query.trim(),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, query: newQuery });
  } catch (error: any) {
    console.error('Create Query Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to add query' }, { status: 500 });
  }
}

// DELETE: Remove or deactivate a query
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Query ID is required' }, { status: 400 });
    }

    await prisma.trackedQuery.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Query deleted successfully' });
  } catch (error: any) {
    console.error('Delete Query Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete query' }, { status: 500 });
  }
}
