/**
 * Data Visualizations Module
 * Implements Chart.js visualizations for progress tracking and analytics
 */

// ============================================
// 1. CHART MANAGER
// ============================================

class ChartManager {
    constructor() {
        this.charts = new Map();
        this.chartConfigs = new Map();
        this.init();
    }

    async init() {
        await this.loadChartJS();
        this.setupChartDefaults();
        this.createAllCharts();
    }

    async loadChartJS() {
        if (!window.Chart) {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
    }

    setupChartDefaults() {
        if (!window.Chart) return;

        // Set global defaults
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
        
        // Register custom colors
        this.colors = {
            primary: '#f97316',
            secondary: '#fb923c',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
            gradient: {
                primary: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.5)');
                    gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
                    return gradient;
                },
                secondary: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(251, 146, 60, 0.5)');
                    gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
                    return gradient;
                }
            }
        };
    }

    createAllCharts() {
        // Create charts for different sections
        this.createFocusChart();
        this.createProgressChart();
        this.createStreakChart();
        this.createProductivityChart();
        this.createBurnChart();
        this.createTokenChart();
        this.createLeaderboardChart();
        this.createAchievementChart();
    }

    createFocusChart() {
        const canvas = document.getElementById('focus-chart');
        if (!canvas) return;

        const config = {
            type: 'line',
            data: {
                labels: this.getLast7Days(),
                datasets: [{
                    label: 'Focus Time (minutes)',
                    data: this.getFocusData(),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.gradient.primary,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#0a0a0a',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#94a3b8',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                return `${context.parsed.y} minutes`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: (value) => `${value}m`
                        }
                    }
                }
            }
        };

        const chart = new Chart(canvas, config);
        this.charts.set('focus', chart);
        this.chartConfigs.set('focus', config);
    }

    createProgressChart() {
        const canvas = document.getElementById('progress-chart');
        if (!canvas) return;

        const config = {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [75, 25],
                    backgroundColor: [
                        this.colors.primary,
                        'rgba(255, 255, 255, 0.05)'
                    ],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { width, height, ctx } = chart;
                    ctx.restore();
                    const fontSize = (height / 100).toFixed(2);
                    ctx.font = `bold ${fontSize * 25}px Inter`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const text = '75%';
                    const textX = width / 2;
                    const textY = height / 2;
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            }]
        };

        const chart = new Chart(canvas, config);
        this.charts.set('progress', chart);
    }

    createStreakChart() {
        const canvas = document.getElementById('streak-chart');
        if (!canvas) return;

        const config = {
            type: 'bar',
            data: {
                labels: this.getLast30Days(),
                datasets: [{
                    label: 'Daily Streak',
                    data: this.getStreakData(),
                    backgroundColor: (context) => {
                        const value = context.parsed.y;
                        return value > 0 ? this.colors.success : 'rgba(255, 255, 255, 0.05)';
                    },
                    borderRadius: 4,
                    barThickness: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.parsed.y > 0 ? 'Active' : 'Missed';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false,
                        max: 1
                    }
                }
            }
        };

        const chart = new Chart(canvas, config);
        this.charts.set('streak', chart);
    }

    createProductivityChart() {
        const canvas = document.getElementById('productivity-chart');
        if (!canvas) return;

        const config = {
            type: 'radar',
            data: {
                labels: ['Focus', 'Tasks', 'Goals', 'Habits', 'Social', 'Learning'],
                datasets: [{
                    label: 'This Week',
                    data: [80, 65, 90, 70, 45, 85],
                    borderColor: this.colors.primary,
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: this.colors.primary
                }, {
                    label: 'Last Week',
                    data: [70, 60, 85, 65, 40, 75],
                    borderColor: this.colors.secondary,
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                    pointBackgroundColor: this.colors.secondary,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: this.colors.secondary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            display: false
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        pointLabels: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        const chart = new Chart(canvas, config);
        this.charts.set('productivity', chart);
    }

    createBurnChart() {
        const canvas = document.getElementById('burn-chart');
        if (!canvas) return;

        const config = {
            type: 'line',
            data: {
                labels: this.getLast7Days(),
                datasets: [{
                    label: 'UPLIFT Burned',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: this.colors.error,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
                        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.parsed.y.toLocaleString()} UPLIFT`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            callback: (value) => `${(value / 1000).toFixed(1)}k`
                        }
                    }
                }
            }
        };

        const chart = new Chart(canvas, config);
        this.charts.set('burn', chart);
    }

    createTokenChart() {
        const canvas = document.getElementById('token-price-chart');
        if (!canvas) return;

        const config = {
            type: 'line',
            data: {
                labels: this.getHourlyLabels(),
                datasets: [{
                    label: 'Price',
                    data: this.getTokenPriceData(),
                    borderColor: this.colors.success,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `$${context.parsed.y.toFixed(6)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        position: 'right',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            callback: (value) => `$${value.toFixed(6)}`
                        }
                    }
                }
            }
        };

        const chart = new Chart(canvas, config);
        this.charts.set('token-price', chart);
    }

    createLeaderboardChart() {
        const canvas = document.getElementById('leaderboard-chart');
        if (!canvas) return;

        const config = {
            type: 'bar',
            data: {
                labels: ['You', '#1', '#2', '#3', '#4', '#5'],
                datasets: [{
                    label: 'XP',
                    data: [2500, 5000, 4500, 4000, 3500, 3000],
                    backgroundColor: (context) => {
                        return context.dataIndex === 0 ? this.colors.primary : 'rgba(255, 255, 255, 0.1)';
                    },
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.parsed.x.toLocaleString()} XP`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            callback: (value) => `${(value / 1000).toFixed(1)}k`
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        };

        const chart = new Chart(canvas, config);
        this.charts.set('leaderboard', chart);
    }

    createAchievementChart() {
        const canvas = document.getElementById('achievement-chart');
        if (!canvas) return;

        const config = {
            type: 'polarArea',
            data: {
                labels: ['Focus', 'Streak', 'Tasks', 'Social', 'Special'],
                datasets: [{
                    data: [12, 8, 15, 5, 3],
                    backgroundColor: [
                        'rgba(249, 115, 22, 0.5)',
                        'rgba(16, 185, 129, 0.5)',
                        'rgba(59, 130, 246, 0.5)',
                        'rgba(251, 146, 60, 0.5)',
                        'rgba(168, 85, 247, 0.5)'
                    ],
                    borderColor: [
                        '#f97316',
                        '#10b981',
                        '#3b82f6',
                        '#fb923c',
                        '#a855f7'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${context.parsed.r} achievements`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        };

        const chart = new Chart(canvas, config);
        this.charts.set('achievement', chart);
    }

    // Data generation helpers
    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('en', { weekday: 'short' }));
        }
        return days;
    }

    getLast30Days() {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.getDate());
        }
        return days;
    }

    getHourlyLabels() {
        const labels = [];
        for (let i = 23; i >= 0; i--) {
            const date = new Date();
            date.setHours(date.getHours() - i);
            labels.push(date.toLocaleTimeString('en', { hour: '2-digit' }));
        }
        return labels;
    }

    getFocusData() {
        // Get real data from localStorage or generate mock data
        try {
            const saved = localStorage.getItem('focus_history');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading focus data:', error);
        }
        
        // Mock data
        return [45, 60, 30, 90, 75, 120, 85];
    }

    getStreakData() {
        // Generate streak data (1 = active, 0 = missed)
        const data = [];
        for (let i = 0; i < 30; i++) {
            data.push(Math.random() > 0.2 ? 1 : 0);
        }
        return data;
    }

    getTokenPriceData() {
        // Generate mock price data with realistic fluctuations
        const basePrice = 0.00001818;
        const data = [];
        let price = basePrice;
        
        for (let i = 0; i < 24; i++) {
            const change = (Math.random() - 0.5) * 0.000001;
            price += change;
            price = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, price));
            data.push(price);
        }
        
        return data;
    }

    // Update methods
    updateChart(chartName, newData) {
        const chart = this.charts.get(chartName);
        if (!chart) return;

        if (newData.labels) {
            chart.data.labels = newData.labels;
        }
        
        if (newData.datasets) {
            chart.data.datasets = newData.datasets;
        } else if (newData.data) {
            chart.data.datasets[0].data = newData.data;
        }

        chart.update('active');
    }

    updateAllCharts() {
        this.charts.forEach((chart, name) => {
            // Fetch latest data for each chart
            const newData = this.getLatestData(name);
            if (newData) {
                this.updateChart(name, newData);
            }
        });
    }

    getLatestData(chartName) {
        // Fetch latest data based on chart type
        switch(chartName) {
            case 'focus':
                return { data: this.getFocusData() };
            case 'streak':
                return { data: this.getStreakData() };
            case 'token-price':
                return { data: this.getTokenPriceData() };
            default:
                return null;
        }
    }

    // Responsive handling
    handleResize() {
        this.charts.forEach(chart => {
            chart.resize();
        });
    }

    // Cleanup
    destroy() {
        this.charts.forEach(chart => {
            chart.destroy();
        });
        this.charts.clear();
    }
}

// ============================================
// 2. SPARKLINE CHARTS
// ============================================

class SparklineChart {
    constructor(element, data, options = {}) {
        this.element = element;
        this.data = data;
        this.options = {
            color: '#f97316',
            lineWidth: 2,
            height: 40,
            showDots: false,
            gradient: true,
            ...options
        };
        this.init();
    }

    init() {
        this.createCanvas();
        this.draw();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.element.offsetWidth;
        this.canvas.height = this.options.height;
        this.element.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    draw() {
        const { width, height } = this.canvas;
        const { data, options } = this;
        
        if (!data || data.length === 0) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Calculate points
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const stepX = width / (data.length - 1);
        
        const points = data.map((value, index) => ({
            x: index * stepX,
            y: height - ((value - min) / range) * height * 0.8 - height * 0.1
        }));

        // Draw gradient fill if enabled
        if (options.gradient) {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, `${options.color}33`);
            gradient.addColorStop(1, `${options.color}00`);
            
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            
            points.forEach(point => {
                this.ctx.lineTo(point.x, point.y);
            });
            
            this.ctx.lineTo(points[points.length - 1].x, height);
            this.ctx.lineTo(points[0].x, height);
            this.ctx.closePath();
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        // Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        points.forEach((point, index) => {
            if (index > 0) {
                const prevPoint = points[index - 1];
                const cp1x = prevPoint.x + (point.x - prevPoint.x) / 2;
                const cp1y = prevPoint.y;
                const cp2x = prevPoint.x + (point.x - prevPoint.x) / 2;
                const cp2y = point.y;
                
                this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
            }
        });
        
        this.ctx.strokeStyle = options.color;
        this.ctx.lineWidth = options.lineWidth;
        this.ctx.stroke();

        // Draw dots if enabled
        if (options.showDots) {
            points.forEach(point => {
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = options.color;
                this.ctx.fill();
                this.ctx.strokeStyle = '#0a0a0a';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            });
        }
    }

    update(newData) {
        this.data = newData;
        this.draw();
    }
}

// ============================================
// 3. REAL-TIME CHART UPDATER
// ============================================

class RealTimeChartUpdater {
    constructor(chartManager) {
        this.chartManager = chartManager;
        this.updateIntervals = new Map();
        this.init();
    }

    init() {
        this.setupRealTimeUpdates();
        this.setupEventListeners();
    }

    setupRealTimeUpdates() {
        // Update focus chart every minute
        this.updateIntervals.set('focus', setInterval(() => {
            this.updateFocusChart();
        }, 60000));

        // Update token price every 30 seconds
        this.updateIntervals.set('token-price', setInterval(() => {
            this.updateTokenPriceChart();
        }, 30000));

        // Update burn chart every 5 minutes
        this.updateIntervals.set('burn', setInterval(() => {
            this.updateBurnChart();
        }, 300000));
    }

    setupEventListeners() {
        // Update charts on specific events
        document.addEventListener('focus-session-complete', () => {
            this.updateFocusChart();
        });

        document.addEventListener('task-complete', () => {
            this.updateProductivityChart();
        });

        document.addEventListener('achievement-unlocked', () => {
            this.updateAchievementChart();
        });

        document.addEventListener('streak-update', () => {
            this.updateStreakChart();
        });
    }

    async updateFocusChart() {
        // Fetch latest focus data
        const data = await this.fetchFocusData();
        this.chartManager.updateChart('focus', { data });
    }

    async updateTokenPriceChart() {
        // Fetch latest price data
        try {
            const response = await fetch('/.netlify/functions/token-price');
            if (response.ok) {
                const priceData = await response.json();
                this.chartManager.updateChart('token-price', { 
                    data: priceData.prices 
                });
            }
        } catch (error) {
            console.error('Error fetching token price:', error);
        }
    }

    async updateBurnChart() {
        // Fetch latest burn data
        try {
            const response = await fetch('/.netlify/functions/burn-stats');
            if (response.ok) {
                const burnData = await response.json();
                this.chartManager.updateChart('burn', { 
                    data: burnData.burns 
                });
            }
        } catch (error) {
            console.error('Error fetching burn data:', error);
        }
    }

    async updateProductivityChart() {
        // Calculate productivity metrics
        const metrics = await this.calculateProductivityMetrics();
        this.chartManager.updateChart('productivity', {
            datasets: [{
                label: 'This Week',
                data: metrics.thisWeek
            }, {
                label: 'Last Week',
                data: metrics.lastWeek
            }]
        });
    }

    async updateStreakChart() {
        // Get streak data from localStorage
        const streakData = this.getStreakHistory();
        this.chartManager.updateChart('streak', { data: streakData });
    }

    async updateAchievementChart() {
        // Get achievement distribution
        const distribution = this.getAchievementDistribution();
        this.chartManager.updateChart('achievement', { 
            data: distribution 
        });
    }

    async fetchFocusData() {
        // Fetch from API or localStorage
        try {
            const saved = localStorage.getItem('focus_sessions');
            if (saved) {
                const sessions = JSON.parse(saved);
                // Aggregate by day
                return this.aggregateFocusSessions(sessions);
            }
        } catch (error) {
            console.error('Error fetching focus data:', error);
        }
        return [0, 0, 0, 0, 0, 0, 0];
    }

    aggregateFocusSessions(sessions) {
        const last7Days = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayTotal = sessions
                .filter(s => s.date >= date.getTime() && s.date <= dayEnd.getTime())
                .reduce((sum, s) => sum + s.duration, 0);
            
            last7Days.push(Math.round(dayTotal / 60)); // Convert to minutes
        }
        
        return last7Days;
    }

    async calculateProductivityMetrics() {
        // Calculate various productivity metrics
        return {
            thisWeek: [
                this.getMetric('focus', 'thisWeek'),
                this.getMetric('tasks', 'thisWeek'),
                this.getMetric('goals', 'thisWeek'),
                this.getMetric('habits', 'thisWeek'),
                this.getMetric('social', 'thisWeek'),
                this.getMetric('learning', 'thisWeek')
            ],
            lastWeek: [
                this.getMetric('focus', 'lastWeek'),
                this.getMetric('tasks', 'lastWeek'),
                this.getMetric('goals', 'lastWeek'),
                this.getMetric('habits', 'lastWeek'),
                this.getMetric('social', 'lastWeek'),
                this.getMetric('learning', 'lastWeek')
            ]
        };
    }

    getMetric(type, period) {
        // Calculate metric value (0-100)
        // This would fetch real data in production
        return Math.floor(Math.random() * 40) + 60;
    }

    getStreakHistory() {
        try {
            const saved = localStorage.getItem('streak_history');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading streak history:', error);
        }
        
        // Generate mock data
        return Array(30).fill(0).map(() => Math.random() > 0.3 ? 1 : 0);
    }

    getAchievementDistribution() {
        try {
            const achievements = JSON.parse(localStorage.getItem('unlocked_achievements') || '[]');
            const distribution = {
                focus: 0,
                streak: 0,
                tasks: 0,
                social: 0,
                special: 0
            };
            
            achievements.forEach(id => {
                const achievement = window.achievementSystem?.achievements.get(id);
                if (achievement) {
                    distribution[achievement.category] = (distribution[achievement.category] || 0) + 1;
                }
            });
            
            return Object.values(distribution);
        } catch (error) {
            console.error('Error getting achievement distribution:', error);
            return [0, 0, 0, 0, 0];
        }
    }

    destroy() {
        // Clear all update intervals
        this.updateIntervals.forEach(interval => clearInterval(interval));
        this.updateIntervals.clear();
    }
}

// ============================================
// 4. INITIALIZATION
// ============================================

// Initialize data visualizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDataVisualizations);
} else {
    initializeDataVisualizations();
}

async function initializeDataVisualizations() {
    // Initialize chart manager
    window.chartManager = new ChartManager();
    await window.chartManager.init();
    
    // Initialize real-time updater
    window.realTimeChartUpdater = new RealTimeChartUpdater(window.chartManager);
    
    // Initialize sparklines
    document.querySelectorAll('[data-sparkline]').forEach(element => {
        const data = JSON.parse(element.dataset.sparkline || '[]');
        new SparklineChart(element, data, {
            color: element.dataset.sparklineColor || '#f97316',
            gradient: element.dataset.sparklineGradient !== 'false'
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        window.chartManager?.handleResize();
    });
    
    console.log('✅ Data visualizations initialized');
}

// Export for use in other modules
export {
    ChartManager,
    SparklineChart,
    RealTimeChartUpdater
};
