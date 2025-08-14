# PWA & SERVICE WORKER IMPLEMENTATION

## Progressive Web App Architecture

---

# 📱 PWA OVERVIEW

## PWA Features
1. **Offline Functionality**: Cache-first strategies for static assets
2. **App-like Experience**: Fullscreen, standalone mode
3. **Push Notifications**: Engagement and re-engagement
4. **Background Sync**: Queue actions when offline
5. **Install Prompt**: Add to home screen
6. **Auto Updates**: Seamless app updates

## Browser Support
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Partial support (no push on iOS)
- **Samsung Internet**: Full support

---

# 📋 MANIFEST CONFIGURATION

## manifest.json
```json
{
  "name": "Operator Uplift",
  "short_name": "Uplift",
  "description": "Transform your productivity into an addictive game",
  "start_url": "/app",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#f97316",
  "background_color": "#0a0a0a",
  
  "icons": [
    {
      "src": "/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  
  "screenshots": [
    {
      "src": "/screenshot-1.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "label": "Dashboard view"
    },
    {
      "src": "/screenshot-2.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "label": "Focus timer"
    },
    {
      "src": "/screenshot-3.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "label": "Achievements"
    }
  ],
  
  "categories": ["productivity", "lifestyle"],
  
  "shortcuts": [
    {
      "name": "Start Focus",
      "short_name": "Focus",
      "description": "Start a focus session",
      "url": "/app?action=focus",
      "icons": [{ "src": "/icon-focus.png", "sizes": "96x96" }]
    },
    {
      "name": "Daily Tasks",
      "short_name": "Tasks",
      "description": "View today's tasks",
      "url": "/app?action=tasks",
      "icons": [{ "src": "/icon-tasks.png", "sizes": "96x96" }]
    }
  ],
  
  "share_target": {
    "action": "/app/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "media",
          "accept": ["image/*"]
        }
      ]
    }
  },
  
  "related_applications": [],
  "prefer_related_applications": false
}
```

---

# ⚙️ SERVICE WORKER IMPLEMENTATION

## Current Service Worker (sw.js)
```javascript
// Service Worker Version Management
const CACHE_NAME = 'operator-uplift-v2.6';
const STATIC_CACHE = 'static-v2.6';
const DYNAMIC_CACHE = 'dynamic-v2.6';
const API_CACHE = 'api-v2.6';

// Cache Strategies
const CACHE_STRATEGIES = {
    'static': 'cache-first',
    'dynamic': 'stale-while-revalidate',
    'api': 'network-first',
    'images': 'stale-while-revalidate'
};
```

## Installation Strategy
```javascript
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                // Cache URLs individually to prevent total failure
                const cachePromises = urlsToCache.map(url => {
                    return cache.add(url).catch(error => {
                        console.warn(`Failed to cache ${url}:`, error);
                        return Promise.resolve();
                    });
                });
                return Promise.all(cachePromises);
            })
            .then(() => self.skipWaiting())
    );
});
```

## Activation & Cleanup
```javascript
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete old cache versions
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== API_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});
```

## Fetch Strategies

### Cache-First Strategy
```javascript
async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) {
        console.log('📦 Cache hit:', request.url);
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('❌ Fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}
```

### Network-First Strategy
```javascript
async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) {
            console.log('📦 Fallback to cache:', request.url);
            return cached;
        }
        return new Response('Offline', { status: 503 });
    }
}
```

### Stale-While-Revalidate Strategy
```javascript
async function staleWhileRevalidate(request, cacheName) {
    const cached = await caches.match(request);
    
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(cacheName);
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    });
    
    return cached || fetchPromise;
}
```

## Request Routing
```javascript
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // API requests - Network first
    if (url.pathname.includes('/api/') || 
        url.pathname.includes('/.netlify/functions/')) {
        event.respondWith(networkFirst(request, API_CACHE));
        return;
    }
    
    // Static assets - Cache first
    if (url.pathname.match(/\.(js|css|woff2?|ttf|otf)$/)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }
    
    // Images - Stale while revalidate
    if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
        return;
    }
    
    // HTML - Network first
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
        return;
    }
    
    // Default - Stale while revalidate
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});
```

---

# 📬 PUSH NOTIFICATIONS

## Permission Request
```javascript
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}
```

## Push Subscription
```javascript
async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });
    
    // Send subscription to server
    await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
    });
    
    return subscription;
}
```

## Push Event Handler
```javascript
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: data.id || 1,
            url: data.url || '/'
        },
        actions: [
            {
                action: 'explore',
                title: 'Open',
                icon: '/icon-check.png'
            },
            {
                action: 'close',
                title: 'Dismiss',
                icon: '/icon-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Operator Uplift',
            options
        )
    );
});
```

## Notification Click Handler
```javascript
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else if (event.action === 'close') {
        // Just close the notification
        event.notification.close();
    } else {
        // Default action - open app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
```

---

# 🔄 BACKGROUND SYNC

## Register Sync
```javascript
async function registerBackgroundSync(tag, data) {
    const registration = await navigator.serviceWorker.ready;
    
    // Store data in IndexedDB for sync
    await storeDataForSync(tag, data);
    
    try {
        await registration.sync.register(tag);
        console.log('Background sync registered:', tag);
    } catch (error) {
        console.error('Background sync failed:', error);
        // Fallback to immediate sync
        await performSync(tag, data);
    }
}
```

## Sync Event Handler
```javascript
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);
    
    if (event.tag === 'sync-focus-sessions') {
        event.waitUntil(syncFocusSessions());
    } else if (event.tag === 'sync-tasks') {
        event.waitUntil(syncTasks());
    } else if (event.tag === 'sync-achievements') {
        event.waitUntil(syncAchievements());
    }
});

async function syncFocusSessions() {
    const sessions = await getStoredSessions();
    
    for (const session of sessions) {
        try {
            await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session)
            });
            
            await removeStoredSession(session.id);
        } catch (error) {
            console.error('Failed to sync session:', error);
            throw error; // Retry later
        }
    }
}
```

---

# 📥 APP INSTALL

## Install Prompt
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show custom install UI
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response: ${outcome}`);
        
        // Clear the deferred prompt
        deferredPrompt = null;
        
        // Hide the install button
        installButton.style.display = 'none';
        
        // Track the installation
        analytics.track('pwa_install', { outcome });
    });
}
```

## App Installed Event
```javascript
window.addEventListener('appinstalled', (event) => {
    console.log('App installed successfully');
    
    // Track successful installation
    analytics.track('pwa_installed', {
        timestamp: Date.now()
    });
    
    // Show success message
    showToast('App installed successfully! 🎉', 'success');
    
    // Hide install prompts
    hideInstallUI();
});
```

---

# 🔄 UPDATE STRATEGY

## Update Detection
```javascript
// Check for updates periodically
setInterval(() => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) reg.update();
        });
    }
}, 3600000); // Check every hour

// Listen for update found
navigator.serviceWorker.addEventListener('controllerchange', () => {
    showUpdateNotification();
});

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <p>A new version is available!</p>
        <button onclick="window.location.reload()">Update Now</button>
        <button onclick="this.parentElement.remove()">Later</button>
    `;
    document.body.appendChild(notification);
}
```

## Skip Waiting Pattern
```javascript
// In service worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// In main app
function updateServiceWorker() {
    navigator.serviceWorker.getRegistration().then(reg => {
        if (reg && reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            reg.waiting.addEventListener('statechange', (e) => {
                if (e.target.state === 'activated') {
                    window.location.reload();
                }
            });
        }
    });
}
```

---

# 📊 OFFLINE ANALYTICS

## Queue Analytics Events
```javascript
class OfflineAnalytics {
    constructor() {
        this.queue = [];
        this.dbName = 'analyticsQueue';
    }
    
    async track(event, data) {
        const payload = {
            event,
            data,
            timestamp: Date.now(),
            id: crypto.randomUUID()
        };
        
        if (navigator.onLine) {
            // Send immediately
            try {
                await this.send(payload);
            } catch {
                // Queue if failed
                await this.queue(payload);
            }
        } else {
            // Queue for later
            await this.queue(payload);
        }
    }
    
    async queue(payload) {
        const db = await this.openDB();
        const tx = db.transaction(['events'], 'readwrite');
        await tx.objectStore('events').add(payload);
    }
    
    async flush() {
        const db = await this.openDB();
        const tx = db.transaction(['events'], 'readonly');
        const events = await tx.objectStore('events').getAll();
        
        for (const event of events) {
            try {
                await this.send(event);
                // Remove from queue
                const deleteTx = db.transaction(['events'], 'readwrite');
                await deleteTx.objectStore('events').delete(event.id);
            } catch {
                // Keep in queue for next attempt
            }
        }
    }
    
    async send(payload) {
        return fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
}
```

---

# 🚀 MIGRATION TO NEXT.JS PWA

## Installation
```bash
npm install next-pwa
```

## Configuration
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest.json$/],
  
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        }
      }
    },
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-scripts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 minutes
        }
      }
    }
  ]
});

module.exports = withPWA({
  // Your Next.js config
});
```

---

# 📈 PERFORMANCE METRICS

## Core Web Vitals
```javascript
// Measure performance
if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('LCP:', entry.startTime);
            analytics.track('web_vital_lcp', {
                value: entry.startTime
            });
        }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            const delay = entry.processingStart - entry.startTime;
            console.log('FID:', delay);
            analytics.track('web_vital_fid', {
                value: delay
            });
        }
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                console.log('CLS:', clsValue);
            }
        }
    }).observe({ entryTypes: ['layout-shift'] });
}
```

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Service Worker Version**: 2.6
**Cache Strategy**: Multi-tier
**PWA Score**: 100/100
