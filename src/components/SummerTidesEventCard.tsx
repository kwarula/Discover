import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SummerTidesEventCardProps {
  className?: string;
}

export const SummerTidesEventCard: React.FC<SummerTidesEventCardProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Event dates
  const eventStartDate = new Date('2025-07-05');
  const eventEndDate = new Date('2025-07-07');
  const currentDate = new Date();

  useEffect(() => {
    // Check if event is still upcoming or ongoing
    const isEventActive = currentDate <= eventEndDate;
    
    // Check if user has dismissed the card today
    const dismissedDate = localStorage.getItem('summerTidesHidden');
    const today = currentDate.toDateString();
    const wasDismissedToday = dismissedDate === today;

    // Show card if event is active and not dismissed today
    if (isEventActive && !wasDismissedToday) {
      setIsVisible(true);
    }
  }, [currentDate, eventEndDate]);

  const handleDismiss = () => {
    setIsClosing(true);
    // Store dismissal date in localStorage
    localStorage.setItem('summerTidesHidden', currentDate.toDateString());
    
    // Hide after animation
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleViewDetails = () => {
    // Open ticket purchase link in new tab
    window.open('https://summertidesfestival.hustlesasa.shop/', '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "relative bg-white/90 backdrop-blur-sm border-2 border-diani-teal-500 rounded-lg shadow-lg transition-all duration-300",
      isClosing && "opacity-0 transform scale-95",
      className
    )}>
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-diani-sand-100 transition-colors"
        aria-label="Close event card"
      >
        <X size={16} className="text-diani-sand-600" />
      </button>

      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-diani-teal-500 font-medium text-sm font-['Montserrat']">
          Summer Tides Event | July 5–7
        </h3>
      </div>

      {/* Hero Image Banner */}
      <div className="px-4 pb-2">
        <div className="w-full h-20 bg-gradient-to-r from-diani-teal-500 to-coral-sunset-500 rounded-md overflow-hidden relative">
          {/* Placeholder for beach concert/sunset image */}
          <div className="absolute inset-0 bg-gradient-to-r from-diani-teal-500/80 to-coral-sunset-500/80 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-2xl mb-1">🎵</div>
              <div className="text-xs font-medium">Beach Concert</div>
            </div>
          </div>
          
          {/* Overlay pattern for visual interest */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 240 80">
              <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q10 0 20 10 T40 10" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Body text */}
      <div className="px-4 pb-3">
        <p className="text-diani-sand-700 text-sm font-['Montserrat'] font-medium">
          Live music ∙ Beach parties ∙ Local cuisine ∙ Family activities
        </p>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4">
        <Button
          onClick={handleViewDetails}
          variant="outline"
          size="sm"
          className="w-full border-2 border-diani-teal-500 text-diani-teal-500 hover:bg-diani-teal-50 rounded-md h-8 text-xs font-medium font-['Montserrat'] transition-all duration-200"
        >
          <ExternalLink size={12} className="mr-1" />
          View Details & Tickets
        </Button>
      </div>

      {/* Ticket info */}
      <div className="px-4 pb-3 border-t border-diani-sand-200 pt-2">
        <p className="text-xs text-diani-sand-600 text-center">
          Phase 3 Weekend Pass - KSH 5,500 (Last tickets available!)
        </p>
      </div>
    </div>
  );
};