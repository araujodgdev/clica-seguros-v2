# Project Structure

## Root Directory
```
├── src/                    # Source code
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration and steering
├── .next/                  # Next.js build output
└── node_modules/           # Dependencies
```

## Source Code Organization (`src/`)

### App Router Structure (`src/app/`)
- **`page.tsx`** - Home page with landing sections
- **`layout.tsx`** - Root layout with fonts and header
- **`globals.css`** - Global styles and Tailwind imports
- **`cotacao/`** - Quote results pages
  - `page.tsx` - Quote listing page
  - `[offerId]/page.tsx` - Individual quote details
- **`simulacao/`** - Insurance simulation flow
  - `page.tsx` - Simulation form page

### Components (`src/components/`)
- **`sections/`** - Landing page sections (hero, features, CTA, etc.)
- **`simulation/`** - Multi-step simulation form components
  - `simulation-form.tsx` - Main orchestrator component
  - `initial-form.tsx` - First step (user details + license plate)
  - `car-details-confirmation.tsx` - Second step (confirm car info)
  - `loading-state.tsx` - Third step (processing)
  - `error-recovery.tsx` - Error handling component
  - `__tests__/` - Component tests
- **`ui/`** - Reusable UI components (buttons, cards, badges)
- **`header.tsx`** - Site navigation
- **`footer.tsx`** - Site footer

### Library Code (`src/lib/`)
- **`types/`** - TypeScript interfaces and types
  - `simulation.ts` - Form data, car details, insurance offers
- **`services/`** - Business logic and API calls
  - `mock-data.ts` - Mock data service for car lookup
  - `navigation.ts` - Navigation utilities with retry logic
- **`validation/`** - Form validation logic
  - `form-validation.ts` - Validation rules and functions
- **`utils/`** - Utility functions
  - `utils.ts` - General utilities (cn function, etc.)
  - `animation-performance.ts` - Animation optimization
  - `performance-monitor.ts` - Performance monitoring

### Testing (`src/test/`)
- **`setup.ts`** - Test environment configuration

## Design System Conventions

### Color Palette
- **Primary**: `#52C41A` (green)
- **Neutrals**: off-white, light-gray, medium-gray, dark-gray, charcoal
- **Accents**: forest-green, emerald-green

### Typography
- **Primary Font**: Inter (via CSS variable `--font-inter`)
- **Responsive Sizing**: `clamp()` functions for hero, h1, h2

### Spacing System
- **Custom Scale**: xs(0.5rem), sm(1rem), md(1.5rem), lg(2rem), xl(3rem), xxl(4rem), xxxl(6rem)

### Component Patterns
- **Glass Cards**: Backdrop blur effects with subtle borders
- **Animations**: Framer Motion with performance optimizations
- **Lazy Loading**: Suspense boundaries for code splitting
- **Error Boundaries**: Comprehensive error handling with retry logic

## File Naming Conventions
- **Components**: kebab-case (e.g., `hero-section.tsx`)
- **Pages**: Next.js App Router conventions
- **Types**: Descriptive interfaces (e.g., `FormData`, `CarDetails`)
- **Tests**: `*.test.tsx` or `*.test.ts` in `__tests__/` folders