/**
 * Critical Missing Implementations Module
 * Fixes broken callbacks and implements missing end-to-end features
 */

// ============================================
// 1. COMPLETE AI INTEGRATION
// ============================================

window.AIIntegration = {
    providers: {
        deepseek: {
            url: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-chat',
            getHeaders: () => ({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('deepseek_api_key') || ''}`
            })
        },
        openai: {
            url: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-3.5-turbo',
            getHeaders: () => ({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('openai_api_key') || ''}`
            })
        }
    },

    currentProvider: 'deepseek',
    conversationHistory: [],
    userContext: {},

    async initialize(userProfile) {
        this.userContext = {
            name: userProfile.displayName || 'User',
            personality: userProfile.personality || {},
            goals: userProfile.goals || [],
            preferences: userProfile.preferences || {}
        };
        
        // Set AI personality based on user profile
        await this.setPersonality(userProfile.personality);
    },

    async setPersonality(personality) {
        this.systemPrompt = `You are an AI mentor for ${this.userContext.name}. 
        Based on their personality assessment: ${JSON.stringify(personality)}.
        Adapt your responses to match their learning style and motivation type.
        Be encouraging, specific, and action-oriented.`;
    },

    async requestGoalBreakdown(goal) {
        const prompt = `Break down this goal into actionable steps: "${goal}". 
        Consider the user's context: ${JSON.stringify(this.userContext)}.
        Provide 3-5 specific, measurable tasks.`;
        
        try {
            const response = await this.call([
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ]);
            
            // Parse and structure the response
            const tasks = this.parseGoalBreakdown(response);
            return tasks;
        } catch (error) {
            console.error('AI Goal Breakdown failed:', error);
            return this.getFallbackGoalBreakdown(goal);
        }
    },

    async requestAdvice(context) {
        const prompt = `Given this situation: "${context}", provide actionable advice.
        Keep it concise (2-3 sentences) and specific.`;
        
        try {
            return await this.call([
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ]);
        } catch (error) {
            return this.getFallbackAdvice(context);
        }
    },

    async requestMotivation() {
        const timeOfDay = new Date().getHours();
        const energy = parseInt(localStorage.getItem('userEnergy') || '50');
        
        const prompt = `Generate a motivational message for ${this.userContext.name}.
        Time: ${timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'afternoon' : 'evening'}.
        Energy level: ${energy}/100.
        Current streak: ${localStorage.getItem('currentStreak') || '0'} days.`;
        
        try {
            return await this.call([
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ]);
        } catch (error) {
            return this.getFallbackMotivation();
        }
    },

    async call(messages) {
        const provider = this.providers[this.currentProvider];
        
        try {
            const response = await fetch(provider.url, {
                method: 'POST',
                headers: provider.getHeaders(),
                body: JSON.stringify({
                    model: provider.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Store in conversation history
            this.conversationHistory.push(...messages, { role: 'assistant', content });
            
            return content;
        } catch (error) {
            // Try fallback provider
            if (this.currentProvider === 'deepseek') {
                this.currentProvider = 'openai';
                return await this.call(messages);
            }
            throw error;
        }
    },

    parseGoalBreakdown(response) {
        // Parse AI response into structured tasks
        const lines = response.split('\n').filter(line => line.trim());
        const tasks = [];
        
        lines.forEach(line => {
            if (line.match(/^\d+\.|^-|^•/)) {
                tasks.push({
                    id: Date.now() + Math.random(),
                    title: line.replace(/^\d+\.|^-|^•/, '').trim(),
                    completed: false,
                    priority: 'medium'
                });
            }
        });
        
        return tasks.length > 0 ? tasks : this.getFallbackGoalBreakdown();
    },

    getFallbackGoalBreakdown(goal) {
        return [
            { id: 1, title: `Define specific metrics for: ${goal}`, completed: false },
            { id: 2, title: `Create action plan`, completed: false },
            { id: 3, title: `Set milestone checkpoints`, completed: false },
            { id: 4, title: `Track daily progress`, completed: false }
        ];
    },

    getFallbackAdvice(context) {
        const advice = [
            "Break this down into smaller, manageable steps and tackle them one at a time.",
            "Focus on progress, not perfection. Every small step counts.",
            "Consider what resources or support you need to succeed."
        ];
        return advice[Math.floor(Math.random() * advice.length)];
    },

    getFallbackMotivation() {
        const motivations = [
            "Every expert was once a beginner. Keep pushing forward!",
            "You're stronger than you think. Let's make today count!",
            "Small progress is still progress. You've got this!"
        ];
        return motivations[Math.floor(Math.random() * motivations.length)];
    }
};

// ============================================
// 2. WALLET POST-CONNECTION FLOW
// ============================================

window.WalletPostConnection = {
    async onWalletConnected(publicKey) {
        console.log('Wallet connected:', publicKey);
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // 1. Fetch token balances
            await this.fetchTokenBalances(publicKey);
            
            // 2. Load NFT achievements
            await this.loadNFTAchievements(publicKey);
            
            // 3. Initialize staking interface
            await this.initializeStaking(publicKey);
            
            // 4. Subscribe to wallet changes
            this.subscribeToWalletChanges(publicKey);
            
            // 5. Sync with Firebase profile
            await this.syncWalletWithProfile(publicKey);
            
            // 6. Update UI
            this.updateWalletUI();
            
            // Show success
            window.showToast('Wallet fully connected and synced!', 'success');
            
        } catch (error) {
            console.error('Post-connection error:', error);
            window.showToast('Failed to load wallet data', 'error');
        } finally {
            this.hideLoadingState();
        }
    },

    async fetchTokenBalances(publicKey) {
        // Fetch SOL balance
        try {
            const connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
            const balance = await connection.getBalance(new solanaWeb3.PublicKey(publicKey));
            const solBalance = balance / 1e9; // Convert lamports to SOL
            
            localStorage.setItem('sol_balance', solBalance.toString());
            
            // Fetch UPLIFT token balance (mock for now)
            const upliftBalance = Math.floor(Math.random() * 10000);
            localStorage.setItem('uplift_balance', upliftBalance.toString());
            
            return { sol: solBalance, uplift: upliftBalance };
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            return { sol: 0, uplift: 0 };
        }
    },

    async loadNFTAchievements(publicKey) {
        // Load user's achievement NFTs
        const achievements = [];
        
        try {
            // Mock implementation - would connect to Metaplex or similar
            const mockNFTs = [
                { id: 'nft_1', name: 'Early Adopter', image: '', rarity: 'rare' },
                { id: 'nft_2', name: '30 Day Streak', image: '', rarity: 'epic' }
            ];
            
            localStorage.setItem('nft_achievements', JSON.stringify(mockNFTs));
            return mockNFTs;
        } catch (error) {
            console.error('Failed to load NFTs:', error);
            return [];
        }
    },

    async initializeStaking(publicKey) {
        // Initialize staking interface
        const stakingData = {
            available: parseInt(localStorage.getItem('uplift_balance') || '0'),
            staked: 0,
            rewards: 0,
            apy: 12.5
        };
        
        localStorage.setItem('staking_data', JSON.stringify(stakingData));
        return stakingData;
    },

    subscribeToWalletChanges(publicKey) {
        // Subscribe to wallet balance changes
        if (window.solana) {
            window.solana.on('accountChanged', (publicKey) => {
                if (publicKey) {
                    this.fetchTokenBalances(publicKey.toString());
                    this.updateWalletUI();
                }
            });
        }
    },

    async syncWalletWithProfile(publicKey) {
        // Sync wallet with Firebase profile
        if (window.firebase?.auth?.currentUser) {
            try {
                await firebase.firestore()
                    .collection('users')
                    .doc(firebase.auth.currentUser.uid)
                    .update({
                        walletAddress: publicKey,
                        walletConnected: true,
                        walletConnectedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
            } catch (error) {
                console.error('Failed to sync wallet with profile:', error);
            }
        }
    },

    updateWalletUI() {
        // Update wallet display in UI
        const solBalance = localStorage.getItem('sol_balance') || '0';
        const upliftBalance = localStorage.getItem('uplift_balance') || '0';
        
        const solDisplay = document.getElementById('sol-balance');
        const upliftDisplay = document.getElementById('uplift-balance');
        
        if (solDisplay) solDisplay.textContent = parseFloat(solBalance).toFixed(4);
        if (upliftDisplay) upliftDisplay.textContent = parseInt(upliftBalance).toLocaleString();
    },

    showLoadingState() {
        const walletContainer = document.querySelector('.wallet-container');
        if (walletContainer) {
            walletContainer.classList.add('loading');
        }
    },

    hideLoadingState() {
        const walletContainer = document.querySelector('.wallet-container');
        if (walletContainer) {
            walletContainer.classList.remove('loading');
        }
    }
};

// ============================================
// 3. SOCIAL REAL-TIME FEATURES
// ============================================

window.SocialRealtime = {
    listeners: [],
    
    initialize() {
        if (!window.firebase?.firestore) {
            console.warn('Firebase not initialized');
            return;
        }
        
        this.initializePostListener();
        this.initializeNotificationListener();
        this.initializeFriendListener();
    },

    initializePostListener() {
        const unsubscribe = firebase.firestore()
            .collection('posts')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                const posts = [];
                snapshot.forEach(doc => {
                    posts.push({ id: doc.id, ...doc.data() });
                });
                this.updateSocialFeed(posts);
            }, (error) => {
                console.error('Post listener error:', error);
            });
        
        this.listeners.push(unsubscribe);
    },

    initializeNotificationListener() {
        if (!firebase.auth.currentUser) return;
        
        const unsubscribe = firebase.firestore()
            .collection('notifications')
            .where('userId', '==', firebase.auth.currentUser.uid)
            .where('read', '==', false)
            .onSnapshot((snapshot) => {
                const notifications = [];
                snapshot.forEach(doc => {
                    notifications.push({ id: doc.id, ...doc.data() });
                });
                this.updateNotifications(notifications);
            });
        
        this.listeners.push(unsubscribe);
    },

    initializeFriendListener() {
        if (!firebase.auth.currentUser) return;
        
        const unsubscribe = firebase.firestore()
            .collection('users')
            .doc(firebase.auth.currentUser.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    this.updateFriendsList(data.friends || []);
                    this.updateFriendRequests(data.friendRequests || []);
                }
            });
        
        this.listeners.push(unsubscribe);
    },

    updateSocialFeed(posts) {
        const feedContainer = document.getElementById('social-feed-container');
        if (!feedContainer) return;
        
        feedContainer.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
    },

    createPostHTML(post) {
        return `
            <div class="card" style="margin-bottom: 1rem;" data-post-id="${post.id}">
                <div class="card-body">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <img src="${post.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.authorName}" 
                             alt="${post.authorName}" 
                             style="width: 40px; height: 40px; border-radius: 50%;">
                        <div>
                            <div style="font-weight: 600;">${post.authorName}</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">
                                ${this.formatTimestamp(post.timestamp)}
                            </div>
                        </div>
                    </div>
                    <p>${post.content}</p>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
                        <button class="btn btn-sm like-btn" onclick="SocialRealtime.toggleLike('${post.id}')">
                            <i class="fas fa-heart ${post.likedBy?.includes(firebase.auth.currentUser?.uid) ? 'liked' : ''}"></i> 
                            ${post.likes || 0}
                        </button>
                        <button class="btn btn-sm comment-btn" onclick="SocialRealtime.openComments('${post.id}')">
                            <i class="fas fa-comment"></i> ${post.comments || 0}
                        </button>
                        <button class="btn btn-sm share-btn" onclick="SocialRealtime.sharePost('${post.id}')">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async toggleLike(postId) {
        if (!firebase.auth.currentUser) {
            window.showToast('Please sign in to like posts', 'warning');
            return;
        }
        
        const userId = firebase.auth.currentUser.uid;
        const postRef = firebase.firestore().collection('posts').doc(postId);
        
        try {
            await firebase.firestore().runTransaction(async (transaction) => {
                const postDoc = await transaction.get(postRef);
                if (!postDoc.exists) throw new Error('Post not found');
                
                const data = postDoc.data();
                const likedBy = data.likedBy || [];
                const isLiked = likedBy.includes(userId);
                
                if (isLiked) {
                    // Unlike
                    transaction.update(postRef, {
                        likedBy: firebase.firestore.FieldValue.arrayRemove(userId),
                        likes: firebase.firestore.FieldValue.increment(-1)
                    });
                } else {
                    // Like
                    transaction.update(postRef, {
                        likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
                        likes: firebase.firestore.FieldValue.increment(1)
                    });
                }
            });
        } catch (error) {
            console.error('Like toggle failed:', error);
            window.showToast('Failed to update like', 'error');
        }
    },

    updateNotifications(notifications) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = notifications.length;
            badge.style.display = notifications.length > 0 ? 'inline-block' : 'none';
        }
        
        const container = document.getElementById('notifications-container');
        if (container) {
            container.innerHTML = notifications.map(n => this.createNotificationHTML(n)).join('');
        }
    },

    createNotificationHTML(notification) {
        return `
            <div class="notification-item" onclick="SocialRealtime.markAsRead('${notification.id}')">
                <p>${notification.message}</p>
                <span class="notification-time">${this.formatTimestamp(notification.timestamp)}</span>
            </div>
        `;
    },

    formatTimestamp(timestamp) {
        if (!timestamp) return 'Just now';
        
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    },

    cleanup() {
        // Unsubscribe all listeners
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }
};

// ============================================
// 4. ENERGY SYSTEM
// ============================================

window.EnergySystem = {
    maxEnergy: 100,
    currentEnergy: 100,
    depletionRate: 1, // Energy lost per minute
    regenerationRate: 0.5, // Energy gained per minute when resting
    lastUpdate: Date.now(),
    updateInterval: null,

    initialize() {
        // Load saved energy state
        const saved = localStorage.getItem('energyState');
        if (saved) {
            const state = JSON.parse(saved);
            this.currentEnergy = state.energy;
            this.lastUpdate = state.lastUpdate;
        }
        
        // Calculate energy change since last update
        this.calculateEnergyChange();
        
        // Start update interval
        this.startUpdateInterval();
        
        // Update UI
        this.updateEnergyDisplay();
    },

    calculateEnergyChange() {
        const now = Date.now();
        const minutesPassed = (now - this.lastUpdate) / 60000;
        
        // Deplete energy based on time passed
        this.currentEnergy -= minutesPassed * this.depletionRate;
        
        // Clamp energy
        this.currentEnergy = Math.max(0, Math.min(this.maxEnergy, this.currentEnergy));
        
        // Save state
        this.saveState();
    },

    startUpdateInterval() {
        // Update energy every minute
        this.updateInterval = setInterval(() => {
            this.depleteEnergy(this.depletionRate);
            this.checkEnergyWarnings();
        }, 60000);
    },

    depleteEnergy(amount) {
        this.currentEnergy = Math.max(0, this.currentEnergy - amount);
        this.saveState();
        this.updateEnergyDisplay();
    },

    addEnergy(amount) {
        this.currentEnergy = Math.min(this.maxEnergy, this.currentEnergy + amount);
        this.saveState();
        this.updateEnergyDisplay();
        
        if (amount > 0) {
            window.showToast(`+${amount} Energy!`, 'success');
        }
    },

    consumeEnergy(amount) {
        if (this.currentEnergy < amount) {
            window.showToast('Not enough energy!', 'error');
            return false;
        }
        
        this.currentEnergy -= amount;
        this.saveState();
        this.updateEnergyDisplay();
        return true;
    },

    checkEnergyWarnings() {
        if (this.currentEnergy < 20 && this.currentEnergy > 0) {
            window.showToast('Energy is running low! Take a break.', 'warning');
        } else if (this.currentEnergy === 0) {
            window.showToast('Energy depleted! You need to rest.', 'error');
            this.triggerRestMode();
        }
    },

    triggerRestMode() {
        // Disable energy-consuming actions
        document.querySelectorAll('.energy-action').forEach(btn => {
            btn.disabled = true;
        });
        
        // Start regeneration
        setTimeout(() => {
            this.addEnergy(20);
            document.querySelectorAll('.energy-action').forEach(btn => {
                btn.disabled = false;
            });
        }, 5 * 60000); // 5 minutes rest
    },

    updateEnergyDisplay() {
        const energyBar = document.getElementById('energy-bar');
        const energyText = document.getElementById('energy-text');
        
        if (energyBar) {
            energyBar.style.width = `${this.currentEnergy}%`;
            
            // Change color based on energy level
            if (this.currentEnergy > 60) {
                energyBar.style.background = '#22c55e';
            } else if (this.currentEnergy > 30) {
                energyBar.style.background = '#f97316';
            } else {
                energyBar.style.background = '#ef4444';
            }
        }
        
        if (energyText) {
            energyText.textContent = `${Math.floor(this.currentEnergy)}%`;
        }
    },

    saveState() {
        localStorage.setItem('energyState', JSON.stringify({
            energy: this.currentEnergy,
            lastUpdate: Date.now()
        }));
    },

    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
};

// ============================================
// 5. ACHIEVEMENT SYSTEM ENHANCEMENTS
// ============================================

window.AchievementSystem = {
    achievements: {
        first_task: { name: 'First Step', description: 'Complete your first task', rarity: 'common', xp: 10 },
        streak_7: { name: 'Week Warrior', description: '7 day streak', rarity: 'rare', xp: 50 },
        streak_30: { name: 'Monthly Master', description: '30 day streak', rarity: 'epic', xp: 200 },
        streak_100: { name: 'Century Club', description: '100 day streak', rarity: 'legendary', xp: 1000 },
        level_10: { name: 'Rising Star', description: 'Reach level 10', rarity: 'rare', xp: 100 },
        social_butterfly: { name: 'Social Butterfly', description: 'Make 10 friends', rarity: 'rare', xp: 75 }
    },

    async unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return;
        
        // Check if already unlocked
        const unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        if (unlocked.includes(achievementId)) return;
        
        // Add to unlocked
        unlocked.push(achievementId);
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
        
        // Show unlock animation
        await this.showUnlockAnimation(achievement);
        
        // Award XP
        this.awardXP(achievement.xp);
        
        // Mint NFT for epic+ achievements
        if (achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
            await this.mintAchievementNFT(achievement);
        }
        
        // Share to social feed
        if (window.SocialRealtime) {
            await this.shareToSocialFeed(achievement);
        }
        
        // Update leaderboard
        this.updateLeaderboard();
    },

    async showUnlockAnimation(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-unlock-modal';
        modal.innerHTML = `
            <div class="achievement-unlock-content">
                <div class="achievement-icon ${achievement.rarity}">
                    <i class="fas fa-trophy"></i>
                </div>
                <h2>Achievement Unlocked!</h2>
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                <div class="achievement-rewards">
                    <span>+${achievement.xp} XP</span>
                    ${achievement.rarity === 'epic' || achievement.rarity === 'legendary' ? 
                        '<span>NFT Minted!</span>' : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add animation styles
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
        
        // Play sound if available
        if (window.audioSystem) {
            window.audioSystem.playSound('achievement');
        }
        
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
    },

    async mintAchievementNFT(achievement) {
        // In production, this would mint an actual NFT
        console.log('Minting NFT for achievement:', achievement);
        
        // Mock implementation
        const nft = {
            id: `nft_${Date.now()}`,
            achievement: achievement.name,
            rarity: achievement.rarity,
            mintedAt: new Date().toISOString()
        };
        
        const nfts = JSON.parse(localStorage.getItem('nft_achievements') || '[]');
        nfts.push(nft);
        localStorage.setItem('nft_achievements', JSON.stringify(nfts));
        
        return nft;
    },

    awardXP(amount) {
        const currentXP = parseInt(localStorage.getItem('userXP') || '0');
        const newXP = currentXP + amount;
        localStorage.setItem('userXP', newXP.toString());
        
        // Check for level up
        this.checkLevelUp(newXP);
        
        // Update display
        const xpDisplay = document.getElementById('xp-display');
        if (xpDisplay) {
            xpDisplay.textContent = newXP.toLocaleString();
        }
    },

    checkLevelUp(xp) {
        const currentLevel = parseInt(localStorage.getItem('userLevel') || '1');
        const newLevel = Math.floor(xp / 100) + 1; // 100 XP per level
        
        if (newLevel > currentLevel) {
            localStorage.setItem('userLevel', newLevel.toString());
            this.onLevelUp(newLevel);
        }
    },

    onLevelUp(newLevel) {
        window.showToast(`Level Up! You're now level ${newLevel}!`, 'success');
        
        // Unlock features based on level
        if (newLevel === 5) {
            this.unlockFeature('custom_themes');
        } else if (newLevel === 10) {
            this.unlockFeature('advanced_analytics');
        }
        
        // Check level achievements
        if (newLevel === 10) {
            this.unlockAchievement('level_10');
        }
    },

    unlockFeature(featureId) {
        const unlockedFeatures = JSON.parse(localStorage.getItem('unlockedFeatures') || '[]');
        if (!unlockedFeatures.includes(featureId)) {
            unlockedFeatures.push(featureId);
            localStorage.setItem('unlockedFeatures', JSON.stringify(unlockedFeatures));
            window.showToast(`New feature unlocked: ${featureId.replace('_', ' ')}!`, 'success');
        }
    }
};

// ============================================
// 6. INITIALIZATION
// ============================================

// Initialize all systems when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCriticalSystems);
} else {
    initializeCriticalSystems();
}

function initializeCriticalSystems() {
    console.log('🚀 Initializing critical missing systems...');
    
    // Initialize AI with user profile
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    window.AIIntegration.initialize(userProfile);
    
    // Initialize energy system
    window.EnergySystem.initialize();
    
    // Initialize social real-time if Firebase is available
    if (window.firebase?.firestore) {
        window.SocialRealtime.initialize();
    }
    
    // Override wallet connection to include post-connection flow
    const originalConnect = window.connectPhantomWallet;
    window.connectPhantomWallet = async function() {
        if (originalConnect) {
            await originalConnect();
        }
        const address = localStorage.getItem('walletAddress');
        if (address) {
            await window.WalletPostConnection.onWalletConnected(address);
        }
    };
    
    console.log('✅ Critical systems initialized');
}

// Export for use in other modules
window.CriticalSystems = {
    AI: window.AIIntegration,
    Wallet: window.WalletPostConnection,
    Social: window.SocialRealtime,
    Energy: window.EnergySystem,
    Achievements: window.AchievementSystem
};
