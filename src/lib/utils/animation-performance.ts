/**
 * Animation performance utilities for optimized motion
 */

// Optimized animation variants for better performance
export const optimizedVariants = {
  // Use transform properties for better GPU acceleration
  fadeInUp: {
    initial: { 
      opacity: 0, 
      y: 20,
      // Force GPU acceleration
      transform: 'translateZ(0)',
      willChange: 'transform, opacity'
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoother animation
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  },
  
  fadeInScale: {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      transform: 'translateZ(0)',
      willChange: 'transform, opacity'
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  },
  
  slideInRight: {
    initial: { 
      opacity: 0, 
      x: 50,
      transform: 'translateZ(0)',
      willChange: 'transform, opacity'
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 }
    }
  }
}

// Optimized transition settings
export const optimizedTransitions = {
  // Standard transition for most animations
  standard: {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94]
  },
  
  // Quick transition for hover effects
  quick: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94]
  },
  
  // Smooth transition for page changes
  smooth: {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94]
  },
  
  // Spring transition for interactive elements
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
}

// Performance-optimized stagger settings
export const optimizedStagger = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: optimizedTransitions.standard
    }
  }
}

// Utility to check if user prefers reduced motion
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Utility to get optimized animation props based on user preferences
export const getOptimizedAnimationProps = (variant: keyof typeof optimizedVariants) => {
  const reduceMotion = shouldReduceMotion()
  
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 }
    }
  }
  
  return optimizedVariants[variant]
}

// Performance monitoring for animations
export const animationPerformanceMonitor = {
  start: (animationName: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`animation-${animationName}-start`)
    }
  },
  
  end: (animationName: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`animation-${animationName}-end`)
      window.performance.measure(
        `animation-${animationName}`,
        `animation-${animationName}-start`,
        `animation-${animationName}-end`
      )
    }
  }
}

// Optimized viewport settings for intersection observer
export const optimizedViewport = {
  once: true,
  margin: "0px 0px -100px 0px", // Trigger animation before element is fully visible
  amount: 0.3 // Trigger when 30% of element is visible
}