/**
 * Social Hub and Wallet Integration Module
 * Properly integrates Social and Wallet features into their respective view pages
 */

// ============================================
// SOCIAL HUB VIEW INTEGRATION
// ============================================

function createSocialView() {
    return `
        <div class="social-hub-container" style="padding: 2rem;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="color: var(--text-primary); font-size: 2rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-users"></i> Social Hub
                </h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary" onclick="window.socialSystem?.loadSocialData()">
                        <i class="fas fa-sync"></i> Refresh
                    </button>
                    <button class="btn btn-primary" onclick="openCreatePostModal()">
                        <i class="fas fa-plus"></i> New Post
                    </button>
                </div>
            </div>

            <!-- Main Layout Grid -->
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 2rem;">
                <!-- Left Column: Feed -->
                <div>
                    <!-- Create Post Card -->
                    <div class="card" style="margin-bottom: 1.5rem;">
                        <div class="card-body" style="padding: 1.5rem;">
                            <div style="display: flex; gap: 1rem;">
                                <img src="${localStorage.getItem('userAvatar') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}" 
                                     alt="You" 
                                     style="width: 48px; height: 48px; border-radius: 50%;">
                                <div style="flex: 1;">
                                    <textarea 
                                        id="social-post-input" 
                                        placeholder="Share your progress..."
                                        style="width: 100%; min-height: 80px; padding: 0.75rem; 
                                               background: var(--bg-primary); border: 1px solid var(--border-color); 
                                               border-radius: 8px; color: var(--text-primary); resize: vertical;">
                                    </textarea>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center;">
                                        <button class="btn-icon" title="Add Image">
                                            <i class="fas fa-image"></i>
                                        </button>
                                        <button class="btn-icon" title="Add Achievement">
                                            <i class="fas fa-trophy"></i>
                                        </button>
                                        <button class="btn-icon" title="Tag Friends">
                                            <i class="fas fa-user-tag"></i>
                                        </button>
                                        <button class="btn btn-primary" style="margin-left: auto;" onclick="publishSocialPost()">
                                            <i class="fas fa-paper-plane"></i> Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Feed Filters -->
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <button class="filter-btn active" data-filter="all" onclick="filterSocialFeed('all')">All Posts</button>
                        <button class="filter-btn" data-filter="friends" onclick="filterSocialFeed('friends')">Friends</button>
                        <button class="filter-btn" data-filter="achievements" onclick="filterSocialFeed('achievements')">Achievements</button>
                        <button class="filter-btn" data-filter="challenges" onclick="filterSocialFeed('challenges')">Challenges</button>
                    </div>

                    <!-- Social Feed -->
                    <div id="social-feed-container">
                        <!-- Posts will be loaded here -->
                        <div class="card">
                            <div class="card-body">
                                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
                                         alt="Sarah" 
                                         style="width: 40px; height: 40px; border-radius: 50%;">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600;">Sarah Johnson</div>
                                        <div style="font-size: 0.875rem; color: var(--text-muted);">2 hours ago</div>
                                    </div>
                                </div>
                                <p style="margin-bottom: 1rem;">Just completed my 30-day meditation streak! 🧘‍♀️ Feeling more focused than ever.</p>
                                <div style="display: flex; gap: 2rem; padding: 0.75rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 0.75rem; font-size: 0.875rem; color: var(--text-muted);">
                                    <span>24 likes</span>
                                    <span>5 comments</span>
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="post-interaction-btn" style="flex: 1; padding: 0.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; border-radius: 8px;">
                                        <i class="fas fa-heart"></i> Like
                                    </button>
                                    <button class="post-interaction-btn" style="flex: 1; padding: 0.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; border-radius: 8px;">
                                        <i class="fas fa-comment"></i> Comment
                                    </button>
                                    <button class="post-interaction-btn" style="flex: 1; padding: 0.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; border-radius: 8px;">
                                        <i class="fas fa-share"></i> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Friends & Notifications -->
                <div>
                    <!-- Friends Panel -->
                    <div class="card" style="margin-bottom: 1.5rem;">
                        <div class="card-header">
                            <h3 class="card-title">Friends</h3>
                            <button class="btn-icon" onclick="openAddFriendModal()">
                                <i class="fas fa-user-plus"></i>
                            </button>
                        </div>
                        <div class="card-body">
                            <!-- Friend Requests -->
                            <div id="friend-requests-container" style="margin-bottom: 1rem;">
                                <h4 style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;">Friend Requests</h4>
                                <div style="padding: 0.75rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
                                             alt="John" 
                                             style="width: 40px; height: 40px; border-radius: 50%;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 500;">John Smith</div>
                                            <div style="font-size: 0.875rem; color: var(--text-muted);">3 mutual friends</div>
                                        </div>
                                        <div style="display: flex; gap: 0.5rem;">
                                            <button class="btn btn-sm btn-primary">Accept</button>
                                            <button class="btn btn-sm btn-secondary">Decline</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Friends List -->
                            <div id="friends-list-container">
                                <div style="padding: 0.75rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                                             alt="Alex" 
                                             style="width: 40px; height: 40px; border-radius: 50%;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 500;">Alex Chen</div>
                                            <div style="font-size: 0.875rem; color: var(--text-muted);">
                                                <i class="fas fa-circle" style="color: #10b981; font-size: 0.5rem;"></i> Online • Level 25
                                            </div>
                                        </div>
                                        <button class="btn-icon" title="Send Message">
                                            <i class="fas fa-comment"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style="padding: 0.75rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" 
                                             alt="Emma" 
                                             style="width: 40px; height: 40px; border-radius: 50%;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 500;">Emma Davis</div>
                                            <div style="font-size: 0.875rem; color: var(--text-muted);">
                                                <i class="fas fa-circle" style="color: #6b7280; font-size: 0.5rem;"></i> Offline • Level 18
                                            </div>
                                        </div>
                                        <button class="btn-icon" title="Send Message">
                                            <i class="fas fa-comment"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Notifications Panel -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Notifications</h3>
                            <span class="notification-badge" style="background: var(--danger-color); color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">2</span>
                        </div>
                        <div class="card-body">
                            <div id="notifications-container">
                                <div style="padding: 0.75rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid var(--primary-color); cursor: pointer;">
                                    <p style="margin: 0;">You unlocked "Early Bird" achievement!</p>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">30 minutes ago</span>
                                </div>
                                <div style="padding: 0.75rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid var(--primary-color); cursor: pointer;">
                                    <p style="margin: 0;">Alex Chen sent you a friend request</p>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">1 hour ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// WALLET VIEW INTEGRATION
// ============================================

function createWalletView() {
    const isConnected = localStorage.getItem('walletConnected') === 'true';
    const walletAddress = localStorage.getItem('walletAddress') || '';
    
    return `
        <div class="wallet-container" style="padding: 2rem;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="color: var(--text-primary); font-size: 2rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-wallet"></i> Token Wallet
                </h2>
                ${!isConnected ? `
                    <button class="btn btn-primary" onclick="connectWallet()">
                        <i class="fas fa-plug"></i> Connect Wallet
                    </button>
                ` : `
                    <button class="btn btn-danger" onclick="disconnectWallet()">
                        <i class="fas fa-unlink"></i> Disconnect
                    </button>
                `}
            </div>

            ${!isConnected ? `
                <!-- Not Connected State -->
                <div class="card" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 64px; margin-bottom: 1rem;">🔗</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Connect Your Wallet</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        Connect your Phantom wallet to manage your UPLIFT tokens and view your balance.
                    </p>
                    <button class="btn btn-primary btn-lg" onclick="connectWallet()">
                        <i class="fas fa-plug"></i> Connect Phantom Wallet
                    </button>
                    <p style="color: var(--text-muted); margin-top: 1rem; font-size: 0.875rem;">
                        Don't have Phantom? 
                        <a href="https://phantom.app/" target="_blank" style="color: var(--primary-color);">
                            Download here
                        </a>
                    </p>
                </div>
            ` : `
                <!-- Connected State -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                    <!-- Wallet Info Card -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Wallet Info</h3>
                            <div class="card-icon">💳</div>
                        </div>
                        <div class="card-body">
                            <div style="margin-bottom: 1rem;">
                                <label style="font-size: 0.875rem; color: var(--text-muted);">Address</label>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <code style="font-family: monospace; font-size: 0.875rem;">
                                        ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}
                                    </code>
                                    <button class="btn-icon" onclick="copyWalletAddress('${walletAddress}')" title="Copy address">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <div style="margin-bottom: 1rem;">
                                <label style="font-size: 0.875rem; color: var(--text-muted);">Network</label>
                                <div>Solana Mainnet</div>
                            </div>
                        </div>
                    </div>

                    <!-- Balance Card -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Balance</h3>
                            <div class="card-icon">💰</div>
                        </div>
                        <div class="card-body">
                            <div style="margin-bottom: 1rem;">
                                <label style="font-size: 0.875rem; color: var(--text-muted);">SOL Balance</label>
                                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">
                                    <span id="sol-balance">2.4567</span> SOL
                                </div>
                            </div>
                            <div>
                                <label style="font-size: 0.875rem; color: var(--text-muted);">UPLIFT Tokens</label>
                                <div style="font-size: 1.5rem; font-weight: bold; color: var(--success-color);">
                                    <span id="uplift-balance">5,000</span> UPLIFT
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions Card -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Quick Actions</h3>
                            <div class="card-icon">⚡</div>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 0.75rem;">
                                <button class="btn btn-secondary" onclick="openSendModal()">
                                    <i class="fas fa-paper-plane"></i> Send
                                </button>
                                <button class="btn btn-secondary" onclick="openReceiveModal()">
                                    <i class="fas fa-download"></i> Receive
                                </button>
                                <button class="btn btn-secondary" onclick="openSwapModal()">
                                    <i class="fas fa-exchange-alt"></i> Swap
                                </button>
                                <button class="btn btn-secondary" onclick="openStakeModal()">
                                    <i class="fas fa-lock"></i> Stake
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Transaction History -->
                <div class="card" style="margin-top: 1.5rem;">
                    <div class="card-header">
                        <h3 class="card-title">Recent Transactions</h3>
                        <button class="btn btn-sm btn-secondary" onclick="refreshTransactions()">
                            <i class="fas fa-sync"></i> Refresh
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="transaction-history">
                            <!-- Transaction Item -->
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <i class="fas fa-arrow-down" style="color: var(--success-color);"></i>
                                    <div>
                                        <div style="font-weight: 500;">Received from Rewards</div>
                                        <div style="font-size: 0.875rem; color: var(--text-muted);">2 hours ago</div>
                                    </div>
                                </div>
                                <div style="font-weight: bold; color: var(--success-color);">+100 UPLIFT</div>
                            </div>
                            
                            <!-- Transaction Item -->
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <i class="fas fa-arrow-up" style="color: var(--danger-color);"></i>
                                    <div>
                                        <div style="font-weight: 500;">Sent to Stake Pool</div>
                                        <div style="font-size: 0.875rem; color: var(--text-muted);">Yesterday</div>
                                    </div>
                                </div>
                                <div style="font-weight: bold; color: var(--danger-color);">-50 UPLIFT</div>
                            </div>
                            
                            <!-- Transaction Item -->
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <i class="fas fa-exchange-alt" style="color: var(--primary-color);"></i>
                                    <div>
                                        <div style="font-weight: 500;">Swapped SOL for UPLIFT</div>
                                        <div style="font-size: 0.875rem; color: var(--text-muted);">2 days ago</div>
                                    </div>
                                </div>
                                <div style="font-weight: bold; color: var(--primary-color);">+500 UPLIFT</div>
                            </div>
                        </div>
                        
                        <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="loadMoreTransactions()">
                            Load More
                        </button>
                    </div>
                </div>

                <!-- Staking Info -->
                <div class="card" style="margin-top: 1.5rem;">
                    <div class="card-header">
                        <h3 class="card-title">Staking</h3>
                        <div class="card-icon">🔒</div>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                            <div>
                                <label style="font-size: 0.875rem; color: var(--text-muted);">Staked Amount</label>
                                <div style="font-size: 1.25rem; font-weight: bold;">1,000 UPLIFT</div>
                            </div>
                            <div>
                                <label style="font-size: 0.875rem; color: var(--text-muted);">APY</label>
                                <div style="font-size: 1.25rem; font-weight: bold; color: var(--success-color);">12.5%</div>
                            </div>
                            <div>
                                <label style="font-size: 0.875rem; color: var(--text-muted);">Rewards Earned</label>
                                <div style="font-size: 1.25rem; font-weight: bold; color: var(--primary-color);">25 UPLIFT</div>
                            </div>
                            <div>
                                <label style="font-size: 0.875rem; color: var(--text-muted);">Lock Period</label>
                                <div style="font-size: 1.25rem; font-weight: bold;">30 days</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                            <button class="btn btn-primary" onclick="openStakeModal()">
                                <i class="fas fa-plus"></i> Stake More
                            </button>
                            <button class="btn btn-secondary" onclick="claimRewards()">
                                <i class="fas fa-gift"></i> Claim Rewards
                            </button>
                        </div>
                    </div>
                </div>
            `}
        </div>
    `;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Social Hub Functions
function publishSocialPost() {
    const input = document.getElementById('social-post-input');
    const content = input.value.trim();
    
    if (!content) {
        showToast('Please write something to post', 'warning');
        return;
    }
    
    // Add post to feed
    const newPost = {
        id: Date.now(),
        author: localStorage.getItem('userName') || 'You',
        avatar: localStorage.getItem('userAvatar') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
        content: content,
        timestamp: 'Just now',
        likes: 0,
        comments: 0
    };
    
    // Save to localStorage
    const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    posts.unshift(newPost);
    localStorage.setItem('socialPosts', JSON.stringify(posts));
    
    // Clear input
    input.value = '';
    
    // Refresh feed
    loadSocialFeed();
    
    showToast('Post published successfully!', 'success');
}

function filterSocialFeed(filter) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Filter posts (implement filtering logic)
    loadSocialFeed(filter);
}

function loadSocialFeed(filter = 'all') {
    // Load and display posts based on filter
    const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    // Implement filtering and rendering logic
}

// Wallet Functions
async function connectWallet() {
    if (!window.solana || !window.solana.isPhantom) {
        showToast('Please install Phantom wallet', 'error');
        window.open('https://phantom.app/', '_blank');
        return;
    }
    
    try {
        const response = await window.solana.connect();
        const address = response.publicKey.toString();
        
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', address);
        
        // Reload wallet view
        loadViewContent('wallet');
        
        showToast('Wallet connected successfully!', 'success');
    } catch (error) {
        console.error('Wallet connection failed:', error);
        showToast('Failed to connect wallet', 'error');
    }
}

function disconnectWallet() {
    if (window.solana) {
        window.solana.disconnect();
    }
    
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    
    // Reload wallet view
    loadViewContent('wallet');
    
    showToast('Wallet disconnected', 'info');
}

function copyWalletAddress(address) {
    navigator.clipboard.writeText(address);
    showToast('Address copied to clipboard!', 'success');
}

function openSendModal() {
    // Create and show send modal
    const modal = createModal('Send Tokens', `
        <form onsubmit="sendTokens(event)">
            <div class="form-group">
                <label>Recipient Address</label>
                <input type="text" id="recipient-address" required placeholder="Enter wallet address">
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" id="send-amount" step="0.01" required placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Token</label>
                <select id="send-token">
                    <option value="SOL">SOL</option>
                    <option value="UPLIFT">UPLIFT</option>
                </select>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Send</button>
            </div>
        </form>
    `);
    document.body.appendChild(modal);
}

function openReceiveModal() {
    const address = localStorage.getItem('walletAddress') || '';
    const modal = createModal('Receive Tokens', `
        <div style="text-align: center;">
            <div style="padding: 2rem; background: white; border-radius: 8px; margin-bottom: 1rem;">
                <canvas id="qr-code"></canvas>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="font-size: 0.875rem; color: var(--text-muted);">Your Wallet Address</label>
                <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                    <code style="font-family: monospace; font-size: 0.875rem;">${address}</code>
                    <button class="btn-icon" onclick="copyWalletAddress('${address}')">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `);
    document.body.appendChild(modal);
    
    // Generate QR code (would need QR library)
    // generateQRCode(address);
}

function openSwapModal() {
    const modal = createModal('Swap Tokens', `
        <form onsubmit="swapTokens(event)">
            <div class="form-group">
                <label>From</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="number" id="swap-from-amount" step="0.01" required placeholder="0.00">
                    <select id="swap-from-token">
                        <option value="SOL">SOL</option>
                        <option value="UPLIFT">UPLIFT</option>
                    </select>
                </div>
            </div>
            <div style="text-align: center; margin: 1rem 0;">
                <i class="fas fa-exchange-alt" style="font-size: 1.5rem; color: var(--primary-color);"></i>
            </div>
            <div class="form-group">
                <label>To</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="number" id="swap-to-amount" readonly placeholder="0.00">
                    <select id="swap-to-token">
                        <option value="UPLIFT">UPLIFT</option>
                        <option value="SOL">SOL</option>
                    </select>
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Swap</button>
            </div>
        </form>
    `);
    document.body.appendChild(modal);
}

function openStakeModal() {
    const modal = createModal('Stake UPLIFT', `
        <form onsubmit="stakeTokens(event)">
            <div class="form-group">
                <label>Amount to Stake</label>
                <input type="number" id="stake-amount" step="1" required placeholder="0">
                <small style="color: var(--text-muted);">Available: 5,000 UPLIFT</small>
            </div>
            <div class="form-group">
                <label>Lock Period</label>
                <select id="stake-period">
                    <option value="7">7 days (5% APY)</option>
                    <option value="30">30 days (12.5% APY)</option>
                    <option value="90">90 days (25% APY)</option>
                    <option value="365">365 days (50% APY)</option>
                </select>
            </div>
            <div style="padding: 1rem; background: var(--bg-primary); border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Estimated Rewards:</span>
                    <span id="estimated-rewards">0 UPLIFT</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Unlock Date:</span>
                    <span id="unlock-date">--</span>
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Stake</button>
            </div>
        </form>
    `);
    document.body.appendChild(modal);
}

// Modal Helper
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h2>${title}</h2>
            ${content}
        </div>
    `;
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.remove();
    }
}

function showToast(message, type = 'info') {
    if (window.toastSystem) {
        window.toastSystem.show(message, type);
    } else if (window.showToast) {
        window.showToast(message, type);
    } else {
        // Fallback toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// ============================================
// INTEGRATION WITH APP.HTML
// ============================================

// Override the loadViewContent function to include social and wallet views
if (typeof window.loadViewContent !== 'undefined') {
    const originalLoadViewContent = window.loadViewContent;
    
    window.loadViewContent = function(view) {
        const mainContent = document.getElementById('mainContent');
        
        // Hide all views
        document.querySelectorAll('.view-container').forEach(v => {
            v.classList.remove('active');
        });
        
        // Handle social and wallet views
        if (view === 'social') {
            let viewContainer = document.getElementById('socialView');
            if (!viewContainer) {
                viewContainer = document.createElement('div');
                viewContainer.id = 'socialView';
                viewContainer.className = 'view-container';
                viewContainer.innerHTML = createSocialView();
                mainContent.appendChild(viewContainer);
            }
            viewContainer.classList.add('active');
            
            // Initialize social system if available
            if (window.socialSystem) {
                window.socialSystem.loadSocialData();
            }
        } else if (view === 'wallet') {
            let viewContainer = document.getElementById('walletView');
            if (!viewContainer) {
                viewContainer = document.createElement('div');
                viewContainer.id = 'walletView';
                viewContainer.className = 'view-container';
                viewContainer.innerHTML = createWalletView();
                mainContent.appendChild(viewContainer);
            } else {
                // Refresh wallet view to update connection state
                viewContainer.innerHTML = createWalletView();
            }
            viewContainer.classList.add('active');
            
            // Initialize wallet system if available
            if (window.walletSystem) {
                window.walletSystem.checkWalletConnection();
            }
        } else {
            // Call original function for other views
            originalLoadViewContent(view);
        }
    };
}

// Export functions to global scope
window.createSocialView = createSocialView;
window.createWalletView = createWalletView;
window.publishSocialPost = publishSocialPost;
window.filterSocialFeed = filterSocialFeed;
window.connectWallet = connectWallet;
window.disconnectWallet = disconnectWallet;
window.copyWalletAddress = copyWalletAddress;
window.openSendModal = openSendModal;
window.openReceiveModal = openReceiveModal;
window.openSwapModal = openSwapModal;
window.openStakeModal = openStakeModal;

console.log('✅ Social Hub and Wallet views integrated successfully!');
