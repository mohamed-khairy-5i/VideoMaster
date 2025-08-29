// Enhanced Service Worker for VidCatch Pro
// Advanced caching and performance optimization

const CACHE_NAME = 'vidcatch-pro-v1.2.0';
const STATIC_CACHE_NAME = 'vidcatch-static-v1.2.0';
const DYNAMIC_CACHE_NAME = 'vidcatch-dynamic-v1.2.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Critical assets will be added during build
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/api/',
  '/.netlify/functions/',
];

// Cache-first resources (try cache first, fallback to network)
const CACHE_FIRST = [
  '/assets/',
  '.js',
  '.css',
  '.woff2',
  '.woff',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg'
];

// Stale-while-revalidate resources
const STALE_WHILE_REVALIDATE = [
  '/pages/',
  '/components/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Determine caching strategy based on URL
  if (shouldUseNetworkFirst(request.url)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (shouldUseCacheFirst(request.url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (shouldUseStaleWhileRevalidate(request.url)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    // Default: Network first for HTML, Cache first for assets
    if (request.destination === 'document') {
      event.respondWith(networkFirstStrategy(request));
    } else {
      event.respondWith(cacheFirstStrategy(request));
    }
  }
});

// Strategy implementations
async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for documents
    if (request.destination === 'document') {
      return caches.match('/offline.html') || 
             new Response('Offline - Please check your internet connection', {
               status: 503,
               statusText: 'Service Unavailable'
             });
    }
    
    throw error;
  }
}

async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback to network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Both cache and network failed for:', request.url);
    throw error;
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  // Get from cache immediately
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('Service Worker: Background fetch failed:', error);
  });
  
  // Return cached version if available, otherwise wait for network
  return cachedResponse || networkResponsePromise;
}

// Helper functions to determine caching strategy
function shouldUseNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function shouldUseCacheFirst(url) {
  return CACHE_FIRST.some(pattern => url.includes(pattern));
}

function shouldUseStaleWhileRevalidate(url) {
  return STALE_WHILE_REVALIDATE.some(pattern => url.includes(pattern));
}

// Background sync for failed requests (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      console.log('Service Worker: Background sync triggered');
      event.waitUntil(handleBackgroundSync());
    }
  });
}

async function handleBackgroundSync() {
  // Handle failed requests when back online
  // This could include retry failed video info requests
  console.log('Service Worker: Handling background sync');
}

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: data.tag || 'vidcatch-notification',
      requireInteraction: true,
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'VidCatch Pro', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.openWindow('/')
  );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'GET_CACHE_SIZE':
        getCacheSize().then(size => {
          event.ports[0].postMessage({ cacheSize: size });
        });
        break;
        
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
        
      default:
        console.log('Service Worker: Unknown message type:', event.data.type);
    }
  }
});

// Utility functions
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

console.log('Service Worker: Script loaded successfully');