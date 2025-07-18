import { useState, useEffect } from 'react';
import { offlineService } from '@/services/offlineService';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(offlineService.getOnlineStatus());

  useEffect(() => {
    const unsubscribe = offlineService.addListener((online) => {
      setIsOnline(online);
    });

    return unsubscribe;
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    storeForSync: offlineService.storeForSync.bind(offlineService),
    getSyncData: offlineService.getSyncData.bind(offlineService),
    clearSyncData: offlineService.clearSyncData.bind(offlineService),
    canInstall: offlineService.canInstall(),
    triggerInstall: offlineService.triggerInstall.bind(offlineService),
  };
};