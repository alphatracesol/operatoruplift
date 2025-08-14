/**
 * Streak Protection System
 * Protect and manage streaks with shields, vacation mode, and recovery options
 */

window.StreakProtectionSystem = {
    // Streak configuration
    config: {
        maxShields: 5,
        vacationModeDays: 30,
        recoveryWindowHours: 24,
        multiplierThresholds: [7, 14, 30, 60, 100, 365],
        shieldCost: 100 // Points to purchase a shield
    },

    // Streak milestones with rewards
    milestones: [
        { days: 3, name: 'Starter', reward: 10, badge: '🌱' },
        { days: 7, name: 'Week Warrior', reward: 50, badge: '⚔️' },
        { days: 14, name: 'Fortnight Fighter', reward: 100, badge: '🛡️' },
        { days: 30, name: 'Monthly Master', reward: 250, badge: '👑' },
        { days: 60, name: 'Dedicated', reward: 500, badge: '💎' },
        { days: 100, name: 'Century Champion', reward: 1000, badge: '🏆' },
        { days: 365, name: 'Legendary', reward: 5000, badge: '🌟' }
    ],

    // Initialize the streak protection system
    initialize() {
        this.loadStreakData();
        this.checkDailyStreak();
        this.setupEventListeners();
        this.startStreakTimer();
    },

    // Load streak data from storage
    loadStreakData() {
        const defaultData = {
            currentStreak: 0,
            bestStreak: 0,
            lastCheckIn: null,
            shields: 1, // Start with 1 free shield
            vacationMode: false,
            vacationEndDate: null,
            multiplier: 1,
            totalDaysStreak: 0,
            milestonesReached: [],
            recoveryAvailable: false,
            recoveryExpires: null
        };

        const saved = localStorage.getItem('streakData');
        this.streakData = saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    },

    // Save streak data
    saveStreakData() {
        localStorage.setItem('streakData', JSON.stringify(this.streakData));
        this.updateStreakDisplay();
    },

    // Check and update daily streak
    checkDailyStreak() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const lastCheckIn = this.streakData.lastCheckIn;

        if (!lastCheckIn) {
            // First time check-in
            this.startNewStreak();
            return;
        }

        const lastDate = new Date(lastCheckIn);
        const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            // Already checked in today
            return;
        } else if (daysDiff === 1) {
            // Consecutive day - continue streak
            this.continueStreak();
        } else if (daysDiff > 1) {
            // Missed days - check for protection
            this.handleMissedDays(daysDiff);
        }
    },

    // Start a new streak
    startNewStreak() {
        this.streakData.currentStreak = 1;
        this.streakData.lastCheckIn = new Date().toISOString().split('T')[0];
        this.streakData.multiplier = 1;
        this.saveStreakData();
        
        window.showToast('New streak started! Keep it going! 🔥', 'success');
    },

    // Continue existing streak
    continueStreak() {
        this.streakData.currentStreak++;
        this.streakData.totalDaysStreak++;
        this.streakData.lastCheckIn = new Date().toISOString().split('T')[0];
        
        // Update best streak
        if (this.streakData.currentStreak > this.streakData.bestStreak) {
            this.streakData.bestStreak = this.streakData.currentStreak;
            window.showToast(`New best streak: ${this.streakData.bestStreak} days! 🎉`, 'success');
        }

        // Calculate multiplier
        this.updateMultiplier();

        // Check milestones
        this.checkMilestones();

        // Award daily streak points
        const points = this.calculateStreakPoints();
        this.awardStreakPoints(points);

        this.saveStreakData();
        
        window.showToast(`Day ${this.streakData.currentStreak} streak! +${points} points`, 'success');
    },

    // Handle missed days
    handleMissedDays(daysMissed) {
        // Check if in vacation mode
        if (this.streakData.vacationMode) {
            const vacationEnd = new Date(this.streakData.vacationEndDate);
            const now = new Date();
            
            if (now <= vacationEnd) {
                // Still in vacation mode - preserve streak
                this.streakData.lastCheckIn = new Date().toISOString().split('T')[0];
                this.saveStreakData();
                window.showToast('Welcome back! Your streak was protected by vacation mode 🏖️', 'info');
                
                // End vacation mode if checking in
                this.endVacationMode();
                return;
            } else {
                // Vacation mode expired
                this.endVacationMode();
            }
        }

        // Check for recovery window
        if (this.streakData.recoveryAvailable && this.streakData.recoveryExpires) {
            const expires = new Date(this.streakData.recoveryExpires);
            if (new Date() <= expires) {
                // Within recovery window
                this.showRecoveryOption();
                return;
            }
        }

        // Check for shields
        if (this.streakData.shields > 0) {
            this.showShieldOption(daysMissed);
        } else {
            // No protection - streak broken
            this.breakStreak();
        }
    },

    // Show shield usage option
    showShieldOption(daysMissed) {
        const modal = document.createElement('div');
        modal.className = 'shield-modal';
        modal.innerHTML = `
            <div class="shield-modal-content">
                <div class="shield-icon">🛡️</div>
                <h2>Streak in Danger!</h2>
                <p>You missed ${daysMissed} day${daysMissed > 1 ? 's' : ''}.</p>
                <p>You have ${this.streakData.shields} shield${this.streakData.shields > 1 ? 's' : ''} available.</p>
                
                <div class="shield-options">
                    <button class="btn btn-primary" onclick="StreakProtectionSystem.useShield()">
                        Use Shield & Continue Streak
                    </button>
                    <button class="btn btn-secondary" onclick="StreakProtectionSystem.declineShield()">
                        Let Streak Break
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
        this.shieldModal = modal;
    },

    // Use a streak shield
    useShield() {
        if (this.streakData.shields <= 0) return;

        this.streakData.shields--;
        this.streakData.lastCheckIn = new Date().toISOString().split('T')[0];
        
        // Continue streak but reset multiplier
        this.streakData.multiplier = 1;
        
        this.saveStreakData();
        
        if (this.shieldModal) {
            this.shieldModal.remove();
            this.shieldModal = null;
        }

        window.showToast(`Shield used! Streak saved: ${this.streakData.currentStreak} days 🛡️`, 'success');
        
        // Show shield animation
        this.showShieldAnimation();
    },

    // Decline shield usage
    declineShield() {
        if (this.shieldModal) {
            this.shieldModal.remove();
            this.shieldModal = null;
        }
        this.breakStreak();
    },

    // Break the streak
    breakStreak() {
        const lostStreak = this.streakData.currentStreak;
        
        // Enable recovery window
        this.streakData.recoveryAvailable = true;
        this.streakData.recoveryExpires = new Date(Date.now() + this.config.recoveryWindowHours * 60 * 60 * 1000).toISOString();
        
        // Reset streak
        this.streakData.currentStreak = 0;
        this.streakData.multiplier = 1;
        this.streakData.lastCheckIn = null;
        
        this.saveStreakData();
        
        window.showToast(`Streak broken after ${lostStreak} days 💔 You have 24 hours to recover it!`, 'error');
        
        // Show recovery option
        this.showRecoveryOption();
    },

    // Show recovery option
    showRecoveryOption() {
        const modal = document.createElement('div');
        modal.className = 'recovery-modal';
        
        const hoursLeft = Math.floor((new Date(this.streakData.recoveryExpires) - new Date()) / (1000 * 60 * 60));
        
        modal.innerHTML = `
            <div class="recovery-modal-content">
                <div class="recovery-icon">🔄</div>
                <h2>Recover Your Streak!</h2>
                <p>You have ${hoursLeft} hours to recover your streak.</p>
                <p>Complete today's tasks to restore your ${this.streakData.currentStreak || 1} day streak!</p>
                
                <div class="recovery-cost">
                    <span>Recovery Cost: 50 Points</span>
                </div>
                
                <div class="recovery-options">
                    <button class="btn btn-primary" onclick="StreakProtectionSystem.recoverStreak()">
                        Recover Streak (50 pts)
                    </button>
                    <button class="btn btn-secondary" onclick="StreakProtectionSystem.closeRecoveryModal()">
                        Start Fresh
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
        this.recoveryModal = modal;
    },

    // Recover streak
    recoverStreak() {
        const points = parseInt(localStorage.getItem('userPoints') || '0');
        const cost = 50;

        if (points < cost) {
            window.showToast('Not enough points to recover streak!', 'error');
            return;
        }

        // Deduct points
        localStorage.setItem('userPoints', (points - cost).toString());

        // Restore streak
        const savedStreak = parseInt(localStorage.getItem('lastBrokenStreak') || '1');
        this.streakData.currentStreak = savedStreak;
        this.streakData.lastCheckIn = new Date().toISOString().split('T')[0];
        this.streakData.recoveryAvailable = false;
        this.streakData.recoveryExpires = null;

        this.saveStreakData();

        if (this.recoveryModal) {
            this.recoveryModal.remove();
            this.recoveryModal = null;
        }

        window.showToast(`Streak recovered! Back to ${this.streakData.currentStreak} days! 🎉`, 'success');
        this.showRecoveryAnimation();
    },

    // Close recovery modal
    closeRecoveryModal() {
        if (this.recoveryModal) {
            this.recoveryModal.remove();
            this.recoveryModal = null;
        }
        this.startNewStreak();
    },

    // Enable vacation mode
    enableVacationMode(days) {
        if (days > this.config.vacationModeDays) {
            window.showToast(`Maximum vacation mode is ${this.config.vacationModeDays} days`, 'error');
            return;
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);

        this.streakData.vacationMode = true;
        this.streakData.vacationEndDate = endDate.toISOString();
        
        this.saveStreakData();
        
        window.showToast(`Vacation mode enabled for ${days} days. Your streak is protected! 🏖️`, 'success');
        this.updateStreakDisplay();
    },

    // End vacation mode
    endVacationMode() {
        this.streakData.vacationMode = false;
        this.streakData.vacationEndDate = null;
        this.saveStreakData();
        
        window.showToast('Vacation mode ended. Welcome back!', 'info');
    },

    // Update streak multiplier
    updateMultiplier() {
        const streak = this.streakData.currentStreak;
        let multiplier = 1;

        for (const threshold of this.config.multiplierThresholds) {
            if (streak >= threshold) {
                multiplier = 1 + (this.config.multiplierThresholds.indexOf(threshold) + 1) * 0.5;
            }
        }

        this.streakData.multiplier = multiplier;
    },

    // Calculate streak points
    calculateStreakPoints() {
        const basePoints = 10;
        const streakBonus = Math.floor(this.streakData.currentStreak / 10) * 5;
        const multipliedPoints = Math.floor((basePoints + streakBonus) * this.streakData.multiplier);
        
        return multipliedPoints;
    },

    // Award streak points
    awardStreakPoints(points) {
        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        localStorage.setItem('userPoints', (currentPoints + points).toString());
        
        // Update XP if achievement system exists
        if (window.AchievementSystem) {
            window.AchievementSystem.awardXP(points);
        }
    },

    // Check streak milestones
    checkMilestones() {
        const currentStreak = this.streakData.currentStreak;
        
        for (const milestone of this.milestones) {
            if (currentStreak === milestone.days && !this.streakData.milestonesReached.includes(milestone.days)) {
                this.streakData.milestonesReached.push(milestone.days);
                this.awardMilestone(milestone);
            }
        }
    },

    // Award milestone
    awardMilestone(milestone) {
        // Award points
        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        localStorage.setItem('userPoints', (currentPoints + milestone.reward).toString());

        // Show milestone modal
        const modal = document.createElement('div');
        modal.className = 'milestone-modal';
        modal.innerHTML = `
            <div class="milestone-modal-content">
                <div class="milestone-badge">${milestone.badge}</div>
                <h2>Milestone Achieved!</h2>
                <h3>${milestone.name}</h3>
                <p>${milestone.days} Day Streak!</p>
                <div class="milestone-reward">+${milestone.reward} Points</div>
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
            animation: fadeIn 0.5s ease;
        `;

        document.body.appendChild(modal);

        // Trigger confetti
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        // Remove after 3 seconds
        setTimeout(() => {
            modal.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => modal.remove(), 500);
        }, 3000);

        // Unlock achievement
        if (window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement(`streak_${milestone.days}`);
        }
    },

    // Purchase streak shield
    purchaseShield() {
        const points = parseInt(localStorage.getItem('userPoints') || '0');
        
        if (points < this.config.shieldCost) {
            window.showToast(`Need ${this.config.shieldCost} points to purchase a shield`, 'error');
            return;
        }

        if (this.streakData.shields >= this.config.maxShields) {
            window.showToast(`Maximum ${this.config.maxShields} shields allowed`, 'warning');
            return;
        }

        // Deduct points
        localStorage.setItem('userPoints', (points - this.config.shieldCost).toString());
        
        // Add shield
        this.streakData.shields++;
        this.saveStreakData();
        
        window.showToast('Streak shield purchased! 🛡️', 'success');
    },

    // Show shield animation
    showShieldAnimation() {
        const shield = document.createElement('div');
        shield.className = 'shield-animation';
        shield.innerHTML = '🛡️';
        shield.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 100px;
            z-index: 10001;
            animation: shieldPulse 1s ease;
        `;

        document.body.appendChild(shield);
        setTimeout(() => shield.remove(), 1000);
    },

    // Show recovery animation
    showRecoveryAnimation() {
        const recovery = document.createElement('div');
        recovery.className = 'recovery-animation';
        recovery.innerHTML = '🔄';
        recovery.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 100px;
            z-index: 10001;
            animation: spin 1s ease;
        `;

        document.body.appendChild(recovery);
        setTimeout(() => recovery.remove(), 1000);
    },

    // Update streak display
    updateStreakDisplay() {
        const streakElement = document.getElementById('streakCount');
        if (streakElement) {
            streakElement.textContent = this.streakData.currentStreak;
        }

        const multiplierElement = document.getElementById('streakMultiplier');
        if (multiplierElement) {
            multiplierElement.textContent = `${this.streakData.multiplier}x`;
        }

        const shieldsElement = document.getElementById('streakShields');
        if (shieldsElement) {
            shieldsElement.textContent = `${this.streakData.shields} 🛡️`;
        }

        // Update vacation mode indicator
        const vacationIndicator = document.getElementById('vacationModeIndicator');
        if (vacationIndicator) {
            if (this.streakData.vacationMode) {
                const daysLeft = Math.ceil((new Date(this.streakData.vacationEndDate) - new Date()) / (1000 * 60 * 60 * 24));
                vacationIndicator.style.display = 'block';
                vacationIndicator.textContent = `🏖️ Vacation Mode (${daysLeft} days left)`;
            } else {
                vacationIndicator.style.display = 'none';
            }
        }
    },

    // Start streak timer
    startStreakTimer() {
        // Update every minute
        setInterval(() => {
            this.checkDailyStreak();
            this.updateStreakDisplay();
        }, 60000);
    },

    // Render streak protection panel
    renderStreakPanel() {
        return `
            <div class="streak-protection-panel">
                <h3>Streak Protection</h3>
                
                <div class="streak-stats">
                    <div class="stat">
                        <span class="label">Current Streak</span>
                        <span class="value" id="streakCount">${this.streakData.currentStreak}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Best Streak</span>
                        <span class="value">${this.streakData.bestStreak}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Multiplier</span>
                        <span class="value" id="streakMultiplier">${this.streakData.multiplier}x</span>
                    </div>
                    <div class="stat">
                        <span class="label">Shields</span>
                        <span class="value" id="streakShields">${this.streakData.shields} 🛡️</span>
                    </div>
                </div>
                
                <div id="vacationModeIndicator" style="display: none;"></div>
                
                <div class="streak-actions">
                    <button class="btn btn-secondary" onclick="StreakProtectionSystem.purchaseShield()">
                        Buy Shield (${this.config.shieldCost} pts)
                    </button>
                    <button class="btn btn-secondary" onclick="StreakProtectionSystem.showVacationModal()">
                        Vacation Mode
                    </button>
                </div>
                
                <div class="milestones-progress">
                    <h4>Next Milestone</h4>
                    ${this.renderNextMilestone()}
                </div>
            </div>
        `;
    },

    // Render next milestone
    renderNextMilestone() {
        const nextMilestone = this.milestones.find(m => m.days > this.streakData.currentStreak);
        
        if (!nextMilestone) {
            return '<p>All milestones achieved! 🎉</p>';
        }

        const progress = (this.streakData.currentStreak / nextMilestone.days) * 100;
        
        return `
            <div class="milestone-progress">
                <div class="milestone-info">
                    <span>${nextMilestone.badge} ${nextMilestone.name}</span>
                    <span>${this.streakData.currentStreak}/${nextMilestone.days} days</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="milestone-reward">Reward: ${nextMilestone.reward} points</div>
            </div>
        `;
    },

    // Show vacation mode modal
    showVacationModal() {
        const modal = document.createElement('div');
        modal.className = 'vacation-modal';
        modal.innerHTML = `
            <div class="vacation-modal-content">
                <h2>🏖️ Vacation Mode</h2>
                <p>Protect your streak while you're away (max ${this.config.vacationModeDays} days)</p>
                
                <div class="vacation-input">
                    <label>Number of days:</label>
                    <input type="number" id="vacationDays" min="1" max="${this.config.vacationModeDays}" value="7">
                </div>
                
                <div class="vacation-info">
                    <p>⚠️ During vacation mode:</p>
                    <ul>
                        <li>Your streak is protected</li>
                        <li>You won't earn points or multipliers</li>
                        <li>You can return anytime</li>
                    </ul>
                </div>
                
                <div class="vacation-actions">
                    <button class="btn btn-primary" onclick="StreakProtectionSystem.activateVacationMode()">
                        Activate Vacation Mode
                    </button>
                    <button class="btn btn-secondary" onclick="StreakProtectionSystem.closeVacationModal()">
                        Cancel
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
        `;

        document.body.appendChild(modal);
        this.vacationModal = modal;
    },

    // Activate vacation mode
    activateVacationMode() {
        const days = parseInt(document.getElementById('vacationDays').value);
        this.enableVacationMode(days);
        this.closeVacationModal();
    },

    // Close vacation modal
    closeVacationModal() {
        if (this.vacationModal) {
            this.vacationModal.remove();
            this.vacationModal = null;
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for task completion to update streak
        document.addEventListener('taskCompleted', () => {
            this.checkDailyStreak();
        });

        // Listen for navigation to streak panel
        document.addEventListener('navigate', (e) => {
            if (e.detail === 'streaks') {
                const container = document.getElementById('mainContent');
                if (container) {
                    container.innerHTML = this.renderStreakPanel();
                }
            }
        });
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shieldPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.StreakProtectionSystem.initialize());
} else {
    window.StreakProtectionSystem.initialize();
}
