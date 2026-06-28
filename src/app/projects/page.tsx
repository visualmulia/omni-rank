import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
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

  // Fetch all completed audits for this user to list unique projects
  const allAudits = await prisma.audit.findMany({
    where: { 
      userId: user.id,
      status: 'completed'
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Extract unique domains (taking the latest audit for each unique domain)
  const projectsMap = new Map();
  for (const audit of allAudits) {
    if (!projectsMap.has(audit.domain)) {
      projectsMap.set(audit.domain, {
        id: audit.id,
        domain: audit.domain,
        url: audit.url,
        overallScore: audit.overallScore,
        grade: audit.grade,
        createdAt: audit.createdAt,
      });
    }
  }
  
  const projects = Array.from(projectsMap.values());

  return (
    <ProjectsClient 
      initialProjects={projects} 
      userEmail={user.email} 
      subscriptionTier={user.subscriptionTier} 
    />
  );
}
