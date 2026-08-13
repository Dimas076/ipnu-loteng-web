/**
 * @jest-environment node
 */
import { POST } from '../route'
import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    agenda: {
      create: jest.fn(),
    },
  }
  return { PrismaClient: jest.fn(() => mPrismaClient) }
})

const prisma = new PrismaClient()

describe('Agenda API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('POST creates a new agenda correctly with latitude and longitude', async () => {
    const mockRequest = new Request('http://localhost:3000/api/agenda', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Rapat Tahunan',
        description: 'Rapat pengurus wilayah',
        category: 'Rapat',
        date: '2025-01-01',
        location: 'Aula PCNU',
        latitude: -8.70,
        longitude: 116.27
      })
    }) as any;

    const mockCreatedAgenda = {
      id: 1,
      title: 'Rapat Tahunan',
      description: 'Rapat pengurus wilayah',
      category: 'Rapat',
      date: new Date('2025-01-01'),
      location: 'Aula PCNU',
      latitude: -8.70,
      longitude: 116.27,
      status: 'upcoming'
    }

    ;(prisma.agenda.create as jest.Mock).mockResolvedValue(mockCreatedAgenda)

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.title).toBe('Rapat Tahunan')
    expect(prisma.agenda.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Rapat Tahunan',
        latitude: -8.70,
        longitude: 116.27
      })
    })
  })
})
