const CACHE_NAME = 'na-midia-v1';
const STATIC_CACHE = 'na-midia-static-v1';
const DYNAMIC_CACHE = 'na-midia-dynamic-v1';

// Arquivos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logotiponamidiavetorizado.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Fetch Strategy: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip API calls and Supabase requests (always fresh)
  if (
    request.url.includes('/api/') ||
    request.url.includes('supabase.co') ||
    request.url.includes('onesignal.com')
  ) {
    return;
  }
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone response for cache
        const responseClone = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline page if available
          return caches.match('/');
        });
      })
  );
});

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'sync-confirmations') {
    event.waitUntil(
      // Sync confirmation data when back online
      syncConfirmations()
    );
  }
});

// Push Notifications (OneSignal will handle this, but we can intercept)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Novo evento disponível!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
      },
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Na Mídia', options)
    );
  }
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Helper function for syncing confirmations
async function syncConfirmations() {
  // This would sync any pending confirmations stored in IndexedDB
  console.log('[ServiceWorker] Syncing confirmations...');
  // Implementation would go here
}
