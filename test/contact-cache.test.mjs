import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { QueryClient } from '@tanstack/react-query';

const source = await readFile(new URL('../lib/invalidate-contact-data.js', import.meta.url), 'utf8');
const { invalidateContactData } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('adding a contact refreshes inactive dashboard queries despite the five-minute cache', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: 300000, retry: false, gcTime: Infinity } } });
  const keys = ['dashboard-summary', 'contacts-by-company', 'tag-distribution', 'activities-timeline', 'tags', 'contacts'];
  let count = 2;
  const calls = new Map();
  try {
    for (const key of keys) {
      await client.fetchQuery({ queryKey: [key], queryFn: async () => {
        calls.set(key, (calls.get(key) || 0) + 1);
        return { count };
      } });
    }
    // The dashboard has no observers while the contact form is open elsewhere.
    count = 3;
    await invalidateContactData(client);
    for (const key of keys) {
      assert.equal(client.getQueryData([key]).count, 3, `${key} must have the new count`);
      assert.equal(calls.get(key), 2, `${key} must refetch while inactive`);
    }
  } finally {
    client.clear();
  }
});
