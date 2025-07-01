'use client'

import * as React from 'react'
import { motion, Variants } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  staggerChildren?: number
  animationType?: 'fadeUp' | 'typewriter' | 'slide' | 'blur'
}

const containerVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  },
  typewriter: {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  },
  slide: {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  },
  blur: {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.04 * i },
    }),
  },
}

const childVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  },
  typewriter: {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  },
  slide: {
    hidden: {
      opacity: 0,
      x: 20,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
  },
  blur: {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
      },
    },
  },
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  animationType = 'fadeUp',
}: AnimatedTextProps) {
  const words = text.split(' ')

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants[animationType]}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em] last:mr-0"
          variants={childVariants[animationType]}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Component for character-by-character animation
export function AnimatedCharacters({
  text,
  className = '',
  delay = 0,
  animationType = 'fadeUp',
}: AnimatedTextProps) {
  const letters = Array.from(text)

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants[animationType]}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
          variants={childVariants[animationType]}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  )
} 