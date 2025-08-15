// Service Worker for Operator Uplift PWA
const CACHE_NAME = 'operator-uplift-v1';
const urlsToCache = [
  '/',
  '/app.html',
  '/index.html',
  '/style.css',
  '/Operator Uplift LOGO PNG 2.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache error:', err))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Return offline page if available
        return caches.match('/app.html');
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

async function syncUserData() {
  // Sync localStorage data to server when online
  try {
    const data = {
      xp: localStorage.getItem('userXP'),
      tokens: localStorage.getItem('userTokens'),
      achievements: localStorage.getItem('unlockedAchievements'),
      streak: localStorage.getItem('currentStreak')
    };
    
    // Send to server when API is ready
    console.log('Ready to sync:', data);
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Time for your focus session!',
    icon: '/Operator Uplift LOGO PNG 2.png',
    badge: '/Operator Uplift LOGO PNG 2.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start',
        title: 'Start Focus',
        icon: '/icons/timer.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icons/close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Operator Uplift', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'start') {
    // Open app and start focus session
    event.waitUntil(
      clients.openWindow('/app.html#focus')
    );
  }
});