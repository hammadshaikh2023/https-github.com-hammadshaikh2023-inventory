// A more descriptive name for the static cache.
const STATIC_CACHE_NAME = 'bws-static-cache-v5';
// A more descriptive name for the data/dynamic content cache.
const DATA_CACHE_NAME = 'bws-data-cache-v4';

// List of files that make up the "app shell" and should be cached on install.
// This ensures the app can load offline.
const urlsToCache = [
  './', // The root of the app
  './index.html',
  './index.tsx', // The main JS entry point
  './manifest.json',
  'https://cdn.tailwindcss.com',
  // Key dependencies from esm.sh for basic offline functionality
  "https://esm.sh/react@18.2.0",
  "https://esm.sh/react@18.2.0/jsx-runtime",
  "https://esm.sh/react-dom@18.2.0",
  "https://esm.sh/react-dom@18.2.0/client",
  "https://esm.sh/react-router-dom@6.23.1?deps=react@18.2.0",
  "https://esm.sh/recharts@2.12.7?deps=react@18.2.0",
];

// Install event: Pre-cache the application shell.
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell and core assets.');
        // Use { cache: 'reload' } to bypass browser cache and fetch fresh assets from network during install.
        const requests = urlsToCache.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
      .then(() => {
        console.log('Service Worker: Installation complete.');
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
  );
});

// Activate event: Clean up old caches and take control of the page.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [STATIC_CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete, now controlling the page.');
      // Take control of all open clients without waiting for a reload.
      return self.clients.claim();
    })
  );
});

// Fetch event: Intercept network requests and apply caching strategies.
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy for Navigation requests (e.g., loading the main HTML page)
  // Use Network-First to ensure the user gets the latest app shell,
  // but fall back to the cached index.html for offline access.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try to fetch from the network first.
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch (error) {
          // If network fails, serve the cached app shell.
          console.log('Network request for navigation failed, serving cached index.html.');
          const cache = await caches.open(STATIC_CACHE_NAME);
          return await cache.match('./'); // Serve the root page
        }
      })()
    );
    return;
  }
  
  // Strategy for app shell and core assets (local JS/CSS, CDN libs).
  // Use Cache-First: Serve from the cache immediately for performance.
  // These assets are updated when the service worker itself updates.
  if (url.origin === self.location.origin || url.origin === 'https://cdn.tailwindcss.com' || url.origin.startsWith('https://esm.sh')) {
     event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(networkResponse => {
          // Optionally, cache newly encountered static assets on the fly.
          // This can be useful for assets not in the initial precache list.
          if (networkResponse.ok) {
             caches.open(STATIC_CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone());
             });
          }
          return networkResponse;
        });
      })
    );
    return;
  }
  
  // Strategy for all other requests (dynamic data, images, APIs).
  // Use Network-First, falling back to cache: Ensures data is as fresh as possible,
  // but provides a seamless offline experience with previously cached data.
  event.respondWith(
    (async () => {
      const cache = await caches.open(DATA_CACHE_NAME);
      try {
        const networkResponse = await fetch(request);
        // If the fetch is successful, update the cache and return the response.
        if (networkResponse.ok) {
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // If the network request fails, try to serve from the cache.
        console.log('Network request failed, attempting to serve from cache for:', request.url);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If it's not in the cache either, the browser will handle the error.
        // A custom offline fallback could be returned here if desired.
        console.warn('Request failed, and no cache fallback was available for:', request.url);
      }
    })()
  );
});


// Push event for notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'BWS Inventory Alert', body: 'A low stock warning was triggered.' };
  
  const options = {
    body: data.body,
    icon: 'https://picsum.photos/192',
    badge: 'https://picsum.photos/192',
    data: { url: self.registration.scope + '#/inventory' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});