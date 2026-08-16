// VexLap ID Maker — Service Worker
// Everything the app needs (Tailwind, Font Awesome, Cairo font, xlsx,
// jszip, FileSaver) is now vendored locally — nothing is loaded from a
// CDN. The install step below force-downloads and caches every one of
// these files the first time the app is opened (online), so all later
// visits — including fully offline ones — work without internet.

const CACHE_VERSION = 'vexlap-id-maker-v18';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',

  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',

  './assets/logo-icon.png',
  './assets/logo-full.png',

  './vendor/tailwind.css',
  './vendor/xlsx.full.min.js',
  './vendor/jszip.min.js',
  './vendor/FileSaver.min.js',
  './vendor/jspdf.umd.min.js',
  './vendor/tracking/tracking-min.js',
  './vendor/tracking/face-min.js',

  './vendor/fontawesome/css/all.min.css',
  './vendor/fontawesome/webfonts/fa-brands-400.ttf',
  './vendor/fontawesome/webfonts/fa-brands-400.woff2',
  './vendor/fontawesome/webfonts/fa-regular-400.ttf',
  './vendor/fontawesome/webfonts/fa-regular-400.woff2',
  './vendor/fontawesome/webfonts/fa-solid-900.ttf',
  './vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './vendor/fontawesome/webfonts/fa-v4compatibility.ttf',
  './vendor/fontawesome/webfonts/fa-v4compatibility.woff2',

  './vendor/fonts/cairo.css',
  './vendor/fonts/cairo-files/cairo-arabic-400-normal.woff',
  './vendor/fonts/cairo-files/cairo-arabic-400-normal.woff2',
  './vendor/fonts/cairo-files/cairo-arabic-600-normal.woff',
  './vendor/fonts/cairo-files/cairo-arabic-600-normal.woff2',
  './vendor/fonts/cairo-files/cairo-arabic-700-normal.woff',
  './vendor/fonts/cairo-files/cairo-arabic-700-normal.woff2',
  './vendor/fonts/cairo-files/cairo-arabic-900-normal.woff',
  './vendor/fonts/cairo-files/cairo-arabic-900-normal.woff2',
  './vendor/fonts/cairo-files/cairo-latin-400-normal.woff',
  './vendor/fonts/cairo-files/cairo-latin-400-normal.woff2',
  './vendor/fonts/cairo-files/cairo-latin-600-normal.woff',
  './vendor/fonts/cairo-files/cairo-latin-600-normal.woff2',
  './vendor/fonts/cairo-files/cairo-latin-700-normal.woff',
  './vendor/fonts/cairo-files/cairo-latin-700-normal.woff2',
  './vendor/fonts/cairo-files/cairo-latin-900-normal.woff',
  './vendor/fonts/cairo-files/cairo-latin-900-normal.woff2',

  './vendor/fonts/extra.css',
  './vendor/fonts/extra-files/tajawal-arabic-400-normal.woff2',
  './vendor/fonts/extra-files/tajawal-arabic-700-normal.woff2',
  './vendor/fonts/extra-files/tajawal-latin-400-normal.woff2',
  './vendor/fonts/extra-files/tajawal-latin-700-normal.woff2',
  './vendor/fonts/extra-files/almarai-arabic-400-normal.woff2',
  './vendor/fonts/extra-files/almarai-arabic-700-normal.woff2',
  './vendor/fonts/extra-files/almarai-latin-400-normal.woff2',
  './vendor/fonts/extra-files/almarai-latin-700-normal.woff2',
  './vendor/fonts/extra-files/amiri-arabic-400-normal.woff2',
  './vendor/fonts/extra-files/amiri-arabic-700-normal.woff2',
  './vendor/fonts/extra-files/amiri-latin-400-normal.woff2',
  './vendor/fonts/extra-files/amiri-latin-700-normal.woff2',
  './vendor/fonts/extra-files/changa-arabic-400-normal.woff2',
  './vendor/fonts/extra-files/changa-arabic-700-normal.woff2',
  './vendor/fonts/extra-files/changa-latin-400-normal.woff2',
  './vendor/fonts/extra-files/changa-latin-700-normal.woff2',
  './vendor/fonts/extra-files/montserrat-latin-400-normal.woff2',
  './vendor/fonts/extra-files/montserrat-latin-700-normal.woff2',
  './vendor/fonts/extra-files/poppins-latin-400-normal.woff2',
  './vendor/fonts/extra-files/poppins-latin-700-normal.woff2',
  './vendor/fonts/extra-files/playfair-display-latin-400-normal.woff2',
  './vendor/fonts/extra-files/playfair-display-latin-700-normal.woff2',
  './vendor/fonts/extra-files/roboto-latin-400-normal.woff2',
  './vendor/fonts/extra-files/roboto-latin-700-normal.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Cache-first: everything the app needs is already precached above,
  // so this works fully offline. Anything not precached still falls
  // back to the network and gets cached for next time.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => cached);
    })
  );
});
