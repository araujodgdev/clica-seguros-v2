/**
 * Visual regression tests for design consistency across the simulation feature
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { InitialForm } from '../initial-form'
import { CarDetailsConfirmation } from '../car-details-confirmation'
import { LoadingState } from '../loading-state'
import { SimulationForm } from '../simulation-form'

// Mock Framer Motion for consistent visual testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { whileFocus, initial, animate, exit, transition, variants, ...restProps } = props
      return <div {...restProps}>{children}</div>
    },
    input: ({ children, ...props }: any) => {
      const { whileFocus, initial, animate, exit, transition, variants, ...restProps } = props
      return <input {...restProps}>{children}</input>
    },
    p: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, variants, ...restProps } = props
      return <p {...restProps}>{children}</p>
    },
    button: ({ children, ...props }: any) => {
      const { whileHover, whileTap, initial, animate, exit, transition, variants, ...restProps } = props
      return <button {...restProps}>{children}</button>
    }
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock UI components for consistent testing
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, isLoading, loadingText, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  )
}))

vi.mock('@/components/ui/glass-card', () => ({
  GlassCard: ({ children, className, ...props }: any) => (
    <div className={`glass-card ${className || ''}`} {...props}>
      {children}
    </div>
  )
}))

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    // Mock window dimensions for consistent testing
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 768,
      writable: true
    })
  })

  describe('InitialForm Visual Consistency', () => {
    it('should maintain consistent layout structure', () => {
      const { container } = render(<InitialForm onSubmit={() => {}} />)
      
      // Check main container structure
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveClass('space-y-4', 'sm:space-y-6')
      
      // Check input container structure
      const inputContainers = container.querySelectorAll('.space-y-2')
      expect(inputContainers.length).toBeGreaterThanOrEqual(3) // One for each input
      
      // Check button container
      const buttonContainer = container.querySelector('.pt-4')
      expect(buttonContainer).toBeInTheDocument()
    })

    it('should have consistent typography hierarchy', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      // Main title
      const title = screen.getByText('Comece sua simulação')
      expect(title).toHaveClass('text-xl', 'sm:text-2xl', 'font-bold')
      
      // Subtitle
      const subtitle = screen.getByText('Preencha seus dados para continuar')
      expect(subtitle).toHaveClass('text-neutral-charcoal/70', 'text-sm', 'sm:text-base')
      
      // Input labels
      const labels = document.querySelectorAll('label')
      labels.forEach(label => {
        expect(label).toHaveClass('text-sm', 'font-medium', 'text-neutral-charcoal')
      })
    })

    it('should maintain consistent input styling', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass(
          'w-full',
          'min-h-[48px]',
          'px-4',
          'py-3',
          'rounded-lg',
          'border',
          'border-neutral-silver/30',
          'bg-white/80',
          'backdrop-blur-sm'
        )
      })
    })

    it('should have consistent focus states', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('focus:ring-2', 'focus:ring-primary-sage/50', 'focus:border-primary-sage')
      })
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-primary-sage/50')
    })

    it('should maintain consistent error state styling', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={() => {}} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      
      // Trigger error state
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        expect(nameInput).toHaveClass('border-red-500', 'focus:ring-red-500/50')
        
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toHaveClass('text-red-600', 'text-sm', 'mt-1')
      })
    })

    it('should have consistent benefit list styling', () => {
      const { container } = render(<InitialForm onSubmit={() => {}} />)
      
      const benefitsList = container.querySelector('.space-y-2')
      expect(benefitsList).toBeInTheDocument()
      
      const benefitItems = container.querySelectorAll('.flex.items-center.space-x-2')
      expect(benefitItems.length).toBeGreaterThanOrEqual(3)
      
      benefitItems.forEach(item => {
        const icon = item.querySelector('.w-4.h-4')
        const text = item.querySelector('.text-sm')
        expect(icon).toBeInTheDocument()
        expect(text).toBeInTheDocument()
        expect(text).toHaveClass('text-neutral-charcoal/70')
      })
    })
  })

  describe('CarDetailsConfirmation Visual Consistency', () => {
    const mockCarDetails = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      fipeCode: '038001-1',
      estimatedValue: 85000
    }

    it('should maintain consistent card layout', () => {
      const { container } = render(
        <CarDetailsConfirmation
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      // Main container
      const mainContainer = container.querySelector('.w-full')
      expect(mainContainer).toBeInTheDocument()
      
      // Glass card container
      const glassCard = container.querySelector('.glass-card')
      expect(glassCard).toBeInTheDocument()
      
      // Content sections
      const sections = container.querySelectorAll('.space-y-4, .space-y-6')
      expect(sections.length).toBeGreaterThanOrEqual(2)
    })

    it('should have consistent car details display', () => {
      render(
        <CarDetailsConfirmation
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      // Car name should be prominent
      const carName = screen.getByText('Toyota Corolla')
      expect(carName).toHaveClass('text-xl', 'sm:text-2xl', 'font-bold', 'text-neutral-charcoal')
      
      // Details grid
      const detailsContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2')
      expect(detailsContainer).toBeInTheDocument()
      
      // Detail items
      const detailLabels = document.querySelectorAll('.text-sm.text-neutral-charcoal\\/70')
      const detailValues = document.querySelectorAll('.font-semibold.text-neutral-charcoal')
      
      expect(detailLabels.length).toBeGreaterThanOrEqual(3)
      expect(detailValues.length).toBeGreaterThanOrEqual(3)
    })

    it('should have consistent button styling', () => {
      render(
        <CarDetailsConfirmation
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      const confirmButton = screen.getByText('Confirmar e continuar')
      const editButton = screen.getByText('Editar informações')
      
      // Primary button styling
      expect(confirmButton).toHaveClass(
        'w-full',
        'bg-primary-sage',
        'hover:bg-primary-sage/90',
        'text-white',
        'font-semibold',
        'py-3',
        'px-6',
        'rounded-lg'
      )
      
      // Secondary button styling
      expect(editButton).toHaveClass(
        'w-full',
        'bg-transparent',
        'border',
        'border-neutral-silver/30',
        'text-neutral-charcoal',
        'hover:bg-neutral-silver/10'
      )
    })

    it('should maintain consistent icon and visual elements', () => {
      const { container } = render(
        <CarDetailsConfirmation
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      // Success icon
      const iconContainer = container.querySelector('.w-12.h-12.sm\\:w-16.sm\\:h-16')
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer).toHaveClass('bg-green-100', 'rounded-full', 'flex', 'items-center', 'justify-center')
      
      // FIPE badge
      const fipeBadge = container.querySelector('.bg-blue-50')
      expect(fipeBadge).toBeInTheDocument()
      expect(fipeBadge).toHaveClass('px-2', 'py-1', 'rounded', 'text-xs', 'text-blue-700')
    })
  })

  describe('LoadingState Visual Consistency', () => {
    it('should maintain consistent loading layout', () => {
      const { container } = render(<LoadingState onComplete={() => {}} />)
      
      // Main container
      const mainContainer = container.querySelector('.w-full')
      expect(mainContainer).toBeInTheDocument()
      
      // Glass card
      const glassCard = container.querySelector('.glass-card')
      expect(glassCard).toBeInTheDocument()
      
      // Content sections
      const textCenter = container.querySelector('.text-center')
      expect(textCenter).toBeInTheDocument()
    })

    it('should have consistent progress bar styling', () => {
      const { container } = render(<LoadingState onComplete={() => {}} />)
      
      // Progress container
      const progressContainer = container.querySelector('.relative.w-full.h-2')
      expect(progressContainer).toBeInTheDocument()
      
      // Progress background
      const progressBg = container.querySelector('.absolute.inset-0.bg-neutral-silver\\/20')
      expect(progressBg).toBeInTheDocument()
      expect(progressBg).toHaveClass('rounded-full')
      
      // Progress bar
      const progressBar = container.querySelector('.absolute.inset-y-0.left-0.bg-primary-sage')
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveClass('rounded-full', 'transition-all', 'duration-300')
    })

    it('should have consistent loading icon styling', () => {
      const { container } = render(<LoadingState onComplete={() => {}} />)
      
      // Icon container
      const iconContainer = container.querySelector('.w-16.h-16.sm\\:w-20.sm\\:h-20')
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer).toHaveClass('bg-primary-sage/10', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mb-6', 'sm:mb-8')
      
      // Loading icon
      const loadingIcon = container.querySelector('.w-8.h-8.sm\\:w-10.sm\\:h-10')
      expect(loadingIcon).toBeInTheDocument()
      expect(loadingIcon).toHaveClass('text-primary-sage', 'animate-spin')
    })

    it('should have consistent message typography', () => {
      render(<LoadingState onComplete={() => {}} />)
      
      // Main message
      const mainMessage = screen.getByText(/analisando seu perfil/i)
      expect(mainMessage).toHaveClass('text-lg', 'sm:text-xl', 'font-semibold', 'text-neutral-charcoal', 'mb-2')
      
      // Sub message
      const subMessage = screen.getByText(/buscando as melhores opções/i)
      expect(subMessage).toHaveClass('text-sm', 'sm:text-base', 'text-neutral-charcoal/70', 'mb-6', 'sm:mb-8')
    })

    it('should have consistent benefit items styling', () => {
      const { container } = render(<LoadingState onComplete={() => {}} />)
      
      const benefitItems = container.querySelectorAll('.flex.items-center.justify-between')
      expect(benefitItems.length).toBeGreaterThanOrEqual(3)
      
      benefitItems.forEach(item => {
        const text = item.querySelector('.text-sm.text-neutral-charcoal')
        const badge = item.querySelector('.bg-green-100')
        
        expect(text).toBeInTheDocument()
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('px-2', 'py-1', 'rounded', 'text-xs', 'font-medium', 'text-green-700')
      })
    })
  })

  describe('Responsive Design Consistency', () => {
    const viewports = [
      { width: 320, height: 568, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Desktop' }
    ]

    viewports.forEach(viewport => {
      describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        beforeEach(() => {
          Object.defineProperty(window, 'innerWidth', {
            value: viewport.width,
            writable: true
          })
          Object.defineProperty(window, 'innerHeight', {
            value: viewport.height,
            writable: true
          })
        })

        it('should maintain consistent InitialForm layout', () => {
          const { container } = render(<InitialForm onSubmit={() => {}} />)
          
          // Container should be responsive
          const mainContainer = container.querySelector('.w-full')
          expect(mainContainer).toBeInTheDocument()
          
          // Form should maintain structure
          const form = container.querySelector('form')
          expect(form).toBeInTheDocument()
          expect(form).toHaveClass('space-y-4', 'sm:space-y-6')
        })

        it('should maintain consistent CarDetailsConfirmation layout', () => {
          const { container } = render(
            <CarDetailsConfirmation
              carDetails={{
                make: 'Toyota',
                model: 'Corolla',
                year: 2020,
                fipeCode: '038001-1',
                estimatedValue: 85000
              }}
              onConfirm={() => {}}
              onEdit={() => {}}
            />
          )
          
          // Should maintain responsive grid
          const grid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2')
          expect(grid).toBeInTheDocument()
          
          // Buttons should stack properly
          const buttonContainer = container.querySelector('.space-y-3')
          expect(buttonContainer).toBeInTheDocument()
        })

        it('should maintain consistent LoadingState layout', () => {
          const { container } = render(<LoadingState onComplete={() => {}} />)
          
          // Icon should be responsive
          const icon = container.querySelector('.w-16.h-16.sm\\:w-20.sm\\:h-20')
          expect(icon).toBeInTheDocument()
          
          // Spacing should be responsive
          const spacingElement = container.querySelector('.mb-6.sm\\:mb-8')
          expect(spacingElement).toBeInTheDocument()
        })
      })
    })
  })

  describe('Theme and Color Consistency', () => {
    it('should use consistent primary colors', () => {
      const { container } = render(<InitialForm onSubmit={() => {}} />)
      
      // Primary sage color usage
      const primaryElements = container.querySelectorAll('[class*="primary-sage"]')
      expect(primaryElements.length).toBeGreaterThan(0)
      
      // Check button uses primary color
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-sage')
    })

    it('should use consistent neutral colors', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      // Text should use neutral charcoal
      const title = screen.getByText('Comece sua simulação')
      expect(title).toHaveClass('text-neutral-charcoal')
      
      // Subtitle should use neutral charcoal with opacity
      const subtitle = screen.getByText('Preencha seus dados para continuar')
      expect(subtitle).toHaveClass('text-neutral-charcoal/70')
    })

    it('should maintain consistent glassmorphism effects', () => {
      const { container } = render(<InitialForm onSubmit={() => {}} />)
      
      // Glass card should have backdrop blur
      const glassCard = container.querySelector('.glass-card')
      expect(glassCard).toBeInTheDocument()
      
      // Inputs should have glassmorphism
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('bg-white/80', 'backdrop-blur-sm')
      })
    })

    it('should use consistent shadow and elevation', () => {
      const { container } = render(
        <CarDetailsConfirmation
          carDetails={{
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
            fipeCode: '038001-1',
            estimatedValue: 85000
          }}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      // Glass card should have consistent shadow
      const glassCard = container.querySelector('.glass-card')
      expect(glassCard).toBeInTheDocument()
      // Shadow classes would be checked here if defined in the component
    })
  })

  describe('Animation and Transition Consistency', () => {
    it('should have consistent transition durations', () => {
      const { container } = render(<LoadingState onComplete={() => {}} />)
      
      // Progress bar should have consistent transition
      const progressBar = container.querySelector('.transition-all.duration-300')
      expect(progressBar).toBeInTheDocument()
    })

    it('should maintain consistent hover states', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-primary-sage/90')
    })

    it('should have consistent focus transitions', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('transition-colors')
      })
    })
  })

  describe('Spacing and Layout Consistency', () => {
    it('should maintain consistent spacing scale', () => {
      const { container } = render(<InitialForm onSubmit={() => {}} />)
      
      // Form should use consistent spacing
      const form = container.querySelector('form')
      expect(form).toHaveClass('space-y-4', 'sm:space-y-6')
      
      // Input containers should use consistent spacing
      const inputContainers = container.querySelectorAll('.space-y-2')
      expect(inputContainers.length).toBeGreaterThan(0)
    })

    it('should use consistent padding and margins', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('px-4', 'py-3')
      })
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('py-3', 'px-6')
    })

    it('should maintain consistent border radius', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('rounded-lg')
      })
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-lg')
    })
  })

  describe('Component State Visual Consistency', () => {
    it('should maintain consistent disabled states', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })

    it('should have consistent loading states', () => {
      render(<InitialForm onSubmit={() => {}} isLoading={true} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toBeDisabled()
        expect(input).toHaveClass('disabled:opacity-50')
      })
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Validando dados...')
    })

    it('should maintain consistent success states', () => {
      const { container } = render(
        <CarDetailsConfirmation
          carDetails={{
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
            fipeCode: '038001-1',
            estimatedValue: 85000
          }}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      // Success icon should have consistent styling
      const successIcon = container.querySelector('.bg-green-100')
      expect(successIcon).toBeInTheDocument()
      expect(successIcon).toHaveClass('rounded-full')
    })
  })
})