// Firebase Configuration for Production
// This file handles environment variables from Netlify build process

// Get environment variables from window object (injected by build script)
const getEnvVar = (name, defaultValue) => {
  // Check if environment variables are injected into window object
  if (window.ENV && window.ENV[name]) {
    return window.ENV[name];
  }
  // Fallback to default
  return defaultValue;
};

// Production Firebase configuration (from Netlify environment variables)
const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY', ""),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN', ""),
  projectId: getEnvVar('FIREBASE_PROJECT_ID', ""),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET', ""),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID', ""),
  appId: getEnvVar('FIREBASE_APP_ID', ""),
  measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID', "")
};

// Google Sign-In Configuration
const googleConfig = {
  clientId: getEnvVar('GOOGLE_CLIENT_ID', ""),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', "")
};

// Check if we have valid Firebase configuration
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;

if (hasValidConfig) {
  console.log('✅ Using production Firebase configuration');
  
  // Initialize Firebase
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Configure Google Sign-In
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Enable offline persistence
    db.enablePersistence()
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        }
      });
    
    // Export for use in app
    window.firebaseAuth = auth;
    window.firebaseDb = db;
    window.googleProvider = googleProvider;
    
    console.log('✅ Firebase initialized successfully');
    console.log('✅ Google Sign-In configured');
  } else {
    console.warn('⚠️ Firebase SDK not loaded');
  }
  
  // Production environment check
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log('🚀 Running in production mode');
    
    // Enable Firebase Analytics in production
    if (typeof firebase !== 'undefined' && firebase.analytics) {
      const analytics = firebase.analytics();
      window.firebaseAnalytics = analytics;
      console.log('✅ Firebase Analytics enabled');
    }
  }
} else {
  console.warn('⚠️ No valid Firebase configuration found');
  console.log('🔍 Environment variables status:');
  console.log('  FIREBASE_API_KEY:', firebaseConfig.apiKey ? 'SET' : 'NOT SET');
  console.log('  FIREBASE_AUTH_DOMAIN:', firebaseConfig.authDomain ? 'SET' : 'NOT SET');
  console.log('  FIREBASE_PROJECT_ID:', firebaseConfig.projectId ? 'SET' : 'NOT SET');
  console.log('  GOOGLE_CLIENT_ID:', googleConfig.clientId ? 'SET' : 'NOT SET');
  
  // In development, the app.html will handle Firebase initialization with fallback config
  console.log('📝 Firebase will be initialized by app.html with fallback configuration');
}
