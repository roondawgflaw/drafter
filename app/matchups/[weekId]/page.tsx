
import { prisma } from '@/prisma/client';

type Matchup = {
  id: string;
  teamA: string;
  teamB: string;
  teamAScore?: number;
  teamBScore?: number;
};

export default async function MatchupMatrix({ params }: { params: { weekId: string } }) {
  const week = await prisma.week.findUnique({ where: { id: params.weekId }, include: { matchups: true } });
  if (!week) return <div>Week not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Matchups (Week {week.number})</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {week.matchups.map((m: Matchup) => (
          <div key={m.id} className="border rounded p-3">
            <div className="font-medium">{m.teamA} vs {m.teamB}</div>
            <div className="text-sm text-gray-600">{m.teamAScore ?? '-'} : {m.teamBScore ?? '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
