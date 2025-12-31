import { prisma } from '@/prisma/client';
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { computePoints } from '@/app/utils/scoring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(401).end();

  const { eventId, predictedMark } = req.body;
  const event = await prisma.event.findUnique({ where: { id: eventId }, include: { week: true } });
  if (!event) return res.status(404).end();

  // Check deadline
  if (new Date() > event.week.deadline) return res.status(403).json({ error: 'Deadline passed' });

  // Check if already submitted/locked
  const existing = await prisma.submission.findFirst({ where: { userId: session.user.id, eventId } });
  if (existing && existing.lockedAt) return res.status(403).json({ error: 'Submission locked' });

  // Compute estimated points
  const estimatedPoints = await computePoints(predictedMark, eventId);

  // Upsert submission
  await prisma.submission.upsert({
    where: { userId_eventId: { userId: session.user.id, eventId } },
    update: { predictedMark, estimatedPoints, lockedAt: new Date() },
    create: { userId: session.user.id, eventId, predictedMark, estimatedPoints, lockedAt: new Date() },
  });

  res.status(200).json({ success: true });
}
