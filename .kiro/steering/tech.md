# Technology Stack

## Framework & Runtime
- **Next.js 15.3.4** with App Router
- **React 19** with TypeScript
- **Node.js** runtime environment

## Styling & UI
- **Tailwind CSS 4.1.11** for styling with custom design system
- **Framer Motion 12.20.1** for animations and transitions
- **Radix UI** components for accessible primitives
- **Lucide React** for icons
- **Class Variance Authority** for component variants

## Development Tools
- **TypeScript 5** for type safety
- **Vitest 3.2.4** for testing with jsdom environment
- **Testing Library** (React, Jest DOM, User Event) for component testing
- **ESLint** via Next.js for code linting

## Build System & Performance
- **Standalone output** for optimized deployments
- **Package import optimization** for framer-motion and lucide-react
- **Image optimization** with WebP/AVIF formats
- **Compression enabled** for production builds

## Common Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
```

## Path Aliases
- `@/*` maps to `./src/*` for clean imports

## Performance Optimizations
- Lazy loading for simulation components
- Image optimization with multiple formats and sizes
- Bundle optimization with experimental package imports
- Component-level code splitting