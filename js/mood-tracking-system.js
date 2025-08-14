/**
 * Mood Tracking System
 * Daily mood check-ins with analytics and AI-based recommendations
 */

window.MoodTrackingSystem = {
    // Mood options with emojis and values
    moodOptions: [
        { emoji: '😊', label: 'Great', value: 5, color: '#22c55e' },
        { emoji: '🙂', label: 'Good', value: 4, color: '#84cc16' },
        { emoji: '😐', label: 'Okay', value: 3, color: '#fbbf24' },
        { emoji: '😔', label: 'Low', value: 2, color: '#fb923c' },
        { emoji: '😢', label: 'Struggling', value: 1, color: '#ef4444' }
    ],

    // Mood factors/triggers
    moodFactors: [
        'Work stress', 'Sleep quality', 'Exercise', 'Social interaction',
        'Weather', 'Health', 'Productivity', 'Relationships',
        'Financial', 'Diet', 'Accomplishments', 'Relaxation'
    ],

    // Initialize the mood tracking system
    initialize() {
        this.loadMoodHistory();
        this.checkDailyMood();
        this.setupEventListeners();
        this.analyzeMoodPatterns();
    },

    // Load mood history from storage
    loadMoodHistory() {
        this.moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '{}');
    },

    // Save mood history
    saveMoodHistory() {
        localStorage.setItem('moodHistory', JSON.stringify(this.moodHistory));
    },

    // Check if user has logged mood today
    checkDailyMood() {
        const today = new Date().toISOString().split('T')[0];
        const lastMoodCheck = localStorage.getItem('lastMoodCheck');
        
        if (lastMoodCheck !== today) {
            // Show mood check-in modal after a delay
            setTimeout(() => {
                if (!this.moodHistory[today]) {
                    this.showMoodCheckIn();
                }
            }, 5000); // Show after 5 seconds
        }
    },

    // Show mood check-in modal
    showMoodCheckIn() {
        const modal = document.createElement('div');
        modal.className = 'mood-checkin-modal';
        modal.innerHTML = `
            <div class="mood-modal-content">
                <div class="mood-modal-header">
                    <h2>How are you feeling today?</h2>
                    <button class="close-btn" onclick="MoodTrackingSystem.closeMoodModal()">×</button>
                </div>
                
                <div class="mood-options">
                    ${this.moodOptions.map((mood, index) => `
                        <button class="mood-option" 
                                onclick="MoodTrackingSystem.selectMood(${mood.value})"
                                style="--mood-color: ${mood.color}">
                            <span class="mood-emoji">${mood.emoji}</span>
                            <span class="mood-label">${mood.label}</span>
                        </button>
                    `).join('')}
                </div>
                
                <div class="mood-factors-section" id="moodFactorsSection" style="display: none;">
                    <h3>What's influencing your mood?</h3>
                    <div class="mood-factors">
                        ${this.moodFactors.map(factor => `
                            <label class="factor-chip">
                                <input type="checkbox" value="${factor}" name="moodFactor">
                                <span>${factor}</span>
                            </label>
                        `).join('')}
                    </div>
                    
                    <div class="mood-note">
                        <textarea id="moodNote" placeholder="Add a note (optional)..." rows="3"></textarea>
                    </div>
                    
                    <button class="btn btn-primary" onclick="MoodTrackingSystem.saveMoodEntry()">
                        Save Mood Entry
                    </button>
                </div>
                
                <div class="mood-skip">
                    <button class="btn-link" onclick="MoodTrackingSystem.skipMoodCheckIn()">
                        Skip for today
                    </button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);
        this.currentModal = modal;
    },

    // Select mood value
    selectMood(value) {
        this.selectedMood = value;
        
        // Show factors section
        const factorsSection = document.getElementById('moodFactorsSection');
        if (factorsSection) {
            factorsSection.style.display = 'block';
            
            // Highlight selected mood
            document.querySelectorAll('.mood-option').forEach((btn, index) => {
                if (this.moodOptions[index].value === value) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }
    },

    // Save mood entry
    saveMoodEntry() {
        if (!this.selectedMood) {
            window.showToast('Please select a mood first', 'warning');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const selectedFactors = Array.from(document.querySelectorAll('input[name="moodFactor"]:checked'))
            .map(cb => cb.value);
        const note = document.getElementById('moodNote')?.value || '';

        // Create mood entry
        const moodEntry = {
            date: today,
            time: new Date().toISOString(),
            value: this.selectedMood,
            factors: selectedFactors,
            note: note,
            weather: this.getCurrentWeather(), // Optional: integrate with weather API
            energy: window.EnergySystem?.currentEnergy || null
        };

        // Save to history
        this.moodHistory[today] = moodEntry;
        this.saveMoodHistory();

        // Update last check
        localStorage.setItem('lastMoodCheck', today);

        // Get AI recommendation based on mood
        this.getAIRecommendation(moodEntry);

        // Check mood-based achievements
        this.checkMoodAchievements();

        // Update mood analytics
        this.updateMoodAnalytics();

        // Close modal
        this.closeMoodModal();

        // Show success message
        window.showToast('Mood logged successfully!', 'success');
    },

    // Get AI recommendation based on mood
    async getAIRecommendation(moodEntry) {
        if (!window.AIIntegration) return;

        const moodLabel = this.moodOptions.find(m => m.value === moodEntry.value)?.label;
        const factors = moodEntry.factors.join(', ');

        const prompt = `User's mood is ${moodLabel} (${moodEntry.value}/5). 
        Influencing factors: ${factors || 'none specified'}. 
        ${moodEntry.note ? `Note: ${moodEntry.note}` : ''}
        Provide a brief, supportive recommendation or activity suggestion.`;

        try {
            const recommendation = await window.AIIntegration.requestAdvice(prompt);
            this.showMoodRecommendation(recommendation, moodEntry.value);
        } catch (error) {
            console.error('Failed to get AI recommendation:', error);
            this.showDefaultRecommendation(moodEntry.value);
        }
    },

    // Show mood-based recommendation
    showMoodRecommendation(recommendation, moodValue) {
        const card = document.createElement('div');
        card.className = 'mood-recommendation-card';
        card.innerHTML = `
            <div class="recommendation-content">
                <h3>💡 Recommendation for you</h3>
                <p>${recommendation}</p>
                ${moodValue <= 2 ? `
                    <div class="support-resources">
                        <h4>Support Resources</h4>
                        <button onclick="MoodTrackingSystem.startBreathingExercise()">
                            🧘 Breathing Exercise
                        </button>
                        <button onclick="MoodTrackingSystem.suggestEasyTask()">
                            ✨ Easy Win Task
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        // Add to dashboard or notification area
        const container = document.getElementById('mood-recommendation-container') || 
                         document.querySelector('.dashboard-content');
        if (container) {
            container.insertBefore(card, container.firstChild);
            
            // Auto-remove after 30 seconds
            setTimeout(() => card.remove(), 30000);
        }
    },

    // Show default recommendation based on mood value
    showDefaultRecommendation(moodValue) {
        const recommendations = {
            5: "Fantastic! Channel this positive energy into tackling your most important task today.",
            4: "You're doing well! This is a great time to work on your goals steadily.",
            3: "It's okay to have neutral days. Focus on small, achievable tasks to build momentum.",
            2: "Be gentle with yourself. Consider taking breaks and doing activities that bring you joy.",
            1: "I'm here for you. Remember, it's okay to take things slow. Focus on self-care today."
        };

        this.showMoodRecommendation(recommendations[moodValue], moodValue);
    },

    // Start breathing exercise for low mood
    startBreathingExercise() {
        const modal = document.createElement('div');
        modal.className = 'breathing-exercise-modal';
        modal.innerHTML = `
            <div class="breathing-content">
                <h2>Breathing Exercise</h2>
                <div class="breathing-circle" id="breathingCircle">
                    <span class="breathing-text" id="breathingText">Breathe In</span>
                </div>
                <p class="breathing-instruction">Follow the circle's rhythm</p>
                <button class="btn btn-secondary" onclick="MoodTrackingSystem.stopBreathingExercise()">
                    Done
                </button>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.9);
        `;

        document.body.appendChild(modal);
        this.breathingModal = modal;

        // Start animation
        this.animateBreathing();
    },

    // Animate breathing circle
    animateBreathing() {
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        if (!circle || !text) return;

        let phase = 0;
        const phases = [
            { text: 'Breathe In', duration: 4000, scale: 1.5 },
            { text: 'Hold', duration: 4000, scale: 1.5 },
            { text: 'Breathe Out', duration: 4000, scale: 1 },
            { text: 'Hold', duration: 4000, scale: 1 }
        ];

        const animate = () => {
            const current = phases[phase];
            text.textContent = current.text;
            circle.style.transform = `scale(${current.scale})`;
            circle.style.transition = `transform ${current.duration}ms ease-in-out`;

            this.breathingTimeout = setTimeout(() => {
                phase = (phase + 1) % phases.length;
                if (this.breathingModal) {
                    animate();
                }
            }, current.duration);
        };

        animate();
    },

    // Stop breathing exercise
    stopBreathingExercise() {
        if (this.breathingTimeout) {
            clearTimeout(this.breathingTimeout);
        }
        if (this.breathingModal) {
            this.breathingModal.remove();
            this.breathingModal = null;
        }
        window.showToast('Great job! Take care of yourself.', 'success');
    },

    // Suggest an easy task for low mood
    suggestEasyTask() {
        const easyTasks = [
            'Drink a glass of water',
            'Take a 5-minute walk',
            'Listen to your favorite song',
            'Write down 3 things you\'re grateful for',
            'Stretch for 2 minutes',
            'Send a message to a friend',
            'Tidy up one small area',
            'Look at photos that make you smile'
        ];

        const task = easyTasks[Math.floor(Math.random() * easyTasks.length)];
        
        if (confirm(`How about this easy win: "${task}"?\n\nWould you like to add it to your tasks?`)) {
            // Add to tasks
            const taskData = {
                id: Date.now(),
                title: task,
                category: 'Self-care',
                priority: 'low',
                energy: 5
            };

            const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
            tasks.unshift(taskData);
            localStorage.setItem('userTasks', JSON.stringify(tasks));

            window.showToast('Task added! You\'ve got this! 💪', 'success');
        }
    },

    // Analyze mood patterns
    analyzeMoodPatterns() {
        const entries = Object.values(this.moodHistory);
        if (entries.length < 7) return; // Need at least a week of data

        // Calculate average mood
        const avgMood = entries.reduce((sum, e) => sum + e.value, 0) / entries.length;

        // Find most common factors
        const factorCounts = {};
        entries.forEach(entry => {
            entry.factors.forEach(factor => {
                factorCounts[factor] = (factorCounts[factor] || 0) + 1;
            });
        });

        // Detect patterns
        const patterns = {
            average: avgMood,
            trend: this.calculateMoodTrend(entries),
            commonFactors: Object.entries(factorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([factor]) => factor),
            weekdayAnalysis: this.analyzeWeekdayMoods(entries),
            suggestions: this.generateSuggestions(avgMood, factorCounts)
        };

        // Store patterns
        localStorage.setItem('moodPatterns', JSON.stringify(patterns));

        return patterns;
    },

    // Calculate mood trend
    calculateMoodTrend(entries) {
        if (entries.length < 2) return 'stable';

        const recent = entries.slice(-7);
        const older = entries.slice(-14, -7);

        const recentAvg = recent.reduce((sum, e) => sum + e.value, 0) / recent.length;
        const olderAvg = older.length > 0 ? 
            older.reduce((sum, e) => sum + e.value, 0) / older.length : recentAvg;

        if (recentAvg > olderAvg + 0.5) return 'improving';
        if (recentAvg < olderAvg - 0.5) return 'declining';
        return 'stable';
    },

    // Analyze weekday moods
    analyzeWeekdayMoods(entries) {
        const weekdayMoods = {};
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        entries.forEach(entry => {
            const day = new Date(entry.date).getDay();
            const dayName = weekdays[day];
            
            if (!weekdayMoods[dayName]) {
                weekdayMoods[dayName] = [];
            }
            weekdayMoods[dayName].push(entry.value);
        });

        // Calculate averages
        Object.keys(weekdayMoods).forEach(day => {
            const moods = weekdayMoods[day];
            weekdayMoods[day] = moods.reduce((sum, m) => sum + m, 0) / moods.length;
        });

        return weekdayMoods;
    },

    // Generate suggestions based on patterns
    generateSuggestions(avgMood, factorCounts) {
        const suggestions = [];

        if (avgMood < 3) {
            suggestions.push('Consider talking to someone you trust about how you\'re feeling');
            suggestions.push('Try incorporating more self-care activities into your routine');
        }

        if (factorCounts['Sleep quality'] > 3) {
            suggestions.push('Sleep seems to affect your mood. Try improving your sleep hygiene');
        }

        if (factorCounts['Exercise'] > 3) {
            suggestions.push('Exercise impacts your mood. Keep up regular physical activity');
        }

        if (factorCounts['Work stress'] > 3) {
            suggestions.push('Work stress is a factor. Consider stress management techniques');
        }

        return suggestions;
    },

    // Render mood analytics dashboard
    renderMoodAnalytics() {
        const patterns = JSON.parse(localStorage.getItem('moodPatterns') || '{}');
        const entries = Object.values(this.moodHistory);

        if (entries.length === 0) {
            return '<p>Start tracking your mood to see analytics</p>';
        }

        return `
            <div class="mood-analytics">
                <h2>Mood Insights</h2>
                
                <div class="mood-stats">
                    <div class="stat-card">
                        <h3>Average Mood</h3>
                        <div class="stat-value">${patterns.average?.toFixed(1) || 'N/A'}/5</div>
                    </div>
                    <div class="stat-card">
                        <h3>Trend</h3>
                        <div class="stat-value ${patterns.trend}">${patterns.trend || 'N/A'}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Entries</h3>
                        <div class="stat-value">${entries.length}</div>
                    </div>
                </div>
                
                <div class="mood-chart">
                    <h3>Mood History</h3>
                    <canvas id="moodChart"></canvas>
                </div>
                
                ${patterns.commonFactors?.length > 0 ? `
                    <div class="common-factors">
                        <h3>Common Factors</h3>
                        <div class="factor-list">
                            ${patterns.commonFactors.map(f => `<span class="factor-tag">${f}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${patterns.suggestions?.length > 0 ? `
                    <div class="mood-suggestions">
                        <h3>Suggestions</h3>
                        <ul>
                            ${patterns.suggestions.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // Create mood chart
    createMoodChart() {
        const canvas = document.getElementById('moodChart');
        if (!canvas || !window.Chart) return;

        const entries = Object.values(this.moodHistory).slice(-30); // Last 30 days
        
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: entries.map(e => new Date(e.date).toLocaleDateString()),
                datasets: [{
                    label: 'Mood',
                    data: entries.map(e => e.value),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    // Check mood-related achievements
    checkMoodAchievements() {
        const entries = Object.values(this.moodHistory);
        
        if (entries.length === 7 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('mood_tracker_week');
        }
        
        if (entries.length === 30 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('mood_tracker_month');
        }

        // Check for positive streak
        const lastWeek = entries.slice(-7);
        if (lastWeek.length === 7 && lastWeek.every(e => e.value >= 4)) {
            if (window.AchievementSystem) {
                window.AchievementSystem.unlockAchievement('positive_week');
            }
        }
    },

    // Get current weather (mock - would integrate with weather API)
    getCurrentWeather() {
        const weather = ['sunny', 'cloudy', 'rainy', 'snowy'];
        return weather[Math.floor(Math.random() * weather.length)];
    },

    // Skip mood check-in
    skipMoodCheckIn() {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastMoodCheck', today);
        this.closeMoodModal();
        window.showToast('Mood check-in skipped for today', 'info');
    },

    // Close mood modal
    closeMoodModal() {
        if (this.currentModal) {
            this.currentModal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                this.currentModal.remove();
                this.currentModal = null;
            }, 300);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for navigation to mood analytics
        document.addEventListener('navigate', (e) => {
            if (e.detail === 'mood') {
                const container = document.getElementById('mainContent');
                if (container) {
                    container.innerHTML = this.renderMoodAnalytics();
                    this.createMoodChart();
                }
            }
        });

        // Add mood button to header
        const headerActions = document.querySelector('.header-actions');
        if (headerActions && !document.getElementById('moodButton')) {
            const moodButton = document.createElement('button');
            moodButton.id = 'moodButton';
            moodButton.className = 'header-btn';
            moodButton.innerHTML = '😊';
            moodButton.title = 'Log mood';
            moodButton.onclick = () => this.showMoodCheckIn();
            headerActions.appendChild(moodButton);
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.MoodTrackingSystem.initialize());
} else {
    window.MoodTrackingSystem.initialize();
}
