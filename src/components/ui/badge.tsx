'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-neutral-charcoal text-white',
        primary: 'bg-primary text-neutral-charcoal',
        secondary: 'bg-neutral-light-gray text-neutral-charcoal',
        success: 'bg-accent-emerald-green text-white',
        destructive: 'bg-red-500 text-white',
        outline: 'border border-neutral-charcoal text-neutral-charcoal',
        ghost: 'bg-transparent text-neutral-medium-gray hover:bg-neutral-light-gray',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.25 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
      animated: {
        true: 'animate-pulse',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animated: false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  onRemove?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, animated, icon, onRemove, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={badgeVariants({ variant, size, animated, className })}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Remove"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </motion.div>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants } 