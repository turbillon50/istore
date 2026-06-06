import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ACCESS_COOKIE, ACCESS_MAX_AGE, tokenRole } from "@/lib/access";

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

// Rutas públicas. Todo lo demás (dashboard, admin, checkout, data, onboarding)
// exige sesión Clerk **o** una llave de acceso válida (patrón liga-llave).
// /km/* sirve el manifest de la liga instalable (se valida en su route).
const isPublic = createRouteMatcher([
  "/",
  "/login(.*)",
  "/registro(.*)",
  "/api/health",
  "/api/webhooks/(.*)",
  "/km/(.*)",
]);

function setKeyCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  return res;
}

// Liga-llave. Devuelve una respuesta si maneja el request por completo
// (instala cookie desde la liga, o concede acceso con cookie válida);
// devuelve null para que continúe la lógica de Clerk.
function ligaLlave(req: NextRequest): NextResponse | null {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);

  // 1) ¿La ruta es exactamente un token de acceso /<TOKEN>? -> instala la
  //    cookie de 1 año y deja renderizar la página de instalación.
  if (segments.length === 1 && tokenRole(segments[0])) {
    return setKeyCookie(NextResponse.next(), segments[0]);
  }

  // 2) ¿Trae ya una cookie de llave válida? -> acceso total, sin Clerk.
  if (tokenRole(req.cookies.get(ACCESS_COOKIE)?.value)) {
    return NextResponse.next();
  }

  return null;
}

export default clerkEnabled
  ? clerkMiddleware(async (auth, req) => {
      const handled = ligaLlave(req);
      if (handled) return handled;
      if (!isPublic(req)) {
        const { userId, redirectToSignIn } = await auth();
        if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
      }
    })
  : function middleware(req: NextRequest) {
      return ligaLlave(req) ?? NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|favicon|icon|apple-touch-icon|og\\.png|manifest\\.json|sw\\.js|.*\\.(?:png|svg|jpg|jpeg|webp|ico|css|js|map|txt|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
};
