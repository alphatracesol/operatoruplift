/**
 * Social Features Module
 * Implements user profiles, friends, community features, and social interactions
 */

// ============================================
// 1. USER PROFILE SYSTEM
// ============================================

class UserProfileSystem {
    constructor() {
        this.currentUser = null;
        this.profiles = new Map();
        this.init();
    }

    async init() {
        await this.loadCurrentUser();
        this.setupProfileUI();
        this.setupEventListeners();
    }

    async loadCurrentUser() {
        try {
            // Load from Firebase or localStorage
            const saved = localStorage.getItem('user_profile');
            if (saved) {
                this.currentUser = JSON.parse(saved);
            } else {
                this.currentUser = await this.createDefaultProfile();
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.currentUser = await this.createDefaultProfile();
        }
    }

    async createDefaultProfile() {
        const profile = {
            id: this.generateUserId(),
            username: '',
            displayName: 'Anonymous User',
            avatar: this.generateAvatar(),
            bio: '',
            level: 1,
            xp: 0,
            achievements: [],
            friends: [],
            followers: [],
            following: [],
            stats: {
                totalFocusTime: 0,
                tasksCompleted: 0,
                currentStreak: 0,
                longestStreak: 0,
                achievementsUnlocked: 0,
                joinDate: Date.now()
            },
            preferences: {
                privacy: 'public',
                notifications: {
                    friendRequests: true,
                    achievements: true,
                    mentions: true,
                    challenges: true
                },
                theme: 'dark',
                language: 'en'
            },
            social: {
                twitter: '',
                discord: '',
                github: '',
                website: ''
            },
            badges: [],
            customization: {
                profileTheme: 'default',
                banner: null,
                accentColor: '#f97316'
            }
        };

        this.saveProfile(profile);
        return profile;
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateAvatar(seed = null) {
        // Generate a unique avatar using dicebear API
        const style = 'avataaars';
        const actualSeed = seed || Math.random().toString(36).substr(2, 9);
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${actualSeed}`;
    }

    saveProfile(profile = this.currentUser) {
        localStorage.setItem('user_profile', JSON.stringify(profile));
        
        // Also save to Firebase if connected
        if (window.firebase?.auth?.currentUser) {
            firebase.firestore()
                .collection('users')
                .doc(window.firebase.auth.currentUser.uid)
                .set(profile, { merge: true });
        }
    }

    setupProfileUI() {
        this.createProfileModal();
        this.createProfileCard();
        this.updateProfileDisplay();
    }

    createProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal profile-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Profile</h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="profile-edit-section">
                        <div class="avatar-upload">
                            <img src="${this.currentUser.avatar}" alt="Avatar" class="profile-avatar-large">
                            <button class="change-avatar-btn">Change Avatar</button>
                        </div>
                        
                        <div class="profile-fields">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" id="profile-username" value="${this.currentUser.username}" placeholder="Choose a username">
                            </div>
                            
                            <div class="form-group">
                                <label>Display Name</label>
                                <input type="text" id="profile-displayname" value="${this.currentUser.displayName}">
                            </div>
                            
                            <div class="form-group">
                                <label>Bio</label>
                                <textarea id="profile-bio" rows="3" placeholder="Tell us about yourself">${this.currentUser.bio}</textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-social-links">
                        <h3>Social Links</h3>
                        <div class="form-group">
                            <label><i class="fab fa-twitter"></i> Twitter</label>
                            <input type="text" id="profile-twitter" value="${this.currentUser.social.twitter}" placeholder="@username">
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fab fa-discord"></i> Discord</label>
                            <input type="text" id="profile-discord" value="${this.currentUser.social.discord}" placeholder="username#0000">
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fab fa-github"></i> GitHub</label>
                            <input type="text" id="profile-github" value="${this.currentUser.social.github}" placeholder="username">
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-globe"></i> Website</label>
                            <input type="url" id="profile-website" value="${this.currentUser.social.website}" placeholder="https://example.com">
                        </div>
                    </div>
                    
                    <div class="profile-privacy">
                        <h3>Privacy Settings</h3>
                        <div class="form-group">
                            <label>Profile Visibility</label>
                            <select id="profile-privacy">
                                <option value="public" ${this.currentUser.preferences.privacy === 'public' ? 'selected' : ''}>Public</option>
                                <option value="friends" ${this.currentUser.preferences.privacy === 'friends' ? 'selected' : ''}>Friends Only</option>
                                <option value="private" ${this.currentUser.preferences.privacy === 'private' ? 'selected' : ''}>Private</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary cancel-profile">Cancel</button>
                    <button class="btn btn-primary save-profile">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    createProfileCard() {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <div class="profile-banner" style="background: linear-gradient(135deg, ${this.currentUser.customization.accentColor}, ${this.currentUser.customization.accentColor}66);">
                <button class="edit-profile-btn">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
            
            <div class="profile-card-content">
                <img src="${this.currentUser.avatar}" alt="Avatar" class="profile-avatar">
                <h3 class="profile-name">${this.currentUser.displayName}</h3>
                <p class="profile-username">@${this.currentUser.username || 'anonymous'}</p>
                <p class="profile-bio">${this.currentUser.bio || 'No bio yet'}</p>
                
                <div class="profile-stats-row">
                    <div class="profile-stat">
                        <span class="stat-value">${this.currentUser.level}</span>
                        <span class="stat-label">Level</span>
                    </div>
                    <div class="profile-stat">
                        <span class="stat-value">${this.currentUser.friends.length}</span>
                        <span class="stat-label">Friends</span>
                    </div>
                    <div class="profile-stat">
                        <span class="stat-value">${this.currentUser.achievements.length}</span>
                        <span class="stat-label">Achievements</span>
                    </div>
                </div>
                
                <div class="profile-badges">
                    ${this.renderBadges()}
                </div>
                
                <div class="profile-social-links-display">
                    ${this.renderSocialLinks()}
                </div>
            </div>
        `;

        return card;
    }

    renderBadges() {
        if (!this.currentUser.badges || this.currentUser.badges.length === 0) {
            return '<p class="no-badges">No badges yet</p>';
        }

        return this.currentUser.badges.map(badge => `
            <div class="badge" title="${badge.name}">
                <img src="${badge.icon}" alt="${badge.name}">
            </div>
        `).join('');
    }

    renderSocialLinks() {
        const links = [];
        
        if (this.currentUser.social.twitter) {
            links.push(`<a href="https://twitter.com/${this.currentUser.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>`);
        }
        if (this.currentUser.social.discord) {
            links.push(`<span title="${this.currentUser.social.discord}"><i class="fab fa-discord"></i></span>`);
        }
        if (this.currentUser.social.github) {
            links.push(`<a href="https://github.com/${this.currentUser.social.github}" target="_blank"><i class="fab fa-github"></i></a>`);
        }
        if (this.currentUser.social.website) {
            links.push(`<a href="${this.currentUser.social.website}" target="_blank"><i class="fas fa-globe"></i></a>`);
        }
        
        return links.join('');
    }

    updateProfileDisplay() {
        // Update all profile displays across the app
        document.querySelectorAll('.user-avatar').forEach(el => {
            el.src = this.currentUser.avatar;
        });
        
        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = this.currentUser.displayName;
        });
        
        document.querySelectorAll('.user-level').forEach(el => {
            el.textContent = `Level ${this.currentUser.level}`;
        });
    }

    setupEventListeners() {
        // Edit profile button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-profile-btn')) {
                this.openProfileModal();
            }
        });

        // Save profile changes
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('save-profile')) {
                this.saveProfileChanges();
            }
        });

        // Change avatar
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('change-avatar-btn')) {
                this.showAvatarPicker();
            }
        });
    }

    openProfileModal() {
        const modal = document.querySelector('.profile-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeProfileModal() {
        const modal = document.querySelector('.profile-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    saveProfileChanges() {
        this.currentUser.username = document.getElementById('profile-username').value;
        this.currentUser.displayName = document.getElementById('profile-displayname').value;
        this.currentUser.bio = document.getElementById('profile-bio').value;
        this.currentUser.social.twitter = document.getElementById('profile-twitter').value;
        this.currentUser.social.discord = document.getElementById('profile-discord').value;
        this.currentUser.social.github = document.getElementById('profile-github').value;
        this.currentUser.social.website = document.getElementById('profile-website').value;
        this.currentUser.preferences.privacy = document.getElementById('profile-privacy').value;
        
        this.saveProfile();
        this.updateProfileDisplay();
        this.closeProfileModal();
        
        // Show success message
        window.toastSystem?.show('Profile updated successfully!', 'success');
    }

    showAvatarPicker() {
        const picker = document.createElement('div');
        picker.className = 'avatar-picker';
        picker.innerHTML = `
            <h3>Choose an Avatar</h3>
            <div class="avatar-grid">
                ${Array(12).fill(0).map(() => {
                    const avatar = this.generateAvatar();
                    return `<img src="${avatar}" class="avatar-option" data-avatar="${avatar}">`;
                }).join('')}
            </div>
            <button class="regenerate-avatars">Generate More</button>
        `;

        document.body.appendChild(picker);

        picker.addEventListener('click', (e) => {
            if (e.target.classList.contains('avatar-option')) {
                this.currentUser.avatar = e.target.dataset.avatar;
                document.querySelector('.profile-avatar-large').src = this.currentUser.avatar;
                picker.remove();
            }
            
            if (e.target.classList.contains('regenerate-avatars')) {
                picker.querySelector('.avatar-grid').innerHTML = Array(12).fill(0).map(() => {
                    const avatar = this.generateAvatar();
                    return `<img src="${avatar}" class="avatar-option" data-avatar="${avatar}">`;
                }).join('');
            }
        });
    }

    async updateStats(statName, value) {
        if (this.currentUser.stats[statName] !== undefined) {
            this.currentUser.stats[statName] = value;
            this.saveProfile();
        }
    }

    async addAchievement(achievementId) {
        if (!this.currentUser.achievements.includes(achievementId)) {
            this.currentUser.achievements.push(achievementId);
            this.currentUser.stats.achievementsUnlocked++;
            this.saveProfile();
        }
    }

    async addBadge(badge) {
        if (!this.currentUser.badges.find(b => b.id === badge.id)) {
            this.currentUser.badges.push(badge);
            this.saveProfile();
        }
    }
}

// ============================================
// 2. FRIENDS SYSTEM
// ============================================

class FriendsSystem {
    constructor(profileSystem) {
        this.profileSystem = profileSystem;
        this.friendRequests = new Map();
        this.init();
    }

    init() {
        this.loadFriendRequests();
        this.setupFriendsUI();
        this.setupEventListeners();
    }

    loadFriendRequests() {
        try {
            const saved = localStorage.getItem('friend_requests');
            if (saved) {
                const requests = JSON.parse(saved);
                requests.forEach(req => this.friendRequests.set(req.id, req));
            }
        } catch (error) {
            console.error('Error loading friend requests:', error);
        }
    }

    setupFriendsUI() {
        this.createFriendsModal();
        this.createFriendsList();
    }

    createFriendsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal friends-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Friends</h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="friends-tabs">
                        <button class="tab-btn active" data-tab="friends">Friends</button>
                        <button class="tab-btn" data-tab="requests">Requests</button>
                        <button class="tab-btn" data-tab="find">Find Friends</button>
                    </div>
                    
                    <div class="friends-content">
                        <div class="tab-content active" id="friends-tab">
                            <div class="friends-list">
                                ${this.renderFriendsList()}
                            </div>
                        </div>
                        
                        <div class="tab-content" id="requests-tab">
                            <div class="friend-requests">
                                ${this.renderFriendRequests()}
                            </div>
                        </div>
                        
                        <div class="tab-content" id="find-tab">
                            <div class="find-friends">
                                <input type="text" placeholder="Search by username" class="friend-search">
                                <div class="suggested-friends">
                                    ${this.renderSuggestedFriends()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    createFriendsList() {
        const list = document.createElement('div');
        list.className = 'friends-sidebar-list';
        list.innerHTML = `
            <h3>Online Friends</h3>
            <div class="online-friends">
                ${this.renderOnlineFriends()}
            </div>
        `;
        
        return list;
    }

    renderFriendsList() {
        const friends = this.profileSystem.currentUser.friends;
        
        if (friends.length === 0) {
            return '<p class="no-friends">No friends yet. Start connecting!</p>';
        }

        return friends.map(friendId => {
            const friend = this.getFriendProfile(friendId);
            return `
                <div class="friend-item" data-friend-id="${friendId}">
                    <img src="${friend.avatar}" alt="${friend.displayName}" class="friend-avatar">
                    <div class="friend-info">
                        <h4>${friend.displayName}</h4>
                        <p class="friend-status">${friend.status || 'Offline'}</p>
                    </div>
                    <div class="friend-actions">
                        <button class="btn-icon" title="View Profile"><i class="fas fa-user"></i></button>
                        <button class="btn-icon" title="Send Message"><i class="fas fa-comment"></i></button>
                        <button class="btn-icon" title="Challenge"><i class="fas fa-gamepad"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderFriendRequests() {
        if (this.friendRequests.size === 0) {
            return '<p class="no-requests">No pending friend requests</p>';
        }

        return Array.from(this.friendRequests.values()).map(request => `
            <div class="friend-request" data-request-id="${request.id}">
                <img src="${request.avatar}" alt="${request.displayName}" class="friend-avatar">
                <div class="friend-info">
                    <h4>${request.displayName}</h4>
                    <p>Wants to be your friend</p>
                </div>
                <div class="friend-actions">
                    <button class="btn btn-success accept-request">Accept</button>
                    <button class="btn btn-danger decline-request">Decline</button>
                </div>
            </div>
        `).join('');
    }

    renderSuggestedFriends() {
        // Get suggested friends based on common interests, achievements, etc.
        const suggestions = this.getSuggestedFriends();
        
        return suggestions.map(user => `
            <div class="suggested-friend" data-user-id="${user.id}">
                <img src="${user.avatar}" alt="${user.displayName}" class="friend-avatar">
                <div class="friend-info">
                    <h4>${user.displayName}</h4>
                    <p>${user.mutualFriends} mutual friends</p>
                </div>
                <button class="btn btn-primary send-request">Add Friend</button>
            </div>
        `).join('');
    }

    renderOnlineFriends() {
        const onlineFriends = this.getOnlineFriends();
        
        if (onlineFriends.length === 0) {
            return '<p class="no-online">No friends online</p>';
        }

        return onlineFriends.map(friend => `
            <div class="online-friend">
                <img src="${friend.avatar}" alt="${friend.displayName}">
                <span class="online-indicator"></span>
            </div>
        `).join('');
    }

    getFriendProfile(friendId) {
        // In production, this would fetch from Firebase
        return {
            id: friendId,
            displayName: `Friend ${friendId.substr(0, 4)}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${friendId}`,
            status: Math.random() > 0.5 ? 'Online' : 'Offline'
        };
    }

    getSuggestedFriends() {
        // Mock suggested friends
        return Array(5).fill(0).map((_, i) => ({
            id: `suggested_${i}`,
            displayName: `User ${i + 1}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=suggested${i}`,
            mutualFriends: Math.floor(Math.random() * 10)
        }));
    }

    getOnlineFriends() {
        // Mock online friends
        return this.profileSystem.currentUser.friends
            .slice(0, 3)
            .map(id => this.getFriendProfile(id))
            .filter(friend => friend.status === 'Online');
    }

    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Accept friend request
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('accept-request')) {
                const requestId = e.target.closest('.friend-request').dataset.requestId;
                this.acceptFriendRequest(requestId);
            }
        });

        // Decline friend request
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('decline-request')) {
                const requestId = e.target.closest('.friend-request').dataset.requestId;
                this.declineFriendRequest(requestId);
            }
        });

        // Send friend request
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('send-request')) {
                const userId = e.target.closest('.suggested-friend').dataset.userId;
                this.sendFriendRequest(userId);
            }
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.friends-modal .tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        document.querySelectorAll('.friends-modal .tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }

    async sendFriendRequest(userId) {
        // In production, this would send to Firebase
        const request = {
            id: Date.now().toString(),
            from: this.profileSystem.currentUser.id,
            to: userId,
            timestamp: Date.now(),
            status: 'pending'
        };

        // Show success message
        window.toastSystem?.show('Friend request sent!', 'success');
        
        // Update UI
        const button = document.querySelector(`[data-user-id="${userId}"] .send-request`);
        if (button) {
            button.textContent = 'Request Sent';
            button.disabled = true;
        }
    }

    async acceptFriendRequest(requestId) {
        const request = this.friendRequests.get(requestId);
        if (!request) return;

        // Add to friends list
        this.profileSystem.currentUser.friends.push(request.from);
        this.profileSystem.saveProfile();

        // Remove from requests
        this.friendRequests.delete(requestId);
        this.saveFriendRequests();

        // Update UI
        this.refreshFriendsUI();

        // Show success message
        window.toastSystem?.show('Friend request accepted!', 'success');
    }

    async declineFriendRequest(requestId) {
        // Remove from requests
        this.friendRequests.delete(requestId);
        this.saveFriendRequests();

        // Update UI
        this.refreshFriendsUI();

        // Show message
        window.toastSystem?.show('Friend request declined', 'info');
    }

    saveFriendRequests() {
        const requests = Array.from(this.friendRequests.values());
        localStorage.setItem('friend_requests', JSON.stringify(requests));
    }

    refreshFriendsUI() {
        // Refresh friends list
        const friendsList = document.querySelector('.friends-list');
        if (friendsList) {
            friendsList.innerHTML = this.renderFriendsList();
        }

        // Refresh requests
        const requestsList = document.querySelector('.friend-requests');
        if (requestsList) {
            requestsList.innerHTML = this.renderFriendRequests();
        }

        // Refresh online friends
        const onlineList = document.querySelector('.online-friends');
        if (onlineList) {
            onlineList.innerHTML = this.renderOnlineFriends();
        }
    }
}

// ============================================
// 3. COMMUNITY FEATURES
// ============================================

class CommunityFeatures {
    constructor(profileSystem) {
        this.profileSystem = profileSystem;
        this.posts = new Map();
        this.init();
    }

    init() {
        this.loadCommunityPosts();
        this.setupCommunityUI();
        this.setupEventListeners();
    }

    loadCommunityPosts() {
        try {
            const saved = localStorage.getItem('community_posts');
            if (saved) {
                const posts = JSON.parse(saved);
                posts.forEach(post => this.posts.set(post.id, post));
            }
        } catch (error) {
            console.error('Error loading community posts:', error);
        }
    }

    setupCommunityUI() {
        this.createCommunityFeed();
        this.createPostComposer();
    }

    createCommunityFeed() {
        const feed = document.createElement('div');
        feed.className = 'community-feed';
        feed.innerHTML = `
            <div class="feed-header">
                <h2>Community</h2>
                <div class="feed-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="achievements">Achievements</button>
                    <button class="filter-btn" data-filter="goals">Goals</button>
                    <button class="filter-btn" data-filter="challenges">Challenges</button>
                </div>
            </div>
            
            <div class="post-composer-container"></div>
            
            <div class="feed-posts">
                ${this.renderPosts()}
            </div>
        `;

        return feed;
    }

    createPostComposer() {
        const composer = document.createElement('div');
        composer.className = 'post-composer';
        composer.innerHTML = `
            <div class="composer-header">
                <img src="${this.profileSystem.currentUser.avatar}" alt="You" class="composer-avatar">
                <textarea placeholder="Share your progress..." class="composer-input"></textarea>
            </div>
            
            <div class="composer-footer">
                <div class="composer-actions">
                    <button class="btn-icon" title="Add Image"><i class="fas fa-image"></i></button>
                    <button class="btn-icon" title="Add Poll"><i class="fas fa-poll"></i></button>
                    <button class="btn-icon" title="Tag Friends"><i class="fas fa-user-tag"></i></button>
                </div>
                <button class="btn btn-primary post-btn">Post</button>
            </div>
        `;

        return composer;
    }

    renderPosts(filter = 'all') {
        const filteredPosts = Array.from(this.posts.values())
            .filter(post => filter === 'all' || post.type === filter)
            .sort((a, b) => b.timestamp - a.timestamp);

        if (filteredPosts.length === 0) {
            return '<p class="no-posts">No posts yet. Be the first to share!</p>';
        }

        return filteredPosts.map(post => this.renderPost(post)).join('');
    }

    renderPost(post) {
        return `
            <div class="community-post" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.author.avatar}" alt="${post.author.displayName}" class="post-avatar">
                    <div class="post-meta">
                        <h4>${post.author.displayName}</h4>
                        <span class="post-time">${this.formatTime(post.timestamp)}</span>
                    </div>
                    ${post.author.id === this.profileSystem.currentUser.id ? `
                        <button class="btn-icon post-menu"><i class="fas fa-ellipsis-v"></i></button>
                    ` : ''}
                </div>
                
                <div class="post-content">
                    <p>${post.content}</p>
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                    ${post.achievement ? this.renderAchievementCard(post.achievement) : ''}
                </div>
                
                <div class="post-stats">
                    <span>${post.likes} likes</span>
                    <span>${post.comments.length} comments</span>
                </div>
                
                <div class="post-actions">
                    <button class="btn-icon like-btn ${post.liked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i> Like
                    </button>
                    <button class="btn-icon comment-btn">
                        <i class="fas fa-comment"></i> Comment
                    </button>
                    <button class="btn-icon share-btn">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
                
                <div class="post-comments">
                    ${this.renderComments(post.comments)}
                </div>
            </div>
        `;
    }

    renderAchievementCard(achievement) {
        return `
            <div class="achievement-card-mini">
                <img src="${achievement.icon}" alt="${achievement.name}">
                <div>
                    <h5>${achievement.name}</h5>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
    }

    renderComments(comments) {
        if (comments.length === 0) return '';

        return `
            <div class="comments-list">
                ${comments.slice(0, 3).map(comment => `
                    <div class="comment">
                        <img src="${comment.author.avatar}" alt="${comment.author.displayName}" class="comment-avatar">
                        <div class="comment-content">
                            <strong>${comment.author.displayName}</strong>
                            <p>${comment.content}</p>
                        </div>
                    </div>
                `).join('')}
                ${comments.length > 3 ? `<button class="view-more-comments">View ${comments.length - 3} more comments</button>` : ''}
            </div>
        `;
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return new Date(timestamp).toLocaleDateString();
    }

    setupEventListeners() {
        // Post creation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('post-btn')) {
                this.createPost();
            }
        });

        // Like post
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                const postId = e.target.closest('.community-post').dataset.postId;
                this.toggleLike(postId);
            }
        });

        // Filter posts
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.filterPosts(e.target.dataset.filter);
            }
        });
    }

    createPost() {
        const input = document.querySelector('.composer-input');
        const content = input.value.trim();
        
        if (!content) return;

        const post = {
            id: Date.now().toString(),
            author: {
                id: this.profileSystem.currentUser.id,
                displayName: this.profileSystem.currentUser.displayName,
                avatar: this.profileSystem.currentUser.avatar
            },
            content,
            timestamp: Date.now(),
            type: 'general',
            likes: 0,
            liked: false,
            comments: [],
            image: null,
            achievement: null
        };

        this.posts.set(post.id, post);
        this.savePosts();
        
        // Clear input
        input.value = '';
        
        // Refresh feed
        this.refreshFeed();
        
        // Show success message
        window.toastSystem?.show('Post created!', 'success');
    }

    toggleLike(postId) {
        const post = this.posts.get(postId);
        if (!post) return;

        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        
        this.savePosts();
        
        // Update UI
        const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
        if (likeBtn) {
            likeBtn.classList.toggle('liked');
        }
        
        const likesCount = document.querySelector(`[data-post-id="${postId}"] .post-stats span:first-child`);
        if (likesCount) {
            likesCount.textContent = `${post.likes} likes`;
        }
    }

    filterPosts(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Refresh feed with filter
        const feedPosts = document.querySelector('.feed-posts');
        if (feedPosts) {
            feedPosts.innerHTML = this.renderPosts(filter);
        }
    }

    savePosts() {
        const posts = Array.from(this.posts.values());
        localStorage.setItem('community_posts', JSON.stringify(posts));
    }

    refreshFeed() {
        const feedPosts = document.querySelector('.feed-posts');
        if (feedPosts) {
            feedPosts.innerHTML = this.renderPosts();
        }
    }
}

// ============================================
// 4. SOCIAL STYLES
// ============================================

function injectSocialStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Profile Styles */
        .profile-card {
            background: var(--bg-secondary);
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .profile-banner {
            height: 120px;
            position: relative;
        }

        .edit-profile-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
        }

        .profile-card-content {
            padding: 20px;
            text-align: center;
        }

        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 4px solid var(--bg-secondary);
            margin-top: -40px;
            background: var(--bg-primary);
        }

        .profile-stats-row {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 20px 0;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
        }

        .profile-stat {
            text-align: center;
        }

        .stat-value {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
        }

        .stat-label {
            display: block;
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        /* Friends Styles */
        .friends-modal .modal-content {
            width: 600px;
            max-width: 90vw;
        }

        .friends-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .tab-btn {
            flex: 1;
            padding: 10px;
            background: var(--bg-secondary);
            border: none;
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s;
        }

        .tab-btn.active {
            background: var(--primary-color);
            color: white;
        }

        .friend-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--bg-secondary);
            border-radius: 8px;
            margin-bottom: 8px;
        }

        .friend-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
        }

        .friend-info {
            flex: 1;
        }

        .friend-info h4 {
            margin: 0;
            font-size: 14px;
        }

        .friend-status {
            font-size: 12px;
            color: var(--text-muted);
        }

        .friend-actions {
            display: flex;
            gap: 8px;
        }

        /* Community Styles */
        .community-feed {
            max-width: 600px;
            margin: 0 auto;
        }

        .feed-filters {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
        }

        .filter-btn {
            padding: 8px 16px;
            background: var(--bg-secondary);
            border: none;
            border-radius: 20px;
            color: var(--text-primary);
            cursor: pointer;
            font-size: 14px;
        }

        .filter-btn.active {
            background: var(--primary-color);
            color: white;
        }

        .post-composer {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
        }

        .composer-header {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
        }

        .composer-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .composer-input {
            flex: 1;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
            resize: none;
            color: var(--text-primary);
        }

        .composer-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .composer-actions {
            display: flex;
            gap: 8px;
        }

        .community-post {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
        }

        .post-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .post-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .post-meta {
            flex: 1;
        }

        .post-meta h4 {
            margin: 0;
            font-size: 14px;
        }

        .post-time {
            font-size: 12px;
            color: var(--text-muted);
        }

        .post-content {
            margin-bottom: 12px;
        }

        .post-image {
            width: 100%;
            border-radius: 8px;
            margin-top: 12px;
        }

        .post-stats {
            display: flex;
            gap: 20px;
            padding: 12px 0;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
            color: var(--text-muted);
        }

        .post-actions {
            display: flex;
            gap: 8px;
            padding-top: 12px;
        }

        .like-btn.liked {
            color: #ef4444;
        }

        .comments-list {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--border-color);
        }

        .comment {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }

        .comment-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }

        .comment-content {
            flex: 1;
            background: var(--bg-primary);
            border-radius: 8px;
            padding: 8px 12px;
        }

        .comment-content strong {
            display: block;
            font-size: 13px;
            margin-bottom: 4px;
        }

        .comment-content p {
            margin: 0;
            font-size: 13px;
        }

        /* Avatar Picker */
        .avatar-picker {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .avatar-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin: 20px 0;
        }

        .avatar-option {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .avatar-option:hover {
            transform: scale(1.1);
        }

        .regenerate-avatars {
            width: 100%;
            padding: 10px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 5. INITIALIZATION
// ============================================

// Initialize social features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSocialFeatures);
} else {
    initializeSocialFeatures();
}

function initializeSocialFeatures() {
    // Inject styles first
    injectSocialStyles();
    
    // Initialize systems
    window.userProfileSystem = new UserProfileSystem();
    window.friendsSystem = new FriendsSystem(window.userProfileSystem);
    window.communityFeatures = new CommunityFeatures(window.userProfileSystem);
    
    console.log('✅ Social features initialized');
}

// Export for use in other modules
export {
    UserProfileSystem,
    FriendsSystem,
    CommunityFeatures
};
