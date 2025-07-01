'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'

const glassCardVariants = cva(
  'relative overflow-hidden backdrop-blur-md transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white/10 border border-white/20',
        dark: 'bg-black/10 border border-black/20',
        colored: 'bg-gradient-to-br from-white/20 to-white/5 border border-white/30',
        subtle: 'bg-white/5 border border-white/10',
      },
      blur: {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-lg',
        md: 'rounded-xl',
        lg: 'rounded-2xl',
        full: 'rounded-full',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      }
    },
    defaultVariants: {
      variant: 'default',
      blur: 'md',
      padding: 'md',
      rounded: 'md',
      shadow: 'lg',
    },
  }
)

export interface GlassCardProps
  extends HTMLMotionProps<'div'>,
    VariantProps<typeof glassCardVariants> {
  hoverEffect?: boolean
  glowEffect?: boolean
  children: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant, 
    blur, 
    padding, 
    rounded, 
    shadow,
    hoverEffect = true,
    glowEffect = false,
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    return (
      <motion.div
        ref={ref}
        className={glassCardVariants({ variant, blur, padding, rounded, shadow, className })}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={hoverEffect ? { 
          scale: 1.02,
          transition: { duration: 0.2 }
        } : undefined}
        {...props}
      >
        {/* Glow effect */}
        {glowEffect && (
          <motion.div
            className="absolute inset-0 opacity-0"
            animate={{
              opacity: isHovered ? 0.3 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-emerald-green/20 to-primary/20 blur-xl" />
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Shine effect on hover */}
        {hoverEffect && (
          <motion.div
            className="absolute inset-0 opacity-0"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full"
              style={{
                animation: isHovered ? 'shimmer 1s ease-in-out' : 'none',
              }}
            />
          </motion.div>
        )}
      </motion.div>
    )
  }
)
GlassCard.displayName = 'GlassCard'

export { GlassCard, glassCardVariants } 