import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Ensure /admin pathways are secure
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL('/login', request.url)
      url.searchParams.set('message', 'Please sign in to access the admin panel.')
      return NextResponse.redirect(url)
    }

    // Check if the user is in the admin_users table
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!adminUser) {
      // Valid session but not an admin -> redirect to client dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Admin security rule: "keep login for 1 hr after that again id and password"
    // We check the last_sign_in_at timestamp against current time (1 hour = 3600000 ms)
    const lastSignIn = new Date(session.user.last_sign_in_at || session.user.created_at)
    const now = new Date()
    const msSinceLogin = now.getTime() - lastSignIn.getTime()

    if (msSinceLogin > 3600000) {
      // If it's been more than 1 hour since they actually entered their password
      await supabase.auth.signOut()
      const url = new URL('/login', request.url)
      url.searchParams.set('message', 'Admin session expired (1 hour limit). Please log in again.')
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
