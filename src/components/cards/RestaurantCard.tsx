import React, { memo } from 'react';
import { Star, MapPin, Clock, DollarSign, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RestaurantCardProps } from '@/types/cards';
import { CardImage } from './CardImage';
import { CardSkeleton } from './CardSkeleton';
import { useCardLocalization } from '@/hooks/useCardLocalization';

export const RestaurantCard = memo<RestaurantCardProps>(({
  id,
  name,
  cuisine,
  rating,
  priceLevel,
  location,
  image,
  hours,
  phone,
  specialties,
  onClick,
  onViewMenu,
  onCall,
}) => {
  const { formatRating, cardTexts, getPriceLevelLabel } = useCardLocalization();
  
  // Validate rating and price level
  const validRating = Math.min(Math.max(rating, 0), 5);
  const validPriceLevel = Math.min(Math.max(priceLevel, 1), 4) as 1 | 2 | 3 | 4;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  const handleViewMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewMenu?.();
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCall?.();
  };

  return (
    <article
      className={cn(
        "glass rounded-2xl overflow-hidden shadow-lg hover-lift transition-all duration-300",
        "focus-within:ring-2 focus-within:ring-coral-sunset-500 focus-within:ring-offset-2",
        "w-full h-full flex flex-col",
        onClick && "cursor-pointer"
      )}
      onClick={handleCardClick}
      role="article"
      aria-label={`Restaurant: ${name}`}
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
          alt={`${name} - ${cuisine} restaurant in ${location}`}
          className="h-full"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-white">{cuisine}</span>
        </div>
        <div 
          className="absolute top-3 right-3 glass px-2 py-1 rounded-full flex items-center"
          aria-label={`Price level: ${getPriceLevelLabel(validPriceLevel)}`}
        >
          {[...Array(4)].map((_, i) => (
            <DollarSign
              key={i}
              size={14}
              className={cn(
                "transition-colors -ml-1 first:ml-0",
                i < validPriceLevel ? "text-white" : "text-white/40"
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header */}
        <header>
          <h3 className="text-lg font-bold text-diani-sand-900 line-clamp-1">{name}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-diani-sand-500 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm text-diani-sand-600 truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-diani-sand-500 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm text-diani-sand-600 truncate" aria-label={`Hours: ${hours}`}>
                {hours}
              </span>
            </div>
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

        {/* Specialties */}
        {specialties.length > 0 && (
          <div className="space-y-1 flex-1">
            <p className="text-xs font-medium text-diani-sand-600">{cardTexts.popularDishes}</p>
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Popular dishes">
              {specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={`${id}-specialty-${index}`}
                  className="px-2 py-1 bg-coral-sunset-50 text-coral-sunset-700 rounded-full text-xs"
                  role="listitem"
                >
                  {specialty}
                </span>
              ))}
              {specialties.length > 3 && (
                <span className="px-2 py-1 bg-coral-sunset-50 text-coral-sunset-700 rounded-full text-xs">
                  {cardTexts.more.replace('{count}', String(specialties.length - 3))}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 mt-auto">
          <button
            className={cn(
              "flex-1 px-3 py-2 bg-gradient-to-r from-coral-sunset-500 to-coral-sunset-600",
              "text-white rounded-lg text-sm font-medium",
              "hover:from-coral-sunset-600 hover:to-coral-sunset-700",
              "focus:outline-none focus:ring-2 focus:ring-coral-sunset-500 focus:ring-offset-2",
              "transition-all",
              "min-w-0"
            )}
            onClick={handleViewMenu}
            aria-label={`${cardTexts.viewMenu} for ${name}`}
          >
            <span className="truncate">{cardTexts.viewMenu}</span>
          </button>
          {phone && (
            <button
              className={cn(
                "px-3 py-2 border border-coral-sunset-500",
                "text-coral-sunset-600 rounded-lg text-sm font-medium",
                "hover:bg-coral-sunset-50",
                "focus:outline-none focus:ring-2 focus:ring-coral-sunset-500 focus:ring-offset-2",
                "transition-all flex items-center gap-2",
                "min-w-0"
              )}
              onClick={handleCall}
              aria-label={`${cardTexts.call} ${name} at ${phone}`}
            >
              <Phone size={14} className="flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">{cardTexts.call} {phone}</span>
              <span aria-hidden="true" className="truncate">{cardTexts.call}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

// Loading state component
export const RestaurantCardSkeleton: React.FC = () => {
  return <CardSkeleton type="restaurant" />;
};
