/**
 * Complete Notification System
 * Push notifications, in-app notifications, email alerts with smart timing
 */

window.NotificationSystem = {
    // Notification categories and their default settings
    categories: {
        achievements: { 
            enabled: true, 
            push: true, 
            email: false, 
            sound: true,
            icon: '🏆',
            priority: 'high'
        },
        social: { 
            enabled: true, 
            push: true, 
            email: false, 
            sound: false,
            icon: '👥',
            priority: 'medium'
        },
        reminders: { 
            enabled: true, 
            push: true, 
            email: true, 
            sound: true,
            icon: '⏰',
            priority: 'high'
        },
        progress: { 
            enabled: true, 
            push: false, 
            email: true, 
            sound: false,
            icon: '📈',
            priority: 'low'
        },
        system: { 
            enabled: true, 
            push: false, 
            email: false, 
            sound: false,
            icon: '⚙️',
            priority: 'low'
        }
    },

    // Notification queue
    queue: [],
    history: [],
    unreadCount: 0,
    
    // Smart timing configuration
    smartTiming: {
        doNotDisturb: false,
        quietHours: { start: 22, end: 8 }, // 10 PM to 8 AM
        focusMode: false,
        delayDuringFocus: true
    },

    // Initialize the notification system
    async initialize() {
        this.loadSettings();
        this.loadHistory();
        await this.setupPushNotifications();
        this.setupInAppNotifications();
        this.setupEventListeners();
        this.checkPendingNotifications();
        this.updateNotificationBadge();
    },

    // Load notification settings
    loadSettings() {
        const saved = localStorage.getItem('notificationSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            Object.assign(this.categories, settings.categories || {});
            Object.assign(this.smartTiming, settings.smartTiming || {});
        }
    },

    // Save notification settings
    saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify({
            categories: this.categories,
            smartTiming: this.smartTiming
        }));
    },

    // Load notification history
    loadHistory() {
        const saved = localStorage.getItem('notificationHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.unreadCount = this.history.filter(n => !n.read).length;
        }
    },

    // Save notification history
    saveHistory() {
        // Keep only last 100 notifications
        this.history = this.history.slice(-100);
        localStorage.setItem('notificationHistory', JSON.stringify(this.history));
    },

    // Setup push notifications
    async setupPushNotifications() {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        // Check permission
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                await this.registerServiceWorker();
            }
        } else if (Notification.permission === 'granted') {
            await this.registerServiceWorker();
        }
    },

    // Register service worker for push notifications
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
                
                // Subscribe to push notifications
                await this.subscribeToPush(registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    },

    // Subscribe to push notifications
    async subscribeToPush(registration) {
        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'YOUR_VAPID_PUBLIC_KEY' // Replace with actual VAPID key
                )
            });

            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
        }
    },

    // Convert VAPID key
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    // Send subscription to server
    async sendSubscriptionToServer(subscription) {
        // In production, send to your backend
        console.log('Push subscription:', subscription);
        localStorage.setItem('pushSubscription', JSON.stringify(subscription));
    },

    // Setup in-app notifications
    setupInAppNotifications() {
        // Create notification center if it doesn't exist
        if (!document.getElementById('notificationCenter')) {
            const center = document.createElement('div');
            center.id = 'notificationCenter';
            center.className = 'notification-center';
            center.innerHTML = `
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <div class="notification-actions">
                        <button onclick="NotificationSystem.markAllAsRead()" title="Mark all as read">
                            <i class="fas fa-check-double"></i>
                        </button>
                        <button onclick="NotificationSystem.clearAll()" title="Clear all">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button onclick="NotificationSystem.toggleNotificationCenter()" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="notification-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="unread">Unread</button>
                    <button class="filter-btn" data-filter="achievements">Achievements</button>
                    <button class="filter-btn" data-filter="social">Social</button>
                    <button class="filter-btn" data-filter="reminders">Reminders</button>
                </div>
                <div class="notification-list" id="notificationList">
                    <!-- Notifications will be added here -->
                </div>
            `;

            center.style.cssText = `
                position: fixed;
                top: 60px;
                right: 20px;
                width: 400px;
                max-height: 600px;
                background: var(--bg-secondary);
                border: 1px solid var(--border-light);
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                display: none;
                overflow: hidden;
            `;

            document.body.appendChild(center);
        }

        // Create toast container if it doesn't exist
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    },

    // Send notification
    async send(title, message, options = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            title,
            message,
            category: options.category || 'system',
            timestamp: new Date().toISOString(),
            read: false,
            data: options.data || {},
            actions: options.actions || []
        };

        // Check if should send based on settings
        if (!this.shouldSendNotification(notification)) {
            return;
        }

        // Check smart timing
        if (this.shouldDelayNotification(notification)) {
            this.queue.push(notification);
            return;
        }

        // Add to history
        this.history.unshift(notification);
        this.unreadCount++;
        this.saveHistory();

        // Send based on category settings
        const categorySettings = this.categories[notification.category];

        // In-app toast
        if (categorySettings.enabled) {
            this.showToast(notification);
        }

        // Push notification
        if (categorySettings.push && Notification.permission === 'granted') {
            this.sendPushNotification(notification);
        }

        // Email notification (would need backend)
        if (categorySettings.email) {
            this.sendEmailNotification(notification);
        }

        // Play sound
        if (categorySettings.sound) {
            this.playNotificationSound();
        }

        // Update UI
        this.updateNotificationBadge();
        this.updateNotificationList();

        return notification;
    },

    // Check if should send notification
    shouldSendNotification(notification) {
        const category = this.categories[notification.category];
        return category && category.enabled;
    },

    // Check if should delay notification
    shouldDelayNotification(notification) {
        // Check Do Not Disturb
        if (this.smartTiming.doNotDisturb) {
            return true;
        }

        // Check quiet hours
        const now = new Date();
        const hour = now.getHours();
        const { start, end } = this.smartTiming.quietHours;
        
        if (start > end) { // Crosses midnight
            if (hour >= start || hour < end) {
                return true;
            }
        } else {
            if (hour >= start && hour < end) {
                return true;
            }
        }

        // Check focus mode
        if (this.smartTiming.focusMode && this.smartTiming.delayDuringFocus) {
            const priority = this.categories[notification.category].priority;
            return priority !== 'high';
        }

        return false;
    },

    // Show toast notification
    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `notification-toast ${notification.category}`;
        toast.innerHTML = `
            <div class="toast-icon">${this.categories[notification.category].icon}</div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close" onclick="NotificationSystem.dismissToast(this)">×</button>
        `;

        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
            pointer-events: all;
            animation: slideIn 0.3s ease;
            cursor: pointer;
        `;

        // Add click handler
        toast.onclick = () => {
            this.handleNotificationClick(notification);
            this.dismissToast(toast);
        };

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    },

    // Dismiss toast
    dismissToast(element) {
        const toast = element.closest('.notification-toast');
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    },

    // Send push notification
    sendPushNotification(notification) {
        if ('serviceWorker' in navigator && 'Notification' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(notification.title, {
                    body: notification.message,
                    icon: '/icon-192.png',
                    badge: '/badge-72.png',
                    tag: notification.id,
                    data: notification.data,
                    actions: notification.actions.map(action => ({
                        action: action.id,
                        title: action.title
                    }))
                });
            });
        }
    },

    // Send email notification (mock)
    async sendEmailNotification(notification) {
        // In production, this would call your backend API
        console.log('Email notification would be sent:', notification);
        
        // Mock API call
        try {
            const response = await fetch('/api/notifications/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: localStorage.getItem('userEmail'),
                    subject: notification.title,
                    body: notification.message,
                    category: notification.category
                })
            });
            
            if (!response.ok) {
                console.error('Failed to send email notification');
            }
        } catch (error) {
            console.error('Email notification error:', error);
        }
    },

    // Play notification sound
    playNotificationSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' + 
            'AkPVqzn67RiGAUzjtXzxHkpBCV1xe/gjDIIF2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWTAkPVqzn67RiGAUzjtXzxHkpBCV1xe/gjDIIF2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWTAkPVqzn67RiGAUzjtXzxHkpBCV1xe/gjDIIF2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWTAkPVqzn67RiGAU');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Could not play sound:', e));
    },

    // Handle notification click
    handleNotificationClick(notification) {
        // Mark as read
        this.markAsRead(notification.id);

        // Handle based on category
        switch (notification.category) {
            case 'achievements':
                window.navigate?.('achievements');
                break;
            case 'social':
                window.navigate?.('social');
                break;
            case 'reminders':
                if (notification.data.taskId) {
                    this.openTask(notification.data.taskId);
                }
                break;
            default:
                // Open notification center
                this.openNotificationCenter();
        }
    },

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.history.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount--;
            this.saveHistory();
            this.updateNotificationBadge();
            this.updateNotificationList();
        }
    },

    // Mark all as read
    markAllAsRead() {
        this.history.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.saveHistory();
        this.updateNotificationBadge();
        this.updateNotificationList();
        window.showToast('All notifications marked as read', 'success');
    },

    // Clear all notifications
    clearAll() {
        if (confirm('Clear all notifications?')) {
            this.history = [];
            this.unreadCount = 0;
            this.saveHistory();
            this.updateNotificationBadge();
            this.updateNotificationList();
            window.showToast('All notifications cleared', 'success');
        }
    },

    // Toggle notification center
    toggleNotificationCenter() {
        const center = document.getElementById('notificationCenter');
        if (center) {
            const isVisible = center.style.display === 'block';
            center.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.updateNotificationList();
            }
        }
    },

    // Open notification center
    openNotificationCenter() {
        const center = document.getElementById('notificationCenter');
        if (center) {
            center.style.display = 'block';
            this.updateNotificationList();
        }
    },

    // Update notification badge
    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'inline-block' : 'none';
        }
    },

    // Update notification list
    updateNotificationList(filter = 'all') {
        const list = document.getElementById('notificationList');
        if (!list) return;

        let filtered = this.history;
        
        if (filter === 'unread') {
            filtered = filtered.filter(n => !n.read);
        } else if (filter !== 'all') {
            filtered = filtered.filter(n => n.category === filter);
        }

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <p>No ${filter === 'all' ? '' : filter} notifications</p>
                </div>
            `;
            return;
        }

        list.innerHTML = filtered.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                 onclick="NotificationSystem.handleNotificationClick(${JSON.stringify(notification).replace(/"/g, '&quot;')})">
                <div class="notification-icon">${this.categories[notification.category].icon}</div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
                ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
            </div>
        `).join('');
    },

    // Format time
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    },

    // Check pending notifications
    checkPendingNotifications() {
        // Check queued notifications every minute
        setInterval(() => {
            const pending = [...this.queue];
            this.queue = [];
            
            pending.forEach(notification => {
                if (!this.shouldDelayNotification(notification)) {
                    this.send(notification.title, notification.message, {
                        category: notification.category,
                        data: notification.data,
                        actions: notification.actions
                    });
                } else {
                    this.queue.push(notification);
                }
            });
        }, 60000);
    },

    // Schedule notification
    scheduleNotification(title, message, date, options = {}) {
        const delay = new Date(date) - new Date();
        
        if (delay <= 0) {
            this.send(title, message, options);
        } else {
            setTimeout(() => {
                this.send(title, message, options);
            }, delay);
        }
    },

    // Render settings panel
    renderSettingsPanel() {
        return `
            <div class="notification-settings">
                <h3>Notification Settings</h3>
                
                <div class="settings-section">
                    <h4>Categories</h4>
                    ${Object.entries(this.categories).map(([key, settings]) => `
                        <div class="category-settings">
                            <div class="category-header">
                                <span>${settings.icon} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                <label class="switch">
                                    <input type="checkbox" 
                                           ${settings.enabled ? 'checked' : ''} 
                                           onchange="NotificationSystem.toggleCategory('${key}', this.checked)">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="category-options">
                                <label>
                                    <input type="checkbox" 
                                           ${settings.push ? 'checked' : ''} 
                                           onchange="NotificationSystem.updateCategorySetting('${key}', 'push', this.checked)">
                                    Push notifications
                                </label>
                                <label>
                                    <input type="checkbox" 
                                           ${settings.email ? 'checked' : ''} 
                                           onchange="NotificationSystem.updateCategorySetting('${key}', 'email', this.checked)">
                                    Email notifications
                                </label>
                                <label>
                                    <input type="checkbox" 
                                           ${settings.sound ? 'checked' : ''} 
                                           onchange="NotificationSystem.updateCategorySetting('${key}', 'sound', this.checked)">
                                    Sound
                                </label>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="settings-section">
                    <h4>Smart Timing</h4>
                    <label>
                        <input type="checkbox" 
                               ${this.smartTiming.doNotDisturb ? 'checked' : ''} 
                               onchange="NotificationSystem.toggleDoNotDisturb(this.checked)">
                        Do Not Disturb
                    </label>
                    <div class="quiet-hours">
                        <label>Quiet Hours:</label>
                        <input type="time" 
                               value="${String(this.smartTiming.quietHours.start).padStart(2, '0')}:00"
                               onchange="NotificationSystem.updateQuietHours('start', this.value)">
                        to
                        <input type="time" 
                               value="${String(this.smartTiming.quietHours.end).padStart(2, '0')}:00"
                               onchange="NotificationSystem.updateQuietHours('end', this.value)">
                    </div>
                    <label>
                        <input type="checkbox" 
                               ${this.smartTiming.delayDuringFocus ? 'checked' : ''} 
                               onchange="NotificationSystem.toggleDelayDuringFocus(this.checked)">
                        Delay low-priority during focus sessions
                    </label>
                </div>
            </div>
        `;
    },

    // Toggle category
    toggleCategory(category, enabled) {
        this.categories[category].enabled = enabled;
        this.saveSettings();
    },

    // Update category setting
    updateCategorySetting(category, setting, value) {
        this.categories[category][setting] = value;
        this.saveSettings();
    },

    // Toggle Do Not Disturb
    toggleDoNotDisturb(enabled) {
        this.smartTiming.doNotDisturb = enabled;
        this.saveSettings();
        
        if (enabled) {
            window.showToast('Do Not Disturb enabled', 'info');
        } else {
            window.showToast('Do Not Disturb disabled', 'info');
            // Process queued notifications
            this.checkPendingNotifications();
        }
    },

    // Update quiet hours
    updateQuietHours(type, time) {
        const hour = parseInt(time.split(':')[0]);
        this.smartTiming.quietHours[type] = hour;
        this.saveSettings();
    },

    // Toggle delay during focus
    toggleDelayDuringFocus(enabled) {
        this.smartTiming.delayDuringFocus = enabled;
        this.saveSettings();
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for various app events
        document.addEventListener('achievementUnlocked', (e) => {
            this.send('Achievement Unlocked!', e.detail.name, {
                category: 'achievements',
                data: e.detail
            });
        });

        document.addEventListener('taskCompleted', (e) => {
            this.send('Task Completed', e.detail.title, {
                category: 'progress',
                data: e.detail
            });
        });

        document.addEventListener('friendRequest', (e) => {
            this.send('New Friend Request', `${e.detail.name} wants to be your friend`, {
                category: 'social',
                data: e.detail,
                actions: [
                    { id: 'accept', title: 'Accept' },
                    { id: 'decline', title: 'Decline' }
                ]
            });
        });

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                this.updateNotificationList(e.target.dataset.filter);
            }
        });

        // Focus mode integration
        document.addEventListener('focusModeChanged', (e) => {
            this.smartTiming.focusMode = e.detail.active;
        });
    }
};

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-center {
        font-family: var(--font-family);
    }
    
    .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-light);
    }
    
    .notification-filters {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid var(--border-light);
    }
    
    .filter-btn {
        padding: 0.25rem 0.75rem;
        background: transparent;
        border: 1px solid var(--border-light);
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .filter-btn.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .notification-list {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .notification-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid var(--border-light);
        cursor: pointer;
        position: relative;
        transition: background 0.2s;
    }
    
    .notification-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .notification-item.unread {
        background: rgba(59, 130, 246, 0.1);
    }
    
    .unread-indicator {
        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: var(--primary-color);
        border-radius: 2px;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.NotificationSystem.initialize());
} else {
    window.NotificationSystem.initialize();
}
