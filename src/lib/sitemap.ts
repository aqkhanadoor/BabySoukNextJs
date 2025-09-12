// Utility to generate sitemap XML string
// Products: expect objects with fields: category, slug, updatedAt/createdAt timestamps (number or serverTimestamp placeholder)

export interface SitemapProductLike {
  category?: string | null;
  slug?: string | null;
  updatedAt?: any;
  createdAt?: any;
}

interface GenerateOptions {
  baseUrl: string;
  products: SitemapProductLike[];
  staticPaths?: string[]; // additional absolute paths starting with /
}

const formatDate = (ts: any): string => {
  let d: Date;
  if (typeof ts === 'number') {
    d = new Date(ts);
  } else if (ts && typeof ts === 'object' && 'seconds' in ts) {
    d = new Date((ts.seconds as number) * 1000);
  } else {
    d = new Date();
  }
  return d.toISOString().split('T')[0];
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function generateSitemapXml(opts: GenerateOptions): string {
  const { baseUrl, products } = opts;
  const staticPaths = opts.staticPaths || [];
  const seen = new Set<string>();
  const urls: string[] = [];

  const pushUrl = (loc: string, lastmod?: string) => {
    if (!loc) return;
    if (seen.has(loc)) return;
    seen.add(loc);
    urls.push(`<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  };

  staticPaths.forEach(p => pushUrl(`${baseUrl}${p}`, formatDate(Date.now())));

  products.forEach(p => {
    if (!p?.category) return;
    const rawSlug = (p as any).slug || (p as any).name ? slugify((p as any).slug || (p as any).name || '') : null;
    if (!rawSlug) return;
    const lastmod = p.updatedAt || p.createdAt;
    pushUrl(`${baseUrl}/${encodeURIComponent(p.category)}/${encodeURIComponent(rawSlug)}`, formatDate(lastmod));
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join('\n') +
    `\n</urlset>`;
}
