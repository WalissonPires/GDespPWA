'use strict';

var dataCacheName  = 'GDespDataCache';
var cacheName = 'GDespShellCache-v1.0.70';
var filesToCache = [
    './',
    './index.html',
    './css/index.css',
    './libs/bootstrap/css/bootstrap-grid.min.css',
    './libs/material-toast/mdtoast.min.css',
    './android-chrome-192x192.png',
    './android-chrome-256x256.png',
    './apple-touch-icon.png',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './icon-128x128.png',
    './icon-144x144.png',
    './icon-152x152.png',
    './icon-512x512.png',
    './mstile-150x150.png',
    './safari-pinned-tab.svg',
    './js/components/card-expense-component.js',
    './js/components/list-expense-component.js',
    './js/components/expense-detail-component.js',
    './js/components/modal-component.js',
    './js/components/filter-component.js',
    './js/core/entities/expense-entity.js',
    './js/core/entities/member-entity.js',
    './js/core/pages.js',
    './js/core/fetch-utils.js',
    './js/core/toast.js',
    './js/core/namespace-utils.js',
    './js/core/layout.js',
    './js/services/expenses-api.js',
    './js/services/members-api.js',
    './js/services/gdesp-api-core.js',
    './js/services/dashboard-api.js',
    './js/pages/expenses-page.js',
    './js/pages/dashboard-page.js',
    './js/index.js',
    './libs/jquery/js/jquery-3.4.0.min.js',
    './libs/material-toast/mdtoast.min.js',

    'https://fonts.googleapis.com/css?family=Montserrat',
    'https://use.fontawesome.com/releases/v5.8.1/css/solid.css',
    'https://use.fontawesome.com/releases/v5.8.1/css/regular.css',
    'https://use.fontawesome.com/releases/v5.8.1/css/fontawesome.css'
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