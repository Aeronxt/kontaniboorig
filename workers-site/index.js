import { getAssetFromKV, NotFoundError } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

// Define custom options for asset handling
const ASSET_OPTIONS = {
  // Add caching options if needed
  cacheControl: {
    browserTTL: 60 * 60 * 24, // 24 hours
    edgeTTL: 60 * 60 * 24 * 365, // 365 days
    bypassCache: false, // false for production
  },
}

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  
  try {
    // Check if the request is for a static asset
    const isAsset = url.pathname.includes('/assets/') || 
                   /\.(js|css|ico|jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot|json|txt|xml)$/i.test(url.pathname)

    let options = {
      cacheControl: {
        browserTTL: isAsset ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year for assets, 24 hours for HTML
        edgeTTL: 60 * 60 * 24 * 365, // 365 days
        bypassCache: DEBUG,
      },
    }

    // First try to get the asset directly
    try {
      const page = await getAssetFromKV(event, options)
      const response = new Response(page.body, page)

      // Add security headers
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

      // Special handling for JavaScript modules
      if (url.pathname.endsWith('.js')) {
        response.headers.set('Content-Type', 'application/javascript; charset=utf-8')
        // Add CORS headers for module loading
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
      }

      // Handle CSS files
      if (url.pathname.endsWith('.css')) {
        response.headers.set('Content-Type', 'text/css; charset=utf-8')
      }

      return response
    } catch (e) {
      // If the asset is not found and it's not a static asset, serve index.html for SPA routing
      if (!isAsset) {
        try {
          const notFoundResponse = await getAssetFromKV(event, {
            ...options,
            mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
          })

          const response = new Response(notFoundResponse.body, {
            ...notFoundResponse,
            status: 200,
            statusText: 'OK',
            headers: new Headers(notFoundResponse.headers),
          })

          // Add security headers
          response.headers.set('X-XSS-Protection', '1; mode=block')
          response.headers.set('X-Content-Type-Options', 'nosniff')
          response.headers.set('X-Frame-Options', 'DENY')
          response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
          response.headers.set('Content-Type', 'text/html; charset=utf-8')

          return response
        } catch (indexError) {
          // If we can't serve index.html either, return a 404
          return new Response('Not Found', { status: 404 })
        }
      }
      throw e
    }
  } catch (e) {
    if (DEBUG) {
      return new Response(e.message || e.toString(), { status: 500 })
    }
    return new Response('Internal Error', { status: 500 })
  }
} 