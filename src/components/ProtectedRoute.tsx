import React, { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, setIsLoginModalOpen } = useAppContext();

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, [isLoggedIn, setIsLoginModalOpen]);

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-diani-teal-50 via-coral-sunset-50 to-diani-sand-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-diani-teal-500 mx-auto mb-4"></div>
            <p className="text-diani-sand-700">Please sign up to continue...</p>
          </div>
        </div>
        <AuthModal />
      </>
    );
  }

  return <>{children}</>;
};
