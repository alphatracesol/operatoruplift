// Comprehensive Fixes for Deep Scan Issues
// Addresses missing CTAs, callbacks, memory leaks, and AI integration

(function() {
    'use strict';

    console.log('🔧 Applying Comprehensive Fixes...');

    // 1. Fix Missing CTAs and Callbacks
    function fixMissingCTAs() {
        console.log('🔗 Fixing missing CTAs...');

        // Journey System CTAs
        const startJourneyBtns = document.querySelectorAll('button:contains("Start Journey"), button:contains("Start a Journey")');
        startJourneyBtns.forEach(btn => {
            if (!btn.onclick) {
                btn.onclick = () => {
                    if (window.journeySystem?.showJourneySelector) {
                        window.journeySystem.showJourneySelector();
                    } else {
                        showToast('Journey system loading...', 'info');
                    }
                };
            }
        });

        // AI Chat Input
        const aiChatInput = document.getElementById('ai-chat-input');
        const aiSendBtn = document.getElementById('ai-send-btn');
        if (aiChatInput && aiSendBtn && !aiSendBtn.onclick) {
            aiSendBtn.onclick = async () => {
                const message = aiChatInput.value.trim();
                if (message) {
                    await sendAIMessage(message);
                    aiChatInput.value = '';
                }
            };
        }

        // Goal Creation
        const createGoalBtns = document.querySelectorAll('[onclick*="createGoal"], button:contains("Create Goal")');
        createGoalBtns.forEach(btn => {
            if (!btn.onclick) {
                btn.onclick = () => {
                    createViewModal({
                        view: 'goals',
                        title: 'Create New Goal',
                        content: `
                            <form id="goalForm">
                                <div class="form-group">
                                    <label>Goal Title</label>
                                    <input type="text" id="goalTitle" required>
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea id="goalDesc"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Target Date</label>
                                    <input type="date" id="goalDate">
                                </div>
                                <button type="submit" class="btn btn-primary">Create Goal</button>
                            </form>
                        `
                    });
                };
            }
        });

        // Wallet Connect
        const connectWalletBtns = document.querySelectorAll('[onclick*="connectWallet"], button:contains("Connect Wallet")');
        connectWalletBtns.forEach(btn => {
            if (!btn.onclick) {
                btn.onclick = async () => {
                    if (window.connectPhantomWallet) {
                        await window.connectPhantomWallet();
                    } else {
                        showToast('Wallet connection not available', 'error');
                    }
                };
            }
        });

        // Fix form submissions
        const forms = document.querySelectorAll('form:not([data-handled])');
        forms.forEach(form => {
            form.setAttribute('data-handled', 'true');
            form.onsubmit = (e) => {
                e.preventDefault();
                handleFormSubmit(form);
            };
        });
    }

    // 2. Fix Memory Leaks
    function fixMemoryLeaks() {
        console.log('🧹 Fixing memory leaks...');

        // Clean up intervals
        const intervals = new Set();
        const originalSetInterval = window.setInterval;
        window.setInterval = function(fn, delay) {
            const id = originalSetInterval(fn, delay);
            intervals.add(id);
            return id;
        };

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            intervals.forEach(id => clearInterval(id));
        });

        // Remove global DOM references
        const globalKeys = Object.keys(window);
        globalKeys.forEach(key => {
            try {
                const value = window[key];
                if (value && value.nodeType === 1 && !key.startsWith('HTML')) {
                    console.log(`Removing global DOM reference: ${key}`);
                    delete window[key];
                }
            } catch (e) {
                // Skip
            }
        });

        // Add cleanup for event listeners
        const cleanupFunctions = [];
        window.addCleanupFunction = (fn) => cleanupFunctions.push(fn);
        
        window.addEventListener('beforeunload', () => {
            cleanupFunctions.forEach(fn => fn());
        });
    }

    // 3. Fix Data Leaks
    function fixDataLeaks() {
        console.log('🔐 Fixing data leaks...');

        // Encrypt sensitive data in localStorage
        const sensitiveKeys = ['authToken', 'apiKey', 'privateKey'];
        sensitiveKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value && !value.startsWith('encrypted:')) {
                // Simple obfuscation (in production, use proper encryption)
                const encrypted = 'encrypted:' + btoa(value);
                localStorage.setItem(key, encrypted);
            }
        });

        // Remove API keys from global scope
        const globalKeys = Object.keys(window);
        globalKeys.forEach(key => {
            if (key.toLowerCase().includes('api') || key.toLowerCase().includes('key')) {
                if (typeof window[key] === 'string') {
                    console.log(`Removing exposed key: ${key}`);
                    delete window[key];
                }
            }
        });
    }

    // 4. Enhance AI Integration
    function enhanceAIIntegration() {
        console.log('🤖 Enhancing AI integration...');

        // Initialize AI coaching if not present
        if (!window.aiCoaching && window.AICoaching) {
            window.aiCoaching = new AICoaching();
            console.log('✅ Initialized AI Coaching');
        }

        // Add AI personalization
        if (!localStorage.getItem('aiPersonality')) {
            localStorage.setItem('aiPersonality', JSON.stringify({
                style: 'supportive',
                tone: 'friendly',
                expertise: ['productivity', 'motivation', 'habits'],
                userPreferences: {
                    responseLength: 'medium',
                    emoji: true,
                    examples: true
                }
            }));
        }

        // Enhance AI chat functionality
        window.sendAIMessage = async function(message) {
            const chatContainer = document.getElementById('ai-chat-messages');
            if (!chatContainer) return;

            // Add user message
            addChatMessage(message, 'user');

            // Show typing indicator
            const typingIndicator = addChatMessage('...', 'ai', 'typing');

            try {
                // Get AI response
                let response;
                if (window.aiAssistant?.getResponse) {
                    response = await window.aiAssistant.getResponse(message);
                } else {
                    // Fallback response
                    response = await getAIResponse(message);
                }

                // Remove typing indicator
                typingIndicator.remove();

                // Add AI response
                addChatMessage(response, 'ai');

                // Update AI insights
                updateAIInsights(message, response);

            } catch (error) {
                typingIndicator.remove();
                addChatMessage('Sorry, I encountered an error. Please try again.', 'ai', 'error');
                console.error('AI Error:', error);
            }
        };

        // Add daily AI tip
        function showDailyAITip() {
            const tipContainer = document.getElementById('dailyCoachingTip');
            if (!tipContainer) return;

            const tips = [
                "🎯 Focus on one task at a time for maximum productivity!",
                "💪 Take a 5-minute break every 25 minutes to stay fresh.",
                "🌟 Celebrate small wins - they lead to big achievements!",
                "🧘 Start your day with 5 minutes of meditation.",
                "📝 Write down your top 3 priorities each morning."
            ];

            const tip = tips[Math.floor(Math.random() * tips.length)];
            tipContainer.innerHTML = `<p class="ai-tip">${tip}</p>`;
        }

        showDailyAITip();
        setInterval(showDailyAITip, 60000); // Change tip every minute
    }

    // 5. Add Personalization Features
    function addPersonalization() {
        console.log('👤 Adding personalization...');

        // Initialize user profile
        let userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (!userProfile.id) {
            userProfile = {
                id: 'user_' + Date.now(),
                name: 'Operator',
                level: 1,
                xp: 0,
                personality: determinePersonality(),
                preferences: {
                    theme: 'dark',
                    notifications: true,
                    soundEffects: true,
                    language: 'en'
                },
                stats: {
                    totalFocusTime: 0,
                    tasksCompleted: 0,
                    currentStreak: 0,
                    longestStreak: 0
                }
            };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }

        // Add personality badge
        const userInfo = document.querySelector('.user-info');
        if (userInfo && !document.querySelector('.personality-badge')) {
            const badge = document.createElement('div');
            badge.className = 'personality-badge';
            badge.innerHTML = `<span class="badge-icon">🎭</span> ${userProfile.personality}`;
            userInfo.appendChild(badge);
        }

        // Personalize greetings
        const greetings = {
            morning: ['Good morning', 'Rise and shine', 'Ready to conquer the day'],
            afternoon: ['Good afternoon', 'Keep up the momentum', 'Halfway there'],
            evening: ['Good evening', 'Time to wind down', 'Reflect on your progress']
        };

        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        const greeting = greetings[timeOfDay][Math.floor(Math.random() * greetings[timeOfDay].length)];

        const welcomeCard = document.querySelector('.card h3:contains("Welcome")');
        if (welcomeCard) {
            welcomeCard.textContent = `${greeting}, ${userProfile.name}!`;
        }
    }

    // Helper Functions
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function addChatMessage(message, sender, className = '') {
        const chatContainer = document.getElementById('ai-chat-messages');
        if (!chatContainer) return null;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender} ${className}`;
        messageEl.innerHTML = `
            <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        return messageEl;
    }

    async function getAIResponse(message) {
        // Simulate AI response (replace with actual AI call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const responses = {
            'hello': "Hello! I'm here to help you stay productive and achieve your goals. What would you like to work on today?",
            'help': "I can help you with:\n• Setting and tracking goals\n• Building positive habits\n• Staying focused\n• Managing your time\n• Providing motivation\n\nWhat interests you most?",
            'default': "That's interesting! Let me help you explore that further. Can you tell me more about what you're trying to achieve?"
        };

        const lowercaseMsg = message.toLowerCase();
        for (let key in responses) {
            if (lowercaseMsg.includes(key)) {
                return responses[key];
            }
        }
        
        return responses.default;
    }

    function updateAIInsights(userMessage, aiResponse) {
        // Track conversation for insights
        const conversations = JSON.parse(localStorage.getItem('aiConversations') || '[]');
        conversations.push({
            timestamp: Date.now(),
            user: userMessage,
            ai: aiResponse
        });
        
        // Keep last 100 conversations
        if (conversations.length > 100) {
            conversations.splice(0, conversations.length - 100);
        }
        
        localStorage.setItem('aiConversations', JSON.stringify(conversations));
    }

    function determinePersonality() {
        // Simple personality determination (enhance with actual assessment)
        const types = ['Explorer', 'Achiever', 'Socializer', 'Creator'];
        return types[Math.floor(Math.random() * types.length)];
    }

    function handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', form.id, data);
        
        // Handle specific forms
        if (form.id === 'goalForm') {
            createGoal(data);
        } else if (form.id === 'habitForm') {
            createHabit(data);
        }
        
        // Close modal if in one
        const modal = form.closest('.modal, .view-modal');
        if (modal) {
            modal.remove();
        }
        
        showToast('Saved successfully!', 'success');
    }

    function createGoal(data) {
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        goals.push({
            id: 'goal_' + Date.now(),
            ...data,
            createdAt: Date.now(),
            status: 'active'
        });
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    function createHabit(data) {
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        habits.push({
            id: 'habit_' + Date.now(),
            ...data,
            createdAt: Date.now(),
            streak: 0
        });
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    // Add styles for fixes
    const styles = `
        <style id="comprehensive-fix-styles">
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10000;
        }

        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }

        .toast-success {
            border-left: 4px solid #4caf50;
        }

        .toast-error {
            border-left: 4px solid #f44336;
        }

        .toast-info {
            border-left: 4px solid #2196f3;
        }

        .personality-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
            padding: 0.25rem 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            font-size: 0.85rem;
        }

        .chat-message {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            animation: slideIn 0.3s ease;
        }

        .chat-message.user {
            flex-direction: row-reverse;
        }

        .message-content {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.75rem 1rem;
            border-radius: 12px;
            max-width: 70%;
        }

        .message-time {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }

        .ai-tip {
            padding: 1rem;
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
            border-radius: 8px;
            border-left: 3px solid var(--primary-color);
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        </style>
    `;

    // Initialize all fixes
    function initializeFixes() {
        console.log('🚀 Initializing comprehensive fixes...');
        
        // Add styles
        if (!document.getElementById('comprehensive-fix-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        // Apply all fixes
        fixMissingCTAs();
        fixMemoryLeaks();
        fixDataLeaks();
        enhanceAIIntegration();
        addPersonalization();
        
        console.log('✅ Comprehensive fixes applied');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFixes);
    } else {
        setTimeout(initializeFixes, 100);
    }

    // Make functions globally available
    window.comprehensiveFixes = {
        fixMissingCTAs,
        fixMemoryLeaks,
        fixDataLeaks,
        enhanceAIIntegration,
        addPersonalization,
        showToast
    };
})();
