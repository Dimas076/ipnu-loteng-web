import { render, screen } from '@testing-library/react'
import MapViewer from '../MapViewer'

// Mock react-leaflet components since they require window/DOM
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
}))

describe('MapViewer Component', () => {
  it('renders correctly with given position and location name', () => {
    const testPosition: [number, number] = [-8.7077, 116.2769]
    const testLocationName = 'Aula PCNU Lombok Tengah'

    render(<MapViewer position={testPosition} locationName={testLocationName} />)

    // Check if the mock components are rendered
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument()
    expect(screen.getByTestId('marker')).toBeInTheDocument()
    expect(screen.getByTestId('popup')).toBeInTheDocument()

    // Check if the location name is displayed inside the popup
    expect(screen.getByText(testLocationName)).toBeInTheDocument()
  })
})
