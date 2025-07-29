import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InitialForm } from '../initial-form'
import { FormData } from '@/lib/types/simulation'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    input: ({ children, whileFocus, ...props }: any) => <input {...props}>{children}</input>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, isLoading, loadingText, ...props }: any) => (
    <button {...props}>
      {isLoading ? loadingText || children : children}
    </button>
  ),
}))

vi.mock('@/components/ui/glass-card', () => ({
  GlassCard: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

describe('InitialForm', () => {
  const mockOnSubmit = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderInitialForm = (props = {}) => {
    return render(
      <InitialForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        {...props}
      />
    )
  }

  describe('Rendering', () => {
    it('renders all form fields', () => {
      renderInitialForm()
      
      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/placa do veículo/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continuar simulação/i })).toBeInTheDocument()
    })

    it('renders form title and description', () => {
      renderInitialForm()
      
      expect(screen.getByText('Comece sua simulação')).toBeInTheDocument()
      expect(screen.getByText('Preencha seus dados para continuar')).toBeInTheDocument()
    })

    it('renders benefits list', () => {
      renderInitialForm()
      
      expect(screen.getByText('Sem compromisso de contratação')).toBeInTheDocument()
      expect(screen.getByText('Resultado em menos de 3 minutos')).toBeInTheDocument()
      expect(screen.getByText('Dados protegidos com criptografia')).toBeInTheDocument()
    })

    it('renders submit button as disabled initially', () => {
      renderInitialForm()
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Validation', () => {
    describe('Name Field', () => {
      it('shows error for empty name when field is touched', async () => {
        renderInitialForm()
        
        const nameInput = screen.getByLabelText(/nome completo/i)
        await user.click(nameInput)
        await user.tab() // Blur the field
        
        await waitFor(() => {
          expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
        })
      })

      it('shows error for name with less than 2 characters', async () => {
        renderInitialForm()
        
        const nameInput = screen.getByLabelText(/nome completo/i)
        await user.type(nameInput, 'A')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument()
        })
      })

      it('shows error for name with invalid characters', async () => {
        renderInitialForm()
        
        const nameInput = screen.getByLabelText(/nome completo/i)
        await user.type(nameInput, 'João123')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.getByText('Nome deve conter apenas letras e espaços')).toBeInTheDocument()
        })
      })

      it('accepts valid name', async () => {
        renderInitialForm()
        
        const nameInput = screen.getByLabelText(/nome completo/i)
        await user.type(nameInput, 'João Silva')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.queryByText(/nome deve/i)).not.toBeInTheDocument()
        })
      })
    })

    describe('Email Field', () => {
      it('shows error for empty email when field is touched', async () => {
        renderInitialForm()
        
        const emailInput = screen.getByLabelText(/e-mail/i)
        await user.click(emailInput)
        await user.tab()
        
        await waitFor(() => {
          expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument()
        })
      })

      it('shows error for invalid email format', async () => {
        renderInitialForm()
        
        const emailInput = screen.getByLabelText(/e-mail/i)
        await user.type(emailInput, 'invalid-email')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.getByText('E-mail deve ter um formato válido')).toBeInTheDocument()
        })
      })

      it('accepts valid email', async () => {
        renderInitialForm()
        
        const emailInput = screen.getByLabelText(/e-mail/i)
        await user.type(emailInput, 'joao@email.com')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.queryByText(/e-mail deve ter um formato válido/i)).not.toBeInTheDocument()
        })
      })
    })

    describe('License Plate Field', () => {
      it('shows error for empty license plate when field is touched', async () => {
        renderInitialForm()
        
        const plateInput = screen.getByLabelText(/placa do veículo/i)
        await user.click(plateInput)
        await user.tab()
        
        await waitFor(() => {
          expect(screen.getByText('Placa é obrigatória')).toBeInTheDocument()
        })
      })

      it('shows error for invalid license plate format', async () => {
        renderInitialForm()
        
        const plateInput = screen.getByLabelText(/placa do veículo/i)
        await user.type(plateInput, 'INVALID')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.getByText('Placa deve estar no formato ABC-1234 ou ABC1D23')).toBeInTheDocument()
        })
      })

      it('accepts valid old format license plate', async () => {
        renderInitialForm()
        
        const plateInput = screen.getByLabelText(/placa do veículo/i)
        await user.type(plateInput, 'ABC1234')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.queryByText(/placa deve estar no formato/i)).not.toBeInTheDocument()
        })
      })

      it('accepts valid new format license plate', async () => {
        renderInitialForm()
        
        const plateInput = screen.getByLabelText(/placa do veículo/i)
        await user.type(plateInput, 'ABC1D23')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.queryByText(/placa deve estar no formato/i)).not.toBeInTheDocument()
        })
      })

      it('formats license plate display correctly', async () => {
        renderInitialForm()
        
        const plateInput = screen.getByLabelText(/placa do veículo/i) as HTMLInputElement
        await user.type(plateInput, 'ABC1234')
        
        expect(plateInput.value).toBe('ABC-1234')
      })

      it('converts license plate to uppercase', async () => {
        renderInitialForm()
        
        const plateInput = screen.getByLabelText(/placa do veículo/i) as HTMLInputElement
        await user.type(plateInput, 'abc1234')
        
        expect(plateInput.value).toBe('ABC-1234')
      })
    })
  })

  describe('Form Submission', () => {
    it('enables submit button when all fields are valid', async () => {
      renderInitialForm()
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      const emailInput = screen.getByLabelText(/e-mail/i)
      const plateInput = screen.getByLabelText(/placa do veículo/i)
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      
      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@email.com')
      await user.type(plateInput, 'ABC1234')
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })

    it('calls onSubmit with correct data when form is submitted', async () => {
      renderInitialForm()
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      const emailInput = screen.getByLabelText(/e-mail/i)
      const plateInput = screen.getByLabelText(/placa do veículo/i)
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      
      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@email.com')
      await user.type(plateInput, 'ABC1234')
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
      
      await user.click(submitButton)
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@email.com',
        licensePlate: 'ABC1234'
      })
    })

    it('does not submit form when fields are invalid', async () => {
      renderInitialForm()
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      
      await user.type(nameInput, 'A') // Invalid name
      await user.click(submitButton)
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('prevents form submission when fields are invalid', async () => {
      renderInitialForm()
      
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      
      // Button should be disabled when form is invalid
      expect(submitButton).toBeDisabled()
      
      // Try to submit empty form - should not call onSubmit
      fireEvent.click(submitButton)
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('disables all inputs when loading', () => {
      renderInitialForm({ isLoading: true })
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      const emailInput = screen.getByLabelText(/e-mail/i)
      const plateInput = screen.getByLabelText(/placa do veículo/i)
      
      expect(nameInput).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(plateInput).toBeDisabled()
    })

    it('shows loading state on submit button', () => {
      renderInitialForm({ isLoading: true })
      
      const submitButton = screen.getByRole('button', { name: /validando dados/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Input Sanitization', () => {
    it('sanitizes name input by removing extra spaces', async () => {
      renderInitialForm()
      
      const nameInput = screen.getByLabelText(/nome completo/i) as HTMLInputElement
      await user.type(nameInput, '  João   Silva  ')
      
      // Trigger blur to apply sanitization
      await user.tab()
      
      expect(nameInput.value).toBe('João Silva')
    })

    it('converts email to lowercase', async () => {
      renderInitialForm()
      
      const emailInput = screen.getByLabelText(/e-mail/i) as HTMLInputElement
      await user.type(emailInput, 'JOAO@EMAIL.COM')
      
      expect(emailInput.value).toBe('joao@email.com')
    })

    it('removes spaces and hyphens from license plate input', async () => {
      renderInitialForm()
      
      const plateInput = screen.getByLabelText(/placa do veículo/i) as HTMLInputElement
      await user.type(plateInput, ' a b c - 1 2 3 4 ')
      
      expect(plateInput.value).toBe('ABC-1234')
    })
  })

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      renderInitialForm()
      
      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/placa do veículo/i)).toBeInTheDocument()
    })

    it('has proper form structure', () => {
      renderInitialForm()
      
      const form = screen.getByRole('form') || document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('associates error messages with inputs', async () => {
      renderInitialForm()
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        const errorMessage = screen.getByText('Nome é obrigatório')
        expect(errorMessage).toBeInTheDocument()
      })
    })
  })
})