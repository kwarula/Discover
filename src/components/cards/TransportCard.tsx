import React, { memo } from 'react';
import { Phone, Star, Navigation, Clock, DollarSign } from 'lucide-react';
import { Transport } from '@/types/transport';
import { cn } from '@/lib/utils';
import { CardSkeleton } from './CardSkeleton';
import { useCardLocalization } from '@/hooks/useCardLocalization';

interface TransportCardProps {
  transport: Transport;
  onBook?: (transport: Transport) => void;
  onCall?: (transport: Transport) => void;
  onClick?: () => void;
}

export const TransportCard = memo<TransportCardProps>(({ 
  transport, 
  onBook,
  onCall,
  onClick
}) => {
  const { formatCurrency, formatRating, formatDistance, cardTexts } = useCardLocalization();
  
  const getVehicleIcon = () => {
    return transport.type === 'bodaboda' ? '🏍️' : '🛺';
  };

  const getVehicleColor = () => {
    return transport.type === 'bodaboda' 
      ? 'from-orange-500 to-orange-600' 
      : 'from-yellow-500 to-yellow-600';
  };

  const getVehicleLabel = () => {
    return transport.type === 'bodaboda' ? 'Motorcycle' : 'Tuk-tuk';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBook?.(transport);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCall?.(transport);
  };

  // Validate rating
  const validRating = Math.min(Math.max(transport.driverRating, 0), 5);
  
  // Format fare display
  const displayFare = transport.fare.estimate || 
    formatCurrency(transport.fare.amount, transport.fare.currency);

  return (
    <article 
      className={cn(
        "glass rounded-2xl p-4 hover:scale-[1.02] transition-all duration-200",
        "border border-white/50",
        "focus-within:ring-2 focus-within:ring-diani-teal-500 focus-within:ring-offset-2",
        "w-full h-full flex flex-col",
        onClick && "cursor-pointer"
      )}
      onClick={handleCardClick}
      role="article"
      aria-label={`${getVehicleLabel()} transport: ${transport.driverName}`}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick) {
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className={cn(
              "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl",
              "flex-shrink-0",
              getVehicleColor()
            )}
            role="img"
            aria-label={getVehicleLabel()}
          >
            {getVehicleIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-diani-sand-800 truncate">{transport.driverName}</h3>
            <p className="text-sm text-diani-sand-600 truncate" aria-label={`Vehicle number: ${transport.vehicleNumber}`}>
              {transport.vehicleNumber}
            </p>
          </div>
        </div>
        <div 
          className="flex items-center gap-1 flex-shrink-0"
          role="img"
          aria-label={formatRating(validRating)}
        >
          <Star className="w-4 h-4 text-yellow-500 fill-current" aria-hidden="true" />
          <span className="text-sm font-medium text-diani-sand-700" aria-hidden="true">
            {validRating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 flex-1" role="list" aria-label="Transport details">
        <div className="flex items-center gap-2 text-sm text-diani-sand-600" role="listitem">
          <Navigation className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="truncate" aria-label={`Distance: ${formatDistance(transport.distance)} away`}>
            {formatDistance(transport.distance)} away
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-diani-sand-600" role="listitem">
          <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="truncate" aria-label={`Arrival time: ${transport.estimatedArrival}`}>
            {cardTexts.arrivesIn} {transport.estimatedArrival}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-diani-sand-600" role="listitem">
          <DollarSign className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span 
            className="font-medium truncate"
            aria-label={`Fare: ${displayFare}`}
          >
            {displayFare}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        {onCall && (
          <button
            onClick={handleCall}
            className={cn(
              "flex-1 glass px-3 py-2 rounded-lg text-sm font-medium",
              "text-diani-sand-700 hover:bg-white/80",
              "focus:outline-none focus:ring-2 focus:ring-diani-teal-500 focus:ring-offset-2",
              "transition-all duration-200 flex items-center justify-center gap-2",
              "min-w-0"
            )}
            aria-label={`${cardTexts.callDriver} ${transport.driverName}`}
          >
            <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{cardTexts.callDriver}</span>
          </button>
        )}
        {onBook && (
          <button
            onClick={handleBook}
            disabled={!transport.isAvailable}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-sm font-medium",
              "transition-all duration-200 flex items-center justify-center gap-2",
              "focus:outline-none focus:ring-2 focus:ring-diani-teal-500 focus:ring-offset-2",
              "min-w-0",
              transport.isAvailable
                ? "bg-gradient-to-br from-diani-teal-500 to-diani-teal-700 text-white hover:from-diani-teal-600 hover:to-diani-teal-800"
                : "glass text-diani-sand-500 cursor-not-allowed opacity-60"
            )}
            aria-label={
              transport.isAvailable 
                ? `${cardTexts.bookNow} ${getVehicleLabel()} with ${transport.driverName}` 
                : `${getVehicleLabel()} with ${transport.driverName} is ${cardTexts.unavailable}`
            }
            aria-disabled={!transport.isAvailable}
          >
            <span className="truncate">
              {transport.isAvailable ? cardTexts.bookNow : cardTexts.unavailable}
            </span>
          </button>
        )}
      </div>
    </article>
  );
});

TransportCard.displayName = 'TransportCard';

// Loading state component
export const TransportCardSkeleton: React.FC = () => {
  return <CardSkeleton type="transport" />;
};
