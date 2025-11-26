import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { isAdmin } from './lib/auth/admins'

export async function middleware(request: NextRequest) {
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
          // Secure cookie configuration
          const secureOptions = {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };

          request.cookies.set({ name, value, ...secureOptions })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...secureOptions })
        },
        remove(name: string, options: CookieOptions) {
          const secureOptions = {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };

          request.cookies.set({ name, value: '', ...secureOptions })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...secureOptions })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 1. Redirect to login if not authenticated
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Redirect to home if authenticated but NOT admin
  if (session && request.nextUrl.pathname.startsWith('/admin')) {
    const userEmail = session.user.email;
    if (!isAdmin(userEmail)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
