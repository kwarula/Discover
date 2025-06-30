const CACHE_NAME = 'discover-diani-v1.0.0';
const OFFLINE_CACHE = 'discover-diani-offline-v1.0.0';
const RUNTIME_CACHE = 'discover-diani-runtime-v1.0.0';

// Assets to cache immediately (App Shell)
const STATIC_ASSETS = [
  '/',
  '/chat',
  '/info',
  '/index.html',
  '/manifest.json',
  '/Discover Diani.png',
  '/discover_diani_website_logo.png',
  // Add other critical assets that are always needed
];

// Runtime cache patterns
const RUNTIME_CACHE_PATTERNS = [
  // Cache API responses
  /^https:\/\/.*\.supabase\.co\/functions\/v1\//,
  // Cache external images
  /^https:\/\/images\.pexels\.com\//,
  /^https:\/\/images\.unsplash\.com\//,
  /^https:\/\/res\.cloudinary\.com\//,
  // Cache Google Fonts
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//,
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /^https:\/\/.*\.supabase\.co\/functions\/v1\/chat-proxy/,
  /^https:\/\/.*\.supabase\.co\/functions\/v1\/feedback/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== OFFLINE_CACHE && 
                cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Network-first strategy for critical API calls
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href))) {
      return await networkFirst(request);
    }
    
    // Cache-first strategy for static assets
    if (url.origin === self.location.origin) {
      return await cacheFirst(request);
    }
    
    // Stale-while-revalidate for runtime cacheable resources
    if (RUNTIME_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: try network, fallback to cache
    return await networkFirst(request);
    
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return await getOfflineFallback(request);
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return await getOfflineFallback(request);
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return await getOfflineFallback(request);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cache
    return cachedResponse;
  });
  
  // Return cached version immediately if available
  return cachedResponse || fetchPromise;
}

// Offline fallback
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For navigation requests, return cached index.html
  if (request.mode === 'navigate') {
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // For API requests, return offline message
  if (url.pathname.includes('/functions/v1/')) {
    return new Response(
      JSON.stringify({
        text: "I'm currently offline, but I can still help with general information about Diani Beach! The area is famous for its pristine white sand beaches, crystal-clear waters, and vibrant coral reefs. When you're back online, I'll have access to real-time recommendations for hotels, restaurants, and activities.",
        offline: true
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  // For images, return a placeholder or cached version
  if (request.destination === 'image') {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a simple SVG placeholder
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">
          Image unavailable offline
        </text>
      </svg>`,
      {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      }
    );
  }
  
  // Default fallback
  return new Response('Offline', { status: 503 });
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-feedback') {
    event.waitUntil(syncFeedback());
  }
});

// Sync stored feedback when online
async function syncFeedback() {
  try {
    // This would integrate with your feedback service
    console.log('[SW] Syncing offline feedback...');
    
    // Get stored feedback from IndexedDB or localStorage
    const storedFeedback = await getStoredFeedback();
    
    if (storedFeedback.length > 0) {
      for (const feedback of storedFeedback) {
        try {
          await fetch('/functions/v1/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedback),
          });
        } catch (error) {
          console.error('[SW] Failed to sync feedback:', error);
        }
      }
      
      // Clear synced feedback
      await clearStoredFeedback();
      console.log('[SW] Feedback synced successfully');
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Helper functions for feedback storage (simplified)
async function getStoredFeedback() {
  // In a real implementation, you'd use IndexedDB
  try {
    const stored = localStorage.getItem('diani-offline-feedback');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

async function clearStoredFeedback() {
  try {
    localStorage.removeItem('diani-offline-feedback');
  } catch (error) {
    console.error('[SW] Failed to clear stored feedback:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Discover Diani', {
        body: data.body || 'New update available',
        icon: '/Discover Diani.png',
        badge: '/Discover Diani.png',
        tag: 'discover-diani-notification',
        requireInteraction: false,
        actions: [
          {
            action: 'open',
            title: 'Open App'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[SW] Service worker script loaded');