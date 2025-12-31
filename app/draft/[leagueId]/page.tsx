import { prisma } from '@/prisma/client';

export default async function DraftRoom({ params }: { params: { leagueId: string } }) {
  const league = await prisma.league.findUnique({ where: { id: params.leagueId }, include: { drafts: true } });
  if (!league) return <div>League not found</div>;
  const draft = league.drafts[0];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Draft Room — {league.name}</h1>
      {!draft ? (
        <p className="mt-3 text-sm">No draft yet. Admin can create one.</p>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Rounds: {draft.rounds}</p>
          <div className="mt-3 border rounded p-3">Draft picks will appear here.</div>
        </div>
      )}
    </div>
  );
}
