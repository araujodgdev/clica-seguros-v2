import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { LoadingState } from '../loading-state'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock the GlassCard component
vi.mock('@/components/ui/glass-card', () => ({
  GlassCard: ({ children, ...props }: any) => <div data-testid="glass-card" {...props}>{children}</div>
}))

describe('LoadingState', () => {
  let mockOnComplete: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnComplete = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders initial loading state correctly', () => {
    render(<LoadingState onComplete={mockOnComplete} />)
    
    // Check if the component renders
    expect(screen.getByTestId('glass-card')).toBeInTheDocument()
    
    // Check initial progress
    expect(screen.getByText('0%')).toBeInTheDocument()
    
    // Check initial message
    expect(screen.getByText('Analisando seu perfil')).toBeInTheDocument()
    expect(screen.getByText('Buscando as melhores opções de seguro para você')).toBeInTheDocument()
  })

  it('shows progress bar animation', async () => {
    render(<LoadingState onComplete={mockOnComplete} duration={1000} />)
    
    // Initial progress should be 0%
    expect(screen.getByText('0%')).toBeInTheDocument()
    
    // Fast forward time to see progress
    act(() => {
      vi.advanceTimersByTime(500) // Half the duration
    })
    
    // Progress should be around 50% (allowing for some variance due to timing)
    const progressElements = screen.getAllByText(/\d+%/)
    const progressText = progressElements.find(el => 
      el.className.includes('text-sm font-semibold text-neutral-charcoal')
    )
    expect(progressText).toBeDefined()
    const progressValue = parseInt(progressText?.textContent || '0')
    expect(progressValue).toBeGreaterThan(40)
    expect(progressValue).toBeLessThan(60)
  })

  it('rotates through different loading messages', () => {
    render(<LoadingState onComplete={mockOnComplete} duration={4000} />)
    
    // Initial message
    expect(screen.getByText('Analisando seu perfil')).toBeInTheDocument()
    
    // Advance time to trigger first message change (1200ms)
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    
    expect(screen.getByText('Calculando cotações')).toBeInTheDocument()
    expect(screen.getByText('Comparando preços entre múltiplas seguradoras')).toBeInTheDocument()
    
    // Advance time to trigger second message change (1000ms more)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(screen.getByText('Encontrando descontos')).toBeInTheDocument()
    expect(screen.getByText('Aplicando ofertas especiais e promoções disponíveis')).toBeInTheDocument()
    
    // Advance time to trigger third message change (800ms more)
    act(() => {
      vi.advanceTimersByTime(800)
    })
    
    expect(screen.getByText('Verificando coberturas')).toBeInTheDocument()
    expect(screen.getByText('Garantindo a melhor proteção para seu veículo')).toBeInTheDocument()
  })

  it('shows completion state and calls onComplete', () => {
    render(<LoadingState onComplete={mockOnComplete} duration={1000} />)
    
    // Fast forward to completion
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Concluído!')).toBeInTheDocument()
    
    // Fast forward the additional 500ms delay before calling onComplete
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(mockOnComplete).toHaveBeenCalledTimes(1)
  })

  it('shows completion message when loading is complete', () => {
    render(<LoadingState onComplete={mockOnComplete} duration={1000} />)
    
    // Fast forward to completion
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(screen.getByText('Cotações encontradas!')).toBeInTheDocument()
    expect(screen.getByText('Redirecionando para seus resultados...')).toBeInTheDocument()
  })

  it('displays benefits/features during loading', () => {
    render(<LoadingState onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Até 40% de economia')).toBeInTheDocument()
    expect(screen.getByText('Cobertura completa')).toBeInTheDocument()
    expect(screen.getByText('Ativação em 24h')).toBeInTheDocument()
  })

  it('shows countdown timer', () => {
    render(<LoadingState onComplete={mockOnComplete} duration={4000} />)
    
    // Should show initial countdown
    expect(screen.getByText('4s')).toBeInTheDocument()
    
    // Advance time and check countdown updates
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(screen.getByText('3s')).toBeInTheDocument()
  })

  it('uses default duration when not specified', () => {
    render(<LoadingState onComplete={mockOnComplete} />)
    
    // Should show 4s countdown (default 4000ms duration)
    expect(screen.getByText('4s')).toBeInTheDocument()
    
    // Fast forward to completion with default duration
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('handles custom duration correctly', () => {
    const customDuration = 2000
    render(<LoadingState onComplete={mockOnComplete} duration={customDuration} />)
    
    // Should show 2s countdown
    expect(screen.getByText('2s')).toBeInTheDocument()
    
    // Fast forward to completion with custom duration
    act(() => {
      vi.advanceTimersByTime(customDuration)
    })
    
    expect(screen.getByText('100%')).toBeInTheDocument()
    
    // Complete the final delay
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(mockOnComplete).toHaveBeenCalledTimes(1)
  })

  it('cleans up timers on unmount', () => {
    const { unmount } = render(<LoadingState onComplete={mockOnComplete} />)
    
    // Spy on clearInterval and clearTimeout
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    
    unmount()
    
    // Should clean up timers
    expect(clearIntervalSpy).toHaveBeenCalled()
    expect(clearTimeoutSpy).toHaveBeenCalled()
    
    clearIntervalSpy.mockRestore()
    clearTimeoutSpy.mockRestore()
  })

  it('maintains progress accuracy throughout loading', () => {
    render(<LoadingState onComplete={mockOnComplete} duration={1000} />)
    
    const checkPoints = [250, 500, 750, 1000]
    
    for (const timePoint of checkPoints) {
      act(() => {
        vi.advanceTimersByTime(timePoint === 250 ? 250 : 250)
      })
      
      const progressElements = screen.getAllByText(/\d+%/)
      const progressText = progressElements.find(el => 
        el.className.includes('text-sm font-semibold text-neutral-charcoal')
      )
      expect(progressText).toBeDefined()
      const progressValue = parseInt(progressText?.textContent || '0')
      const expectedProgress = (timePoint / 1000) * 100
      
      // Allow for small variance due to timing precision
      expect(progressValue).toBeGreaterThanOrEqual(expectedProgress - 5)
      expect(progressValue).toBeLessThanOrEqual(expectedProgress + 5)
    }
  })

  it('shows correct message timing', () => {
    render(<LoadingState onComplete={mockOnComplete} duration={4000} />)
    
    // Message 1: 0-1200ms
    expect(screen.getByText('Analisando seu perfil')).toBeInTheDocument()
    
    // Advance to message 2: 1200-2200ms
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    
    expect(screen.getByText('Calculando cotações')).toBeInTheDocument()
    
    // Advance to message 3: 2200-3000ms
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    expect(screen.getByText('Encontrando descontos')).toBeInTheDocument()
    
    // Advance to message 4: 3000-4000ms
    act(() => {
      vi.advanceTimersByTime(800)
    })
    
    expect(screen.getByText('Verificando coberturas')).toBeInTheDocument()
  })
})