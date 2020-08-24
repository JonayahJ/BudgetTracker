// Uncomment the lines below
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    // '/models/transaction.js',
    // '/routes/api.js',
    '/app.js',
    '/service-worker.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ];
  
  const CACHE_NAME = "static-cache-v2";
  
  // INSTALL the event listener to the cache
  self.addEventListener('install', function(evt) {
      evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
          console.log("Your files were pre-cached successfully!");
          return cache.addAll(FILES_TO_CACHE);
        })
      );
  
      self.skipWaiting();
    });
  
  // REMOVING OLD DATA
  self.addEventListener("activate", function(evt) {
      evt.waitUntil(
        caches.keys().then(keyList => {
          return Promise.all(
            keyList.map(key => {
              if (key !== CACHE_NAME) {
                console.log("Removing old cache data", key);
                return caches.delete(key);
              }
            })
          );
        })
      );
  
      self.clients.claim();
    });
  
  
  // FETCH req
  self.addEventListener('fetch', function(evt) {
    // if the request is not for the API, serve static assets using "offline-first" approach.
    // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
    evt.respondWith(
      caches.match(evt.request).then(function(response) {
        return response || fetch(evt.request);
      })
    );
  });
  