/**
 * Offline Mode Support System
 * Local caching, offline operations, sync management
 */

window.OfflineModeSystem = {
    // Configuration
    config: {
        enableOfflineMode: true,
        syncInterval: 30000, // 30 seconds
        maxQueueSize: 1000,
        cacheExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days
    },

    // State management
    state: {
        isOnline: navigator.onLine,
        lastSync: null,
        pendingSync: false,
        syncErrors: []
    },

    // Offline queue
    queue: {
        actions: [],
        conflicts: []
    },

    // Cache management
    cache: {
        data: new Map(),
        metadata: new Map()
    },

    // Initialize offline support
    initialize() {
        this.loadOfflineData();
        this.setupServiceWorker();
        this.setupEventListeners();
        this.setupSyncSchedule();
        this.updateOnlineStatus();
        this.checkPendingSync();
    },

    // Load offline data
    loadOfflineData() {
        // Load queue from IndexedDB
        this.loadQueue();
        
        // Load cached data
        this.loadCache();
        
        // Load sync metadata
        const metadata = localStorage.getItem('offlineSyncMetadata');
        if (metadata) {
            const data = JSON.parse(metadata);
            this.state.lastSync = data.lastSync;
            this.state.syncErrors = data.syncErrors || [];
        }
    },

    // Setup service worker for offline caching
    setupServiceWorker() {
        if ('serviceWorker' in navigator && this.config.enableOfflineMode) {
            // Update service worker for offline support
            navigator.serviceWorker.ready.then(registration => {
                // Send message to SW to enable offline mode
                registration.active.postMessage({
                    type: 'ENABLE_OFFLINE_MODE',
                    config: this.config
                });
            });
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Intercept data operations
        this.interceptDataOperations();

        // Listen for sync messages from SW
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'SYNC_REQUIRED') {
                    this.syncData();
                }
            });
        }

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.state.isOnline) {
                this.checkPendingSync();
            }
        });
    },

    // Handle online event
    handleOnline() {
        this.state.isOnline = true;
        this.updateOnlineStatus();
        
        // Show notification
        this.showStatusNotification('Back online! Syncing data...', 'success');
        
        // Start sync
        this.syncData();
    },

    // Handle offline event
    handleOffline() {
        this.state.isOnline = false;
        this.updateOnlineStatus();
        
        // Show notification
        this.showStatusNotification('You\'re offline. Changes will sync when reconnected.', 'warning');
    },

    // Update online status indicator
    updateOnlineStatus() {
        // Update UI indicator
        const indicator = document.getElementById('onlineStatusIndicator') || this.createStatusIndicator();
        
        if (this.state.isOnline) {
            indicator.className = 'online-status online';
            indicator.innerHTML = '<i class="fas fa-wifi"></i> Online';
        } else {
            indicator.className = 'online-status offline';
            indicator.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
        }

        // Update body class
        document.body.classList.toggle('offline-mode', !this.state.isOnline);
    },

    // Create status indicator
    createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'onlineStatusIndicator';
        indicator.className = 'online-status';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 8px 16px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        return indicator;
    },

    // Intercept data operations
    interceptDataOperations() {
        // Override localStorage.setItem
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            originalSetItem.call(localStorage, key, value);
            
            // Queue for sync if offline
            if (!this.state.isOnline) {
                this.queueAction({
                    type: 'localStorage',
                    operation: 'set',
                    key: key,
                    value: value,
                    timestamp: Date.now()
                });
            }
        };

        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            // Check if request should be cached
            if (this.shouldCacheRequest(url, options)) {
                return this.cachedFetch(url, options, originalFetch);
            }
            
            // For write operations when offline
            if (!this.state.isOnline && this.isWriteOperation(options)) {
                return this.queueFetchRequest(url, options);
            }
            
            return originalFetch(url, options);
        };
    },

    // Cached fetch implementation
    async cachedFetch(url, options, originalFetch) {
        const cacheKey = this.getCacheKey(url, options);
        
        // Try online first
        if (this.state.isOnline) {
            try {
                const response = await originalFetch(url, options);
                const clonedResponse = response.clone();
                
                // Cache successful responses
                if (response.ok) {
                    const data = await clonedResponse.json();
                    this.cacheResponse(cacheKey, data);
                }
                
                return response;
            } catch (error) {
                // Fall back to cache
                return this.getCachedResponse(cacheKey);
            }
        } else {
            // Offline - return from cache
            return this.getCachedResponse(cacheKey);
        }
    },

    // Queue fetch request for later
    async queueFetchRequest(url, options) {
        const action = {
            type: 'fetch',
            url: url,
            options: options,
            timestamp: Date.now(),
            id: `fetch_${Date.now()}_${Math.random()}`
        };
        
        this.queueAction(action);
        
        // Return mock response
        return new Response(JSON.stringify({
            success: true,
            offline: true,
            queued: true,
            queueId: action.id
        }), {
            status: 202,
            statusText: 'Accepted - Queued for sync',
            headers: {
                'Content-Type': 'application/json',
                'X-Offline-Queue': 'true'
            }
        });
    },

    // Queue action for sync
    queueAction(action) {
        this.queue.actions.push(action);
        
        // Limit queue size
        if (this.queue.actions.length > this.config.maxQueueSize) {
            this.queue.actions.shift(); // Remove oldest
        }
        
        // Save queue
        this.saveQueue();
        
        // Update UI
        this.updateQueueIndicator();
    },

    // Save queue to IndexedDB
    async saveQueue() {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['offlineQueue'], 'readwrite');
            const store = transaction.objectStore('offlineQueue');
            
            await store.put({
                id: 'queue',
                actions: this.queue.actions,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('Failed to save offline queue:', error);
        }
    },

    // Load queue from IndexedDB
    async loadQueue() {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['offlineQueue'], 'readonly');
            const store = transaction.objectStore('offlineQueue');
            
            const data = await store.get('queue');
            if (data) {
                this.queue.actions = data.actions || [];
            }
        } catch (error) {
            console.error('Failed to load offline queue:', error);
        }
    },

    // Open IndexedDB
    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OperatorUpliftOffline', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create stores
                if (!db.objectStoreNames.contains('offlineQueue')) {
                    db.createObjectStore('offlineQueue', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('cache')) {
                    const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
                    cacheStore.createIndex('expiry', 'expiry');
                }
            };
        });
    },

    // Sync data
    async syncData() {
        if (!this.state.isOnline || this.state.pendingSync) return;
        
        this.state.pendingSync = true;
        this.showSyncIndicator(true);
        
        try {
            // Process queued actions
            const results = await this.processQueue();
            
            // Handle conflicts
            if (results.conflicts.length > 0) {
                await this.resolveConflicts(results.conflicts);
            }
            
            // Update last sync time
            this.state.lastSync = Date.now();
            this.saveSyncMetadata();
            
            // Clear processed items from queue
            this.clearProcessedQueue(results.processed);
            
            // Show success
            this.showStatusNotification(`Sync complete! ${results.processed.length} items synced.`, 'success');
            
        } catch (error) {
            console.error('Sync failed:', error);
            this.state.syncErrors.push({
                timestamp: Date.now(),
                error: error.message
            });
            
            this.showStatusNotification('Sync failed. Will retry later.', 'error');
            
        } finally {
            this.state.pendingSync = false;
            this.showSyncIndicator(false);
        }
    },

    // Process offline queue
    async processQueue() {
        const results = {
            processed: [],
            failed: [],
            conflicts: []
        };
        
        for (const action of this.queue.actions) {
            try {
                const result = await this.processAction(action);
                
                if (result.conflict) {
                    results.conflicts.push(result);
                } else if (result.success) {
                    results.processed.push(action);
                } else {
                    results.failed.push(action);
                }
            } catch (error) {
                console.error('Failed to process action:', action, error);
                results.failed.push(action);
            }
        }
        
        return results;
    },

    // Process individual action
    async processAction(action) {
        switch (action.type) {
            case 'localStorage':
                return this.syncLocalStorageAction(action);
                
            case 'fetch':
                return this.syncFetchAction(action);
                
            default:
                throw new Error(`Unknown action type: ${action.type}`);
        }
    },

    // Sync localStorage action
    async syncLocalStorageAction(action) {
        // Check for conflicts
        const serverValue = await this.getServerValue(action.key);
        const localValue = localStorage.getItem(action.key);
        
        if (serverValue && serverValue !== action.value) {
            // Conflict detected
            return {
                conflict: true,
                action: action,
                serverValue: serverValue,
                localValue: localValue
            };
        }
        
        // Sync to server
        try {
            await fetch('/api/sync/localStorage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: action.key,
                    value: action.value,
                    timestamp: action.timestamp
                })
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    },

    // Sync fetch action
    async syncFetchAction(action) {
        try {
            const response = await fetch(action.url, action.options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return { success: true, response };
        } catch (error) {
            return { success: false, error };
        }
    },

    // Resolve conflicts
    async resolveConflicts(conflicts) {
        for (const conflict of conflicts) {
            // Simple resolution strategy - last write wins
            // In production, might show UI for user to choose
            const resolution = this.autoResolveConflict(conflict);
            
            if (resolution === 'local') {
                // Keep local version
                await this.forceSync(conflict.action);
            } else {
                // Keep server version
                localStorage.setItem(conflict.action.key, conflict.serverValue);
            }
        }
    },

    // Auto resolve conflict
    autoResolveConflict(conflict) {
        // Simple strategy: if local change is newer, keep it
        const serverTimestamp = conflict.serverTimestamp || 0;
        const localTimestamp = conflict.action.timestamp;
        
        return localTimestamp > serverTimestamp ? 'local' : 'server';
    },

    // Cache response
    cacheResponse(key, data) {
        const cacheEntry = {
            key: key,
            data: data,
            timestamp: Date.now(),
            expiry: Date.now() + this.config.cacheExpiry
        };
        
        this.cache.data.set(key, cacheEntry);
        
        // Save to IndexedDB
        this.saveCacheEntry(cacheEntry);
    },

    // Get cached response
    async getCachedResponse(key) {
        // Check memory cache
        let cacheEntry = this.cache.data.get(key);
        
        // Check IndexedDB
        if (!cacheEntry) {
            cacheEntry = await this.loadCacheEntry(key);
        }
        
        if (cacheEntry && cacheEntry.expiry > Date.now()) {
            return new Response(JSON.stringify(cacheEntry.data), {
                status: 200,
                statusText: 'OK (from cache)',
                headers: {
                    'Content-Type': 'application/json',
                    'X-From-Cache': 'true'
                }
            });
        }
        
        // No cache or expired
        return new Response(JSON.stringify({ error: 'Offline and no cache available' }), {
            status: 503,
            statusText: 'Service Unavailable'
        });
    },

    // Save cache entry to IndexedDB
    async saveCacheEntry(entry) {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['cache'], 'readwrite');
            const store = transaction.objectStore('cache');
            await store.put(entry);
        } catch (error) {
            console.error('Failed to save cache entry:', error);
        }
    },

    // Load cache entry from IndexedDB
    async loadCacheEntry(key) {
        try {
            const db = await this.openDatabase();
            const transaction = db.transaction(['cache'], 'readonly');
            const store = transaction.objectStore('cache');
            return await store.get(key);
        } catch (error) {
            console.error('Failed to load cache entry:', error);
            return null;
        }
    },

    // Show sync indicator
    showSyncIndicator(show) {
        let indicator = document.getElementById('syncIndicator');
        
        if (show && !indicator) {
            indicator = document.createElement('div');
            indicator.id = 'syncIndicator';
            indicator.className = 'sync-indicator';
            indicator.innerHTML = '<i class="fas fa-sync fa-spin"></i> Syncing...';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 8px 16px;
                background: var(--primary-color);
                color: white;
                border-radius: 20px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 10000;
            `;
            document.body.appendChild(indicator);
        } else if (!show && indicator) {
            indicator.remove();
        }
    },

    // Update queue indicator
    updateQueueIndicator() {
        const count = this.queue.actions.length;
        let indicator = document.getElementById('queueIndicator');
        
        if (count > 0 && !this.state.isOnline) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'queueIndicator';
                indicator.className = 'queue-indicator';
                indicator.style.cssText = `
                    position: fixed;
                    bottom: 60px;
                    left: 20px;
                    padding: 8px 16px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-light);
                    border-radius: 20px;
                    font-size: 14px;
                    z-index: 1000;
                `;
                document.body.appendChild(indicator);
            }
            
            indicator.innerHTML = `<i class="fas fa-clock"></i> ${count} pending ${count === 1 ? 'action' : 'actions'}`;
        } else if (indicator) {
            indicator.remove();
        }
    },

    // Show status notification
    showStatusNotification(message, type) {
        if (window.showToast) {
            window.showToast(message, type);
        }
    },

    // Helper methods
    shouldCacheRequest(url, options) {
        // Cache GET requests to API endpoints
        return options.method === 'GET' || !options.method;
    },

    isWriteOperation(options) {
        return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method);
    },

    getCacheKey(url, options) {
        return `${options.method || 'GET'}_${url}`;
    },

    clearProcessedQueue(processed) {
        const processedIds = new Set(processed.map(a => a.id));
        this.queue.actions = this.queue.actions.filter(a => !processedIds.has(a.id));
        this.saveQueue();
        this.updateQueueIndicator();
    },

    saveSyncMetadata() {
        localStorage.setItem('offlineSyncMetadata', JSON.stringify({
            lastSync: this.state.lastSync,
            syncErrors: this.state.syncErrors.slice(-10) // Keep last 10 errors
        }));
    },

    // Setup sync schedule
    setupSyncSchedule() {
        // Periodic sync when online
        setInterval(() => {
            if (this.state.isOnline && this.queue.actions.length > 0) {
                this.syncData();
            }
        }, this.config.syncInterval);
    },

    // Check pending sync on load
    checkPendingSync() {
        if (this.state.isOnline && this.queue.actions.length > 0) {
            this.showStatusNotification(`${this.queue.actions.length} pending actions to sync`, 'info');
            this.syncData();
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.OfflineModeSystem.initialize());
} else {
    window.OfflineModeSystem.initialize();
}
