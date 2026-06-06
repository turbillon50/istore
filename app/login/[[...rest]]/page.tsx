import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";
import { AuthShell } from "../../auth-shell";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  if (!clerkEnabled) redirect("/"); // modo demo: sin Clerk no hay login real
  return (
    <AuthShell>
      {/* Anti-loop: forceRedirectUrl garantiza que tras login SIEMPRE se entra al
          dashboard, nunca se rebota a una ruta protegida que reactive el guard. */}
      <SignIn
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/registro"
      />
    </AuthShell>
  );
}
