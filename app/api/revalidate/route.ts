import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Secret token for security - should match environment variable
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'baby-souk-revalidate-secret'

export async function POST(request: NextRequest) {
  try {
    // Get the secret from request headers or body
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    
    const secret = authHeader?.replace('Bearer ', '') || body.secret
    
    // Check for secret to confirm this is a valid request
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    const { type, paths, tags } = body

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path)
        console.log(`Revalidated path: ${path}`)
      }
    }

    // Revalidate specific cache tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag)
        console.log(`Revalidated tag: ${tag}`)
      }
    }

    // Handle different revalidation types
    switch (type) {
      case 'products':
        revalidatePath('/products')
        revalidatePath('/')
        revalidateTag('products')
        console.log('Revalidated products pages')
        break
      
      case 'categories':
        revalidatePath('/categories')
        revalidatePath('/')
        revalidateTag('categories')
        console.log('Revalidated categories pages')
        break
      
      case 'hero-content':
        revalidatePath('/')
        revalidateTag('hero')
        console.log('Revalidated hero content')
        break
      
      case 'full-site':
        // Revalidate all major pages
        const pagesToRevalidate = [
          '/',
          '/products',
          '/categories',
          '/collections',
          '/contact',
          '/faq',
          '/privacy',
          '/returns',
          '/shipping',
          '/terms'
        ]
        
        for (const path of pagesToRevalidate) {
          revalidatePath(path)
        }
        
        // Revalidate all tags
        const tagsToRevalidate = ['products', 'categories', 'hero', 'content']
        for (const tag of tagsToRevalidate) {
          revalidateTag(tag)
        }
        
        console.log('Revalidated entire site')
        break
      
      default:
        if (!paths && !tags) {
          return NextResponse.json(
            { message: 'No revalidation type, paths, or tags specified' }, 
            { status: 400 }
          )
        }
    }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Revalidation successful'
    })

  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      { message: 'Error revalidating', error: err }, 
      { status: 500 }
    )
  }
}

// Allow GET requests to check if the API is working
export async function GET() {
  return NextResponse.json({ 
    message: 'Revalidation API is working',
    timestamp: new Date().toISOString()
  })
}