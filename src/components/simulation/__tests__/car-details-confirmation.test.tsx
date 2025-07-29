import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CarDetailsConfirmation } from '../car-details-confirmation'
import { CarDetails } from '@/lib/types/simulation'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

const mockCarDetails: CarDetails = {
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  fipeCode: '038001-1',
  estimatedValue: 85000
}

describe('CarDetailsConfirmation', () => {
  const mockOnConfirm = vi.fn()
  const mockOnEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders car details correctly', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    // Check if car make and model are displayed
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument()
    
    // Check if year is displayed
    expect(screen.getByText('2020')).toBeInTheDocument()
    
    // Check if FIPE code is displayed
    expect(screen.getByText('038001-1')).toBeInTheDocument()
    
    // Check if estimated value is displayed (formatted as currency)
    expect(screen.getByText('R$ 85.000')).toBeInTheDocument()
  })

  it('displays the correct title and description', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    expect(screen.getByText('Veículo encontrado!')).toBeInTheDocument()
    expect(screen.getByText('Confirme se os dados estão corretos')).toBeInTheDocument()
  })

  it('shows FIPE data source information', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    expect(screen.getByText('Dados obtidos da base FIPE')).toBeInTheDocument()
  })

  it('displays informational note about FIPE value', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    expect(screen.getByText(/O valor FIPE é usado como referência/)).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
    fireEvent.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onEdit when edit button is clicked', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    const editButton = screen.getByRole('button', { name: /editar informações/i })
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when loading', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
        isLoading={true}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /gerando cotação/i })
    const editButton = screen.getByRole('button', { name: /editar informações/i })

    expect(confirmButton).toBeDisabled()
    expect(editButton).toBeDisabled()
  })

  it('shows loading text when isLoading is true', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
        isLoading={true}
      />
    )

    expect(screen.getByText('Gerando cotação...')).toBeInTheDocument()
  })

  it('displays all benefit items', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    expect(screen.getByText('Cotação personalizada para seu veículo')).toBeInTheDocument()
    expect(screen.getByText('Comparação entre múltiplas seguradoras')).toBeInTheDocument()
    expect(screen.getByText('Processo 100% digital e seguro')).toBeInTheDocument()
  })

  it('formats currency correctly for different values', () => {
    const expensiveCarDetails: CarDetails = {
      ...mockCarDetails,
      estimatedValue: 150000
    }

    render(
      <CarDetailsConfirmation
        carDetails={expensiveCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    expect(screen.getByText('R$ 150.000')).toBeInTheDocument()
  })

  it('handles car details with different make and model', () => {
    const differentCarDetails: CarDetails = {
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      fipeCode: '026001-5',
      estimatedValue: 95000
    }

    render(
      <CarDetailsConfirmation
        carDetails={differentCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    expect(screen.getByText('Honda Civic')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getByText('026001-5')).toBeInTheDocument()
    expect(screen.getByText('R$ 95.000')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirmar e continuar/i })
    const editButton = screen.getByRole('button', { name: /editar informações/i })

    expect(confirmButton).toBeInTheDocument()
    expect(editButton).toBeInTheDocument()
  })

  it('prevents interaction when buttons are disabled', () => {
    render(
      <CarDetailsConfirmation
        carDetails={mockCarDetails}
        onConfirm={mockOnConfirm}
        onEdit={mockOnEdit}
        isLoading={true}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /gerando cotação/i })
    const editButton = screen.getByRole('button', { name: /editar informações/i })

    fireEvent.click(confirmButton)
    fireEvent.click(editButton)

    expect(mockOnConfirm).not.toHaveBeenCalled()
    expect(mockOnEdit).not.toHaveBeenCalled()
  })
})