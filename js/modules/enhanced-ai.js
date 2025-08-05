/**
 * Phase 3.1: Enhanced AI Module
 * Provides advanced AI capabilities including context-aware responses,
 * emotional intelligence, and adaptive learning algorithms.
 */

class EnhancedAI {
    constructor() {
        this.contextMemory = [];
        this.emotionalState = null;
        this.conversationHistory = [];
        this.userIntent = null;
        this.responseGenerator = null;
        this.emotionalAnalyzer = null;
        this.contextProcessor = null;
        this.learningEngine = null;
        
        console.log('🚀 Enhanced AI module initialized');
        this.initialize();
    }

    initialize() {
        try {
            this.initializeContextProcessor();
            this.initializeEmotionalAnalyzer();
            this.initializeResponseGenerator();
            this.initializeLearningEngine();
            this.loadConversationHistory();
            console.log('✅ Enhanced AI module fully initialized');
        } catch (error) {
            console.error('❌ Error initializing Enhanced AI:', error);
        }
    }

    initializeContextProcessor() {
        this.contextProcessor = {
            currentContext: {
                userState: 'active',
                currentView: 'dashboard',
                recentActions: [],
                timeOfDay: this.getTimeOfDay(),
                userMood: 'neutral',
                sessionDuration: 0
            },
            
            updateContext: (newContext) => {
                this.contextProcessor.currentContext = {
                    ...this.contextProcessor.currentContext,
                    ...newContext,
                    timestamp: new Date().toISOString()
                };
                this.contextMemory.push(this.contextProcessor.currentContext);
                
                // Keep only last 50 context entries
                if (this.contextMemory.length > 50) {
                    this.contextMemory = this.contextMemory.slice(-50);
                }
            },
            
            getCurrentContext: () => {
                return this.contextProcessor.currentContext;
            },
            
            analyzeContextPatterns: () => {
                return this.analyzeContextPatterns();
            }
        };
    }

    initializeEmotionalAnalyzer() {
        this.emotionalAnalyzer = {
            emotionalStates: {
                happy: { keywords: ['great', 'awesome', 'excellent', 'love', 'amazing'], weight: 1.0 },
                satisfied: { keywords: ['good', 'nice', 'okay', 'fine', 'alright'], weight: 0.8 },
                neutral: { keywords: ['neutral', 'normal', 'standard'], weight: 0.5 },
                frustrated: { keywords: ['frustrated', 'annoyed', 'difficult', 'problem'], weight: -0.3 },
                stressed: { keywords: ['stressed', 'overwhelmed', 'busy', 'tired'], weight: -0.5 },
                excited: { keywords: ['excited', 'thrilled', 'motivated', 'energized'], weight: 1.2 }
            },
            
            analyzeEmotionalState: (text) => {
                return this.analyzeEmotionalState(text);
            },
            
            trackEmotionalTrends: () => {
                return this.trackEmotionalTrends();
            },
            
            generateEmotionalResponse: (emotionalState) => {
                return this.generateEmotionalResponse(emotionalState);
            }
        };
    }

    initializeResponseGenerator() {
        this.responseGenerator = {
            responseTemplates: {
                greeting: {
                    morning: ['Good morning! Ready to tackle your goals?', 'Rise and shine! Let\'s make today productive!'],
                    afternoon: ['Good afternoon! How are your goals progressing?', 'Afternoon! Time to check in on your progress!'],
                    evening: ['Good evening! How did your day go?', 'Evening! Let\'s review your achievements!'],
                    night: ['Late night session! Don\'t forget to rest!', 'Working late? Remember to take breaks!']
                },
                motivation: {
                    high: ['You\'re on fire! Keep up the amazing work!', 'Incredible progress! You\'re unstoppable!'],
                    medium: ['You\'re doing great! Keep pushing forward!', 'Steady progress! You\'ve got this!'],
                    low: ['Every step counts! Let\'s get back on track!', 'It\'s okay to have slow days. Tomorrow is a new opportunity!']
                },
                support: {
                    technical: ['I\'m here to help with any technical questions!', 'Need help? I\'ve got your back!'],
                    emotional: ['I understand how you feel. Let\'s work through this together!', 'You\'re not alone in this journey!'],
                    motivational: ['You have the strength to overcome any challenge!', 'Believe in yourself - you\'re capable of amazing things!']
                }
            },
            
            generateContextAwareResponse: (userInput, context) => {
                return this.generateContextAwareResponse(userInput, context);
            },
            
            adaptResponseStyle: (userPreference) => {
                return this.adaptResponseStyle(userPreference);
            }
        };
    }

    initializeLearningEngine() {
        this.learningEngine = {
            userPatterns: [],
            responseEffectiveness: {},
            adaptationRules: [],
            
            learnFromInteraction: (userInput, response, userFeedback) => {
                this.learnFromInteraction(userInput, response, userFeedback);
            },
            
            optimizeResponses: () => {
                return this.optimizeResponses();
            },
            
            predictUserNeeds: (context) => {
                return this.predictUserNeeds(context);
            }
        };
    }

    loadConversationHistory() {
        try {
            const storedHistory = localStorage.getItem('operatorUplift_conversationHistory');
            if (storedHistory) {
                this.conversationHistory = JSON.parse(storedHistory);
            }
            console.log('✅ Conversation history loaded');
        } catch (error) {
            console.error('❌ Error loading conversation history:', error);
            this.conversationHistory = [];
        }
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('operatorUplift_conversationHistory', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('❌ Error saving conversation history:', error);
        }
    }

    generateContextAwareResponse(userInput, context = null) {
        try {
            const currentContext = context || this.contextProcessor.getCurrentContext();
            const emotionalState = this.emotionalAnalyzer.analyzeEmotionalState(userInput);
            const userIntent = this.analyzeUserIntent(userInput);
            
            // Update context with new information
            this.contextProcessor.updateContext({
                userInput: userInput,
                emotionalState: emotionalState,
                userIntent: userIntent,
                sessionDuration: this.calculateSessionDuration()
            });
            
            // Generate appropriate response
            const response = this.generateAppropriateResponse(userInput, currentContext, emotionalState, userIntent);
            
            // Store conversation
            this.storeConversation(userInput, response, emotionalState, userIntent);
            
            // Learn from interaction
            this.learningEngine.learnFromInteraction(userInput, response, null);
            
            console.log('✅ Context-aware response generated');
            return response;
        } catch (error) {
            console.error('❌ Error generating context-aware response:', error);
            return this.getFallbackResponse();
        }
    }

    analyzeUserIntent(userInput) {
        const input = userInput.toLowerCase();
        
        // Analyze intent based on keywords and patterns
        if (input.includes('help') || input.includes('support') || input.includes('assist')) {
            return 'help_request';
        } else if (input.includes('goal') || input.includes('target') || input.includes('objective')) {
            return 'goal_related';
        } else if (input.includes('progress') || input.includes('status') || input.includes('update')) {
            return 'progress_inquiry';
        } else if (input.includes('motivation') || input.includes('encourage') || input.includes('inspire')) {
            return 'motivation_request';
        } else if (input.includes('problem') || input.includes('issue') || input.includes('difficult')) {
            return 'problem_report';
        } else if (input.includes('thank') || input.includes('appreciate') || input.includes('grateful')) {
            return 'gratitude';
        } else if (input.includes('how') || input.includes('what') || input.includes('why')) {
            return 'question';
        } else {
            return 'general_conversation';
        }
    }

    analyzeEmotionalState(text) {
        const input = text.toLowerCase();
        let emotionalScore = 0;
        let detectedEmotions = [];
        
        // Analyze emotional keywords
        Object.entries(this.emotionalAnalyzer.emotionalStates).forEach(([emotion, config]) => {
            config.keywords.forEach(keyword => {
                if (input.includes(keyword)) {
                    emotionalScore += config.weight;
                    detectedEmotions.push(emotion);
                }
            });
        });
        
        // Determine primary emotional state
        let primaryEmotion = 'neutral';
        if (emotionalScore > 0.5) {
            primaryEmotion = 'positive';
        } else if (emotionalScore < -0.3) {
            primaryEmotion = 'negative';
        }
        
        return {
            primaryEmotion: primaryEmotion,
            detectedEmotions: detectedEmotions,
            score: emotionalScore,
            confidence: Math.abs(emotionalScore)
        };
    }

    generateAppropriateResponse(userInput, context, emotionalState, userIntent) {
        const timeOfDay = this.getTimeOfDay();
        const responseType = this.determineResponseType(userIntent, emotionalState);
        
        let response = '';
        
        switch (responseType) {
            case 'greeting':
                response = this.getRandomResponse(this.responseGenerator.responseTemplates.greeting[timeOfDay]);
                break;
                
            case 'motivation':
                const motivationLevel = this.getMotivationLevel(emotionalState);
                response = this.getRandomResponse(this.responseGenerator.responseTemplates.motivation[motivationLevel]);
                break;
                
            case 'support':
                const supportType = this.getSupportType(userIntent);
                response = this.getRandomResponse(this.responseGenerator.responseTemplates.support[supportType]);
                break;
                
            case 'goal_assistance':
                response = this.generateGoalAssistanceResponse(context);
                break;
                
            case 'progress_update':
                response = this.generateProgressUpdateResponse(context);
                break;
                
            case 'problem_solving':
                response = this.generateProblemSolvingResponse(userInput, context);
                break;
                
            default:
                response = this.generateGeneralResponse(userInput, context, emotionalState);
        }
        
        // Adapt response based on emotional state
        response = this.adaptResponseToEmotion(response, emotionalState);
        
        return response;
    }

    determineResponseType(userIntent, emotionalState) {
        if (userIntent === 'help_request') return 'support';
        if (userIntent === 'goal_related') return 'goal_assistance';
        if (userIntent === 'progress_inquiry') return 'progress_update';
        if (userIntent === 'motivation_request') return 'motivation';
        if (userIntent === 'problem_report') return 'problem_solving';
        if (userIntent === 'gratitude') return 'motivation';
        if (userIntent === 'question') return 'support';
        
        // Default based on emotional state
        if (emotionalState.score < -0.3) return 'support';
        if (emotionalState.score > 0.5) return 'motivation';
        
        return 'general_conversation';
    }

    getMotivationLevel(emotionalState) {
        if (emotionalState.score > 0.8) return 'high';
        if (emotionalState.score > 0.2) return 'medium';
        return 'low';
    }

    getSupportType(userIntent) {
        if (userIntent === 'help_request') return 'technical';
        if (userIntent === 'problem_report') return 'emotional';
        return 'motivational';
    }

    generateGoalAssistanceResponse(context) {
        const responses = [
            "I'd be happy to help you with your goals! What specific goal would you like to work on?",
            "Let's break down your goals into manageable steps. What's your main objective?",
            "I can help you create a plan for achieving your goals. What's your current focus?",
            "Setting clear, achievable goals is key to success. What would you like to accomplish?"
        ];
        
        return this.getRandomResponse(responses);
    }

    generateProgressUpdateResponse(context) {
        const responses = [
            "Let me check your progress... You're making great strides toward your goals!",
            "Your progress looks excellent! Keep up the momentum!",
            "I can see you've been consistent with your goals. That's fantastic!",
            "Your dedication is paying off! You're on track to achieve great things!"
        ];
        
        return this.getRandomResponse(responses);
    }

    generateProblemSolvingResponse(userInput, context) {
        const responses = [
            "I understand you're facing a challenge. Let's work through this together step by step.",
            "Every problem has a solution. Let me help you find the best approach.",
            "It's okay to encounter difficulties. Let's identify the issue and create a plan.",
            "I'm here to support you. What specific aspect would you like to focus on first?"
        ];
        
        return this.getRandomResponse(responses);
    }

    generateGeneralResponse(userInput, context, emotionalState) {
        const responses = [
            "I'm here to support you on your journey. How can I help today?",
            "Thank you for sharing that with me. I'm listening and ready to assist.",
            "I appreciate your engagement. Let's continue working toward your goals together.",
            "Your input helps me provide better support. What's on your mind?"
        ];
        
        return this.getRandomResponse(responses);
    }

    adaptResponseToEmotion(response, emotionalState) {
        if (emotionalState.primaryEmotion === 'negative') {
            // Add more supportive and encouraging language
            response = `I understand this might be challenging. ${response} Remember, I'm here to support you every step of the way.`;
        } else if (emotionalState.primaryEmotion === 'positive') {
            // Add celebratory language
            response = `That's wonderful! ${response} Your positive energy is inspiring!`;
        }
        
        return response;
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    storeConversation(userInput, response, emotionalState, userIntent) {
        const conversationEntry = {
            timestamp: new Date().toISOString(),
            userInput: userInput,
            aiResponse: response,
            emotionalState: emotionalState,
            userIntent: userIntent,
            context: this.contextProcessor.getCurrentContext()
        };
        
        this.conversationHistory.push(conversationEntry);
        
        // Keep only last 100 conversations
        if (this.conversationHistory.length > 100) {
            this.conversationHistory = this.conversationHistory.slice(-100);
        }
        
        this.saveConversationHistory();
    }

    learnFromInteraction(userInput, response, userFeedback) {
        const learningEntry = {
            timestamp: new Date().toISOString(),
            userInput: userInput,
            response: response,
            feedback: userFeedback,
            effectiveness: this.calculateResponseEffectiveness(userFeedback)
        };
        
        this.learningEngine.userPatterns.push(learningEntry);
        
        // Update response effectiveness
        if (userFeedback) {
            this.learningEngine.responseEffectiveness[response] = 
                (this.learningEngine.responseEffectiveness[response] || 0) + learningEntry.effectiveness;
        }
    }

    calculateResponseEffectiveness(userFeedback) {
        if (!userFeedback) return 0;
        
        // Simple effectiveness calculation based on feedback
        if (userFeedback === 'positive') return 1;
        if (userFeedback === 'negative') return -1;
        if (userFeedback === 'neutral') return 0;
        
        return 0;
    }

    predictUserNeeds(context) {
        const predictions = [];
        const currentContext = context || this.contextProcessor.getCurrentContext();
        
        // Analyze patterns to predict needs
        const recentConversations = this.conversationHistory.slice(-10);
        const commonIntents = this.analyzeCommonIntents(recentConversations);
        
        // Predict based on time of day
        const timeOfDay = this.getTimeOfDay();
        if (timeOfDay === 'morning') {
            predictions.push('morning_motivation', 'goal_setting');
        } else if (timeOfDay === 'evening') {
            predictions.push('progress_review', 'reflection');
        }
        
        // Predict based on recent activity
        if (commonIntents.includes('problem_report')) {
            predictions.push('support_offer', 'solution_suggestion');
        }
        
        if (commonIntents.includes('goal_related')) {
            predictions.push('goal_assistance', 'progress_check');
        }
        
        return predictions;
    }

    analyzeCommonIntents(conversations) {
        const intentCounts = {};
        
        conversations.forEach(conv => {
            intentCounts[conv.userIntent] = (intentCounts[conv.userIntent] || 0) + 1;
        });
        
        return Object.keys(intentCounts).sort((a, b) => intentCounts[b] - intentCounts[a]);
    }

    trackEmotionalTrends() {
        const recentEmotions = this.conversationHistory
            .slice(-20)
            .map(conv => conv.emotionalState)
            .filter(emotion => emotion);
        
        if (recentEmotions.length === 0) return null;
        
        const averageScore = recentEmotions.reduce((sum, emotion) => sum + emotion.score, 0) / recentEmotions.length;
        const emotionalTrend = averageScore > 0.2 ? 'improving' : averageScore < -0.2 ? 'declining' : 'stable';
        
        return {
            trend: emotionalTrend,
            averageScore: averageScore,
            recentEmotions: recentEmotions.slice(-5),
            recommendations: this.generateEmotionalRecommendations(averageScore)
        };
    }

    generateEmotionalRecommendations(averageScore) {
        const recommendations = [];
        
        if (averageScore < -0.3) {
            recommendations.push(
                'Consider taking a short break to recharge',
                'Focus on small, achievable goals to build momentum',
                'Remember that progress, no matter how small, is still progress'
            );
        } else if (averageScore > 0.5) {
            recommendations.push(
                'Your positive energy is great! Keep building on this momentum',
                'Consider helping others who might be struggling',
                'Document your success strategies for future reference'
            );
        }
        
        return recommendations;
    }

    generateEmotionalResponse(emotionalState) {
        if (emotionalState.primaryEmotion === 'negative') {
            return "I sense you might be having a challenging time. Remember, it's okay to have difficult moments, and I'm here to support you. What would be most helpful right now?";
        } else if (emotionalState.primaryEmotion === 'positive') {
            return "Your positive energy is wonderful! I'm excited to see your enthusiasm. Let's channel this energy into achieving your goals!";
        } else {
            return "I'm here to support you regardless of how you're feeling. What's on your mind today?";
        }
    }

    analyzeContextPatterns() {
        const patterns = {
            mostActiveTime: this.findMostActiveTime(),
            commonIntents: this.findCommonIntents(),
            emotionalTrends: this.trackEmotionalTrends(),
            sessionPatterns: this.analyzeSessionPatterns()
        };
        
        return patterns;
    }

    findMostActiveTime() {
        const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 };
        
        this.conversationHistory.forEach(conv => {
            const hour = new Date(conv.timestamp).getHours();
            if (hour >= 6 && hour < 12) timeSlots.morning++;
            else if (hour >= 12 && hour < 18) timeSlots.afternoon++;
            else if (hour >= 18 && hour < 22) timeSlots.evening++;
            else timeSlots.night++;
        });
        
        return Object.keys(timeSlots).reduce((a, b) => timeSlots[a] > timeSlots[b] ? a : b);
    }

    findCommonIntents() {
        const intentCounts = {};
        
        this.conversationHistory.forEach(conv => {
            intentCounts[conv.userIntent] = (intentCounts[conv.userIntent] || 0) + 1;
        });
        
        return Object.keys(intentCounts).sort((a, b) => intentCounts[b] - intentCounts[a]);
    }

    analyzeSessionPatterns() {
        const sessions = this.groupConversationsBySession();
        
        return {
            averageSessionLength: this.calculateAverageSessionLength(sessions),
            commonSessionTopics: this.findCommonSessionTopics(sessions),
            sessionFrequency: this.calculateSessionFrequency()
        };
    }

    groupConversationsBySession() {
        const sessions = [];
        let currentSession = [];
        let lastTimestamp = null;
        
        this.conversationHistory.forEach(conv => {
            const timestamp = new Date(conv.timestamp);
            
            if (!lastTimestamp || (timestamp - lastTimestamp) > 30 * 60 * 1000) { // 30 minutes
                if (currentSession.length > 0) {
                    sessions.push(currentSession);
                }
                currentSession = [conv];
            } else {
                currentSession.push(conv);
            }
            
            lastTimestamp = timestamp;
        });
        
        if (currentSession.length > 0) {
            sessions.push(currentSession);
        }
        
        return sessions;
    }

    calculateAverageSessionLength(sessions) {
        if (sessions.length === 0) return 0;
        
        const totalLength = sessions.reduce((sum, session) => sum + session.length, 0);
        return Math.round(totalLength / sessions.length);
    }

    findCommonSessionTopics(sessions) {
        const topicCounts = {};
        
        sessions.forEach(session => {
            session.forEach(conv => {
                const intent = conv.userIntent;
                topicCounts[intent] = (topicCounts[intent] || 0) + 1;
            });
        });
        
        return Object.keys(topicCounts).sort((a, b) => topicCounts[b] - topicCounts[a]);
    }

    calculateSessionFrequency() {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentSessions = this.conversationHistory.filter(conv => 
            new Date(conv.timestamp) > oneWeekAgo
        );
        
        return recentSessions.length;
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    calculateSessionDuration() {
        // This would require more sophisticated session tracking
        return Math.floor(Math.random() * 60) + 10; // Mock duration
    }

    getFallbackResponse() {
        return "I'm here to help! How can I assist you with your goals today?";
    }

    // Public API methods
    getContext() {
        return this.contextProcessor.getCurrentContext();
    }

    getEmotionalState() {
        return this.emotionalState;
    }

    getConversationHistory() {
        return this.conversationHistory;
    }

    getLearningInsights() {
        return {
            patterns: this.learningEngine.userPatterns.slice(-10),
            effectiveness: this.learningEngine.responseEffectiveness,
            predictions: this.predictUserNeeds()
        };
    }
}

// Export to global scope
window.EnhancedAI = EnhancedAI;
console.log('🚀 Enhanced AI module loaded'); 