// Storage Module
// Handles data persistence, sync, and storage management

class StorageModule {
  constructor(core) {
    this.core = core;
    this.isInitialized = false;
    this.storagePrefix = 'operator_uplift_';
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
  }

  async init() {
    if (this.isInitialized) {return;}

    console.log('💾 Storage Module initialized');
    this.isInitialized = true;

    // Setup online/offline detection
    this.setupConnectivityMonitoring();

    // Initialize storage
    this.initializeStorage();

    // Process sync queue
    this.processSyncQueue();
  }

  // Setup connectivity monitoring
  setupConnectivityMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
      console.log('🌐 Online - processing sync queue');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Offline - queuing changes');
    });
  }

  // Initialize storage
  initializeStorage() {
    // Create default storage structure if it doesn't exist
    const defaultData = {
      user: null,
      goals: [],
      achievements: [],
      chat_history: [],
      settings: {
        theme: 'dark',
        notifications: true,
        autoSync: true
      },
      analytics: {
        events: [],
        metrics: {}
      },
      lastSync: null
    };

    // Initialize each storage key with defaults
    Object.entries(defaultData).forEach(([key, defaultValue]) => {
      if (!this.get(key)) {
        this.set(key, defaultValue);
      }
    });
  }

  // Get data from storage
  get(key, defaultValue = null) {
    try {
      const fullKey = this.storagePrefix + key;
      const data = localStorage.getItem(fullKey);

      if (data === null) {
        return defaultValue;
      }

      return JSON.parse(data);
    } catch (error) {
      console.warn(`Failed to get storage key '${key}':`, error);
      return defaultValue;
    }
  }

  // Set data in storage
  set(key, value) {
    try {
      const fullKey = this.storagePrefix + key;
      const serializedValue = JSON.stringify(value);

      localStorage.setItem(fullKey, serializedValue);

      // Add to sync queue if online
      if (this.isOnline) {
        this.addToSyncQueue('set', key, value);
      }

      console.log(`💾 Storage set: ${key}`);
      return true;
    } catch (error) {
      console.error(`Failed to set storage key '${key}':`, error);
      return false;
    }
  }

  // Remove data from storage
  remove(key) {
    try {
      const fullKey = this.storagePrefix + key;
      localStorage.removeItem(fullKey);

      // Add to sync queue if online
      if (this.isOnline) {
        this.addToSyncQueue('remove', key);
      }

      console.log(`🗑️ Storage removed: ${key}`);
      return true;
    } catch (error) {
      console.error(`Failed to remove storage key '${key}':`, error);
      return false;
    }
  }

  // Check if key exists in storage
  has(key) {
    const fullKey = this.storagePrefix + key;
    return localStorage.getItem(fullKey) !== null;
  }

  // Get all storage keys
  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        keys.push(key.substring(this.storagePrefix.length));
      }
    }
    return keys;
  }

  // Clear all app data
  clear() {
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => {
        this.remove(key);
      });

      console.log('🗑️ All storage cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  // Get storage size
  getSize() {
    let totalSize = 0;
    const keys = this.getAllKeys();

    keys.forEach(key => {
      const data = this.get(key);
      if (data) {
        totalSize += JSON.stringify(data).length;
      }
    });

    return {
      keys: keys.length,
      size: totalSize,
      sizeKB: (totalSize / 1024).toFixed(2)
    };
  }

  // Add to sync queue
  addToSyncQueue(action, key, value = null) {
    const syncItem = {
      id: Date.now() + Math.random(),
      action,
      key,
      value,
      timestamp: new Date().toISOString(),
      retries: 0
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();

    console.log(`📋 Added to sync queue: ${action} ${key}`);
  }

  // Process sync queue
  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    console.log(`🔄 Processing ${this.syncQueue.length} sync items`);

    const itemsToProcess = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of itemsToProcess) {
      try {
        await this.syncItem(item);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);

        // Retry logic
        if (item.retries < 3) {
          item.retries++;
          this.syncQueue.push(item);
        }
      }
    }

    this.saveSyncQueue();
  }

  // Sync individual item
  async syncItem(item) {
    // This would sync with a remote server
    // For now, we'll just simulate the sync
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(`✅ Synced: ${item.action} ${item.key}`);
  }

  // Save sync queue to storage
  saveSyncQueue() {
    try {
      localStorage.setItem(`${this.storagePrefix}sync_queue`, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.warn('Failed to save sync queue:', error);
    }
  }

  // Load sync queue from storage
  loadSyncQueue() {
    try {
      const saved = localStorage.getItem(`${this.storagePrefix}sync_queue`);
      if (saved) {
        this.syncQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  // Export all data
  exportData() {
    const data = {};
    const keys = this.getAllKeys();

    keys.forEach(key => {
      data[key] = this.get(key);
    });

    return {
      data,
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        storageSize: this.getSize()
      }
    };
  }

  // Import data
  importData(importData) {
    try {
      if (importData.data) {
        Object.entries(importData.data).forEach(([key, value]) => {
          this.set(key, value);
        });

        console.log('📥 Data imported successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Backup data
  createBackup() {
    const backup = this.exportData();
    const backupKey = `backup_${Date.now()}`;

    this.set(backupKey, backup);

    console.log(`💾 Backup created: ${backupKey}`);
    return backupKey;
  }

  // Restore from backup
  restoreFromBackup(backupKey) {
    try {
      const backup = this.get(backupKey);
      if (backup && backup.data) {
        // Clear current data
        this.clear();

        // Restore backup data
        Object.entries(backup.data).forEach(([key, value]) => {
          if (key !== backupKey) { // Don't restore backup keys
            this.set(key, value);
          }
        });

        console.log(`📤 Backup restored: ${backupKey}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }

  // Get backup list
  getBackups() {
    const keys = this.getAllKeys();
    return keys.filter(key => key.startsWith('backup_'))
      .map(key => ({
        key,
        timestamp: key.split('_')[1],
        date: new Date(parseInt(key.split('_')[1]))
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Clean old backups
  cleanOldBackups(maxBackups = 5) {
    const backups = this.getBackups();

    if (backups.length > maxBackups) {
      const toDelete = backups.slice(maxBackups);
      toDelete.forEach(backup => {
        this.remove(backup.key);
      });

      console.log(`🧹 Cleaned ${toDelete.length} old backups`);
    }
  }

  // Get storage statistics
  getStorageStats() {
    const size = this.getSize();
    const backups = this.getBackups();
    const syncQueueSize = this.syncQueue.length;

    return {
      totalKeys: size.keys,
      totalSize: `${size.sizeKB} KB`,
      backups: backups.length,
      syncQueue: syncQueueSize,
      isOnline: this.isOnline,
      lastSync: this.get('lastSync')
    };
  }

  // Validate storage integrity
  validateIntegrity() {
    const issues = [];
    const keys = this.getAllKeys();

    keys.forEach(key => {
      try {
        const data = this.get(key);
        if (data === null) {
          issues.push(`Null data for key: ${key}`);
        }
      } catch (error) {
        issues.push(`Corrupted data for key: ${key}`);
      }
    });

    return {
      valid: issues.length === 0,
      issues,
      totalKeys: keys.length
    };
  }

  // Compact storage (remove unused keys)
  compactStorage() {
    const keys = this.getAllKeys();
    const usedKeys = new Set([
      'user', 'goals', 'achievements', 'chat_history',
      'settings', 'analytics', 'lastSync'
    ]);

    let removedCount = 0;
    keys.forEach(key => {
      if (!usedKeys.has(key) && !key.startsWith('backup_')) {
        this.remove(key);
        removedCount++;
      }
    });

    console.log(`🧹 Storage compacted: removed ${removedCount} unused keys`);
    return removedCount;
  }

  // Cleanup
  cleanup() {
    this.isInitialized = false;
    this.syncQueue = [];
    console.log('💾 Storage Module cleanup completed');
  }
}

export default StorageModule;
