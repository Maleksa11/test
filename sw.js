'use strict';

const CACHE_NAME = 'malek-tube-shell-v1';
const SHELL_FILES = ['./index.html', './manifest.webmanifest', './icon.svg'];
const SHELL_INDEX = new URL('./index.html', self.location.href).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('malek-tube-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(SHELL_INDEX, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(SHELL_INDEX)) || Response.error();
      }
    })());
    return;
  }

  const isShellFile = SHELL_FILES.some((path) =>
    new URL(path, self.location.href).pathname === url.pathname
  );
  if (isShellFile) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
