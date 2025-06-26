import { NextRequest, NextResponse } from 'next/server'
import { auth } from './lib/auth';
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ['/profile','/post/create','/post/edit'];

export async function middleware(request:NextRequest){
     const pathName = request.nextUrl.pathname;

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
   matcher: ['/profile/:path*','/post/create','/post/edit/:path*','/auth']
}
