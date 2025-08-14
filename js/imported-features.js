/**
 * Imported Features Module
 * Implements Calendar, Themes, Quick Add Task, Onboarding, and Dashboard enhancements
 * Imported from reference files in FILES TO REVIEW directory
 */

// ============================================
// 1. CALENDAR SYSTEM
// ============================================

class CalendarSystem {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.tasks = new Map();
        this.draggedTask = null;
        this.init();
    }

    init() {
        this.createCalendarHTML();
        this.setupEventListeners();
        this.loadTasks();
        this.render();
    }

    createCalendarHTML() {
        // Check if calendar view already exists
        if (document.getElementById('calendar-view')) return;

        const calendarHTML = `
            <div id="calendar-view" class="view-content hidden">
                <div class="card">
                    <div id="calendar-header">
                        <button id="prev-month" class="btn btn-icon">←</button>
                        <h2 id="current-month"></h2>
                        <button id="next-month" class="btn btn-icon">→</button>
                    </div>
                    <div id="calendar-weekdays"></div>
                    <div id="calendar-days"></div>
                </div>
            </div>
        `;

        // Add to view container
        const viewContainer = document.getElementById('view-container');
        if (viewContainer) {
            viewContainer.insertAdjacentHTML('beforeend', calendarHTML);
        }

        // Add calendar styles
        this.injectCalendarStyles();
    }

    injectCalendarStyles() {
        if (document.getElementById('calendar-styles')) return;

        const styles = `
            <style id="calendar-styles">
                #calendar-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 1.5rem; 
                }
                #calendar-header h2 { 
                    font-size: 1.5rem; 
                    font-weight: 600; 
                }
                #calendar-header button { 
                    background: none; 
                    border: 1px solid var(--border-color); 
                    border-radius: 50%; 
                    width: 36px; 
                    height: 36px; 
                    cursor: pointer; 
                    transition: all 0.3s; 
                }
                #calendar-header button:hover { 
                    background-color: var(--bg-secondary); 
                    border-color: var(--primary-color);
                }
                #calendar-weekdays { 
                    display: grid; 
                    grid-template-columns: repeat(7, 1fr); 
                    text-align: center; 
                    font-weight: 600; 
                    color: var(--text-muted); 
                    margin-bottom: 0.5rem; 
                    padding-bottom: 0.5rem; 
                    border-bottom: 1px solid var(--border-color); 
                }
                #calendar-days { 
                    display: grid; 
                    grid-template-columns: repeat(7, 1fr); 
                    gap: 5px; 
                }
                .calendar-day {
                    min-height: 120px; 
                    border: 1px solid var(--border-color); 
                    border-radius: 0.5rem;
                    padding: 0.5rem; 
                    transition: all 0.3s; 
                    cursor: pointer;
                    background: var(--bg-secondary);
                }
                .calendar-day:hover { 
                    background-color: var(--bg-elevated); 
                    border-color: var(--primary-color); 
                }
                .calendar-day.other-month { 
                    opacity: 0.4; 
                }
                .calendar-day.today .day-number {
                    background-color: var(--primary-color); 
                    color: white;
                    border-radius: 50%; 
                    display: inline-block; 
                    width: 24px; 
                    height: 24px;
                    line-height: 24px; 
                    text-align: center;
                }
                .calendar-day.drag-over { 
                    border: 2px dashed var(--primary-color); 
                }
                .day-number { 
                    font-weight: 600; 
                }
                .calendar-tasks { 
                    margin-top: 0.5rem; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 4px; 
                }
                .calendar-task {
                    padding: 4px 6px; 
                    border-radius: 4px; 
                    font-size: 0.8rem;
                    white-space: nowrap; 
                    overflow: hidden; 
                    text-overflow: ellipsis;
                    cursor: grab; 
                    transition: all 0.3s;
                }
                .calendar-task.dragging { 
                    opacity: 0.5; 
                }
                .calendar-task.overdue { 
                    background-color: var(--danger-color); 
                    color: white; 
                }
                .calendar-task.today { 
                    background-color: var(--primary-color); 
                    color: white; 
                }
                .calendar-task.upcoming { 
                    background-color: var(--success-color); 
                    color: white; 
                }
                .calendar-task.completed { 
                    text-decoration: line-through; 
                    opacity: 0.7; 
                    background-color: var(--text-muted); 
                }
                @media (max-width: 768px) {
                    .calendar-day { 
                        min-height: 80px; 
                        font-size: 0.8rem; 
                    }
                    .calendar-task { 
                        font-size: 0.7rem; 
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEventListeners() {
        // Month navigation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prev-month') {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            }
            if (e.target.id === 'next-month') {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            }
        });

        // Drag and drop
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('calendar-task')) {
                this.draggedTask = e.target;
                e.target.classList.add('dragging');
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('calendar-task')) {
                e.target.classList.remove('dragging');
                this.draggedTask = null;
            }
        });

        document.addEventListener('dragover', (e) => {
            if (e.target.closest('.calendar-day')) {
                e.preventDefault();
                e.target.closest('.calendar-day').classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.target.closest('.calendar-day')) {
                e.target.closest('.calendar-day').classList.remove('drag-over');
            }
        });

        document.addEventListener('drop', (e) => {
            const day = e.target.closest('.calendar-day');
            if (day && this.draggedTask) {
                e.preventDefault();
                day.classList.remove('drag-over');
                this.moveTaskToDate(this.draggedTask, day.dataset.date);
            }
        });
    }

    render() {
        this.renderHeader();
        this.renderWeekdays();
        this.renderDays();
    }

    renderHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const header = document.getElementById('current-month');
        if (header) {
            header.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
    }

    renderWeekdays() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const container = document.getElementById('calendar-weekdays');
        if (container) {
            container.innerHTML = weekdays.map(day => `<div>${day}</div>`).join('');
        }
    }

    renderDays() {
        const container = document.getElementById('calendar-days');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        let html = '';
        const today = new Date();

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="calendar-day other-month" data-date="${year}-${month}-${day}">
                <div class="day-number">${day}</div>
                <div class="calendar-tasks"></div>
            </div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getDate() === day && 
                           today.getMonth() === month && 
                           today.getFullYear() === year;
            const dateStr = `${year}-${month + 1}-${day}`;
            
            html += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                <div class="day-number">${day}</div>
                <div class="calendar-tasks">${this.getTasksForDate(dateStr)}</div>
            </div>`;
        }

        // Next month days
        const totalCells = firstDay + daysInMonth;
        const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let day = 1; day <= nextMonthDays; day++) {
            html += `<div class="calendar-day other-month" data-date="${year}-${month + 2}-${day}">
                <div class="day-number">${day}</div>
                <div class="calendar-tasks"></div>
            </div>`;
        }

        container.innerHTML = html;
    }

    getTasksForDate(dateStr) {
        const tasks = this.tasks.get(dateStr) || [];
        return tasks.map(task => {
            const taskClass = this.getTaskClass(task);
            return `<div class="calendar-task ${taskClass}" draggable="true" data-task-id="${task.id}">
                ${task.title}
            </div>`;
        }).join('');
    }

    getTaskClass(task) {
        const today = new Date();
        const taskDate = new Date(task.date);
        
        if (task.completed) return 'completed';
        if (taskDate < today) return 'overdue';
        if (taskDate.toDateString() === today.toDateString()) return 'today';
        return 'upcoming';
    }

    loadTasks() {
        // Load tasks from localStorage or Firebase
        try {
            const saved = localStorage.getItem('calendar_tasks');
            if (saved) {
                const tasks = JSON.parse(saved);
                tasks.forEach(task => {
                    const dateKey = task.date;
                    if (!this.tasks.has(dateKey)) {
                        this.tasks.set(dateKey, []);
                    }
                    this.tasks.get(dateKey).push(task);
                });
            }
        } catch (error) {
            console.error('Error loading calendar tasks:', error);
        }
    }

    moveTaskToDate(taskElement, newDate) {
        const taskId = taskElement.dataset.taskId;
        const oldDate = taskElement.closest('.calendar-day').dataset.date;
        
        // Move task in data structure
        const oldTasks = this.tasks.get(oldDate) || [];
        const taskIndex = oldTasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            const task = oldTasks.splice(taskIndex, 1)[0];
            task.date = newDate;
            
            if (!this.tasks.has(newDate)) {
                this.tasks.set(newDate, []);
            }
            this.tasks.get(newDate).push(task);
            
            // Save and re-render
            this.saveTasks();
            this.render();
        }
    }

    saveTasks() {
        const allTasks = [];
        this.tasks.forEach((tasks) => {
            allTasks.push(...tasks);
        });
        localStorage.setItem('calendar_tasks', JSON.stringify(allTasks));
    }

    addTask(task) {
        const dateKey = task.date;
        if (!this.tasks.has(dateKey)) {
            this.tasks.set(dateKey, []);
        }
        this.tasks.get(dateKey).push(task);
        this.saveTasks();
        this.render();
    }
}

// ============================================
// 2. ADVANCED THEME SYSTEM
// ============================================

class AdvancedThemeSystem {
    constructor() {
        this.themes = {
            'cyber-blue': {
                name: 'Cyber Blue',
                primary: '#22d3ee',
                secondary: '#0891b2',
                accent: '#22d3ee',
                background: '#020617',
                backgroundSecondary: '#0f172a',
                text: '#e2e8f0',
                textMuted: '#64748b',
                glow: 'rgba(34, 211, 238, 0.5)'
            },
            'neon-pink': {
                name: 'Neon Pink',
                primary: '#ec4899',
                secondary: '#db2777',
                accent: '#ec4899',
                background: '#1a0a14',
                backgroundSecondary: '#2d1b26',
                text: '#fce7f3',
                textMuted: '#f9a8d4',
                glow: 'rgba(236, 72, 153, 0.5)'
            },
            'matrix-green': {
                name: 'Matrix Green',
                primary: '#22c55e',
                secondary: '#16a34a',
                accent: '#22c55e',
                background: '#0a1a0a',
                backgroundSecondary: '#14261a',
                text: '#dcfce7',
                textMuted: '#86efac',
                glow: 'rgba(34, 197, 94, 0.5)'
            },
            'sunset-orange': {
                name: 'Sunset Orange',
                primary: '#f97316',
                secondary: '#ea580c',
                accent: '#fb923c',
                background: '#0a0a0a',
                backgroundSecondary: '#1a1a1a',
                text: '#e5e7eb',
                textMuted: '#9ca3af',
                glow: 'rgba(249, 115, 22, 0.5)'
            },
            'deep-purple': {
                name: 'Deep Purple',
                primary: '#a855f7',
                secondary: '#9333ea',
                accent: '#a855f7',
                background: '#0f0a1a',
                backgroundSecondary: '#1e1a2d',
                text: '#f3e8ff',
                textMuted: '#d8b4fe',
                glow: 'rgba(168, 85, 247, 0.5)'
            },
            'arctic-white': {
                name: 'Arctic White',
                primary: '#0ea5e9',
                secondary: '#0284c7',
                accent: '#38bdf8',
                background: '#f8fafc',
                backgroundSecondary: '#e2e8f0',
                text: '#0f172a',
                textMuted: '#475569',
                glow: 'rgba(14, 165, 233, 0.3)'
            }
        };
        
        this.currentTheme = localStorage.getItem('selectedTheme') || 'sunset-orange';
        this.init();
    }

    init() {
        this.createThemeSelector();
        this.applyTheme(this.currentTheme);
        this.injectThemeStyles();
    }

    createThemeSelector() {
        // Check if theme selector already exists
        if (document.getElementById('theme-selector-advanced')) return;

        const selectorHTML = `
            <div id="theme-selector-advanced" class="theme-selector-container">
                <h3>Choose Theme</h3>
                <div class="theme-grid">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
                             data-theme="${key}">
                            <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary})"></div>
                            <span>${theme.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add to settings or create a modal
        const settingsView = document.querySelector('#settings-view .card') || document.querySelector('.settings-content');
        if (settingsView) {
            settingsView.insertAdjacentHTML('beforeend', selectorHTML);
        }

        // Add event listeners
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                
                // Update active state
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    injectThemeStyles() {
        if (document.getElementById('advanced-theme-styles')) return;

        const styles = `
            <style id="advanced-theme-styles">
                .theme-selector-container {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: var(--bg-secondary);
                    border-radius: 0.75rem;
                    border: 1px solid var(--border-color);
                }
                
                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                .theme-option {
                    cursor: pointer;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    border: 2px solid transparent;
                    text-align: center;
                    transition: all 0.3s;
                    background: var(--bg-primary);
                }
                
                .theme-option:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                .theme-option.active {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 20px var(--primary-glow);
                }
                
                .theme-preview {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin: 0 auto 0.5rem;
                    border: 2px solid var(--border-color);
                }
                
                .theme-option span {
                    font-size: 0.875rem;
                    font-weight: 500;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--primary-dark', theme.secondary);
        document.documentElement.style.setProperty('--primary-light', theme.accent);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--primary-glow', theme.glow);
        document.documentElement.style.setProperty('--bg-primary', theme.background);
        document.documentElement.style.setProperty('--bg-secondary', theme.backgroundSecondary);
        document.documentElement.style.setProperty('--bg-color', theme.background);
        document.documentElement.style.setProperty('--text-primary', theme.text);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--text-muted', theme.textMuted);
        document.documentElement.style.setProperty('--text-muted-color', theme.textMuted);

        // Save preference
        this.currentTheme = themeName;
        localStorage.setItem('selectedTheme', themeName);
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeName } 
        }));
    }
}

// ============================================
// 3. QUICK ADD TASK MODAL
// ============================================

class QuickAddTaskSystem {
    constructor() {
        this.init();
    }

    init() {
        this.createQuickAddButton();
        this.createQuickAddModal();
        this.setupEventListeners();
        this.injectStyles();
    }

    createQuickAddButton() {
        // Add floating quick add button
        if (document.getElementById('quick-add-fab')) return;

        const fabHTML = `
            <button id="quick-add-fab" class="quick-add-fab" title="Quick Add Task">
                <span>+</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', fabHTML);
    }

    createQuickAddModal() {
        if (document.getElementById('quick-add-modal')) return;

        const modalHTML = `
            <div id="quick-add-modal" class="modal">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2>Quick Add Task</h2>
                    <form id="quick-add-form">
                        <div class="form-group">
                            <label for="quick-task-title">Task Title</label>
                            <input type="text" id="quick-task-title" required placeholder="Enter task title...">
                        </div>
                        
                        <div class="form-group">
                            <label for="quick-task-description">Description (Optional)</label>
                            <textarea id="quick-task-description" rows="3" placeholder="Add details..."></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quick-task-priority">Priority</label>
                                <select id="quick-task-priority">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="quick-task-deadline">Deadline</label>
                                <input type="datetime-local" id="quick-task-deadline">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="quick-task-category">Category</label>
                            <select id="quick-task-category">
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="health">Health</option>
                                <option value="learning">Learning</option>
                                <option value="finance">Finance</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="quick-task-tags">Tags (comma separated)</label>
                            <input type="text" id="quick-task-tags" placeholder="tag1, tag2, tag3">
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" id="quick-add-cancel">Cancel</button>
                            <button type="submit" class="btn btn-primary">Add Task</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    injectStyles() {
        if (document.getElementById('quick-add-styles')) return;

        const styles = `
            <style id="quick-add-styles">
                .quick-add-fab {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .quick-add-fab:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
                    background: var(--primary-dark);
                }
                
                .quick-add-fab span {
                    font-size: 32px;
                    line-height: 1;
                }
                
                #quick-add-modal .modal-content {
                    max-width: 500px;
                }
                
                #quick-add-form .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                
                #quick-add-form .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                @media (max-width: 768px) {
                    #quick-add-form .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .quick-add-fab {
                        bottom: 20px;
                        right: 20px;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEventListeners() {
        // Open modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('#quick-add-fab')) {
                this.openModal();
            }
        });

        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.id === 'quick-add-cancel') {
                this.closeModal();
            }
        });

        // Submit form
        const form = document.getElementById('quick-add-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openModal();
            }
        });
    }

    openModal() {
        const modal = document.getElementById('quick-add-modal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('quick-task-title')?.focus();
        }
    }

    closeModal() {
        const modal = document.getElementById('quick-add-modal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('quick-add-form')?.reset();
        }
    }

    async handleSubmit() {
        const title = document.getElementById('quick-task-title').value;
        const description = document.getElementById('quick-task-description').value;
        const priority = document.getElementById('quick-task-priority').value;
        const deadline = document.getElementById('quick-task-deadline').value;
        const category = document.getElementById('quick-task-category').value;
        const tags = document.getElementById('quick-task-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        const task = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            deadline: deadline ? new Date(deadline).toISOString() : null,
            category,
            tags,
            status: 'active',
            createdAt: new Date().toISOString(),
            completed: false
        };

        try {
            // Save to Firebase if available
            if (window.firebase?.auth?.currentUser) {
                await firebase.firestore()
                    .collection('users')
                    .doc(firebase.auth.currentUser.uid)
                    .collection('goals')
                    .add(task);
            } else {
                // Save to localStorage
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                tasks.push(task);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            // Add to calendar if deadline is set
            if (deadline && window.calendarSystem) {
                const calendarTask = {
                    ...task,
                    date: deadline.split('T')[0]
                };
                window.calendarSystem.addTask(calendarTask);
            }

            // Show success message
            this.showToast('Task added successfully!', 'success');
            
            // Close modal
            this.closeModal();
            
            // Refresh views
            document.dispatchEvent(new CustomEvent('taskAdded', { detail: task }));
            
        } catch (error) {
            console.error('Error adding task:', error);
            this.showToast('Failed to add task', 'error');
        }
    }

    showToast(message, type = 'info') {
        // Use existing toast system or create simple one
        if (window.toastSystem) {
            window.toastSystem.show(message, type);
        } else {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#10b981' : '#ef4444'};
                color: white;
                border-radius: 8px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    }
}

// ============================================
// 4. ONBOARDING SYSTEM
// ============================================

class OnboardingSystem {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                element: '.logo',
                title: 'Welcome to Operator Uplift!',
                content: 'Your AI-powered goal achievement system. Let\'s take a quick tour.',
                position: 'bottom'
            },
            {
                element: '[data-view="dashboard"]',
                title: 'Dashboard',
                content: 'Track your progress, view stats, and get AI insights all in one place.',
                position: 'right'
            },
            {
                element: '[data-view="goals"]',
                title: 'Goals Management',
                content: 'Create, organize, and track your goals with our intelligent system.',
                position: 'right'
            },
            {
                element: '#quick-add-fab',
                title: 'Quick Add',
                content: 'Press this button or use Ctrl+K to quickly add new tasks anytime.',
                position: 'left'
            },
            {
                element: '[data-view="calendar"]',
                title: 'Calendar View',
                content: 'Visualize your tasks and deadlines. Drag and drop to reschedule.',
                position: 'right'
            },
            {
                element: '#theme-toggle-btn',
                title: 'Customize Your Experience',
                content: 'Switch themes and personalize your workspace.',
                position: 'left'
            }
        ];
        
        this.init();
    }

    init() {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            this.createOnboardingElements();
            setTimeout(() => this.start(), 1000);
        }
        
        // Add skip button for testing
        this.addSkipOption();
    }

    createOnboardingElements() {
        if (document.getElementById('onboarding-overlay')) return;

        const overlayHTML = `
            <div id="onboarding-overlay">
                <div id="onboarding-highlighter"></div>
                <div id="onboarding-tooltip">
                    <button class="onboarding-close">&times;</button>
                    <h3 id="onboarding-title"></h3>
                    <p id="onboarding-content"></p>
                    <div class="onboarding-actions">
                        <button id="onboarding-prev" class="btn btn-secondary">Previous</button>
                        <span id="onboarding-progress"></span>
                        <button id="onboarding-next" class="btn btn-primary">Next</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        this.injectOnboardingStyles();
        this.setupOnboardingListeners();
    }

    injectOnboardingStyles() {
        if (document.getElementById('onboarding-styles')) return;

        const styles = `
            <style id="onboarding-styles">
                #onboarding-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    background-color: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(2px);
                    opacity: 0;
                    display: none;
                    transition: opacity 0.5s ease;
                }
                
                #onboarding-overlay.active {
                    display: block;
                    opacity: 1;
                }
                
                #onboarding-highlighter {
                    position: absolute;
                    border: 2px dashed var(--primary-color);
                    border-radius: 8px;
                    box-shadow: 0 0 20px var(--primary-glow), 
                                inset 0 0 20px var(--primary-glow);
                    transition: all 0.5s ease-in-out;
                    pointer-events: none;
                }
                
                #onboarding-tooltip {
                    position: absolute;
                    background-color: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 1.5rem;
                    max-width: 350px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                    transition: all 0.5s ease-in-out;
                }
                
                #onboarding-tooltip h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--primary-color);
                }
                
                #onboarding-tooltip p {
                    margin: 0 0 1rem 0;
                    color: var(--text-muted);
                }
                
                .onboarding-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 24px;
                    cursor: pointer;
                }
                
                .onboarding-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                
                #onboarding-progress {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }
                
                .onboarding-skip {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    z-index: 10001;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    color: var(--text-muted);
                    transition: all 0.3s;
                }
                
                .onboarding-skip:hover {
                    color: var(--text-primary);
                    border-color: var(--primary-color);
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupOnboardingListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('onboarding-close')) {
                this.end();
            }
            if (e.target.id === 'onboarding-next') {
                this.nextStep();
            }
            if (e.target.id === 'onboarding-prev') {
                this.previousStep();
            }
        });
    }

    start() {
        const overlay = document.getElementById('onboarding-overlay');
        if (overlay) {
            overlay.classList.add('active');
            this.showStep(0);
        }
    }

    showStep(index) {
        if (index < 0 || index >= this.steps.length) return;
        
        this.currentStep = index;
        const step = this.steps[index];
        const element = document.querySelector(step.element);
        
        if (element) {
            this.highlightElement(element);
            this.showTooltip(element, step);
            this.updateProgress();
        }
    }

    highlightElement(element) {
        const highlighter = document.getElementById('onboarding-highlighter');
        if (!highlighter) return;
        
        const rect = element.getBoundingClientRect();
        highlighter.style.left = `${rect.left - 5}px`;
        highlighter.style.top = `${rect.top - 5}px`;
        highlighter.style.width = `${rect.width + 10}px`;
        highlighter.style.height = `${rect.height + 10}px`;
    }

    showTooltip(element, step) {
        const tooltip = document.getElementById('onboarding-tooltip');
        if (!tooltip) return;
        
        document.getElementById('onboarding-title').textContent = step.title;
        document.getElementById('onboarding-content').textContent = step.content;
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Position tooltip based on step configuration
        switch(step.position) {
            case 'bottom':
                tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
                tooltip.style.top = `${rect.bottom + 10}px`;
                break;
            case 'top':
                tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
                tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
                break;
            case 'left':
                tooltip.style.left = `${rect.left - tooltipRect.width - 10}px`;
                tooltip.style.top = `${rect.top + (rect.height - tooltipRect.height) / 2}px`;
                break;
            case 'right':
                tooltip.style.left = `${rect.right + 10}px`;
                tooltip.style.top = `${rect.top + (rect.height - tooltipRect.height) / 2}px`;
                break;
        }
        
        // Update button states
        document.getElementById('onboarding-prev').disabled = this.currentStep === 0;
        document.getElementById('onboarding-next').textContent = 
            this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next';
    }

    updateProgress() {
        const progress = document.getElementById('onboarding-progress');
        if (progress) {
            progress.textContent = `${this.currentStep + 1} / ${this.steps.length}`;
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.end();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    end() {
        const overlay = document.getElementById('onboarding-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        localStorage.setItem('hasSeenOnboarding', 'true');
        
        // Remove skip button
        const skipButton = document.querySelector('.onboarding-skip');
        if (skipButton) {
            skipButton.remove();
        }
    }

    addSkipOption() {
        const skipButton = document.createElement('button');
        skipButton.className = 'onboarding-skip';
        skipButton.textContent = 'Start Tour';
        skipButton.addEventListener('click', () => {
            localStorage.removeItem('hasSeenOnboarding');
            this.currentStep = 0;
            this.start();
        });
        document.body.appendChild(skipButton);
    }
}

// ============================================
// 5. INITIALIZATION
// ============================================

// Initialize all imported features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImportedFeatures);
} else {
    initializeImportedFeatures();
}

function initializeImportedFeatures() {
    // Initialize systems
    window.calendarSystem = new CalendarSystem();
    window.advancedThemeSystem = new AdvancedThemeSystem();
    window.quickAddTaskSystem = new QuickAddTaskSystem();
    window.onboardingSystem = new OnboardingSystem();
    
    // Add calendar to navigation if not exists
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('#sidebar-nav');
    if (navMenu && !document.querySelector('[data-view="calendar"]')) {
        const calendarNavItem = document.createElement('li');
        calendarNavItem.className = 'nav-item';
        calendarNavItem.innerHTML = `
            <a href="#" data-view="calendar">
                <span class="nav-icon">📅</span>
                <span class="nav-text">Calendar</span>
            </a>
        `;
        
        // Insert after goals
        const goalsItem = navMenu.querySelector('[data-view="goals"]')?.parentElement;
        if (goalsItem) {
            goalsItem.after(calendarNavItem);
        } else {
            navMenu.appendChild(calendarNavItem);
        }
    }
    
    console.log('✅ Imported features initialized:', {
        calendar: '✓',
        themes: '6 themes loaded',
        quickAdd: '✓',
        onboarding: '✓'
    });
}

// Export for use in other modules
export {
    CalendarSystem,
    AdvancedThemeSystem,
    QuickAddTaskSystem,
    OnboardingSystem
};
