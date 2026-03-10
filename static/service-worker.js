/// <reference lib="webworker" />

/**
 * Service Worker for MyIA Hub PWA.
 * - Versioned cache with automatic cleanup of old versions
 * - Cache-first with stale-while-revalidate for static assets
 * - Network-first with offline fallback for pages
 * - Immutable hashed assets (/_app/) cached permanently
 */

const CACHE_VERSION = 2;
const CACHE_NAME = `myia-hub-v${CACHE_VERSION}`;
const STATIC_ASSETS = ['/', '/manifest.json', '/favicon.png', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
		)
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET and external API calls
	if (request.method !== 'GET') return;
	if (url.origin !== self.location.origin) return;

	// Immutable hashed assets — cache-first, never revalidate
	if (url.pathname.startsWith('/_app/')) {
		event.respondWith(
			caches.match(request).then(
				(cached) => cached || fetch(request).then((response) => {
					if (response.ok) {
						const clone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
					}
					return response;
				})
			)
		);
		return;
	}

	// Stale-while-revalidate for other static files (.png, .css, .js, .json)
	if (/\.(png|jpg|svg|css|js|json|woff2?)$/.test(url.pathname)) {
		event.respondWith(
			caches.match(request).then((cached) => {
				const fetchPromise = fetch(request).then((response) => {
					if (response.ok) {
						const clone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
					}
					return response;
				}).catch(() => cached);
				return cached || fetchPromise;
			})
		);
		return;
	}

	// Network-first for pages with offline fallback
	event.respondWith(
		fetch(request)
			.then((response) => {
				if (response.ok) {
					const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
				}
				return response;
			})
			.catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
	);
});
