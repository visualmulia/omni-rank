import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Find the latest completed purchase for this email
    const purchase = await prisma.purchase.findFirst({
      where: {
        email,
        paymentStatus: 'completed',
        productSlug: 'geo-playbook',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: 'No completed purchase found.' }, { status: 404 });
    }

    return NextResponse.json({ token: purchase.downloadToken });
  } catch (error: any) {
    console.error('Purchase status query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
