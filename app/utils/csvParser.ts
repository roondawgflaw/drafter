import csv from 'csv-parse/lib/sync';

export function parseOfficialCSV(csvString: string) {
  const records = csv(csvString, { columns: true });
  // Validate: must have userId/eventId/officialMark columns
  for (const rec of records) {
    if (!rec.userId || !rec.eventId || !rec.officialMark) throw new Error('Invalid CSV format');
  }
  return records;
}
