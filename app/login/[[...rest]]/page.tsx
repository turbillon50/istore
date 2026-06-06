import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";
import { AuthShell } from "../../auth-shell";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  if (!clerkEnabled) redirect("/"); // modo demo: sin Clerk no hay login real
  return (
    <AuthShell>
      <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/registro" />
    </AuthShell>
  );
}
