import { render, screen, fireEvent } from '@testing-library/react'
import MapPicker from '../MapPicker'

// Mock react-leaflet components
jest.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: () => <div data-testid="marker" />,
    useMapEvents: () => ({ flyTo: jest.fn(), getZoom: jest.fn() }),
  }
})

describe('MapPicker Component', () => {
  it('renders default position correctly', () => {
    const mockOnPositionChange = jest.fn()
    render(<MapPicker onPositionChange={mockOnPositionChange} />)

    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument()
  })

  it('renders initial position if provided', () => {
    const mockOnPositionChange = jest.fn()
    const initialPosition: [number, number] = [-8.0, 116.0]
    render(<MapPicker initialPosition={initialPosition} onPositionChange={mockOnPositionChange} />)

    expect(screen.getByTestId('marker')).toBeInTheDocument()
  })
})
