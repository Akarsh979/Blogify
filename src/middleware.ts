import { NextRequest, NextResponse } from 'next/server'
import { auth } from './lib/auth';
import { getSessionCookie } from "better-auth/cookies";
import { rootDomain } from './lib/utils';

const protectedRoutes = ['/profile','/post/create','/post/edit','/organizations'];

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function middleware(request:NextRequest){
     const pathName = request.nextUrl.pathname;
     const subdomain = extractSubdomain(request);

  if (subdomain) {

   // Handle post routes on subdomain: /post/slug -> /s/subdomain/post/slug
   if (pathName.startsWith('/post/')) {
     const postSlug = pathName.replace('/post/', '');
     return NextResponse.rewrite(new URL(`/s/${subdomain}/post/${postSlug}`, request.url));
   }
   
    // On a subdomain, rewrite to the subdomain page
    return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));  
  }   

     const session = getSessionCookie(request);

     const isProtectedRoute = protectedRoutes.some(route=>pathName.startsWith(route));

     if(isProtectedRoute && !session){
      // redirect the user to the auth page because the user is not logged in
      return NextResponse.redirect(new URL('/auth',request.url));
     }

     if(session && pathName === '/auth'){
      // redirect the user to homepage if user is already logged in and accessing the auth page
      return NextResponse.redirect(new URL('/',request.url));
     }
     return NextResponse.next();
}

//The matcher property in the config export of a Next.js middleware file specifies which routes the middleware should run on. It tells Next.js to only invoke your middleware function for requests that match these patterns.
export const config = {
   matcher: ['/profile/:path*','/post/create','/post/edit/:path*','/auth','/organizations/:path*',
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */      
   '/((?!api|_next|[\\w-]+\\.\\w+).*)'
]
}
