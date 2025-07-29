import React from 'react'
import { SimulationForm } from './src/components/simulation/simulation-form'

// Simple test component to verify the SimulationForm works
export function TestSimulationFlow() {
  const handleComplete = (data: any) => {
    console.log('Simulation completed with data:', data)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Simulation Form Test
        </h1>
        <SimulationForm onComplete={handleComplete} />
      </div>
    </div>
  )
}