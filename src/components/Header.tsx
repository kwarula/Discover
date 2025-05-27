
import React from 'react';
import { User, MessageCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const { isLoggedIn, userProfile, setIsLoginModalOpen, setIsProfileModalOpen } = useAppContext();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-diani-sand-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-diani-teal-500 to-diani-teal-700 rounded-lg flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold font-sohne text-diani-sand-900">
            Discover Diani
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileModalOpen(true)}
              className="text-diani-sand-700 hover:text-diani-teal-700 hover:bg-diani-sand-50"
            >
              <User size={16} className="mr-2" />
              {userProfile?.username || 'Profile'}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-diani-sand-700 hover:text-diani-teal-700 hover:bg-diani-sand-50"
            >
              <User size={16} className="mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
