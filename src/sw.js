/* eslint-disable */
workbox.skipWaiting();
workbox.clientsClaim();
workbox.googleAnalytics.initialize();

// Precache entries from workbox-build or somewhere else
workbox.precaching.precache([
  {
    url: '/index.html',
    revision: 'index-main'
  },
  {
    url: '/zh/index.html',
    revision: 'index-zh'
  }
]);

// Cache css files
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-valley'
  }),
  'GET'
);

// Cache image files
workbox.routing.registerRoute(
  /.*\.(?:png|jpe?g|svg|gif|webp|ico)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    cacheName: 'image-valley',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  }),
  'GET'
);

// Cache tool files
workbox.routing.registerRoute(
  /.*\.json/,
  workbox.strategies.cacheFirst({
    cacheName: 'tool-valley',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache for a maximum of a day
        maxAgeSeconds: 24 * 60 * 60
      })
    ]
  }),
  'GET'
);

workbox.routing.registerRoute(
  /valleyease.me/,
  workbox.strategies.cacheFirst({
    cacheName: 'document-valley',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 24 * 60 * 60
      })
    ]
  }),
  'GET'
);

workbox.precaching.precacheAndRoute(self.__precacheManifest);
