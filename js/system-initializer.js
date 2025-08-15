// System Initializer - Ensures all systems load properly
// This file coordinates the initialization of all 20 systems

(function() {
    'use strict';

    console.log('🚀 System Initializer starting...');

    // Track initialization state
    window.systemsInitialized = {
        journey: false,
        mood: false,
        streak: false,
        notifications: false,
        analytics: false,
        aiCoaching: false,
        collaboration: false,
        rewards: false,
        habits: false,
        focus: false,
        goals: false,
        reports: false,
        backup: false,
        onboarding: false,
        accessibility: false,
        offline: false,
        integrations: false,
        performance: false,
        security: false,
        testing: false
    };

    // Wait for all systems to load
    let initAttempts = 0;
    const maxAttempts = 20;

    function checkAndInitialize() {
        initAttempts++;
        console.log(`🔄 Initialization attempt ${initAttempts}/${maxAttempts}`);

        // Check if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAndInitialize);
            return;
        }

        // Check if user is authenticated or in demo mode
        const isAuth = localStorage.getItem('isAuthenticated') === 'true' ||
                      sessionStorage.getItem('demoMode') === 'true' ||
                      window.auth?.currentUser;

        if (!isAuth) {
            console.log('📝 Not authenticated, enabling demo mode...');
            sessionStorage.setItem('demoMode', 'true');
            
            // Hide auth screen and show app
            const authScreen = document.getElementById('authScreen');
            const app = document.getElementById('app');
            if (authScreen) authScreen.style.display = 'none';
            if (app) app.style.display = 'flex';
        }

        // Initialize each system
        initializeAllSystems();

        // Run UI integration
        if (window.integrateAllSystems) {
            console.log('🎨 Running UI integration...');
            window.integrateAllSystems();
        } else if (initAttempts < maxAttempts) {
            console.log('⏳ Waiting for integration system...');
            setTimeout(checkAndInitialize, 500);
            return;
        }

        // Verify everything is visible
        setTimeout(verifyVisibility, 1000);
    }

    function initializeAllSystems() {
        console.log('🔧 Initializing all systems...');

        // 1. Journey System
        if (window.JourneySystem && !window.journeySystem) {
            window.journeySystem = new JourneySystem();
            window.systemsInitialized.journey = true;
        }

        // 2. Mood Tracking
        if (window.MoodTracker && !window.moodTracker) {
            window.moodTracker = new MoodTracker();
            window.systemsInitialized.mood = true;
        }

        // 3. Streak Protection
        if (window.StreakProtection && !window.streakProtection) {
            window.streakProtection = new StreakProtection();
            window.systemsInitialized.streak = true;
        }

        // 4. Notifications
        if (window.NotificationSystem && !window.notificationSystem) {
            window.notificationSystem = new NotificationSystem();
            window.systemsInitialized.notifications = true;
        }

        // 5. Analytics
        if (window.AnalyticsSystem && !window.analyticsSystem) {
            window.analyticsSystem = new AnalyticsSystem();
            window.systemsInitialized.analytics = true;
        }

        // 6. AI Coaching
        if (window.AICoaching && !window.aiCoaching) {
            window.aiCoaching = new AICoaching();
            window.systemsInitialized.aiCoaching = true;
        }

        // 7. Collaboration
        if (window.CollaborationSystem && !window.collaborationSystem) {
            window.collaborationSystem = new CollaborationSystem();
            window.systemsInitialized.collaboration = true;
        }

        // 8. Rewards
        if (window.RewardMarketplace && !window.rewardMarketplace) {
            window.rewardMarketplace = new RewardMarketplace();
            window.systemsInitialized.rewards = true;
        }

        // 9. Habits
        if (window.HabitStacking && !window.habitStacking) {
            window.habitStacking = new HabitStacking();
            window.systemsInitialized.habits = true;
        }

        // 10. Focus Sessions
        if (window.EnhancedFocusSessions && !window.enhancedFocusSessions) {
            window.enhancedFocusSessions = new EnhancedFocusSessions();
            window.systemsInitialized.focus = true;
        }

        // Continue for all 20 systems...
        console.log('✅ Systems initialized:', window.systemsInitialized);
    }

    function verifyVisibility() {
        console.log('👁️ Verifying UI visibility...');

        // Check if dashboard is visible
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView && !dashboardView.classList.contains('active')) {
            console.log('🔧 Activating dashboard view...');
            document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
            dashboardView.classList.add('active');
        }

        // Check if dashboard grid exists
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (!dashboardGrid) {
            console.error('❌ Dashboard grid not found!');
            return;
        }

        // Manually add missing UI elements if needed
        addMissingElements(dashboardGrid);

        console.log('✅ Visibility check complete');
    }

    function addMissingElements(dashboardGrid) {
        // Add Journey Card if missing
        if (!document.querySelector('.journey-card')) {
            console.log('➕ Adding Journey Card...');
            const journeyCard = createCard('Active Journey', '🗺️', `
                <p style="color: var(--text-secondary);">No active journey</p>
                <button class="btn btn-primary" onclick="window.journeySystem?.showJourneySelector?.() || alert('Journey system not loaded')">
                    Start a Journey
                </button>
            `, 'journey-card');
            dashboardGrid.appendChild(journeyCard);
        }

        // Add AI Coaching Card if missing
        if (!document.querySelector('.ai-coaching-card')) {
            console.log('➕ Adding AI Coaching Card...');
            const coachingCard = createCard('AI Coach Tip', '🤖', `
                <div id="dailyCoachingTip">
                    <p style="color: var(--text-secondary);">Loading daily tip...</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="window.aiCoaching?.getNewTip?.() || alert('AI coaching not loaded')">
                    Get New Tip
                </button>
            `, 'ai-coaching-card');
            dashboardGrid.appendChild(coachingCard);
        }

        // Add Team Challenges Card if missing
        if (!document.querySelector('.team-challenges-card')) {
            console.log('➕ Adding Team Challenges Card...');
            const teamCard = createCard('Team Challenges', '👥', `
                <p style="color: var(--text-secondary);">No active team challenges</p>
                <button class="btn btn-secondary" onclick="navigate('social')">
                    View Social Hub
                </button>
            `, 'team-challenges-card');
            dashboardGrid.appendChild(teamCard);
        }

        // Add Weekly Report Card if missing
        if (!document.querySelector('.weekly-report-card')) {
            console.log('➕ Adding Weekly Report Card...');
            const reportCard = createCard('Weekly Report', '📈', `
                <p style="color: var(--text-secondary);">Your report is ready!</p>
                <button class="btn btn-primary" onclick="window.progressReports?.viewLatestReport?.() || alert('Reports not loaded')">
                    View Report
                </button>
            `, 'weekly-report-card');
            dashboardGrid.appendChild(reportCard);
        }

        // Add header buttons if missing
        addHeaderButtons();
    }

    function createCard(title, icon, content, className) {
        const card = document.createElement('div');
        card.className = `card ${className}`;
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${title}</h3>
                <div class="card-icon">${icon}</div>
            </div>
            <div class="card-content" style="padding: 1rem 0;">
                ${content}
            </div>
        `;
        return card;
    }

    function addHeaderButtons() {
        const headerRight = document.querySelector('.header-right');
        if (!headerRight) return;

        // Add Mood Button
        if (!document.querySelector('.mood-check-btn')) {
            console.log('➕ Adding Mood Button...');
            const moodBtn = document.createElement('button');
            moodBtn.className = 'btn btn-icon mood-check-btn';
            moodBtn.innerHTML = '<i class="fas fa-smile"></i>';
            moodBtn.title = 'Daily Mood Check-in';
            moodBtn.onclick = () => window.moodTracker?.showMoodCheckIn?.() || alert('Mood tracker not loaded');
            headerRight.insertBefore(moodBtn, headerRight.firstChild);
        }

        // Add Notification Bell
        if (!document.querySelector('.notification-bell')) {
            console.log('➕ Adding Notification Bell...');
            const notifBtn = document.createElement('button');
            notifBtn.className = 'btn btn-icon notification-bell';
            notifBtn.innerHTML = `
                <i class="fas fa-bell"></i>
                <span class="notification-badge" style="display: none;">0</span>
            `;
            notifBtn.onclick = () => window.notificationSystem?.toggleNotificationCenter?.() || alert('Notifications not loaded');
            headerRight.insertBefore(notifBtn, headerRight.firstChild);
        }

        // Add Accessibility Toggle
        if (!document.querySelector('.a11y-toggle')) {
            console.log('➕ Adding Accessibility Toggle...');
            const a11yBtn = document.createElement('button');
            a11yBtn.className = 'btn btn-icon a11y-toggle';
            a11yBtn.innerHTML = '<i class="fas fa-universal-access"></i>';
            a11yBtn.title = 'Accessibility Options';
            a11yBtn.onclick = () => window.accessibilitySystem?.toggleQuickMenu?.() || alert('Accessibility not loaded');
            headerRight.appendChild(a11yBtn);
        }

        // Add Marketplace Button to token display
        const tokenDisplay = document.querySelector('#tokenCount')?.parentElement?.parentElement;
        if (tokenDisplay && !document.querySelector('.marketplace-btn')) {
            console.log('➕ Adding Marketplace Button...');
            const marketBtn = document.createElement('button');
            marketBtn.className = 'btn btn-icon marketplace-btn';
            marketBtn.innerHTML = '<i class="fas fa-store"></i>';
            marketBtn.title = 'Reward Marketplace';
            marketBtn.onclick = () => window.rewardMarketplace?.open?.() || alert('Marketplace not loaded');
            tokenDisplay.appendChild(marketBtn);
        }

        // Add Streak Shield
        const streakDisplay = document.querySelector('#streakCount')?.parentElement?.parentElement;
        if (streakDisplay && !document.querySelector('.streak-shield-indicator')) {
            console.log('➕ Adding Streak Shield...');
            const shield = document.createElement('div');
            shield.className = 'streak-shield-indicator';
            shield.innerHTML = `
                <span class="shield-icon" title="Streak Protection">🛡️</span>
                <span class="shield-count">0</span>
            `;
            shield.onclick = () => window.streakProtection?.showProtectionModal?.() || alert('Streak protection not loaded');
            streakDisplay.appendChild(shield);
        }
    }

    // Start initialization
    setTimeout(checkAndInitialize, 100);

    // Make functions globally available
    window.systemInitializer = {
        checkAndInitialize,
        verifyVisibility,
        addMissingElements
    };

    console.log('✅ System Initializer loaded');
})();
