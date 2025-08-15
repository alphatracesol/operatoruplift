/**
 * Enhanced Focus Sessions System
 * Pomodoro timer, focus music, session types, and statistics
 */

window.EnhancedFocusSystem = {
    // Session types configuration
    sessionTypes: {
        deepWork: {
            name: 'Deep Work',
            icon: '🧠',
            workDuration: 90,
            breakDuration: 15,
            description: '90-minute deep focus blocks',
            ambientSound: 'brown-noise',
            energyCost: 10
        },
        pomodoro: {
            name: 'Pomodoro',
            icon: '🍅',
            workDuration: 25,
            breakDuration: 5,
            description: 'Classic 25/5 Pomodoro technique',
            ambientSound: 'white-noise',
            energyCost: 5
        },
        learning: {
            name: 'Learning',
            icon: '📚',
            workDuration: 45,
            breakDuration: 10,
            description: 'Optimal for studying and retention',
            ambientSound: 'binaural-beats',
            energyCost: 7
        },
        creative: {
            name: 'Creative',
            icon: '🎨',
            workDuration: 60,
            breakDuration: 15,
            description: 'Extended creative flow sessions',
            ambientSound: 'nature-sounds',
            energyCost: 8
        },
        microFocus: {
            name: 'Micro Focus',
            icon: '⚡',
            workDuration: 15,
            breakDuration: 3,
            description: 'Quick bursts of focused work',
            ambientSound: 'pink-noise',
            energyCost: 3
        }
    },

    // Current session state
    currentSession: null,
    sessionHistory: [],
    statistics: {
        totalMinutes: 0,
        sessionsCompleted: 0,
        streakDays: 0,
        favoriteType: null,
        productiveHours: []
    },

    // Audio context for focus sounds
    audioContext: null,
    audioNodes: {},

    // Initialize system
    initialize() {
        this.loadSessionData();
        this.setupAudioContext();
        this.setupEventListeners();
        this.checkActiveSession();
    },

    // Load session data
    loadSessionData() {
        const history = localStorage.getItem('focusSessionHistory');
        if (history) {
            this.sessionHistory = JSON.parse(history);
        }
        
        const stats = localStorage.getItem('focusStatistics');
        if (stats) {
            Object.assign(this.statistics, JSON.parse(stats));
        }
        
        const active = localStorage.getItem('activeFocusSession');
        if (active) {
            this.currentSession = JSON.parse(active);
        }
    },

    // Save session data
    saveSessionData() {
        localStorage.setItem('focusSessionHistory', JSON.stringify(this.sessionHistory));
        localStorage.setItem('focusStatistics', JSON.stringify(this.statistics));
        if (this.currentSession) {
            localStorage.setItem('activeFocusSession', JSON.stringify(this.currentSession));
        } else {
            localStorage.removeItem('activeFocusSession');
        }
    },

    // Start focus session
    startFocusSession(type, customSettings = {}) {
        const sessionConfig = this.sessionTypes[type];
        if (!sessionConfig) return;
        
        // Check energy
        if (window.EnergySystem && !window.EnergySystem.consumeEnergy(sessionConfig.energyCost)) {
            window.showToast('Not enough energy for this session!', 'error');
            return;
        }
        
        // Create session
        this.currentSession = {
            id: `session_${Date.now()}`,
            type: type,
            config: { ...sessionConfig, ...customSettings },
            startTime: Date.now(),
            endTime: null,
            status: 'active',
            phase: 'work',
            pausedTime: 0,
            completedCycles: 0,
            targetCycles: customSettings.cycles || 4,
            distractions: [],
            notes: ''
        };
        
        // Save session
        this.saveSessionData();
        
        // Show session UI
        this.showSessionUI();
        
        // Start timer
        this.startTimer();
        
        // Start ambient sound
        if (sessionConfig.ambientSound) {
            this.playAmbientSound(sessionConfig.ambientSound);
        }
        
        // Enable distraction blocker
        this.enableDistractionBlocker();
        
        return this.currentSession;
    },

    // Show session UI
    showSessionUI() {
        const modal = document.createElement('div');
        modal.id = 'focusSessionModal';
        modal.className = 'focus-session-modal';
        modal.innerHTML = `
            <div class="session-content">
                <div class="session-header">
                    <h2>${this.currentSession.config.name} Session</h2>
                    <button class="minimize-btn" onclick="EnhancedFocusSystem.minimizeSession()">_</button>
                </div>
                
                <div class="timer-display">
                    <div class="timer-circle">
                        <svg width="200" height="200">
                            <circle cx="100" cy="100" r="90" stroke="#333" stroke-width="10" fill="none"/>
                            <circle id="timerProgress" cx="100" cy="100" r="90" 
                                stroke="var(--primary-color)" stroke-width="10" fill="none"
                                stroke-dasharray="565" stroke-dashoffset="565"
                                transform="rotate(-90 100 100)"/>
                        </svg>
                        <div class="timer-text">
                            <span id="timerMinutes">25</span>:<span id="timerSeconds">00</span>
                        </div>
                    </div>
                    <div class="phase-indicator">
                        <span id="phaseText">${this.currentSession.phase === 'work' ? 'Focus Time' : 'Break Time'}</span>
                    </div>
                </div>
                
                <div class="session-controls">
                    <button class="btn btn-icon" onclick="EnhancedFocusSystem.togglePause()">
                        <span id="pauseIcon">⏸️</span>
                    </button>
                    <button class="btn btn-icon" onclick="EnhancedFocusSystem.skipPhase()">
                        ⏭️
                    </button>
                    <button class="btn btn-icon" onclick="EnhancedFocusSystem.endSession()">
                        ⏹️
                    </button>
                </div>
                
                <div class="session-stats">
                    <div class="stat">
                        <span>Cycles</span>
                        <span id="cycleCount">${this.currentSession.completedCycles}/${this.currentSession.targetCycles}</span>
                    </div>
                    <div class="stat">
                        <span>Distractions</span>
                        <span id="distractionCount">0</span>
                    </div>
                </div>
                
                <div class="ambient-controls">
                    <label>Ambient Sound</label>
                    <select onchange="EnhancedFocusSystem.changeAmbientSound(this.value)">
                        <option value="none">None</option>
                        <option value="white-noise">White Noise</option>
                        <option value="brown-noise">Brown Noise</option>
                        <option value="pink-noise">Pink Noise</option>
                        <option value="nature-sounds">Nature</option>
                        <option value="binaural-beats">Binaural Beats</option>
                        <option value="lofi">Lo-Fi</option>
                    </select>
                    <input type="range" min="0" max="100" value="50" 
                        onchange="EnhancedFocusSystem.setVolume(this.value)">
                </div>
                
                <div class="session-notes">
                    <textarea placeholder="Session notes..." 
                        onchange="EnhancedFocusSystem.updateNotes(this.value)"></textarea>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(modal);
    },

    // Start timer
    startTimer() {
        const duration = this.currentSession.phase === 'work' 
            ? this.currentSession.config.workDuration * 60
            : this.currentSession.config.breakDuration * 60;
        
        let remaining = duration;
        
        this.timerInterval = setInterval(() => {
            if (this.currentSession.status === 'paused') return;
            
            remaining--;
            this.updateTimerDisplay(remaining, duration);
            
            if (remaining <= 0) {
                this.onPhaseComplete();
            }
        }, 1000);
    },

    // Update timer display
    updateTimerDisplay(remaining, total) {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        
        const minutesEl = document.getElementById('timerMinutes');
        const secondsEl = document.getElementById('timerSeconds');
        
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Update progress circle
        const progress = document.getElementById('timerProgress');
        if (progress) {
            const offset = 565 - (565 * remaining / total);
            progress.style.strokeDashoffset = offset;
        }
    },

    // Phase complete
    onPhaseComplete() {
        clearInterval(this.timerInterval);
        
        if (this.currentSession.phase === 'work') {
            this.currentSession.completedCycles++;
            this.playNotificationSound();
            
            if (this.currentSession.completedCycles >= this.currentSession.targetCycles) {
                this.completeSession();
            } else {
                this.currentSession.phase = 'break';
                this.showBreakNotification();
                this.startTimer();
            }
        } else {
            this.currentSession.phase = 'work';
            this.showWorkNotification();
            this.startTimer();
        }
        
        this.updateSessionUI();
        this.saveSessionData();
    },

    // Complete session
    completeSession() {
        this.currentSession.endTime = Date.now();
        this.currentSession.status = 'completed';
        
        // Calculate statistics
        const sessionMinutes = Math.floor((this.currentSession.endTime - this.currentSession.startTime) / 60000);
        this.statistics.totalMinutes += sessionMinutes;
        this.statistics.sessionsCompleted++;
        
        // Update productive hours
        const hour = new Date().getHours();
        if (!this.statistics.productiveHours.includes(hour)) {
            this.statistics.productiveHours.push(hour);
        }
        
        // Add to history
        this.sessionHistory.push(this.currentSession);
        
        // Award points
        const points = this.calculateSessionPoints();
        this.awardPoints(points);
        
        // Save data
        this.saveSessionData();
        
        // Show completion
        this.showCompletionModal(points);
        
        // Clear current session
        this.currentSession = null;
        localStorage.removeItem('activeFocusSession');
        
        // Stop sounds
        this.stopAllSounds();
        
        // Check achievements
        this.checkFocusAchievements();
    },

    // Calculate session points
    calculateSessionPoints() {
        const basePoints = 20;
        const cycleBonus = this.currentSession.completedCycles * 10;
        const focusBonus = this.currentSession.distractions.length === 0 ? 20 : 0;
        const typeMultiplier = this.currentSession.type === 'deepWork' ? 1.5 : 1;
        
        return Math.floor((basePoints + cycleBonus + focusBonus) * typeMultiplier);
    },

    // Setup audio context
    setupAudioContext() {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    },

    // Play ambient sound
    playAmbientSound(type) {
        if (!this.audioContext) return;
        
        // Stop existing sounds
        this.stopAllSounds();
        
        // Create noise generator based on type
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        switch (type) {
            case 'white-noise':
                // White noise implementation
                this.createWhiteNoise(gainNode);
                break;
            case 'brown-noise':
                // Brown noise implementation
                this.createBrownNoise(gainNode);
                break;
            case 'binaural-beats':
                // Binaural beats for focus
                this.createBinauralBeats(40); // 40Hz for focus
                break;
            case 'nature-sounds':
                // Play nature sounds
                this.playNatureSounds();
                break;
        }
        
        gainNode.gain.value = 0.5;
        gainNode.connect(this.audioContext.destination);
    },

    // Create white noise
    createWhiteNoise(gainNode) {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = this.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(gainNode);
        whiteNoise.start();
        
        this.audioNodes.whiteNoise = whiteNoise;
    },

    // Enable distraction blocker
    enableDistractionBlocker() {
        // Block distracting websites
        if (window.chrome && chrome.webRequest) {
            // Browser extension API for blocking
            const blockedSites = [
                '*://*.facebook.com/*',
                '*://*.twitter.com/*',
                '*://*.youtube.com/*',
                '*://*.reddit.com/*',
                '*://*.instagram.com/*'
            ];
            
            // This would require browser extension permissions
            console.log('Distraction blocker would block:', blockedSites);
        }
        
        // Track tab switches
        document.addEventListener('visibilitychange', this.handleDistraction.bind(this));
    },

    // Handle distraction
    handleDistraction() {
        if (document.hidden && this.currentSession && this.currentSession.status === 'active') {
            this.currentSession.distractions.push({
                timestamp: Date.now(),
                type: 'tab_switch'
            });
            
            const count = document.getElementById('distractionCount');
            if (count) {
                count.textContent = this.currentSession.distractions.length;
            }
        }
    },

    // Show completion modal
    showCompletionModal(points) {
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="completion-content">
                <h1>🎉 Session Complete!</h1>
                <div class="completion-stats">
                    <div class="stat">
                        <span>Duration</span>
                        <span>${this.currentSession.completedCycles * this.currentSession.config.workDuration} min</span>
                    </div>
                    <div class="stat">
                        <span>Points Earned</span>
                        <span>${points}</span>
                    </div>
                    <div class="stat">
                        <span>Focus Score</span>
                        <span>${this.calculateFocusScore()}%</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Great Work!
                </button>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
        `;
        
        document.body.appendChild(modal);
        
        // Remove session modal
        const sessionModal = document.getElementById('focusSessionModal');
        if (sessionModal) sessionModal.remove();
    },

    // Calculate focus score
    calculateFocusScore() {
        if (!this.currentSession) return 0;
        
        const maxDistractions = 10;
        const distractionPenalty = Math.min(this.currentSession.distractions.length, maxDistractions) * 10;
        const completionBonus = (this.currentSession.completedCycles / this.currentSession.targetCycles) * 100;
        
        return Math.max(0, Math.min(100, completionBonus - distractionPenalty));
    },

    // Render focus dashboard
    renderFocusDashboard() {
        return `
            <div class="focus-dashboard">
                <h2>🎯 Focus Sessions</h2>
                
                <div class="session-types">
                    ${Object.entries(this.sessionTypes).map(([key, type]) => `
                        <div class="session-type-card" onclick="EnhancedFocusSystem.startFocusSession('${key}')">
                            <span class="type-icon">${type.icon}</span>
                            <h3>${type.name}</h3>
                            <p>${type.description}</p>
                            <span class="duration">${type.workDuration} min work</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="focus-stats">
                    <h3>Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat">
                            <span>Total Focus Time</span>
                            <span>${Math.floor(this.statistics.totalMinutes / 60)}h ${this.statistics.totalMinutes % 60}m</span>
                        </div>
                        <div class="stat">
                            <span>Sessions Completed</span>
                            <span>${this.statistics.sessionsCompleted}</span>
                        </div>
                        <div class="stat">
                            <span>Focus Streak</span>
                            <span>${this.statistics.streakDays} days</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Helper functions
    togglePause() {
        if (this.currentSession.status === 'active') {
            this.currentSession.status = 'paused';
            this.currentSession.pausedTime = Date.now();
            document.getElementById('pauseIcon').textContent = '▶️';
        } else {
            this.currentSession.status = 'active';
            document.getElementById('pauseIcon').textContent = '⏸️';
        }
        this.saveSessionData();
    },

    skipPhase() {
        this.onPhaseComplete();
    },

    endSession() {
        if (confirm('End session early? You\'ll lose progress for this cycle.')) {
            this.completeSession();
        }
    },

    stopAllSounds() {
        Object.values(this.audioNodes).forEach(node => {
            if (node && node.stop) node.stop();
        });
        this.audioNodes = {};
    },

    awardPoints(points) {
        const current = parseInt(localStorage.getItem('userPoints') || '0');
        localStorage.setItem('userPoints', (current + points).toString());
    },

    checkFocusAchievements() {
        if (this.statistics.sessionsCompleted === 1 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('first_focus');
        }
        if (this.statistics.totalMinutes >= 600 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('focus_master');
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.quickStartPomodoro();
            }
        });
    },

    quickStartPomodoro() {
        if (!this.currentSession) {
            this.startFocusSession('pomodoro');
        }
    },

    checkActiveSession() {
        if (this.currentSession && this.currentSession.status === 'active') {
            this.showSessionUI();
            this.resumeTimer();
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.EnhancedFocusSystem.initialize());
} else {
    window.EnhancedFocusSystem.initialize();
}
