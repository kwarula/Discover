// Offline service for managing offline functionality
export class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = navigator.onLine;
  private listeners: Array<(isOnline: boolean) => void> = [];

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
      this.handleOffline();
    });
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  private handleOnline() {
    console.log('App is back online');
    // Trigger background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('sync-feedback');
      }).catch(error => {
        console.error('Background sync registration failed:', error);
      });
    }
  }

  private handleOffline() {
    console.log('App is offline');
    // Show offline notification
    this.showOfflineNotification();
  }

  private showOfflineNotification() {
    // You can integrate this with your toast system
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('show-offline-toast', {
        detail: {
          title: 'You\'re offline',
          description: 'Some features may be limited. We\'ll sync your data when you\'re back online.',
        }
      }));
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public addListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Store data for offline sync
  public async storeForSync(key: string, data: any): Promise<void> {
    try {
      const stored = localStorage.getItem('diani-offline-sync') || '{}';
      const syncData = JSON.parse(stored);
      
      if (!syncData[key]) {
        syncData[key] = [];
      }
      
      syncData[key].push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      });
      
      localStorage.setItem('diani-offline-sync', JSON.stringify(syncData));
    } catch (error) {
      console.error('Failed to store data for sync:', error);
    }
  }

  // Get stored sync data
  public async getSyncData(key: string): Promise<any[]> {
    try {
      const stored = localStorage.getItem('diani-offline-sync') || '{}';
      const syncData = JSON.parse(stored);
      return syncData[key] || [];
    } catch (error) {
      console.error('Failed to get sync data:', error);
      return [];
    }
  }

  // Clear synced data
  public async clearSyncData(key: string): Promise<void> {
    try {
      const stored = localStorage.getItem('diani-offline-sync') || '{}';
      const syncData = JSON.parse(stored);
      delete syncData[key];
      localStorage.setItem('diani-offline-sync', JSON.stringify(syncData));
    } catch (error) {
      console.error('Failed to clear sync data:', error);
    }
  }

  // Check if app can be installed
  public canInstall(): boolean {
    return 'beforeinstallprompt' in window;
  }

  // Trigger PWA install
  public triggerInstall(): void {
    if ((window as any).triggerPWAInstall) {
      (window as any).triggerPWAInstall();
    }
  }
}

// Export singleton instance
export const offlineService = OfflineService.getInstance();