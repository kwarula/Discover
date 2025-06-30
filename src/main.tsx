import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('SW registered: ', registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              console.log('New service worker available');
              
              // Optionally show update notification to user
              if (window.confirm('A new version is available. Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });
      
      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('Service worker updated');
        }
      });
      
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  });
}

// Handle app install prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt available');
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Optionally show your own install button
  showInstallButton();
});

// Function to show install button (you can customize this)
function showInstallButton() {
  // You could show a custom install button in your UI
  console.log('App can be installed');
}

// Handle successful app install
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed');
  // Hide install button if shown
  hideInstallButton();
});

function hideInstallButton() {
  // Hide your custom install button
  console.log('Hiding install button');
}

// Export function to trigger install (can be called from components)
(window as any).triggerPWAInstall = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  }
};

createRoot(document.getElementById("root")!).render(<App />);
