// Complete UI Integration for All 20 Systems
// This file properly integrates all systems into their correct UI locations

(function() {
    'use strict';

    // Wait for DOM and all systems to load
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(integrateAllSystems, 1000); // Give time for all systems to initialize
    });

    function integrateAllSystems() {
        console.log('🔧 Starting complete UI integration...');

        // 1. Journey System - Add to Dashboard
        integrateJourneySystem();
        
        // 2. Mood Tracking - Add to Header Quick Actions
        integrateMoodTracking();
        
        // 3. Streak Protection - Add to Streak Display
        integrateStreakProtection();
        
        // 4. Notifications - Add to Header
        integrateNotifications();
        
        // 5. Analytics - Already has nav item, enhance view
        enhanceAnalyticsView();
        
        // 6. AI Coaching - Enhance AI Chat view
        enhanceAICoaching();
        
        // 7. Collaboration - Enhance Social view
        enhanceCollaboration();
        
        // 8. Reward Marketplace - Add to Dashboard
        integrateRewardMarketplace();
        
        // 9. Habit Stacking - Enhance Habits view
        enhanceHabitStacking();
        
        // 10. Focus Sessions - Enhance Burn Timer
        enhanceFocusSessions();
        
        // 11. Goal Templates - Enhance Goals view
        enhanceGoalTemplates();
        
        // 12. Progress Reports - Add to Analytics
        integrateProgressReports();
        
        // 13. Backup/Restore - Add to Settings
        integrateBackupRestore();
        
        // 14. Onboarding - Auto-start for new users
        checkAndStartOnboarding();
        
        // 15. Accessibility - Add to Settings
        integrateAccessibility();
        
        // 16. Offline Mode - Add indicator to header
        integrateOfflineIndicator();
        
        // 17. Integrations - Add to Settings
        integrateThirdParty();
        
        // 18. Performance - Add to footer
        integratePerformanceMonitor();
        
        // 19. Security - Add to Settings
        integrateSecurity();
        
        // 20. Testing - Add dev tools
        integrateTestingTools();

        console.log('✅ Complete UI integration finished!');
    }

    // 1. Journey System Integration
    function integrateJourneySystem() {
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (!dashboardGrid || document.querySelector('.journey-card')) return;

        const journeyCard = document.createElement('div');
        journeyCard.className = 'card journey-card';
        journeyCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Active Journey</h3>
                <div class="card-icon">🗺️</div>
            </div>
            <div class="journey-content">
                <div id="activeJourneyDisplay">
                    <p style="color: var(--text-secondary);">No active journey</p>
                    <button class="btn btn-primary" onclick="window.journeySystem?.showJourneySelector()">
                        Start a Journey
                    </button>
                </div>
            </div>
        `;
        
        // Insert after welcome card
        const welcomeCard = dashboardGrid.querySelector('.card');
        if (welcomeCard) {
            welcomeCard.after(journeyCard);
        }
    }

    // 2. Mood Tracking Integration
    function integrateMoodTracking() {
        const headerRight = document.querySelector('.header-right');
        if (!headerRight || document.querySelector('.mood-check-btn')) return;

        const moodButton = document.createElement('button');
        moodButton.className = 'btn btn-icon mood-check-btn';
        moodButton.innerHTML = '<i class="fas fa-smile"></i>';
        moodButton.onclick = () => window.moodTracker?.showMoodCheckIn();
        moodButton.title = 'Daily Mood Check-in';

        // Insert before notification button
        const quickStats = headerRight.querySelector('.quick-stats');
        if (quickStats) {
            headerRight.insertBefore(moodButton, quickStats);
        }
    }

    // 3. Streak Protection Integration
    function integrateStreakProtection() {
        const streakDisplay = document.querySelector('#streakCount')?.parentElement?.parentElement;
        if (!streakDisplay || document.querySelector('.streak-shield-indicator')) return;

        const shieldIndicator = document.createElement('div');
        shieldIndicator.className = 'streak-shield-indicator';
        shieldIndicator.innerHTML = `
            <span class="shield-icon" title="Streak Protection">🛡️</span>
            <span class="shield-count">0</span>
        `;
        shieldIndicator.onclick = () => window.streakProtection?.showProtectionModal();
        
        streakDisplay.appendChild(shieldIndicator);
        
        // Update shield count
        if (window.streakProtection) {
            const shields = window.streakProtection.getAvailableShields();
            shieldIndicator.querySelector('.shield-count').textContent = shields;
        }
    }

    // 4. Notifications Integration
    function integrateNotifications() {
        const headerRight = document.querySelector('.header-right');
        if (!headerRight || document.querySelector('.notification-bell')) return;

        const notificationBell = document.createElement('button');
        notificationBell.className = 'btn btn-icon notification-bell';
        notificationBell.innerHTML = `
            <i class="fas fa-bell"></i>
            <span class="notification-badge" style="display: none;">0</span>
        `;
        notificationBell.onclick = () => window.notificationSystem?.toggleNotificationCenter();
        
        headerRight.insertBefore(notificationBell, headerRight.firstChild);
        
        // Update notification count
        if (window.notificationSystem) {
            window.notificationSystem.updateBadgeCount();
        }
    }

    // 5. Analytics View Enhancement
    function enhanceAnalyticsView() {
        // The analytics dashboard is already created by analytics-dashboard.js
        // Just ensure it's properly connected to the navigation
        const analyticsNav = document.querySelector('[data-view="analytics"]');
        if (analyticsNav && !analyticsNav.hasAttribute('data-enhanced')) {
            analyticsNav.setAttribute('data-enhanced', 'true');
            // Analytics view will be created when navigated to
        }
    }

    // 6. AI Coaching Enhancement
    function enhanceAICoaching() {
        // Add coaching tips to dashboard
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (!dashboardGrid || document.querySelector('.ai-coaching-card')) return;

        const coachingCard = document.createElement('div');
        coachingCard.className = 'card ai-coaching-card';
        coachingCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">AI Coach Tip</h3>
                <div class="card-icon">🤖</div>
            </div>
            <div class="coaching-content">
                <div id="dailyCoachingTip">
                    <div class="loading-spinner"></div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="window.aiCoaching?.getNewTip()">
                    Get New Tip
                </button>
            </div>
        `;
        
        dashboardGrid.appendChild(coachingCard);
        
        // Load initial tip
        if (window.aiCoaching) {
            window.aiCoaching.loadDailyTip();
        }
    }

    // 7. Collaboration Enhancement
    function enhanceCollaboration() {
        // Enhanced in social view - add team challenges to dashboard
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (!dashboardGrid || document.querySelector('.team-challenges-card')) return;

        const teamCard = document.createElement('div');
        teamCard.className = 'card team-challenges-card';
        teamCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Team Challenges</h3>
                <div class="card-icon">👥</div>
            </div>
            <div class="team-content">
                <div id="activeTeamChallenges">
                    <p style="color: var(--text-secondary);">No active team challenges</p>
                    <button class="btn btn-secondary" onclick="navigate('social')">
                        View Social Hub
                    </button>
                </div>
            </div>
        `;
        
        dashboardGrid.appendChild(teamCard);
    }

    // 8. Reward Marketplace Integration
    function integrateRewardMarketplace() {
        // Add marketplace button to header near tokens
        const tokenDisplay = document.querySelector('#tokenCount')?.parentElement?.parentElement;
        if (!tokenDisplay || document.querySelector('.marketplace-btn')) return;

        const marketplaceBtn = document.createElement('button');
        marketplaceBtn.className = 'btn btn-icon marketplace-btn';
        marketplaceBtn.innerHTML = '<i class="fas fa-store"></i>';
        marketplaceBtn.onclick = () => window.rewardMarketplace?.open();
        marketplaceBtn.title = 'Reward Marketplace';
        
        tokenDisplay.appendChild(marketplaceBtn);
    }

    // 9. Habit Stacking Enhancement
    function enhanceHabitStacking() {
        // Will be enhanced when habits view is loaded
        const habitsNav = document.querySelector('[data-view="habits"]');
        if (habitsNav && !habitsNav.hasAttribute('data-stacking')) {
            habitsNav.setAttribute('data-stacking', 'true');
        }
    }

    // 10. Focus Sessions Enhancement
    function enhanceFocusSessions() {
        // Add focus mode selector to burn timer view
        const burnNav = document.querySelector('[data-view="burn"]');
        if (burnNav && !burnNav.hasAttribute('data-enhanced-focus')) {
            burnNav.setAttribute('data-enhanced-focus', 'true');
        }
    }

    // 11. Goal Templates Enhancement
    function enhanceGoalTemplates() {
        // Will be enhanced when goals view is loaded
        const goalsNav = document.querySelector('[data-view="goals"]');
        if (goalsNav && !goalsNav.hasAttribute('data-templates')) {
            goalsNav.setAttribute('data-templates', 'true');
        }
    }

    // 12. Progress Reports Integration
    function integrateProgressReports() {
        // Add to analytics view and dashboard
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (!dashboardGrid || document.querySelector('.weekly-report-card')) return;

        const reportCard = document.createElement('div');
        reportCard.className = 'card weekly-report-card';
        reportCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Weekly Report</h3>
                <div class="card-icon">📈</div>
            </div>
            <div class="report-summary">
                <p style="color: var(--text-secondary);">Your report is ready!</p>
                <button class="btn btn-primary" onclick="window.progressReports?.viewLatestReport()">
                    View Report
                </button>
            </div>
        `;
        
        dashboardGrid.appendChild(reportCard);
    }

    // 13. Backup/Restore Integration
    function integrateBackupRestore() {
        // Will be added to settings view
        const settingsNav = document.querySelector('[data-view="settings"]');
        if (settingsNav && !settingsNav.hasAttribute('data-backup')) {
            settingsNav.setAttribute('data-backup', 'true');
        }
    }

    // 14. Onboarding Check
    function checkAndStartOnboarding() {
        if (!localStorage.getItem('onboarding_completed') && window.enhancedOnboarding) {
            setTimeout(() => {
                window.enhancedOnboarding.start();
            }, 2000);
        }
    }

    // 15. Accessibility Integration
    function integrateAccessibility() {
        // Add quick toggle to header
        const headerRight = document.querySelector('.header-right');
        if (!headerRight || document.querySelector('.a11y-toggle')) return;

        const a11yToggle = document.createElement('button');
        a11yToggle.className = 'btn btn-icon a11y-toggle';
        a11yToggle.innerHTML = '<i class="fas fa-universal-access"></i>';
        a11yToggle.onclick = () => window.accessibilitySystem?.toggleQuickMenu();
        a11yToggle.title = 'Accessibility Options';
        
        headerRight.appendChild(a11yToggle);
    }

    // 16. Offline Indicator Integration
    function integrateOfflineIndicator() {
        const header = document.querySelector('.header');
        if (!header || document.querySelector('.offline-indicator')) return;

        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <i class="fas fa-wifi"></i>
            <span>Offline Mode</span>
        `;
        indicator.style.display = 'none';
        
        header.appendChild(indicator);
        
        // Update based on connection status
        if (window.offlineMode) {
            window.offlineMode.updateIndicator();
        }
    }

    // 17. Third-party Integrations
    function integrateThirdParty() {
        // Will be added to settings view
        const settingsNav = document.querySelector('[data-view="settings"]');
        if (settingsNav && !settingsNav.hasAttribute('data-integrations')) {
            settingsNav.setAttribute('data-integrations', 'true');
        }
    }

    // 18. Performance Monitor Integration
    function integratePerformanceMonitor() {
        // Add performance widget to footer (dev mode only)
        if (localStorage.getItem('devMode') === 'true') {
            const footer = document.querySelector('.footer') || document.body;
            const perfWidget = document.createElement('div');
            perfWidget.className = 'performance-widget';
            perfWidget.id = 'performanceWidget';
            footer.appendChild(perfWidget);
            
            if (window.performanceMonitor) {
                window.performanceMonitor.showWidget();
            }
        }
    }

    // 19. Security Integration
    function integrateSecurity() {
        // Security settings will be in settings view
        const settingsNav = document.querySelector('[data-view="settings"]');
        if (settingsNav && !settingsNav.hasAttribute('data-security')) {
            settingsNav.setAttribute('data-security', 'true');
        }
    }

    // 20. Testing Tools Integration
    function integrateTestingTools() {
        // Add test mode indicator
        if (window.location.search.includes('test=true')) {
            document.body.classList.add('test-mode');
            
            const testIndicator = document.createElement('div');
            testIndicator.className = 'test-mode-indicator';
            testIndicator.innerHTML = '🧪 Test Mode';
            document.body.appendChild(testIndicator);
        }
    }

    // Enhanced navigation to handle new views
    const originalNavigate = window.navigate;
    window.navigate = function(view) {
        // Call original navigate
        if (originalNavigate) {
            originalNavigate(view);
        }

        // Enhance views after navigation
        setTimeout(() => {
            switch(view) {
                case 'analytics':
                    if (window.analyticsSystem && !document.querySelector('.analytics-dashboard')) {
                        window.analyticsSystem.renderDashboard();
                    }
                    break;
                    
                case 'goals':
                    if (window.goalTemplates && !document.querySelector('.goal-templates-section')) {
                        window.goalTemplates.enhanceGoalsView();
                    }
                    break;
                    
                case 'habits':
                    if (window.habitStacking && !document.querySelector('.habit-stacks-section')) {
                        window.habitStacking.enhanceHabitsView();
                    }
                    break;
                    
                case 'burn':
                    if (window.enhancedFocusSessions && !document.querySelector('.focus-modes-selector')) {
                        window.enhancedFocusSessions.enhanceBurnTimer();
                    }
                    break;
                    
                case 'settings':
                    enhanceSettingsView();
                    break;
            }
        }, 100);
    };

    // Enhance settings view with all system settings
    function enhanceSettingsView() {
        const settingsContent = document.querySelector('#settingsView .view-content');
        if (!settingsContent || settingsContent.hasAttribute('data-enhanced')) return;
        
        settingsContent.setAttribute('data-enhanced', 'true');
        
        // Add sections for each system
        const sections = [
            { id: 'security-settings', title: 'Security', icon: '🔐', system: 'securitySystem' },
            { id: 'backup-settings', title: 'Backup & Restore', icon: '💾', system: 'backupRestore' },
            { id: 'integration-settings', title: 'Integrations', icon: '🔗', system: 'thirdPartyIntegrations' },
            { id: 'accessibility-settings', title: 'Accessibility', icon: '♿', system: 'accessibilitySystem' },
            { id: 'notification-settings', title: 'Notifications', icon: '🔔', system: 'notificationSystem' }
        ];

        sections.forEach(section => {
            if (!document.querySelector(`#${section.id}`)) {
                const sectionEl = document.createElement('div');
                sectionEl.className = 'settings-section';
                sectionEl.id = section.id;
                sectionEl.innerHTML = `
                    <h3>${section.icon} ${section.title}</h3>
                    <div class="section-content">
                        <button class="btn btn-secondary" onclick="window.${section.system}?.openSettings()">
                            Configure ${section.title}
                        </button>
                    </div>
                `;
                settingsContent.appendChild(sectionEl);
            }
        });
    }

    // Add CSS for new UI elements
    const styles = `
        <style>
        /* Integration Styles */
        .journey-card .journey-content {
            padding: 1rem 0;
        }

        .mood-check-btn {
            margin-right: 1rem;
        }

        .streak-shield-indicator {
            display: inline-flex;
            align-items: center;
            margin-left: 0.5rem;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .streak-shield-indicator:hover {
            opacity: 1;
        }

        .shield-count {
            font-size: 0.8rem;
            margin-left: 0.25rem;
        }

        .notification-bell {
            position: relative;
            margin-right: 1rem;
        }

        .notification-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: var(--error-color);
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .marketplace-btn {
            margin-left: 0.5rem;
            font-size: 0.9rem;
        }

        .ai-coaching-card .coaching-content {
            min-height: 100px;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .team-challenges-card .team-content {
            padding: 1rem 0;
        }

        .weekly-report-card .report-summary {
            padding: 1rem 0;
            text-align: center;
        }

        .offline-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--warning-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            z-index: 100;
        }

        .performance-widget {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 1rem;
            border-radius: 8px;
            font-family: monospace;
            font-size: 0.8rem;
            z-index: 1000;
        }

        .test-mode-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            z-index: 10000;
        }

        .a11y-toggle {
            margin-left: 1rem;
        }

        .settings-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
        }

        .settings-section h3 {
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .section-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .performance-widget {
                display: none;
            }

            .offline-indicator {
                top: auto;
                bottom: 20px;
                font-size: 0.8rem;
            }
        }
        </style>
    `;

    // Add styles
    if (!document.querySelector('#integration-styles')) {
        const styleEl = document.createElement('div');
        styleEl.id = 'integration-styles';
        styleEl.innerHTML = styles;
        document.head.appendChild(styleEl.firstElementChild);
    }

    console.log('✅ Complete UI Integration system initialized');
})();
