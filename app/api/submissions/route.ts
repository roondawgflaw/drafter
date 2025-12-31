import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { computePoints } from '@/app/utils/scoring';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const eventId = String(formData.get('eventId') || '');
  const predictedMark = Number(formData.get('predictedMark'));
  if (!eventId || Number.isNaN(predictedMark)) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const event = await prisma.event.findUnique({ where: { id: eventId }, include: { week: true } });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  if (new Date() > event.week.deadline) return NextResponse.json({ error: 'Deadline passed' }, { status: 403 });

  const existing = await prisma.submission.findFirst({ where: { userId: session.user.id, eventId } });
  if (existing?.lockedAt) return NextResponse.json({ error: 'Submission locked' }, { status: 403 });

  const estimatedPoints = await computePoints(predictedMark, eventId);

  if (existing) {
    await prisma.submission.update({
      where: { id: existing.id },
      data: { predictedMark, estimatedPoints, lockedAt: new Date() },
    });
  } else {
    await prisma.submission.create({
      data: { userId: session.user.id, eventId, predictedMark, estimatedPoints, lockedAt: new Date() },
    });
  }

  return NextResponse.json({ success: true });
}
