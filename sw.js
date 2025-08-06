/**
 * 🔧 Service Worker for Operator Uplift PWA
 * Provides offline functionality, caching, and background sync
 */

const CACHE_NAME = 'operator-uplift-v1.0.4';
const STATIC_CACHE = 'static-v1.0.4';
const DYNAMIC_CACHE = 'dynamic-v1.0.4';
const API_CACHE = 'api-v1.0.4';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/app.html',
    '/manifest.json',
    '/favicon.ico',
    '/apple-touch-icon.png',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.js',
    'https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js',

      'https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore-compat.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/.netlify/functions/ai-proxy',
    '/.netlify/functions/analytics'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== API_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (url.origin === self.location.origin) {
        // Same-origin requests
        if (url.pathname.startsWith('/.netlify/functions/')) {
            // API requests
            event.respondWith(handleApiRequest(request));
        } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
            // HTML pages
            event.respondWith(handleHtmlRequest(request));
        } else {
            // Static assets
            event.respondWith(handleStaticRequest(request));
        }
    } else {
        // Cross-origin requests (CDN, external APIs)
        event.respondWith(handleExternalRequest(request));
    }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('🌐 API request failed, trying cache:', request.url);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline response for API requests
        return new Response(
            JSON.stringify({ 
                error: 'Offline mode', 
                message: 'Please check your connection and try again' 
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle HTML requests with cache-first strategy
async function handleHtmlRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('📄 HTML request failed:', request.url);
        
        // Return offline page
        return caches.match('/app.html');
    }
}

// Handle static asset requests with cache-first strategy
async function handleStaticRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        if (networkResponse.ok && networkResponse.status !== 206) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('📦 Static request failed:', request.url);
        return new Response('Not found', { status: 404 });
    }
}

// Handle external requests with cache-first strategy
async function handleExternalRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        if (networkResponse.ok && networkResponse.status !== 206) {
            // Skip caching chrome-extension URLs
            if (!request.url.startsWith('chrome-extension://')) {
                try {
                    const cache = await caches.open(DYNAMIC_CACHE);
                    await cache.put(request, networkResponse.clone());
                } catch (error) {
                    console.warn('Failed to cache external request:', error);
                }
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌍 External request failed:', request.url);
        return new Response('Not available offline', { status: 503 });
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(performBackgroundSync());
    }
});

// Perform background sync
async function performBackgroundSync() {
    try {
        // Get pending actions from IndexedDB
        const pendingActions = await getPendingActions();
        
        for (const action of pendingActions) {
            try {
                await processPendingAction(action);
                await removePendingAction(action.id);
            } catch (error) {
                console.error('❌ Failed to process pending action:', error);
            }
        }
        
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Get pending actions from IndexedDB
async function getPendingActions() {
    // This would typically use IndexedDB to store pending actions
    // For now, return empty array
    return [];
}

// Process a pending action
async function processPendingAction(action) {
    // Process different types of actions
    switch (action.type) {
        case 'goal_create':
            // Sync goal creation
            break;
        case 'chat_message':
            // Sync chat messages
            break;
        case 'analytics_data':
            // Sync analytics data
            break;
        default:
            console.log('Unknown action type:', action.type);
    }
}

// Remove processed action
async function removePendingAction(actionId) {
    // Remove from IndexedDB
    console.log('🗑️ Removing processed action:', actionId);
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('📱 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from Operator Uplift',
        icon: '/apple-touch-icon.png',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View',
                icon: '/favicon.ico'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/favicon.ico'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Operator Uplift', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('📱 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('💬 Message received in service worker:', event.data);
    
    switch (event.data.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
        default:
            console.log('Unknown message type:', event.data.type);
    }
});

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

console.log('🔧 Service Worker script loaded');
