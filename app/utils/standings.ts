type Row = {
  teamId: string;
  wins: number;
  losses: number;
  winPct: number;
  pointsFor: number;
  pointsAgainst: number;
  diff: number;
};

export function calculateStandings(matchups: { teamA: string; teamB: string; teamAScore: number; teamBScore: number; }[]) {
  const table = new Map<string, Row>();
  const ensure = (id: string) => {
    if (!table.has(id)) table.set(id, { teamId: id, wins: 0, losses: 0, winPct: 0, pointsFor: 0, pointsAgainst: 0, diff: 0 });
    return table.get(id)!;
  };

  for (const m of matchups) {
    const a = ensure(m.teamA);
    const b = ensure(m.teamB);
    const aScore = m.teamAScore ?? 0;
    const bScore = m.teamBScore ?? 0;
    a.pointsFor += aScore;
    a.pointsAgainst += bScore;
    b.pointsFor += bScore;
    b.pointsAgainst += aScore;
    if (aScore > bScore) { a.wins++; b.losses++; }
    else if (bScore > aScore) { b.wins++; a.losses++; }
    // ties ignored for now
  }

  const rows = Array.from(table.values()).map(r => ({
    ...r,
    winPct: (r.wins + r.losses) ? Number((r.wins / (r.wins + r.losses)).toFixed(3)) : 0,
    diff: r.pointsFor - r.pointsAgainst,
  }));
  rows.sort((x, y) => y.winPct - x.winPct || (y.diff - x.diff));
  return rows;
}
