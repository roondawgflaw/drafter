import { prisma } from '@/prisma/client';

export default async function UnofficialStandings() {
  // Aggregate estimatedPoints across current week per user
  const weeks = await prisma.week.findMany({ orderBy: { number: 'desc' }, take: 1 });
  const week = weeks[0];
  if (!week) return <div>No weeks yet</div>;
  const subs = await prisma.submission.findMany({
    where: { event: { weekId: week.id } },
    include: { user: true }
  });
  const byUser = new Map<string, number>();
  for (const s of subs) {
    byUser.set(s.userId, (byUser.get(s.userId) || 0) + (s.estimatedPoints || 0));
  }
  const rows = Array.from(byUser.entries());
  return (
    <div>
      <h1 className="text-2xl font-semibold">Unofficial Standings (Week {week.number})</h1>
      <table className="mt-4 w-full text-left">
        <thead>
          <tr>
            <th className="py-2">User</th>
            <th className="py-2">Unofficial Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([userId, total]) => (
            <tr key={userId}>
              <td className="py-1">{subs.find((s: { userId: string; user: { name: string } }) => s.userId === userId)?.user.name || userId}</td>
              <td className="py-1">{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
