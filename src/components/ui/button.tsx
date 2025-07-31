'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary shadow-md hover:shadow-lg',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
        outline: 'border-2 border-neutral-charcoal bg-transparent text-neutral-charcoal hover:bg-neutral-charcoal hover:text-white focus-visible:ring-neutral-charcoal',
        secondary: 'bg-neutral-charcoal text-white hover:bg-neutral-dark-gray focus-visible:ring-neutral-charcoal shadow-md hover:shadow-lg',
        ghost: 'hover:bg-neutral-light-gray hover:text-neutral-charcoal focus-visible:ring-neutral-medium-gray',
        link: 'text-neutral-charcoal underline-offset-4 hover:underline focus-visible:ring-neutral-charcoal',
        gradient: 'bg-gradient-to-r from-accent-forest-green to-accent-emerald-green text-white hover:shadow-lg focus-visible:ring-accent-emerald-green',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm rounded-button',
        sm: 'h-8 px-3 text-xs rounded-button',
        lg: 'h-12 px-6 text-base rounded-button min-h-[48px]',
        xl: 'h-14 px-8 text-lg rounded-button min-h-[56px]',
        icon: 'h-10 w-10 rounded-button',
      },
      roundness: {
        default: 'rounded-button',
        full: 'rounded-full',
        none: 'rounded-none',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      roundness: 'default',
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    roundness,
    isLoading = false,
    loadingText,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        className={buttonVariants({ variant, size, roundness, className })}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg 
              className="animate-spin h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || children}
          </span>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
