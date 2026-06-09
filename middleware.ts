import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Route matchers ──────────────────────────────────────────────────────────

const isPublicRoute = createRouteMatcher([
  '/',
  '/productos(.*)',
  '/categorias(.*)',
  '/marcas(.*)',
  '/servicios',
  '/financiamiento',
  '/trade-in',
  '/sucursales',
  '/api/webhooks(.*)',
  '/api/products',
  '/api/products/(.*)',
  // Auth pages (Clerk handles these automatically but being explicit is safer)
  '/sign-in(.*)',
  '/sign-up(.*)',
])

const isProtectedRoute = createRouteMatcher([
  '/cuenta(.*)',
  '/carrito',
  '/checkout(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// ─── Middleware ───────────────────────────────────────────────────────────────

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // 1. Public routes — allow through unconditionally
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // 2. Admin routes — must be authenticated AND have admin role
  if (isAdminRoute(req)) {
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    const role =
      (sessionClaims?.metadata as { role?: string } | undefined)?.role ??
      (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role

    if (role !== 'admin') {
      // Redirect non-admins to home with an error param
      const homeUrl = new URL('/', req.url)
      homeUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
  }

  // 3. Protected routes — must be authenticated
  if (isProtectedRoute(req)) {
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }
    return NextResponse.next()
  }

  // 4. All other routes — allow through (add more guards here as needed)
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public assets (png, jpg, svg, ico, webp, woff2, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|mp4|mp3|pdf)$).*)',
  ],
}
