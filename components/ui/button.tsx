'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Variants ────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    // Base
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium',
    'rounded-lg border transition-all duration-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    'disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-primary to-primary-light text-white',
          'border-transparent',
          'hover:from-primary-dark hover:to-primary',
          'shadow-ember-sm hover:shadow-ember-md',
          'active:scale-[0.97]',
        ],
        secondary: [
          'bg-surface-container text-on-surface',
          'border-surface-border',
          'hover:bg-surface-container-high hover:border-primary/30',
          'backdrop-blur-sm',
        ],
        outline: [
          'bg-transparent text-primary',
          'border-primary/60',
          'hover:bg-primary/10 hover:border-primary',
        ],
        ghost: [
          'bg-transparent text-on-surface-muted',
          'border-transparent',
          'hover:bg-surface-variant hover:text-on-surface',
        ],
        danger: [
          'bg-danger/15 text-red-400',
          'border-danger/30',
          'hover:bg-danger hover:text-white hover:border-danger',
        ],
      },
      size: {
        sm:   'h-8  px-3   text-xs  gap-1.5',
        md:   'h-10 px-4   text-sm  gap-2',
        lg:   'h-12 px-6   text-base gap-2',
        icon: 'h-10 w-10  p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// ─── Press animation wrapper ─────────────────────────────────────────────────

const MotionButton = motion.button

// ─── Component ───────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      )
    }

    return (
      <MotionButton
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {loading ? (
          <>
            <Loader2
              className={cn(
                'animate-spin shrink-0',
                size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
              )}
              aria-hidden="true"
            />
            <span className="sr-only">Cargando...</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="shrink-0" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="shrink-0" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
