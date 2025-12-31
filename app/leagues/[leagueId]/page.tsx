import { prisma } from '@/prisma/client';
import { notFound } from 'next/navigation';

export default async function LeagueHome({ params }: { params: { leagueId: string } }) {
  const league = await prisma.league.findUnique({ where: { id: params.leagueId } });
  if (!league) return notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold">{league.name}</h1>
      <p className="text-sm text-gray-600">Invite Code: {league.inviteCode}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <a className="border rounded p-4" href={`/standings/unofficial`}>Unofficial Standings</a>
        <a className="border rounded p-4" href={`/standings/official`}>Official Standings</a>
        <a className="border rounded p-4" href={`/draft/${league.id}`}>Draft Room</a>
      </div>
    </div>
  );
}
