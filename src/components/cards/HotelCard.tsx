import React, { memo } from 'react';
import { Star, MapPin, Wifi, Car, Coffee, Users, Waves, Dumbbell, Sparkles, Utensils, Wine, Wind, PawPrint, Umbrella } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HotelCardProps, AMENITY_ICONS } from '@/types/cards';
import { CardImage } from './CardImage';
import { CardSkeleton } from './CardSkeleton';
import { useCardLocalization } from '@/hooks/useCardLocalization';

// Icon mapping for amenities
const amenityIconMap = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  family: Users,
  pool: Waves,
  gym: Dumbbell,
  spa: Sparkles,
  restaurant: Utensils,
  bar: Wine,
  'air conditioning': Wind,
  'pet friendly': PawPrint,
  'beach access': Umbrella,
};

export const HotelCard = memo<HotelCardProps>(({
  id,
  name,
  rating,
  price,
  location,
  image,
  amenities,
  description,
  currency = 'KES',
  pricePerNight,
  onClick,
  onViewDetails,
  onCheckAvailability,
}) => {
  const { formatCurrency, formatRating, cardTexts } = useCardLocalization();
  
  // Validate rating
  const validRating = Math.min(Math.max(rating, 0), 5);
  
  // Ensure amenities is always an array
  const safeAmenities = Array.isArray(amenities) ? amenities : [];

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.();
  };

  const handleCheckAvailability = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCheckAvailability?.();
  };

  // Format price display
  const displayPrice = pricePerNight 
    ? formatCurrency(pricePerNight, currency)
    : price;

  return (
    <article
      className={cn(
        "glass rounded-2xl overflow-hidden shadow-lg hover-lift transition-all duration-300",
        "focus-within:ring-2 focus-within:ring-diani-teal-500 focus-within:ring-offset-2",
        "w-full h-full flex flex-col",
        onClick && "cursor-pointer"
      )}
      onClick={handleCardClick}
      role="article"
      aria-label={`Hotel: ${name}`}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick) {
          onClick();
        }
      }}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 md:h-48 overflow-hidden">
        <CardImage
          src={image}
          alt={`${name} - Hotel in ${location}`}
          className="h-full"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full">
          <span className="text-sm font-semibold text-white" aria-label={`Price: ${displayPrice}`}>
            {displayPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header */}
        <header>
          <h3 className="text-lg font-bold text-diani-sand-900 line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <MapPin size={14} className="text-diani-sand-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-diani-sand-600 line-clamp-1">{location}</span>
          </div>
        </header>

        {/* Rating */}
        <div className="flex items-center gap-1" role="img" aria-label={formatRating(validRating)}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={cn(
                "transition-colors",
                i < validRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              )}
              aria-hidden="true"
            />
          ))}
          <span className="text-sm text-diani-sand-600 ml-2" aria-hidden="true">
            {formatRating(validRating)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-diani-sand-700 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Amenities */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-diani-sand-600">{cardTexts.amenities}</p>
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="Hotel amenities">
            {safeAmenities.slice(0, 4).map((amenity, index) => {
              const Icon = amenityIconMap[amenity.toLowerCase() as keyof typeof amenityIconMap] || Coffee;
              return (
                <div
                  key={`${id}-amenity-${index}`}
                  className="flex items-center gap-1 px-2 py-1 bg-diani-teal-50 rounded-full"
                  role="listitem"
                >
                  <Icon size={12} className="text-diani-teal-600" aria-hidden="true" />
                  <span className="text-xs text-diani-teal-700 capitalize">
                    {amenity}
                  </span>
                </div>
              );
            })}
            {safeAmenities.length > 4 && (
              <div className="px-2 py-1 bg-diani-teal-50 rounded-full">
                <span className="text-xs text-diani-teal-700">
                  {cardTexts.more.replace('{count}', String(safeAmenities.length - 4))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 mt-auto">
          <button
            className={cn(
              "flex-1 px-3 py-2 bg-gradient-to-r from-diani-teal-500 to-diani-teal-600",
              "text-white rounded-lg text-sm font-medium",
              "hover:from-diani-teal-600 hover:to-diani-teal-700",
              "focus:outline-none focus:ring-2 focus:ring-diani-teal-500 focus:ring-offset-2",
              "transition-all",
              "min-w-0" // Prevent button from growing too wide
            )}
            onClick={handleViewDetails}
            aria-label={`${cardTexts.viewDetails} - ${name}`}
          >
            <span className="truncate">{cardTexts.viewDetails}</span>
          </button>
          <button
            className={cn(
              "flex-1 px-3 py-2 border border-diani-teal-500",
              "text-diani-teal-600 rounded-lg text-sm font-medium",
              "hover:bg-diani-teal-50",
              "focus:outline-none focus:ring-2 focus:ring-diani-teal-500 focus:ring-offset-2",
              "transition-all",
              "min-w-0" // Prevent button from growing too wide
            )}
            onClick={handleCheckAvailability}
            aria-label={`${cardTexts.checkAvailability} - ${name}`}
          >
            <span className="truncate">{cardTexts.checkAvailability}</span>
          </button>
        </div>
      </div>
    </article>
  );
});

HotelCard.displayName = 'HotelCard';

// Loading state component
export const HotelCardSkeleton: React.FC = () => {
  return <CardSkeleton type="hotel" />;
};
