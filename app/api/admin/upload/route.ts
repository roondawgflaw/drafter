import { NextResponse } from 'next/server';
import { parseOfficialCSV } from '@/app/utils/csvParser';
import { prisma } from '@/prisma/client';
import { computePoints } from '@/app/utils/scoring';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.csv) return NextResponse.json({ error: 'Missing csv' }, { status: 400 });
  let records: any[] = [];
  try {
    records = parseOfficialCSV(body.csv);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Invalid CSV' }, { status: 400 });
  }

  // Map by (userId,eventId)
  for (const rec of records) {
    const userId = String(rec.userId);
    const eventId = String(rec.eventId);
    const officialMark = Number(rec.officialMark);
    if (!userId || !eventId || Number.isNaN(officialMark)) continue;

    const submission = await prisma.submission.findFirst({ where: { userId, eventId } });
    if (!submission) continue;
    const officialPoints = await computePoints(officialMark, eventId);
    await prisma.submission.update({
      where: { id: submission.id },
      data: { officialMark, officialPoints },
    });
  }

  // Audit log entry (simple)
  return NextResponse.json({ message: 'Official results applied' });
}
