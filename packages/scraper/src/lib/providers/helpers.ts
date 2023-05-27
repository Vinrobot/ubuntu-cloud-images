export async function filterAsync<T>(array: T[], predicate: (value: T) => Promise<boolean>): Promise<T[]> {
  const predicates: [boolean, T][] = await Promise.all(array.map(async entry => {
    return [await predicate(entry), entry];
  }));
  return predicates.filter(([match, _]) => match).map(([_, value]) => value);
}
