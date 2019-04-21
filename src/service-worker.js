'use strict';

var dataCacheName  = 'GDespDataCache';
var cacheName = 'GDespShellCache-v1.0.4';
var filesToCache = [
    './',
    './index.html',
    './css/index.css',
    './android-chrome-192x192.png',
    './android-chrome-256x256.png',
    './apple-touch-icon.png',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './icon-128x128.png',
    './icon-144x144.png',
    './icon-152x152.png',
    './mstile-150x150.png',
    './safari-pinned-tab.svg',
    './js/components/card-expense-component.js',
    './js/components/list-expense-component.js',
    './js/core/entities/expense-entity.js',
    './js/core/fetch-utils.js',
    './js/core/namespace-utils.js',
    './js/services/expenses-api.js',
    './js/services/gdesp-api-core.js',
    './js/index.js',
    './libs/jquery/js/jquery-3.4.0.min.js'
  ];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });

  self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] Fetch', e.request.url);
    var dataUrl = 'wprm.dlinkddns.com';
    if (e.request.url.indexOf(dataUrl) > -1) {
      /*
       * When the request URL contains dataUrl, the app is asking for fresh
       * weather data. In this case, the service worker always goes to the
       * network and then caches the response. This is called the "Cache then
       * network" strategy:
       * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
       */
      e.respondWith(
        caches.open(dataCacheName).then(function(cache) {
          return fetch(e.request).then(function(response){
            cache.put(e.request.url, response.clone());
            return response;
          });
        })
      );
    } else {
      /*
       * The app is asking for app shell files. In this scenario the app uses the
       * "Cache, falling back to the network" offline strategy:
       * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
       */
      e.respondWith(
        caches.match(e.request).then(function(response) {
          return response || fetch(e.request);
        })
      );
    }
  });