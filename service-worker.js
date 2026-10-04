const CACHE_NAME = '9exo-cache-v4';
const PRECACHE_URLS = [
    '/',
    '/products/',
    '/assets/css/style.css',
    '/assets/fonts/fonts.css',
    '/assets/fonts/Inter-Variable.woff2',
    '/assets/fonts/Poppins-Regular.woff2',
    '/assets/fonts/Poppins-SemiBold.woff2',
    '/assets/js/config.js',
    '/assets/js/icons.js',
    '/assets/js/partials.js',
    '/assets/js/main.js',
    '/assets/js/cart-drawer.js',
    '/assets/js/products.js',
    '/assets/data/products.json',
    '/assets/images/black-logo.png',
    '/assets/images/white-logo.png',
    '/assets/icons/icon-192.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Let cross-origin requests (WhatsApp, social links) go straight to the
    // network rather than through the cache.
    if (new URL(event.request.url).origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const network = fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    // Only '/' and '/products/' are precached, so most routes
                    // reach here with nothing cached. respondWith() rejects on
                    // undefined, so always resolve to a real Response: the
                    // cached copy, else the shell, else a plain 503.
                    if (cached) return cached;
                    if (event.request.mode === 'navigate') {
                        return caches.match('/').then((shell) => shell || offlineResponse());
                    }
                    return offlineResponse();
                });
            return cached || network;
        })
    );
});

function offlineResponse() {
    return new Response('You are offline.', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}
