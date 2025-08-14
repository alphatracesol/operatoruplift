/**
 * Reward Marketplace System
 * Points spending, premium unlocks, power-ups, and trading
 */

window.RewardMarketplace = {
    // Marketplace inventory
    inventory: {
        themes: [
            { id: 'theme_neon', name: 'Neon Dreams', cost: 500, type: 'theme', preview: '🌃', description: 'Vibrant neon colors with glowing effects' },
            { id: 'theme_forest', name: 'Forest Focus', cost: 400, type: 'theme', preview: '🌲', description: 'Calming green nature theme' },
            { id: 'theme_space', name: 'Cosmic', cost: 600, type: 'theme', preview: '🌌', description: 'Deep space theme with stars' },
            { id: 'theme_ocean', name: 'Ocean Depths', cost: 450, type: 'theme', preview: '🌊', description: 'Peaceful underwater theme' },
            { id: 'theme_sunset', name: 'Golden Hour', cost: 350, type: 'theme', preview: '🌅', description: 'Warm sunset colors' }
        ],
        powerUps: [
            { id: 'xp_boost_2x', name: '2X XP Boost', cost: 200, type: 'powerup', duration: 3600000, icon: '⚡', description: 'Double XP for 1 hour' },
            { id: 'xp_boost_3x', name: '3X XP Boost', cost: 500, type: 'powerup', duration: 3600000, icon: '⚡⚡', description: 'Triple XP for 1 hour' },
            { id: 'energy_refill', name: 'Energy Refill', cost: 100, type: 'powerup', instant: true, icon: '🔋', description: 'Instantly refill energy to 100%' },
            { id: 'focus_boost', name: 'Focus Enhancer', cost: 150, type: 'powerup', duration: 7200000, icon: '🎯', description: '+50% focus time bonus for 2 hours' },
            { id: 'lucky_charm', name: 'Lucky Charm', cost: 300, type: 'powerup', duration: 86400000, icon: '🍀', description: '+20% chance for bonus rewards for 24 hours' }
        ],
        streakItems: [
            { id: 'streak_shield', name: 'Streak Shield', cost: 100, type: 'protection', icon: '🛡️', description: 'Protects your streak if you miss a day' },
            { id: 'streak_freeze', name: 'Streak Freeze', cost: 150, type: 'protection', icon: '❄️', description: 'Freeze your streak for up to 3 days' },
            { id: 'streak_repair', name: 'Streak Repair Kit', cost: 250, type: 'protection', icon: '🔧', description: 'Restore a recently broken streak (within 48 hours)' }
        ],
        badges: [
            { id: 'badge_elite', name: 'Elite Performer', cost: 1000, type: 'badge', icon: '👑', description: 'Exclusive elite status badge' },
            { id: 'badge_supporter', name: 'Early Supporter', cost: 500, type: 'badge', icon: '💎', description: 'Show your early support' },
            { id: 'badge_motivator', name: 'Motivator', cost: 300, type: 'badge', icon: '🌟', description: 'Recognized community motivator' }
        ],
        realRewards: [
            { id: 'coffee_voucher', name: 'Coffee Shop Voucher', cost: 2000, type: 'real', icon: '☕', description: '$5 coffee shop gift card', stock: 10 },
            { id: 'book_credit', name: 'Book Store Credit', cost: 3000, type: 'real', icon: '📚', description: '$10 bookstore credit', stock: 5 },
            { id: 'charity_donation', name: 'Charity Donation', cost: 1000, type: 'real', icon: '❤️', description: '$5 donation to charity of choice', stock: 100 },
            { id: 'premium_month', name: 'Premium Month', cost: 5000, type: 'real', icon: '⭐', description: '1 month premium subscription', stock: 20 }
        ]
    },

    // User's purchased items
    userPurchases: {
        themes: [],
        powerUps: [],
        badges: [],
        activePowerUps: []
    },

    // Trading system
    trades: {
        listings: [],
        offers: [],
        history: []
    },

    // Initialize marketplace
    initialize() {
        this.loadUserPurchases();
        this.loadMarketplaceData();
        this.setupEventListeners();
        this.checkActivePowerUps();
        this.applyPurchasedThemes();
    },

    // Load user purchases
    loadUserPurchases() {
        const saved = localStorage.getItem('userPurchases');
        if (saved) {
            Object.assign(this.userPurchases, JSON.parse(saved));
        }
        
        const trades = localStorage.getItem('marketplaceTrades');
        if (trades) {
            Object.assign(this.trades, JSON.parse(trades));
        }
    },

    // Save user purchases
    saveUserPurchases() {
        localStorage.setItem('userPurchases', JSON.stringify(this.userPurchases));
        localStorage.setItem('marketplaceTrades', JSON.stringify(this.trades));
    },

    // Load marketplace data
    loadMarketplaceData() {
        // In production, fetch from backend
        // Check for special offers, new items, etc.
        this.checkSpecialOffers();
    },

    // Purchase item
    purchaseItem(itemId, itemType) {
        const item = this.findItem(itemId, itemType);
        if (!item) {
            window.showToast('Item not found', 'error');
            return;
        }
        
        const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
        
        if (userPoints < item.cost) {
            window.showToast(`Not enough points! Need ${item.cost - userPoints} more`, 'error');
            return;
        }
        
        // Check stock for real rewards
        if (item.type === 'real' && item.stock <= 0) {
            window.showToast('Out of stock!', 'error');
            return;
        }
        
        // Deduct points
        const newPoints = userPoints - item.cost;
        localStorage.setItem('userPoints', newPoints.toString());
        
        // Add to purchases
        this.addToPurchases(item);
        
        // Apply item effects
        this.applyItemEffects(item);
        
        // Update stock if real reward
        if (item.type === 'real') {
            item.stock--;
        }
        
        // Save purchase
        this.saveUserPurchases();
        
        // Show success
        this.showPurchaseSuccess(item);
        
        // Track purchase
        this.trackPurchase(item);
        
        // Check achievements
        this.checkMarketplaceAchievements();
    },

    // Find item in inventory
    findItem(itemId, itemType) {
        const allItems = [
            ...this.inventory.themes,
            ...this.inventory.powerUps,
            ...this.inventory.streakItems,
            ...this.inventory.badges,
            ...this.inventory.realRewards
        ];
        
        return allItems.find(item => item.id === itemId);
    },

    // Add to purchases
    addToPurchases(item) {
        const purchase = {
            ...item,
            purchasedAt: new Date().toISOString(),
            id: `purchase_${Date.now()}`
        };
        
        switch (item.type) {
            case 'theme':
                this.userPurchases.themes.push(purchase);
                break;
            case 'powerup':
                this.userPurchases.powerUps.push(purchase);
                if (!item.instant) {
                    this.activatePowerUp(purchase);
                }
                break;
            case 'badge':
                this.userPurchases.badges.push(purchase);
                break;
            case 'protection':
                // Add to streak protection inventory
                const shields = parseInt(localStorage.getItem('streakShields') || '0');
                localStorage.setItem('streakShields', (shields + 1).toString());
                break;
            case 'real':
                // Process real reward
                this.processRealReward(purchase);
                break;
        }
    },

    // Apply item effects
    applyItemEffects(item) {
        switch (item.type) {
            case 'theme':
                this.applyTheme(item.id);
                break;
            case 'powerup':
                if (item.instant) {
                    this.applyInstantPowerUp(item);
                }
                break;
            case 'badge':
                this.displayBadge(item);
                break;
        }
    },

    // Activate power-up
    activatePowerUp(powerUp) {
        const activation = {
            ...powerUp,
            activatedAt: Date.now(),
            expiresAt: Date.now() + powerUp.duration
        };
        
        this.userPurchases.activePowerUps.push(activation);
        this.saveUserPurchases();
        
        // Set expiration timer
        setTimeout(() => {
            this.expirePowerUp(activation.id);
        }, powerUp.duration);
        
        // Apply power-up effects
        this.applyPowerUpEffects(powerUp);
    },

    // Apply instant power-up
    applyInstantPowerUp(powerUp) {
        switch (powerUp.id) {
            case 'energy_refill':
                if (window.EnergySystem) {
                    window.EnergySystem.currentEnergy = 100;
                    window.EnergySystem.updateEnergyDisplay();
                }
                break;
        }
    },

    // Apply power-up effects
    applyPowerUpEffects(powerUp) {
        switch (powerUp.id) {
            case 'xp_boost_2x':
                this.setXPMultiplier(2);
                break;
            case 'xp_boost_3x':
                this.setXPMultiplier(3);
                break;
            case 'focus_boost':
                this.setFocusBonus(1.5);
                break;
            case 'lucky_charm':
                this.setLuckBonus(1.2);
                break;
        }
    },

    // Set XP multiplier
    setXPMultiplier(multiplier) {
        localStorage.setItem('xpMultiplier', multiplier.toString());
        window.showToast(`XP multiplier set to ${multiplier}x!`, 'success');
    },

    // Apply theme
    applyTheme(themeId) {
        const theme = this.inventory.themes.find(t => t.id === themeId);
        if (!theme) return;
        
        // Apply theme CSS variables
        const themeStyles = this.getThemeStyles(themeId);
        Object.entries(themeStyles).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        // Save active theme
        localStorage.setItem('activeTheme', themeId);
        
        window.showToast(`Theme "${theme.name}" applied!`, 'success');
    },

    // Get theme styles
    getThemeStyles(themeId) {
        const themes = {
            'theme_neon': {
                '--primary-color': '#ff00ff',
                '--secondary-color': '#00ffff',
                '--bg-primary': '#0a0a0a',
                '--bg-secondary': '#1a0a1a',
                '--accent-color': '#ff00aa'
            },
            'theme_forest': {
                '--primary-color': '#228b22',
                '--secondary-color': '#8fbc8f',
                '--bg-primary': '#0d1f0d',
                '--bg-secondary': '#1a2f1a',
                '--accent-color': '#32cd32'
            },
            'theme_space': {
                '--primary-color': '#4169e1',
                '--secondary-color': '#9370db',
                '--bg-primary': '#000033',
                '--bg-secondary': '#000066',
                '--accent-color': '#ffd700'
            },
            'theme_ocean': {
                '--primary-color': '#006994',
                '--secondary-color': '#40e0d0',
                '--bg-primary': '#001f3f',
                '--bg-secondary': '#003366',
                '--accent-color': '#00ced1'
            },
            'theme_sunset': {
                '--primary-color': '#ff6b6b',
                '--secondary-color': '#feca57',
                '--bg-primary': '#2c1810',
                '--bg-secondary': '#3d2817',
                '--accent-color': '#ff9ff3'
            }
        };
        
        return themes[themeId] || {};
    },

    // Create trade listing
    createTradeListing(itemId, askingPrice) {
        const item = this.findUserItem(itemId);
        if (!item) {
            window.showToast('Item not found in your inventory', 'error');
            return;
        }
        
        const listing = {
            id: `trade_${Date.now()}`,
            sellerId: this.getCurrentUserId(),
            item: item,
            askingPrice: askingPrice,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        this.trades.listings.push(listing);
        this.saveUserPurchases();
        
        window.showToast('Trade listing created!', 'success');
        return listing;
    },

    // Make trade offer
    makeTradeOffer(listingId, offerAmount) {
        const listing = this.trades.listings.find(l => l.id === listingId);
        if (!listing) {
            window.showToast('Listing not found', 'error');
            return;
        }
        
        const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
        if (userPoints < offerAmount) {
            window.showToast('Not enough points for this offer', 'error');
            return;
        }
        
        const offer = {
            id: `offer_${Date.now()}`,
            listingId: listingId,
            buyerId: this.getCurrentUserId(),
            offerAmount: offerAmount,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        this.trades.offers.push(offer);
        this.saveUserPurchases();
        
        // Notify seller
        this.notifySeller(listing.sellerId, offer);
        
        window.showToast('Offer submitted!', 'success');
        return offer;
    },

    // Accept trade offer
    acceptTradeOffer(offerId) {
        const offer = this.trades.offers.find(o => o.id === offerId);
        if (!offer) return;
        
        const listing = this.trades.listings.find(l => l.id === offer.listingId);
        if (!listing) return;
        
        // Transfer item
        this.transferItem(listing.item, listing.sellerId, offer.buyerId);
        
        // Transfer points
        this.transferPoints(offer.offerAmount, offer.buyerId, listing.sellerId);
        
        // Update statuses
        offer.status = 'completed';
        listing.status = 'sold';
        
        // Add to history
        this.trades.history.push({
            listing: listing,
            offer: offer,
            completedAt: new Date().toISOString()
        });
        
        this.saveUserPurchases();
        
        window.showToast('Trade completed!', 'success');
    },

    // Render marketplace
    renderMarketplace() {
        return `
            <div class="marketplace-container">
                <div class="marketplace-header">
                    <h2>🛍️ Reward Marketplace</h2>
                    <div class="user-points">
                        <span class="points-icon">💰</span>
                        <span class="points-value">${localStorage.getItem('userPoints') || '0'}</span>
                        <span class="points-label">Points</span>
                    </div>
                </div>
                
                <div class="marketplace-tabs">
                    <button class="tab-btn active" onclick="RewardMarketplace.showCategory('all')">All Items</button>
                    <button class="tab-btn" onclick="RewardMarketplace.showCategory('themes')">Themes</button>
                    <button class="tab-btn" onclick="RewardMarketplace.showCategory('powerups')">Power-Ups</button>
                    <button class="tab-btn" onclick="RewardMarketplace.showCategory('protection')">Streak Protection</button>
                    <button class="tab-btn" onclick="RewardMarketplace.showCategory('badges')">Badges</button>
                    <button class="tab-btn" onclick="RewardMarketplace.showCategory('real')">Real Rewards</button>
                    <button class="tab-btn" onclick="RewardMarketplace.showCategory('trading')">Trading Post</button>
                </div>
                
                <div class="marketplace-content">
                    ${this.renderMarketplaceItems()}
                </div>
                
                <div class="active-powerups">
                    <h3>Active Power-Ups</h3>
                    ${this.renderActivePowerUps()}
                </div>
            </div>
        `;
    },

    // Render marketplace items
    renderMarketplaceItems(category = 'all') {
        let items = [];
        
        if (category === 'all' || category === 'themes') {
            items.push(...this.inventory.themes);
        }
        if (category === 'all' || category === 'powerups') {
            items.push(...this.inventory.powerUps);
        }
        if (category === 'all' || category === 'protection') {
            items.push(...this.inventory.streakItems);
        }
        if (category === 'all' || category === 'badges') {
            items.push(...this.inventory.badges);
        }
        if (category === 'all' || category === 'real') {
            items.push(...this.inventory.realRewards);
        }
        
        if (category === 'trading') {
            return this.renderTradingPost();
        }
        
        return `
            <div class="marketplace-grid">
                ${items.map(item => this.renderMarketplaceItem(item)).join('')}
            </div>
        `;
    },

    // Render single marketplace item
    renderMarketplaceItem(item) {
        const isPurchased = this.isItemPurchased(item.id);
        const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
        const canAfford = userPoints >= item.cost;
        
        return `
            <div class="marketplace-item ${isPurchased ? 'purchased' : ''} ${!canAfford ? 'unaffordable' : ''}">
                <div class="item-icon">${item.icon || item.preview || '🎁'}</div>
                <div class="item-info">
                    <h4 class="item-name">${item.name}</h4>
                    <p class="item-description">${item.description}</p>
                    ${item.duration ? `<span class="item-duration">Duration: ${this.formatDuration(item.duration)}</span>` : ''}
                    ${item.stock !== undefined ? `<span class="item-stock">Stock: ${item.stock}</span>` : ''}
                </div>
                <div class="item-footer">
                    <span class="item-cost">${item.cost} pts</span>
                    ${isPurchased ? 
                        '<span class="item-owned">Owned</span>' :
                        `<button class="btn btn-primary btn-sm" 
                                onclick="RewardMarketplace.purchaseItem('${item.id}', '${item.type}')"
                                ${!canAfford ? 'disabled' : ''}>
                            Buy
                        </button>`
                    }
                </div>
            </div>
        `;
    },

    // Render trading post
    renderTradingPost() {
        const activeListings = this.trades.listings.filter(l => l.status === 'active');
        
        return `
            <div class="trading-post">
                <div class="trading-header">
                    <h3>Trading Post</h3>
                    <button class="btn btn-primary" onclick="RewardMarketplace.showCreateListing()">
                        Create Listing
                    </button>
                </div>
                
                <div class="trading-listings">
                    ${activeListings.length > 0 ? activeListings.map(listing => `
                        <div class="trade-listing">
                            <div class="listing-item">
                                <span class="item-icon">${listing.item.icon || '🎁'}</span>
                                <span class="item-name">${listing.item.name}</span>
                            </div>
                            <div class="listing-price">
                                <span class="price-label">Asking:</span>
                                <span class="price-value">${listing.askingPrice} pts</span>
                            </div>
                            <div class="listing-seller">
                                <span>Seller: ${this.getUserName(listing.sellerId)}</span>
                            </div>
                            ${listing.sellerId !== this.getCurrentUserId() ? `
                                <button class="btn btn-sm" onclick="RewardMarketplace.makeOffer('${listing.id}')">
                                    Make Offer
                                </button>
                            ` : `
                                <span class="your-listing">Your Listing</span>
                            `}
                        </div>
                    `).join('') : '<p>No active listings</p>'}
                </div>
                
                <div class="trading-offers">
                    <h4>Your Offers</h4>
                    ${this.renderUserOffers()}
                </div>
            </div>
        `;
    },

    // Render active power-ups
    renderActivePowerUps() {
        const active = this.userPurchases.activePowerUps.filter(p => p.expiresAt > Date.now());
        
        if (active.length === 0) {
            return '<p>No active power-ups</p>';
        }
        
        return `
            <div class="powerups-list">
                ${active.map(powerUp => {
                    const remaining = powerUp.expiresAt - Date.now();
                    return `
                        <div class="active-powerup">
                            <span class="powerup-icon">${powerUp.icon}</span>
                            <span class="powerup-name">${powerUp.name}</span>
                            <span class="powerup-remaining">${this.formatDuration(remaining)} left</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // Check if item is purchased
    isItemPurchased(itemId) {
        const allPurchases = [
            ...this.userPurchases.themes,
            ...this.userPurchases.powerUps,
            ...this.userPurchases.badges
        ];
        
        return allPurchases.some(p => p.id === itemId);
    },

    // Format duration
    formatDuration(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        
        if (hours > 24) {
            return `${Math.floor(hours / 24)} days`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    },

    // Show purchase success
    showPurchaseSuccess(item) {
        const modal = document.createElement('div');
        modal.className = 'purchase-success-modal';
        modal.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✨</div>
                <h2>Purchase Successful!</h2>
                <div class="purchased-item">
                    <span class="item-icon">${item.icon || item.preview || '🎁'}</span>
                    <span class="item-name">${item.name}</span>
                </div>
                <p>${item.description}</p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Awesome!
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
            background: rgba(0, 0, 0, 0.8);
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Trigger confetti for special items
        if (item.cost >= 1000 && window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    },

    // Check active power-ups
    checkActivePowerUps() {
        const now = Date.now();
        this.userPurchases.activePowerUps = this.userPurchases.activePowerUps.filter(p => {
            if (p.expiresAt <= now) {
                this.expirePowerUp(p.id);
                return false;
            }
            return true;
        });
        
        // Reapply active power-up effects
        this.userPurchases.activePowerUps.forEach(p => {
            this.applyPowerUpEffects(p);
        });
    },

    // Expire power-up
    expirePowerUp(powerUpId) {
        // Remove effects
        const powerUp = this.userPurchases.activePowerUps.find(p => p.id === powerUpId);
        if (powerUp) {
            this.removePowerUpEffects(powerUp);
        }
        
        // Remove from active list
        this.userPurchases.activePowerUps = this.userPurchases.activePowerUps.filter(
            p => p.id !== powerUpId
        );
        
        this.saveUserPurchases();
        
        window.showToast('Power-up expired', 'info');
    },

    // Remove power-up effects
    removePowerUpEffects(powerUp) {
        switch (powerUp.id) {
            case 'xp_boost_2x':
            case 'xp_boost_3x':
                localStorage.setItem('xpMultiplier', '1');
                break;
            case 'focus_boost':
                localStorage.setItem('focusBonus', '1');
                break;
            case 'lucky_charm':
                localStorage.setItem('luckBonus', '1');
                break;
        }
    },

    // Check special offers
    checkSpecialOffers() {
        const today = new Date().getDay();
        
        // Weekend special - 20% off themes
        if (today === 0 || today === 6) {
            this.inventory.themes.forEach(theme => {
                theme.originalCost = theme.cost;
                theme.cost = Math.floor(theme.cost * 0.8);
                theme.special = true;
            });
        }
        
        // Flash sale - random item 50% off
        if (Math.random() < 0.1) { // 10% chance
            const allItems = [...this.inventory.powerUps, ...this.inventory.streakItems];
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            randomItem.originalCost = randomItem.cost;
            randomItem.cost = Math.floor(randomItem.cost * 0.5);
            randomItem.flashSale = true;
        }
    },

    // Helper functions
    getCurrentUserId() {
        return localStorage.getItem('userId') || 'user_' + Date.now();
    },

    getUserName(userId) {
        return `User ${userId.slice(-4)}`;
    },

    findUserItem(itemId) {
        const allPurchases = [
            ...this.userPurchases.themes,
            ...this.userPurchases.powerUps,
            ...this.userPurchases.badges
        ];
        return allPurchases.find(p => p.id === itemId);
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for point earning events
        document.addEventListener('pointsEarned', (e) => {
            // Check if user can now afford items
            this.updateAffordability();
        });

        // Listen for achievement unlocks
        document.addEventListener('achievementUnlocked', (e) => {
            // Some achievements grant bonus points
            if (e.detail.bonusPoints) {
                const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
                localStorage.setItem('userPoints', (currentPoints + e.detail.bonusPoints).toString());
            }
        });
    },

    updateAffordability() {
        // Update UI to show which items are now affordable
        if (document.querySelector('.marketplace-container')) {
            const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
            document.querySelectorAll('.marketplace-item').forEach(item => {
                const cost = parseInt(item.querySelector('.item-cost').textContent);
                if (userPoints >= cost) {
                    item.classList.remove('unaffordable');
                } else {
                    item.classList.add('unaffordable');
                }
            });
        }
    },

    // Apply purchased themes on load
    applyPurchasedThemes() {
        const activeTheme = localStorage.getItem('activeTheme');
        if (activeTheme && this.isItemPurchased(activeTheme)) {
            this.applyTheme(activeTheme);
        }
    },

    // Track purchase for analytics
    trackPurchase(item) {
        const purchases = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
        purchases.push({
            item: item,
            timestamp: new Date().toISOString(),
            pointsSpent: item.cost
        });
        localStorage.setItem('purchaseHistory', JSON.stringify(purchases));
    },

    // Check marketplace achievements
    checkMarketplaceAchievements() {
        const purchases = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
        
        if (purchases.length === 1 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('first_purchase');
        }
        
        if (purchases.length === 10 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('shopaholic');
        }
        
        const totalSpent = purchases.reduce((sum, p) => sum + p.pointsSpent, 0);
        if (totalSpent >= 10000 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('big_spender');
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.RewardMarketplace.initialize());
} else {
    window.RewardMarketplace.initialize();
}
