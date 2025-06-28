import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SummerTidesEventCardProps {
  className?: string;
}

export const SummerTidesEventCard: React.FC<SummerTidesEventCardProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Event dates - Updated to match flyer (July 4 & 5)
  const eventStartDate = new Date('2025-07-04');
  const eventEndDate = new Date('2025-07-05');
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
      "relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02]",
      isClosing && "opacity-0 transform scale-95",
      className
    )}>
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-200 backdrop-blur-sm"
        aria-label="Close event card"
      >
        <X size={16} className="text-white" />
      </button>

      {/* Background Pattern - Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-2 right-8 w-16 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-80 transform rotate-12"></div>
        <div className="absolute top-6 right-20 w-12 h-6 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full opacity-60 transform -rotate-6"></div>
        <div className="absolute top-1 right-32 w-10 h-5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-70 transform rotate-45"></div>
        
        <div className="absolute top-4 left-8 w-14 h-7 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-75 transform -rotate-12"></div>
        <div className="absolute top-8 left-20 w-10 h-5 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full opacity-55 transform rotate-6"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl tracking-wider mb-1 drop-shadow-lg" 
              style={{ fontFamily: 'Impact, Arial Black, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            SUMMER TIDES
          </h1>
          <div className="flex items-center justify-center gap-2 text-white text-sm sm:text-base font-semibold mb-2">
            <MapPin size={16} className="flex-shrink-0" />
            <span>DIANI, KENYA</span>
          </div>
        </div>

        {/* Date and Details */}
        <div className="text-center mb-4">
          <div className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mb-2 drop-shadow-lg"
               style={{ fontFamily: 'Impact, Arial Black, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            JULY 4 & 5
          </div>
          <div className="text-white text-lg sm:text-xl font-bold tracking-wide">
            2 STAGES | 2 NIGHTS
          </div>
        </div>

        {/* Activities */}
        <div className="text-center mb-4">
          <p className="text-white text-sm sm:text-base font-medium opacity-95">
            🎵 Live Music ∙ 🏖️ Beach Parties ∙ 🍽️ Local Cuisine ∙ 👨‍👩‍👧‍👦 Family Activities
          </p>
        </div>

        {/* Decorative Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 400 64" preserveAspectRatio="none">
            <path d="M0,32 Q100,16 200,32 T400,32 L400,64 L0,64 Z" 
                  fill="rgba(255,255,255,0.1)" />
            <path d="M0,40 Q100,24 200,40 T400,40 L400,64 L0,64 Z" 
                  fill="rgba(255,255,255,0.05)" />
          </svg>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 space-y-3">
          <Button
            onClick={handleViewDetails}
            className="w-full bg-white text-red-600 hover:bg-red-50 font-bold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <ExternalLink size={16} className="mr-2" />
            Get Your Tickets Now
          </Button>
          
          {/* Ticket info */}
          <div className="text-center">
            <p className="text-white text-xs sm:text-sm font-medium bg-black/20 rounded-full px-3 py-1 inline-block backdrop-blur-sm">
              Phase 3 Weekend Pass - KSH 5,500 (Last tickets available!)
            </p>
          </div>
        </div>
      </div>

      {/* Palm Tree Silhouette (Bottom Left) */}
      <div className="absolute bottom-0 left-0 w-16 h-20 opacity-30">
        <svg viewBox="0 0 64 80" className="w-full h-full">
          <path d="M32 80 L32 40 M20 45 Q32 35 44 45 M18 50 Q32 40 46 50 M16 55 Q32 45 48 55" 
                stroke="rgba(0,0,0,0.6)" strokeWidth="2" fill="none"/>
          <circle cx="32" cy="40" r="3" fill="rgba(0,0,0,0.6)"/>
        </svg>
      </div>

      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .text-4xl { font-size: 1.875rem; }
          .text-5xl { font-size: 2.25rem; }
        }
        @media (max-width: 480px) {
          .text-3xl { font-size: 1.5rem; }
          .text-4xl { font-size: 1.75rem; }
        }
      `}</style>
    </div>
  );
};