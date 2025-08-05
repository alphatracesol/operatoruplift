// AI Module
// Handles AI chat, DeepSeek integration, and AI-powered features

class AIModule {
    constructor(core) {
        this.core = core;
        this.isInitialized = false;
        this.chatHistory = [];
        this.isTyping = false;
        this.apiEndpoint = 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct';
        this.maxHistoryLength = 50;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('🤖 AI Module initialized');
        this.isInitialized = true;
        
        // Load chat history from localStorage
        this.loadChatHistory();
        
        // Setup AI chat interface
        this.setupChatInterface();
        
        // Initialize AI personality based on user profile
        this.initializePersonality();
    }

    // Load chat history from localStorage
    loadChatHistory() {
        try {
            const saved = localStorage.getItem('ai-chat-history');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
                // Trim history if too long
                if (this.chatHistory.length > this.maxHistoryLength) {
                    this.chatHistory = this.chatHistory.slice(-this.maxHistoryLength);
                }
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
            this.chatHistory = [];
        }
    }

    // Save chat history to localStorage
    saveChatHistory() {
        try {
            localStorage.setItem('ai-chat-history', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    // Setup chat interface
    setupChatInterface() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        const chatContainer = document.getElementById('chat-container');
        
        if (chatInput && sendButton) {
            // Send on Enter key
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Send on button click
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // Render existing chat history
        this.renderChatHistory();
    }

    // Send message to AI
    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput?.value?.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addChatMessage('user', message);
        chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addChatMessage('ai', response);
            
        } catch (error) {
            console.error('AI response error:', error);
            this.hideTypingIndicator();
            this.addChatMessage('ai', 'Sorry, I encountered an error. Please try again.');
        }
    }

    // Get AI response from DeepSeek
    async getAIResponse(message) {
        const token = this.getAIToken();
        
        if (!token || token === 'hf_demo_token') {
            // Mock response for demo
            return this.getMockResponse(message);
        }
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: this.buildPrompt(message),
                    parameters: {
                        max_new_tokens: 500,
                        temperature: 0.7,
                        top_p: 0.9
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`AI API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data[0]?.generated_text || 'No response generated';
            
        } catch (error) {
            console.error('AI API error:', error);
            return this.getMockResponse(message);
        }
    }

    // Build context-aware prompt
    buildPrompt(message) {
        const userProfile = this.core.state.userData;
        const context = this.getConversationContext();
        
        let prompt = `You are an AI assistant for Operator Uplift, a gamified goal-setting and personal development app. `;
        
        if (userProfile) {
            prompt += `The user's name is ${userProfile.name || 'User'}. `;
            if (userProfile.style) {
                prompt += `They prefer a ${userProfile.style} communication style. `;
            }
        }
        
        prompt += `\n\nConversation context:\n${context}\n\nUser: ${message}\n\nAssistant:`;
        
        return prompt;
    }

    // Get conversation context
    getConversationContext() {
        const recentMessages = this.chatHistory.slice(-5);
        return recentMessages.map(msg => 
            `${msg.role}: ${msg.content}`
        ).join('\n');
    }

    // Get AI token from environment
    getAIToken() {
        try {
            return import.meta.env.VITE_HF_TOKEN || 
                   localStorage.getItem('hf_token') || 
                   'hf_demo_token';
        } catch (error) {
            return localStorage.getItem('hf_token') || 'hf_demo_token';
        }
    }

    // Get mock response for demo
    getMockResponse(message) {
        const responses = [
            "I understand you're working on personal development. That's a great goal!",
            "Based on your profile, I think you might benefit from breaking this down into smaller steps.",
            "Have you considered tracking your progress? It can be very motivating!",
            "That's an interesting challenge. Let me help you think through this.",
            "I'm here to support your growth journey. What specific aspect would you like to focus on?"
        ];
        
        // Simulate typing delay
        return new Promise(resolve => {
            setTimeout(() => {
                const response = responses[Math.floor(Math.random() * responses.length)];
                resolve(response);
            }, 1000 + Math.random() * 2000);
        });
    }

    // Add message to chat
    addChatMessage(role, content) {
        const message = {
            id: Date.now(),
            role,
            content,
            timestamp: new Date().toISOString()
        };
        
        this.chatHistory.push(message);
        this.saveChatHistory();
        this.renderMessage(message);
    }

    // Render message in chat
    renderMessage(message) {
        const chatContainer = document.getElementById('chat-container');
        if (!chatContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.role}-message`;
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message.content)}</div>
                <div class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</div>
            </div>
        `;
        
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Render chat history
    renderChatHistory() {
        const chatContainer = document.getElementById('chat-container');
        if (!chatContainer) return;
        
        chatContainer.innerHTML = '';
        this.chatHistory.forEach(message => {
            this.renderMessage(message);
        });
    }

    // Show typing indicator
    showTypingIndicator() {
        this.isTyping = true;
        const chatContainer = document.getElementById('chat-container');
        if (!chatContainer) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'chat-message ai-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    <span class="typing-dots">
                        <span></span><span></span><span></span>
                    </span>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(indicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Hide typing indicator
    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Initialize AI personality based on user profile
    initializePersonality() {
        const userProfile = this.core.state.userData;
        if (userProfile && userProfile.style) {
            console.log(`🤖 AI personality set to: ${userProfile.style}`);
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Clear chat history
    clearChatHistory() {
        this.chatHistory = [];
        this.saveChatHistory();
        this.renderChatHistory();
        console.log('🗑️ Chat history cleared');
    }

    // Get chat statistics
    getChatStats() {
        return {
            totalMessages: this.chatHistory.length,
            userMessages: this.chatHistory.filter(m => m.role === 'user').length,
            aiMessages: this.chatHistory.filter(m => m.role === 'ai').length,
            lastMessage: this.chatHistory[this.chatHistory.length - 1]?.timestamp
        };
    }

    // Cleanup
    cleanup() {
        this.isInitialized = false;
        this.chatHistory = [];
        console.log('🤖 AI Module cleanup completed');
    }
}

export default AIModule; 