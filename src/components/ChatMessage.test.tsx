import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType, RichContentType } from '@/types';

// Mock child card components and other complex components
jest.mock('./cards/HotelCard', () => ({ HotelCard: (props: any) => <div data-testid="hotel-card">{JSON.stringify(props)}</div> }));
jest.mock('./cards/RestaurantCard', () => ({ RestaurantCard: (props: any) => <div data-testid="restaurant-card">{JSON.stringify(props)}</div> }));
jest.mock('./cards/ActivityCard', () => ({ ActivityCard: (props: any) => <div data-testid="activity-card">{JSON.stringify(props)}</div> }));
jest.mock('./cards/TransportCard', () => ({ TransportCard: (props: any) => <div data-testid="transport-card">{JSON.stringify(props.transport)}</div> }));
jest.mock('./MapView', () => ({ MapView: (props: any) => <div data-testid="map-view">{JSON.stringify(props.locations)}</div> }));
jest.mock('./TransportMap', () => ({ TransportMap: (props: any) => <div data-testid="transport-map">{JSON.stringify(props.transports)}</div> }));


describe('ChatMessage', () => {
  const baseMessage: ChatMessageType = {
    id: '1',
    text: 'Test message text',
    timestamp: new Date(),
    isUser: false,
  };

  it('renders plain text message correctly', () => {
    render(<ChatMessage message={baseMessage} />);
    expect(screen.getByText('Test message text')).toBeInTheDocument();
    expect(screen.getByText(/Diani AI/i)).toBeInTheDocument(); // Non-user message
  });

  it('renders user message correctly', () => {
    const userMessage = { ...baseMessage, isUser: true, text: 'User plain text' };
    render(<ChatMessage message={userMessage} />);
    expect(screen.getByText('User plain text')).toBeInTheDocument();
    expect(screen.queryByText(/Diani AI/i)).not.toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    const date = new Date(2024, 0, 15, 14, 35); // 2:35 PM
    const messageWithSpecificDate = { ...baseMessage, timestamp: date };
    render(<ChatMessage message={messageWithSpecificDate} />);
    expect(screen.getByText('2:35 PM')).toBeInTheDocument();
  });

  describe('renderContent with richContent', () => {
    const testRichContent = (type: RichContentType['type'], data: any, expectedTestId: string, textPrefix: string = 'Rich content text') => {
      it(`renders ${type} rich content correctly`, () => {
        const messageWithRichContent: ChatMessageType = {
          ...baseMessage,
          text: textPrefix,
          richContent: { type, data },
        };
        render(<ChatMessage message={messageWithRichContent} />);

        expect(screen.getByText(textPrefix)).toBeInTheDocument(); // Text should still be there for list types
        const cardElement = screen.getByTestId(expectedTestId);
        expect(cardElement).toBeInTheDocument();
        // For single items, data is passed directly. For lists, data is the array.
        if (['hotel', 'restaurant', 'activity', 'transport'].includes(type)) {
          expect(cardElement.textContent).toBe(JSON.stringify(data));
        } else if (type === 'map') {
           expect(cardElement.textContent).toBe(JSON.stringify(data)); // MapView receives locations directly
        }
         else if (type === 'transports') { // transports special case for map
          expect(cardElement.textContent).toBe(JSON.stringify(data));
        }
        // For list types (hotels, restaurants, activities), the card itself will have item data
        // The main data for the list type is the array of items.
      });
    };

    testRichContent('hotel', { name: 'Grand Hotel' }, 'hotel-card');
    testRichContent('restaurant', { name: 'Fine Dining' }, 'restaurant-card');
    testRichContent('activity', { name: 'Safari Adventure' }, 'activity-card');
    testRichContent('map', [{ latitude: 1, longitude: 1, name: 'Pin1' }], 'map-view');
    testRichContent('transport', { id: 'tx1', type: 'taxi', driverName: 'John D' }, 'transport-card');

    it('renders list of hotels correctly', () => {
      const hotelsData = [{ name: 'Hotel A' }, { name: 'Hotel B' }];
      const message: ChatMessageType = { ...baseMessage, text: "Found these hotels:", richContent: { type: 'hotels', data: hotelsData } };
      render(<ChatMessage message={message} />);
      expect(screen.getByText("Found these hotels:")).toBeInTheDocument();
      const hotelCards = screen.getAllByTestId('hotel-card');
      expect(hotelCards).toHaveLength(2);
      expect(hotelCards[0].textContent).toBe(JSON.stringify(hotelsData[0]));
      expect(hotelCards[1].textContent).toBe(JSON.stringify(hotelsData[1]));
    });

    it('renders list of restaurants correctly', () => {
      const restaurantsData = [{ name: 'Resto A' }, { name: 'Resto B' }];
      const message: ChatMessageType = { ...baseMessage, text: "Found these restaurants:", richContent: { type: 'restaurants', data: restaurantsData } };
      render(<ChatMessage message={message} />);
      expect(screen.getByText("Found these restaurants:")).toBeInTheDocument();
      const cards = screen.getAllByTestId('restaurant-card');
      expect(cards).toHaveLength(2);
    });

    it('renders list of activities correctly', () => {
      const activitiesData = [{ name: 'Activity A' }, { name: 'Activity B' }];
      const message: ChatMessageType = { ...baseMessage, text: "Found these activities:", richContent: { type: 'activities', data: activitiesData } };
      render(<ChatMessage message={message} />);
      expect(screen.getByText("Found these activities:")).toBeInTheDocument();
      const cards = screen.getAllByTestId('activity-card');
      expect(cards).toHaveLength(2);
    });

    it('renders transports list with map correctly', () => {
        const transportsData = [{ id: 't1', type: 'taxi', driverName: 'Driver1' }, { id: 't2', type: 'bus', driverName: 'Driver2' }];
        const userLocation = { latitude: -4.0, longitude: 39.6 };
        const message: ChatMessageType = {
            ...baseMessage,
            text: "Available transport:",
            richContent: { type: 'transports', data: transportsData, userLocation }
        };
        render(<ChatMessage message={message} />);
        expect(screen.getByText("Available transport:")).toBeInTheDocument();
        expect(screen.getByTestId('transport-map')).toBeInTheDocument();
        expect(screen.getByTestId('transport-map').textContent).toBe(JSON.stringify(transportsData)); // TransportMap gets all transports

        const transportCards = screen.getAllByTestId('transport-card');
        expect(transportCards).toHaveLength(2);
        expect(transportCards[0].textContent).toBe(JSON.stringify(transportsData[0]));
    });

    it('renders default text content for unknown richContent type', () => {
      const messageWithUnknownRichContent: ChatMessageType = {
        ...baseMessage,
        text: 'This text should be visible.',
        // @ts-ignore - Deliberately using an unknown type
        richContent: { type: 'unknown_type', data: { info: 'Some info' } },
      };
      render(<ChatMessage message={messageWithUnknownRichContent} />);

      // It should fall back to rendering message.text
      expect(screen.getByText('This text should be visible.')).toBeInTheDocument();
      // Ensure no card-like test IDs are present
      expect(screen.queryByTestId('hotel-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('map-view')).not.toBeInTheDocument();
    });
  });
});
