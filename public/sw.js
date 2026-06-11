const CACHE_NAME = 'input-app-v1';
const INPUT_APP_ASSETS = [
  '/inputApp/index.html',
  '/inputApp/form.html',
  '/inputApp/records.html',
  '/inputApp/style.css',
  '/inputApp/icon.png',
  '/inputApp/manifest.json',
  '/inputApp/js/provinces.js',
  '/inputApp/js/tables.js',
  '/inputApp/js/app.js',
  '/inputApp/js/offline.js',
  '/inputApp/js/sw-register.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const asset of INPUT_APP_ASSETS) {
        try {
          await cache.add(asset);
        } catch (error) {
        }
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== 'google-fonts') {
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;

  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open('google-fonts').then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  if (url.pathname.startsWith('/inputApp/')) {
    event.respondWith(
      caches.match(url.pathname).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(url.pathname, responseToCache);
            });
          }
          return networkResponse;
        }).catch((error) => {
          return caches.match('/inputApp/index.html');
        });
      })
    );
    return;
  }

  event.respondWith(fetch(event.request));
});
