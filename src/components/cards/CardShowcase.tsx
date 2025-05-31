import React from 'react';
import { HotelCard, HotelCardSkeleton } from './HotelCard';
import { ActivityCard, ActivityCardSkeleton } from './ActivityCard';
import { RestaurantCard, RestaurantCardSkeleton } from './RestaurantCard';
import { TransportCard, TransportCardSkeleton } from './TransportCard';
import { ResponsiveCardGrid } from './ResponsiveCardGrid';
import { Transport } from '@/types/transport';

// Sample data for demonstration
const sampleHotel = {
  id: 'hotel-1',
  name: 'Diani Reef Beach Resort & Spa',
  rating: 4.5,
  price: 'From KES 15,000/night',
  pricePerNight: 15000,
  currency: 'KES',
  location: 'Diani Beach Road',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access', 'Gym', 'Bar'],
  description: 'Luxury beachfront resort with stunning ocean views and world-class amenities. Perfect for a relaxing getaway.',
};

const sampleActivity = {
  id: 'activity-1',
  name: 'Dolphin Watching & Snorkeling Tour',
  category: 'Water Sports',
  duration: '4 hours',
  groupSize: '2-8 people',
  location: 'Wasini Island',
  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  price: 'KES 3,500/person',
  priceValue: 3500,
  currency: 'KES',
  difficulty: 'Moderate' as const,
  highlights: ['Dolphin spotting', 'Snorkeling gear included', 'Seafood lunch', 'Professional guide', 'Boat transport'],
  availability: 'Daily at 8:00 AM',
};

const sampleRestaurant = {
  id: 'restaurant-1',
  name: 'Ali Barbour\'s Cave Restaurant',
  cuisine: 'Seafood & International',
  rating: 4.8,
  priceLevel: 3 as const,
  location: 'Diani Beach',
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  hours: '12:00 PM - 11:00 PM',
  phone: '+254 123 456 789',
  specialties: ['Grilled Lobster', 'Seafood Platter', 'Cave Dining Experience', 'Wine Selection'],
};

const sampleTransport: Transport = {
  id: 'transport-1',
  type: 'tuktuk',
  driverName: 'John Kamau',
  driverPhone: '+254 712 345 678',
  vehicleNumber: 'KBZ 123A',
  driverRating: 4.7,
  isAvailable: true,
  location: {
    lat: -4.3167,
    lng: 39.5667,
  },
  distance: '1.2 km',
  estimatedArrival: '5 minutes',
  fare: {
    amount: 200,
    currency: 'KES',
    estimate: 'KES 200-250',
  },
  lastUpdated: new Date(),
};

export const CardShowcase: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Card Components Showcase</h2>
        <p className="text-gray-600 mb-6">
          Production-ready card components with accessibility, internationalization, and responsive design.
        </p>
      </div>

      {/* Individual Cards */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Individual Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Hotel Card</h4>
            <HotelCard
              {...sampleHotel}
              onClick={() => console.log('Hotel card clicked')}
              onViewDetails={() => console.log('View details clicked')}
              onCheckAvailability={() => console.log('Check availability clicked')}
            />
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Activity Card</h4>
            <ActivityCard
              {...sampleActivity}
              onClick={() => console.log('Activity card clicked')}
              onBookNow={() => console.log('Book now clicked')}
              onLearnMore={() => console.log('Learn more clicked')}
            />
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Restaurant Card</h4>
            <RestaurantCard
              {...sampleRestaurant}
              onClick={() => console.log('Restaurant card clicked')}
              onViewMenu={() => console.log('View menu clicked')}
              onCall={() => console.log('Call clicked')}
            />
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Transport Card</h4>
            <TransportCard
              transport={sampleTransport}
              onClick={() => console.log('Transport card clicked')}
              onBook={(transport) => console.log('Book transport:', transport)}
              onCall={(transport) => console.log('Call driver:', transport)}
            />
          </div>
        </div>
      </section>

      {/* Responsive Grid */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Responsive Grid Layout</h3>
        <ResponsiveCardGrid>
          <HotelCard {...sampleHotel} />
          <ActivityCard {...sampleActivity} />
          <RestaurantCard {...sampleRestaurant} />
          <TransportCard transport={sampleTransport} />
          <HotelCard {...sampleHotel} name="Baobab Beach Resort" />
          <ActivityCard {...sampleActivity} name="Kite Surfing Lessons" />
        </ResponsiveCardGrid>
      </section>

      {/* Loading States */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Loading States</h3>
        <ResponsiveCardGrid>
          <HotelCardSkeleton />
          <ActivityCardSkeleton />
          <RestaurantCardSkeleton />
          <TransportCardSkeleton />
        </ResponsiveCardGrid>
      </section>

      {/* Different States */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Different States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Unavailable Transport</h4>
            <TransportCard
              transport={{ ...sampleTransport, isAvailable: false }}
              onBook={(transport) => console.log('Book transport:', transport)}
              onCall={(transport) => console.log('Call driver:', transport)}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Easy Activity</h4>
            <ActivityCard
              {...sampleActivity}
              difficulty="Easy"
              name="Beach Yoga Session"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Budget Restaurant</h4>
            <RestaurantCard
              {...sampleRestaurant}
              priceLevel={1}
              name="Mama's Kitchen"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Export skeleton components for easy access
export { HotelCardSkeleton, ActivityCardSkeleton, RestaurantCardSkeleton, TransportCardSkeleton };
