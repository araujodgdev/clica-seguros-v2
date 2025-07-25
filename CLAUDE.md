# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Project Setup
- Uses Node.js with Next.js 15.3.4 and React 19
- TypeScript configuration with strict type checking
- Tailwind CSS 4.1.11 for styling with custom design system

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: Framer Motion for interactions and animations
- **Icons**: Lucide React icons
- **UI Components**: Custom component library with shadcn/ui patterns

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and Header
│   ├── page.tsx           # Homepage with all sections
│   └── globals.css        # Global styles and CSS variables
├── components/
│   ├── header.tsx         # Main navigation with mega menus
│   ├── footer.tsx         # Site footer
│   ├── sections/          # Page sections (hero, CTA, etc.)
│   └── ui/                # Reusable UI components
└── lib/
    └── utils.ts           # Utility functions (cn helper)
```

### Design System
The project uses a comprehensive design system defined in `tailwind.config.ts`:

**Colors**: 
- Primary: `#52C41A` (green)
- Neutrals: off-white, light-gray, medium-gray, dark-gray, charcoal
- Accents: forest-green, emerald-green variants

**Typography**: 
- Uses Inter font as primary with Geist and Space Grotesk as alternatives
- Responsive text sizing with clamp() functions
- Custom hero/heading size scales

**Spacing & Layout**:
- Custom spacing scale (xs: 0.5rem to xxxl: 6rem)
- Consistent border radius tokens (button: 0.5rem, card: 1rem)
- Elevation system with 4 levels of box shadows

### Component Patterns

**Animation Patterns**:
- Framer Motion used throughout for micro-interactions
- Custom animations: fadeInUp, float, marquee, shimmer
- Scroll-based parallax effects in hero section
- Hover states with scale/transform effects

**UI Components**:
- `Button`: Comprehensive variant system (default, outline, ghost, gradient)
- `Badge`: Status indicators with variants
- `AnimatedText`: Text reveal animations
- `GlassCard`: Glassmorphism card component

**Section Components**:
- Each page section is a separate component in `components/sections/`
- Follows consistent animation and layout patterns
- Responsive design with mobile-first approach

### Key Features

**Header Component**:
- Sticky header with scroll-based animations
- Mega menu system with animated dropdowns
- Mobile-responsive navigation
- Search functionality and notifications

**Hero Section**:
- Parallax background with image optimization
- Floating card animations
- Animated counters and statistics
- Responsive design with different mobile layout

**Styling Approach**:
- Utility-first with Tailwind CSS
- Custom design tokens in config
- Consistent animation timing and easing
- Glass morphism and backdrop blur effects

## Development Guidelines

### Component Creation
- Follow existing component patterns in `/ui` directory
- Use Framer Motion for animations consistently
- Implement responsive design with mobile-first approach
- Utilize design system tokens from Tailwind config

### Styling Conventions
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Follow color palette and spacing defined in Tailwind config
- Implement hover states and animations consistently
- Use semantic color names from design system

### Code Organization
- Keep section components focused and single-responsibility
- Extract reusable logic into custom hooks when needed
- Use TypeScript interfaces for component props
- Follow Next.js App Router conventions