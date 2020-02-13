"use strict";
const cacheName = 'mushinako-err-prop-v1.1.2';
const filesToCache = [
    'index.html',
    'css/common.css',
    'css/index.css',
    'images/icons/icon-512x512.png',
    'images/icons/icon-768x768.png',
    'images/icons/icon-1000x1000.png',
    'images/icons/icon-2000x2000.png',
    'js/calc.js',
    'js/index.js',
    'js/MathJax-loader.js',
    'js/pwa.js',
    'lib/materialize.min.css',
    'lib/materialize.min.js',
    'lib/tex-chtml.js',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(filesToCache);
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
            return r || fetch(e.request).then((res) => {
                return caches.open(cacheName).then((cache) => {
                    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                    cache.put(e.request, res.clone());
                    return res;
                });
            });
        })
    );
});