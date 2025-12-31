import { parse } from 'csv-parse/sync';

export function parseOfficialCSV(csvString: string) {
  const records = parse(csvString, { columns: true, skip_empty_lines: true });
  // Validate: must have userId/eventId/officialMark columns
  for (const rec of records) {
    if (!rec.userId || !rec.eventId || !rec.officialMark) throw new Error('Invalid CSV format');
  }
  return records;
}
