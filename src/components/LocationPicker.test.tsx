import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocationPicker } from './LocationPicker';
import mapboxgl from 'mapbox-gl';

// Mock Mapbox GL JS
jest.mock('mapbox-gl', () => {
  const mockMapInstance = {
    addControl: jest.fn(),
    on: jest.fn((event, handler) => {
      // Directly call click handler for testing if it's a 'click' event
      if (event === 'click') {
        // Store it to be called later by tests
        (mockMapInstance as any)._clickCallback = handler;
      }
    }),
    remove: jest.fn(),
    setLngLat: jest.fn(),
    setCenter: jest.fn(),
    getLngLat: jest.fn().mockReturnValue({ lat: 0, lng: 0 }), // Default mock
  };

  const mockMarkerInstance = {
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    on: jest.fn((event, handler) => {
        if (event === 'dragend') {
            (mockMarkerInstance as any)._dragendCallback = handler;
        }
    }),
    getLngLat: jest.fn().mockReturnValue({ lat: 0, lng: 0 }), // Default mock
    remove: jest.fn(),
  };

  return {
    Map: jest.fn(() => mockMapInstance),
    Marker: jest.fn(() => mockMarkerInstance),
    NavigationControl: jest.fn(),
    accessToken: '', // Mock accessToken, can be set by tests if needed
  };
});

// Mock global fetch
global.fetch = jest.fn();

const mockMapboxgl = mapboxgl as jest.Mocked<typeof mapboxgl>;
const mockFetch = global.fetch as jest.Mock;


describe('LocationPicker', () => {
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnChange = jest.fn();
    // Reset mocks for map and marker instances before each test
    (mockMapboxgl.Map as jest.Mock).mockClear();
    (mockMapboxgl.Marker as jest.Mock).mockClear();
    const mapInstance = new mapboxgl.Map({container: document.createElement('div')});
    (mapInstance.addControl as jest.Mock).mockClear();
    (mapInstance.on as jest.Mock).mockClear();
    (mapInstance.remove as jest.Mock).mockClear();
    const markerInstance = new mapboxgl.Marker();
    (markerInstance.setLngLat as jest.Mock).mockClear();
    (markerInstance.addTo as jest.Mock).mockClear();
    (markerInstance.on as jest.Mock).mockClear();
    (markerInstance.remove as jest.Mock).mockClear();

    mockFetch.mockClear();
    mapboxgl.accessToken = 'test-token'; // Ensure token is set for tests
  });

  const initialValue = {
    address: 'Initial Address',
    coordinates: { lat: 10, lng: 20 },
  };

  test('renders input and "Pick Location on Map" button', () => {
    render(<LocationPicker value={undefined} onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Enter business location or pick on map')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pick Location on Map/i })).toBeInTheDocument();
  });

  test('toggles map display when "Pick Location on Map" button is clicked', () => {
    render(<LocationPicker value={undefined} onChange={mockOnChange} />);
    const pickButton = screen.getByRole('button', { name: /Pick Location on Map/i });
    fireEvent.click(pickButton);
    expect(screen.getByRole('button', { name: /Close Map/i })).toBeInTheDocument();
    expect(mockMapboxgl.Map).toHaveBeenCalledTimes(1); // Map should be initialized

    fireEvent.click(pickButton); // Click again to close
    expect(screen.queryByRole('button', { name: /Close Map/i })).not.toBeInTheDocument();
  });

  test('initializes map with initial coordinates if provided', () => {
    render(<LocationPicker value={initialValue} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Pick Location on Map/i }));

    expect(mockMapboxgl.Map).toHaveBeenCalledWith(expect.objectContaining({
      center: [initialValue.coordinates.lng, initialValue.coordinates.lat],
      zoom: 15
    }));
    expect(mockMapboxgl.Marker).toHaveBeenCalledTimes(1);
    const markerInstance = (mockMapboxgl.Marker as jest.Mock).mock.results[0].value;
    expect(markerInstance.setLngLat).toHaveBeenCalledWith([initialValue.coordinates.lng, initialValue.coordinates.lat]);
  });

  test('updates coordinates and calls reverseGeocode on map click', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ features: [{ place_name: 'Clicked Address' }] }),
    });

    render(<LocationPicker value={undefined} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Pick Location on Map/i }));

    const mapInstance = (mockMapboxgl.Map as jest.Mock).mock.results[0].value;
    const clickCallback = (mapInstance as any)._clickCallback;

    expect(clickCallback).toBeDefined();
    if (clickCallback) {
      fireEvent.click(document.body); // Simulate a generic click to trigger map click if needed by some setups
      clickCallback({ lngLat: { lng: 30, lat: 40 } });
    }

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/30,40.json?access_token=test-token&limit=1`
      );
    });

    await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter business location or pick on map')).toHaveValue('Clicked Address');
        expect(mockOnChange).toHaveBeenCalledWith({
            address: 'Clicked Address',
            coordinates: { lat: 40, lng: 30 },
        });
    });
  });

  test('updates coordinates and calls reverseGeocode on marker drag end', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ features: [{ place_name: 'Dragged Address' }] }),
    });

    render(<LocationPicker value={initialValue} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Pick Location on Map/i }));

    const markerInstance = (mockMapboxgl.Marker as jest.Mock).mock.results[0].value;
    const dragEndCallback = (markerInstance as any)._dragendCallback;

    expect(dragEndCallback).toBeDefined();

    // Mock getLngLat for the marker instance for this specific call
    (markerInstance.getLngLat as jest.Mock).mockReturnValueOnce({ lat: 50, lng: 60 });

    if (dragEndCallback) {
      dragEndCallback();
    }

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/60,50.json?access_token=test-token&limit=1`
      );
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter business location or pick on map')).toHaveValue('Dragged Address');
      expect(mockOnChange).toHaveBeenCalledWith({
        address: 'Dragged Address', // This should be Dragged Address
        coordinates: { lat: 50, lng: 60 },
      });
    });
  });


  test('"Confirm Selected Location" button calls onChange and hides map', async () => {
    mockFetch.mockResolvedValueOnce({ // Mock fetch for initial load if any click happens
        ok: true,
        json: async () => ({ features: [{ place_name: 'Some Address' }] }),
      });

    render(<LocationPicker value={initialValue} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Pick Location on Map/i }));

    // Simulate a map click to enable the confirm button
    const mapInstance = (mockMapboxgl.Map as jest.Mock).mock.results[0].value;
    const clickCallback = (mapInstance as any)._clickCallback;
    if (clickCallback) {
        clickCallback({ lngLat: { lng: 33, lat: 44 } });
    }

    // Wait for state update from click
    await waitFor(() => {
        expect(screen.getByRole('button', { name: /Confirm Selected Location/i })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Selected Location/i }));

    // Address might be from initialValue or from the click if geocoding was faster
    // We care that onChange is called with the *latest selected* coordinates
    await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            // Address will be 'Some Address' due to the mocked fetch for the click
            address: 'Some Address',
            coordinates: { lat: 44, lng: 33 },
        }));
    });
    expect(screen.queryByRole('button', { name: /Close Map/i })).not.toBeInTheDocument();
  });

  test('displays message if Mapbox token is not configured', () => {
    mapboxgl.accessToken = ''; // Unset token
    render(<LocationPicker value={undefined} onChange={mockOnChange} />);
    expect(screen.getByText(/Mapbox access token is not configured/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pick Location on Map/i })).not.toBeInTheDocument();
  });

  test('handles address input change', () => {
    render(<LocationPicker value={undefined} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Enter business location or pick on map');
    fireEvent.change(input, { target: { value: 'New Typed Address' } });
    expect(input).toHaveValue('New Typed Address');
    expect(mockOnChange).toHaveBeenCalledWith({
      address: 'New Typed Address',
      coordinates: undefined, // No coordinates selected yet
    });
  });

});
