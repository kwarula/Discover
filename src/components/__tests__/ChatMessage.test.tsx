import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage } from '../ChatMessage';
import { ChatMessage as ChatMessageType, Transport } from '@/types';
import { supabase } from '@/lib/supabase'; // To be mocked

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockImplementation(callback => {
      // Simulate successful subscription
      callback('SUBSCRIBED');
      return {
        unsubscribe: jest.fn(),
      };
    }),
    removeChannel: jest.fn(),
  },
}));

// Mock child components
jest.mock('../cards/TransportCard', () => ({
  TransportCard: jest.fn(({ transport, isSelected, onClick }) => (
    <div data-testid={`transport-card-${transport.id}`} data-selected={isSelected} onClick={onClick}>
      {transport.driverName}
    </div>
  )),
}));

jest.mock('../TransportMap', () => ({
  TransportMap: jest.fn(({ initialTransports, selectedTransport, onTransportSelect }) => (
    <div data-testid="transport-map">
      {initialTransports.map((t: Transport) => (
        <div key={t.id} data-testid={`map-marker-${t.id}`} onClick={() => onTransportSelect(t)}>
          {t.driverName}
        </div>
      ))}
      {selectedTransport && <div data-testid="selected-map-transport">{selectedTransport.id}</div>}
    </div>
  )),
}));

const mockTransport1: Transport = {
  id: 't1',
  type: 'bodaboda',
  driverName: 'Driver 1',
  driverPhone: '123',
  driverRating: 4.5,
  vehicleNumber: 'KDA 001A',
  location: { lat: -4.0, lng: 39.5 },
  estimatedArrival: '5 mins',
  distance: '1 km',
  fare: { amount: 100, currency: 'KES' },
  isAvailable: true,
};

const mockTransport2: Transport = {
  id: 't2',
  type: 'tuktuk',
  driverName: 'Driver 2',
  driverPhone: '456',
  driverRating: 4.8,
  vehicleNumber: 'KDB 002B',
  location: { lat: -4.1, lng: 39.6 },
  estimatedArrival: '8 mins',
  distance: '2 km',
  fare: { amount: 150, currency: 'KES' },
  isAvailable: true,
};

const transportMessage: ChatMessageType = {
  id: 'msg1',
  text: 'Here are your transport options:',
  isUser: false,
  timestamp: new Date(),
  richContent: {
    type: 'transports',
    data: [mockTransport1], // Initial transport data
    userLocation: { lat: -4.05, lng: 39.55 },
  },
};

describe('ChatMessage with Transports and Realtime Updates', () => {
  let mockChannel: any;
  let broadcastCallback: (payload: { event: string; payload: any }) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockChannel = {
      on: jest.fn().mockImplementation((event, filter, callback) => {
        if (filter.event === 'transport-update') {
          broadcastCallback = callback;
        }
        return mockChannel;
      }),
      subscribe: jest.fn().mockImplementation(cb => {
        cb('SUBSCRIBED'); // Simulate subscription
        return { unsubscribe: jest.fn() };
      }),
      unsubscribe: jest.fn(),
    };
    (supabase.channel as jest.Mock).mockReturnValue(mockChannel);
  });

  test('subscribes to transport updates and renders initial transports', () => {
    render(<ChatMessage message={transportMessage} />);

    expect(supabase.channel).toHaveBeenCalledWith(`transports-message-${transportMessage.id}`);
    expect(mockChannel.on).toHaveBeenCalledWith(
      'broadcast',
      { event: 'transport-update' },
      expect.any(Function)
    );
    expect(mockChannel.subscribe).toHaveBeenCalled();

    // Check initial render
    expect(screen.getByTestId('transport-map')).toBeInTheDocument();
    expect(screen.getByTestId(`transport-card-${mockTransport1.id}`)).toHaveTextContent('Driver 1');
    expect(screen.queryByTestId(`transport-card-${mockTransport2.id}`)).not.toBeInTheDocument();
  });

  test('updates transports when a broadcast message is received', () => {
    render(<ChatMessage message={transportMessage} />);

    expect(screen.getByTestId(`transport-card-${mockTransport1.id}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`transport-card-${mockTransport2.id}`)).not.toBeInTheDocument();

    const updatedTransportsPayload = {
      transports: [mockTransport1, mockTransport2],
    };

    // Simulate receiving a broadcast
    act(() => {
      broadcastCallback({ event: 'transport-update', payload: updatedTransportsPayload });
    });

    // Check if UI updated
    expect(screen.getByTestId(`transport-card-${mockTransport1.id}`)).toHaveTextContent('Driver 1');
    expect(screen.getByTestId(`transport-card-${mockTransport2.id}`)).toHaveTextContent('Driver 2');

    // Check if TransportMap received updated transports
    expect(screen.getByTestId('transport-map')).toContainElement(screen.getByTestId(`map-marker-${mockTransport1.id}`));
    expect(screen.getByTestId('transport-map')).toContainElement(screen.getByTestId(`map-marker-${mockTransport2.id}`));
  });

  test('unsubscribes from channel on unmount', () => {
    const { unmount } = render(<ChatMessage message={transportMessage} />);

    const channelInstance = supabase.channel(`transports-message-${transportMessage.id}`);
    expect(channelInstance.subscribe).toHaveBeenCalledTimes(1); // from the initial render

    unmount();

    expect(supabase.removeChannel).toHaveBeenCalledWith(channelInstance);
  });

  test('handles transport selection and updates selected state', () => {
    render(<ChatMessage message={transportMessage} />);

    const transportCard = screen.getByTestId(`transport-card-${mockTransport1.id}`);
    act(() => {
      transportCard.click();
    });

    expect(screen.getByTestId(`transport-card-${mockTransport1.id}`)).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('selected-map-transport')).toHaveTextContent(mockTransport1.id);

    // Add more assertions for TransportMap selection if needed via its mock
  });

});

describe('ChatMessage with other rich content types', () => {
  test('renders hotel card', () => {
    const hotelMessage: ChatMessageType = {
      id: 'msg-hotel',
      text: 'Hotel info',
      isUser: false,
      timestamp: new Date(),
      richContent: { type: 'hotel', data: { name: 'Test Hotel' } as any },
    };
    // Mock HotelCard or ensure it renders something identifiable
    jest.mock('../cards/HotelCard', () => ({ HotelCard: () => <div data-testid="hotel-card">Hotel</div> }));
    render(<ChatMessage message={hotelMessage} />);
    expect(screen.getByTestId('hotel-card')).toBeInTheDocument();
  });

  // Add similar tests for 'restaurant', 'activity', 'map', etc.
});

describe('ChatMessage basic rendering', () => {
  test('renders a simple text message from user', () => {
    const simpleUserMessage: ChatMessageType = {
      id: 'msg-user-simple',
      text: 'Hello there',
      isUser: true,
      timestamp: new Date(),
    };
    render(<ChatMessage message={simpleUserMessage} />);
    expect(screen.getByText('Hello there')).toBeInTheDocument();
  });

  test('renders a simple text message from AI', () => {
    const simpleAiMessage: ChatMessageType = {
      id: 'msg-ai-simple',
      text: 'Hi, how can I help?',
      isUser: false,
      timestamp: new Date(),
    };
    render(<ChatMessage message={simpleAiMessage} />);
    expect(screen.getByText('Hi, how can I help?')).toBeInTheDocument();
  });
});
