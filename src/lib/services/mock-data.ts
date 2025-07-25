import { CarDetails, InsuranceOffer } from '../types/simulation'

// Mock car database with realistic Brazilian vehicles mapped to license plates
export const MOCK_CARS: Record<string, CarDetails> = {
  // Popular Brazilian cars with realistic FIPE codes and values
  'ABC1234': {
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    fipeCode: '038001-1',
    estimatedValue: 85000
  },
  'DEF5678': {
    make: 'Volkswagen',
    model: 'Gol',
    year: 2019,
    fipeCode: '005001-8',
    estimatedValue: 45000
  },
  'GHI9012': {
    make: 'Chevrolet',
    model: 'Onix',
    year: 2021,
    fipeCode: '010001-2',
    estimatedValue: 55000
  },
  'JKL3456': {
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    fipeCode: '026001-5',
    estimatedValue: 95000
  },
  'MNO7890': {
    make: 'Hyundai',
    model: 'HB20',
    year: 2020,
    fipeCode: '153001-9',
    estimatedValue: 48000
  },
  'PQR1234': {
    make: 'Ford',
    model: 'Ka',
    year: 2018,
    fipeCode: '021001-7',
    estimatedValue: 38000
  },
  'STU5678': {
    make: 'Nissan',
    model: 'Versa',
    year: 2021,
    fipeCode: '044001-3',
    estimatedValue: 68000
  },
  'VWX9012': {
    make: 'Renault',
    model: 'Sandero',
    year: 2019,
    fipeCode: '047001-6',
    estimatedValue: 42000
  },
  'YZA3456': {
    make: 'Fiat',
    model: 'Argo',
    year: 2020,
    fipeCode: '019001-4',
    estimatedValue: 52000
  },
  'BCD7890': {
    make: 'Jeep',
    model: 'Compass',
    year: 2021,
    fipeCode: '160001-1',
    estimatedValue: 125000
  },
  // New format license plates (Mercosul)
  'ABC1D23': {
    make: 'Toyota',
    model: 'Corolla Cross',
    year: 2022,
    fipeCode: '038015-7',
    estimatedValue: 115000
  },
  'DEF2E34': {
    make: 'Volkswagen',
    model: 'T-Cross',
    year: 2023,
    fipeCode: '005025-3',
    estimatedValue: 98000
  }
}

// Mock insurance offers with varied pricing and coverage options
export const MOCK_OFFERS: InsuranceOffer[] = [
  {
    id: 'offer-1',
    insurerName: 'Seguradora Premium',
    monthlyPremium: 180,
    coverageHighlights: ['Cobertura Total', 'Carro Reserva 30 dias', 'Assistência 24h'],
    savings: 40,
    rating: 4.8,
    deductible: 2500,
    coverageDetails: {
      collision: true,
      theft: true,
      fire: true,
      naturalDisasters: true,
      thirdPartyLiability: 100000,
      personalAccident: 50000
    }
  },
  {
    id: 'offer-2',
    insurerName: 'Proteção Confiável',
    monthlyPremium: 145,
    coverageHighlights: ['Cobertura Básica', 'Carro Reserva 15 dias', 'Guincho'],
    savings: 25,
    rating: 4.5,
    deductible: 3000,
    coverageDetails: {
      collision: true,
      theft: true,
      fire: true,
      naturalDisasters: false,
      thirdPartyLiability: 50000,
      personalAccident: 25000
    }
  },
  {
    id: 'offer-3',
    insurerName: 'Seguros Econômicos',
    monthlyPremium: 120,
    coverageHighlights: ['Cobertura Essencial', 'Assistência Básica', 'Guincho 24h'],
    savings: 15,
    rating: 4.2,
    deductible: 4000,
    coverageDetails: {
      collision: true,
      theft: true,
      fire: false,
      naturalDisasters: false,
      thirdPartyLiability: 30000,
      personalAccident: 15000
    }
  },
  {
    id: 'offer-4',
    insurerName: 'Elite Seguros',
    monthlyPremium: 220,
    coverageHighlights: ['Cobertura Completa', 'Carro Reserva Ilimitado', 'Concierge 24h'],
    savings: 60,
    rating: 4.9,
    deductible: 1500,
    coverageDetails: {
      collision: true,
      theft: true,
      fire: true,
      naturalDisasters: true,
      thirdPartyLiability: 200000,
      personalAccident: 100000
    }
  }
]

// Fallback car details for unknown license plates
const FALLBACK_CAR: CarDetails = {
  make: 'Informação não encontrada',
  model: 'Veículo genérico',
  year: 2020,
  fipeCode: '000000-0',
  estimatedValue: 50000
}

// Error simulation configuration
const ERROR_SIMULATION = {
  networkErrorRate: 0.05, // 5% chance of network error
  invalidPlateRate: 0.1,  // 10% chance of treating valid plate as invalid
  timeoutRate: 0.02       // 2% chance of timeout
}

// Utility function to simulate network delay
const simulateDelay = (min: number = 800, max: number = 2000): Promise<void> => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Utility function to simulate random errors
const shouldSimulateError = (rate: number): boolean => {
  return Math.random() < rate
}

// Service function to get car details by license plate
export const getCarDetailsByPlate = async (licensePlate: string): Promise<CarDetails> => {
  // Simulate network delay
  await simulateDelay(1000, 2500)
  
  // Simulate network error
  if (shouldSimulateError(ERROR_SIMULATION.networkErrorRate)) {
    throw new Error('Erro de conexão. Tente novamente.')
  }
  
  // Simulate timeout error
  if (shouldSimulateError(ERROR_SIMULATION.timeoutRate)) {
    throw new Error('Tempo limite excedido. Verifique sua conexão.')
  }
  
  // Normalize license plate format (remove hyphens and convert to uppercase)
  const normalizedPlate = licensePlate.replace('-', '').toUpperCase()
  
  // Simulate treating valid plate as invalid occasionally
  if (shouldSimulateError(ERROR_SIMULATION.invalidPlateRate)) {
    throw new Error('Placa não encontrada em nossa base de dados.')
  }
  
  // Return car details if found, otherwise return fallback
  const carDetails = MOCK_CARS[normalizedPlate]
  if (carDetails) {
    return { ...carDetails }
  }
  
  // For unknown plates, return fallback with a slight delay
  await simulateDelay(500, 1000)
  return { ...FALLBACK_CAR }
}

// Service function to get insurance offers based on car details
export const getInsuranceOffers = async (carDetails: CarDetails): Promise<InsuranceOffer[]> => {
  // Simulate network delay
  await simulateDelay(2000, 4000)
  
  // Simulate network error
  if (shouldSimulateError(ERROR_SIMULATION.networkErrorRate)) {
    throw new Error('Erro ao buscar cotações. Tente novamente.')
  }
  
  // Calculate adjusted premiums based on car value
  const baseValue = 50000 // Reference value for base premiums
  const adjustmentFactor = carDetails.estimatedValue / baseValue
  
  // Create adjusted offers based on car value
  const adjustedOffers = MOCK_OFFERS.map(offer => ({
    ...offer,
    monthlyPremium: Math.round(offer.monthlyPremium * adjustmentFactor),
    deductible: Math.round(offer.deductible * adjustmentFactor * 0.8) // Deductible scales less aggressively
  }))
  
  // Randomly shuffle offers to simulate different quote priorities
  const shuffledOffers = [...adjustedOffers].sort(() => Math.random() - 0.5)
  
  // Return 3-4 offers randomly
  const numberOfOffers = Math.floor(Math.random() * 2) + 3 // 3 or 4 offers
  return shuffledOffers.slice(0, numberOfOffers)
}

// Service function to get specific offer details
export const getOfferDetails = async (offerId: string): Promise<InsuranceOffer | null> => {
  // Simulate network delay
  await simulateDelay(500, 1200)
  
  // Simulate network error
  if (shouldSimulateError(ERROR_SIMULATION.networkErrorRate)) {
    throw new Error('Erro ao carregar detalhes da oferta.')
  }
  
  const offer = MOCK_OFFERS.find(o => o.id === offerId)
  return offer ? { ...offer } : null
}

// Service function to validate license plate format
export const validateLicensePlate = (plate: string): boolean => {
  // Remove spaces and hyphens, convert to uppercase
  const cleanPlate = plate.replace(/[\s-]/g, '').toUpperCase()
  
  // Brazilian license plate formats:
  // Old format: ABC1234 (3 letters + 4 numbers)
  // New format (Mercosul): ABC1D23 (3 letters + 1 number + 1 letter + 2 numbers)
  const oldFormat = /^[A-Z]{3}[0-9]{4}$/
  const newFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
  
  return oldFormat.test(cleanPlate) || newFormat.test(cleanPlate)
}

// Service function to simulate quote generation process
export const generateQuoteSimulation = async (
  formData: { name: string; email: string; licensePlate: string }
): Promise<{ carDetails: CarDetails; offers: InsuranceOffer[] }> => {
  try {
    // Step 1: Get car details
    const carDetails = await getCarDetailsByPlate(formData.licensePlate)
    
    // Step 2: Get insurance offers
    const offers = await getInsuranceOffers(carDetails)
    
    return { carDetails, offers }
  } catch (error) {
    // Re-throw with context
    throw new Error(`Erro na simulação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

// Utility function to get random car for testing
export const getRandomCarPlate = (): string => {
  const plates = Object.keys(MOCK_CARS)
  return plates[Math.floor(Math.random() * plates.length)]
}

// Utility function to reset error simulation rates (useful for testing)
export const setErrorSimulationRates = (rates: Partial<typeof ERROR_SIMULATION>) => {
  Object.assign(ERROR_SIMULATION, rates)
}