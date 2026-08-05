import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface DeveloperContact {
  type: string;
  label: string;
  url: string;
}

export interface Developer {
  id: string;
  name: string;
  role: string;
  country: string;
  flag: string;
  contact: DeveloperContact;
}

export function loadDevelopers(): Developer[] {
  const path = join(process.cwd(), 'public', 'developers.json');
  return JSON.parse(readFileSync(path, 'utf8')) as Developer[];
}

export const developers: Developer[] = loadDevelopers();
