import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import {NextResponse} from "next/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req))  {
        await auth.protect()
    }
    const headers = new Headers(req.headers);
    headers.set("x-current-path", req.nextUrl.pathname);
    console.log(req.headers);
    return NextResponse.next({ headers : {"hi": "123"} });
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(.*)',
    ],
}
