import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";
import { AuthShell } from "../../auth-shell";

export const metadata = { title: "Crea tu cuenta" };

export default function RegistroPage() {
  if (!clerkEnabled) redirect("/");
  return (
    <AuthShell>
      {/* Alta nueva → onboarding. Login normal → dashboard. */}
      <SignUp forceRedirectUrl="/onboarding" signInUrl="/login" />
    </AuthShell>
  );
}
