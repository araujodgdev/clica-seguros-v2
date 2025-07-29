import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { InitialForm } from '../initial-form'
import { CarDetailsConfirmation } from '../car-details-confirmation'
import { LoadingState } from '../loading-state'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('Mobile Responsiveness Tests', () => {
  describe('InitialForm Mobile Optimizations', () => {
    it('should have mobile-friendly container sizing', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const container = document.querySelector('.w-full')
      expect(container).toBeInTheDocument()
    })

    it('should have touch-friendly input heights', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      
      expect(nameInput).toHaveClass('min-h-[48px]')
      expect(emailInput).toHaveClass('min-h-[48px]')
      expect(plateInput).toHaveClass('min-h-[48px]')
    })

    it('should have responsive text sizing', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const title = screen.getByText('Comece sua simulação')
      expect(title).toHaveClass('text-xl', 'sm:text-2xl')
    })

    it('should have responsive spacing', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-4', 'sm:space-y-6')
    })

    it('should have proper ARIA labels for accessibility', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      
      expect(nameInput).toHaveAttribute('aria-label', 'Nome completo')
      expect(emailInput).toHaveAttribute('aria-label', 'E-mail')
      expect(plateInput).toHaveAttribute('aria-label', 'Placa do veículo')
    })
  })

  describe('CarDetailsConfirmation Mobile Optimizations', () => {
    const mockCarDetails = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      fipeCode: '038001-1',
      estimatedValue: 85000
    }

    it('should have mobile-friendly container sizing', () => {
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      const container = document.querySelector('.w-full')
      expect(container).toBeInTheDocument()
    })

    it('should have responsive grid layout', () => {
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      const grid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2')
      expect(grid).toBeInTheDocument()
    })

    it('should have touch-friendly buttons', () => {
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      const confirmButton = screen.getByText('Confirmar e continuar')
      const editButton = screen.getByText('Editar informações')
      
      expect(confirmButton).toHaveClass('min-h-[48px]')
      expect(editButton).toHaveClass('min-h-[48px]')
    })

    it('should have responsive icon sizing', () => {
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={() => {}}
          onEdit={() => {}}
        />
      )
      
      const iconContainer = document.querySelector('.w-12.h-12.sm\\:w-16.sm\\:h-16')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('LoadingState Mobile Optimizations', () => {
    it('should have mobile-friendly container sizing', () => {
      render(<LoadingState onComplete={() => {}} />)
      
      const container = document.querySelector('.w-full')
      expect(container).toBeInTheDocument()
    })

    it('should have responsive icon sizing', () => {
      render(<LoadingState onComplete={() => {}} />)
      
      const iconContainer = document.querySelector('.w-16.h-16.sm\\:w-20.sm\\:h-20')
      expect(iconContainer).toBeInTheDocument()
    })

    it('should have responsive spacing', () => {
      render(<LoadingState onComplete={() => {}} />)
      
      const iconContainer = document.querySelector('.mb-6.sm\\:mb-8')
      expect(iconContainer).toBeInTheDocument()
    })

    it('should have responsive text sizing', () => {
      render(<LoadingState onComplete={() => {}} />)
      
      // Check for responsive text classes in the loading messages
      const messageContainer = document.querySelector('.text-lg.sm\\:text-xl')
      expect(messageContainer).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation in InitialForm', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      
      expect(nameInput).toHaveAttribute('id', 'name')
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(plateInput).toHaveAttribute('id', 'licensePlate')
    })

    it('should have proper focus management in CarDetailsConfirmation', () => {
      render(
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
      
      const confirmButton = screen.getByText('Confirmar e continuar')
      expect(confirmButton).toHaveAttribute('id', 'confirm-button')
    })
  })

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes for form validation', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-label', 'Formulário de simulação de seguro')
    })

    it('should associate help text with inputs', () => {
      render(<InitialForm onSubmit={() => {}} />)
      
      const plateInput = screen.getByLabelText('Placa do veículo')
      expect(plateInput).toHaveAttribute('aria-describedby', 'licensePlate-help')
      
      const helpText = document.getElementById('licensePlate-help')
      expect(helpText).toBeInTheDocument()
      expect(helpText).toHaveTextContent('Formatos aceitos: ABC-1234 (antigo) ou ABC1D23 (Mercosul)')
    })
  })
})