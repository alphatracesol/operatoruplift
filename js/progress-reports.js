/**
 * Progress Reports System
 * Automated weekly/monthly reports with insights and PDF export
 */

window.ProgressReportsSystem = {
    // Report configurations
    config: {
        weeklyReportDay: 'Sunday',
        monthlyReportDay: 1,
        reportTime: '18:00',
        autoGenerate: true,
        emailReports: false
    },

    // Report templates
    templates: {
        weekly: {
            sections: ['overview', 'goals', 'tasks', 'habits', 'focus', 'achievements', 'insights', 'recommendations'],
            title: 'Weekly Progress Report'
        },
        monthly: {
            sections: ['overview', 'goals', 'tasks', 'habits', 'focus', 'achievements', 'trends', 'insights', 'recommendations'],
            title: 'Monthly Progress Report'
        },
        custom: {
            sections: [],
            title: 'Custom Report'
        }
    },

    // Initialize system
    initialize() {
        this.loadConfig();
        this.scheduleReports();
        this.setupEventListeners();
        this.checkPendingReports();
    },

    // Load configuration
    loadConfig() {
        const saved = localStorage.getItem('reportConfig');
        if (saved) {
            Object.assign(this.config, JSON.parse(saved));
        }
    },

    // Save configuration
    saveConfig() {
        localStorage.setItem('reportConfig', JSON.stringify(this.config));
    },

    // Generate weekly report
    async generateWeeklyReport(customDateRange = null) {
        const dateRange = customDateRange || this.getWeekDateRange();
        const data = await this.collectReportData(dateRange);
        
        const report = {
            id: `report_${Date.now()}`,
            type: 'weekly',
            dateRange: dateRange,
            generatedAt: new Date().toISOString(),
            data: data,
            sections: {}
        };

        // Generate each section
        for (const section of this.templates.weekly.sections) {
            report.sections[section] = await this.generateSection(section, data, 'weekly');
        }

        // Save report
        this.saveReport(report);

        // Show report
        this.showReport(report);

        return report;
    },

    // Generate monthly report
    async generateMonthlyReport(month = null, year = null) {
        const dateRange = this.getMonthDateRange(month, year);
        const data = await this.collectReportData(dateRange);
        
        const report = {
            id: `report_${Date.now()}`,
            type: 'monthly',
            dateRange: dateRange,
            generatedAt: new Date().toISOString(),
            data: data,
            sections: {}
        };

        // Generate each section
        for (const section of this.templates.monthly.sections) {
            report.sections[section] = await this.generateSection(section, data, 'monthly');
        }

        // Save report
        this.saveReport(report);

        // Show report
        this.showReport(report);

        return report;
    },

    // Collect report data
    async collectReportData(dateRange) {
        const data = {
            tasks: this.getTasksData(dateRange),
            goals: this.getGoalsData(dateRange),
            habits: this.getHabitsData(dateRange),
            focus: this.getFocusData(dateRange),
            achievements: this.getAchievementsData(dateRange),
            mood: this.getMoodData(dateRange),
            energy: this.getEnergyData(dateRange),
            social: this.getSocialData(dateRange)
        };

        return data;
    },

    // Generate report section
    async generateSection(section, data, reportType) {
        switch (section) {
            case 'overview':
                return this.generateOverviewSection(data, reportType);
            case 'goals':
                return this.generateGoalsSection(data);
            case 'tasks':
                return this.generateTasksSection(data);
            case 'habits':
                return this.generateHabitsSection(data);
            case 'focus':
                return this.generateFocusSection(data);
            case 'achievements':
                return this.generateAchievementsSection(data);
            case 'trends':
                return this.generateTrendsSection(data);
            case 'insights':
                return this.generateInsightsSection(data);
            case 'recommendations':
                return this.generateRecommendationsSection(data);
            default:
                return null;
        }
    },

    // Generate overview section
    generateOverviewSection(data, reportType) {
        const totalTasks = data.tasks.completed + data.tasks.pending;
        const completionRate = totalTasks > 0 ? (data.tasks.completed / totalTasks * 100).toFixed(1) : 0;
        
        return {
            title: 'Overview',
            content: {
                summary: `Your ${reportType} progress at a glance`,
                metrics: [
                    { label: 'Tasks Completed', value: data.tasks.completed, icon: '✅' },
                    { label: 'Goals Progress', value: `${data.goals.progressPercent}%`, icon: '🎯' },
                    { label: 'Focus Time', value: `${data.focus.totalHours}h`, icon: '⏱️' },
                    { label: 'Current Streak', value: `${data.habits.currentStreak} days`, icon: '🔥' },
                    { label: 'Points Earned', value: data.achievements.pointsEarned, icon: '💎' },
                    { label: 'Completion Rate', value: `${completionRate}%`, icon: '📊' }
                ]
            }
        };
    },

    // Generate goals section
    generateGoalsSection(data) {
        return {
            title: 'Goals Progress',
            content: {
                completed: data.goals.completed,
                inProgress: data.goals.inProgress,
                details: data.goals.details.map(goal => ({
                    name: goal.name,
                    progress: goal.progress,
                    status: goal.status,
                    daysRemaining: goal.daysRemaining
                }))
            }
        };
    },

    // Generate insights section
    generateInsightsSection(data) {
        const insights = [];

        // Productivity insights
        if (data.tasks.completed > data.tasks.averageWeekly * 1.2) {
            insights.push({
                type: 'positive',
                title: 'High Productivity',
                message: 'You completed 20% more tasks than your average!'
            });
        }

        // Focus insights
        if (data.focus.sessions > 0) {
            const avgSessionLength = data.focus.totalMinutes / data.focus.sessions;
            insights.push({
                type: 'info',
                title: 'Focus Pattern',
                message: `Average session: ${Math.round(avgSessionLength)} minutes`
            });
        }

        // Habit insights
        if (data.habits.currentStreak > 7) {
            insights.push({
                type: 'positive',
                title: 'Strong Habits',
                message: `${data.habits.currentStreak}-day streak! Keep it up!`
            });
        }

        // Mood correlation
        if (data.mood.average > 3.5 && data.tasks.completed > data.tasks.averageWeekly) {
            insights.push({
                type: 'correlation',
                title: 'Mood-Productivity Link',
                message: 'Higher mood correlated with increased productivity'
            });
        }

        return {
            title: 'Key Insights',
            content: insights
        };
    },

    // Generate recommendations section
    async generateRecommendationsSection(data) {
        const recommendations = [];

        // Task recommendations
        if (data.tasks.completionRate < 70) {
            recommendations.push({
                category: 'tasks',
                priority: 'high',
                title: 'Break Down Large Tasks',
                action: 'Try splitting tasks into smaller, manageable pieces'
            });
        }

        // Focus recommendations
        if (data.focus.averageSession < 25) {
            recommendations.push({
                category: 'focus',
                priority: 'medium',
                title: 'Extend Focus Sessions',
                action: 'Try the Pomodoro technique for better focus'
            });
        }

        // Habit recommendations
        if (data.habits.missedDays > 2) {
            recommendations.push({
                category: 'habits',
                priority: 'high',
                title: 'Habit Consistency',
                action: 'Set reminders for your daily habits'
            });
        }

        // AI-powered recommendations
        if (window.AICoachingSystem) {
            const aiRec = await this.getAIRecommendations(data);
            if (aiRec) {
                recommendations.push(aiRec);
            }
        }

        return {
            title: 'Recommendations',
            content: recommendations
        };
    },

    // Show report modal
    showReport(report) {
        const modal = document.createElement('div');
        modal.className = 'report-modal';
        modal.innerHTML = `
            <div class="report-content">
                <div class="report-header">
                    <h1>${this.templates[report.type].title}</h1>
                    <span class="report-date">${this.formatDateRange(report.dateRange)}</span>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="report-body">
                    ${this.renderReportSections(report)}
                </div>
                
                <div class="report-footer">
                    <button class="btn btn-secondary" onclick="ProgressReportsSystem.shareReport('${report.id}')">
                        <i class="fas fa-share"></i> Share
                    </button>
                    <button class="btn btn-primary" onclick="ProgressReportsSystem.exportToPDF('${report.id}')">
                        <i class="fas fa-download"></i> Export PDF
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
            overflow-y: auto;
            padding: 20px;
        `;

        document.body.appendChild(modal);
    },

    // Render report sections
    renderReportSections(report) {
        return Object.entries(report.sections).map(([key, section]) => {
            if (!section) return '';
            
            return `
                <div class="report-section">
                    <h2>${section.title}</h2>
                    ${this.renderSectionContent(key, section.content)}
                </div>
            `;
        }).join('');
    },

    // Render section content
    renderSectionContent(sectionType, content) {
        switch (sectionType) {
            case 'overview':
                return `
                    <p>${content.summary}</p>
                    <div class="metrics-grid">
                        ${content.metrics.map(metric => `
                            <div class="metric-card">
                                <span class="metric-icon">${metric.icon}</span>
                                <span class="metric-value">${metric.value}</span>
                                <span class="metric-label">${metric.label}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            
            case 'insights':
                return `
                    <div class="insights-list">
                        ${content.map(insight => `
                            <div class="insight-item ${insight.type}">
                                <h4>${insight.title}</h4>
                                <p>${insight.message}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            
            case 'recommendations':
                return `
                    <div class="recommendations-list">
                        ${content.map(rec => `
                            <div class="recommendation-item priority-${rec.priority}">
                                <span class="rec-category">${rec.category}</span>
                                <h4>${rec.title}</h4>
                                <p>${rec.action}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            
            default:
                return `<pre>${JSON.stringify(content, null, 2)}</pre>`;
        }
    },

    // Export to PDF
    async exportToPDF(reportId) {
        const reports = JSON.parse(localStorage.getItem('progressReports') || '[]');
        const report = reports.find(r => r.id === reportId);
        if (!report) return;

        // Create PDF content
        const pdfContent = this.generatePDFContent(report);
        
        // If jsPDF is available, use it
        if (window.jsPDF) {
            const doc = new jsPDF();
            doc.html(pdfContent, {
                callback: function(doc) {
                    doc.save(`progress-report-${report.dateRange.start}.pdf`);
                }
            });
        } else {
            // Fallback: Create printable version
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>${report.type} Progress Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        h1 { color: #333; }
                        .metric { margin: 10px 0; }
                        @media print { 
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${pdfContent}
                    <button class="no-print" onclick="window.print()">Print/Save as PDF</button>
                </body>
                </html>
            `);
        }
        
        window.showToast('Report exported!', 'success');
    },

    // Generate PDF content
    generatePDFContent(report) {
        let html = `
            <h1>${this.templates[report.type].title}</h1>
            <p>Period: ${this.formatDateRange(report.dateRange)}</p>
            <p>Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
            <hr>
        `;

        Object.entries(report.sections).forEach(([key, section]) => {
            if (!section) return;
            
            html += `
                <h2>${section.title}</h2>
                ${this.generatePDFSection(key, section.content)}
            `;
        });

        return html;
    },

    // Share report
    async shareReport(reportId) {
        const reports = JSON.parse(localStorage.getItem('progressReports') || '[]');
        const report = reports.find(r => r.id === reportId);
        if (!report) return;

        // Generate shareable link
        const shareData = {
            title: `${report.type} Progress Report`,
            text: `Check out my ${report.type} progress!`,
            url: window.location.href + `#report=${reportId}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                window.showToast('Report shared!', 'success');
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            navigator.clipboard.writeText(shareText);
            window.showToast('Share link copied to clipboard!', 'success');
        }
    },

    // Schedule reports
    scheduleReports() {
        if (!this.config.autoGenerate) return;

        // Schedule weekly report
        this.scheduleWeeklyReport();

        // Schedule monthly report
        this.scheduleMonthlyReport();
    },

    // Schedule weekly report
    scheduleWeeklyReport() {
        const now = new Date();
        const dayMap = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        };
        
        const targetDay = dayMap[this.config.weeklyReportDay];
        const daysUntilReport = (targetDay - now.getDay() + 7) % 7 || 7;
        
        const nextReport = new Date(now);
        nextReport.setDate(nextReport.getDate() + daysUntilReport);
        const [hours, minutes] = this.config.reportTime.split(':');
        nextReport.setHours(hours, minutes, 0, 0);
        
        const delay = nextReport - now;
        
        setTimeout(() => {
            this.generateWeeklyReport();
            // Schedule next week
            setInterval(() => this.generateWeeklyReport(), 7 * 24 * 60 * 60 * 1000);
        }, delay);
    },

    // Get data collection methods
    getTasksData(dateRange) {
        const tasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        const filtered = tasks.filter(t => 
            new Date(t.completedAt) >= new Date(dateRange.start) &&
            new Date(t.completedAt) <= new Date(dateRange.end)
        );
        
        return {
            completed: filtered.length,
            pending: 0, // Would need to track pending tasks
            averageWeekly: this.calculateAverageWeekly(tasks),
            completionRate: 0,
            byCategory: this.groupByCategory(filtered)
        };
    },

    getGoalsData(dateRange) {
        const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
        const active = goals.filter(g => g.status === 'active');
        const completed = goals.filter(g => 
            g.status === 'completed' &&
            new Date(g.completedAt) >= new Date(dateRange.start) &&
            new Date(g.completedAt) <= new Date(dateRange.end)
        );
        
        const totalProgress = active.reduce((sum, g) => sum + (g.progress || 0), 0);
        const progressPercent = active.length > 0 ? Math.round(totalProgress / active.length) : 0;
        
        return {
            completed: completed.length,
            inProgress: active.length,
            progressPercent: progressPercent,
            details: active.map(g => ({
                name: g.name,
                progress: g.progress || 0,
                status: g.status,
                daysRemaining: this.calculateDaysRemaining(g.targetDate)
            }))
        };
    },

    getFocusData(dateRange) {
        const sessions = JSON.parse(localStorage.getItem('focusSessionHistory') || '[]');
        const filtered = sessions.filter(s => 
            new Date(s.startTime) >= new Date(dateRange.start) &&
            new Date(s.startTime) <= new Date(dateRange.end)
        );
        
        const totalMinutes = filtered.reduce((sum, s) => {
            const duration = s.endTime ? (new Date(s.endTime) - new Date(s.startTime)) / 60000 : 0;
            return sum + duration;
        }, 0);
        
        return {
            sessions: filtered.length,
            totalMinutes: Math.round(totalMinutes),
            totalHours: (totalMinutes / 60).toFixed(1),
            averageSession: filtered.length > 0 ? Math.round(totalMinutes / filtered.length) : 0
        };
    },

    // Helper methods
    getWeekDateRange() {
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 7);
        
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    },

    getMonthDateRange(month = null, year = null) {
        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month !== null ? month : now.getMonth();
        
        const start = new Date(targetYear, targetMonth, 1);
        const end = new Date(targetYear, targetMonth + 1, 0);
        
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    },

    formatDateRange(dateRange) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    },

    saveReport(report) {
        const reports = JSON.parse(localStorage.getItem('progressReports') || '[]');
        reports.push(report);
        
        // Keep only last 12 reports
        if (reports.length > 12) {
            reports.shift();
        }
        
        localStorage.setItem('progressReports', JSON.stringify(reports));
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for manual report generation
        document.addEventListener('generateReport', (e) => {
            if (e.detail.type === 'weekly') {
                this.generateWeeklyReport();
            } else if (e.detail.type === 'monthly') {
                this.generateMonthlyReport();
            }
        });
    },

    checkPendingReports() {
        // Check if any scheduled reports were missed
        const lastGenerated = localStorage.getItem('lastReportGenerated');
        if (lastGenerated) {
            const daysSince = (Date.now() - new Date(lastGenerated)) / (1000 * 60 * 60 * 24);
            if (daysSince > 7) {
                if (window.NotificationSystem) {
                    window.NotificationSystem.send(
                        'Missed Report',
                        'You have a pending weekly report. Generate it now?',
                        {
                            category: 'progress',
                            actions: [
                                { id: 'generate', title: 'Generate Report' }
                            ]
                        }
                    );
                }
            }
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.ProgressReportsSystem.initialize());
} else {
    window.ProgressReportsSystem.initialize();
}
