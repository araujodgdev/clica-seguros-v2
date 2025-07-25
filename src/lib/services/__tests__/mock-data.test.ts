import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getCarDetailsByPlate,
  getInsuranceOffers,
  getOfferDetails,
  validateLicensePlate,
  generateQuoteSimulation,
  getRandomCarPlate,
  setErrorSimulationRates,
  MOCK_CARS,
  MOCK_OFFERS
} from '../mock-data'

// Mock setTimeout for testing delays
vi.mock('setTimeout', () => ({
  default: (fn: () => void, delay: number) => {
    // For tests, execute immediately
    fn()
    return 1
  }
}))

// Increase test timeout for async operations
vi.setConfig({ testTimeout: 10000 })

describe('Mock Data Services', () => {
  beforeEach(() => {
    // Reset error simulation rates for consistent testing
    setErrorSimulationRates({
      networkErrorRate: 0,
      invalidPlateRate: 0,
      timeoutRate: 0
    })
  })

  describe('validateLicensePlate', () => {
    it('should validate old format license plates', () => {
      expect(validateLicensePlate('ABC1234')).toBe(true)
      expect(validateLicensePlate('abc1234')).toBe(true)
      expect(validateLicensePlate('ABC-1234')).toBe(true)
      expect(validateLicensePlate('abc-1234')).toBe(true)
    })

    it('should validate new format (Mercosul) license plates', () => {
      expect(validateLicensePlate('ABC1D23')).toBe(true)
      expect(validateLicensePlate('abc1d23')).toBe(true)
      expect(validateLicensePlate('ABC-1D23')).toBe(true)
      expect(validateLicensePlate('abc-1d23')).toBe(true)
    })

    it('should reject invalid license plate formats', () => {
      expect(validateLicensePlate('ABC123')).toBe(false)
      expect(validateLicensePlate('AB1234')).toBe(false)
      expect(validateLicensePlate('ABCD1234')).toBe(false)
      expect(validateLicensePlate('ABC12345')).toBe(false)
      expect(validateLicensePlate('123ABCD')).toBe(false)
      expect(validateLicensePlate('')).toBe(false)
    })
  })

  describe('getCarDetailsByPlate', () => {
    it('should return car details for known license plates', async () => {
      const carDetails = await getCarDetailsByPlate('ABC1234')
      
      expect(carDetails).toEqual({
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      })
    })

    it('should handle license plates with hyphens', async () => {
      const carDetails = await getCarDetailsByPlate('ABC-1234')
      
      expect(carDetails).toEqual({
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      })
    })

    it('should handle lowercase license plates', async () => {
      const carDetails = await getCarDetailsByPlate('abc1234')
      
      expect(carDetails).toEqual({
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      })
    })

    it('should return fallback car for unknown license plates', async () => {
      const carDetails = await getCarDetailsByPlate('XYZ9999')
      
      expect(carDetails).toEqual({
        make: 'Informação não encontrada',
        model: 'Veículo genérico',
        year: 2020,
        fipeCode: '000000-0',
        estimatedValue: 50000
      })
    })

    it('should handle new format (Mercosul) license plates', async () => {
      const carDetails = await getCarDetailsByPlate('ABC1D23')
      
      expect(carDetails).toEqual({
        make: 'Toyota',
        model: 'Corolla Cross',
        year: 2022,
        fipeCode: '038015-7',
        estimatedValue: 115000
      })
    })
  })

  describe('getInsuranceOffers', () => {
    it('should return adjusted insurance offers based on car value', async () => {
      const carDetails = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      }

      const offers = await getInsuranceOffers(carDetails)
      
      expect(offers.length).toBeGreaterThanOrEqual(3)
      expect(offers.length).toBeLessThanOrEqual(4)
      
      // Check that premiums are adjusted based on car value
      offers.forEach(offer => {
        expect(offer).toHaveProperty('id')
        expect(offer).toHaveProperty('insurerName')
        expect(offer).toHaveProperty('monthlyPremium')
        expect(offer).toHaveProperty('coverageHighlights')
        expect(offer).toHaveProperty('savings')
        expect(offer).toHaveProperty('rating')
        expect(offer).toHaveProperty('deductible')
        expect(offer).toHaveProperty('coverageDetails')
        
        expect(typeof offer.monthlyPremium).toBe('number')
        expect(offer.monthlyPremium).toBeGreaterThan(0)
        expect(Array.isArray(offer.coverageHighlights)).toBe(true)
      })
    })

    it('should adjust premiums based on car value', async () => {
      const expensiveCar = {
        make: 'BMW',
        model: 'X5',
        year: 2022,
        fipeCode: '999999-9',
        estimatedValue: 200000
      }

      const cheapCar = {
        make: 'Volkswagen',
        model: 'Gol',
        year: 2015,
        fipeCode: '111111-1',
        estimatedValue: 25000
      }

      const expensiveOffers = await getInsuranceOffers(expensiveCar)
      const cheapOffers = await getInsuranceOffers(cheapCar)

      // Expensive car should have higher premiums
      const avgExpensivePremium = expensiveOffers.reduce((sum, offer) => sum + offer.monthlyPremium, 0) / expensiveOffers.length
      const avgCheapPremium = cheapOffers.reduce((sum, offer) => sum + offer.monthlyPremium, 0) / cheapOffers.length

      expect(avgExpensivePremium).toBeGreaterThan(avgCheapPremium)
    })
  })

  describe('getOfferDetails', () => {
    it('should return offer details for valid offer ID', async () => {
      const offerDetails = await getOfferDetails('offer-1')
      
      expect(offerDetails).toEqual({
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
      })
    })

    it('should return null for invalid offer ID', async () => {
      const offerDetails = await getOfferDetails('invalid-offer')
      expect(offerDetails).toBeNull()
    })
  })

  describe('generateQuoteSimulation', () => {
    it('should generate complete quote simulation', async () => {
      const formData = {
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC1234'
      }

      const result = await generateQuoteSimulation(formData)
      
      expect(result).toHaveProperty('carDetails')
      expect(result).toHaveProperty('offers')
      
      expect(result.carDetails).toEqual({
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        fipeCode: '038001-1',
        estimatedValue: 85000
      })
      
      expect(Array.isArray(result.offers)).toBe(true)
      expect(result.offers.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('getRandomCarPlate', () => {
    it('should return a valid license plate from mock data', () => {
      const plate = getRandomCarPlate()
      expect(typeof plate).toBe('string')
      expect(MOCK_CARS).toHaveProperty(plate)
    })
  })

  describe('error simulation', () => {
    it('should simulate network errors when configured', async () => {
      setErrorSimulationRates({ networkErrorRate: 1 }) // 100% error rate
      
      await expect(getCarDetailsByPlate('ABC1234')).rejects.toThrow('Erro de conexão')
    })

    it('should simulate invalid plate errors when configured', async () => {
      setErrorSimulationRates({ invalidPlateRate: 1 }) // 100% error rate
      
      await expect(getCarDetailsByPlate('ABC1234')).rejects.toThrow('Placa não encontrada')
    })

    it('should simulate timeout errors when configured', async () => {
      setErrorSimulationRates({ timeoutRate: 1 }) // 100% error rate
      
      await expect(getCarDetailsByPlate('ABC1234')).rejects.toThrow('Tempo limite excedido')
    })
  })

  describe('mock data integrity', () => {
    it('should have valid mock car data', () => {
      Object.entries(MOCK_CARS).forEach(([plate, car]) => {
        expect(validateLicensePlate(plate)).toBe(true)
        expect(car).toHaveProperty('make')
        expect(car).toHaveProperty('model')
        expect(car).toHaveProperty('year')
        expect(car).toHaveProperty('fipeCode')
        expect(car).toHaveProperty('estimatedValue')
        expect(typeof car.estimatedValue).toBe('number')
        expect(car.estimatedValue).toBeGreaterThan(0)
      })
    })

    it('should have valid mock offer data', () => {
      MOCK_OFFERS.forEach(offer => {
        expect(offer).toHaveProperty('id')
        expect(offer).toHaveProperty('insurerName')
        expect(offer).toHaveProperty('monthlyPremium')
        expect(offer).toHaveProperty('coverageHighlights')
        expect(offer).toHaveProperty('savings')
        expect(offer).toHaveProperty('rating')
        expect(offer).toHaveProperty('deductible')
        expect(offer).toHaveProperty('coverageDetails')
        
        expect(typeof offer.monthlyPremium).toBe('number')
        expect(offer.monthlyPremium).toBeGreaterThan(0)
        expect(Array.isArray(offer.coverageHighlights)).toBe(true)
        expect(offer.rating).toBeGreaterThanOrEqual(0)
        expect(offer.rating).toBeLessThanOrEqual(5)
      })
    })
  })
})