import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

// Rutas públicas. Todo lo demás (dashboard, admin, checkout, data, onboarding)
// exige sesión.
const isPublic = createRouteMatcher([
  "/",
  "/login(.*)",
  "/registro(.*)",
  "/api/health",
]);

// Patrón anti-loop: redirectToSignIn({ returnBackUrl }) + signInUrl/signUpUrl
// propios definidos en el ClerkProvider. NUNCA redirect manual.
export default clerkEnabled
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublic(req)) {
        const { userId, redirectToSignIn } = await auth();
        if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
      }
    })
  : function middleware() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|favicon|icon|apple-touch-icon|og\\.png|manifest\\.json|sw\\.js|.*\\.(?:png|svg|jpg|jpeg|webp|ico|css|js|map|txt|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
};
