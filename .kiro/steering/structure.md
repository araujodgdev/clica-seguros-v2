# Project Structure & Organization

## Root Directory
```
├── .git/                    # Git repository
├── .kiro/                   # Kiro IDE configuration and steering
├── .next/                   # Next.js build output
├── node_modules/            # Dependencies
├── public/                  # Static assets
├── src/                     # Source code
├── design.json              # Design system specification
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Source Code Structure (`src/`)
```
src/
├── app/                     # Next.js App Router
│   ├── favicon.ico          # Site favicon
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── sections/            # Page section components
│   ├── ui/                  # Reusable UI components
│   ├── footer.tsx           # Site footer
│   └── header.tsx           # Site header
└── lib/                     # Utility functions
    └── utils.ts             # Common utilities (cn function)
```

## Component Organization

### Sections (`src/components/sections/`)
Landing page sections following a modular approach:
- `hero-section.tsx` - Main hero with CTA
- `sinistro-sem-estresse-section.tsx` - Stress-free claims
- `como-funciona-section.tsx` - How it works
- `nosso-compromisso-section.tsx` - Our commitment
- `para-todos-os-carros-section.tsx` - For all cars
- `social-proof-section.tsx` - Customer testimonials/stats
- `cta-section.tsx` - Call-to-action section

### UI Components (`src/components/ui/`)
Reusable design system components:
- `button.tsx` - Button component with variants using CVA
- `badge.tsx` - Badge/tag component
- `glass-card.tsx` - Glassmorphism card component
- `animated-text.tsx` - Text animation component

## Naming Conventions
- **Files**: kebab-case (e.g., `hero-section.tsx`)
- **Components**: PascalCase (e.g., `HeroSection`)
- **Functions**: camelCase (e.g., `AnimatedCounter`)
- **CSS Classes**: Tailwind utilities with custom design tokens

## Import Patterns
- Use `@/` alias for src directory imports
- Group imports: React/Next.js, third-party, local components, utilities
- Prefer named exports for components

## Component Patterns
- Use `'use client'` directive for interactive components
- Implement Framer Motion for animations
- Follow compound component pattern for complex UI
- Use TypeScript interfaces for props
- Implement responsive design with Tailwind breakpoints

## Asset Organization
- Images in `public/` directory
- Optimized images for mobile/desktop variants
- SVG icons preferred for scalability