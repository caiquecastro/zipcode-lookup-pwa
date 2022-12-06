// Use a cacheName for cache versioning
const cacheName = 'v1:static';

const putInCache = async (request, response) => {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
};

const shouldCacheRequest = (request) => {
    return request.url.includes("https://brasilapi.com.br");
}

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener("install", function(e) {
    console.log("Install");
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll([
                "./",
                "./manifest.json",
                //'./style.css',
                //'./script.js',
            ]).then(function() {
                console.log("Skip waiting");
                //self.skipWaiting();
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log("Fetch", event);
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
            console.log("Error to fetch, fallback to cache", error);
            return caches.match(event.request);
        })
    );
});