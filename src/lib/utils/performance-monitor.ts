/**
 * Performance monitoring utilities for the simulation feature
 */

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  bundleSize?: number
}

interface PerformanceEntry {
  name: string
  startTime: number
  duration: number
  entryType: string
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return
    }

    try {
      // Monitor navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming)
          }
        })
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navigationObserver)

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming)
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)

      // Monitor paint timing
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            this.recordPaintMetrics(entry)
          }
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(paintObserver)

    } catch (error) {
      console.warn('Performance monitoring not supported:', error)
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics: PerformanceMetrics = {
      loadTime: entry.loadEventEnd - entry.startTime,
      renderTime: entry.domContentLoadedEventEnd - entry.startTime,
      interactionTime: entry.domInteractive - entry.startTime
    }

    this.metrics.set('navigation', metrics)
    this.logMetrics('Navigation', metrics)
  }

  private recordResourceMetrics(entry: PerformanceResourceTiming) {
    // Focus on JavaScript bundles and critical resources
    if (entry.name.includes('.js') || entry.name.includes('simulation')) {
      const metrics: PerformanceMetrics = {
        loadTime: entry.responseEnd - entry.startTime,
        renderTime: entry.duration,
        interactionTime: entry.responseStart - entry.requestStart,
        bundleSize: entry.transferSize
      }

      this.metrics.set(`resource-${entry.name}`, metrics)
      
      // Log slow resources
      if (metrics.loadTime > 1000) {
        console.warn(`Slow resource detected: ${entry.name} (${metrics.loadTime}ms)`)
      }
    }
  }

  private recordPaintMetrics(entry: PerformanceEntry) {
    if (entry.name === 'first-contentful-paint') {
      const metrics: PerformanceMetrics = {
        loadTime: entry.startTime,
        renderTime: entry.duration,
        interactionTime: 0
      }

      this.metrics.set('first-contentful-paint', metrics)
      this.logMetrics('First Contentful Paint', metrics)
    }
  }

  // Public methods for manual performance tracking
  public startTiming(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`)
    }
  }

  public endTiming(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`)
      window.performance.measure(name, `${name}-start`, `${name}-end`)
      
      const measure = window.performance.getEntriesByName(name, 'measure')[0]
      if (measure) {
        const metrics: PerformanceMetrics = {
          loadTime: measure.duration,
          renderTime: measure.duration,
          interactionTime: 0
        }
        
        this.metrics.set(name, metrics)
        this.logMetrics(name, metrics)
      }
    }
  }

  // Track component render performance
  public trackComponentRender(componentName: string, renderTime: number) {
    const metrics: PerformanceMetrics = {
      loadTime: 0,
      renderTime,
      interactionTime: 0
    }

    this.metrics.set(`component-${componentName}`, metrics)
    
    // Warn about slow renders
    if (renderTime > 16) { // 60fps threshold
      console.warn(`Slow component render: ${componentName} (${renderTime}ms)`)
    }
  }

  // Track user interactions
  public trackInteraction(interactionName: string, duration: number) {
    const metrics: PerformanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: duration
    }

    this.metrics.set(`interaction-${interactionName}`, metrics)
    
    // Warn about slow interactions
    if (duration > 100) {
      console.warn(`Slow interaction: ${interactionName} (${duration}ms)`)
    }
  }

  // Get performance report
  public getPerformanceReport(): Record<string, PerformanceMetrics> {
    const report: Record<string, PerformanceMetrics> = {}
    this.metrics.forEach((metrics, name) => {
      report[name] = metrics
    })
    return report
  }

  // Get Core Web Vitals
  public getCoreWebVitals(): Promise<{
    lcp?: number // Largest Contentful Paint
    fid?: number // First Input Delay
    cls?: number // Cumulative Layout Shift
  }> {
    return new Promise((resolve) => {
      const vitals: any = {}

      if (typeof window === 'undefined' || !window.PerformanceObserver) {
        resolve(vitals)
        return
      }

      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.lcp = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            vitals.fid = entry.processingStart - entry.startTime
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // CLS Observer
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          vitals.cls = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // Resolve after a reasonable time
        setTimeout(() => {
          resolve(vitals)
        }, 5000)

      } catch (error) {
        console.warn('Core Web Vitals monitoring not supported:', error)
        resolve(vitals)
      }
    })
  }

  private logMetrics(name: string, metrics: PerformanceMetrics) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance [${name}]:`, {
        loadTime: `${metrics.loadTime.toFixed(2)}ms`,
        renderTime: `${metrics.renderTime.toFixed(2)}ms`,
        interactionTime: `${metrics.interactionTime.toFixed(2)}ms`,
        bundleSize: metrics.bundleSize ? `${(metrics.bundleSize / 1024).toFixed(2)}KB` : 'N/A'
      })
    }
  }

  // Cleanup observers
  public cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect()
    })
    this.observers = []
    this.metrics.clear()
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for easy use
export const startPerformanceTimer = (name: string) => {
  performanceMonitor.startTiming(name)
}

export const endPerformanceTimer = (name: string) => {
  performanceMonitor.endTiming(name)
}

export const trackComponentPerformance = (componentName: string, renderTime: number) => {
  performanceMonitor.trackComponentRender(componentName, renderTime)
}

export const trackUserInteraction = (interactionName: string, duration: number) => {
  performanceMonitor.trackInteraction(interactionName, duration)
}

export const getPerformanceReport = () => {
  return performanceMonitor.getPerformanceReport()
}

export const getCoreWebVitals = () => {
  return performanceMonitor.getCoreWebVitals()
}

// React hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const startTime = performance.now()

  return {
    trackRender: () => {
      const renderTime = performance.now() - startTime
      trackComponentPerformance(componentName, renderTime)
    },
    trackInteraction: (interactionName: string, interactionStartTime: number) => {
      const duration = performance.now() - interactionStartTime
      trackUserInteraction(`${componentName}-${interactionName}`, duration)
    }
  }
}