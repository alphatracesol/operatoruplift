# ENVIRONMENT CONFIGURATION & DEPLOYMENT

## Complete Configuration Guide

---

# 🔐 ENVIRONMENT VARIABLES

## Complete Environment Variable List

### Firebase Configuration
```bash
# Core Firebase Config
FIREBASE_API_KEY=                    # Firebase Web API Key
FIREBASE_AUTH_DOMAIN=                # Auth domain (project.firebaseapp.com)
FIREBASE_PROJECT_ID=                 # Firebase project ID
FIREBASE_STORAGE_BUCKET=            # Storage bucket (project.appspot.com)
FIREBASE_MESSAGING_SENDER_ID=       # FCM sender ID
FIREBASE_APP_ID=                    # Firebase app ID
FIREBASE_MEASUREMENT_ID=            # Google Analytics measurement ID

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_SDK_KEY=             # Service account private key JSON
FIREBASE_DATABASE_URL=              # Realtime database URL
```

### Authentication
```bash
# Google OAuth
GOOGLE_CLIENT_ID=                   # Google OAuth client ID
GOOGLE_CLIENT_SECRET=               # Google OAuth client secret

# Session Management
SESSION_SECRET=                     # Express session secret
JWT_SECRET=                        # JWT signing secret
AUTH_TOKEN_EXPIRY=3600             # Token expiry in seconds
REFRESH_TOKEN_EXPIRY=604800       # Refresh token expiry (7 days)
```

### Solana/Web3
```bash
# Solana Configuration
SOLANA_CLUSTER=mainnet-beta        # Cluster: mainnet-beta, devnet, testnet
UPLIFT_MINT=                       # $UPLIFT token mint address
HELIUS_API_KEY=                    # Helius RPC API key
HELIUS_RPC_URL=                    # Helius RPC endpoint
HELIUS_WEBSOCKET_URL=              # Helius WebSocket endpoint

# Token Configuration
UPLIFT_TOKEN_DECIMALS=9            # Token decimals
UPLIFT_TOTAL_SUPPLY=1000000000     # Total supply (1 billion)
```

### AI Services
```bash
# DeepSeek AI
DEEPSEEK_API_KEY=                  # DeepSeek API key
DEEPSEEK_MODEL=deepseek-chat       # Model name

# OpenAI
OPENAI_API_KEY=                    # OpenAI API key
OPENAI_MODEL=gpt-4                 # Model selection

# Hugging Face
HUGGINGFACE_API_KEY=               # HF API key
HF_TOKEN=                          # HF access token

# Claude (Anthropic)
CLAUDE_API_KEY=                    # Claude API key
CLAUDE_MODEL=claude-3-opus         # Model version

# Google Gemini
GEMINI_API_KEY=                    # Gemini API key
GEMINI_MODEL=gemini-pro            # Model selection

# Perplexity
PERPLEXITY_API_KEY=                # Perplexity API key

# xAI
XAI_API_KEY=                       # xAI API key

# OpenRouter (Multi-model)
OPENROUTER_API_KEY=                # OpenRouter API key
```

### Redemption System
```bash
# Points Configuration
DAILY_REDEEM_POINTS_CAP=5000       # Daily redemption cap
WEEKLY_REDEEM_POINTS_CAP=20000     # Weekly redemption cap
MONTHLY_ISSUANCE_UPLIFT_CAP=100000 # Monthly token issuance cap
NEW_USER_REDEEM_POINTS_CAP=1000    # New user redemption cap

# Conversion Rates
POINTS_RATE=0.5                    # Points to token conversion rate
POINTS_PER_USD=100                 # Points per USD value
POINT_USD=0.01                     # USD value per point
FALLBACK_UPLIFT_USD=0.00001818     # Fallback token price

# Redemption Settings
REDEMPTION_MODE=manual              # manual or automatic
REDEEM_COOLDOWN_HOURS=24           # Cooldown between redemptions
REDEEM_UPLIFT_PER_POINT=0.5        # Tokens per point
REDEMPTION_VESTING_DAYS=7          # Vesting period for redemptions

# Lock Requirements
REDEEM_REQUIRE_LOCK=true           # Require token lock for redemption
REDEEM_MIN_LOCK_BRONZE=100         # Bronze tier minimum lock
REDEEM_MIN_LOCK_SILVER=500         # Silver tier minimum lock
REDEEM_MIN_LOCK_GOLD=1000          # Gold tier minimum lock
```

### Gamification
```bash
# Tier System
TIER_MULTIPLIERS=1,1.2,1.5,2       # Tier XP multipliers
STAKE_TIER_MULTIPLIERS=1,1.1,1.25,1.5  # Staking multipliers
TRUST_TIERS=0,100,500,1000         # Trust score thresholds

# Earning Caps
USD_WEEKLY_EARN_CAP=50             # Weekly USD earning cap
ALLOW_CLIENT_EARN=true             # Allow client-side earning

# Sink Distribution
SINK_BUY_BURN_PCT=20               # Percentage for buy & burn
SINK_TREASURY_PCT=30               # Percentage for treasury
SINK_PERK_PCT=50                   # Percentage for perks
```

### Security & Compliance
```bash
# Security Settings
REQUIRE_PROOF_OF_HUMAN=true        # Require human verification
AUDIT_RATE_PERCENT=10              # Percentage of actions to audit
BLOCK_VPN_HIGH_RISK=true           # Block VPN/high-risk IPs

# CORS Configuration
CORS_ORIGIN=https://operatoruplift.com  # Allowed CORS origin
ALLOWED_ORIGINS=                   # Comma-separated allowed origins

# Rate Limiting
RATE_LIMIT_WINDOW=900000           # Rate limit window (15 min)
RATE_LIMIT_MAX_REQUESTS=100        # Max requests per window
```

### External Services
```bash
# Price Feeds
PRICE_ENDPOINT=https://price.jup.ag/v6/price  # Price API endpoint
PRICE_TTL_MS=30000                 # Price cache TTL (30 seconds)

# Analytics
GOOGLE_ANALYTICS_ID=               # GA4 measurement ID
FACEBOOK_PIXEL_ID=                 # Facebook Pixel ID
MIXPANEL_TOKEN=                    # Mixpanel project token

# Error Tracking
SENTRY_DSN=                        # Sentry error tracking DSN
ROLLBAR_ACCESS_TOKEN=              # Rollbar access token
```

### Deployment
```bash
# Environment
NODE_ENV=production                # production, development, test
PORT=3000                          # Server port
HOST=0.0.0.0                       # Server host

# Netlify Specific
NETLIFY_SITE_ID=                  # Netlify site ID
NETLIFY_ACCESS_TOKEN=              # Netlify API token
```

---

# 📁 CONFIGURATION FILES

## netlify.toml
```toml
[build]
  publish = "build"
  functions = "netlify/functions"
  command = "npm run build:mixed"

[build.environment]
  # List of keys to exclude from secrets scanning
  SECRETS_SCAN_OMIT_KEYS = "FIREBASE_API_KEY,..."
  SECRETS_SCAN_OMIT_PATHS = "build/**,pages/**"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
  external_node_modules = [
    "firebase-admin",
    "ws",
    "redis",
    "express",
    "serverless-http",
    "cors",
    "body-parser",
    "@solana/web3.js",
    "@solana/spl-token",
    "tweetnacl",
    "bs58"
  ]

# Redirects
[[redirects]]
  from = "/app"
  to = "/app.html"
  status = 200

[[redirects]]
  from = "/uplift-token"
  to = "/uplift-token.html"
  status = 200

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Scheduled Functions
[[scheduled.functions]]
  name = "workers/redeem-fulfill"
  cron = "*/15 * * * *"  # Every 15 minutes

[[scheduled.functions]]
  name = "workers/weekly-reset"
  cron = "0 9 * * 1"     # Every Monday 09:00 UTC
```

## package.json
```json
{
  "name": "operator-uplift",
  "version": "1.0.0",
  "description": "AI-Powered Self-Progression Platform",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "build:netlify": "npm run build:mixed",
    "build:mixed": "node scripts/build-mixed.js",
    "build": "npm run build:mixed",
    "dev": "vite",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "@solana/web3.js": "^1.95.3",
    "express": "^4.19.2",
    "serverless-http": "^3.2.0",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "redis": "^4.6.12",
    "ws": "^8.18.0",
    "tweetnacl": "^1.0.3",
    "bs58": "^5.0.0"
  },
  "devDependencies": {
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "vite": "^5.4.19",
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0"
  }
}
```

## firebase.json
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint"
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "functions": {
      "port": 5001
    }
  }
}
```

---

# 🚀 DEPLOYMENT GUIDE

## Netlify Deployment

### 1. Initial Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init
```

### 2. Environment Variables
```bash
# Set environment variables via CLI
netlify env:set FIREBASE_API_KEY "your-key"
netlify env:set FIREBASE_AUTH_DOMAIN "your-domain"
# ... set all required variables

# Or use Netlify UI
# Site Settings > Environment Variables
```

### 3. Deploy
```bash
# Deploy to production
netlify deploy --prod

# Deploy preview
netlify deploy
```

## Vercel Deployment

### 1. Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Initialize
vercel
```

### 2. Configuration (vercel.json)
```json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "FIREBASE_API_KEY": "@firebase-api-key",
    "FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain"
  }
}
```

### 3. Deploy
```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

---

# 🔒 SECURITY BEST PRACTICES

## Environment Variable Security

### 1. Never Commit Secrets
```gitignore
# .gitignore
.env
.env.local
.env.production
.env.*.local
*.key
*.pem
```

### 2. Use Secret Management
```javascript
// Use environment-specific configs
const config = {
  apiKey: process.env.NODE_ENV === 'production' 
    ? process.env.FIREBASE_API_KEY 
    : process.env.DEV_FIREBASE_API_KEY
}
```

### 3. Validate Environment
```javascript
// validate-env.js
const required = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID'
];

required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

## Content Security Policy
```javascript
// CSP Configuration
const csp = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://cdn.jsdelivr.net',
    'https://www.gstatic.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:'
  ],
  'connect-src': [
    "'self'",
    'https://*.firebaseio.com',
    'https://*.googleapis.com',
    'wss://*.firebaseio.com'
  ]
};
```

---

# 🔄 CI/CD PIPELINE

## GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=build
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

# 📊 MONITORING & LOGGING

## Application Monitoring
```javascript
// monitoring.js
const monitoring = {
  // Performance monitoring
  performance: {
    enabled: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
    sampleRate: 0.1 // 10% sampling
  },
  
  // Error tracking
  errors: {
    enabled: process.env.ENABLE_ERROR_TRACKING === 'true',
    service: 'sentry', // or 'rollbar'
    dsn: process.env.SENTRY_DSN
  },
  
  // Analytics
  analytics: {
    enabled: process.env.ENABLE_ANALYTICS === 'true',
    providers: ['google', 'mixpanel']
  },
  
  // Custom metrics
  metrics: {
    enabled: process.env.ENABLE_METRICS === 'true',
    endpoint: process.env.METRICS_ENDPOINT
  }
};
```

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Configuration Type**: Multi-environment
**Deployment Targets**: Netlify, Vercel, Docker
