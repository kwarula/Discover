import React from 'react';
import { ListingBase } from '@/types';
import { HotelCard } from './HotelCard';
import { RestaurantCard } from './RestaurantCard';
import { ActivityCard } from './ActivityCard';
import { TransportCard } from './TransportCard';

interface ListingCardProps {
  listing: ListingBase;
  onClick?: () => void;
  onAction?: (action: string, listing: ListingBase) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onClick, 
  onAction 
}) => {
  const handleAction = (action: string) => {
    onAction?.(action, listing);
  };

  switch (listing.type) {
    case 'hotel':
      return (
        <HotelCard
          id={listing.id}
          name={listing.name}
          rating={listing.rating || 0}
          price={listing.price || ''}
          location={listing.location}
          image={listing.image || ''}
          amenities={listing.amenities || []}
          description={listing.description || ''}
          currency={listing.currency}
          pricePerNight={listing.pricePerNight}
          onClick={onClick}
          onViewDetails={() => handleAction('viewDetails')}
          onCheckAvailability={() => handleAction('checkAvailability')}
        />
      );

    case 'restaurant':
      return (
        <RestaurantCard
          id={listing.id}
          name={listing.name}
          cuisine={listing.cuisine || 'International'}
          rating={listing.rating || 0}
          priceLevel={listing.priceLevel || 2}
          location={listing.location}
          image={listing.image || ''}
          hours={listing.hours || 'N/A'}
          phone={listing.phone}
          specialties={listing.specialties || []}
          onClick={onClick}
          onViewMenu={() => handleAction('viewMenu')}
          onCall={() => handleAction('call')}
        />
      );

    case 'activity':
      return (
        <ActivityCard
          id={listing.id}
          name={listing.name}
          category={listing.category || 'Activity'}
          duration={listing.duration || 'N/A'}
          groupSize={listing.groupSize || 'N/A'}
          location={listing.location}
          image={listing.image || ''}
          price={listing.price || ''}
          difficulty={listing.difficulty}
          highlights={listing.highlights || []}
          availability={listing.availability || 'N/A'}
          currency={listing.currency}
          priceValue={listing.priceValue}
          onClick={onClick}
          onBookNow={() => handleAction('bookNow')}
          onLearnMore={() => handleAction('learnMore')}
        />
      );

    case 'transport':
      // For transport, we expect the transport object to be passed
      if (listing.transport) {
        return (
          <TransportCard
            transport={listing.transport}
            onClick={onClick}
            onBook={(transport) => onAction?.('book', { ...listing, transport })}
            onCall={(transport) => onAction?.('call', { ...listing, transport })}
          />
        );
      }
      return null;

    default:
      // Fallback for unknown types
      return (
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-diani-sand-600">Unknown listing type: {listing.type}</p>
        </div>
      );
  }
};