import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ─── Card Variants ────────────────────────────────────────────────────────────

const cardVariants = cva(
  'rounded-xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: [
          'bg-surface-container',
          'border border-surface-border',
          'shadow-obsidian',
          'hover:border-primary/20',
        ],
        elevated: [
          'bg-surface-container-high',
          'border border-surface-border',
          'shadow-[0_8px_40px_rgba(0,0,0,0.5)]',
          'hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)]',
        ],
        flat: [
          'bg-surface-container-low',
          'border-0',
        ],
        bordered: [
          'bg-transparent',
          'border-2 border-surface-border',
          'hover:border-primary/40',
        ],
        glow: [
          'bg-surface-container',
          'border border-surface-border',
          'shadow-obsidian',
          'hover:border-primary/50',
          'hover:shadow-ember-md',
          'hover:[box-shadow:0_0_16px_4px_rgba(255,140,0,0.25),0_4px_24px_rgba(0,0,0,0.5)]',
        ],
        glass: [
          'backdrop-blur-[16px] saturate-150',
          'bg-surface-container/70',
          'border border-white/[0.08]',
          'shadow-glass',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

// ─── CardHeader ───────────────────────────────────────────────────────────────

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show a subtle bottom border divider */
  divider?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-1 p-5',
        divider && 'border-b border-surface-border pb-4',
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

// ─── CardTitle ────────────────────────────────────────────────────────────────

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-base font-semibold leading-tight text-on-surface tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

// ─── CardDescription ─────────────────────────────────────────────────────────

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-on-surface-muted leading-relaxed', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

// ─── CardContent ─────────────────────────────────────────────────────────────

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-5 pt-0 first:pt-5', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

// ─── CardFooter ──────────────────────────────────────────────────────────────

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show a subtle top border divider */
  divider?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-5 pt-0',
        divider && 'border-t border-surface-border pt-4',
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
}
