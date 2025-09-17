import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use Firebase REST API to avoid Firebase SDK initialization issues in API routes
    const databaseUrl = 'https://babysouk-583f9-default-rtdb.asia-southeast1.firebasedatabase.app';
    const endpoint = `${databaseUrl}/sitemap/latestXml.json`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Firebase REST API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data?.xml) {
      // Return a basic sitemap if none exists in the database
      const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://babysouk.in/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
      
      return new NextResponse(fallbackXml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        },
      });
    }
    
    // Return the generated sitemap XML from the database
    return new NextResponse(data.xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('Error serving sitemap:', error);
    
    // Return a basic sitemap on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://babysouk.in/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return new NextResponse(errorXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // Shorter cache on error
      },
      status: 500,
    });
  }
}