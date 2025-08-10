# 🚀 Operator Uplift - Deployment Guide

## 📋 **Prerequisites**

- Netlify account
- Firebase project
- GitHub repository connected to Netlify

## 🔧 **Environment Variables Setup**

### **Firebase Configuration**
Set these environment variables in your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:

```bash
# Firebase Configuration (REQUIRED)
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin (for AI proxy function)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----

# Security Configuration
ALLOWED_ORIGIN=https://your-site.netlify.app
NODE_ENV=production

# AI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
```

### **Important Notes:**
- **NO VITE_ prefix** - Use the exact variable names shown above
- Firebase private key should include the `\n` characters for line breaks
- Set `ALLOWED_ORIGIN` to your actual Netlify domain

## 🌐 **Netlify Functions Configuration**

### **Function Dependencies**
The functions require Node.js dependencies. In the `netlify/functions` directory:

```bash
cd netlify/functions
npm install
```

### **Function Environment**
Functions automatically inherit environment variables from your Netlify site settings.

## 🔍 **Verification Steps**

### **1. Test Configuration Function**
Visit: `https://your-site.netlify.app/.netlify/functions/config`

Expected response:
```json
{
  "firebaseConfig": {
    "apiKey": "your_api_key",
    "authDomain": "your_project.firebaseapp.com",
    "projectId": "your_project_id",
    "storageBucket": "your_project.appspot.com",
    "messagingSenderId": "123456789",
    "appId": "1:123456789:web:abcdef123456"
  }
}
```

### **2. Check Function Logs**
1. Netlify dashboard → **Functions** tab
2. Click on the `config` function
3. Check logs for any errors

### **3. Test Firebase Initialization**
1. Open your deployed site
2. Open browser console
3. Look for Firebase initialization messages

## 🚨 **Common Issues & Solutions**

### **Issue: "MISSING_API_KEY" in config function**
**Solution**: Environment variables not set correctly
- Verify variable names (no VITE_ prefix)
- Check for typos
- Redeploy after setting variables

### **Issue: CORS errors**
**Solution**: Update `ALLOWED_ORIGIN` in environment variables
- Set to your exact Netlify domain
- Include `https://` protocol

### **Issue: Firebase not initializing**
**Solution**: Check browser console for errors
- Verify Netlify function is accessible
- Check Firebase SDK loading
- Verify environment variables are set

## 📱 **Deployment Process**

### **1. Connect Repository**
1. Netlify dashboard → **New site from Git**
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `npm run build` (if applicable)
   - Publish directory: `/` (or your build output directory)

### **2. Set Environment Variables**
1. Site settings → **Environment variables**
2. Add all required variables
3. Save changes

### **3. Deploy Functions**
1. Ensure `netlify/functions` directory is in your repository
2. Functions deploy automatically with your site
3. Check Functions tab for deployment status

### **4. Test Deployment**
1. Visit your deployed site
2. Test Firebase authentication
3. Verify AI chat functionality
4. Check console for any errors

## 🔒 **Security Considerations**

### **Environment Variables**
- Never commit sensitive keys to repository
- Use Netlify's environment variable system
- Rotate keys regularly

### **CORS Configuration**
- Restrict `ALLOWED_ORIGIN` to your domain only
- Don't use wildcards in production

### **Function Security**
- Functions include security headers
- Input validation implemented
- Rate limiting enabled

## 📊 **Monitoring & Maintenance**

### **Function Logs**
- Monitor function execution logs
- Check for errors or performance issues
- Set up alerts for function failures

### **Performance Monitoring**
- Monitor function response times
- Check Firebase usage and limits
- Monitor site performance metrics

### **Regular Updates**
- Keep dependencies updated
- Monitor security advisories
- Test functionality after updates

## 🎯 **Success Checklist**

- [ ] Environment variables set correctly
- [ ] Netlify functions deployed successfully
- [ ] Configuration function returns valid data
- [ ] Firebase initializes without errors
- [ ] Authentication works properly
- [ ] AI chat functionality operational
- [ ] No console errors
- [ ] Site loads and functions correctly

## 📞 **Support**

If you encounter issues:

1. Check the troubleshooting guide
2. Review function logs in Netlify dashboard
3. Verify environment variable configuration
4. Test configuration function directly
5. Check browser console for client-side errors

---

**Last Updated**: August 6, 2025  
**Version**: 2.0.0  
**Status**: Production Ready 