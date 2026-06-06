import { Logo } from "@/components/logo";
import Link from "next/link";

// Marco visual compartido de /login y /registro — mismo lenguaje que la landing.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="noise relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 animate-aurora rounded-full bg-primary/20 blur-[140px]" />
      <div className="relative z-10 mb-8">
        <Link href="/" aria-label="Volver al inicio">
          <Logo size={36} />
        </Link>
      </div>
      <div className="relative z-10 w-full max-w-md [&>div]:mx-auto">{children}</div>
    </div>
  );
}
