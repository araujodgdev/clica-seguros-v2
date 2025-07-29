/**
 * End-to-end tests for the complete user journey through the simulation feature
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useRouter } from 'next/navigation'
import { SimulationForm } from '../simulation-form'
import { getCarDetailsByPlate } from '@/lib/services/mock-data'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock the mock-data service
vi.mock('@/lib/services/mock-data', () => ({
  getCarDetailsByPlate: vi.fn()
}))

// Mock Framer Motion to avoid animation issues in tests
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

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, isLoading, loadingText, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  )
}))

vi.mock('@/components/ui/glass-card', () => ({
  GlassCard: ({ children, ...props }: any) => <div {...props}>{children}</div>
}))

describe('End-to-End User Journey Tests', () => {
  const mockPush = vi.fn()
  const mockRouter = {
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn()
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(useRouter).mockReturnValue(mockRouter)
    mockPush.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('Happy Path - Complete User Journey', () => {
    it('should complete the entire simulation flow successfully', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      // Mock successful car details fetch
      vi.mocked(getCarDetailsByPlate).mockResolvedValue({
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      })

      render(<SimulationForm />)

      // Step 1: Initial Form
      expect(screen.getByText('Comece sua simulação')).toBeInTheDocument()
      expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
      expect(screen.getByLabelText('Placa do veículo')).toBeInTheDocument()

      // Fill out the form
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')

      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@email.com')
      await user.type(plateInput, 'ABC1234')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      await user.click(submitButton)

      // Step 2: Car Details Confirmation
      await waitFor(() => {
        expect(screen.getByText('Veículo encontrado!')).toBeInTheDocument()
      })

      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument()
      expect(screen.getByText('2020')).toBeInTheDocument()
      expect(screen.getByText('038001-1')).toBeInTheDocument()
      expect(screen.getByText('R$ 85.000')).toBeInTheDocument()

      // Confirm car details
      const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
      await user.click(confirmButton)

      // Step 3: Loading State
      await waitFor(() => {
        expect(screen.getByText(/analisando seu perfil/i)).toBeInTheDocument()
      })

      // Fast forward through loading
      vi.advanceTimersByTime(4500) // Default loading duration + buffer

      // Should navigate to results page
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('/cotacao?')
        )
      }, { timeout: 1000 })

      // Verify URL parameters
      const callArgs = mockPush.mock.calls[0][0]
      expect(callArgs).toMatch(/name=Jo%C3%A3o(\+|%20)Silva/)
      expect(callArgs).toContain('email=joao%40email.com')
      expect(callArgs).toContain('licensePlate=ABC1234')
      expect(callArgs).toContain('carMake=Toyota')
      expect(callArgs).toContain('carModel=Corolla')
    })

    it('should handle new format (Mercosul) license plates', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      vi.mocked(getCarDetailsByPlate).mockResolvedValue({
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        fipeCode: '026001-5',
        estimatedValue: 95000
      })

      render(<SimulationForm />)

      // Fill form with Mercosul plate
      await user.type(screen.getByLabelText('Nome completo'), 'Maria Santos')
      await user.type(screen.getByLabelText('E-mail'), 'maria@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'ABC1D23')

      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Honda Civic')).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
      await user.click(confirmButton)

      vi.advanceTimersByTime(4500)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled()
      })

      const callArgs = mockPush.mock.calls[0][0]
      expect(callArgs).toContain('licensePlate=ABC1D23')
    })
  })

  describe('Error Handling Scenarios', () => {
    it('should handle car details fetch failure and allow retry', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      // First call fails, second succeeds
      vi.mocked(getCarDetailsByPlate)
        .mockRejectedValueOnce(new Error('Placa não encontrada'))
        .mockResolvedValue({
          make: 'Volkswagen',
          model: 'Gol',
          year: 2019,
          fipeCode: '059001-3',
          estimatedValue: 45000
        })

      render(<SimulationForm />)

      // Fill and submit form
      await user.type(screen.getByLabelText('Nome completo'), 'Pedro Costa')
      await user.type(screen.getByLabelText('E-mail'), 'pedro@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'XYZ9999')

      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      await user.click(submitButton)

      // Should show error
      await waitFor(() => {
        expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument()
        expect(screen.getByText('Placa não encontrada')).toBeInTheDocument()
      })

      // Retry should work
      const retryButton = screen.getByRole('button', { name: /tentar novamente/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText('Volkswagen Gol')).toBeInTheDocument()
      })
    })

    it('should handle navigation failure with retry mechanism', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      vi.mocked(getCarDetailsByPlate).mockResolvedValue({
        make: 'Ford',
        model: 'Ka',
        year: 2018,
        fipeCode: '021001-7',
        estimatedValue: 38000
      })

      // Mock navigation to fail initially
      let navigationAttempts = 0
      mockPush.mockImplementation(() => {
        navigationAttempts++
        if (navigationAttempts <= 2) {
          throw new Error('Navigation failed')
        }
        return Promise.resolve()
      })

      render(<SimulationForm />)

      // Complete the flow
      await user.type(screen.getByLabelText('Nome completo'), 'Ana Lima')
      await user.type(screen.getByLabelText('E-mail'), 'ana@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'DEF4567')

      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Ford Ka')).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
      await user.click(confirmButton)

      // Fast forward through loading and retries
      vi.advanceTimersByTime(8000)

      // Should eventually succeed after retries
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(3)
      })
    })
  })

  describe('Form Validation Journey', () => {
    it('should guide user through form validation errors', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      render(<SimulationForm />)

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      expect(submitButton).toBeDisabled()

      // Fill name only
      await user.type(screen.getByLabelText('Nome completo'), 'João')
      expect(submitButton).toBeDisabled()

      // Add invalid email
      await user.type(screen.getByLabelText('E-mail'), 'invalid-email')
      await user.tab() // Trigger validation
      
      await waitFor(() => {
        expect(screen.getByText('E-mail deve ter um formato válido')).toBeInTheDocument()
      })
      expect(submitButton).toBeDisabled()

      // Fix email
      await user.clear(screen.getByLabelText('E-mail'))
      await user.type(screen.getByLabelText('E-mail'), 'joao@email.com')

      // Add invalid plate
      await user.type(screen.getByLabelText('Placa do veículo'), 'INVALID')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('Placa deve estar no formato ABC-1234 ou ABC1D23')).toBeInTheDocument()
      })
      expect(submitButton).toBeDisabled()

      // Fix plate
      await user.clear(screen.getByLabelText('Placa do veículo'))
      await user.type(screen.getByLabelText('Placa do veículo'), 'ABC1234')

      // Now form should be valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })
  })

  describe('User Experience Flow', () => {
    it('should maintain proper focus management throughout the flow', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      vi.mocked(getCarDetailsByPlate).mockResolvedValue({
        make: 'Chevrolet',
        model: 'Onix',
        year: 2021,
        fipeCode: '010001-2',
        estimatedValue: 55000
      })

      render(<SimulationForm />)

      // Initial focus should be on name input
      expect(screen.getByLabelText('Nome completo')).toHaveFocus()

      // Tab through form
      await user.tab()
      expect(screen.getByLabelText('E-mail')).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText('Placa do veículo')).toHaveFocus()

      // Fill form and submit
      await user.type(screen.getByLabelText('Nome completo'), 'Carlos Silva')
      await user.type(screen.getByLabelText('E-mail'), 'carlos@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'GHI7890')

      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      await user.click(submitButton)

      // Focus should move to confirm button in car details
      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
        expect(confirmButton).toHaveFocus()
      })
    })

    it('should handle keyboard navigation properly', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      vi.mocked(getCarDetailsByPlate).mockResolvedValue({
        make: 'Nissan',
        model: 'Versa',
        year: 2021,
        fipeCode: '044001-3',
        estimatedValue: 68000
      })

      render(<SimulationForm />)

      // Use Enter to navigate through form
      const nameInput = screen.getByLabelText('Nome completo')
      await user.type(nameInput, 'Lucia Santos')
      await user.keyboard('{Enter}')

      const emailInput = screen.getByLabelText('E-mail')
      expect(emailInput).toHaveFocus()
      await user.type(emailInput, 'lucia@email.com')
      await user.keyboard('{Enter}')

      const plateInput = screen.getByLabelText('Placa do veículo')
      expect(plateInput).toHaveFocus()
      await user.type(plateInput, 'JKL1234')

      // Submit with Enter
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText('Nissan Versa')).toBeInTheDocument()
      })

      // Use Enter to confirm
      const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
      confirmButton.focus()
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/analisando seu perfil/i)).toBeInTheDocument()
      })
    })
  })

  describe('Data Persistence and State Management', () => {
    it('should maintain form data throughout the flow', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      vi.mocked(getCarDetailsByPlate).mockResolvedValue({
        make: 'Hyundai',
        model: 'HB20',
        year: 2020,
        fipeCode: '153001-9',
        estimatedValue: 48000
      })

      render(<SimulationForm />)

      const formData = {
        name: 'Roberto Silva',
        email: 'roberto@email.com',
        licensePlate: 'MNO5678'
      }

      // Fill form
      await user.type(screen.getByLabelText('Nome completo'), formData.name)
      await user.type(screen.getByLabelText('E-mail'), formData.email)
      await user.type(screen.getByLabelText('Placa do veículo'), formData.licensePlate)

      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      await user.click(submitButton)

      // Go to car details and back to edit
      await waitFor(() => {
        expect(screen.getByText('Hyundai HB20')).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', { name: /editar informações/i })
      await user.click(editButton)

      // Form data should be preserved
      expect(screen.getByDisplayValue(formData.name)).toBeInTheDocument()
      expect(screen.getByDisplayValue(formData.email)).toBeInTheDocument()
      expect(screen.getByDisplayValue('MNO-5678')).toBeInTheDocument() // Formatted display
    })
  })

  describe('Performance and Loading States', () => {
    it('should show appropriate loading states during async operations', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      // Mock delayed response
      vi.mocked(getCarDetailsByPlate).mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            make: 'Fiat',
            model: 'Uno',
            year: 2019,
            fipeCode: '147001-4',
            estimatedValue: 35000
          }), 1000)
        )
      )

      render(<SimulationForm />)

      await user.type(screen.getByLabelText('Nome completo'), 'Sandra Costa')
      await user.type(screen.getByLabelText('E-mail'), 'sandra@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'PQR9876')

      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      await user.click(submitButton)

      // Should show loading state
      expect(screen.getByText('Validando dados...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()

      // Advance time to resolve promise
      vi.advanceTimersByTime(1000)

      await waitFor(() => {
        expect(screen.getByText('Fiat Uno')).toBeInTheDocument()
      })
    })
  })
})