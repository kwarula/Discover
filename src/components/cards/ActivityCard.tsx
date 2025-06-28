import React, { memo } from 'react';
import { Clock, Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivityCardProps, DIFFICULTY_STYLES } from '@/types/cards';
import { CardImage } from './CardImage';
import { CardSkeleton } from './CardSkeleton';
import { useCardLocalization } from '@/hooks/useCardLocalization';

export const ActivityCard = memo<ActivityCardProps>(({
  id,
  name,
  category,
  duration,
  groupSize,
  location,
  image,
  price,
  difficulty,
  highlights,
  availability,
  currency = 'KES',
  priceValue,
  onClick,
  onBookNow,
  onLearnMore,
}) => {
  const { formatCurrency, formatDuration, cardTexts, getDifficultyLabel } = useCardLocalization();
  
  // Ensure highlights is always an array
  const safeHighlights = Array.isArray(highlights) ? highlights : [];

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookNow?.();
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLearnMore?.();
  };

  const difficultyStyle = difficulty ? DIFFICULTY_STYLES[difficulty] : null;
  
  // Format price display
  const displayPrice = priceValue 
    ? formatCurrency(priceValue, currency)
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
      aria-label={`Activity: ${name}`}
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
          alt={`${name} - ${category} activity in ${location}`}
          className="h-full"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-white">{category}</span>
        </div>
        <div className="absolute bottom-3 right-3 glass px-3 py-1 rounded-full">
          <span className="text-lg font-bold text-white" aria-label={`Price: ${displayPrice}`}>
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

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm" role="list" aria-label="Activity details">
          <div className="flex items-center gap-1" role="listitem">
            <Clock size={14} className="text-diani-teal-600 flex-shrink-0" aria-hidden="true" />
            <span className="text-diani-sand-700 truncate" aria-label={`Duration: ${formatDuration(duration)}`}>
              {formatDuration(duration)}
            </span>
          </div>
          <div className="flex items-center gap-1" role="listitem">
            <Users size={14} className="text-diani-teal-600 flex-shrink-0" aria-hidden="true" />
            <span className="text-diani-sand-700 truncate" aria-label={`Group size: ${groupSize}`}>
              {groupSize}
            </span>
          </div>
          {difficulty && difficultyStyle && (
            <div className="flex items-center gap-1 col-span-2 sm:col-span-1" role="listitem">
              <TrendingUp size={14} className="text-diani-teal-600 flex-shrink-0" aria-hidden="true" />
              <span 
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs truncate",
                  difficultyStyle.bg,
                  difficultyStyle.text,
                  difficultyStyle.border,
                  "border"
                )}
                aria-label={`Difficulty: ${getDifficultyLabel(difficulty)}`}
              >
                {getDifficultyLabel(difficulty)}
              </span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {safeHighlights.length > 0 && (
          <div className="space-y-1 flex-1">
            <p className="text-xs font-medium text-diani-sand-600">{cardTexts.highlights}</p>
            <div className="flex flex-wrap gap-1" role="list" aria-label="Activity highlights">
              {safeHighlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={`${id}-highlight-${index}`}
                  className="px-2 py-1 bg-diani-teal-50 text-diani-teal-700 rounded-full text-xs"
                  role="listitem"
                >
                  ✓ {highlight}
                </span>
              ))}
              {safeHighlights.length > 3 && (
                <span className="px-2 py-1 bg-diani-teal-50 text-diani-teal-700 rounded-full text-xs">
                  {cardTexts.more.replace('{count}', String(safeHighlights.length - 3))}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-diani-sand-500 flex-shrink-0" aria-hidden="true" />
          <span className="text-diani-sand-600 truncate" aria-label={`Availability: ${availability}`}>
            {availability}
          </span>
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
              "min-w-0"
            )}
            onClick={handleBookNow}
            aria-label={`${cardTexts.bookNow} ${name} activity`}
          >
            <span className="truncate">{cardTexts.bookNow}</span>
          </button>
          <button
            className={cn(
              "flex-1 px-3 py-2 border border-diani-teal-500",
              "text-diani-teal-600 rounded-lg text-sm font-medium",
              "hover:bg-diani-teal-50",
              "focus:outline-none focus:ring-2 focus:ring-diani-teal-500 focus:ring-offset-2",
              "transition-all",
              "min-w-0"
            )}
            onClick={handleLearnMore}
            aria-label={`${cardTexts.learnMore} about ${name} activity`}
          >
            <span className="truncate">{cardTexts.learnMore}</span>
          </button>
        </div>
      </div>
    </article>
  );
});

ActivityCard.displayName = 'ActivityCard';

// Loading state component
export const ActivityCardSkeleton: React.FC = () => {
  return <CardSkeleton type="activity" />;
};
