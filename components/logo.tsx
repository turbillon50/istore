import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  size = 32,
  tagline = "Celulares & Reparación",
}: {
  className?: string;
  showText?: boolean;
  size?: number;
  tagline?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative grid place-items-center overflow-hidden rounded-[28%] bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-primary/40 ring-1 ring-white/20"
        style={{ width: size, height: size }}
      >
        {/* specular sheen */}
        <span className="pointer-events-none absolute inset-x-0 -top-1/2 h-full bg-white/25 blur-md" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-[58%] w-[58%]"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* speaker slit */}
          <path d="M9.5 4.2h5" opacity="0.9" />
          {/* wrench */}
          <path
            d="M10.6 8.7a2.6 2.6 0 0 0-1.1 3.4 2.6 2.6 0 0 0 3.3 1.2l2.6 5.1c.4.8 1.3 1.1 2 .7.8-.4 1-1.3.7-2l-2.6-5.1a2.6 2.6 0 0 0-.5-3.4 2.6 2.6 0 0 0-2.6-.5l1.3 1.8-.7 1.4-1.6.3-1.1-1.5Z"
            fill="currentColor"
            stroke="none"
          />
          {/* home indicator */}
          <path d="M10.4 19.6h3.2" opacity="0.7" />
        </svg>
      </div>
      {showText && (
        <div className="leading-tight">
          <span className="block text-[15px] font-semibold tracking-tight">
            iStore
          </span>
          <span className="block text-[10px] text-muted-foreground">
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
}
