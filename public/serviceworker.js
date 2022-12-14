// Use a cacheName for cache versioning
const CACHE_NAME = 'v2';

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const shouldCacheRequest = (request) => {
  const isApiRequest = request.url.includes('https://brasilapi.com.br');
  const assetsRequest = request.url.includes('/assets/index');

  return isApiRequest || assetsRequest;
};

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function (e) {
  console.log('Install');
  // Once the service worker is installed, fetch the resources to make this work offline.
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
      ]).then(function () {
        console.log('Skip waiting');
        self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('activate', event);
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        console.log({ key });
        if (!cacheAllowlist.includes(key)) {
          console.log(`Delete cache key: ${key}`);
          return caches.delete(key);
        }

        return Promise.resolve(true);
      })
    )).then(() => {
      console.log('Service worker is ready to handle fetches');
    })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('Fetch', event);
  // … either respond with the cached object or go ahead and fetch the actual URL
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (shouldCacheRequest(event.request)) {
          putInCache(event.request, response.clone());
        }

        return response;
      })
      .catch(error => {
        console.log('Error to fetch, fallback to cache', error);
        return caches.match(event.request);
      })
  );
});
