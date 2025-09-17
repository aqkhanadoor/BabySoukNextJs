import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin000/',
          '/api/',
          '/_next/',
          '/private/',
          '*.pdf',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin000/',
          '/api/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://babysouk.in/sitemap.xml',
  }
}