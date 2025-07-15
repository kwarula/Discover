import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const InstallPWAButton: React.FC = () => {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallable(true);
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) {
      return;
    }
    promptEvent.prompt();
    promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      (window as any).deferredPrompt = null;
      setInstallable(false);
    });
  };

  if (!installable) {
    return null;
  }

  return (
    <Button onClick={handleInstallClick} variant="outline" size="sm">
      Install App
    </Button>
  );
};

export default InstallPWAButton;
