import { OnboardingWizard } from "./wizard";

export const metadata = { title: "Configura tu taller" };
export const dynamic = "force-dynamic";

// Protegida por middleware (requiere sesión cuando Clerk está activo).
export default function OnboardingPage() {
  return <OnboardingWizard />;
}
