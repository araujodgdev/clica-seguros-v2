# Design Document

## Overview

The car insurance quote simulation feature will be integrated into the existing CTA section, transforming it into a multi-step interactive experience. The design maintains the current visual hierarchy and glassmorphism aesthetic while introducing a progressive disclosure pattern that guides users through the quote process.

The feature consists of three main phases:
1. **Initial Form** - Collect user information (name, email, license plate)
2. **Car Details Confirmation** - Display mocked vehicle information for user verification
3. **Loading & Redirect** - Show progress indicators and redirect to a new quotes page

## Architecture

### Component Structure

```
CtaSection (Enhanced)
├── SimulationForm (New)
│   ├── InitialForm (Step 1)
│   ├── CarDetailsConfirmation (Step 2)
│   └── LoadingState (Step 3)
├── AnimatedBackground (Existing)
├── FloatingTestimonial (Existing)
└── CountdownTimer (Existing)

New Pages:
├── app/cotacao/page.tsx (Quote Results)
├── app/cotacao/[offerId]/page.tsx (Offer Details)
```

### State Management

The simulation will use React's `useState` to manage:
- Current step (1-3)
- Form data (name, email, license plate)
- Mocked car details
- Loading states
- Error states

### Data Flow

1. User submits initial form → Validate inputs → Generate mocked car data
2. User confirms car details → Trigger loading state → Simulate API call
3. Loading completes → Navigate to `/cotacao` with query parameters

## Components and Interfaces

### Enhanced SimulationForm Component

```typescript
interface FormData {
  name: string
  email: string
  licensePlate: string
}

interface CarDetails {
  make: string
  model: string
  year: number
  fipeCode: string
  estimatedValue: number
}

interface SimulationFormProps {
  onComplete: (data: FormData & { carDetails: CarDetails }) => void
}
```

### Step Components

#### InitialForm
- Three input fields with validation
- Brazilian license plate format validation (ABC-1234 or ABC1D234)
- Email format validation
- Name length validation
- Submit button with loading state

#### CarDetailsConfirmation
- Display mocked car information in a card format
- "Confirm Details" and "Edit Information" buttons
- Smooth transition animations

#### LoadingState
- Progress bar animation
- Motivational messaging
- 3-5 second duration before redirect

### New Pages

#### Quote Results Page (`/cotacao`)
```typescript
interface InsuranceOffer {
  id: string
  insurerName: string
  monthlyPremium: number
  coverageHighlights: string[]
  savings: number
  rating: number
}
```

#### Offer Details Page (`/cotacao/[offerId]`)
- Detailed coverage information
- Pricing breakdown
- Terms and conditions
- "Proceed to Purchase" CTA

## Data Models

### Mock Data Structure

```typescript
// Car database mock
const MOCK_CARS: Record<string, CarDetails> = {
  'ABC1234': {
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    fipeCode: '038001-1',
    estimatedValue: 85000
  },
  // Additional mock entries...
}

// Insurance offers mock
const MOCK_OFFERS: InsuranceOffer[] = [
  {
    id: 'offer-1',
    insurerName: 'Seguradora Premium',
    monthlyPremium: 180,
    coverageHighlights: ['Cobertura Total', 'Carro Reserva', 'Assistência 24h'],
    savings: 40,
    rating: 4.8
  },
  // Additional offers...
]
```

### Form Validation Rules

```typescript
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  licensePlate: {
    required: true,
    pattern: /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}-?[0-9]{4}$/
  }
}
```

## Error Handling

### Validation Errors
- Real-time field validation with visual feedback
- Error messages displayed below each field
- Form submission disabled until all validations pass

### System Errors
- Network simulation errors (rare, for realism)
- Fallback to generic car details if license plate not found
- Retry mechanisms for loading states

### User Experience Errors
- Clear messaging for unsupported license plate formats
- Graceful degradation if JavaScript is disabled
- Accessibility considerations for screen readers

## Testing Strategy

### Unit Tests
- Form validation logic
- Mock data generation
- State transitions
- Component rendering

### Integration Tests
- Multi-step form flow
- Navigation between steps
- Data persistence across steps
- Page redirections

### E2E Tests
- Complete user journey from CTA to quote results
- Mobile responsiveness
- Cross-browser compatibility
- Performance metrics

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation
- Focus management

## Visual Design Integration

### Design System Consistency
- Maintain existing glassmorphism effects from current CTA
- Use established color palette (primary green #52C41A)
- Follow typography scale from design.json
- Preserve animation patterns and timing

### Step Transitions
- Smooth fade-in/fade-out animations using Framer Motion
- Consistent with existing site animations (0.6s cubic-bezier)
- Progressive disclosure with appropriate visual hierarchy

### Loading States
- Branded progress indicators
- Consistent with existing loading patterns
- Motivational copy aligned with brand voice

### Mobile Responsiveness
- Maintain current responsive breakpoints
- Stack form elements appropriately on mobile
- Preserve touch-friendly button sizes
- Optimize for mobile form completion

## Performance Considerations

### Code Splitting
- Lazy load quote results page components
- Dynamic imports for heavy form validation libraries
- Optimize bundle size for initial CTA load

### Data Management
- Client-side mock data to avoid API calls
- Local storage for form persistence (optional)
- Efficient state updates to prevent unnecessary re-renders

### Animation Performance
- Use transform and opacity for animations
- Leverage GPU acceleration
- Debounce form validation to reduce computation

## Security Considerations

### Data Handling
- Client-side validation only (no sensitive data transmission)
- No persistent storage of personal information
- Clear data on page refresh or navigation away

### Input Sanitization
- Sanitize all form inputs before processing
- Prevent XSS through proper escaping
- Validate license plate format strictly

## Implementation Notes

### Technology Stack Integration
- Built with existing Next.js 15.3.4 and React 19
- Leverages current Framer Motion 12.20.1 for animations
- Uses established Tailwind CSS configuration
- Integrates with existing TypeScript setup

### Routing Strategy
- Utilize Next.js App Router for new pages
- Implement proper SEO meta tags for quote pages
- Handle dynamic routing for offer details
- Maintain proper URL structure for sharing

### Development Approach
- Enhance existing CTA component incrementally
- Create new page components following established patterns
- Maintain backward compatibility with current design
- Follow existing code organization and naming conventions