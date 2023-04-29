import { VM } from 'vm2';

export function parseJSObject(str: string): any {
  try {
    const vm = new VM({
      timeout: 500,
      eval: false,
      wasm: false,
    });
    const value = vm.run(`JSON.stringify(${str})`);
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
  } catch (error: unknown) {
    throw new Error(`Could not parse JSON: ${error}`);
  }
}

export async function parallel(queue: (() => any)[], workers: number): Promise<any[]> {
  const results: any[] = [];
  async function runNext(): Promise<void> {
    if (queue.length === 0) return;

    const job = queue.pop()!;
    try {
      results.push(await job());
    } catch { /* Ignore */ }

    return runNext();
  }

  await Promise.all(Array.from({ length: workers }, runNext));

  return results;
}

export function unique<T>(list: T[]): T[] {
  const jsonList = list.map(value => JSON.stringify(value));
  const jsonSet = [...new Set(jsonList)];
  return jsonSet.map(value => JSON.parse(value));
}
