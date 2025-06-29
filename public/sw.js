/* eslint-env serviceworker */

// https://developer.chrome.com/docs/workbox/caching-strategies-overview#network_first_falling_back_to_cache

const cacheName = 'writing-trainer-v1';

self.addEventListener('install', function () {
  console.log('Hello world from the Service Worker 🤙');
});

console.log('debug: sw.js: Loaded');

self.addEventListener('fetch', async (event) => {
  if (
    event.request.url.includes('/api') ||
    event.request.url.includes('/graphql') ||
    event.request.url.includes('/webpack-hmr') ||
    event.request.url.includes('chrome-extension') ||
    event.request.url.includes('sw.js')
  ) {
    return;
  }

  // This is the chunk format which is used in the dictionaries
  if (/\/[0-9]{3}\.[a-z0-9]/.test(event.request.url)) {
    console.log('Trying cached chunk', event.request.url);

    const cached = await caches.match(event.request.url).catch(() => null);

    if (cached) {
      event.respondWith(cached);

      return;
    }
  }

  event.respondWith(
    caches.open(cacheName).then((cache) => {
      return fetch(event.request.url)
        .then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone());

          return fetchedResponse;
        })
        .catch(() => cache.match(event.request.url));
    }),
  );
});
