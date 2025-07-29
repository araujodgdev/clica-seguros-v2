/**
 * Comprehensive integration tests for component interactions in the simulation form
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest'
import { useRouter } from 'next/navigation'
import { SimulationForm } from '../simulation-form'
import { getCarDetailsByPlate, getInsuranceOffers } from '@/lib/services/mock-data'

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

const mockPush = vi.fn()
const mockGetCarDetailsByPlate = getCarDetailsByPlate as any

describe('SimulationForm Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue({
      push: mockPush
    })
  })

  describe('Basic Flow', () => {
    it('should render initial form step', () => {
      render(<SimulationForm />)
      
      expect(screen.getByText('Comece sua simulação')).toBeInTheDocument()
      expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
      expect(screen.getByLabelText('Placa do veículo')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continuar simulação/i })).toBeInTheDocument()
    })

    it('should show step indicators', () => {
      render(<SimulationForm />)
      
      // Should show 3 step indicators
      const stepIndicators = screen.getAllByRole('generic').filter(el => 
        el.className.includes('w-2 h-2 rounded-full')
      )
      expect(stepIndicators).toHaveLength(3)
    })

    it('should disable submit button initially', () => {
      render(<SimulationForm />)
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Submission', () => {
    it('should enable submit button with valid data', async () => {
      const user = userEvent.setup()
      render(<SimulationForm />)

      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })

      // Fill with valid data
      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@email.com')
      await user.type(plateInput, 'ABC1234')

      // Button should be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })

    it('should proceed to car details confirmation on successful submission', async () => {
      const user = userEvent.setup()
      
      const mockCarDetails = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      }
      mockGetCarDetailsByPlate.mockResolvedValue(mockCarDetails)

      render(<SimulationForm />)

      // Fill and submit form
      await user.type(screen.getByLabelText('Nome completo'), 'João Silva')
      await user.type(screen.getByLabelText('E-mail'), 'joao@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'ABC1234')
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      
      await user.click(submitButton)

      // Should show car details confirmation
      await waitFor(() => {
        expect(screen.getByText('Veículo encontrado!')).toBeInTheDocument()
        expect(screen.getByText('Toyota Corolla')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error message on car details fetch failure', async () => {
      const user = userEvent.setup()
      
      mockGetCarDetailsByPlate.mockRejectedValue(new Error('Placa não encontrada'))

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
    })

    it('should allow retry after error', async () => {
      const user = userEvent.setup()
      
      // First call fails
      mockGetCarDetailsByPlate.mockRejectedValueOnce(new Error('Erro de conexão'))
      
      // Second call succeeds
      const mockCarDetails = {
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        fipeCode: '026001-5',
        estimatedValue: 95000
      }
      mockGetCarDetailsByPlate.mockResolvedValue(mockCarDetails)

      render(<SimulationForm />)

      // Fill and submit form
      await user.type(screen.getByLabelText('Nome completo'), 'Ana Lima')
      await user.type(screen.getByLabelText('E-mail'), 'ana@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'JKL3456')
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      
      await user.click(submitButton)

      // Should show error first
      await waitFor(() => {
        expect(screen.getByText('Erro de conexão')).toBeInTheDocument()
      })

      // Click retry
      const retryButton = screen.getByRole('button', { name: /tentar novamente/i })
      await user.click(retryButton)

      // Should show car details after retry
      await waitFor(() => {
        expect(screen.getByText('Honda Civic')).toBeInTheDocument()
      })
    })
  })

  describe('Car Details Confirmation', () => {
    it('should show car details and allow confirmation', async () => {
      const user = userEvent.setup()
      
      const mockCarDetails = {
        make: 'Chevrolet',
        model: 'Onix',
        year: 2021,
        fipeCode: '010001-2',
        estimatedValue: 55000
      }
      mockGetCarDetailsByPlate.mockResolvedValue(mockCarDetails)

      render(<SimulationForm />)

      // Fill and submit initial form
      await user.type(screen.getByLabelText('Nome completo'), 'Maria Santos')
      await user.type(screen.getByLabelText('E-mail'), 'maria@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'GHI9012')
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      
      await user.click(submitButton)

      // Should show car details
      await waitFor(() => {
        expect(screen.getByText('Chevrolet Onix')).toBeInTheDocument()
        expect(screen.getByText('2021')).toBeInTheDocument()
        expect(screen.getByText('010001-2')).toBeInTheDocument()
        expect(screen.getByText('R$ 55.000')).toBeInTheDocument()
      })

      // Should have confirm and edit buttons
      expect(screen.getByRole('button', { name: /confirmar e continuar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /editar informações/i })).toBeInTheDocument()
    })

    it('should proceed to loading state on confirmation', async () => {
      const user = userEvent.setup()
      
      const mockCarDetails = {
        make: 'Ford',
        model: 'Ka',
        year: 2018,
        fipeCode: '021001-7',
        estimatedValue: 38000
      }
      mockGetCarDetailsByPlate.mockResolvedValue(mockCarDetails)

      render(<SimulationForm />)

      // Fill and submit initial form
      await user.type(screen.getByLabelText('Nome completo'), 'Carlos Oliveira')
      await user.type(screen.getByLabelText('E-mail'), 'carlos@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'PQR1234')
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      
      await user.click(submitButton)

      // Wait for car details
      await waitFor(() => {
        expect(screen.getByText('Ford Ka')).toBeInTheDocument()
      })

      // Confirm car details
      const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
      await user.click(confirmButton)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/analisando seu perfil/i)).toBeInTheDocument()
      })
    })
  })

  describe('Callback Integration', () => {
    it('should call onComplete callback with correct data', async () => {
      const user = userEvent.setup()
      const mockOnComplete = vi.fn()
      
      const mockCarDetails = {
        make: 'Nissan',
        model: 'Versa',
        year: 2021,
        fipeCode: '044001-3',
        estimatedValue: 68000
      }
      mockGetCarDetailsByPlate.mockResolvedValue(mockCarDetails)

      render(<SimulationForm onComplete={mockOnComplete} />)

      // Complete the flow
      await user.type(screen.getByLabelText('Nome completo'), 'Lucia Ferreira')
      await user.type(screen.getByLabelText('E-mail'), 'lucia@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'STU5678')
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nissan Versa')).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
      await user.click(confirmButton)

      // Wait for loading to complete and callback to be called
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          name: 'Lucia Ferreira',
          email: 'lucia@email.com',
          licensePlate: 'STU5678',
          carDetails: mockCarDetails
        })
      }, { timeout: 5000 })
    })

    it('should navigate to quote results page', async () => {
      const user = userEvent.setup()
      
      const mockCarDetails = {
        make: 'Hyundai',
        model: 'HB20',
        year: 2020,
        fipeCode: '153001-9',
        estimatedValue: 48000
      }
      mockGetCarDetailsByPlate.mockResolvedValue(mockCarDetails)

      render(<SimulationForm />)

      // Complete the flow
      await user.type(screen.getByLabelText('Nome completo'), 'Roberto Silva')
      await user.type(screen.getByLabelText('E-mail'), 'roberto@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'MNO7890')
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      await waitFor(() => expect(submitButton).not.toBeDisabled())
      
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Hyundai HB20')).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
      await user.click(confirmButton)

      // Wait for navigation
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('/cotacao?')
        )
      }, { timeout: 5000 })

      // Verify URL parameters (both %20 and + are valid encodings for spaces)
      const callArgs = mockPush.mock.calls[0][0]
      expect(callArgs).toMatch(/name=Roberto(\+|%20)Silva/)
      expect(callArgs).toContain('email=roberto%40email.com')
      expect(callArgs).toContain('licensePlate=MNO7890')
      expect(callArgs).toContain('carMake=Hyundai')
      expect(callArgs).toContain('carModel=HB20')
    })
  })
})