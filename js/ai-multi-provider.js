/**
 * Multi-Provider AI System
 * Implements fallback between multiple AI providers with context memory
 */

// ============================================
// 1. AI PROVIDER MANAGER
// ============================================

class AIProviderManager {
    constructor() {
        this.providers = new Map();
        this.currentProvider = null;
        this.conversationHistory = [];
        this.userContext = {};
        this.responseCache = new Map();
        this.init();
    }

    init() {
        this.setupProviders();
        this.loadConversationHistory();
        this.setupResponseCache();
    }

    setupProviders() {
        // Provider configuration with priority order
        const providerConfigs = [
            {
                id: 'deepseek',
                name: 'DeepSeek',
                endpoint: '/.netlify/functions/ai-proxy',
                model: 'deepseek-chat',
                priority: 1,
                maxTokens: 4096,
                temperature: 0.7,
                available: true
            },
            {
                id: 'openai',
                name: 'OpenAI',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-4',
                priority: 2,
                maxTokens: 4096,
                temperature: 0.7,
                available: true
            },
            {
                id: 'claude',
                name: 'Claude',
                endpoint: 'https://api.anthropic.com/v1/messages',
                model: 'claude-3-opus-20240229',
                priority: 3,
                maxTokens: 4096,
                temperature: 0.7,
                available: true
            },
            {
                id: 'gemini',
                name: 'Gemini',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
                model: 'gemini-pro',
                priority: 4,
                maxTokens: 4096,
                temperature: 0.7,
                available: true
            },
            {
                id: 'perplexity',
                name: 'Perplexity',
                endpoint: 'https://api.perplexity.ai/chat/completions',
                model: 'pplx-70b-online',
                priority: 5,
                maxTokens: 4096,
                temperature: 0.7,
                available: true
            },
            {
                id: 'xai',
                name: 'xAI',
                endpoint: 'https://api.x.ai/v1/chat/completions',
                model: 'grok-1',
                priority: 6,
                maxTokens: 4096,
                temperature: 0.7,
                available: true
            },
            {
                id: 'huggingface',
                name: 'Hugging Face',
                endpoint: 'https://api-inference.huggingface.co/models/',
                model: 'meta-llama/Llama-2-70b-chat-hf',
                priority: 7,
                maxTokens: 2048,
                temperature: 0.7,
                available: true
            }
        ];

        // Initialize providers
        providerConfigs.forEach(config => {
            this.providers.set(config.id, new AIProvider(config));
        });

        // Set default provider
        this.currentProvider = this.providers.get('deepseek');
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('ai_conversation_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                // Keep only last 50 messages
                if (this.conversationHistory.length > 50) {
                    this.conversationHistory = this.conversationHistory.slice(-50);
                }
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
            this.conversationHistory = [];
        }
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('ai_conversation_history', 
                JSON.stringify(this.conversationHistory.slice(-50)));
        } catch (error) {
            console.error('Error saving conversation history:', error);
        }
    }

    setupResponseCache() {
        // Load cache from localStorage
        try {
            const saved = localStorage.getItem('ai_response_cache');
            if (saved) {
                const cache = JSON.parse(saved);
                // Only load recent cache entries (last 24 hours)
                const now = Date.now();
                Object.entries(cache).forEach(([key, value]) => {
                    if (now - value.timestamp < 86400000) { // 24 hours
                        this.responseCache.set(key, value);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading response cache:', error);
        }
    }

    saveResponseCache() {
        try {
            const cacheObj = {};
            this.responseCache.forEach((value, key) => {
                cacheObj[key] = value;
            });
            localStorage.setItem('ai_response_cache', JSON.stringify(cacheObj));
        } catch (error) {
            console.error('Error saving response cache:', error);
        }
    }

    async sendMessage(message, options = {}) {
        // Check cache first
        const cacheKey = this.getCacheKey(message, options);
        const cached = this.responseCache.get(cacheKey);
        
        if (cached && !options.noCache) {
            console.log('Using cached response');
            return cached.response;
        }

        // Build context
        const context = this.buildContext(message, options);
        
        // Try providers in priority order
        const sortedProviders = Array.from(this.providers.values())
            .filter(p => p.available)
            .sort((a, b) => a.priority - b.priority);

        for (const provider of sortedProviders) {
            try {
                console.log(`Trying provider: ${provider.name}`);
                const response = await provider.sendMessage(context);
                
                // Cache successful response
                this.responseCache.set(cacheKey, {
                    response,
                    timestamp: Date.now()
                });
                this.saveResponseCache();
                
                // Update conversation history
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: response }
                );
                this.saveConversationHistory();
                
                return response;
            } catch (error) {
                console.error(`Provider ${provider.name} failed:`, error);
                provider.recordFailure();
                
                // Try next provider
                continue;
            }
        }

        // All providers failed
        throw new Error('All AI providers are currently unavailable');
    }

    buildContext(message, options) {
        const systemPrompt = this.getSystemPrompt(options);
        const conversationContext = this.getConversationContext();
        const userProfile = this.getUserProfile();

        return {
            systemPrompt,
            conversationHistory: conversationContext,
            userProfile,
            message,
            ...options
        };
    }

    getSystemPrompt(options) {
        const basePrompt = `You are Uplift AI, a supportive and motivating AI assistant for the Operator Uplift productivity platform. 
        Your personality is encouraging, insightful, and adaptive to user needs. 
        You help users stay focused, achieve their goals, and maintain healthy habits.`;

        const personalityTraits = {
            motivational: 'Be enthusiastic and encouraging. Celebrate small wins and progress.',
            analytical: 'Provide data-driven insights and actionable recommendations.',
            empathetic: 'Show understanding and emotional support when users face challenges.',
            playful: 'Use appropriate humor and gamification elements to keep interactions engaging.'
        };

        const personality = options.personality || 'balanced';
        const trait = personalityTraits[personality] || '';

        return `${basePrompt}\n\n${trait}`;
    }

    getConversationContext() {
        // Get last 10 messages for context
        return this.conversationHistory.slice(-10);
    }

    getUserProfile() {
        // Get user profile from localStorage
        try {
            const profile = localStorage.getItem('user_profile');
            return profile ? JSON.parse(profile) : {};
        } catch {
            return {};
        }
    }

    getCacheKey(message, options) {
        const key = `${message}_${JSON.stringify(options)}`;
        return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
    }

    switchProvider(providerId) {
        const provider = this.providers.get(providerId);
        if (provider && provider.available) {
            this.currentProvider = provider;
            return true;
        }
        return false;
    }

    getProviderStatus() {
        const status = [];
        this.providers.forEach((provider, id) => {
            status.push({
                id,
                name: provider.name,
                available: provider.available,
                failureCount: provider.failureCount,
                lastError: provider.lastError
            });
        });
        return status;
    }
}

// ============================================
// 2. AI PROVIDER CLASS
// ============================================

class AIProvider {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.endpoint = config.endpoint;
        this.model = config.model;
        this.priority = config.priority;
        this.maxTokens = config.maxTokens;
        this.temperature = config.temperature;
        this.available = config.available;
        this.failureCount = 0;
        this.lastError = null;
        this.apiKey = this.getApiKey();
    }

    getApiKey() {
        // Get API key from environment or localStorage
        const keys = {
            deepseek: process.env.DEEPSEEK_API_KEY || localStorage.getItem('deepseek_api_key'),
            openai: process.env.OPENAI_API_KEY || localStorage.getItem('openai_api_key'),
            claude: process.env.CLAUDE_API_KEY || localStorage.getItem('claude_api_key'),
            gemini: process.env.GEMINI_API_KEY || localStorage.getItem('gemini_api_key'),
            perplexity: process.env.PERPLEXITY_API_KEY || localStorage.getItem('perplexity_api_key'),
            xai: process.env.XAI_API_KEY || localStorage.getItem('xai_api_key'),
            huggingface: process.env.HF_TOKEN || localStorage.getItem('hf_token')
        };
        return keys[this.id];
    }

    async sendMessage(context) {
        const requestBody = this.buildRequestBody(context);
        const headers = this.buildHeaders();

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return this.extractResponse(data);
        } catch (error) {
            this.lastError = error.message;
            throw error;
        }
    }

    buildRequestBody(context) {
        // Build request body based on provider
        switch(this.id) {
            case 'deepseek':
            case 'openai':
            case 'perplexity':
            case 'xai':
                return {
                    model: this.model,
                    messages: [
                        { role: 'system', content: context.systemPrompt },
                        ...context.conversationHistory,
                        { role: 'user', content: context.message }
                    ],
                    max_tokens: this.maxTokens,
                    temperature: this.temperature
                };
            
            case 'claude':
                return {
                    model: this.model,
                    messages: [
                        { role: 'user', content: context.message }
                    ],
                    system: context.systemPrompt,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature
                };
            
            case 'gemini':
                return {
                    contents: [{
                        parts: [{
                            text: `${context.systemPrompt}\n\n${context.message}`
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: this.maxTokens,
                        temperature: this.temperature
                    }
                };
            
            case 'huggingface':
                return {
                    inputs: `${context.systemPrompt}\n\nUser: ${context.message}\nAssistant:`,
                    parameters: {
                        max_new_tokens: this.maxTokens,
                        temperature: this.temperature,
                        return_full_text: false
                    }
                };
            
            default:
                throw new Error(`Unknown provider: ${this.id}`);
        }
    }

    buildHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        switch(this.id) {
            case 'deepseek':
                // Headers handled by proxy
                break;
            
            case 'openai':
            case 'perplexity':
            case 'xai':
                headers['Authorization'] = `Bearer ${this.apiKey}`;
                break;
            
            case 'claude':
                headers['x-api-key'] = this.apiKey;
                headers['anthropic-version'] = '2023-06-01';
                break;
            
            case 'gemini':
                // API key in URL params
                this.endpoint += `?key=${this.apiKey}`;
                break;
            
            case 'huggingface':
                headers['Authorization'] = `Bearer ${this.apiKey}`;
                this.endpoint += this.model;
                break;
        }

        return headers;
    }

    extractResponse(data) {
        switch(this.id) {
            case 'deepseek':
            case 'openai':
            case 'perplexity':
            case 'xai':
                return data.choices[0].message.content;
            
            case 'claude':
                return data.content[0].text;
            
            case 'gemini':
                return data.candidates[0].content.parts[0].text;
            
            case 'huggingface':
                return data[0].generated_text;
            
            default:
                return data.response || data.text || '';
        }
    }

    recordFailure() {
        this.failureCount++;
        
        // Disable provider after 3 consecutive failures
        if (this.failureCount >= 3) {
            this.available = false;
            console.warn(`Provider ${this.name} disabled after ${this.failureCount} failures`);
            
            // Re-enable after 5 minutes
            setTimeout(() => {
                this.available = true;
                this.failureCount = 0;
                console.log(`Provider ${this.name} re-enabled`);
            }, 300000);
        }
    }
}

// ============================================
// 3. CONVERSATION MEMORY SYSTEM
// ============================================

class ConversationMemory {
    constructor() {
        this.shortTermMemory = [];
        this.longTermMemory = new Map();
        this.topics = new Map();
        this.userPreferences = {};
        this.init();
    }

    init() {
        this.loadMemory();
    }

    loadMemory() {
        try {
            const saved = localStorage.getItem('ai_memory');
            if (saved) {
                const memory = JSON.parse(saved);
                this.longTermMemory = new Map(memory.longTerm);
                this.topics = new Map(memory.topics);
                this.userPreferences = memory.preferences || {};
            }
        } catch (error) {
            console.error('Error loading memory:', error);
        }
    }

    saveMemory() {
        try {
            const memory = {
                longTerm: Array.from(this.longTermMemory.entries()),
                topics: Array.from(this.topics.entries()),
                preferences: this.userPreferences
            };
            localStorage.setItem('ai_memory', JSON.stringify(memory));
        } catch (error) {
            console.error('Error saving memory:', error);
        }
    }

    addToMemory(message, response, metadata = {}) {
        // Add to short-term memory
        this.shortTermMemory.push({
            message,
            response,
            timestamp: Date.now(),
            ...metadata
        });

        // Keep only last 20 in short-term
        if (this.shortTermMemory.length > 20) {
            this.shortTermMemory.shift();
        }

        // Extract and store important information
        this.extractImportantInfo(message, response);
        
        // Update topics
        this.updateTopics(message, response);
        
        // Save to persistent storage
        this.saveMemory();
    }

    extractImportantInfo(message, response) {
        // Extract user preferences
        const preferencePatterns = [
            /I prefer (\w+)/gi,
            /I like (\w+)/gi,
            /I don't like (\w+)/gi,
            /I hate (\w+)/gi
        ];

        preferencePatterns.forEach(pattern => {
            const matches = message.matchAll(pattern);
            for (const match of matches) {
                this.userPreferences[match[1]] = pattern.source.includes("don't") || 
                                                   pattern.source.includes("hate") ? 
                                                   'dislike' : 'like';
            }
        });

        // Extract goals and targets
        const goalPatterns = [
            /my goal is (\w+)/gi,
            /I want to (\w+)/gi,
            /I need to (\w+)/gi
        ];

        goalPatterns.forEach(pattern => {
            const matches = message.matchAll(pattern);
            for (const match of matches) {
                this.longTermMemory.set(`goal_${Date.now()}`, match[1]);
            }
        });
    }

    updateTopics(message, response) {
        // Simple topic extraction based on keywords
        const keywords = this.extractKeywords(message + ' ' + response);
        
        keywords.forEach(keyword => {
            const count = this.topics.get(keyword) || 0;
            this.topics.set(keyword, count + 1);
        });
    }

    extractKeywords(text) {
        // Simple keyword extraction
        const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but']);
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.has(word));
        
        // Get unique words
        return [...new Set(words)];
    }

    getRelevantContext(message) {
        // Get relevant context based on current message
        const keywords = this.extractKeywords(message);
        const relevantMemories = [];
        
        // Search long-term memory
        this.longTermMemory.forEach((value, key) => {
            if (keywords.some(keyword => value.toLowerCase().includes(keyword))) {
                relevantMemories.push(value);
            }
        });
        
        // Get top topics
        const topTopics = Array.from(this.topics.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([topic]) => topic);
        
        return {
            memories: relevantMemories,
            topics: topTopics,
            preferences: this.userPreferences,
            recentContext: this.shortTermMemory.slice(-5)
        };
    }
}

// ============================================
// 4. PERSONALITY SYSTEM
// ============================================

class AIPersonality {
    constructor() {
        this.traits = {
            enthusiasm: 0.7,
            formality: 0.5,
            humor: 0.6,
            empathy: 0.8,
            directness: 0.6
        };
        this.mood = 'neutral';
        this.adaptiveTraits = {};
        this.init();
    }

    init() {
        this.loadPersonality();
    }

    loadPersonality() {
        try {
            const saved = localStorage.getItem('ai_personality');
            if (saved) {
                const personality = JSON.parse(saved);
                this.traits = personality.traits;
                this.adaptiveTraits = personality.adaptive || {};
            }
        } catch (error) {
            console.error('Error loading personality:', error);
        }
    }

    savePersonality() {
        try {
            localStorage.setItem('ai_personality', JSON.stringify({
                traits: this.traits,
                adaptive: this.adaptiveTraits
            }));
        } catch (error) {
            console.error('Error saving personality:', error);
        }
    }

    adaptToUser(userMessage, userProfile) {
        // Analyze user message sentiment
        const sentiment = this.analyzeSentiment(userMessage);
        
        // Adapt traits based on user interaction
        if (sentiment === 'negative') {
            this.adaptiveTraits.empathy = Math.min(1, (this.adaptiveTraits.empathy || 0.8) + 0.1);
            this.adaptiveTraits.humor = Math.max(0, (this.adaptiveTraits.humor || 0.6) - 0.1);
        } else if (sentiment === 'positive') {
            this.adaptiveTraits.enthusiasm = Math.min(1, (this.adaptiveTraits.enthusiasm || 0.7) + 0.1);
        }
        
        // Adapt based on time of day
        const hour = new Date().getHours();
        if (hour < 6 || hour > 22) {
            this.adaptiveTraits.formality = Math.max(0, (this.adaptiveTraits.formality || 0.5) - 0.2);
            this.adaptiveTraits.directness = Math.min(1, (this.adaptiveTraits.directness || 0.6) + 0.2);
        }
        
        this.savePersonality();
    }

    analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'awesome', 'happy', 'excited', 'love', 'wonderful'];
        const negativeWords = ['bad', 'terrible', 'sad', 'angry', 'frustrated', 'hate', 'awful'];
        
        const lower = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => lower.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lower.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    getPersonalityModifiers() {
        const combined = { ...this.traits, ...this.adaptiveTraits };
        const modifiers = [];
        
        if (combined.enthusiasm > 0.7) {
            modifiers.push('Use enthusiastic language with exclamation points!');
        }
        
        if (combined.formality < 0.3) {
            modifiers.push('Use casual, friendly language');
        } else if (combined.formality > 0.7) {
            modifiers.push('Use professional, formal language');
        }
        
        if (combined.humor > 0.6) {
            modifiers.push('Include appropriate humor or wit');
        }
        
        if (combined.empathy > 0.7) {
            modifiers.push('Show understanding and emotional support');
        }
        
        if (combined.directness > 0.7) {
            modifiers.push('Be direct and to the point');
        }
        
        return modifiers.join(' ');
    }
}

// ============================================
// 5. INITIALIZATION
// ============================================

// Initialize AI system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAISystem);
} else {
    initializeAISystem();
}

function initializeAISystem() {
    // Initialize AI components
    window.aiProviderManager = new AIProviderManager();
    window.conversationMemory = new ConversationMemory();
    window.aiPersonality = new AIPersonality();
    
    // Create global AI interface
    window.AI = {
        async chat(message, options = {}) {
            try {
                // Show loading state
                if (window.loadingStateManager) {
                    const chatContainer = document.getElementById('ai-chat-messages');
                    if (chatContainer) {
                        window.loadingStateManager.showLoading(chatContainer, 'dots');
                    }
                }
                
                // Get relevant context
                const context = window.conversationMemory.getRelevantContext(message);
                
                // Adapt personality
                window.aiPersonality.adaptToUser(message, {});
                
                // Add personality modifiers to options
                options.personalityModifiers = window.aiPersonality.getPersonalityModifiers();
                options.context = context;
                
                // Send message
                const response = await window.aiProviderManager.sendMessage(message, options);
                
                // Store in memory
                window.conversationMemory.addToMemory(message, response);
                
                // Hide loading state
                if (window.loadingStateManager) {
                    const chatContainer = document.getElementById('ai-chat-messages');
                    if (chatContainer) {
                        window.loadingStateManager.hideLoading(chatContainer);
                    }
                }
                
                return response;
            } catch (error) {
                console.error('AI chat error:', error);
                
                // Show error toast
                if (window.toastManager) {
                    window.toastManager.error('AI service temporarily unavailable');
                }
                
                throw error;
            }
        },
        
        getProviderStatus() {
            return window.aiProviderManager.getProviderStatus();
        },
        
        switchProvider(providerId) {
            return window.aiProviderManager.switchProvider(providerId);
        },
        
        clearMemory() {
            window.conversationMemory = new ConversationMemory();
            window.toastManager?.success('AI memory cleared');
        }
    };
    
    console.log('✅ AI multi-provider system initialized');
}

// Export for use in other modules
export {
    AIProviderManager,
    AIProvider,
    ConversationMemory,
    AIPersonality
};
