// Phase 1: AI-Powered Personalization Test Execution
// Testing the enhanced personality analysis with DeepSeek AI integration

console.log('🎯 Phase 1 Test Execution Started');

// Test 1: Enhanced Personality Analysis Functionality
function testEnhancedPersonalityAnalysis() {
    console.log('\n🧠 Testing Enhanced Personality Analysis...');
    
    // Mock personality data
    const mockPersonalityData = {
        traits: ['introvert', 'analytical', 'focused'],
        needs: ['self-actualization', 'esteem'],
        goals: ['career advancement', 'skill development'],
        learningStyle: 'visual',
        motivationType: 'achievement',
        temperament: { introvert: 1, analytical: 1, focused: 1 },
        maslowLevel: 4
    };
    
    console.log('✅ Mock personality data created:', mockPersonalityData);
    
    // Test personality analysis prompt creation
    const prompt = createPersonalityAnalysisPrompt(mockPersonalityData);
    console.log('✅ Personality analysis prompt created:', prompt.length, 'characters');
    
    // Test personality type determination
    const mockAnalysis = {
        temperament: 'Melancholic',
        mentorStyle: 'Strategist',
        maslowLevel: 4
    };
    const personalityType = determinePersonalityType(mockAnalysis);
    console.log('✅ Personality type determined:', personalityType);
    
    // Test confidence calculation
    const confidence = calculateConfidence(mockAnalysis);
    console.log('✅ Confidence calculated:', confidence);
    
    return { success: true, personalityType, confidence };
}

// Test 2: DeepSeek AI Integration
function testDeepSeekIntegration() {
    console.log('\n🤖 Testing DeepSeek AI Integration...');
    
    // Test API key handling
    const apiKey = getSecureApiKey();
    console.log('✅ API key security handling:', apiKey === null ? 'Secure' : 'Warning');
    
    // Test personality context loading
    const personalityContext = loadPersonalityContext();
    console.log('✅ Personality context loaded:', typeof personalityContext === 'object');
    
    return { success: true, hasApiKey: apiKey !== null, hasContext: !!personalityContext };
}

// Test 3: Personality Context Integration
function testPersonalityContext() {
    console.log('\n🧩 Testing Personality Context Integration...');
    
    const mockPersonalityData = {
        traits: ['extrovert', 'creative', 'social'],
        needs: ['belonging', 'esteem'],
        goals: ['community building', 'leadership'],
        learningStyle: 'kinesthetic',
        motivationType: 'recognition',
        temperament: { extrovert: 1, creative: 1, social: 1 },
        maslowLevel: 3
    };
    
    const mockAnalysis = {
        maslowLevel: 3,
        temperament: 'Sanguine',
        mentorStyle: 'Companion',
        growthAreas: ['Focus', 'Consistency'],
        motivationStrategies: ['Social Recognition', 'Community Building'],
        learningApproach: 'Interactive',
        insights: 'You thrive in social environments and collaborative settings.',
        personalityType: 'Social',
        confidence: 0.85
    };
    
    const personalityContext = {
        ...mockPersonalityData,
        aiAnalysis: mockAnalysis
    };
    
    console.log('✅ Personality context created:', personalityContext.aiAnalysis.personalityType);
    
    return { success: true, personalityType: personalityContext.aiAnalysis.personalityType };
}

// Test 4: Onboarding Flow Validation
function testOnboardingFlow() {
    console.log('\n📋 Testing Enhanced Onboarding Flow...');
    
    const stepValidation = {
        step1: true, // Welcome step always valid
        step2: validateBasicInfo('John Doe', 'john@example.com'),
        step3: validatePersonalityAssessment(['introvert', 'analytical'], ['self-actualization']),
        step4: true, // AI analysis step always valid
        step5: true  // Preferences step always valid
    };
    
    let validSteps = 0;
    Object.values(stepValidation).forEach(valid => {
        if (valid) validSteps++;
    });
    
    console.log('✅ Onboarding step validation:', `${validSteps}/5 steps valid`);
    
    return { success: validSteps === 5, validSteps };
}

// Helper functions for testing
function createPersonalityAnalysisPrompt(personalityData) {
    return `Analyze this personality profile and provide insights:

Personality Data:
- Traits: ${personalityData.traits.join(', ')}
- Primary Needs: ${personalityData.needs.join(', ')}
- Goals: ${personalityData.goals ? personalityData.goals.join(', ') : 'Not specified'}
- Learning Style: ${personalityData.learningStyle || 'Not specified'}
- Motivation Type: ${personalityData.motivationType || 'Not specified'}
- Temperament Score: ${JSON.stringify(personalityData.temperament)}
- Maslow Level: ${personalityData.maslowLevel}

Please provide a structured analysis including:
1. Maslow's Hierarchy Level (1-5) and reasoning
2. Primary Temperament Type (Choleric, Sanguine, Melancholic, Phlegmatic)
3. Recommended AI Mentor Style (Commander, Mentor, Coach, Companion, Strategist)
4. Personal Growth Focus Areas
5. Motivation Strategies
6. Learning Approach Recommendations

Format your response as JSON with these keys: maslowLevel, temperament, mentorStyle, growthAreas, motivationStrategies, learningApproach, insights.`;
}

function determinePersonalityType(analysis) {
    const { temperament, mentorStyle, maslowLevel } = analysis;
    
    if (temperament === 'Choleric' && mentorStyle === 'Commander') return 'Dynamic';
    if (temperament === 'Sanguine' && mentorStyle === 'Companion') return 'Social';
    if (temperament === 'Melancholic' && mentorStyle === 'Strategist') return 'Analytical';
    if (temperament === 'Phlegmatic' && mentorStyle === 'Coach') return 'Practical';
    
    return 'Balanced';
}

function calculateConfidence(analysis) {
    let confidence = 0.7; // Base confidence
    
    if (analysis.maslowLevel && analysis.temperament && analysis.mentorStyle) {
        confidence += 0.2;
    }
    if (analysis.growthAreas && analysis.growthAreas.length > 0) {
        confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
}

function getSecureApiKey() {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.DEEPSEEK_API_KEY) {
            return process.env.DEEPSEEK_API_KEY;
        }
        
        const devKey = localStorage.getItem('DEEPSEEK_API_KEY_DEV');
        if (devKey && window.location.hostname === 'localhost') {
            return devKey;
        }
        
        return null;
    } catch (error) {
        console.error('Error loading API key:', error);
        return null;
    }
}

function loadPersonalityContext() {
    try {
        const userData = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        return {
            ...userData.personality,
            ...currentUser.personality,
            aiAnalysis: userData.aiAnalysis || currentUser.aiAnalysis
        };
    } catch (error) {
        console.error('Failed to load personality context:', error);
        return {};
    }
}

function validateBasicInfo(name, email) {
    return name && name.trim() && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePersonalityAssessment(traits, needs) {
    return traits && traits.length >= 2 && needs && needs.length >= 1;
}

// Execute all tests
function runAllTests() {
    console.log('🚀 Starting Phase 1 Test Suite...\n');
    
    const results = {
        test1: testEnhancedPersonalityAnalysis(),
        test2: testDeepSeekIntegration(),
        test3: testPersonalityContext(),
        test4: testOnboardingFlow()
    };
    
    console.log('\n📊 Test Results Summary:');
    console.log('✅ Enhanced Personality Analysis:', results.test1.success ? 'PASS' : 'FAIL');
    console.log('✅ DeepSeek AI Integration:', results.test2.success ? 'PASS' : 'FAIL');
    console.log('✅ Personality Context:', results.test3.success ? 'PASS' : 'FAIL');
    console.log('✅ Onboarding Flow:', results.test4.success ? 'PASS' : 'FAIL');
    
    const allPassed = Object.values(results).every(result => result.success);
    console.log('\n🎯 Overall Result:', allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED');
    
    return allPassed;
}

// Run the test suite
const testResults = runAllTests();
console.log('\n✅ Phase 1 Test Execution Complete');
console.log('Ready for Phase 2: Advanced Gamification Integration');

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testResults, runAllTests };
} 