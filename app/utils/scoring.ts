import { prisma } from '@/prisma/client';

export async function computePoints(mark: number, eventId: string) {
  // Find the closest mark <= input
  const table = await prisma.scoringTable.findMany({ where: { eventId }, orderBy: { mark: 'desc' } });
  for (const row of table) {
    if (mark >= row.mark) return row.points;
  }
  return 0;
}
