"use strict";
const cacheName = 'mushinako-err-prop-v1.1.0';
const filesToCache = [
    'index.html',
    'css/common.css',
    'css/index.css',
    'images/icons/icon-96x96.png',
    'images/icons/icon-144x144.png',
    'images/icons/icon-192x192.png',
    'images/icons/icon-512x512.png',
    'js/calc.js',
    'js/index.js',
    'js/MathJax-loader.js',
    'js/pwa.js',
    // 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    // 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    // 'https://polyfill.io/v3/polyfill.min.js?features=es6',
    // 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(filesToCache.map((url) => new Request(url, {
                mode: 'no-cors'
            }))).then(() => {
                console.log('[ServiceWorker] Request finished!');
            });
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log(`[ServiceWorker] Removing old cache ${key}`);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            return r || fetch(e.request, {
                mode: 'no-cors'
            }).then((res) => {
                return caches.open(cacheName).then((cache) => {
                    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                    cache.put(e.request, res.clone());
                    return res;
                });
            });
        })
    );
});