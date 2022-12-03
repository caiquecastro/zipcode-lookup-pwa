// Use a cacheName for cache versioning
const cacheName = 'v1:static';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
    console.log("Install");
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                './',
                './style.css',
                './script.js',
            ]).then(function() {
                console.log("Skip waiting");
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log("Fetch", event);
    // … either respond with the cached object or go ahead and fetch the actual URL
    event.respondWith(
        caches.match(event.request).then(function(response) {
            console.log("Cache match for ", event.request.url, response)
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});