"use strict";
const cacheName = 'commit-86';
const filesToCache = [
    'index.html',
    'css/index.css',
    'images/icons/icon-96x96.png',
    'images/icons/icon-144x144.png',
    'images/icons/icon-192x192.png',
    'images/icons/icon-256x256.png',
    'images/icons/icon-512x512.png',
    'js/index.js',
    'js/prop/prop-main.js',
    'js/prop/prop-method.js',
    'js/prop/prop-input.js',
    'js/prop/prop-calc.js',
    'js/stat/stat-main.js',
    'js/stat/stat-input.js',
    'js/stat/stat-calc.js',
    'js/lreg/lreg-main.js',
    'js/lreg/lreg-calc.js',
    'js/MathJax-loader.js',
    'js/pwa.js',
    'lib/jstat.min.js',
    'lib/materialize.min.css',
    'lib/materialize.min.js',
    'lib/tex-chtml.js',
    'lib/input/tex/extensions/color.js',
    'lib/output/chtml/fonts/woff-v2/MathJax_AMS-Regular.woff',
    'lib/output/chtml/fonts/woff-v2/MathJax_Main-Italic.woff',
    'lib/output/chtml/fonts/woff-v2/MathJax_Main-Regular.woff',
    'lib/output/chtml/fonts/woff-v2/MathJax_Size1-Regular.woff',
    'lib/output/chtml/fonts/woff-v2/MathJax_Zero.woff',
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