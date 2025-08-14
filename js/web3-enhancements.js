/**
 * Web3 Enhancements Module
 * Implements transaction history, staking, NFT achievements, and multi-wallet support
 */

// ============================================
// 1. TRANSACTION HISTORY SYSTEM
// ============================================

class TransactionHistory {
    constructor() {
        this.transactions = [];
        this.walletAddress = null;
        this.connection = null;
        this.init();
    }

    async init() {
        await this.setupConnection();
        await this.loadWallet();
        if (this.walletAddress) {
            await this.fetchTransactions();
        }
    }

    async setupConnection() {
        // Setup Solana connection
        if (window.solana) {
            try {
                const { Connection, clusterApiUrl } = await import('@solana/web3.js');
                this.connection = new Connection(
                    process.env.HELIUS_RPC_URL || clusterApiUrl('mainnet-beta')
                );
            } catch (error) {
                console.error('Error setting up Solana connection:', error);
            }
        }
    }

    async loadWallet() {
        // Check if wallet is connected
        if (window.phantom?.solana?.isConnected) {
            this.walletAddress = window.phantom.solana.publicKey.toString();
        } else {
            // Try to get from localStorage
            this.walletAddress = localStorage.getItem('wallet_address');
        }
    }

    async fetchTransactions() {
        if (!this.walletAddress || !this.connection) return;

        try {
            // Show loading state
            this.showLoadingState();

            // Fetch transaction signatures
            const signatures = await this.connection.getSignaturesForAddress(
                new PublicKey(this.walletAddress),
                { limit: 50 }
            );

            // Fetch transaction details
            const transactions = await Promise.all(
                signatures.map(async (sig) => {
                    const tx = await this.connection.getParsedTransaction(sig.signature);
                    return this.parseTransaction(tx, sig);
                })
            );

            this.transactions = transactions.filter(tx => tx !== null);
            this.renderTransactionHistory();
            
            // Cache transactions
            this.cacheTransactions();
        } catch (error) {
            console.error('Error fetching transactions:', error);
            this.showErrorState();
        }
    }

    parseTransaction(tx, signature) {
        if (!tx) return null;

        try {
            // Parse UPLIFT token transactions
            const isUpliftTransaction = this.isUpliftTokenTransaction(tx);
            
            if (!isUpliftTransaction) return null;

            const { amount, type, from, to } = this.extractTransactionData(tx);
            
            return {
                signature: signature.signature,
                blockTime: signature.blockTime,
                type, // 'send', 'receive', 'burn', 'stake', 'unstake'
                amount,
                from,
                to,
                status: signature.confirmationStatus,
                fee: tx.meta?.fee || 0
            };
        } catch (error) {
            console.error('Error parsing transaction:', error);
            return null;
        }
    }

    isUpliftTokenTransaction(tx) {
        // Check if transaction involves UPLIFT token
        const upliftMint = process.env.UPLIFT_MINT || '6zn51qJZs4P5MG1Miq79KH8mFEpi9yV232SHKz8zBAGS';
        
        return tx.transaction.message.instructions.some(instruction => {
            return instruction.parsed?.info?.mint === upliftMint ||
                   instruction.parsed?.info?.tokenMint === upliftMint;
        });
    }

    extractTransactionData(tx) {
        // Extract relevant data from transaction
        const instruction = tx.transaction.message.instructions.find(
            inst => inst.parsed?.type === 'transfer' || 
                    inst.parsed?.type === 'transferChecked'
        );

        if (instruction) {
            return {
                amount: instruction.parsed.info.amount || instruction.parsed.info.tokenAmount?.amount,
                type: this.getTransactionType(instruction, tx),
                from: instruction.parsed.info.source || instruction.parsed.info.authority,
                to: instruction.parsed.info.destination
            };
        }

        return { amount: 0, type: 'unknown', from: '', to: '' };
    }

    getTransactionType(instruction, tx) {
        const burnAddress = 'So11111111111111111111111111111111111111112';
        
        if (instruction.parsed.info.destination === burnAddress) {
            return 'burn';
        }
        
        if (instruction.parsed.info.source === this.walletAddress) {
            return 'send';
        }
        
        if (instruction.parsed.info.destination === this.walletAddress) {
            return 'receive';
        }
        
        return 'transfer';
    }

    showLoadingState() {
        const container = document.getElementById('transaction-history');
        if (container && window.skeletonLoader) {
            window.skeletonLoader.show(container, 'list-item', 5);
        }
    }

    showErrorState() {
        const container = document.getElementById('transaction-history');
        if (container && window.emptyStateManager) {
            window.emptyStateManager.show(container, 'offline', {
                title: 'Unable to Load Transactions',
                message: 'Please check your connection and try again.',
                action: 'Retry',
                actionHandler: 'window.transactionHistory.fetchTransactions()'
            });
        }
    }

    renderTransactionHistory() {
        const container = document.getElementById('transaction-history');
        if (!container) return;

        if (this.transactions.length === 0) {
            window.emptyStateManager?.show(container, 'no-data', {
                title: 'No Transactions Yet',
                message: 'Your UPLIFT token transactions will appear here.',
                action: null
            });
            return;
        }

        const html = `
            <div class="transaction-list">
                ${this.transactions.map(tx => this.renderTransaction(tx)).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    renderTransaction(tx) {
        const date = new Date(tx.blockTime * 1000);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        
        const typeIcons = {
            send: '📤',
            receive: '📥',
            burn: '🔥',
            stake: '🔒',
            unstake: '🔓',
            transfer: '↔️'
        };

        const typeColors = {
            send: '#ef4444',
            receive: '#10b981',
            burn: '#f59e0b',
            stake: '#3b82f6',
            unstake: '#8b5cf6',
            transfer: '#6b7280'
        };

        return `
            <div class="transaction-item" onclick="window.open('https://solscan.io/tx/${tx.signature}', '_blank')">
                <div class="transaction-icon" style="color: ${typeColors[tx.type]}">
                    ${typeIcons[tx.type]}
                </div>
                <div class="transaction-details">
                    <div class="transaction-type">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                    <div class="transaction-date">${formattedDate} ${formattedTime}</div>
                </div>
                <div class="transaction-amount ${tx.type === 'receive' ? 'positive' : 'negative'}">
                    ${tx.type === 'receive' ? '+' : '-'}${this.formatAmount(tx.amount)} UPLIFT
                </div>
            </div>
        `;
    }

    formatAmount(amount) {
        // Format with proper decimals
        const decimals = 9; // UPLIFT has 9 decimals
        const formatted = (amount / Math.pow(10, decimals)).toFixed(2);
        return parseFloat(formatted).toLocaleString();
    }

    cacheTransactions() {
        try {
            localStorage.setItem('transaction_history', JSON.stringify({
                transactions: this.transactions.slice(0, 20),
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error caching transactions:', error);
        }
    }

    async refresh() {
        await this.fetchTransactions();
        if (window.toastManager) {
            window.toastManager.success('Transaction history updated');
        }
    }
}

// ============================================
// 2. STAKING INTERFACE
// ============================================

class StakingInterface {
    constructor() {
        this.stakedAmount = 0;
        this.stakingRewards = 0;
        this.apr = 12; // 12% APR
        this.lockPeriods = [
            { days: 7, multiplier: 1.0, name: 'Weekly' },
            { days: 30, multiplier: 1.2, name: 'Monthly' },
            { days: 90, multiplier: 1.5, name: 'Quarterly' },
            { days: 365, multiplier: 2.0, name: 'Yearly' }
        ];
        this.activeStakes = [];
        this.init();
    }

    init() {
        this.loadStakingData();
        this.setupStakingUI();
        this.startRewardCalculation();
    }

    loadStakingData() {
        try {
            const saved = localStorage.getItem('staking_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.stakedAmount = data.stakedAmount || 0;
                this.stakingRewards = data.stakingRewards || 0;
                this.activeStakes = data.activeStakes || [];
            }
        } catch (error) {
            console.error('Error loading staking data:', error);
        }
    }

    saveStakingData() {
        try {
            localStorage.setItem('staking_data', JSON.stringify({
                stakedAmount: this.stakedAmount,
                stakingRewards: this.stakingRewards,
                activeStakes: this.activeStakes
            }));
        } catch (error) {
            console.error('Error saving staking data:', error);
        }
    }

    setupStakingUI() {
        const container = document.getElementById('staking-interface');
        if (!container) return;

        container.innerHTML = `
            <div class="staking-container">
                <div class="staking-header">
                    <h3>UPLIFT Staking</h3>
                    <p>Stake your UPLIFT tokens to earn rewards</p>
                </div>
                
                <div class="staking-stats">
                    <div class="stat-card">
                        <div class="stat-label">Total Staked</div>
                        <div class="stat-value">${this.stakedAmount.toLocaleString()} UPLIFT</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Rewards Earned</div>
                        <div class="stat-value">${this.stakingRewards.toFixed(2)} UPLIFT</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Current APR</div>
                        <div class="stat-value">${this.apr}%</div>
                    </div>
                </div>
                
                <div class="staking-form">
                    <input type="number" 
                           id="stake-amount" 
                           placeholder="Amount to stake"
                           class="stake-input">
                    
                    <div class="lock-period-selector">
                        ${this.lockPeriods.map((period, index) => `
                            <button class="lock-period-option ${index === 0 ? 'active' : ''}"
                                    data-days="${period.days}"
                                    data-multiplier="${period.multiplier}">
                                <div class="period-name">${period.name}</div>
                                <div class="period-multiplier">${period.multiplier}x rewards</div>
                            </button>
                        `).join('')}
                    </div>
                    
                    <button class="stake-button" onclick="window.stakingInterface.stake()">
                        Stake UPLIFT
                    </button>
                </div>
                
                <div class="active-stakes">
                    <h4>Active Stakes</h4>
                    <div class="stakes-list">
                        ${this.renderActiveStakes()}
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Lock period selection
        document.querySelectorAll('.lock-period-option').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.lock-period-option').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    renderActiveStakes() {
        if (this.activeStakes.length === 0) {
            return '<p class="no-stakes">No active stakes</p>';
        }

        return this.activeStakes.map(stake => {
            const endDate = new Date(stake.startDate + stake.lockPeriod * 24 * 60 * 60 * 1000);
            const daysRemaining = Math.max(0, Math.ceil((endDate - Date.now()) / (24 * 60 * 60 * 1000)));
            const canUnstake = daysRemaining === 0;

            return `
                <div class="stake-item">
                    <div class="stake-info">
                        <div class="stake-amount">${stake.amount.toLocaleString()} UPLIFT</div>
                        <div class="stake-period">${stake.periodName} - ${daysRemaining} days remaining</div>
                        <div class="stake-rewards">Rewards: ${stake.rewards.toFixed(2)} UPLIFT</div>
                    </div>
                    ${canUnstake ? `
                        <button class="unstake-button" onclick="window.stakingInterface.unstake('${stake.id}')">
                            Unstake
                        </button>
                    ` : `
                        <div class="stake-locked">🔒 Locked</div>
                    `}
                </div>
            `;
        }).join('');
    }

    async stake() {
        const amountInput = document.getElementById('stake-amount');
        const amount = parseFloat(amountInput.value);
        
        if (!amount || amount <= 0) {
            window.toastManager?.error('Please enter a valid amount');
            return;
        }

        // Get selected lock period
        const selectedPeriod = document.querySelector('.lock-period-option.active');
        const days = parseInt(selectedPeriod.dataset.days);
        const multiplier = parseFloat(selectedPeriod.dataset.multiplier);
        const periodName = selectedPeriod.querySelector('.period-name').textContent;

        // Check balance
        const balance = await this.getWalletBalance();
        if (balance < amount) {
            window.toastManager?.error('Insufficient balance');
            return;
        }

        // Create stake
        const stake = {
            id: Date.now().toString(),
            amount,
            lockPeriod: days,
            periodName,
            multiplier,
            startDate: Date.now(),
            rewards: 0
        };

        this.activeStakes.push(stake);
        this.stakedAmount += amount;
        this.saveStakingData();
        
        // Update UI
        this.setupStakingUI();
        
        // Show success message
        window.toastManager?.success(`Successfully staked ${amount} UPLIFT for ${periodName}`);
        
        // Clear input
        amountInput.value = '';
    }

    async unstake(stakeId) {
        const stakeIndex = this.activeStakes.findIndex(s => s.id === stakeId);
        if (stakeIndex === -1) return;

        const stake = this.activeStakes[stakeIndex];
        
        // Calculate final rewards
        const finalRewards = this.calculateRewards(stake);
        
        // Remove from active stakes
        this.activeStakes.splice(stakeIndex, 1);
        this.stakedAmount -= stake.amount;
        this.stakingRewards += finalRewards;
        
        this.saveStakingData();
        
        // Update UI
        this.setupStakingUI();
        
        // Show success message
        window.toastManager?.success(
            `Unstaked ${stake.amount} UPLIFT and earned ${finalRewards.toFixed(2)} UPLIFT rewards!`
        );
    }

    calculateRewards(stake) {
        const timeStaked = Date.now() - stake.startDate;
        const daysStaked = timeStaked / (24 * 60 * 60 * 1000);
        const baseReward = (stake.amount * (this.apr / 100) * (daysStaked / 365));
        return baseReward * stake.multiplier;
    }

    startRewardCalculation() {
        // Update rewards every hour
        setInterval(() => {
            this.activeStakes.forEach(stake => {
                stake.rewards = this.calculateRewards(stake);
            });
            this.saveStakingData();
            this.updateRewardsDisplay();
        }, 3600000);
    }

    updateRewardsDisplay() {
        const rewardsElement = document.querySelector('.staking-stats .stat-value');
        if (rewardsElement) {
            const totalRewards = this.activeStakes.reduce((sum, stake) => sum + stake.rewards, 0);
            rewardsElement.textContent = `${(this.stakingRewards + totalRewards).toFixed(2)} UPLIFT`;
        }
    }

    async getWalletBalance() {
        // Get wallet balance
        try {
            // This would connect to actual wallet
            return parseFloat(localStorage.getItem('user_tokens') || '0');
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            return 0;
        }
    }
}

// ============================================
// 3. NFT ACHIEVEMENTS
// ============================================

class NFTAchievements {
    constructor() {
        this.nftCollection = [];
        this.mintedAchievements = new Set();
        this.init();
    }

    init() {
        this.loadNFTData();
        this.setupNFTGallery();
    }

    loadNFTData() {
        try {
            const saved = localStorage.getItem('nft_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.nftCollection = data.collection || [];
                this.mintedAchievements = new Set(data.minted || []);
            }
        } catch (error) {
            console.error('Error loading NFT data:', error);
        }
    }

    saveNFTData() {
        try {
            localStorage.setItem('nft_achievements', JSON.stringify({
                collection: this.nftCollection,
                minted: Array.from(this.mintedAchievements)
            }));
        } catch (error) {
            console.error('Error saving NFT data:', error);
        }
    }

    async mintAchievementNFT(achievementId) {
        if (this.mintedAchievements.has(achievementId)) {
            window.toastManager?.warning('This achievement is already minted as NFT');
            return;
        }

        try {
            // Show minting progress
            window.loadingStateManager?.showLoading(
                document.body,
                'progress',
                'Minting your achievement NFT...'
            );

            // Simulate minting process
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Create NFT metadata
            const achievement = window.achievementSystem?.achievements.get(achievementId);
            const nft = {
                id: `nft_${achievementId}_${Date.now()}`,
                achievementId,
                name: achievement.name,
                description: achievement.description,
                image: this.generateNFTImage(achievement),
                attributes: [
                    { trait_type: 'Category', value: achievement.category },
                    { trait_type: 'Rarity', value: achievement.rare ? 'Rare' : 'Common' },
                    { trait_type: 'XP Value', value: achievement.xp },
                    { trait_type: 'Token Reward', value: achievement.tokens || 0 }
                ],
                mintDate: Date.now(),
                owner: localStorage.getItem('wallet_address') || 'Unknown'
            };

            // Add to collection
            this.nftCollection.push(nft);
            this.mintedAchievements.add(achievementId);
            this.saveNFTData();

            // Hide loading
            window.loadingStateManager?.hideLoading(document.body);

            // Show success
            this.showMintSuccess(nft);

            // Update gallery
            this.setupNFTGallery();

        } catch (error) {
            console.error('Error minting NFT:', error);
            window.loadingStateManager?.hideLoading(document.body);
            window.toastManager?.error('Failed to mint NFT. Please try again.');
        }
    }

    generateNFTImage(achievement) {
        // Generate a unique NFT image for the achievement
        // In production, this would generate actual image or use IPFS
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="400" height="400" fill="url(#bg)"/>
                <text x="200" y="180" font-size="72" text-anchor="middle" fill="white">
                    ${achievement.icon}
                </text>
                <text x="200" y="250" font-size="24" font-weight="bold" text-anchor="middle" fill="white">
                    ${achievement.name}
                </text>
                <text x="200" y="280" font-size="16" text-anchor="middle" fill="white" opacity="0.9">
                    ${achievement.description}
                </text>
                <text x="200" y="350" font-size="14" text-anchor="middle" fill="white" opacity="0.7">
                    UPLIFT Achievement NFT
                </text>
            </svg>
        `)}`;
    }

    showMintSuccess(nft) {
        const modal = document.createElement('div');
        modal.className = 'nft-mint-success-modal';
        modal.innerHTML = `
            <div class="nft-mint-content">
                <div class="nft-mint-header">
                    <h2>🎉 NFT Minted Successfully!</h2>
                </div>
                <div class="nft-preview">
                    <img src="${nft.image}" alt="${nft.name}">
                </div>
                <div class="nft-details">
                    <h3>${nft.name}</h3>
                    <p>${nft.description}</p>
                    <div class="nft-attributes">
                        ${nft.attributes.map(attr => `
                            <div class="nft-attribute">
                                <span class="attr-name">${attr.trait_type}:</span>
                                <span class="attr-value">${attr.value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="nft-actions">
                    <button onclick="window.nftAchievements.shareNFT('${nft.id}')">Share</button>
                    <button onclick="this.closest('.nft-mint-success-modal').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);

        // Auto close after 10 seconds
        setTimeout(() => {
            modal.remove();
        }, 10000);
    }

    setupNFTGallery() {
        const container = document.getElementById('nft-gallery');
        if (!container) return;

        if (this.nftCollection.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🖼️</div>
                    <h3>No NFT Achievements Yet</h3>
                    <p>Mint your achievements as NFTs to showcase them forever on the blockchain!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="nft-grid">
                ${this.nftCollection.map(nft => `
                    <div class="nft-card" onclick="window.nftAchievements.viewNFT('${nft.id}')">
                        <div class="nft-image">
                            <img src="${nft.image}" alt="${nft.name}">
                        </div>
                        <div class="nft-info">
                            <h4>${nft.name}</h4>
                            <p class="nft-date">Minted ${new Date(nft.mintDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    viewNFT(nftId) {
        const nft = this.nftCollection.find(n => n.id === nftId);
        if (!nft) return;

        // Open NFT details modal
        // Implementation would show full NFT details
        console.log('View NFT:', nft);
    }

    shareNFT(nftId) {
        const nft = this.nftCollection.find(n => n.id === nftId);
        if (!nft) return;

        // Share NFT on social media
        const shareText = `Check out my ${nft.name} achievement NFT from @OperatorUplift! 🏆`;
        const shareUrl = `https://operatoruplift.com/nft/${nft.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: nft.name,
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback to Twitter
            window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                '_blank'
            );
        }
    }
}

// ============================================
// 4. MULTI-WALLET SUPPORT
// ============================================

class MultiWalletSupport {
    constructor() {
        this.wallets = {
            phantom: {
                name: 'Phantom',
                icon: '👻',
                adapter: null,
                connected: false
            },
            solflare: {
                name: 'Solflare',
                icon: '☀️',
                adapter: null,
                connected: false
            },
            backpack: {
                name: 'Backpack',
                icon: '🎒',
                adapter: null,
                connected: false
            },
            glow: {
                name: 'Glow',
                icon: '✨',
                adapter: null,
                connected: false
            }
        };
        this.currentWallet = null;
        this.init();
    }

    init() {
        this.detectWallets();
        this.setupWalletSelector();
    }

    detectWallets() {
        // Detect Phantom
        if (window.phantom?.solana) {
            this.wallets.phantom.adapter = window.phantom.solana;
        }

        // Detect Solflare
        if (window.solflare) {
            this.wallets.solflare.adapter = window.solflare;
        }

        // Detect Backpack
        if (window.backpack?.solana) {
            this.wallets.backpack.adapter = window.backpack.solana;
        }

        // Detect Glow
        if (window.glow?.solana) {
            this.wallets.glow.adapter = window.glow.solana;
        }
    }

    setupWalletSelector() {
        const container = document.getElementById('wallet-selector');
        if (!container) return;

        container.innerHTML = `
            <div class="wallet-selector">
                <h3>Connect Wallet</h3>
                <div class="wallet-options">
                    ${Object.entries(this.wallets).map(([key, wallet]) => `
                        <button class="wallet-option ${!wallet.adapter ? 'disabled' : ''}"
                                onclick="window.multiWalletSupport.connectWallet('${key}')"
                                ${!wallet.adapter ? 'disabled' : ''}>
                            <span class="wallet-icon">${wallet.icon}</span>
                            <span class="wallet-name">${wallet.name}</span>
                            ${wallet.connected ? '<span class="connected-badge">✓</span>' : ''}
                            ${!wallet.adapter ? '<span class="not-installed">Not Installed</span>' : ''}
                        </button>
                    `).join('')}
                </div>
                ${this.currentWallet ? `
                    <div class="current-wallet">
                        <p>Connected: ${this.currentWallet.publicKey.toString().slice(0, 4)}...${this.currentWallet.publicKey.toString().slice(-4)}</p>
                        <button onclick="window.multiWalletSupport.disconnect()">Disconnect</button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    async connectWallet(walletKey) {
        const wallet = this.wallets[walletKey];
        
        if (!wallet.adapter) {
            // Open wallet website
            const urls = {
                phantom: 'https://phantom.app',
                solflare: 'https://solflare.com',
                backpack: 'https://backpack.app',
                glow: 'https://glow.app'
            };
            
            window.open(urls[walletKey], '_blank');
            return;
        }

        try {
            // Show connecting state
            window.loadingStateManager?.showLoading(
                document.getElementById('wallet-selector'),
                'spinner',
                `Connecting to ${wallet.name}...`
            );

            // Connect to wallet
            const response = await wallet.adapter.connect();
            
            // Update state
            wallet.connected = true;
            this.currentWallet = wallet.adapter;
            
            // Save wallet preference
            localStorage.setItem('preferred_wallet', walletKey);
            localStorage.setItem('wallet_address', response.publicKey.toString());
            
            // Hide loading
            window.loadingStateManager?.hideLoading(document.getElementById('wallet-selector'));
            
            // Update UI
            this.setupWalletSelector();
            
            // Show success
            window.toastManager?.success(`Connected to ${wallet.name}`);
            
            // Fire event
            document.dispatchEvent(new CustomEvent('wallet-connected', {
                detail: {
                    wallet: walletKey,
                    publicKey: response.publicKey.toString()
                }
            }));
            
        } catch (error) {
            console.error('Error connecting wallet:', error);
            window.loadingStateManager?.hideLoading(document.getElementById('wallet-selector'));
            window.toastManager?.error(`Failed to connect ${wallet.name}`);
        }
    }

    async disconnect() {
        if (this.currentWallet) {
            await this.currentWallet.disconnect();
            
            // Reset state
            Object.values(this.wallets).forEach(w => w.connected = false);
            this.currentWallet = null;
            
            // Clear storage
            localStorage.removeItem('preferred_wallet');
            localStorage.removeItem('wallet_address');
            
            // Update UI
            this.setupWalletSelector();
            
            // Show message
            window.toastManager?.info('Wallet disconnected');
            
            // Fire event
            document.dispatchEvent(new CustomEvent('wallet-disconnected'));
        }
    }

    async autoConnect() {
        const preferredWallet = localStorage.getItem('preferred_wallet');
        if (preferredWallet && this.wallets[preferredWallet]?.adapter) {
            try {
                await this.connectWallet(preferredWallet);
            } catch (error) {
                console.error('Auto-connect failed:', error);
            }
        }
    }
}

// ============================================
// 5. INITIALIZATION
// ============================================

// Initialize Web3 enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWeb3Enhancements);
} else {
    initializeWeb3Enhancements();
}

async function initializeWeb3Enhancements() {
    // Initialize components
    window.transactionHistory = new TransactionHistory();
    window.stakingInterface = new StakingInterface();
    window.nftAchievements = new NFTAchievements();
    window.multiWalletSupport = new MultiWalletSupport();
    
    // Auto-connect wallet
    await window.multiWalletSupport.autoConnect();
    
    // Create global Web3 interface
    window.Web3 = {
        refreshTransactions: () => window.transactionHistory.refresh(),
        stake: (amount, period) => window.stakingInterface.stake(amount, period),
        unstake: (stakeId) => window.stakingInterface.unstake(stakeId),
        mintNFT: (achievementId) => window.nftAchievements.mintAchievementNFT(achievementId),
        connectWallet: (wallet) => window.multiWalletSupport.connectWallet(wallet),
        disconnect: () => window.multiWalletSupport.disconnect()
    };
    
    console.log('✅ Web3 enhancements initialized');
}

// Export for use in other modules
export {
    TransactionHistory,
    StakingInterface,
    NFTAchievements,
    MultiWalletSupport
};
