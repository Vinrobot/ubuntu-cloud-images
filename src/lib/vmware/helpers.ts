import { Hash } from 'node:crypto';
import { File } from './types';

export function areMapEqual<K, V>(a: Map<K, V>, b: Map<K, V>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (value !== b.get(key)) return false;
  }

  return true;
}

export async function filterAsync<T>(array: T[], predicate: (value: T) => Promise<boolean>): Promise<T[]> {
  const predicates: [boolean, T][] = await Promise.all(array.map(async entry => {
    return [await predicate(entry), entry];
  }));
  return predicates.filter(([match, _]) => match).map(([_, value]) => value);
}

export async function updateHash(hasher: Hash, files: File[]): Promise<Hash> {
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    hasher = await file.updateHash(hasher);
  }

  return hasher;
}
