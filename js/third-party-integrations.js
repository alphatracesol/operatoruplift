/**
 * Third-party Integrations System
 * Google Calendar, Todoist, Notion, Slack, Discord, Zapier
 */

window.ThirdPartyIntegrations = {
    // Integration configurations
    integrations: {
        googleCalendar: {
            name: 'Google Calendar',
            icon: '📅',
            enabled: false,
            clientId: null,
            scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'],
            token: null
        },
        todoist: {
            name: 'Todoist',
            icon: '✅',
            enabled: false,
            apiKey: null,
            syncToken: null
        },
        notion: {
            name: 'Notion',
            icon: '📝',
            enabled: false,
            apiKey: null,
            databaseId: null
        },
        slack: {
            name: 'Slack',
            icon: '💬',
            enabled: false,
            webhookUrl: null,
            botToken: null
        },
        discord: {
            name: 'Discord',
            icon: '🎮',
            enabled: false,
            webhookUrl: null,
            botToken: null
        },
        zapier: {
            name: 'Zapier',
            icon: '⚡',
            enabled: false,
            webhooks: []
        }
    },

    // Sync status
    syncStatus: {
        lastSync: {},
        errors: [],
        inProgress: {}
    },

    // Initialize integrations
    initialize() {
        this.loadIntegrationSettings();
        this.setupEventListeners();
        this.checkEnabledIntegrations();
    },

    // Load integration settings
    loadIntegrationSettings() {
        const saved = localStorage.getItem('integrationSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            Object.keys(settings).forEach(key => {
                if (this.integrations[key]) {
                    Object.assign(this.integrations[key], settings[key]);
                }
            });
        }
    },

    // Save integration settings
    saveIntegrationSettings() {
        const settings = {};
        Object.keys(this.integrations).forEach(key => {
            settings[key] = {
                enabled: this.integrations[key].enabled,
                // Don't save sensitive data
                clientId: key === 'googleCalendar' ? this.integrations[key].clientId : undefined,
                webhookUrl: ['slack', 'discord'].includes(key) ? this.integrations[key].webhookUrl : undefined,
                databaseId: key === 'notion' ? this.integrations[key].databaseId : undefined
            };
        });
        localStorage.setItem('integrationSettings', JSON.stringify(settings));
    },

    // Google Calendar Integration
    async connectGoogleCalendar() {
        try {
            // Load Google API
            await this.loadGoogleAPI();
            
            // Initialize client
            await gapi.client.init({
                clientId: this.integrations.googleCalendar.clientId,
                scope: this.integrations.googleCalendar.scopes.join(' ')
            });

            // Sign in
            const authInstance = gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            
            // Store token
            this.integrations.googleCalendar.token = user.getAuthResponse().access_token;
            this.integrations.googleCalendar.enabled = true;
            
            this.saveIntegrationSettings();
            window.showToast('Google Calendar connected!', 'success');
            
            // Initial sync
            await this.syncGoogleCalendar();
            
        } catch (error) {
            console.error('Google Calendar connection failed:', error);
            window.showToast('Failed to connect Google Calendar', 'error');
        }
    },

    // Sync Google Calendar
    async syncGoogleCalendar() {
        if (!this.integrations.googleCalendar.enabled) return;
        
        this.setSyncStatus('googleCalendar', true);
        
        try {
            // Load calendar API
            await gapi.client.load('calendar', 'v3');
            
            // Get upcoming events
            const response = await gapi.client.calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: 50,
                singleEvents: true,
                orderBy: 'startTime'
            });
            
            const events = response.result.items;
            
            // Convert to tasks/goals
            const importedItems = events.map(event => ({
                id: `gcal_${event.id}`,
                title: event.summary,
                description: event.description,
                startDate: event.start.dateTime || event.start.date,
                endDate: event.end.dateTime || event.end.date,
                source: 'googleCalendar',
                originalId: event.id
            }));
            
            // Import to app
            await this.importItems(importedItems, 'googleCalendar');
            
            this.syncStatus.lastSync.googleCalendar = Date.now();
            window.showToast(`Synced ${events.length} events from Google Calendar`, 'success');
            
        } catch (error) {
            console.error('Google Calendar sync failed:', error);
            this.syncStatus.errors.push({
                integration: 'googleCalendar',
                error: error.message,
                timestamp: Date.now()
            });
            window.showToast('Google Calendar sync failed', 'error');
        } finally {
            this.setSyncStatus('googleCalendar', false);
        }
    },

    // Todoist Integration
    async connectTodoist(apiKey) {
        this.integrations.todoist.apiKey = apiKey;
        
        try {
            // Test connection
            const response = await fetch('https://api.todoist.com/rest/v2/projects', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            if (!response.ok) throw new Error('Invalid API key');
            
            this.integrations.todoist.enabled = true;
            this.saveIntegrationSettings();
            
            window.showToast('Todoist connected!', 'success');
            
            // Initial sync
            await this.syncTodoist();
            
        } catch (error) {
            console.error('Todoist connection failed:', error);
            window.showToast('Failed to connect Todoist', 'error');
        }
    },

    // Sync Todoist
    async syncTodoist() {
        if (!this.integrations.todoist.enabled) return;
        
        this.setSyncStatus('todoist', true);
        
        try {
            // Get active tasks
            const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
                headers: {
                    'Authorization': `Bearer ${this.integrations.todoist.apiKey}`
                }
            });
            
            if (!response.ok) throw new Error('API request failed');
            
            const tasks = await response.json();
            
            // Convert to app format
            const importedTasks = tasks.map(task => ({
                id: `todoist_${task.id}`,
                text: task.content,
                description: task.description,
                dueDate: task.due?.date,
                priority: task.priority,
                labels: task.labels,
                source: 'todoist',
                originalId: task.id,
                completed: task.is_completed
            }));
            
            // Import to app
            await this.importItems(importedTasks, 'todoist');
            
            this.syncStatus.lastSync.todoist = Date.now();
            window.showToast(`Imported ${tasks.length} tasks from Todoist`, 'success');
            
        } catch (error) {
            console.error('Todoist sync failed:', error);
            this.syncStatus.errors.push({
                integration: 'todoist',
                error: error.message,
                timestamp: Date.now()
            });
            window.showToast('Todoist sync failed', 'error');
        } finally {
            this.setSyncStatus('todoist', false);
        }
    },

    // Notion Integration
    async connectNotion(apiKey, databaseId) {
        this.integrations.notion.apiKey = apiKey;
        this.integrations.notion.databaseId = databaseId;
        
        try {
            // Test connection
            const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Notion-Version': '2022-06-28'
                }
            });
            
            if (!response.ok) throw new Error('Invalid credentials');
            
            this.integrations.notion.enabled = true;
            this.saveIntegrationSettings();
            
            window.showToast('Notion connected!', 'success');
            
        } catch (error) {
            console.error('Notion connection failed:', error);
            window.showToast('Failed to connect Notion', 'error');
        }
    },

    // Export to Notion
    async exportToNotion(data) {
        if (!this.integrations.notion.enabled) return;
        
        try {
            const pages = data.map(item => ({
                parent: { database_id: this.integrations.notion.databaseId },
                properties: {
                    Name: { title: [{ text: { content: item.title || item.name } }] },
                    Status: { select: { name: item.completed ? 'Done' : 'In Progress' } },
                    Priority: { select: { name: item.priority || 'Medium' } },
                    Tags: { multi_select: (item.tags || []).map(tag => ({ name: tag })) },
                    'Due Date': item.dueDate ? { date: { start: item.dueDate } } : undefined
                }
            }));
            
            // Create pages in batches
            const batchSize = 10;
            let exported = 0;
            
            for (let i = 0; i < pages.length; i += batchSize) {
                const batch = pages.slice(i, i + batchSize);
                
                await Promise.all(batch.map(page => 
                    fetch('https://api.notion.com/v1/pages', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.integrations.notion.apiKey}`,
                            'Notion-Version': '2022-06-28',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(page)
                    })
                ));
                
                exported += batch.length;
            }
            
            window.showToast(`Exported ${exported} items to Notion`, 'success');
            
        } catch (error) {
            console.error('Notion export failed:', error);
            window.showToast('Failed to export to Notion', 'error');
        }
    },

    // Slack Integration
    async connectSlack(webhookUrl) {
        this.integrations.slack.webhookUrl = webhookUrl;
        
        try {
            // Test webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: 'Operator Uplift connected successfully! 🚀'
                })
            });
            
            if (!response.ok) throw new Error('Invalid webhook');
            
            this.integrations.slack.enabled = true;
            this.saveIntegrationSettings();
            
            window.showToast('Slack connected!', 'success');
            
        } catch (error) {
            console.error('Slack connection failed:', error);
            window.showToast('Failed to connect Slack', 'error');
        }
    },

    // Send Slack notification
    async sendSlackNotification(message, options = {}) {
        if (!this.integrations.slack.enabled) return;
        
        try {
            const payload = {
                text: message,
                ...options
            };
            
            await fetch(this.integrations.slack.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
        } catch (error) {
            console.error('Slack notification failed:', error);
        }
    },

    // Discord Integration
    async connectDiscord(webhookUrl) {
        this.integrations.discord.webhookUrl = webhookUrl;
        
        try {
            // Test webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: 'Operator Uplift connected successfully! 🚀'
                })
            });
            
            if (!response.ok) throw new Error('Invalid webhook');
            
            this.integrations.discord.enabled = true;
            this.saveIntegrationSettings();
            
            window.showToast('Discord connected!', 'success');
            
        } catch (error) {
            console.error('Discord connection failed:', error);
            window.showToast('Failed to connect Discord', 'error');
        }
    },

    // Send Discord notification
    async sendDiscordNotification(content, embeds = []) {
        if (!this.integrations.discord.enabled) return;
        
        try {
            const payload = {
                content: content,
                embeds: embeds
            };
            
            await fetch(this.integrations.discord.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
        } catch (error) {
            console.error('Discord notification failed:', error);
        }
    },

    // Zapier Integration
    addZapierWebhook(name, url, events) {
        const webhook = {
            id: `zap_${Date.now()}`,
            name: name,
            url: url,
            events: events, // ['task.completed', 'goal.achieved', etc.]
            enabled: true
        };
        
        this.integrations.zapier.webhooks.push(webhook);
        this.integrations.zapier.enabled = true;
        this.saveIntegrationSettings();
        
        window.showToast('Zapier webhook added!', 'success');
        return webhook;
    },

    // Trigger Zapier webhook
    async triggerZapierWebhook(event, data) {
        if (!this.integrations.zapier.enabled) return;
        
        const webhooks = this.integrations.zapier.webhooks.filter(w => 
            w.enabled && w.events.includes(event)
        );
        
        for (const webhook of webhooks) {
            try {
                await fetch(webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: event,
                        data: data,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (error) {
                console.error(`Zapier webhook failed (${webhook.name}):`, error);
            }
        }
    },

    // Import items to app
    async importItems(items, source) {
        const imported = {
            tasks: 0,
            goals: 0,
            events: 0
        };
        
        for (const item of items) {
            // Determine item type
            if (item.startDate && item.endDate) {
                // Calendar event - create as task with time
                const task = {
                    id: item.id,
                    text: item.title,
                    description: item.description,
                    dueDate: item.startDate,
                    category: 'event',
                    source: source,
                    originalId: item.originalId
                };
                
                const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
                
                // Check if already exists
                if (!tasks.find(t => t.id === task.id)) {
                    tasks.push(task);
                    localStorage.setItem('userTasks', JSON.stringify(tasks));
                    imported.tasks++;
                }
                
            } else if (item.text) {
                // Task
                const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
                
                if (!tasks.find(t => t.id === item.id)) {
                    tasks.push(item);
                    localStorage.setItem('userTasks', JSON.stringify(tasks));
                    imported.tasks++;
                }
                
            } else if (item.name) {
                // Goal
                const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
                
                if (!goals.find(g => g.id === item.id)) {
                    goals.push({
                        ...item,
                        status: 'active',
                        progress: 0
                    });
                    localStorage.setItem('userGoals', JSON.stringify(goals));
                    imported.goals++;
                }
            }
        }
        
        return imported;
    },

    // Render integrations dashboard
    renderIntegrationsDashboard() {
        return `
            <div class="integrations-dashboard">
                <h2>🔗 Third-party Integrations</h2>
                
                <div class="integrations-grid">
                    ${Object.entries(this.integrations).map(([key, integration]) => `
                        <div class="integration-card ${integration.enabled ? 'connected' : ''}">
                            <div class="integration-header">
                                <span class="integration-icon">${integration.icon}</span>
                                <h3>${integration.name}</h3>
                                <span class="status-badge ${integration.enabled ? 'connected' : 'disconnected'}">
                                    ${integration.enabled ? 'Connected' : 'Not Connected'}
                                </span>
                            </div>
                            
                            <div class="integration-body">
                                ${this.renderIntegrationContent(key, integration)}
                            </div>
                            
                            <div class="integration-footer">
                                ${integration.enabled ? `
                                    <button class="btn btn-sm" onclick="ThirdPartyIntegrations.sync('${key}')">
                                        Sync Now
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="ThirdPartyIntegrations.disconnect('${key}')">
                                        Disconnect
                                    </button>
                                ` : `
                                    <button class="btn btn-primary btn-sm" onclick="ThirdPartyIntegrations.showConnectDialog('${key}')">
                                        Connect
                                    </button>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="sync-status">
                    <h3>Sync History</h3>
                    ${this.renderSyncHistory()}
                </div>
            </div>
        `;
    },

    // Render integration content
    renderIntegrationContent(key, integration) {
        if (!integration.enabled) {
            return `<p>Connect to sync your data</p>`;
        }
        
        const lastSync = this.syncStatus.lastSync[key];
        const syncTime = lastSync ? new Date(lastSync).toLocaleString() : 'Never';
        
        return `
            <div class="integration-info">
                <p>Last sync: ${syncTime}</p>
                ${this.syncStatus.inProgress[key] ? '<p class="syncing">Syncing...</p>' : ''}
            </div>
        `;
    },

    // Show connect dialog
    showConnectDialog(integration) {
        const dialogs = {
            googleCalendar: () => {
                const clientId = prompt('Enter your Google Client ID:');
                if (clientId) {
                    this.integrations.googleCalendar.clientId = clientId;
                    this.connectGoogleCalendar();
                }
            },
            todoist: () => {
                const apiKey = prompt('Enter your Todoist API key:');
                if (apiKey) {
                    this.connectTodoist(apiKey);
                }
            },
            notion: () => {
                const apiKey = prompt('Enter your Notion API key:');
                const databaseId = prompt('Enter your Notion database ID:');
                if (apiKey && databaseId) {
                    this.connectNotion(apiKey, databaseId);
                }
            },
            slack: () => {
                const webhookUrl = prompt('Enter your Slack webhook URL:');
                if (webhookUrl) {
                    this.connectSlack(webhookUrl);
                }
            },
            discord: () => {
                const webhookUrl = prompt('Enter your Discord webhook URL:');
                if (webhookUrl) {
                    this.connectDiscord(webhookUrl);
                }
            },
            zapier: () => {
                this.showZapierSetup();
            }
        };
        
        const dialog = dialogs[integration];
        if (dialog) dialog();
    },

    // Sync specific integration
    async sync(integration) {
        const syncMethods = {
            googleCalendar: () => this.syncGoogleCalendar(),
            todoist: () => this.syncTodoist(),
            // Others are push-only
        };
        
        const syncMethod = syncMethods[integration];
        if (syncMethod) {
            await syncMethod();
        } else {
            window.showToast('This integration doesn\'t support manual sync', 'info');
        }
    },

    // Disconnect integration
    disconnect(integration) {
        if (confirm(`Disconnect ${this.integrations[integration].name}?`)) {
            this.integrations[integration].enabled = false;
            this.integrations[integration].token = null;
            this.integrations[integration].apiKey = null;
            this.saveIntegrationSettings();
            
            window.showToast(`${this.integrations[integration].name} disconnected`, 'success');
            
            // Refresh UI
            if (document.querySelector('.integrations-dashboard')) {
                location.reload();
            }
        }
    },

    // Helper methods
    setSyncStatus(integration, inProgress) {
        this.syncStatus.inProgress[integration] = inProgress;
    },

    async loadGoogleAPI() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi.load('client:auth2', resolve);
            };
            document.head.appendChild(script);
        });
    },

    renderSyncHistory() {
        const recentErrors = this.syncStatus.errors.slice(-5);
        
        if (recentErrors.length === 0) {
            return '<p>No sync errors</p>';
        }
        
        return `
            <div class="sync-errors">
                ${recentErrors.map(error => `
                    <div class="sync-error">
                        <span class="error-integration">${error.integration}</span>
                        <span class="error-message">${error.error}</span>
                        <span class="error-time">${new Date(error.timestamp).toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for app events to trigger webhooks
        const events = [
            'taskCompleted',
            'goalAchieved',
            'levelUp',
            'streakMilestone',
            'achievementUnlocked'
        ];
        
        events.forEach(event => {
            document.addEventListener(event, (e) => {
                // Zapier webhooks
                this.triggerZapierWebhook(event, e.detail);
                
                // Slack/Discord notifications for important events
                if (['goalAchieved', 'levelUp'].includes(event)) {
                    const message = this.formatEventMessage(event, e.detail);
                    this.sendSlackNotification(message);
                    this.sendDiscordNotification(message);
                }
            });
        });
    },

    formatEventMessage(event, data) {
        const messages = {
            goalAchieved: `🎯 Goal achieved: ${data.goalName}`,
            levelUp: `🎉 Level up! Now level ${data.newLevel}`,
            streakMilestone: `🔥 ${data.days}-day streak!`,
            achievementUnlocked: `🏆 Achievement unlocked: ${data.achievementName}`
        };
        
        return messages[event] || `Event: ${event}`;
    },

    checkEnabledIntegrations() {
        // Auto-sync enabled integrations
        Object.keys(this.integrations).forEach(key => {
            if (this.integrations[key].enabled && this.syncStatus.lastSync[key]) {
                // Sync if it's been more than an hour
                const hoursSinceSync = (Date.now() - this.syncStatus.lastSync[key]) / (1000 * 60 * 60);
                if (hoursSinceSync > 1) {
                    this.sync(key);
                }
            }
        });
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.ThirdPartyIntegrations.initialize());
} else {
    window.ThirdPartyIntegrations.initialize();
}
