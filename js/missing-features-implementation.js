/**
 * Missing Features Implementation Module
 * Implements critical features identified from reference files
 */

// ============================================
// 1. CALENDAR SYSTEM
// ============================================

class CalendarSystem {
    constructor() {
        this.events = new Map();
        this.view = 'month'; // month, week, day
        this.currentDate = new Date();
        this.selectedDate = null;
        this.init();
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
    }

    loadEvents() {
        // Load from localStorage or Firebase
        try {
            const saved = localStorage.getItem('calendar_events');
            if (saved) {
                const events = JSON.parse(saved);
                events.forEach(event => this.events.set(event.id, event));
            }
        } catch (error) {
            console.error('Error loading calendar events:', error);
        }
    }

    createCalendarHTML() {
        return `
            <div id="calendar-container" class="calendar-system">
                <div class="calendar-header">
                    <div class="calendar-nav">
                        <button class="btn-icon" onclick="window.calendarSystem.previousPeriod()">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h2 class="calendar-title">${this.getCalendarTitle()}</h2>
                        <button class="btn-icon" onclick="window.calendarSystem.nextPeriod()">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="calendar-view-switcher">
                        <button class="btn ${this.view === 'day' ? 'active' : ''}" onclick="window.calendarSystem.setView('day')">Day</button>
                        <button class="btn ${this.view === 'week' ? 'active' : ''}" onclick="window.calendarSystem.setView('week')">Week</button>
                        <button class="btn ${this.view === 'month' ? 'active' : ''}" onclick="window.calendarSystem.setView('month')">Month</button>
                    </div>
                </div>
                <div class="calendar-body">
                    ${this.renderCalendarView()}
                </div>
                <button class="fab-add-event" onclick="window.calendarSystem.showAddEventModal()">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
    }

    renderCalendarView() {
        switch(this.view) {
            case 'month':
                return this.renderMonthView();
            case 'week':
                return this.renderWeekView();
            case 'day':
                return this.renderDayView();
            default:
                return this.renderMonthView();
        }
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let html = `
            <div class="calendar-grid calendar-month">
                <div class="calendar-weekdays">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
                    <div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div class="calendar-days">
        `;

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDate(date);
            const dayEvents = this.getEventsForDate(date);
            const isToday = this.isToday(date);
            const isSelected = this.isSelected(date);
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" 
                     data-date="${dateStr}" onclick="window.calendarSystem.selectDate('${dateStr}')">
                    <div class="calendar-day-number">${day}</div>
                    ${dayEvents.length > 0 ? `
                        <div class="calendar-day-events">
                            ${dayEvents.slice(0, 3).map(event => `
                                <div class="calendar-event-dot" style="background: ${event.color || 'var(--accent-color)'}"></div>
                            `).join('')}
                            ${dayEvents.length > 3 ? `<span class="more">+${dayEvents.length - 3}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    renderWeekView() {
        const startOfWeek = this.getStartOfWeek(this.currentDate);
        const days = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push(date);
        }

        let html = `
            <div class="calendar-week">
                <div class="calendar-week-header">
                    ${days.map(date => `
                        <div class="calendar-week-day ${this.isToday(date) ? 'today' : ''}">
                            <div class="day-name">${date.toLocaleDateString('en', { weekday: 'short' })}</div>
                            <div class="day-number">${date.getDate()}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="calendar-week-body">
                    ${this.renderWeekHours(days)}
                </div>
            </div>
        `;
        
        return html;
    }

    renderWeekHours(days) {
        let html = '<div class="calendar-week-grid">';
        
        // Time column
        html += '<div class="time-column">';
        for (let hour = 0; hour < 24; hour++) {
            html += `<div class="time-slot">${hour.toString().padStart(2, '0')}:00</div>`;
        }
        html += '</div>';
        
        // Day columns
        days.forEach(date => {
            html += '<div class="day-column">';
            const dayEvents = this.getEventsForDate(date);
            
            for (let hour = 0; hour < 24; hour++) {
                const hourEvents = dayEvents.filter(event => {
                    const eventHour = new Date(event.startTime).getHours();
                    return eventHour === hour;
                });
                
                html += `<div class="hour-slot" data-date="${this.formatDate(date)}" data-hour="${hour}">`;
                hourEvents.forEach(event => {
                    html += `
                        <div class="calendar-event" style="background: ${event.color || 'var(--accent-color)'}">
                            ${event.title}
                        </div>
                    `;
                });
                html += '</div>';
            }
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }

    renderDayView() {
        const date = this.currentDate;
        const dayEvents = this.getEventsForDate(date);
        
        let html = `
            <div class="calendar-day-view">
                <div class="day-header">
                    <h3>${date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                </div>
                <div class="day-timeline">
        `;
        
        for (let hour = 0; hour < 24; hour++) {
            const hourEvents = dayEvents.filter(event => {
                const eventHour = new Date(event.startTime).getHours();
                return eventHour === hour;
            });
            
            html += `
                <div class="timeline-hour">
                    <div class="hour-label">${hour.toString().padStart(2, '0')}:00</div>
                    <div class="hour-content">
                        ${hourEvents.map(event => `
                            <div class="calendar-event-card" onclick="window.calendarSystem.editEvent('${event.id}')">
                                <div class="event-time">${this.formatTime(event.startTime)} - ${this.formatTime(event.endTime)}</div>
                                <div class="event-title">${event.title}</div>
                                ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                                ${event.location ? `<div class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        html += '</div></div>';
        return html;
    }

    addEvent(eventData) {
        const event = {
            id: 'event_' + Date.now(),
            title: eventData.title,
            description: eventData.description || '',
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            location: eventData.location || '',
            color: eventData.color || this.getRandomColor(),
            reminder: eventData.reminder || null,
            recurring: eventData.recurring || 'none',
            createdAt: Date.now(),
            ...eventData
        };
        
        this.events.set(event.id, event);
        this.saveEvents();
        this.render();
        
        // Show notification
        window.toastSystem?.show('Event added to calendar', 'success');
        
        // Set reminder if needed
        if (event.reminder) {
            this.setReminder(event);
        }
        
        return event;
    }

    editEvent(eventId) {
        const event = this.events.get(eventId);
        if (!event) return;
        
        // Open edit modal with event data
        this.showEditEventModal(event);
    }

    deleteEvent(eventId) {
        this.events.delete(eventId);
        this.saveEvents();
        this.render();
        window.toastSystem?.show('Event deleted', 'success');
    }

    setReminder(event) {
        const reminderTime = new Date(event.startTime).getTime() - (event.reminder * 60000);
        const now = Date.now();
        
        if (reminderTime > now) {
            setTimeout(() => {
                this.showReminder(event);
            }, reminderTime - now);
        }
    }

    showReminder(event) {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(event.title, {
                body: `Starting at ${this.formatTime(event.startTime)}`,
                icon: '/assets/images/icon-192.png'
            });
        }
        
        // In-app notification
        window.toastSystem?.show(`Reminder: ${event.title} starting soon!`, 'info');
    }

    getEventsForDate(date) {
        const dateStr = this.formatDate(date);
        return Array.from(this.events.values()).filter(event => {
            const eventDate = this.formatDate(new Date(event.startTime));
            return eventDate === dateStr;
        });
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelected(date) {
        return this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
    }

    selectDate(dateStr) {
        this.selectedDate = new Date(dateStr);
        this.render();
        this.showDayEvents(this.selectedDate);
    }

    showDayEvents(date) {
        const events = this.getEventsForDate(date);
        // Show events in a modal or sidebar
    }

    getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    getCalendarTitle() {
        const options = { month: 'long', year: 'numeric' };
        
        switch(this.view) {
            case 'month':
                return this.currentDate.toLocaleDateString('en', options);
            case 'week':
                const start = this.getStartOfWeek(this.currentDate);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            case 'day':
                return this.currentDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            default:
                return '';
        }
    }

    setView(view) {
        this.view = view;
        this.render();
    }

    previousPeriod() {
        switch(this.view) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() - 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() - 1);
                break;
        }
        this.render();
    }

    nextPeriod() {
        switch(this.view) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + 1);
                break;
        }
        this.render();
    }

    getRandomColor() {
        const colors = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    showAddEventModal() {
        const modal = document.createElement('div');
        modal.className = 'modal calendar-event-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add Event</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="calendar-event-form">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="event-title" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="event-description"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Start Date & Time</label>
                                <input type="datetime-local" id="event-start" required>
                            </div>
                            <div class="form-group">
                                <label>End Date & Time</label>
                                <input type="datetime-local" id="event-end" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Location</label>
                            <input type="text" id="event-location">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Color</label>
                                <input type="color" id="event-color" value="#f97316">
                            </div>
                            <div class="form-group">
                                <label>Reminder</label>
                                <select id="event-reminder">
                                    <option value="">No reminder</option>
                                    <option value="5">5 minutes before</option>
                                    <option value="15">15 minutes before</option>
                                    <option value="30">30 minutes before</option>
                                    <option value="60">1 hour before</option>
                                    <option value="1440">1 day before</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Recurring</label>
                            <select id="event-recurring">
                                <option value="none">Does not repeat</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="window.calendarSystem.saveEventFromModal()">Save Event</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Set default start time to selected date or now
        const startInput = document.getElementById('event-start');
        const endInput = document.getElementById('event-end');
        const now = this.selectedDate || new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        
        startInput.value = this.formatDateTimeLocal(now);
        const end = new Date(now);
        end.setHours(now.getHours() + 1);
        endInput.value = this.formatDateTimeLocal(end);
    }

    showEditEventModal(event) {
        this.showAddEventModal();
        
        // Fill in event data
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-start').value = this.formatDateTimeLocal(new Date(event.startTime));
        document.getElementById('event-end').value = this.formatDateTimeLocal(new Date(event.endTime));
        document.getElementById('event-location').value = event.location || '';
        document.getElementById('event-color').value = event.color || '#f97316';
        document.getElementById('event-reminder').value = event.reminder || '';
        document.getElementById('event-recurring').value = event.recurring || 'none';
        
        // Update modal title and button
        document.querySelector('.calendar-event-modal h2').textContent = 'Edit Event';
        const saveBtn = document.querySelector('.calendar-event-modal .btn-primary');
        saveBtn.textContent = 'Update Event';
        saveBtn.onclick = () => this.updateEventFromModal(event.id);
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    saveEventFromModal() {
        const form = document.getElementById('calendar-event-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const eventData = {
            title: document.getElementById('event-title').value,
            description: document.getElementById('event-description').value,
            startTime: new Date(document.getElementById('event-start').value).getTime(),
            endTime: new Date(document.getElementById('event-end').value).getTime(),
            location: document.getElementById('event-location').value,
            color: document.getElementById('event-color').value,
            reminder: parseInt(document.getElementById('event-reminder').value) || null,
            recurring: document.getElementById('event-recurring').value
        };
        
        this.addEvent(eventData);
        document.querySelector('.calendar-event-modal').remove();
    }

    updateEventFromModal(eventId) {
        const event = this.events.get(eventId);
        if (!event) return;
        
        event.title = document.getElementById('event-title').value;
        event.description = document.getElementById('event-description').value;
        event.startTime = new Date(document.getElementById('event-start').value).getTime();
        event.endTime = new Date(document.getElementById('event-end').value).getTime();
        event.location = document.getElementById('event-location').value;
        event.color = document.getElementById('event-color').value;
        event.reminder = parseInt(document.getElementById('event-reminder').value) || null;
        event.recurring = document.getElementById('event-recurring').value;
        
        this.saveEvents();
        this.render();
        document.querySelector('.calendar-event-modal').remove();
        window.toastSystem?.show('Event updated', 'success');
    }

    saveEvents() {
        const eventsArray = Array.from(this.events.values());
        localStorage.setItem('calendar_events', JSON.stringify(eventsArray));
    }

    render() {
        const container = document.getElementById('calendar-container');
        if (container) {
            container.outerHTML = this.createCalendarHTML();
        }
    }

    setupEventListeners() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// ============================================
// 2. QUICK ADD TASK SYSTEM
// ============================================

class QuickAddTask {
    constructor() {
        this.init();
    }

    init() {
        this.injectQuickAddButton();
        this.setupKeyboardShortcut();
    }

    injectQuickAddButton() {
        // Add floating action button
        const fab = document.createElement('button');
        fab.className = 'fab-quick-add';
        fab.innerHTML = '<i class="fas fa-plus"></i>';
        fab.onclick = () => this.showQuickAddModal();
        document.body.appendChild(fab);
    }

    setupKeyboardShortcut() {
        // Ctrl/Cmd + K to open quick add
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showQuickAddModal();
            }
        });
    }

    showQuickAddModal() {
        const modal = document.createElement('div');
        modal.className = 'modal quick-add-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Quick Add Task</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="quick-add-form">
                        <div class="form-group">
                            <input type="text" id="quick-task-title" placeholder="What needs to be done?" autofocus required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Category</label>
                                <select id="quick-task-category">
                                    <option value="personal">Personal</option>
                                    <option value="work">Work</option>
                                    <option value="health">Health</option>
                                    <option value="learning">Learning</option>
                                    <option value="finance">Finance</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Priority</label>
                                <select id="quick-task-priority">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Due Date (optional)</label>
                            <input type="datetime-local" id="quick-task-deadline">
                        </div>
                        <div class="form-group">
                            <label>Notes (optional)</label>
                            <textarea id="quick-task-notes" rows="2"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="window.quickAddTask.saveQuickTask()">
                        Add Task <kbd>Enter</kbd>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus on title input
        document.getElementById('quick-task-title').focus();
        
        // Submit on Enter
        document.getElementById('quick-add-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveQuickTask();
        });
    }

    async saveQuickTask() {
        const title = document.getElementById('quick-task-title').value.trim();
        if (!title) return;
        
        const taskData = {
            title,
            category: document.getElementById('quick-task-category').value,
            priority: document.getElementById('quick-task-priority').value,
            deadline: document.getElementById('quick-task-deadline').value || null,
            notes: document.getElementById('quick-task-notes').value || '',
            status: 'active',
            createdAt: Date.now()
        };
        
        // Save to Firebase or localStorage
        if (window.firebase?.firestore && window.firebase?.auth?.currentUser) {
            try {
                await firebase.firestore()
                    .collection('users')
                    .doc(firebase.auth.currentUser.uid)
                    .collection('goals')
                    .add({
                        ...taskData,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
            } catch (error) {
                console.error('Error saving task:', error);
            }
        } else {
            // Save to localStorage
            const tasks = JSON.parse(localStorage.getItem('quick_tasks') || '[]');
            tasks.push({ ...taskData, id: 'task_' + Date.now() });
            localStorage.setItem('quick_tasks', JSON.stringify(tasks));
        }
        
        // Close modal
        document.querySelector('.quick-add-modal').remove();
        
        // Show success message
        window.toastSystem?.show('Task added successfully!', 'success');
        
        // Refresh UI if needed
        if (window.loadUserGoals) {
            window.loadUserGoals();
        }
    }
}

// ============================================
// 3. NOTIFICATION PANEL
// ============================================

class NotificationPanel {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.init();
    }

    init() {
        this.loadNotifications();
        this.createNotificationBell();
        this.setupWebSocketConnection();
    }

    loadNotifications() {
        try {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                this.notifications = JSON.parse(saved);
                this.updateUnreadCount();
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    createNotificationBell() {
        const bellContainer = document.createElement('div');
        bellContainer.className = 'notification-bell-container';
        bellContainer.innerHTML = `
            <button class="notification-bell" onclick="window.notificationPanel.togglePanel()">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" style="display: ${this.unreadCount > 0 ? 'block' : 'none'}">
                    ${this.unreadCount > 99 ? '99+' : this.unreadCount}
                </span>
            </button>
            <div class="notification-panel" id="notification-panel">
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <button class="btn-text" onclick="window.notificationPanel.markAllAsRead()">
                        Mark all as read
                    </button>
                </div>
                <div class="notification-list">
                    ${this.renderNotifications()}
                </div>
            </div>
        `;
        
        // Add to header or appropriate location
        const header = document.querySelector('.header-right') || document.querySelector('header');
        if (header) {
            header.appendChild(bellContainer);
        }
    }

    renderNotifications() {
        if (this.notifications.length === 0) {
            return '<div class="no-notifications">No notifications</div>';
        }
        
        return this.notifications.slice(0, 20).map(notification => `
            <div class="notification-item ${!notification.read ? 'unread' : ''}" 
                 data-id="${notification.id}"
                 onclick="window.notificationPanel.handleNotificationClick('${notification.id}')">
                <div class="notification-icon">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
                ${!notification.read ? '<div class="notification-dot"></div>' : ''}
            </div>
        `).join('');
    }

    addNotification(notification) {
        const newNotification = {
            id: 'notif_' + Date.now(),
            timestamp: Date.now(),
            read: false,
            ...notification
        };
        
        this.notifications.unshift(newNotification);
        this.updateUnreadCount();
        this.saveNotifications();
        this.updateUI();
        
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/assets/images/icon-192.png',
                badge: '/assets/images/badge-72.png'
            });
        }
        
        // Play notification sound
        this.playNotificationSound();
    }

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        // Mark as read
        if (!notification.read) {
            notification.read = true;
            this.updateUnreadCount();
            this.saveNotifications();
            this.updateUI();
        }
        
        // Handle action if present
        if (notification.action) {
            this.executeNotificationAction(notification.action);
        }
    }

    executeNotificationAction(action) {
        switch(action.type) {
            case 'navigate':
                window.location.href = action.url;
                break;
            case 'modal':
                // Open specific modal
                if (window[action.modalName]) {
                    window[action.modalName]();
                }
                break;
            case 'function':
                // Execute function
                if (window[action.functionName]) {
                    window[action.functionName](...(action.args || []));
                }
                break;
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateUnreadCount();
        this.saveNotifications();
        this.updateUI();
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    togglePanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    getNotificationIcon(type) {
        const icons = {
            'achievement': '🏆',
            'task': '✅',
            'reminder': '⏰',
            'social': '👥',
            'system': 'ℹ️',
            'warning': '⚠️',
            'error': '❌',
            'success': '✨'
        };
        
        return icons[type] || '📬';
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return new Date(timestamp).toLocaleDateString();
    }

    playNotificationSound() {
        // Play notification sound if available
        const audio = new Audio('/assets/sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Silently fail if audio can't play
        });
    }

    saveNotifications() {
        // Keep only last 100 notifications
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100);
        }
        
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    updateUI() {
        // Update notification list
        const list = document.querySelector('.notification-list');
        if (list) {
            list.innerHTML = this.renderNotifications();
        }
        
        // Update badge
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
            badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
        }
    }

    setupWebSocketConnection() {
        // Setup real-time notifications if WebSocket server is available
        // This is a placeholder for WebSocket implementation
    }
}

// ============================================
// 4. ADVANCED THEME SYSTEM
// ============================================

class AdvancedThemeSystem {
    constructor() {
        this.themes = {
            'cyber-orange': {
                name: 'Cyber Orange',
                primary: '#f97316',
                secondary: '#fb923c',
                background: '#0a0a0a',
                backgroundGradient: 'linear-gradient(135deg, #111827, #0a0a0a)',
                text: '#e5e7eb',
                grid: 'rgba(249, 115, 22, 0.1)',
                particle: '#f97316'
            },
            'matrix-green': {
                name: 'Matrix Green',
                primary: '#00ff41',
                secondary: '#00cc33',
                background: '#0d0208',
                backgroundGradient: 'linear-gradient(135deg, #0d0208, #000000)',
                text: '#00ff41',
                grid: 'rgba(0, 255, 65, 0.1)',
                particle: '#00ff41'
            },
            'neon-purple': {
                name: 'Neon Purple',
                primary: '#a855f7',
                secondary: '#c084fc',
                background: '#0f0817',
                backgroundGradient: 'linear-gradient(135deg, #1e0936, #0f0817)',
                text: '#e9d5ff',
                grid: 'rgba(168, 85, 247, 0.1)',
                particle: '#a855f7'
            },
            'ocean-blue': {
                name: 'Ocean Blue',
                primary: '#22d3ee',
                secondary: '#67e8f9',
                background: '#020617',
                backgroundGradient: 'linear-gradient(135deg, #0f172a, #020617)',
                text: '#e0f2fe',
                grid: 'rgba(34, 211, 238, 0.1)',
                particle: '#22d3ee'
            },
            'sunset-red': {
                name: 'Sunset Red',
                primary: '#ef4444',
                secondary: '#f87171',
                background: '#18080a',
                backgroundGradient: 'linear-gradient(135deg, #3b0a0f, #18080a)',
                text: '#fee2e2',
                grid: 'rgba(239, 68, 68, 0.1)',
                particle: '#ef4444'
            }
        };
        
        this.currentTheme = 'cyber-orange';
        this.particleEffects = true;
        this.scanLineEffect = true;
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.createThemePanel();
        this.applyTheme(this.currentTheme);
        this.initEffects();
    }

    loadSavedTheme() {
        const saved = localStorage.getItem('advanced_theme');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    }

    createThemePanel() {
        const panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.innerHTML = `
            <button class="theme-toggle-btn" onclick="window.advancedThemeSystem.togglePanel()">
                <i class="fas fa-palette"></i>
            </button>
            <div class="theme-panel-content">
                <h3>Theme Settings</h3>
                <div class="theme-grid">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
                             onclick="window.advancedThemeSystem.applyTheme('${key}')">
                            <div class="theme-preview" style="background: ${theme.backgroundGradient}">
                                <div class="theme-color" style="background: ${theme.primary}"></div>
                            </div>
                            <span>${theme.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="theme-effects">
                    <label>
                        <input type="checkbox" ${this.particleEffects ? 'checked' : ''} 
                               onchange="window.advancedThemeSystem.toggleParticles(this.checked)">
                        Particle Effects
                    </label>
                    <label>
                        <input type="checkbox" ${this.scanLineEffect ? 'checked' : ''} 
                               onchange="window.advancedThemeSystem.toggleScanLine(this.checked)">
                        Scan Line Effect
                    </label>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        this.currentTheme = themeName;
        
        // Apply CSS variables
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--primary-light', theme.secondary);
        root.style.setProperty('--accent-color', theme.primary);
        root.style.setProperty('--accent-light', theme.secondary);
        root.style.setProperty('--bg-color', theme.background);
        root.style.setProperty('--text-color', theme.text);
        root.style.setProperty('--grid-color', theme.grid);
        root.style.setProperty('--particle-color', theme.particle);
        
        // Apply background gradient
        document.body.style.background = theme.backgroundGradient;
        
        // Update particle colors if tsParticles is active
        if (window.tsParticles && window.particlesInstance) {
            window.particlesInstance.options.particles.color.value = theme.particle;
            window.particlesInstance.options.particles.links.color = theme.particle;
            window.particlesInstance.refresh();
        }
        
        // Update active theme in panel
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.textContent.includes(theme.name));
        });
        
        // Save theme preference
        localStorage.setItem('advanced_theme', themeName);
        
        // Show notification
        window.toastSystem?.show(`Theme changed to ${theme.name}`, 'success');
    }

    togglePanel() {
        const panel = document.querySelector('.theme-panel-content');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    toggleParticles(enabled) {
        this.particleEffects = enabled;
        
        if (enabled) {
            // Enable particles
            if (window.particlesInstance) {
                window.particlesInstance.play();
            }
        } else {
            // Disable particles
            if (window.particlesInstance) {
                window.particlesInstance.pause();
            }
        }
        
        localStorage.setItem('particle_effects', enabled);
    }

    toggleScanLine(enabled) {
        this.scanLineEffect = enabled;
        
        const scanLine = document.getElementById('scan-line-effect');
        if (scanLine) {
            scanLine.style.display = enabled ? 'block' : 'none';
        }
        
        localStorage.setItem('scan_line_effect', enabled);
    }

    initEffects() {
        // Create scan line effect
        if (!document.getElementById('scan-line-effect')) {
            const scanLine = document.createElement('div');
            scanLine.id = 'scan-line-effect';
            scanLine.className = 'scan-line';
            scanLine.style.display = this.scanLineEffect ? 'block' : 'none';
            document.body.appendChild(scanLine);
        }
        
        // Initialize particle effects
        if (this.particleEffects && window.tsParticles) {
            this.initParticles();
        }
    }

    initParticles() {
        // Particle configuration based on current theme
        const theme = this.themes[this.currentTheme];
        
        tsParticles.load("tsparticles", {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: theme.particle
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: theme.particle,
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        }).then(container => {
            window.particlesInstance = container;
        });
    }
}

// ============================================
// 5. STYLES FOR MISSING FEATURES
// ============================================

function injectMissingFeaturesStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Calendar System Styles */
        .calendar-system {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .calendar-nav {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .calendar-title {
            font-size: 1.5rem;
            font-weight: 600;
        }

        .calendar-view-switcher {
            display: flex;
            gap: 8px;
        }

        .calendar-view-switcher .btn {
            padding: 8px 16px;
            font-size: 14px;
        }

        .calendar-view-switcher .btn.active {
            background: var(--primary-color);
            color: white;
        }

        .calendar-body {
            flex: 1;
            overflow: auto;
        }

        .calendar-grid {
            display: grid;
            gap: 1px;
            background: var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }

        .calendar-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: var(--bg-primary);
        }

        .calendar-weekdays > div {
            padding: 12px;
            text-align: center;
            font-weight: 600;
            font-size: 12px;
            color: var(--text-muted);
        }

        .calendar-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }

        .calendar-day {
            background: var(--bg-primary);
            padding: 8px;
            min-height: 80px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .calendar-day:hover {
            background: var(--bg-secondary);
        }

        .calendar-day.today {
            background: rgba(var(--primary-color-rgb), 0.1);
        }

        .calendar-day.selected {
            border: 2px solid var(--primary-color);
        }

        .calendar-day-number {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .calendar-day-events {
            display: flex;
            gap: 2px;
            flex-wrap: wrap;
        }

        .calendar-event-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }

        .fab-add-event {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s;
            z-index: 100;
        }

        .fab-add-event:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        /* Quick Add Task Styles */
        .fab-quick-add {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--accent-color);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s;
            z-index: 100;
        }

        .fab-quick-add:hover {
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .quick-add-modal .modal-content {
            width: 500px;
        }

        .quick-add-modal input[type="text"] {
            font-size: 18px;
            padding: 12px;
        }

        /* Notification Panel Styles */
        .notification-bell-container {
            position: relative;
        }

        .notification-bell {
            position: relative;
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 20px;
            cursor: pointer;
            padding: 8px;
        }

        .notification-badge {
            position: absolute;
            top: 0;
            right: 0;
            background: var(--danger-color);
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: bold;
            min-width: 18px;
            text-align: center;
        }

        .notification-panel {
            position: absolute;
            top: 100%;
            right: 0;
            width: 360px;
            max-height: 480px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            display: none;
            z-index: 1000;
        }

        .notification-panel.active {
            display: block;
        }

        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .notification-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .notification-item {
            display: flex;
            gap: 12px;
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.2s;
            position: relative;
        }

        .notification-item:hover {
            background: var(--bg-primary);
        }

        .notification-item.unread {
            background: rgba(var(--primary-color-rgb), 0.05);
        }

        .notification-icon {
            font-size: 20px;
        }

        .notification-content {
            flex: 1;
        }

        .notification-title {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .notification-message {
            font-size: 14px;
            color: var(--text-muted);
            margin-bottom: 4px;
        }

        .notification-time {
            font-size: 12px;
            color: var(--text-muted);
        }

        .notification-dot {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 8px;
            height: 8px;
            background: var(--primary-color);
            border-radius: 50%;
        }

        /* Theme Panel Styles */
        .theme-panel {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
        }

        .theme-toggle-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s;
        }

        .theme-toggle-btn:hover {
            transform: scale(1.1);
            border-color: var(--primary-color);
        }

        .theme-panel-content {
            position: absolute;
            bottom: 60px;
            left: 0;
            width: 320px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            display: none;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .theme-panel-content.active {
            display: block;
        }

        .theme-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin: 16px 0;
        }

        .theme-option {
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }

        .theme-option:hover {
            transform: scale(1.05);
        }

        .theme-option.active {
            outline: 2px solid var(--primary-color);
            border-radius: 8px;
        }

        .theme-preview {
            width: 100%;
            height: 60px;
            border-radius: 8px;
            margin-bottom: 8px;
            position: relative;
            overflow: hidden;
        }

        .theme-color {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
        }

        .theme-effects {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .theme-effects label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        /* Scan Line Effect */
        .scan-line {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(to bottom, transparent, var(--primary-color), transparent);
            opacity: 0.5;
            animation: scan-line 8s linear infinite;
            pointer-events: none;
            z-index: 9999;
        }

        @keyframes scan-line {
            0% { top: -10%; }
            100% { top: 110%; }
        }

        /* Form Styles */
        .form-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .form-group label {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-muted);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 10px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-color);
            font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        kbd {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 12px;
            font-family: monospace;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .calendar-header {
                flex-direction: column;
                gap: 12px;
            }

            .calendar-view-switcher {
                width: 100%;
                justify-content: space-between;
            }

            .notification-panel {
                width: 100vw;
                right: -16px;
            }

            .theme-panel {
                left: 50%;
                transform: translateX(-50%);
            }

            .theme-panel-content {
                left: 50%;
                transform: translateX(-50%);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ============================================
// 6. INITIALIZATION
// ============================================

// Initialize missing features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMissingFeatures);
} else {
    initializeMissingFeatures();
}

function initializeMissingFeatures() {
    // Inject styles
    injectMissingFeaturesStyles();
    
    // Initialize systems
    window.calendarSystem = new CalendarSystem();
    window.quickAddTask = new QuickAddTask();
    window.notificationPanel = new NotificationPanel();
    window.advancedThemeSystem = new AdvancedThemeSystem();
    
    // Add calendar to dashboard if dashboard exists
    const dashboardContent = document.getElementById('dashboard-content');
    if (dashboardContent) {
        const calendarSection = document.createElement('div');
        calendarSection.innerHTML = window.calendarSystem.createCalendarHTML();
        dashboardContent.appendChild(calendarSection);
    }
    
    console.log('✅ Missing features initialized');
}

// Export for use in other modules
export {
    CalendarSystem,
    QuickAddTask,
    NotificationPanel,
    AdvancedThemeSystem
};
