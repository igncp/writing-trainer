/* eslint-env serviceworker */

// https://developer.chrome.com/docs/workbox/caching-strategies-overview#network_first_falling_back_to_cache

const cacheName = 'writing-trainer-v1'

self.addEventListener('install', function () {
  console.log('Hello world from the Service Worker 🤙')
})

console.log('debug: sw.js: Loaded')

self.addEventListener('fetch', event => {
  if (
    event.request.url.includes('/api') ||
    event.request.url.includes('/graphql') ||
    event.request.url.includes('/webpack-hmr') ||
    event.request.url.includes('chrome-extension') ||
    event.request.url.includes('sw.js')
  ) {
    return
  }

  event.respondWith(
    caches.open(cacheName).then(cache => {
      return fetch(event.request.url)
        .then(fetchedResponse => {
          cache.put(event.request, fetchedResponse.clone())

          return fetchedResponse
        })
        .catch(() => cache.match(event.request.url))
    }),
  )
})
