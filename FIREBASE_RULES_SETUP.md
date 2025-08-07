# 🔥 Firebase Rules & Configuration Setup Guide

## 🚨 CRITICAL: You need to set up Firebase Rules

### **1. Firebase Console Setup:**

1. **Go to Firebase Console:** https://console.firebase.google.com/
2. **Select your project:** `operatoruplift`
3. **Navigate to Firestore Database**
4. **Go to Rules tab**

### **2. Copy These Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read public data
    match /public/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow users to manage their own goals
    match /users/{userId}/goals/{goalId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to manage their own achievements
    match /users/{userId}/achievements/{achievementId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to manage their own tasks
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **3. Authentication Setup:**

1. **Go to Authentication → Sign-in method**
2. **Enable Email/Password**
3. **Enable Google Sign-in**
4. **Add your domain:** `operatoruplift.com` to authorized domains

### **4. Environment Variables in Netlify:**

Set these in Netlify Dashboard → Site Settings → Environment Variables:

```
FIREBASE_API_KEY=your_actual_api_key
FIREBASE_AUTH_DOMAIN=operatoruplift.firebaseapp.com
FIREBASE_PROJECT_ID=operatoruplift
FIREBASE_STORAGE_BUCKET=operatoruplift.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### **5. Get Your Firebase Config:**

1. **Go to Project Settings**
2. **Scroll to "Your apps"**
3. **Click the web app icon**
4. **Copy the config object**

## 🚀 Next Steps:

1. **Set up Firebase Rules** (CRITICAL)
2. **Configure Authentication**
3. **Add environment variables to Netlify**
4. **Redeploy the application**

## ⚠️ Common Issues:

- **Invalid API Key:** Make sure you're using the correct API key from Firebase console
- **MIME Type Error:** The build process should fix this
- **Service Worker Cache:** External resources are being blocked
