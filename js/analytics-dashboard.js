/**
 * Advanced Analytics Dashboard
 * Comprehensive analytics with heatmaps, trends, and comparative views
 */

window.AnalyticsDashboard = {
    // Data storage
    data: {
        sessions: [],
        tasks: [],
        goals: [],
        habits: [],
        moods: [],
        achievements: []
    },

    // Time ranges
    timeRanges: {
        day: 1,
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
    },

    // Current view settings
    currentView: {
        range: 'week',
        comparison: false,
        category: 'all'
    },

    // Initialize analytics
    initialize() {
        this.loadAnalyticsData();
        this.setupEventTracking();
        this.setupCharts();
        this.startRealTimeTracking();
    },

    // Load analytics data
    loadAnalyticsData() {
        // Load from localStorage
        this.data.sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
        this.data.tasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        this.data.goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
        this.data.habits = JSON.parse(localStorage.getItem('habitData') || '[]');
        this.data.moods = JSON.parse(localStorage.getItem('moodHistory') || '{}');
        this.data.achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        
        // Process and aggregate data
        this.processData();
    },

    // Process raw data into analytics format
    processData() {
        this.metrics = {
            productivity: this.calculateProductivityMetrics(),
            goals: this.calculateGoalMetrics(),
            habits: this.calculateHabitMetrics(),
            focus: this.calculateFocusMetrics(),
            mood: this.calculateMoodMetrics(),
            achievements: this.calculateAchievementMetrics()
        };
    },

    // Calculate productivity metrics
    calculateProductivityMetrics() {
        const now = new Date();
        const range = this.timeRanges[this.currentView.range];
        const startDate = new Date(now - range * 24 * 60 * 60 * 1000);
        
        // Filter tasks within range
        const recentTasks = this.data.tasks.filter(task => 
            new Date(task.completedAt) >= startDate
        );
        
        // Daily task completion
        const dailyCompletion = {};
        recentTasks.forEach(task => {
            const day = new Date(task.completedAt).toDateString();
            dailyCompletion[day] = (dailyCompletion[day] || 0) + 1;
        });
        
        // Average tasks per day
        const avgTasksPerDay = recentTasks.length / range;
        
        // Task completion by category
        const byCategory = {};
        recentTasks.forEach(task => {
            const cat = task.category || 'Other';
            byCategory[cat] = (byCategory[cat] || 0) + 1;
        });
        
        // Peak productivity hours
        const hourlyDistribution = Array(24).fill(0);
        recentTasks.forEach(task => {
            const hour = new Date(task.completedAt).getHours();
            hourlyDistribution[hour]++;
        });
        
        return {
            totalTasks: recentTasks.length,
            avgTasksPerDay,
            dailyCompletion,
            byCategory,
            hourlyDistribution,
            trend: this.calculateTrend(dailyCompletion)
        };
    },

    // Calculate goal metrics
    calculateGoalMetrics() {
        const activeGoals = this.data.goals.filter(g => !g.completed);
        const completedGoals = this.data.goals.filter(g => g.completed);
        
        // Completion rate
        const completionRate = this.data.goals.length > 0 
            ? (completedGoals.length / this.data.goals.length) * 100 
            : 0;
        
        // Average time to complete
        const completionTimes = completedGoals
            .filter(g => g.createdAt && g.completedAt)
            .map(g => new Date(g.completedAt) - new Date(g.createdAt));
        
        const avgCompletionTime = completionTimes.length > 0
            ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
            : 0;
        
        // Goals by category
        const byCategory = {};
        this.data.goals.forEach(goal => {
            const cat = goal.category || 'Other';
            if (!byCategory[cat]) {
                byCategory[cat] = { total: 0, completed: 0 };
            }
            byCategory[cat].total++;
            if (goal.completed) {
                byCategory[cat].completed++;
            }
        });
        
        return {
            active: activeGoals.length,
            completed: completedGoals.length,
            completionRate,
            avgCompletionTime: avgCompletionTime / (24 * 60 * 60 * 1000), // Convert to days
            byCategory,
            overdue: activeGoals.filter(g => g.dueDate && new Date(g.dueDate) < new Date()).length
        };
    },

    // Calculate habit metrics
    calculateHabitMetrics() {
        const habits = this.data.habits;
        
        // Consistency scores
        const consistencyScores = habits.map(habit => {
            const totalDays = habit.history ? habit.history.length : 0;
            const completedDays = habit.history ? habit.history.filter(h => h.completed).length : 0;
            return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
        });
        
        const avgConsistency = consistencyScores.length > 0
            ? consistencyScores.reduce((a, b) => a + b, 0) / consistencyScores.length
            : 0;
        
        // Habit streaks
        const streaks = habits.map(habit => this.calculateHabitStreak(habit));
        const longestStreak = Math.max(...streaks, 0);
        
        // Habit completion by day of week
        const byDayOfWeek = Array(7).fill(0);
        habits.forEach(habit => {
            if (habit.history) {
                habit.history.forEach(entry => {
                    if (entry.completed) {
                        const day = new Date(entry.date).getDay();
                        byDayOfWeek[day]++;
                    }
                });
            }
        });
        
        return {
            total: habits.length,
            avgConsistency,
            longestStreak,
            byDayOfWeek,
            topHabits: habits
                .sort((a, b) => this.calculateHabitScore(b) - this.calculateHabitScore(a))
                .slice(0, 5)
        };
    },

    // Calculate focus metrics
    calculateFocusMetrics() {
        const now = new Date();
        const range = this.timeRanges[this.currentView.range];
        const startDate = new Date(now - range * 24 * 60 * 60 * 1000);
        
        // Filter sessions within range
        const recentSessions = this.data.sessions.filter(session => 
            new Date(session.startTime) >= startDate
        );
        
        // Total focus time
        const totalMinutes = recentSessions.reduce((total, session) => {
            const duration = session.endTime 
                ? (new Date(session.endTime) - new Date(session.startTime)) / 60000
                : 0;
            return total + duration;
        }, 0);
        
        // Average session length
        const avgSessionLength = recentSessions.length > 0
            ? totalMinutes / recentSessions.length
            : 0;
        
        // Focus time by day
        const byDay = {};
        recentSessions.forEach(session => {
            const day = new Date(session.startTime).toDateString();
            const duration = session.endTime 
                ? (new Date(session.endTime) - new Date(session.startTime)) / 60000
                : 0;
            byDay[day] = (byDay[day] || 0) + duration;
        });
        
        // Peak focus hours
        const hourlyFocus = Array(24).fill(0);
        recentSessions.forEach(session => {
            const hour = new Date(session.startTime).getHours();
            const duration = session.endTime 
                ? (new Date(session.endTime) - new Date(session.startTime)) / 60000
                : 0;
            hourlyFocus[hour] += duration;
        });
        
        return {
            totalMinutes,
            totalHours: totalMinutes / 60,
            avgSessionLength,
            sessionsCount: recentSessions.length,
            byDay,
            hourlyFocus,
            trend: this.calculateTrend(byDay)
        };
    },

    // Calculate mood metrics
    calculateMoodMetrics() {
        const moods = Object.values(this.data.moods);
        
        if (moods.length === 0) {
            return {
                average: 0,
                trend: 'stable',
                distribution: {},
                factors: []
            };
        }
        
        // Average mood
        const avgMood = moods.reduce((sum, m) => sum + m.value, 0) / moods.length;
        
        // Mood distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        moods.forEach(mood => {
            distribution[mood.value]++;
        });
        
        // Common factors
        const factorCounts = {};
        moods.forEach(mood => {
            if (mood.factors) {
                mood.factors.forEach(factor => {
                    factorCounts[factor] = (factorCounts[factor] || 0) + 1;
                });
            }
        });
        
        const topFactors = Object.entries(factorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([factor, count]) => ({ factor, count }));
        
        return {
            average: avgMood,
            trend: this.calculateMoodTrend(moods),
            distribution,
            factors: topFactors,
            entries: moods.length
        };
    },

    // Calculate achievement metrics
    calculateAchievementMetrics() {
        const achievements = this.data.achievements;
        
        // Achievements by category
        const byCategory = {};
        achievements.forEach(achievement => {
            const cat = achievement.category || 'General';
            byCategory[cat] = (byCategory[cat] || 0) + 1;
        });
        
        // Recent achievements
        const recent = achievements
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
            .slice(0, 5);
        
        // Achievement rate (per day)
        const firstAchievement = achievements[0];
        const daysSinceFirst = firstAchievement 
            ? (new Date() - new Date(firstAchievement.unlockedAt)) / (24 * 60 * 60 * 1000)
            : 0;
        
        const achievementRate = daysSinceFirst > 0 
            ? achievements.length / daysSinceFirst 
            : 0;
        
        return {
            total: achievements.length,
            byCategory,
            recent,
            achievementRate,
            nextMilestone: this.getNextAchievementMilestone()
        };
    },

    // Create time tracking heatmap
    createTimeHeatmap() {
        const canvas = document.createElement('canvas');
        canvas.width = 744; // 24 hours * 31 days
        canvas.height = 200; // 7 days
        
        const ctx = canvas.getContext('2d');
        const cellSize = 30;
        const gap = 1;
        
        // Create heatmap data
        const heatmapData = this.generateHeatmapData();
        
        // Draw cells
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const value = heatmapData[day][hour];
                const intensity = Math.min(value / 60, 1); // Normalize to 0-1
                
                // Color based on intensity
                const hue = 200 - (intensity * 60); // Blue to green
                ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${0.2 + intensity * 0.8})`;
                
                ctx.fillRect(
                    hour * (cellSize + gap),
                    day * (cellSize + gap),
                    cellSize,
                    cellSize
                );
            }
        }
        
        // Add labels
        ctx.fillStyle = 'var(--text-primary)';
        ctx.font = '10px sans-serif';
        
        // Hour labels
        for (let hour = 0; hour < 24; hour += 3) {
            ctx.fillText(
                `${hour}:00`,
                hour * (cellSize + gap),
                7 * (cellSize + gap) + 15
            );
        }
        
        // Day labels
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach((day, i) => {
            ctx.fillText(
                day,
                -30,
                i * (cellSize + gap) + cellSize / 2
            );
        });
        
        return canvas;
    },

    // Generate heatmap data
    generateHeatmapData() {
        const data = Array(7).fill(null).map(() => Array(24).fill(0));
        
        // Aggregate focus sessions
        this.data.sessions.forEach(session => {
            const start = new Date(session.startTime);
            const end = session.endTime ? new Date(session.endTime) : start;
            
            const day = start.getDay();
            const hour = start.getHours();
            const duration = (end - start) / 60000; // Minutes
            
            data[day][hour] += duration;
        });
        
        return data;
    },

    // Render analytics dashboard
    renderDashboard() {
        return `
            <div class="analytics-dashboard">
                <div class="analytics-header">
                    <h2>Analytics Dashboard</h2>
                    <div class="analytics-controls">
                        <select id="timeRange" onchange="AnalyticsDashboard.changeTimeRange(this.value)">
                            <option value="day">Today</option>
                            <option value="week" selected>This Week</option>
                            <option value="month">This Month</option>
                            <option value="quarter">Quarter</option>
                            <option value="year">Year</option>
                        </select>
                        <button onclick="AnalyticsDashboard.toggleComparison()">
                            Compare Periods
                        </button>
                        <button onclick="AnalyticsDashboard.exportReport()">
                            Export Report
                        </button>
                    </div>
                </div>
                
                <div class="analytics-summary">
                    ${this.renderSummaryCards()}
                </div>
                
                <div class="analytics-charts">
                    <div class="chart-container">
                        <h3>Productivity Trend</h3>
                        <canvas id="productivityChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Focus Time Heatmap</h3>
                        <div id="focusHeatmap"></div>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Goal Progress</h3>
                        <canvas id="goalChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Habit Consistency</h3>
                        <canvas id="habitChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Mood Patterns</h3>
                        <canvas id="moodChart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Achievement Progress</h3>
                        <canvas id="achievementChart"></canvas>
                    </div>
                </div>
                
                <div class="analytics-insights">
                    <h3>AI Insights</h3>
                    ${this.renderInsights()}
                </div>
            </div>
        `;
    },

    // Render summary cards
    renderSummaryCards() {
        const { productivity, goals, habits, focus, mood } = this.metrics;
        
        return `
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="card-icon">📊</div>
                    <div class="card-value">${productivity.totalTasks}</div>
                    <div class="card-label">Tasks Completed</div>
                    <div class="card-trend ${productivity.trend}">${this.getTrendIcon(productivity.trend)}</div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon">⏱️</div>
                    <div class="card-value">${focus.totalHours.toFixed(1)}h</div>
                    <div class="card-label">Focus Time</div>
                    <div class="card-trend ${focus.trend}">${this.getTrendIcon(focus.trend)}</div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon">🎯</div>
                    <div class="card-value">${goals.completionRate.toFixed(0)}%</div>
                    <div class="card-label">Goal Completion</div>
                    <div class="card-trend">
                        ${goals.active} active
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon">🔄</div>
                    <div class="card-value">${habits.avgConsistency.toFixed(0)}%</div>
                    <div class="card-label">Habit Consistency</div>
                    <div class="card-trend">
                        ${habits.longestStreak} day streak
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon">😊</div>
                    <div class="card-value">${mood.average.toFixed(1)}/5</div>
                    <div class="card-label">Average Mood</div>
                    <div class="card-trend ${mood.trend}">${this.getTrendIcon(mood.trend)}</div>
                </div>
            </div>
        `;
    },

    // Render insights
    renderInsights() {
        const insights = this.generateInsights();
        
        return `
            <div class="insights-list">
                ${insights.map(insight => `
                    <div class="insight-item">
                        <div class="insight-icon">${insight.icon}</div>
                        <div class="insight-content">
                            <div class="insight-title">${insight.title}</div>
                            <div class="insight-description">${insight.description}</div>
                            ${insight.action ? `
                                <button class="insight-action" onclick="${insight.action}">
                                    ${insight.actionText}
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Generate AI insights
    generateInsights() {
        const insights = [];
        const { productivity, goals, habits, focus, mood } = this.metrics;
        
        // Productivity insights
        if (productivity.trend === 'increasing') {
            insights.push({
                icon: '📈',
                title: 'Productivity is trending up!',
                description: `You've completed ${productivity.totalTasks} tasks this period, ${Math.round(productivity.avgTasksPerDay)} per day on average.`,
                action: 'AnalyticsDashboard.showProductivityDetails()',
                actionText: 'View Details'
            });
        } else if (productivity.trend === 'decreasing') {
            insights.push({
                icon: '📉',
                title: 'Productivity dip detected',
                description: 'Your task completion has decreased. Consider breaking tasks into smaller chunks.',
                action: 'AnalyticsDashboard.suggestProductivityTips()',
                actionText: 'Get Tips'
            });
        }
        
        // Focus insights
        const peakHour = focus.hourlyFocus.indexOf(Math.max(...focus.hourlyFocus));
        if (peakHour >= 0) {
            insights.push({
                icon: '🎯',
                title: `Peak focus time: ${peakHour}:00-${peakHour + 1}:00`,
                description: 'Schedule your most important work during this time for maximum productivity.',
                action: 'AnalyticsDashboard.scheduleFocusSession(' + peakHour + ')',
                actionText: 'Schedule Session'
            });
        }
        
        // Habit insights
        if (habits.avgConsistency < 50) {
            insights.push({
                icon: '⚠️',
                title: 'Habit consistency needs attention',
                description: 'Your habit completion is below 50%. Try habit stacking or reducing habit difficulty.',
                action: 'AnalyticsDashboard.improveHabits()',
                actionText: 'Improve Habits'
            });
        }
        
        // Mood insights
        if (mood.average < 3) {
            insights.push({
                icon: '💙',
                title: 'Low mood pattern detected',
                description: 'Consider incorporating mood-boosting activities like exercise or social interaction.',
                action: 'MoodTrackingSystem.showMoodRecommendation()',
                actionText: 'Get Support'
            });
        }
        
        // Goal insights
        if (goals.overdue > 0) {
            insights.push({
                icon: '⏰',
                title: `${goals.overdue} overdue goals`,
                description: 'Review and adjust your goal deadlines or break them into smaller milestones.',
                action: 'AnalyticsDashboard.reviewOverdueGoals()',
                actionText: 'Review Goals'
            });
        }
        
        return insights;
    },

    // Setup charts
    setupCharts() {
        if (!window.Chart) {
            console.warn('Chart.js not loaded');
            return;
        }
        
        // Will be called when dashboard is rendered
        this.chartConfigs = {
            productivity: this.getProductivityChartConfig(),
            goals: this.getGoalChartConfig(),
            habits: this.getHabitChartConfig(),
            mood: this.getMoodChartConfig(),
            achievements: this.getAchievementChartConfig()
        };
    },

    // Get productivity chart configuration
    getProductivityChartConfig() {
        const { productivity } = this.metrics;
        const dates = Object.keys(productivity.dailyCompletion);
        const values = Object.values(productivity.dailyCompletion);
        
        return {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Tasks Completed',
                    data: values,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        };
    },

    // Calculate trend
    calculateTrend(data) {
        const values = Object.values(data);
        if (values.length < 2) return 'stable';
        
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length || 0;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length || 0;
        
        if (secondAvg > firstAvg * 1.1) return 'increasing';
        if (secondAvg < firstAvg * 0.9) return 'decreasing';
        return 'stable';
    },

    // Get trend icon
    getTrendIcon(trend) {
        const icons = {
            increasing: '📈 Up',
            decreasing: '📉 Down',
            stable: '➡️ Stable'
        };
        return icons[trend] || '';
    },

    // Calculate habit streak
    calculateHabitStreak(habit) {
        if (!habit.history) return 0;
        
        let streak = 0;
        const sorted = habit.history.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (const entry of sorted) {
            if (entry.completed) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    },

    // Calculate habit score
    calculateHabitScore(habit) {
        const streak = this.calculateHabitStreak(habit);
        const consistency = habit.history 
            ? habit.history.filter(h => h.completed).length / habit.history.length 
            : 0;
        
        return streak * 0.3 + consistency * 0.7;
    },

    // Calculate mood trend
    calculateMoodTrend(moods) {
        if (moods.length < 7) return 'stable';
        
        const recent = moods.slice(-7);
        const older = moods.slice(-14, -7);
        
        const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
        const olderAvg = older.length > 0 
            ? older.reduce((sum, m) => sum + m.value, 0) / older.length 
            : recentAvg;
        
        if (recentAvg > olderAvg + 0.5) return 'improving';
        if (recentAvg < olderAvg - 0.5) return 'declining';
        return 'stable';
    },

    // Get next achievement milestone
    getNextAchievementMilestone() {
        const total = this.data.achievements.length;
        const milestones = [10, 25, 50, 100, 250, 500, 1000];
        
        for (const milestone of milestones) {
            if (total < milestone) {
                return {
                    target: milestone,
                    remaining: milestone - total,
                    progress: (total / milestone) * 100
                };
            }
        }
        
        return null;
    },

    // Change time range
    changeTimeRange(range) {
        this.currentView.range = range;
        this.processData();
        this.updateDashboard();
    },

    // Toggle comparison view
    toggleComparison() {
        this.currentView.comparison = !this.currentView.comparison;
        this.updateDashboard();
        
        if (this.currentView.comparison) {
            window.showToast('Comparison mode enabled', 'info');
        }
    },

    // Export report
    async exportReport() {
        const report = this.generateReport();
        
        // Create PDF (would need a PDF library like jsPDF)
        if (window.jspdf) {
            const doc = new window.jspdf.jsPDF();
            doc.text('Analytics Report', 10, 10);
            doc.text(report, 10, 20);
            doc.save('analytics-report.pdf');
        } else {
            // Fallback to text download
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'analytics-report.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
        
        window.showToast('Report exported successfully', 'success');
    },

    // Generate report
    generateReport() {
        const { productivity, goals, habits, focus, mood, achievements } = this.metrics;
        
        return `
Analytics Report - ${new Date().toLocaleDateString()}
Time Range: ${this.currentView.range}

PRODUCTIVITY
- Tasks Completed: ${productivity.totalTasks}
- Average per Day: ${productivity.avgTasksPerDay.toFixed(1)}
- Trend: ${productivity.trend}

FOCUS TIME
- Total Hours: ${focus.totalHours.toFixed(1)}
- Sessions: ${focus.sessionsCount}
- Average Session: ${focus.avgSessionLength.toFixed(0)} minutes

GOALS
- Active: ${goals.active}
- Completed: ${goals.completed}
- Completion Rate: ${goals.completionRate.toFixed(0)}%
- Overdue: ${goals.overdue}

HABITS
- Total: ${habits.total}
- Consistency: ${habits.avgConsistency.toFixed(0)}%
- Longest Streak: ${habits.longestStreak} days

MOOD
- Average: ${mood.average.toFixed(1)}/5
- Trend: ${mood.trend}
- Entries: ${mood.entries}

ACHIEVEMENTS
- Total Unlocked: ${achievements.total}
- Rate: ${achievements.achievementRate.toFixed(2)} per day

INSIGHTS
${this.generateInsights().map(i => `- ${i.title}: ${i.description}`).join('\n')}
        `;
    },

    // Update dashboard
    updateDashboard() {
        const container = document.getElementById('analyticsContainer');
        if (container) {
            container.innerHTML = this.renderDashboard();
            this.renderCharts();
        }
    },

    // Render charts
    renderCharts() {
        if (!window.Chart) return;
        
        // Render each chart
        Object.entries(this.chartConfigs).forEach(([key, config]) => {
            const canvas = document.getElementById(`${key}Chart`);
            if (canvas) {
                new Chart(canvas, config);
            }
        });
        
        // Render heatmap
        const heatmapContainer = document.getElementById('focusHeatmap');
        if (heatmapContainer) {
            heatmapContainer.appendChild(this.createTimeHeatmap());
        }
    },

    // Setup event tracking
    setupEventTracking() {
        // Track various events for analytics
        const events = [
            'taskCompleted',
            'goalCompleted',
            'habitCompleted',
            'focusSessionEnd',
            'achievementUnlocked',
            'moodLogged'
        ];
        
        events.forEach(event => {
            document.addEventListener(event, (e) => {
                this.trackEvent(event, e.detail);
            });
        });
    },

    // Track event
    trackEvent(eventName, data) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            data: data
        };
        
        // Store event
        const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
        events.push(event);
        
        // Keep only last 1000 events
        if (events.length > 1000) {
            events.shift();
        }
        
        localStorage.setItem('analyticsEvents', JSON.stringify(events));
        
        // Update real-time metrics
        this.updateRealTimeMetrics(eventName, data);
    },

    // Update real-time metrics
    updateRealTimeMetrics(eventName, data) {
        // Reload data if needed
        if (['taskCompleted', 'goalCompleted', 'habitCompleted'].includes(eventName)) {
            this.loadAnalyticsData();
            this.processData();
            
            // Update dashboard if visible
            if (document.getElementById('analyticsContainer')) {
                this.updateDashboard();
            }
        }
    },

    // Start real-time tracking
    startRealTimeTracking() {
        // Update dashboard every minute
        setInterval(() => {
            if (document.getElementById('analyticsContainer')) {
                this.loadAnalyticsData();
                this.processData();
                this.updateDashboard();
            }
        }, 60000);
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AnalyticsDashboard.initialize());
} else {
    window.AnalyticsDashboard.initialize();
}
