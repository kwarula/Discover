
import React from 'react';
import { User } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { WeatherWidget } from '@/components/WeatherWidget';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header: React.FC = () => {
  const { isLoggedIn, userProfile, setIsLoginModalOpen, setIsProfileModalOpen } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <header className="glass border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center flex-shrink-0">
          <img 
            src="/discover_diani_website_logo.png" 
            alt="Discover Diani Logo" 
            className={`w-auto hover:scale-105 transition-transform ${
              isMobile ? 'h-8 sm:h-10' : 'h-12'
            }`}
          />
        </div>
        
        <div className={`flex items-center ${
          isMobile ? 'gap-1 sm:gap-2' : 'gap-3'
        }`}>
          <div className="hidden xs:block">
            <WeatherWidget />
          </div>
          <LanguageSelector />
          {isLoggedIn ? (
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "sm"}
              onClick={() => setIsProfileModalOpen(true)}
              className="text-diani-sand-700 hover:text-diani-teal-700 hover:bg-white/50 transition-all px-2 sm:px-3"
            >
              <User size={isMobile ? 14 : 16} className={isMobile ? "" : "mr-2"} />
              <span className="hidden sm:inline ml-1 sm:ml-0">
                {userProfile?.username || 'Profile'}
              </span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "sm"}
              onClick={() => setIsLoginModalOpen(true)}
              className="text-diani-sand-700 hover:text-diani-teal-700 hover:bg-white/50 transition-all px-2 sm:px-3"
            >
              <User size={isMobile ? 14 : 16} className={isMobile ? "" : "mr-2"} />
              <span className="hidden sm:inline ml-1 sm:ml-0">
                Sign In
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
