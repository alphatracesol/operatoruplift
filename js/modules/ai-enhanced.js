/**
 * Enhanced AI Module - Operator Uplift
 * Advanced DeepSeek integration with personalization and context awareness
 * @author Operator Uplift Team
 * @version 2.0.0
 */

class EnhancedAIModule {
  constructor() {
    this.apiEndpoint = 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct';
    this.chatHistory = [];
    this.userProfile = null;
    this.contextWindow = 10; // Number of recent messages to include in context
    this.maxTokens = 2048;
    this.temperature = 0.7;
    this.isTyping = false;
    this.typingTimeout = null;

    // AI personality traits based on user profile
    this.aiPersonality = {
      motivationalStyle: 'encouraging',
      communicationStyle: 'friendly',
      expertiseLevel: 'intermediate',
      responseLength: 'detailed'
    };

    // Initialize the module
    this.init();
  }

  /**
     * Initialize the enhanced AI module
     */
  async init() {
    try {
      console.log('🚀 Initializing Enhanced AI Module...');

      // Load user profile for personalization
      await this.loadUserProfile();

      // Setup chat interface
      this.setupEnhancedChatInterface();

      // Load chat history
      await this.loadChatHistory();

      // Initialize AI personality based on user profile
      this.initializeAIPersonality();

      console.log('✅ Enhanced AI Module initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Enhanced AI Module:', error);
      this.handleError(error, 'AI Module Initialization');
    }
  }

  /**
     * Load user profile for AI personalization
     */
  async loadUserProfile() {
    try {
      const profileData = localStorage.getItem('operator_uplift_user_profile');
      if (profileData) {
        this.userProfile = JSON.parse(profileData);
        console.log('👤 User profile loaded for AI personalization');
      } else {
        // Default profile for new users
        this.userProfile = {
          name: 'Operator',
          personality: 'balanced',
          goals: [],
          experience: 'beginner',
          preferences: {
            communicationStyle: 'friendly',
            detailLevel: 'moderate',
            motivationStyle: 'encouraging'
          }
        };
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      this.userProfile = null;
    }
  }

  /**
     * Initialize AI personality based on user profile
     */
  initializeAIPersonality() {
    if (!this.userProfile) {return;}

    // Adapt AI personality to user preferences
    this.aiPersonality = {
      motivationalStyle: this.userProfile.preferences?.motivationStyle || 'encouraging',
      communicationStyle: this.userProfile.preferences?.communicationStyle || 'friendly',
      expertiseLevel: this.userProfile.experience || 'intermediate',
      responseLength: this.userProfile.preferences?.detailLevel === 'detailed' ? 'detailed' : 'concise'
    };

    console.log('🎭 AI personality initialized:', this.aiPersonality);
  }

  /**
     * Setup enhanced chat interface with advanced features
     */
  setupEnhancedChatInterface() {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) {
      console.warn('⚠️ Chat container not found');
      return;
    }

    // Enhanced chat interface HTML
    chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="ai-status">
                    <div class="ai-avatar">
                        <div class="ai-indicator ${this.isTyping ? 'typing' : 'online'}"></div>
                    </div>
                    <div class="ai-info">
                        <h3>DeepSeek Mentor</h3>
                        <p class="ai-status-text">${this.isTyping ? 'Typing...' : 'Online'}</p>
                    </div>
                </div>
                <div class="chat-controls">
                    <button class="btn-clear-chat" onclick="window.app.getModule('ai').clearChat()">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                    <button class="btn-export-chat" onclick="window.app.getModule('ai').exportChat()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <div class="welcome-message">
                    <div class="message ai-message">
                        <div class="message-content">
                            <h4>Welcome to Operator Uplift! 🚀</h4>
                            <p>I'm your AI mentor, powered by DeepSeek. I'm here to help you achieve your goals and level up your productivity.</p>
                            <p>What would you like to work on today?</p>
                        </div>
                        <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="input-wrapper">
                    <textarea 
                        id="chat-input" 
                        placeholder="Ask me anything about your goals, productivity, or personal development..."
                        rows="1"
                        maxlength="1000"
                    ></textarea>
                    <div class="input-actions">
                        <button class="btn-send" id="send-button" onclick="window.app.getModule('ai').sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                <div class="quick-actions">
                    <button class="quick-action" onclick="window.app.getModule('ai').sendQuickMessage('Help me set a new goal')">
                        🎯 Set Goal
                    </button>
                    <button class="quick-action" onclick="window.app.getModule('ai').sendQuickMessage('Give me a productivity tip')">
                        💡 Get Tip
                    </button>
                    <button class="quick-action" onclick="window.app.getModule('ai').sendQuickMessage('Review my progress')">
                        📊 Progress
                    </button>
                </div>
            </div>
        `;

    // Setup event listeners
    this.setupChatEventListeners();

    console.log('✅ Enhanced chat interface setup complete');
  }

  /**
     * Setup chat event listeners
     */
  setupChatEventListeners() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    if (chatInput) {
      // Auto-resize textarea
      chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = `${Math.min(chatInput.scrollHeight, 120)}px`;
      });

      // Send on Enter (Shift+Enter for new line)
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Character counter
      chatInput.addEventListener('input', () => {
        const remaining = 1000 - chatInput.value.length;
        // Update character counter if needed
      });
    }

    if (sendButton) {
      sendButton.addEventListener('click', () => this.sendMessage());
    }
  }

  /**
     * Send a message to the AI
     */
  async sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput?.value?.trim();

    if (!message || this.isTyping) {return;}

    try {
      // Add user message to chat
      this.addMessageToChat('user', message);
      chatInput.value = '';
      chatInput.style.height = 'auto';

      // Show typing indicator
      this.showTypingIndicator();

      // Get AI response
      const response = await this.getEnhancedAIResponse(message);

      // Hide typing indicator
      this.hideTypingIndicator();

      // Add AI response to chat
      this.addMessageToChat('ai', response);

      // Save chat history
      await this.saveChatHistory();

    } catch (error) {
      console.error('❌ Error sending message:', error);
      this.hideTypingIndicator();
      this.addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
      this.handleError(error, 'Send Message');
    }
  }

  /**
     * Send a quick message (for quick action buttons)
     */
  async sendQuickMessage(message) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.value = message;
      await this.sendMessage();
    }
  }

  /**
     * Get enhanced AI response with personalization
     */
  async getEnhancedAIResponse(userMessage) {
    try {
      // Build context-aware prompt
      const prompt = this.buildEnhancedPrompt(userMessage);

      // Get AI token
      const token = this.getAIToken();
      if (!token) {
        return this.getFallbackResponse(userMessage);
      }

      // Make API request
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: this.maxTokens,
            temperature: this.temperature,
            do_sample: true,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data[0]?.generated_text || '';

      // Clean and format the response
      aiResponse = this.formatAIResponse(aiResponse);

      // Apply personalization
      aiResponse = this.applyPersonalization(aiResponse, userMessage);

      return aiResponse;

    } catch (error) {
      console.error('❌ AI API Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
     * Build enhanced prompt with context and personalization
     */
  buildEnhancedPrompt(userMessage) {
    const context = this.getConversationContext();
    const personality = this.getPersonalityPrompt();
    const userContext = this.getUserContext();

    return `You are an AI mentor for Operator Uplift, a gamified productivity app. 

${personality}

${userContext}

Recent conversation context:
${context}

User's current message: "${userMessage}"

Please provide a helpful, personalized response that:
1. Addresses the user's specific question or request
2. Maintains the established personality and communication style
3. Offers actionable advice when appropriate
4. Encourages continued engagement with their goals
5. Keeps responses concise but informative

Response:`;
  }

  /**
     * Get conversation context (recent messages)
     */
  getConversationContext() {
    const recentMessages = this.chatHistory.slice(-this.contextWindow);
    if (recentMessages.length === 0) {return 'This is the start of the conversation.';}

    return recentMessages.map(msg =>
      `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n');
  }

  /**
     * Get personality prompt based on AI personality
     */
  getPersonalityPrompt() {
    const { motivationalStyle, communicationStyle, expertiseLevel, responseLength } = this.aiPersonality;

    return `Your personality traits:
- Motivational style: ${motivationalStyle}
- Communication style: ${communicationStyle}
- Expertise level: ${expertiseLevel}
- Response length: ${responseLength}

Be ${motivationalStyle}, ${communicationStyle}, and provide ${expertiseLevel}-level guidance with ${responseLength} responses.`;
  }

  /**
     * Get user context for personalization
     */
  getUserContext() {
    if (!this.userProfile) {return '';}

    return `User Profile:
- Name: ${this.userProfile.name}
- Experience: ${this.userProfile.experience}
- Personality: ${this.userProfile.personality}
- Goals: ${this.userProfile.goals?.length || 0} active goals
- Preferences: ${JSON.stringify(this.userProfile.preferences)}`;
  }

  /**
     * Format AI response for better readability
     */
  formatAIResponse(response) {
    // Remove any system prefixes
    response = response.replace(/^(AI|Assistant|Mentor):\s*/i, '');

    // Clean up extra whitespace
    response = response.trim();

    // Ensure proper sentence endings
    if (!response.endsWith('.') && !response.endsWith('!') && !response.endsWith('?')) {
      response += '.';
    }

    return response;
  }

  /**
     * Apply personalization to AI response
     */
  applyPersonalization(response, userMessage) {
    if (!this.userProfile) {return response;}

    // Add personal touches based on user profile
    let personalizedResponse = response;

    // Add user's name if available
    if (this.userProfile.name && this.userProfile.name !== 'Operator') {
      personalizedResponse = personalizedResponse.replace(
        /^(Hello|Hi|Hey)/i,
        `Hello ${this.userProfile.name}`
      );
    }

    // Add motivational elements based on user's style
    if (this.userProfile.preferences?.motivationStyle === 'encouraging') {
      if (!personalizedResponse.includes('!') && !personalizedResponse.includes('great') && !personalizedResponse.includes('awesome')) {
        personalizedResponse += ' You\'re doing great!';
      }
    }

    return personalizedResponse;
  }

  /**
     * Add message to chat interface
     */
  addMessageToChat(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {return;}

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;

    const timestamp = new Date().toLocaleTimeString();

    messageDiv.innerHTML = `
            <div class="message-content">
                ${this.formatMessageContent(content)}
            </div>
            <div class="message-timestamp">${timestamp}</div>
        `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add to chat history
    this.chatHistory.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // Limit chat history size
    if (this.chatHistory.length > 100) {
      this.chatHistory = this.chatHistory.slice(-50);
    }
  }

  /**
     * Format message content with markdown-like formatting
     */
  formatMessageContent(content) {
    // Convert markdown-like formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  /**
     * Show typing indicator
     */
  showTypingIndicator() {
    this.isTyping = true;
    const statusText = document.querySelector('.ai-status-text');
    if (statusText) {
      statusText.textContent = 'Typing...';
    }

    const indicator = document.querySelector('.ai-indicator');
    if (indicator) {
      indicator.classList.add('typing');
    }
  }

  /**
     * Hide typing indicator
     */
  hideTypingIndicator() {
    this.isTyping = false;
    const statusText = document.querySelector('.ai-status-text');
    if (statusText) {
      statusText.textContent = 'Online';
    }

    const indicator = document.querySelector('.ai-indicator');
    if (indicator) {
      indicator.classList.remove('typing');
    }
  }

  /**
     * Get AI token securely
     */
  getAIToken() {
    // Try to get token from environment or localStorage
    const token = window.env?.HF_TOKEN ||
                     localStorage.getItem('hf_token') ||
                     process.env?.HF_TOKEN;

    if (!token || token === 'hf_demo_token') {
      console.warn('⚠️ No valid AI token found, using fallback responses');
      return null;
    }

    return token;
  }

  /**
     * Get fallback response when AI is unavailable
     */
  getFallbackResponse(userMessage) {
    const fallbackResponses = [
      'I\'m here to help you with your goals! What would you like to work on?',
      'That\'s a great question! Let me help you with that.',
      'I\'d love to help you with that. Can you tell me more?',
      'That sounds interesting! What\'s your next step?',
      'I\'m excited to help you achieve your goals! What\'s on your mind?'
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  /**
     * Load chat history from localStorage
     */
  async loadChatHistory() {
    try {
      const history = localStorage.getItem('operator_uplift_chat_history');
      if (history) {
        this.chatHistory = JSON.parse(history);
        console.log(`📚 Loaded ${this.chatHistory.length} chat messages`);
      }
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      this.chatHistory = [];
    }
  }

  /**
     * Save chat history to localStorage
     */
  async saveChatHistory() {
    try {
      localStorage.setItem('operator_uplift_chat_history', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.error('❌ Error saving chat history:', error);
    }
  }

  /**
     * Clear chat history
     */
  clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.chatHistory = [];
      localStorage.removeItem('operator_uplift_chat_history');

      const chatMessages = document.getElementById('chat-messages');
      if (chatMessages) {
        chatMessages.innerHTML = `
                    <div class="welcome-message">
                        <div class="message ai-message">
                            <div class="message-content">
                                <h4>Chat cleared! 🗑️</h4>
                                <p>Ready for a fresh start? What would you like to work on?</p>
                            </div>
                            <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                `;
      }
    }
  }

  /**
     * Export chat history
     */
  exportChat() {
    try {
      const chatData = {
        exportDate: new Date().toISOString(),
        userProfile: this.userProfile,
        chatHistory: this.chatHistory
      };

      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `operator-uplift-chat-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);

      console.log('📤 Chat history exported successfully');
    } catch (error) {
      console.error('❌ Error exporting chat:', error);
      alert('Failed to export chat history. Please try again.');
    }
  }

  /**
     * Handle errors gracefully
     */
  handleError(error, context) {
    console.error(`❌ AI Module Error (${context}):`, error);

    // Log error for debugging
    if (window.errorBoundary) {
      window.errorBoundary.catchError(error, `AI Module - ${context}`);
    }

    // Show user-friendly error message
    this.addMessageToChat('ai', 'I encountered an error. Please try again or contact support if the issue persists.');
  }

  /**
     * Cleanup resources
     */
  cleanup() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    console.log('🧹 Enhanced AI Module cleanup complete');
  }
}

export default EnhancedAIModule;
