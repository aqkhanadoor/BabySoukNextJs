// Utility to generate sitemap XML string
// Products: expect objects with fields: category, slug, updatedAt/createdAt timestamps (number or serverTimestamp placeholder)

export interface SitemapProductLike {
  category?: string | null;
  slug?: string | null;
  name?: string | null;
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

  const pushUrl = (loc: string, lastmod?: string, isProduct = false) => {
    if (!loc) return;
    if (seen.has(loc)) return;
    seen.add(loc);
    if (isProduct) {
      console.log('Adding product URL to sitemap:', loc);
    }
    urls.push(`<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  };

  staticPaths.forEach(p => pushUrl(`${baseUrl}${p}`, formatDate(Date.now())));

  products.forEach(p => {
    if (!p?.category) {
      console.warn('Skipping product without category:', p);
      return;
    }
    
    // Try to get slug, fall back to generating from name
    let rawSlug = p.slug;
    if (!rawSlug && p.name) {
      rawSlug = slugify(p.name);
    }
    // Handle case where p might have slug/name as any type
    if (!rawSlug) {
      const fallbackSlug = (p as any).slug || (p as any).name;
      if (fallbackSlug) {
        rawSlug = slugify(fallbackSlug);
      }
    }
    
    if (!rawSlug) {
      console.warn('Skipping product without slug or name:', p);
      return;
    }
    
    const lastmod = p.updatedAt || p.createdAt;
    const productUrl = `${baseUrl}/${encodeURIComponent(p.category)}/${encodeURIComponent(rawSlug)}`;
    pushUrl(productUrl, formatDate(lastmod), true);
  });

  console.log(`Sitemap generated with ${urls.length} URLs (${staticPaths.length} static + ${urls.length - staticPaths.length} products)`);
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join('\n') +
    `\n</urlset>`;
}
