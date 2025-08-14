/**
 * Collaboration Features System
 * Shared goals, accountability partners, team challenges, and peer support
 */

window.CollaborationSystem = {
    // Collaboration data
    data: {
        sharedGoals: [],
        accountabilityPartners: [],
        teamChallenges: [],
        collaborativeProjects: [],
        groupLeaderboards: {},
        peerMessages: []
    },

    // Current user's collaborations
    userCollaborations: {
        partnerId: null,
        teamIds: [],
        sharedGoalIds: [],
        activeProjects: []
    },

    // Initialize collaboration system
    initialize() {
        this.loadCollaborationData();
        this.setupRealtimeSync();
        this.setupEventListeners();
        this.checkPendingInvites();
    },

    // Load collaboration data
    loadCollaborationData() {
        const saved = localStorage.getItem('collaborationData');
        if (saved) {
            Object.assign(this.data, JSON.parse(saved));
        }
        
        const userCollab = localStorage.getItem('userCollaborations');
        if (userCollab) {
            Object.assign(this.userCollaborations, JSON.parse(userCollab));
        }
    },

    // Save collaboration data
    saveCollaborationData() {
        localStorage.setItem('collaborationData', JSON.stringify(this.data));
        localStorage.setItem('userCollaborations', JSON.stringify(this.userCollaborations));
    },

    // Setup real-time sync
    setupRealtimeSync() {
        // In production, this would use WebSocket or Firebase
        // For now, use polling
        setInterval(() => {
            this.syncCollaborationData();
        }, 30000); // Every 30 seconds
    },

    // Sync collaboration data
    async syncCollaborationData() {
        // In production, sync with backend
        // For now, just check for updates in localStorage
        this.checkForUpdates();
    },

    // Create shared goal
    createSharedGoal(goalData, partnerIds) {
        const sharedGoal = {
            id: `shared_${Date.now()}`,
            ...goalData,
            createdBy: this.getCurrentUserId(),
            participants: [this.getCurrentUserId(), ...partnerIds],
            progress: {},
            messages: [],
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        // Initialize progress for each participant
        sharedGoal.participants.forEach(userId => {
            sharedGoal.progress[userId] = {
                tasksCompleted: 0,
                contribution: 0,
                lastActive: new Date().toISOString()
            };
        });
        
        this.data.sharedGoals.push(sharedGoal);
        this.userCollaborations.sharedGoalIds.push(sharedGoal.id);
        this.saveCollaborationData();
        
        // Notify participants
        this.notifyParticipants(partnerIds, {
            type: 'shared_goal_invite',
            goalId: sharedGoal.id,
            goalTitle: goalData.title
        });
        
        window.showToast('Shared goal created!', 'success');
        return sharedGoal;
    },

    // Set accountability partner
    async setAccountabilityPartner(partnerId) {
        // Check if partner exists
        const partner = await this.getUserInfo(partnerId);
        if (!partner) {
            window.showToast('Partner not found', 'error');
            return;
        }
        
        // Create partnership
        const partnership = {
            id: `partner_${Date.now()}`,
            users: [this.getCurrentUserId(), partnerId],
            startDate: new Date().toISOString(),
            checkInSchedule: 'daily', // daily, weekly, custom
            sharedMetrics: ['tasks', 'goals', 'streaks'],
            messages: [],
            status: 'pending'
        };
        
        this.data.accountabilityPartners.push(partnership);
        this.userCollaborations.partnerId = partnership.id;
        this.saveCollaborationData();
        
        // Send invitation
        this.sendPartnerInvite(partnerId, partnership.id);
        
        window.showToast('Partnership request sent!', 'success');
        return partnership;
    },

    // Create team challenge
    createTeamChallenge(challengeData) {
        const challenge = {
            id: `challenge_${Date.now()}`,
            ...challengeData,
            createdBy: this.getCurrentUserId(),
            teams: {},
            leaderboard: [],
            startDate: challengeData.startDate || new Date().toISOString(),
            endDate: challengeData.endDate,
            rewards: challengeData.rewards || {
                first: 1000,
                second: 500,
                third: 250
            },
            status: 'recruiting'
        };
        
        this.data.teamChallenges.push(challenge);
        this.saveCollaborationData();
        
        // Announce challenge
        this.announceChallenge(challenge);
        
        window.showToast('Team challenge created!', 'success');
        return challenge;
    },

    // Join team challenge
    joinTeamChallenge(challengeId, teamName = null) {
        const challenge = this.data.teamChallenges.find(c => c.id === challengeId);
        if (!challenge) {
            window.showToast('Challenge not found', 'error');
            return;
        }
        
        const userId = this.getCurrentUserId();
        
        // Create or join team
        if (teamName) {
            // Create new team
            if (!challenge.teams[teamName]) {
                challenge.teams[teamName] = {
                    members: [],
                    score: 0,
                    achievements: []
                };
            }
            challenge.teams[teamName].members.push(userId);
        } else {
            // Join smallest team for balance
            const smallestTeam = this.findSmallestTeam(challenge);
            if (smallestTeam) {
                challenge.teams[smallestTeam].members.push(userId);
            }
        }
        
        this.userCollaborations.teamIds.push(challengeId);
        this.saveCollaborationData();
        
        window.showToast('Joined challenge!', 'success');
        this.updateChallengeLeaderboard(challengeId);
    },

    // Create collaborative project
    createCollaborativeProject(projectData) {
        const project = {
            id: `project_${Date.now()}`,
            ...projectData,
            owner: this.getCurrentUserId(),
            members: [this.getCurrentUserId()],
            tasks: [],
            milestones: projectData.milestones || [],
            resources: [],
            discussions: [],
            progress: 0,
            status: 'planning',
            createdAt: new Date().toISOString()
        };
        
        this.data.collaborativeProjects.push(project);
        this.userCollaborations.activeProjects.push(project.id);
        this.saveCollaborationData();
        
        window.showToast('Project created!', 'success');
        return project;
    },

    // Add member to project
    addProjectMember(projectId, userId, role = 'contributor') {
        const project = this.data.collaborativeProjects.find(p => p.id === projectId);
        if (!project) return;
        
        if (project.members.includes(userId)) {
            window.showToast('User already in project', 'warning');
            return;
        }
        
        project.members.push(userId);
        
        // Assign role
        if (!project.roles) project.roles = {};
        project.roles[userId] = role;
        
        this.saveCollaborationData();
        
        // Notify new member
        this.notifyUser(userId, {
            type: 'project_invite',
            projectId: project.id,
            projectTitle: project.title,
            role: role
        });
        
        window.showToast('Member added to project', 'success');
    },

    // Update shared goal progress
    updateSharedGoalProgress(goalId, progress) {
        const goal = this.data.sharedGoals.find(g => g.id === goalId);
        if (!goal) return;
        
        const userId = this.getCurrentUserId();
        
        // Update user's progress
        if (!goal.progress[userId]) {
            goal.progress[userId] = {
                tasksCompleted: 0,
                contribution: 0,
                lastActive: new Date().toISOString()
            };
        }
        
        goal.progress[userId].tasksCompleted += progress.tasksCompleted || 0;
        goal.progress[userId].contribution += progress.contribution || 0;
        goal.progress[userId].lastActive = new Date().toISOString();
        
        // Calculate overall progress
        const totalProgress = Object.values(goal.progress).reduce((sum, p) => 
            sum + p.contribution, 0
        );
        
        goal.overallProgress = Math.min(100, totalProgress);
        
        // Check if goal completed
        if (goal.overallProgress >= 100 && goal.status === 'active') {
            this.completeSharedGoal(goalId);
        }
        
        this.saveCollaborationData();
        
        // Notify participants
        this.notifyGoalParticipants(goalId, {
            type: 'progress_update',
            userId: userId,
            progress: progress
        });
    },

    // Send peer support message
    sendPeerSupportMessage(recipientId, message, context = {}) {
        const supportMessage = {
            id: `msg_${Date.now()}`,
            from: this.getCurrentUserId(),
            to: recipientId,
            message: message,
            context: context, // e.g., related to specific goal, challenge, etc.
            timestamp: new Date().toISOString(),
            read: false
        };
        
        this.data.peerMessages.push(supportMessage);
        this.saveCollaborationData();
        
        // Notify recipient
        if (window.NotificationSystem) {
            window.NotificationSystem.send(
                'Peer Support Message',
                message,
                {
                    category: 'social',
                    data: { messageId: supportMessage.id }
                }
            );
        }
        
        return supportMessage;
    },

    // Check in with accountability partner
    checkInWithPartner() {
        if (!this.userCollaborations.partnerId) {
            window.showToast('No accountability partner set', 'info');
            return;
        }
        
        const partnership = this.data.accountabilityPartners.find(
            p => p.id === this.userCollaborations.partnerId
        );
        
        if (!partnership) return;
        
        // Create check-in
        const checkIn = {
            userId: this.getCurrentUserId(),
            timestamp: new Date().toISOString(),
            metrics: this.gatherCheckInMetrics(),
            mood: this.getCurrentMood(),
            notes: ''
        };
        
        if (!partnership.checkIns) partnership.checkIns = [];
        partnership.checkIns.push(checkIn);
        
        this.saveCollaborationData();
        
        // Notify partner
        const partnerId = partnership.users.find(id => id !== this.getCurrentUserId());
        this.notifyUser(partnerId, {
            type: 'partner_checkin',
            checkIn: checkIn
        });
        
        window.showToast('Check-in sent to partner!', 'success');
    },

    // Update team challenge score
    updateChallengeScore(challengeId, points) {
        const challenge = this.data.teamChallenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        const userId = this.getCurrentUserId();
        const userTeam = this.findUserTeam(challenge, userId);
        
        if (!userTeam) {
            window.showToast('You are not in this challenge', 'error');
            return;
        }
        
        // Update team score
        challenge.teams[userTeam].score += points;
        
        // Update individual contribution
        if (!challenge.teams[userTeam].contributions) {
            challenge.teams[userTeam].contributions = {};
        }
        challenge.teams[userTeam].contributions[userId] = 
            (challenge.teams[userTeam].contributions[userId] || 0) + points;
        
        // Update leaderboard
        this.updateChallengeLeaderboard(challengeId);
        
        this.saveCollaborationData();
        
        // Check for achievements
        this.checkChallengeAchievements(challengeId, userTeam);
    },

    // Update challenge leaderboard
    updateChallengeLeaderboard(challengeId) {
        const challenge = this.data.teamChallenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        // Calculate team rankings
        const rankings = Object.entries(challenge.teams)
            .map(([teamName, team]) => ({
                name: teamName,
                score: team.score,
                members: team.members.length
            }))
            .sort((a, b) => b.score - a.score);
        
        challenge.leaderboard = rankings;
        
        // Update group leaderboard
        if (!this.data.groupLeaderboards[challengeId]) {
            this.data.groupLeaderboards[challengeId] = [];
        }
        
        this.data.groupLeaderboards[challengeId] = rankings;
        
        this.saveCollaborationData();
        
        // Notify participants of ranking changes
        this.notifyChallengeParticipants(challengeId, {
            type: 'leaderboard_update',
            rankings: rankings
        });
    },

    // Render collaboration dashboard
    renderCollaborationDashboard() {
        return `
            <div class="collaboration-dashboard">
                <h2>Collaboration Hub</h2>
                
                <div class="collaboration-sections">
                    <!-- Accountability Partner -->
                    <div class="section-card">
                        <h3>👥 Accountability Partner</h3>
                        ${this.renderAccountabilityPartner()}
                    </div>
                    
                    <!-- Shared Goals -->
                    <div class="section-card">
                        <h3>🎯 Shared Goals</h3>
                        ${this.renderSharedGoals()}
                    </div>
                    
                    <!-- Team Challenges -->
                    <div class="section-card">
                        <h3>🏆 Team Challenges</h3>
                        ${this.renderTeamChallenges()}
                    </div>
                    
                    <!-- Collaborative Projects -->
                    <div class="section-card">
                        <h3>📁 Collaborative Projects</h3>
                        ${this.renderProjects()}
                    </div>
                    
                    <!-- Peer Support -->
                    <div class="section-card">
                        <h3>💬 Peer Support</h3>
                        ${this.renderPeerSupport()}
                    </div>
                </div>
            </div>
        `;
    },

    // Render accountability partner section
    renderAccountabilityPartner() {
        if (!this.userCollaborations.partnerId) {
            return `
                <div class="empty-state">
                    <p>No accountability partner yet</p>
                    <button class="btn btn-primary" onclick="CollaborationSystem.showPartnerSearch()">
                        Find Partner
                    </button>
                </div>
            `;
        }
        
        const partnership = this.data.accountabilityPartners.find(
            p => p.id === this.userCollaborations.partnerId
        );
        
        if (!partnership) return '';
        
        const partnerId = partnership.users.find(id => id !== this.getCurrentUserId());
        const lastCheckIn = partnership.checkIns?.[partnership.checkIns.length - 1];
        
        return `
            <div class="partner-info">
                <div class="partner-header">
                    <div class="partner-avatar">👤</div>
                    <div class="partner-details">
                        <h4>Partner: ${this.getUserName(partnerId)}</h4>
                        <p>Since: ${new Date(partnership.startDate).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div class="partner-stats">
                    <div class="stat">
                        <span class="label">Check-ins</span>
                        <span class="value">${partnership.checkIns?.length || 0}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Last Check-in</span>
                        <span class="value">${lastCheckIn ? 
                            this.formatRelativeTime(lastCheckIn.timestamp) : 'Never'}</span>
                    </div>
                </div>
                
                <div class="partner-actions">
                    <button class="btn btn-primary" onclick="CollaborationSystem.checkInWithPartner()">
                        Check In
                    </button>
                    <button class="btn btn-secondary" onclick="CollaborationSystem.messagePartner()">
                        Send Message
                    </button>
                </div>
            </div>
        `;
    },

    // Render shared goals
    renderSharedGoals() {
        const userGoals = this.data.sharedGoals.filter(g => 
            g.participants.includes(this.getCurrentUserId())
        );
        
        if (userGoals.length === 0) {
            return `
                <div class="empty-state">
                    <p>No shared goals yet</p>
                    <button class="btn btn-primary" onclick="CollaborationSystem.showCreateSharedGoal()">
                        Create Shared Goal
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="shared-goals-list">
                ${userGoals.map(goal => `
                    <div class="shared-goal-item">
                        <div class="goal-header">
                            <h4>${goal.title}</h4>
                            <span class="participants-count">
                                👥 ${goal.participants.length}
                            </span>
                        </div>
                        <div class="goal-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${goal.overallProgress || 0}%"></div>
                            </div>
                            <span class="progress-text">${goal.overallProgress || 0}%</span>
                        </div>
                        <div class="goal-contributors">
                            ${Object.entries(goal.progress || {}).map(([userId, progress]) => `
                                <div class="contributor">
                                    <span>${this.getUserName(userId)}</span>
                                    <span>${progress.contribution}%</span>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-sm" onclick="CollaborationSystem.updateGoalProgress('${goal.id}')">
                            Update Progress
                        </button>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="CollaborationSystem.showCreateSharedGoal()">
                Create New Shared Goal
            </button>
        `;
    },

    // Render team challenges
    renderTeamChallenges() {
        const activeChallenges = this.data.teamChallenges.filter(c => 
            c.status === 'active' || c.status === 'recruiting'
        );
        
        if (activeChallenges.length === 0) {
            return `
                <div class="empty-state">
                    <p>No active challenges</p>
                    <button class="btn btn-primary" onclick="CollaborationSystem.showCreateChallenge()">
                        Create Challenge
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="challenges-list">
                ${activeChallenges.map(challenge => {
                    const userTeam = this.findUserTeam(challenge, this.getCurrentUserId());
                    const isParticipating = userTeam !== null;
                    
                    return `
                        <div class="challenge-item ${isParticipating ? 'participating' : ''}">
                            <div class="challenge-header">
                                <h4>${challenge.title}</h4>
                                <span class="challenge-status">${challenge.status}</span>
                            </div>
                            <div class="challenge-info">
                                <span>Teams: ${Object.keys(challenge.teams).length}</span>
                                <span>Ends: ${new Date(challenge.endDate).toLocaleDateString()}</span>
                            </div>
                            ${challenge.leaderboard.length > 0 ? `
                                <div class="challenge-leaderboard">
                                    ${challenge.leaderboard.slice(0, 3).map((team, index) => `
                                        <div class="leaderboard-item ${userTeam === team.name ? 'user-team' : ''}">
                                            <span class="rank">#${index + 1}</span>
                                            <span class="team-name">${team.name}</span>
                                            <span class="score">${team.score}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${!isParticipating ? `
                                <button class="btn btn-primary" onclick="CollaborationSystem.joinTeamChallenge('${challenge.id}')">
                                    Join Challenge
                                </button>
                            ` : `
                                <button class="btn btn-secondary" onclick="CollaborationSystem.contributeToChallengeO('${challenge.id}')">
                                    Contribute Points
                                </button>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // Render collaborative projects
    renderProjects() {
        const userProjects = this.data.collaborativeProjects.filter(p => 
            p.members.includes(this.getCurrentUserId())
        );
        
        if (userProjects.length === 0) {
            return `
                <div class="empty-state">
                    <p>No active projects</p>
                    <button class="btn btn-primary" onclick="CollaborationSystem.showCreateProject()">
                        Start Project
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="projects-list">
                ${userProjects.map(project => `
                    <div class="project-item">
                        <div class="project-header">
                            <h4>${project.title}</h4>
                            <span class="project-status">${project.status}</span>
                        </div>
                        <div class="project-info">
                            <span>Members: ${project.members.length}</span>
                            <span>Tasks: ${project.tasks.length}</span>
                            <span>Progress: ${project.progress}%</span>
                        </div>
                        <div class="project-actions">
                            <button class="btn btn-sm" onclick="CollaborationSystem.openProject('${project.id}')">
                                Open Project
                            </button>
                            ${project.owner === this.getCurrentUserId() ? `
                                <button class="btn btn-sm" onclick="CollaborationSystem.inviteToProject('${project.id}')">
                                    Invite Members
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Render peer support
    renderPeerSupport() {
        const recentMessages = this.data.peerMessages
            .filter(m => m.to === this.getCurrentUserId() || m.from === this.getCurrentUserId())
            .slice(-5);
        
        return `
            <div class="peer-support-section">
                <div class="support-messages">
                    ${recentMessages.length > 0 ? recentMessages.map(msg => `
                        <div class="support-message ${msg.from === this.getCurrentUserId() ? 'sent' : 'received'}">
                            <div class="message-header">
                                <span>${this.getUserName(msg.from === this.getCurrentUserId() ? msg.to : msg.from)}</span>
                                <span>${this.formatRelativeTime(msg.timestamp)}</span>
                            </div>
                            <p>${msg.message}</p>
                        </div>
                    `).join('') : '<p>No messages yet</p>'}
                </div>
                <div class="support-actions">
                    <button class="btn btn-primary" onclick="CollaborationSystem.showSendSupport()">
                        Send Support Message
                    </button>
                    <button class="btn btn-secondary" onclick="CollaborationSystem.requestSupport()">
                        Request Support
                    </button>
                </div>
            </div>
        `;
    },

    // Helper functions
    getCurrentUserId() {
        return localStorage.getItem('userId') || 'user_' + Date.now();
    },

    getUserName(userId) {
        // In production, fetch from user database
        return `User ${userId.slice(-4)}`;
    },

    async getUserInfo(userId) {
        // In production, fetch from backend
        return {
            id: userId,
            name: this.getUserName(userId),
            avatar: '👤'
        };
    },

    findUserTeam(challenge, userId) {
        for (const [teamName, team] of Object.entries(challenge.teams)) {
            if (team.members.includes(userId)) {
                return teamName;
            }
        }
        return null;
    },

    findSmallestTeam(challenge) {
        let smallestTeam = null;
        let minSize = Infinity;
        
        for (const [teamName, team] of Object.entries(challenge.teams)) {
            if (team.members.length < minSize) {
                minSize = team.members.length;
                smallestTeam = teamName;
            }
        }
        
        return smallestTeam;
    },

    formatRelativeTime(timestamp) {
        const date = new Date(timestamp);
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

    gatherCheckInMetrics() {
        return {
            tasksCompleted: parseInt(localStorage.getItem('tasksCompletedToday') || '0'),
            focusMinutes: parseInt(localStorage.getItem('focusMinutesToday') || '0'),
            currentStreak: parseInt(localStorage.getItem('currentStreak') || '0'),
            mood: this.getCurrentMood()
        };
    },

    getCurrentMood() {
        const moods = JSON.parse(localStorage.getItem('moodHistory') || '{}');
        const today = new Date().toISOString().split('T')[0];
        return moods[today]?.value || 3;
    },

    // Notification functions
    notifyParticipants(userIds, notification) {
        userIds.forEach(userId => {
            this.notifyUser(userId, notification);
        });
    },

    notifyUser(userId, notification) {
        // In production, send via backend
        console.log(`Notifying ${userId}:`, notification);
        
        // Store notification locally
        const notifications = JSON.parse(localStorage.getItem('collaborationNotifications') || '[]');
        notifications.push({
            ...notification,
            to: userId,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('collaborationNotifications', JSON.stringify(notifications));
    },

    notifyGoalParticipants(goalId, notification) {
        const goal = this.data.sharedGoals.find(g => g.id === goalId);
        if (goal) {
            const otherParticipants = goal.participants.filter(id => id !== this.getCurrentUserId());
            this.notifyParticipants(otherParticipants, notification);
        }
    },

    notifyChallengeParticipants(challengeId, notification) {
        const challenge = this.data.teamChallenges.find(c => c.id === challengeId);
        if (challenge) {
            const allParticipants = [];
            Object.values(challenge.teams).forEach(team => {
                allParticipants.push(...team.members);
            });
            const uniqueParticipants = [...new Set(allParticipants)];
            this.notifyParticipants(uniqueParticipants, notification);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for collaboration events
        document.addEventListener('goalCompleted', (e) => {
            // Check if it's a shared goal
            const goalId = e.detail.goalId;
            const sharedGoal = this.data.sharedGoals.find(g => g.id === goalId);
            if (sharedGoal) {
                this.updateSharedGoalProgress(goalId, {
                    tasksCompleted: 1,
                    contribution: 10
                });
            }
        });

        document.addEventListener('taskCompleted', (e) => {
            // Update challenge scores if in active challenge
            this.userCollaborations.teamIds.forEach(challengeId => {
                this.updateChallengeScore(challengeId, 5);
            });
        });
    },

    // Check for pending invites
    checkPendingInvites() {
        const notifications = JSON.parse(localStorage.getItem('collaborationNotifications') || '[]');
        const pending = notifications.filter(n => 
            n.to === this.getCurrentUserId() && !n.responded
        );
        
        if (pending.length > 0) {
            pending.forEach(invite => {
                this.showInviteNotification(invite);
            });
        }
    },

    showInviteNotification(invite) {
        if (window.NotificationSystem) {
            let title = 'Collaboration Invite';
            let message = '';
            
            switch (invite.type) {
                case 'shared_goal_invite':
                    message = `You've been invited to collaborate on: ${invite.goalTitle}`;
                    break;
                case 'partner_request':
                    message = `${this.getUserName(invite.from)} wants to be your accountability partner`;
                    break;
                case 'project_invite':
                    message = `You've been invited to join: ${invite.projectTitle}`;
                    break;
            }
            
            window.NotificationSystem.send(title, message, {
                category: 'social',
                data: invite,
                actions: [
                    { id: 'accept', title: 'Accept' },
                    { id: 'decline', title: 'Decline' }
                ]
            });
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.CollaborationSystem.initialize());
} else {
    window.CollaborationSystem.initialize();
}
