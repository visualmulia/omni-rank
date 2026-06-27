import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Download token is required.' }, { status: 400 });
    }

    // Find the purchase by token
    const purchase = await prisma.purchase.findUnique({
      where: { downloadToken: token },
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Invalid or expired download token.' }, { status: 404 });
    }

    // Check if the purchase is completed/paid
    if (purchase.paymentStatus !== 'completed') {
      return NextResponse.json({ error: 'Payment has not been completed yet.' }, { status: 403 });
    }

    // Check click/download limit (abuse prevention - max 10 clicks)
    const MAX_ACCESS_LIMIT = 10;
    if (purchase.accessCount >= MAX_ACCESS_LIMIT) {
      return NextResponse.json({ 
        error: 'Download link access limit exceeded. Please contact support to reset your link.' 
      }, { status: 403 });
    }

    // Increment access count
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        accessCount: { increment: 1 }
      }
    });

    // Retrieve premium notion URL from env (with a fallback)
    const notionUrl = process.env.PREMIUM_NOTION_URL || 'https://notion.so';

    // Perform redirect (302) to Notion
    const response = NextResponse.redirect(notionUrl);

    // Prevent search bots from indexing the redirect or the Notion URL
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

    return response;
  } catch (error: any) {
    console.error('Download redirect API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
