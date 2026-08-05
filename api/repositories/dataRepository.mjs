import fs from 'node:fs/promises';
import path from 'node:path';

const dataPath = path.resolve(process.cwd(), 'api/db.json');

export async function readDb() {
  const raw = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(raw);
}

export async function writeDb(nextDb) {
  await fs.writeFile(dataPath, JSON.stringify(nextDb, null, 2), 'utf8');
}
