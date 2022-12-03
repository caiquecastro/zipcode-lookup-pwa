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
        fetch(event.request)
        .catch(error => {
            console.log("Error to fetch, fallback to cache", error);
            return caches.match(event.request);
        })
    );
});