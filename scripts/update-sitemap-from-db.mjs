#!/usr/bin/env node
/**
 * Fetch latest sitemap XML from Firebase Realtime Database and write to public/sitemap.xml
 * Requires env vars:
 *  FIREBASE_DB_URL   (e.g. https://your-project-id-default-rtdb.firebaseio.com)
 *  (optional) FIREBASE_AUTH_TOKEN (database secret or REST auth token if rules require)
 *  OUTPUT_PATH optional (default: ./public/sitemap.xml)
 */
import fs from 'fs';
import path from 'path';

const dbUrl = process.env.FIREBASE_DB_URL;
if (!dbUrl) {
  console.error('Missing FIREBASE_DB_URL env var');
  process.exit(1);
}
const output = process.env.OUTPUT_PATH || path.join(process.cwd(), 'public', 'sitemap.xml');
const auth = process.env.FIREBASE_AUTH_TOKEN ? `?auth=${process.env.FIREBASE_AUTH_TOKEN}` : '';

const endpoint = `${dbUrl.replace(/\/$/, '')}/sitemap/latestXml.json${auth}`;

(async () => {
  try {
    const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      console.error('Failed to fetch sitemap node', res.status, await res.text());
      process.exit(1);
    }
    const data = await res.json();
    const xml = data?.xml;
    if (!xml) {
      console.error('No xml field found at sitemap/latestXml. Did you generate it in Admin?');
      process.exit(1);
    }
    await fs.promises.mkdir(path.dirname(output), { recursive: true });
    await fs.promises.writeFile(output, xml.trim() + '\n', 'utf8');
    console.log('Sitemap written to', output);
  } catch (e) {
    console.error('Error updating sitemap:', e);
    process.exit(1);
  }
})();
