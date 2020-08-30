const CACHE_NAME = "webPWA";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/manifest.json",
  "/pages/blog.html",
  "/pages/contact.html",
  "/pages/home.html",
  "/pages/portfolio.html",
  "/css/materialize.css",
  "/css/materialize.min.css",
  "/css/style.css",
  "/fonts/DMSans-Regular.ttf",
  "/fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "/js/jquery-3.2.1.min.js",
  "/js/materialize.min.js",
  "/js/materialize.js",
  "/js/script.js",
  "/js/sw.js",
  "/images/icon.png",
  "/images/bg-banner1.jpg",
  "/images/bg-banner2.jpg",
  "/images/blog1.jpg",
  "/images/portfolio-1.jpg",
  "/images/portfolio-2.jpg",
  "/images/portfolio-3.jpg",
  "/images/portfolio-4.jpg",
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches
        .match(event.request, { cacheName: CACHE_NAME })
        .then(function(response) {
          if (response) {
            console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
            return response;
          }
   
          console.log(
            "ServiceWorker: Memuat aset dari server: ",
            event.request.url
          );
          return fetch(event.request);
        })
    );
  });
  
  self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });