import { prisma } from '@/prisma/client';
import bcrypt from 'bcrypt';

async function main() {
  const adminEmail = 'admin@example.com';
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: passwordHash, name: 'Admin', role: 'admin' },
  });

  const league = await prisma.league.upsert({
    where: { inviteCode: 'WELCOME123' },
    update: {},
    create: {
      name: 'Demo League',
      inviteCode: 'WELCOME123',
      commissioner: admin.id,
    },
  });

  const week = await prisma.week.create({
    data: {
      leagueId: league.id,
      number: 1,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.event.createMany({
    data: [
      { weekId: week.id, name: '100m' },
      { weekId: week.id, name: 'Long Jump' },
    ],
  });

  // Minimal scoring rows per event (example only)
  const events = await prisma.event.findMany({ where: { weekId: week.id } });
  for (const ev of events) {
    await prisma.scoringTable.createMany({
      data: [
        { eventId: ev.id, mark: 10.0, points: 900 },
        { eventId: ev.id, mark: 11.0, points: 800 },
        { eventId: ev.id, mark: 12.0, points: 700 },
      ],
      skipDuplicates: true,
    });
  }

  console.log('Seed complete. Admin:', adminEmail);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});