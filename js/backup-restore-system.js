/**
 * Backup & Restore System
 * Automatic backups, manual triggers, version history, import/export
 */

window.BackupRestoreSystem = {
    // Configuration
    config: {
        autoBackupEnabled: true,
        backupInterval: 24 * 60 * 60 * 1000, // Daily
        maxBackups: 10,
        cloudBackupEnabled: false,
        encryptBackups: true
    },

    // Backup metadata
    backups: [],
    lastBackupTime: null,
    backupInProgress: false,

    // Data keys to backup
    dataKeys: [
        'userProfile', 'userGoals', 'userTasks', 'completedTasks',
        'habitStacks', 'habitTrackingData', 'focusSessionHistory',
        'focusStatistics', 'moodHistory', 'journeyProgress',
        'achievements', 'userPoints', 'currentStreak', 'streakShields',
        'userPurchases', 'marketplaceTrades', 'collaborationData',
        'aiCoachingProfile', 'notificationPreferences', 'analyticsData',
        'progressReports', 'templateUsage', 'energyData'
    ],

    // Initialize system
    initialize() {
        this.loadBackupMetadata();
        this.setupAutoBackup();
        this.setupEventListeners();
        this.checkBackupIntegrity();
    },

    // Load backup metadata
    loadBackupMetadata() {
        const metadata = localStorage.getItem('backupMetadata');
        if (metadata) {
            const data = JSON.parse(metadata);
            this.backups = data.backups || [];
            this.lastBackupTime = data.lastBackupTime;
            this.config = { ...this.config, ...data.config };
        }
    },

    // Save backup metadata
    saveBackupMetadata() {
        const metadata = {
            backups: this.backups,
            lastBackupTime: this.lastBackupTime,
            config: this.config
        };
        localStorage.setItem('backupMetadata', JSON.stringify(metadata));
    },

    // Create backup
    async createBackup(type = 'manual', description = '') {
        if (this.backupInProgress) {
            window.showToast('Backup already in progress', 'warning');
            return;
        }

        this.backupInProgress = true;
        
        try {
            // Collect all data
            const backupData = this.collectBackupData();
            
            // Create backup object
            const backup = {
                id: `backup_${Date.now()}`,
                type: type,
                description: description,
                timestamp: new Date().toISOString(),
                version: '1.0',
                dataSize: this.calculateDataSize(backupData),
                checksum: await this.generateChecksum(backupData),
                data: backupData
            };

            // Encrypt if enabled
            if (this.config.encryptBackups) {
                backup.data = await this.encryptData(backup.data);
                backup.encrypted = true;
            }

            // Store backup
            await this.storeBackup(backup);
            
            // Update metadata
            this.lastBackupTime = Date.now();
            this.backups.push({
                id: backup.id,
                type: backup.type,
                description: backup.description,
                timestamp: backup.timestamp,
                size: backup.dataSize,
                encrypted: backup.encrypted
            });

            // Cleanup old backups
            this.cleanupOldBackups();
            
            // Save metadata
            this.saveBackupMetadata();

            // Cloud backup if enabled
            if (this.config.cloudBackupEnabled) {
                await this.uploadToCloud(backup);
            }

            window.showToast('Backup created successfully', 'success');
            
            return backup;
            
        } catch (error) {
            console.error('Backup failed:', error);
            window.showToast('Backup failed', 'error');
        } finally {
            this.backupInProgress = false;
        }
    },

    // Collect backup data
    collectBackupData() {
        const data = {};
        
        // Collect all localStorage data
        this.dataKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                data[key] = value;
            }
        });

        // Add app version and metadata
        data._metadata = {
            appVersion: '1.0.0',
            backupVersion: '1.0',
            timestamp: new Date().toISOString(),
            keys: Object.keys(data)
        };

        return data;
    },

    // Restore from backup
    async restoreBackup(backupId) {
        const backup = await this.loadBackup(backupId);
        if (!backup) {
            window.showToast('Backup not found', 'error');
            return;
        }

        // Confirm restoration
        if (!confirm(`Restore from backup created on ${new Date(backup.timestamp).toLocaleString()}? This will overwrite current data.`)) {
            return;
        }

        try {
            // Create current state backup first
            await this.createBackup('pre-restore', 'Automatic backup before restore');

            let data = backup.data;
            
            // Decrypt if needed
            if (backup.encrypted) {
                data = await this.decryptData(data);
            }

            // Verify checksum
            const checksum = await this.generateChecksum(data);
            if (checksum !== backup.checksum) {
                throw new Error('Backup integrity check failed');
            }

            // Clear current data
            this.clearCurrentData();

            // Restore each key
            Object.entries(data).forEach(([key, value]) => {
                if (key !== '_metadata') {
                    localStorage.setItem(key, value);
                }
            });

            // Reload app
            window.showToast('Restore complete. Reloading...', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Restore failed:', error);
            window.showToast('Restore failed: ' + error.message, 'error');
        }
    },

    // Export data
    async exportData(format = 'json') {
        const data = this.collectBackupData();
        
        let exportData;
        let filename;
        let mimeType;

        switch (format) {
            case 'json':
                exportData = JSON.stringify(data, null, 2);
                filename = `operator-uplift-export-${Date.now()}.json`;
                mimeType = 'application/json';
                break;
                
            case 'csv':
                exportData = this.convertToCSV(data);
                filename = `operator-uplift-export-${Date.now()}.csv`;
                mimeType = 'text/csv';
                break;
                
            case 'encrypted':
                exportData = await this.encryptData(data);
                filename = `operator-uplift-backup-${Date.now()}.bak`;
                mimeType = 'application/octet-stream';
                break;
        }

        // Create download
        const blob = new Blob([exportData], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.showToast('Data exported successfully', 'success');
    },

    // Import data
    async importData(file, format = 'auto') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    let data = e.target.result;
                    
                    // Auto-detect format
                    if (format === 'auto') {
                        if (file.name.endsWith('.json')) {
                            format = 'json';
                        } else if (file.name.endsWith('.csv')) {
                            format = 'csv';
                        } else if (file.name.endsWith('.bak')) {
                            format = 'encrypted';
                        }
                    }

                    // Parse data based on format
                    switch (format) {
                        case 'json':
                            data = JSON.parse(data);
                            break;
                        case 'csv':
                            data = this.parseCSV(data);
                            break;
                        case 'encrypted':
                            data = await this.decryptData(data);
                            break;
                    }

                    // Validate data
                    if (!this.validateImportData(data)) {
                        throw new Error('Invalid data format');
                    }

                    // Create backup before import
                    await this.createBackup('pre-import', 'Automatic backup before import');

                    // Import data
                    this.importDataToApp(data);

                    window.showToast('Data imported successfully', 'success');
                    resolve(data);

                } catch (error) {
                    console.error('Import failed:', error);
                    window.showToast('Import failed: ' + error.message, 'error');
                    reject(error);
                }
            };

            reader.readAsText(file);
        });
    },

    // Import from other apps
    async importFromApp(appType, data) {
        const importers = {
            todoist: this.importFromTodoist,
            notion: this.importFromNotion,
            habitica: this.importFromHabitica,
            toggl: this.importFromToggl
        };

        const importer = importers[appType];
        if (!importer) {
            window.showToast('Unsupported app type', 'error');
            return;
        }

        try {
            const convertedData = await importer.call(this, data);
            await this.createBackup('pre-import', `Before ${appType} import`);
            this.mergeImportedData(convertedData);
            window.showToast(`Data imported from ${appType}`, 'success');
        } catch (error) {
            console.error('Import failed:', error);
            window.showToast('Import failed', 'error');
        }
    },

    // Store backup
    async storeBackup(backup) {
        // Use IndexedDB for large backups
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OperatorUpliftBackups', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['backups'], 'readwrite');
                const store = transaction.objectStore('backups');
                const addRequest = store.add(backup);
                
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = () => reject(addRequest.error);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('backups')) {
                    db.createObjectStore('backups', { keyPath: 'id' });
                }
            };
        });
    },

    // Load backup
    async loadBackup(backupId) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OperatorUpliftBackups', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['backups'], 'readonly');
                const store = transaction.objectStore('backups');
                const getRequest = store.get(backupId);
                
                getRequest.onsuccess = () => resolve(getRequest.result);
                getRequest.onerror = () => reject(getRequest.error);
            };
        });
    },

    // Encrypt data
    async encryptData(data) {
        // Simple encryption for demo - in production use proper encryption
        const key = this.getEncryptionKey();
        const dataStr = JSON.stringify(data);
        const encrypted = btoa(dataStr); // Base64 encode for demo
        return encrypted;
    },

    // Decrypt data
    async decryptData(encryptedData) {
        const key = this.getEncryptionKey();
        const decrypted = atob(encryptedData); // Base64 decode for demo
        return JSON.parse(decrypted);
    },

    // Generate checksum
    async generateChecksum(data) {
        const dataStr = JSON.stringify(data);
        // Simple checksum for demo - in production use crypto.subtle
        let hash = 0;
        for (let i = 0; i < dataStr.length; i++) {
            const char = dataStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    },

    // Setup auto backup
    setupAutoBackup() {
        if (!this.config.autoBackupEnabled) return;

        // Check if backup is needed
        const timeSinceLastBackup = Date.now() - this.lastBackupTime;
        if (timeSinceLastBackup >= this.config.backupInterval) {
            this.createBackup('auto', 'Automatic daily backup');
        }

        // Schedule next backup
        setInterval(() => {
            if (this.config.autoBackupEnabled) {
                this.createBackup('auto', 'Automatic daily backup');
            }
        }, this.config.backupInterval);
    },

    // Cleanup old backups
    cleanupOldBackups() {
        if (this.backups.length <= this.config.maxBackups) return;

        // Sort by timestamp
        this.backups.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Remove oldest backups
        const toRemove = this.backups.slice(0, this.backups.length - this.config.maxBackups);
        
        toRemove.forEach(backup => {
            this.deleteBackup(backup.id);
        });

        // Update backup list
        this.backups = this.backups.slice(-this.config.maxBackups);
    },

    // Delete backup
    async deleteBackup(backupId) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OperatorUpliftBackups', 1);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['backups'], 'readwrite');
                const store = transaction.objectStore('backups');
                const deleteRequest = store.delete(backupId);
                
                deleteRequest.onsuccess = () => resolve();
                deleteRequest.onerror = () => reject(deleteRequest.error);
            };
        });
    },

    // Render backup manager
    renderBackupManager() {
        return `
            <div class="backup-manager">
                <div class="backup-header">
                    <h2>🔄 Backup & Restore</h2>
                    <div class="backup-actions">
                        <button class="btn btn-primary" onclick="BackupRestoreSystem.createBackup('manual')">
                            Create Backup
                        </button>
                        <button class="btn btn-secondary" onclick="BackupRestoreSystem.showImportDialog()">
                            Import Data
                        </button>
                    </div>
                </div>

                <div class="backup-settings">
                    <h3>Settings</h3>
                    <label>
                        <input type="checkbox" ${this.config.autoBackupEnabled ? 'checked' : ''}
                            onchange="BackupRestoreSystem.toggleAutoBackup(this.checked)">
                        Enable automatic daily backups
                    </label>
                    <label>
                        <input type="checkbox" ${this.config.encryptBackups ? 'checked' : ''}
                            onchange="BackupRestoreSystem.toggleEncryption(this.checked)">
                        Encrypt backups
                    </label>
                </div>

                <div class="backup-list">
                    <h3>Available Backups</h3>
                    ${this.renderBackupList()}
                </div>

                <div class="export-section">
                    <h3>Export Data</h3>
                    <div class="export-options">
                        <button class="btn btn-sm" onclick="BackupRestoreSystem.exportData('json')">
                            Export as JSON
                        </button>
                        <button class="btn btn-sm" onclick="BackupRestoreSystem.exportData('csv')">
                            Export as CSV
                        </button>
                        <button class="btn btn-sm" onclick="BackupRestoreSystem.exportData('encrypted')">
                            Export Encrypted
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Render backup list
    renderBackupList() {
        if (this.backups.length === 0) {
            return '<p>No backups available</p>';
        }

        return `
            <div class="backups-grid">
                ${this.backups.map(backup => `
                    <div class="backup-item">
                        <div class="backup-info">
                            <h4>${backup.type === 'auto' ? '🔄' : '💾'} ${backup.description || backup.type}</h4>
                            <p>${new Date(backup.timestamp).toLocaleString()}</p>
                            <span class="backup-size">${this.formatSize(backup.size)}</span>
                            ${backup.encrypted ? '<span class="encrypted">🔒</span>' : ''}
                        </div>
                        <div class="backup-actions">
                            <button class="btn btn-sm" onclick="BackupRestoreSystem.restoreBackup('${backup.id}')">
                                Restore
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="BackupRestoreSystem.deleteBackupConfirm('${backup.id}')">
                                Delete
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Helper methods
    calculateDataSize(data) {
        const str = JSON.stringify(data);
        return new Blob([str]).size;
    },

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    getEncryptionKey() {
        // In production, use proper key management
        return 'demo-encryption-key';
    },

    clearCurrentData() {
        this.dataKeys.forEach(key => {
            localStorage.removeItem(key);
        });
    },

    validateImportData(data) {
        return data && typeof data === 'object' && data._metadata;
    },

    toggleAutoBackup(enabled) {
        this.config.autoBackupEnabled = enabled;
        this.saveBackupMetadata();
        if (enabled) {
            this.setupAutoBackup();
        }
    },

    toggleEncryption(enabled) {
        this.config.encryptBackups = enabled;
        this.saveBackupMetadata();
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for data changes to trigger backup
        const dataChangeEvents = [
            'goalCompleted', 'taskCompleted', 'achievementUnlocked',
            'habitCompleted', 'focusSessionEnd'
        ];

        dataChangeEvents.forEach(event => {
            document.addEventListener(event, () => {
                // Mark data as changed
                localStorage.setItem('dataChanged', 'true');
            });
        });

        // Check for changes periodically
        setInterval(() => {
            if (localStorage.getItem('dataChanged') === 'true') {
                localStorage.removeItem('dataChanged');
                // Consider auto-backup if significant time passed
                const hoursSinceBackup = (Date.now() - this.lastBackupTime) / (1000 * 60 * 60);
                if (hoursSinceBackup > 12 && this.config.autoBackupEnabled) {
                    this.createBackup('auto', 'Automatic backup after changes');
                }
            }
        }, 60000); // Check every minute
    },

    checkBackupIntegrity() {
        // Verify backups are accessible
        this.backups.forEach(async (backup) => {
            try {
                const data = await this.loadBackup(backup.id);
                if (!data) {
                    console.warn(`Backup ${backup.id} not found`);
                    // Remove from list
                    this.backups = this.backups.filter(b => b.id !== backup.id);
                    this.saveBackupMetadata();
                }
            } catch (error) {
                console.error(`Backup ${backup.id} integrity check failed:`, error);
            }
        });
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.BackupRestoreSystem.initialize());
} else {
    window.BackupRestoreSystem.initialize();
}
