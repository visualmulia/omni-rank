import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
  });

  if (!user) {
    redirect('/');
  }

  const purchases = await prisma.purchase.findMany({
    where: {
      email: session.email,
      paymentStatus: 'completed',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const serializedPurchases = purchases.map(p => ({
    id: p.id,
    productSlug: p.productSlug,
    amount: Number(p.amount),
    currency: p.currency,
    downloadToken: p.downloadToken,
    createdAt: p.createdAt.toISOString(),
  }));

  const serializedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    company: user.company,
    timezone: user.timezone,
    locale: user.locale,
    currency: user.currency,
    subscriptionTier: user.subscriptionTier,
    subscriptionStatus: user.subscriptionStatus,
  };

  return (
    <ProfileClient 
      user={serializedUser} 
      purchases={serializedPurchases} 
    />
  );
}
