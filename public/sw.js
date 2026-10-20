// Progressive Web App Service Worker
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `ai-saas-content-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
    OFFLINE_URL,
    '/manifest.webmanifest',
    '/favicon.svg',
    '/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/icon-maskable-192x192.png',
    '/icons/icon-maskable-512x512.png',
    '/icons/apple-touch-icon-180x180.png',
    '/images/logo/logo.png',
    '/images/logo/icon-only-dark.png',
    '/images/logo/icon-only-light.png'
];

// Install: Pre-cache shell assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate: Clean up old cache versions & claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Skip Vite dev server internals, WebSockets, and browser extensions
    if (
        url.pathname.startsWith('/@vite') ||
        url.pathname.startsWith('/resources/') ||
        url.pathname === '/hot' ||
        url.protocol === 'chrome-extension:' ||
        url.protocol === 'moz-extension:'
    ) {
        return;
    }

    // 1. Navigation requests (HTML pages) -> Network first with Offline fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    return networkResponse;
                })
                .catch(async () => {
                    const cache = await caches.open(CACHE_NAME);
                    const cachedOffline = await cache.match(OFFLINE_URL);
                    return cachedOffline || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
                })
        );
        return;
    }

    // 2. Static icons & images -> Cache first, fallback to network
    if (
        url.pathname.startsWith('/icons/') ||
        url.pathname.startsWith('/images/') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.ico') ||
        url.pathname.endsWith('.png') ||
        url.hostname.includes('fonts.bunny.net') ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Update cache in the background (stale-while-revalidate)
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, networkResponse);
                            });
                        }
                    }).catch(() => {/* ignore background fetch errors */});
                    return cachedResponse;
                }

                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                });
            })
        );
        return;
    }

    // 3. All other requests -> Network first with fallback
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});
