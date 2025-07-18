import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import { cn } from '@/lib/utils';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, isOffline } = useOffline();

  if (isOnline) return null;

  return (
    <div className={cn(
      "fixed top-16 left-1/2 transform -translate-x-1/2 z-50",
      "bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg",
      "flex items-center gap-2 text-sm font-medium",
      "animate-slide-in-top"
    )}>
      <WifiOff size={16} />
      <span>You're offline</span>
    </div>
  );
};

interface InstallPromptProps {
  className?: string;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ className }) => {
  const { canInstall, triggerInstall } = useOffline();

  if (!canInstall) return null;

  return (
    <div className={cn(
      "bg-diani-teal-50 border border-diani-teal-200 rounded-lg p-4",
      "flex items-center justify-between",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-diani-teal-500 rounded-full flex items-center justify-center">
          <Wifi className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-diani-sand-900">Install Discover Diani</h3>
          <p className="text-sm text-diani-sand-600">
            Get the app for faster access and offline features
          </p>
        </div>
      </div>
      <button
        onClick={triggerInstall}
        className="bg-diani-teal-500 hover:bg-diani-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Install
      </button>
    </div>
  );
};