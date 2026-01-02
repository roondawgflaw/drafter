export function generateRoundRobin(leagueMemberIds: string[]): string[][][] {
  // Returns array of weeks, each week is array of [teamA, teamB]
  const n = leagueMemberIds.length;
  const rounds = n - 1;
  const schedule = [];
  let teams = [...leagueMemberIds];
  if (n % 2) teams.push('BYE');
  for (let r = 0; r < rounds; r++) {
    const week = [];
    for (let i = 0; i < teams.length / 2; i++) {
      if (teams[i] !== 'BYE' && teams[teams.length - 1 - i] !== 'BYE') {
        week.push([teams[i], teams[teams.length - 1 - i]]);
      }
    }
    teams.splice(1, 0, teams.pop()!);
    schedule.push(week);
  }
  return schedule;
}
