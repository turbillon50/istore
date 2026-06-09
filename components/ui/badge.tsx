import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// --- Variants ----------------------------------------------------------------

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: [
          'bg-surface-variant text-on-surface-muted',
          'border border-surface-border',
        ],
        primary: [
          'bg-primary/15 text-primary-300',
          'border border-primary/30',
        ],
        success: [
          'bg-success/15 text-green-400',
          'border border-success/30',
        ],
        warning: [
          'bg-warning/15 text-yellow-400',
          'border border-warning/30',
        ],
        danger: [
          'bg-danger/15 text-red-400',
          'border border-danger/30',
        ],
        outline: [
          'bg-transparent text-on-surface-muted',
          'border border-surface-border',
        ],
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5 rounded-md',
        md: 'text-xs px-2.5 py-1 rounded-lg',
        lg: 'text-sm px-3 py-1.5 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// --- Dot indicator -----------------------------------------------------------

const dotColors: Record<string, string> = {
  default: 'bg-on-surface-faint',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
  outline: 'bg-on-surface-muted',
}

// --- Props --------------------------------------------------------------------

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

// --- Component ---------------------------------------------------------------

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size, dot = false, children, ...props }, ref) => {
    const dotColor = dotColors[variant ?? 'default'] ?? dotColors.default

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'inline-block rounded-full shrink-0',
              size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5',
              dotColor
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
