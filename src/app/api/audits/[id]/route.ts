import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 });
    }

    const audit = await prisma.audit.findUnique({
      where: { id },
      include: {
        details: true,
        actionItems: true,
      },
    });

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      audit,
    });
  } catch (error: any) {
    console.error('Fetch Audit API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred fetching the audit' },
      { status: 500 }
    );
  }
}
