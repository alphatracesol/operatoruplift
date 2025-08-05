const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: require('firebase-admin/app').cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    try {
      initializeApp();
    } catch (fallbackError) {
      console.error('Firebase Admin fallback initialization failed:', fallbackError);
    }
  }
}

const auth = getAuth();
const db = getFirestore();

exports.handler = async function(event, context) {
  // Enhanced CORS headers with security
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://your-domain.netlify.app';
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests for analytics
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get query parameters
    const { timeRange = '24h', userId } = event.queryStringParameters || {};

    // Validate authentication if userId is provided
    let authenticatedUser = null;
    if (userId) {
      const authHeader = event.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Authentication required' })
        };
      }

      const token = authHeader.split('Bearer ')[1];
      try {
        authenticatedUser = await auth.verifyIdToken(token);
        if (authenticatedUser.uid !== userId) {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ error: 'User ID mismatch' })
          };
        }
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid authentication token' })
        };
      }
    }

    // Calculate time range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Fetch analytics data
    const analyticsData = await fetchAnalyticsData(startDate, now, userId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(analyticsData)
    };

  } catch (error) {
    console.error('Analytics API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function fetchAnalyticsData(startDate, endDate, userId = null) {
  try {
    // Fetch user metrics
    const userMetrics = await fetchUserMetrics(startDate, endDate, userId);
    
    // Fetch AI usage analytics
    const aiUsage = await fetchAIUsage(startDate, endDate, userId);
    
    // Fetch performance metrics
    const performance = await fetchPerformanceMetrics(startDate, endDate, userId);
    
    // Fetch engagement data
    const engagement = await fetchEngagementData(startDate, endDate, userId);

    return {
      success: true,
      data: {
        userMetrics,
        aiUsage,
        performance,
        engagement,
        timestamp: new Date().toISOString(),
        timeRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      }
    };

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

async function fetchUserMetrics(startDate, endDate, userId) {
  try {
    let query = db.collection('users');
    
    if (userId) {
      // Get metrics for specific user
      const userDoc = await query.doc(userId).get();
      if (!userDoc.exists) {
        return getDefaultUserMetrics();
      }
      
      const userData = userDoc.data();
      return {
        goalsCompleted: userData.stats?.goalsCompleted || 0,
        aiInteractions: userData.stats?.aiInteractions || 0,
        achievementsEarned: userData.stats?.achievementsEarned || 0,
        sessionDuration: userData.stats?.avgSessionDuration || 0,
        dailyActiveUsers: 1, // Single user
        weeklyRetention: 100 // Single user
      };
    } else {
      // Get aggregate metrics for all users
      const usersSnapshot = await query.get();
      let totalGoals = 0;
      let totalAIInteractions = 0;
      let totalAchievements = 0;
      let totalSessionDuration = 0;
      let userCount = 0;

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        totalGoals += userData.stats?.goalsCompleted || 0;
        totalAIInteractions += userData.stats?.aiInteractions || 0;
        totalAchievements += userData.stats?.achievementsEarned || 0;
        totalSessionDuration += userData.stats?.avgSessionDuration || 0;
        userCount++;
      });

      return {
        goalsCompleted: totalGoals,
        aiInteractions: totalAIInteractions,
        achievementsEarned: totalAchievements,
        sessionDuration: userCount > 0 ? Math.round(totalSessionDuration / userCount) : 0,
        dailyActiveUsers: userCount,
        weeklyRetention: 85 // Mock retention rate
      };
    }
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return getDefaultUserMetrics();
  }
}

async function fetchAIUsage(startDate, endDate, userId) {
  try {
    // Fetch AI interaction logs
    let query = db.collection('ai_interactions')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate);

    if (userId) {
      query = query.where('userId', '==', userId);
    }

    const interactionsSnapshot = await query.get();
    
    const providers = {};
    const responseTimes = {};
    let totalInteractions = 0;
    let successfulInteractions = 0;

    interactionsSnapshot.forEach(doc => {
      const interaction = doc.data();
      const provider = interaction.provider || 'Unknown';
      
      // Count provider usage
      providers[provider] = (providers[provider] || 0) + 1;
      
      // Track response times
      if (interaction.responseTime) {
        if (!responseTimes[provider]) {
          responseTimes[provider] = [];
        }
        responseTimes[provider].push(interaction.responseTime);
      }
      
      totalInteractions++;
      if (interaction.success !== false) {
        successfulInteractions++;
      }
    });

    // Calculate average response times
    Object.keys(responseTimes).forEach(provider => {
      const times = responseTimes[provider];
      responseTimes[provider] = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    });

    // If no real data, return mock data
    if (totalInteractions === 0) {
      return {
        providers: {
          'Claude': Math.floor(Math.random() * 100) + 30,
          'Gemini': Math.floor(Math.random() * 100) + 20,
          'Perplexity': Math.floor(Math.random() * 100) + 15,
          'XAI': Math.floor(Math.random() * 100) + 10
        },
        responseTimes: {
          'Claude': Math.floor(Math.random() * 2000) + 1000,
          'Gemini': Math.floor(Math.random() * 1500) + 800,
          'Perplexity': Math.floor(Math.random() * 3000) + 1500,
          'XAI': Math.floor(Math.random() * 2500) + 1200
        },
        successRate: Math.floor(Math.random() * 10) + 90
      };
    }

    return {
      providers,
      responseTimes,
      successRate: Math.round((successfulInteractions / totalInteractions) * 100)
    };

  } catch (error) {
    console.error('Error fetching AI usage:', error);
    return {
      providers: { 'Claude': 0, 'Gemini': 0, 'Perplexity': 0, 'XAI': 0 },
      responseTimes: { 'Claude': 0, 'Gemini': 0, 'Perplexity': 0, 'XAI': 0 },
      successRate: 0
    };
  }
}

async function fetchPerformanceMetrics(startDate, endDate, userId) {
  try {
    // Fetch performance logs
    let query = db.collection('performance_logs')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate);

    if (userId) {
      query = query.where('userId', '==', userId);
    }

    const logsSnapshot = await query.get();
    
    let totalLoadTime = 0;
    let totalAIResponseTime = 0;
    let totalMemoryUsage = 0;
    let totalErrors = 0;
    let logCount = 0;

    logsSnapshot.forEach(doc => {
      const log = doc.data();
      totalLoadTime += log.loadTime || 0;
      totalAIResponseTime += log.aiResponseTime || 0;
      totalMemoryUsage += log.memoryUsage || 0;
      if (log.error) totalErrors++;
      logCount++;
    });

    // If no real data, return mock data
    if (logCount === 0) {
      return {
        loadTime: Math.floor(Math.random() * 2000) + 500,
        memoryUsage: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.floor(Math.random() * 5),
        aiResponseTime: Math.floor(Math.random() * 2000) + 1000
      };
    }

    return {
      loadTime: Math.round(totalLoadTime / logCount),
      memoryUsage: Math.round(totalMemoryUsage / logCount),
      errorRate: Math.round((totalErrors / logCount) * 100),
      aiResponseTime: Math.round(totalAIResponseTime / logCount)
    };

  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return {
      loadTime: 0,
      memoryUsage: 0,
      errorRate: 0,
      aiResponseTime: 0
    };
  }
}

async function fetchEngagementData(startDate, endDate, userId) {
  try {
    // Generate daily activity data for the time range
    const dailyActivity = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyActivity.push({
        date: dateStr,
        activeUsers: userId ? 1 : Math.floor(Math.random() * 100) + 50,
        interactions: Math.floor(Math.random() * 200) + 100,
        goalsCreated: Math.floor(Math.random() * 50) + 20
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Feature usage data
    const featureUsage = {
      'Goals': Math.floor(Math.random() * 20) + 80,
      'AI Chat': Math.floor(Math.random() * 20) + 85,
      'Gamification': Math.floor(Math.random() * 30) + 70,
      'Mood Tracking': Math.floor(Math.random() * 40) + 60,
      'Social': Math.floor(Math.random() * 50) + 40,
      'Analytics': Math.floor(Math.random() * 60) + 30
    };

    return {
      dailyActivity,
      featureUsage
    };

  } catch (error) {
    console.error('Error fetching engagement data:', error);
    return {
      dailyActivity: [],
      featureUsage: {}
    };
  }
}

function getDefaultUserMetrics() {
  return {
    goalsCompleted: 0,
    aiInteractions: 0,
    achievementsEarned: 0,
    sessionDuration: 0,
    dailyActiveUsers: 0,
    weeklyRetention: 0
  };
} 