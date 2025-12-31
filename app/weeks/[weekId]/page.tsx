import { prisma } from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function WeekPage({ params }: { params: { weekId: string } }) {
  const session = await getServerSession(authOptions);
  const week = await prisma.week.findUnique({ where: { id: params.weekId }, include: { events: true } });
  if (!week) return <div>Week not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Week {week.number}</h1>
      <p className="text-sm text-gray-600">Deadline: {new Date(week.deadline).toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
      <div className="mt-6 space-y-4">
        {week.events.map(async (ev) => {
          const existing = session?.user?.id ? await prisma.submission.findFirst({ where: { userId: (session.user as any).id, eventId: ev.id } }) : null;
          return (
            <div key={ev.id} className="border rounded p-4">
              <h2 className="font-medium">{ev.name}</h2>
              {existing?.lockedAt ? (
                <div className="mt-3 space-y-1 text-sm">
                  <div><span className="font-medium">Predicted Mark (Locked):</span> {existing.predictedMark}</div>
                  <div><span className="font-medium">Estimated Score (Unofficial):</span> {existing.estimatedPoints}</div>
                </div>
              ) : (
                <form action={`/api/submissions`} method="POST" className="mt-3 flex gap-3">
                  <input type="hidden" name="eventId" value={ev.id} />
                  <input name="predictedMark" type="number" step="0.01" placeholder="Predicted mark/time" className="border rounded px-3 py-2" required />
                  <button className="bg-blue-600 text-white rounded px-3 py-2">Submit & Lock</button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
