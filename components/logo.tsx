import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  size = 32,
}: {
  className?: string;
  showText?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative grid place-items-center rounded-xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-lg shadow-primary/30"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-1/2 w-1/2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M11 6h2" />
          <circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      </div>
      {showText && (
        <div className="leading-tight">
          <span className="block text-[15px] font-semibold tracking-tight">
            iStore <span className="text-primary">Pro</span>
          </span>
          <span className="block text-[10px] text-muted-foreground">
            Repair Management
          </span>
        </div>
      )}
    </div>
  );
}
