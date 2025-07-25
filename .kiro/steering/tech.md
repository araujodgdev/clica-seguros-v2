# Tech Stack & Build System

## Framework & Runtime
- **Next.js 15.3.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety and development experience
- **Node.js** - Runtime environment

## Styling & UI
- **Tailwind CSS 4.1.11** - Utility-first CSS framework with custom design tokens
- **Framer Motion 12.20.1** - Animation library for smooth interactions
- **Radix UI** - Headless UI components (@radix-ui/react-icons, @radix-ui/react-slot)
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variant management

## Utilities
- **clsx & tailwind-merge** - Conditional className utilities
- **PostCSS** - CSS processing

## Development Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Build Configuration
- **next.config.ts** - Next.js configuration (minimal setup)
- **tailwind.config.ts** - Custom design system with extensive color palette and animations
- **postcss.config.mjs** - PostCSS configuration
- **tsconfig.json** - TypeScript configuration

## Design System Integration
The project uses a comprehensive design system defined in `design.json` with:
- Custom color palette (primary green #52C41A, neutrals, accent colors)
- Typography scale with clamp() for responsive sizing
- Animation keyframes and transitions
- Elevation shadows and glassmorphism effects