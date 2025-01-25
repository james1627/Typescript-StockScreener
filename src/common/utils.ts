import pLimit from 'p-limit';

export async function processInBatchesAsync<T, R>(
  items: T[],
  batchSize: number,
  callback: (batch: T[]) => Promise<R>,
  concurrency: number = 5,
): Promise<R[]> {
  const limit = pLimit(concurrency);
  const batches = Array.from(
    { length: Math.ceil(items.length / batchSize) },
    (_, i) => items.slice(i * batchSize, i * batchSize + batchSize),
  );

  const promises = batches.map((batch) => limit(() => callback(batch)));

  return Promise.all(promises);
}
