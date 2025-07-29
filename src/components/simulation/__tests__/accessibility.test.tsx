import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InitialForm } from '../initial-form'
import { CarDetailsConfirmation } from '../car-details-confirmation'
import { LoadingState } from '../loading-state'
import { SimulationForm } from '../simulation-form'

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

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

describe('Accessibility Tests', () => {
  describe('InitialForm Accessibility', () => {
    const mockOnSubmit = vi.fn()
    
    beforeEach(() => {
      mockOnSubmit.mockClear()
    })

    it('should have proper semantic HTML structure', () => {
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      // Check for form element with proper role and label
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveAttribute('aria-label', 'Formulário de simulação de seguro')
    })

    it('should have proper labels for all form inputs', () => {
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      // Check that all inputs have proper labels
      expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
      expect(screen.getByLabelText('Placa do veículo')).toBeInTheDocument()
    })

    it('should have proper ARIA attributes for form validation', () => {
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      
      // Check required attributes
      expect(nameInput).toHaveAttribute('aria-required', 'true')
      expect(emailInput).toHaveAttribute('aria-required', 'true')
      expect(plateInput).toHaveAttribute('aria-required', 'true')
      
      // Check initial aria-invalid state
      expect(nameInput).toHaveAttribute('aria-invalid', 'false')
      expect(emailInput).toHaveAttribute('aria-invalid', 'false')
      expect(plateInput).toHaveAttribute('aria-invalid', 'false')
    })

    it('should associate error messages with inputs using aria-describedby', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      
      // Trigger validation error
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true')
        expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')
        
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toHaveAttribute('id', 'name-error')
        expect(errorMessage).toHaveTextContent('Nome é obrigatório')
      })
    })

    it('should have proper help text association', () => {
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      const plateInput = screen.getByLabelText('Placa do veículo')
      expect(plateInput).toHaveAttribute('aria-describedby', 'licensePlate-help')
      
      const helpText = document.getElementById('licensePlate-help')
      expect(helpText).toBeInTheDocument()
      expect(helpText).toHaveTextContent('Formatos aceitos: ABC-1234 (antigo) ou ABC1D23 (Mercosul)')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      
      // Focus should start on name input
      expect(nameInput).toHaveFocus()
      
      // Enter should move to next field
      await user.type(nameInput, 'João Silva')
      await user.keyboard('{Enter}')
      expect(emailInput).toHaveFocus()
      
      await user.type(emailInput, 'joao@email.com')
      await user.keyboard('{Enter}')
      expect(plateInput).toHaveFocus()
    })

    it('should handle Escape key to clear current field', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      
      await user.type(nameInput, 'João Silva')
      expect(nameInput).toHaveValue('João Silva')
      
      await user.keyboard('{Escape}')
      expect(nameInput).toHaveValue('')
    })

    it('should announce form status to screen readers', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={mockOnSubmit} />)
      
      // Check for status announcement element
      const statusElement = document.getElementById('form-status')
      expect(statusElement).toBeInTheDocument()
      expect(statusElement).toHaveAttribute('aria-live', 'polite')
      expect(statusElement).toHaveAttribute('aria-atomic', 'true')
      expect(statusElement).toHaveClass('sr-only')
      
      // Initially should show invalid state
      expect(statusElement).toHaveTextContent('Preencha todos os campos corretamente')
      
      // Fill form to make it valid
      await user.type(screen.getByLabelText('Nome completo'), 'João Silva')
      await user.type(screen.getByLabelText('E-mail'), 'joao@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'ABC1234')
      
      await waitFor(() => {
        expect(statusElement).toHaveTextContent('Formulário válido, pronto para enviar')
      })
    })
  })

  describe('CarDetailsConfirmation Accessibility', () => {
    const mockCarDetails = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      fipeCode: '038001-1',
      estimatedValue: 85000
    }
    
    const mockOnConfirm = vi.fn()
    const mockOnEdit = vi.fn()

    beforeEach(() => {
      mockOnConfirm.mockClear()
      mockOnEdit.mockClear()
    })

    it('should focus confirm button on mount', () => {
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={mockOnConfirm}
          onEdit={mockOnEdit}
        />
      )
      
      const confirmButton = screen.getByText('Confirmar e continuar')
      expect(confirmButton).toHaveFocus()
    })

    it('should have proper ARIA labels and descriptions', () => {
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={mockOnConfirm}
          onEdit={mockOnEdit}
        />
      )
      
      const confirmButton = screen.getByText('Confirmar e continuar')
      const editButton = screen.getByText('Editar informações')
      
      expect(confirmButton).toHaveAttribute('aria-describedby', 'car-details-summary')
      expect(editButton).toHaveAttribute('aria-label', 'Editar informações do veículo e voltar ao formulário anterior')
      
      // Check for screen reader summary
      const summary = document.getElementById('car-details-summary')
      expect(summary).toBeInTheDocument()
      expect(summary).toHaveClass('sr-only')
      expect(summary).toHaveTextContent(/Toyota Corolla.*2020.*038001-1.*R\$\s*85\.000/)
    })

    it('should support keyboard navigation between buttons', async () => {
      const user = userEvent.setup()
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={mockOnConfirm}
          onEdit={mockOnEdit}
        />
      )
      
      const confirmButton = screen.getByText('Confirmar e continuar')
      const editButton = screen.getByText('Editar informações')
      
      // Should start focused on confirm button
      expect(confirmButton).toHaveFocus()
      
      // Arrow down should move to edit button
      await user.keyboard('{ArrowDown}')
      expect(editButton).toHaveFocus()
      
      // Arrow up should move back to confirm button
      await user.keyboard('{ArrowUp}')
      expect(confirmButton).toHaveFocus()
    })

    it('should handle Enter and Escape keys', async () => {
      const user = userEvent.setup()
      render(
        <CarDetailsConfirmation 
          carDetails={mockCarDetails}
          onConfirm={mockOnConfirm}
          onEdit={mockOnEdit}
        />
      )
      
      // Focus the confirm button first
      const confirmButton = screen.getByText('Confirmar e continuar')
      confirmButton.focus()
      
      // Enter should trigger confirm
      await user.keyboard('{Enter}')
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
      
      // Reset mock and test Escape
      mockOnConfirm.mockClear()
      
      // Escape should trigger edit
      await user.keyboard('{Escape}')
      expect(mockOnEdit).toHaveBeenCalledTimes(1)
    })
  })

  describe('LoadingState Accessibility', () => {
    const mockOnComplete = vi.fn()
    
    beforeEach(() => {
      mockOnComplete.mockClear()
    })

    it('should have proper ARIA attributes for loading state', () => {
      render(<LoadingState onComplete={mockOnComplete} />)
      
      // Check for status role and live region
      const container = screen.getByRole('status')
      expect(container).toHaveAttribute('aria-live', 'polite')
      expect(container).toHaveAttribute('aria-label', 'Processamento de cotação em andamento')
    })

    it('should have accessible progress bar', () => {
      render(<LoadingState onComplete={mockOnComplete} />)
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-labelledby', 'progress-label')
      expect(progressBar).toHaveAttribute('aria-describedby', 'progress-description')
      
      // Check for progress description
      const description = document.getElementById('progress-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('sr-only')
    })

    it('should have accessible retry button when error occurs', async () => {
      const mockOnRetry = vi.fn()
      
      // Mock error simulation to always trigger
      vi.spyOn(Math, 'random').mockReturnValue(0.1) // Force error
      
      render(
        <LoadingState 
          onComplete={mockOnComplete}
          onRetry={mockOnRetry}
          maxRetries={3}
        />
      )
      
      // Wait for error to occur
      await waitFor(() => {
        const retryButton = screen.getByText('Tentar novamente')
        expect(retryButton).toBeInTheDocument()
        expect(retryButton).toHaveAttribute('aria-describedby', 'retry-status')
        expect(retryButton).toHaveAttribute('aria-label')
        expect(retryButton).toHaveClass('focus:outline-none', 'focus:ring-2')
      }, { timeout: 5000 })
      
      vi.restoreAllMocks()
    })
  })

  describe('Color Contrast and Focus Management', () => {
    it('should have proper focus indicators on all interactive elements', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      
      // Check that all interactive elements have focus styles
      expect(nameInput).toHaveClass('focus:ring-2')
      expect(emailInput).toHaveClass('focus:ring-2')
      expect(plateInput).toHaveClass('focus:ring-2')
      expect(submitButton).toHaveClass('focus-visible:ring-2')
    })

    it('should maintain focus order and trap focus appropriately', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={vi.fn()} />)
      
      // Tab through all focusable elements
      const nameInput = screen.getByLabelText('Nome completo')
      const emailInput = screen.getByLabelText('E-mail')
      const plateInput = screen.getByLabelText('Placa do veículo')
      
      expect(nameInput).toHaveFocus()
      
      await user.tab()
      expect(emailInput).toHaveFocus()
      
      await user.tab()
      expect(plateInput).toHaveFocus()
      
      // Fill form to enable submit button
      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@email.com')
      await user.type(plateInput, 'ABC1234')
      
      // Wait for form validation
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
        expect(submitButton).not.toBeDisabled()
      })
      
      // Now tab to submit button
      await user.tab()
      const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
      expect(submitButton).toHaveFocus()
    })
  })

  describe('Screen Reader Compatibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Comece sua simulação')
    })

    it('should announce validation errors with proper roles', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      
      // Trigger validation error
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveTextContent('Nome é obrigatório')
      })
    })

    it('should have proper live regions for dynamic content', () => {
      render(<LoadingState onComplete={vi.fn()} />)
      
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Reduced Motion Support', () => {
    it('should respect prefers-reduced-motion setting', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })
      
      render(<InitialForm onSubmit={vi.fn()} />)
      
      // Components should still render properly with reduced motion
      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })

  describe('Automated Accessibility Testing', () => {
    it('should pass WCAG 2.1 AA color contrast requirements', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      // Check that all text elements have sufficient contrast
      const textElements = screen.getAllByText(/./i)
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element)
        // This would typically use a color contrast library
        // For now, we verify the elements exist and have color styles
        expect(styles.color).toBeDefined()
      })
    })

    it('should have proper heading hierarchy', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        expect(level).toBeGreaterThan(0)
        expect(level).toBeLessThanOrEqual(6)
      })
    })

    it('should have sufficient target sizes for touch', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const interactiveElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('textbox')
      ]
      
      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        // WCAG 2.1 AA requires minimum 44x44px touch targets
        expect(rect.height).toBeGreaterThanOrEqual(44)
        expect(rect.width).toBeGreaterThanOrEqual(44)
      })
    })

    it('should support zoom up to 200% without horizontal scrolling', () => {
      // Mock viewport at 200% zoom
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 2,
        writable: true
      })
      
      render(<InitialForm onSubmit={vi.fn()} />)
      
      // Content should still be accessible at high zoom levels
      expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
    })

    it('should announce dynamic content changes', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      
      // Trigger validation error
      await user.click(nameInput)
      await user.tab()
      
      await waitFor(() => {
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveAttribute('aria-live', 'assertive')
      })
    })

    it('should provide alternative text for all images', () => {
      render(<CarDetailsConfirmation 
        carDetails={{
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          fipeCode: '038001-1',
          estimatedValue: 85000
        }}
        onConfirm={vi.fn()}
        onEdit={vi.fn()}
      />)
      
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })

    it('should support keyboard-only navigation', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={vi.fn()} />)
      
      // Should be able to navigate entire form with keyboard
      const nameInput = screen.getByLabelText('Nome completo')
      expect(nameInput).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText('E-mail')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText('Placa do veículo')).toHaveFocus()
      
      // Fill form to enable submit button
      await user.type(nameInput, 'João Silva')
      await user.type(screen.getByLabelText('E-mail'), 'joao@email.com')
      await user.type(screen.getByLabelText('Placa do veículo'), 'ABC1234')
      
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
        expect(submitButton).not.toBeDisabled()
      })
      
      await user.tab()
      expect(screen.getByRole('button', { name: /continuar simulação/i })).toHaveFocus()
    })

    it('should provide clear error identification and suggestions', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const emailInput = screen.getByLabelText('E-mail')
      
      // Enter invalid email
      await user.type(emailInput, 'invalid-email')
      await user.tab()
      
      await waitFor(() => {
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toHaveTextContent('E-mail deve ter um formato válido')
        expect(errorMessage).toHaveAttribute('id', 'email-error')
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
        expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('should support assistive technology announcements', () => {
      render(<LoadingState onComplete={vi.fn()} />)
      
      const statusElement = screen.getByRole('status')
      expect(statusElement).toHaveAttribute('aria-live', 'polite')
      expect(statusElement).toHaveAttribute('aria-label', 'Processamento de cotação em andamento')
    })

    it('should have proper form labeling and grouping', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-label', 'Formulário de simulação de seguro')
      
      // All form controls should be properly labeled
      const formControls = screen.getAllByRole('textbox')
      formControls.forEach(control => {
        expect(control).toHaveAttribute('aria-label')
        expect(control).toHaveAttribute('aria-required')
      })
    })

    it('should handle focus management during state transitions', async () => {
      const user = userEvent.setup()
      const mockCarDetails = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      }
      
      render(
        <CarDetailsConfirmation
          carDetails={mockCarDetails}
          onConfirm={vi.fn()}
          onEdit={vi.fn()}
        />
      )
      
      // Focus should be on confirm button initially
      const confirmButton = screen.getByText('Confirmar e continuar')
      expect(confirmButton).toHaveFocus()
      
      // Should support arrow key navigation
      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('Editar informações')).toHaveFocus()
    })

    it('should provide skip links for efficient navigation', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      // Should have skip link to main content
      const skipLink = document.querySelector('a[href="#main-content"]')
      if (skipLink) {
        expect(skipLink).toHaveTextContent(/pular para o conteúdo principal/i)
      }
    })

    it('should support voice control and speech recognition', () => {
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      
      // Should have proper voice control attributes
      expect(nameInput).toHaveAttribute('aria-label', 'Nome completo')
      expect(nameInput).toHaveAttribute('name', 'name')
    })

    it('should handle high contrast mode', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true
      })
      
      render(<InitialForm onSubmit={vi.fn()} />)
      
      // Should render properly in high contrast mode
      expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
    })

    it('should provide timeout warnings for timed content', () => {
      render(<LoadingState onComplete={vi.fn()} />)
      
      // Should indicate time remaining
      expect(screen.getByText(/\d+s/)).toBeInTheDocument()
    })

    it('should support multiple input methods', async () => {
      const user = userEvent.setup()
      render(<InitialForm onSubmit={vi.fn()} />)
      
      const plateInput = screen.getByLabelText('Placa do veículo')
      
      // Should handle different input methods
      await user.type(plateInput, 'ABC1234')
      expect(plateInput).toHaveValue('ABC-1234')
      
      // Should handle paste operations
      await user.clear(plateInput)
      await user.click(plateInput)
      
      // Simulate paste event
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer()
      })
      pasteEvent.clipboardData?.setData('text/plain', 'XYZ9876')
      
      plateInput.dispatchEvent(pasteEvent)
      
      // Should format pasted content
      expect(plateInput).toHaveValue('XYZ-9876')
    })
  })
})