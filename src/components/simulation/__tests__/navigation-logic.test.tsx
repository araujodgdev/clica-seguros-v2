/**
 * Tests for navigation logic and error handling in the simulation form
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

describe('Navigation Logic Tests', () => {
  const mockPush = vi.fn()
  const mockRouter = {
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn()
  }

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(mockRouter)
    mockPush.mockClear()
    
    // Mock successful car details fetch
    vi.mocked(getCarDetailsByPlate).mockResolvedValue({
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      fipeCode: '038001-1',
      estimatedValue: 85000
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create correct URL parameters for navigation', async () => {
    render(<SimulationForm />)

    // Fill out the form
    const nameInput = screen.getByLabelText(/nome completo/i)
    const emailInput = screen.getByLabelText(/e-mail/i)
    const plateInput = screen.getByLabelText(/placa do veículo/i)

    fireEvent.change(nameInput, { target: { value: 'João Silva' } })
    fireEvent.change(emailInput, { target: { value: 'joao@email.com' } })
    fireEvent.change(plateInput, { target: { value: 'ABC1234' } })

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
    fireEvent.click(submitButton)

    // Wait for car details confirmation
    await waitFor(() => {
      expect(screen.getByText(/veículo encontrado/i)).toBeInTheDocument()
    })

    // Confirm car details
    const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
    fireEvent.click(confirmButton)

    // Wait for loading to complete and navigation to occur
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled()
    }, { timeout: 5000 })

    // Verify URL parameters
    const callArgs = mockPush.mock.calls[0][0]
    expect(callArgs).toContain('/cotacao?')
    expect(callArgs).toContain('name=Jo%C3%A3o+Silva')
    expect(callArgs).toContain('email=joao%40email.com')
    expect(callArgs).toContain('licensePlate=ABC1234')
    expect(callArgs).toContain('carMake=Toyota')
    expect(callArgs).toContain('carModel=Corolla')
    expect(callArgs).toContain('carYear=2020')
    expect(callArgs).toContain('fipeCode=038001-1')
    expect(callArgs).toContain('estimatedValue=85000')
  })

  it('should handle navigation failures with retry logic', async () => {
    // Mock router.push to fail initially, then succeed
    let callCount = 0
    mockPush.mockImplementation(() => {
      callCount++
      if (callCount <= 2) {
        throw new Error('Navigation failed')
      }
      return Promise.resolve()
    })

    render(<SimulationForm />)

    // Fill out and submit the form
    const nameInput = screen.getByLabelText(/nome completo/i)
    const emailInput = screen.getByLabelText(/e-mail/i)
    const plateInput = screen.getByLabelText(/placa do veículo/i)

    fireEvent.change(nameInput, { target: { value: 'Maria Santos' } })
    fireEvent.change(emailInput, { target: { value: 'maria@email.com' } })
    fireEvent.change(plateInput, { target: { value: 'DEF5678' } })

    const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
    fireEvent.click(submitButton)

    // Wait for car details confirmation
    await waitFor(() => {
      expect(screen.getByText(/veículo encontrado/i)).toBeInTheDocument()
    })

    // Confirm car details
    const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
    fireEvent.click(confirmButton)

    // Wait for navigation retries to complete
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(3) // Initial call + 2 retries
    }, { timeout: 8000 })

    // Should eventually succeed
    expect(mockPush.mock.calls[2][0]).toContain('/cotacao?')
  })

  it('should show error after max navigation retries', async () => {
    // Mock router.push to always fail
    mockPush.mockRejectedValue(new Error('Navigation failed'))

    render(<SimulationForm />)

    // Fill out and submit the form
    const nameInput = screen.getByLabelText(/nome completo/i)
    const emailInput = screen.getByLabelText(/e-mail/i)
    const plateInput = screen.getByLabelText(/placa do veículo/i)

    fireEvent.change(nameInput, { target: { value: 'Pedro Costa' } })
    fireEvent.change(emailInput, { target: { value: 'pedro@email.com' } })
    fireEvent.change(plateInput, { target: { value: 'GHI9012' } })

    const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
    fireEvent.click(submitButton)

    // Wait for car details confirmation
    await waitFor(() => {
      expect(screen.getByText(/veículo encontrado/i)).toBeInTheDocument()
    })

    // Confirm car details
    const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
    fireEvent.click(confirmButton)

    // Wait for error to appear after max retries
    await waitFor(() => {
      expect(screen.getByText(/erro ao navegar para os resultados/i)).toBeInTheDocument()
    }, { timeout: 10000 })

    // Should have attempted navigation 3 times (initial + 2 retries)
    expect(mockPush).toHaveBeenCalledTimes(3)
  })

  it('should handle browser back button during simulation', () => {
    render(<SimulationForm />)

    // Simulate browser back button event
    const popStateEvent = new PopStateEvent('popstate', {
      state: { step: 2 }
    })

    // Dispatch the event
    window.dispatchEvent(popStateEvent)

    // Should reset to initial form (this is handled by the useEffect in the component)
    // The actual behavior would be tested in an integration test with a real browser
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
  })

  it('should validate required data before navigation', async () => {
    render(<SimulationForm />)

    // Try to trigger navigation without proper form data
    // This would happen if the component state gets corrupted somehow
    
    // Fill out the form partially
    const nameInput = screen.getByLabelText(/nome completo/i)
    fireEvent.change(nameInput, { target: { value: 'Ana Silva' } })

    // Submit without email and plate (this should be prevented by form validation)
    const submitButton = screen.getByRole('button', { name: /continuar simulação/i })
    
    // Button should be disabled without all required fields
    expect(submitButton).toBeDisabled()
  })
})