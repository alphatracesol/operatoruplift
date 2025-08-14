# API ENDPOINTS & BACKEND ARCHITECTURE

## Netlify Functions Documentation

---

# 🌐 API OVERVIEW

## Base URL
- **Production**: `https://operatoruplift.com/.netlify/functions`
- **Local Dev**: `http://localhost:8888/.netlify/functions`

## Authentication
- **Firebase ID Token**: Bearer token in Authorization header
- **Rate Limiting**: 120 requests per minute per IP
- **CORS**: Configurable allowed origins

---

# 📡 MAIN API ENDPOINTS

## Health & Configuration

### GET `/api/health`
**Purpose**: Health check endpoint
**Response**:
```json
{
  "ok": true,
  "cluster": "mainnet"
}
```

### GET `/api/env/check`
**Purpose**: Environment configuration check
**Response**:
```json
{
  "ok": true,
  "env": {
    "HELIUS_RPC_URL": true,
    "HELIUS_API_KEY": true,
    "UPLIFT_MINT": true,
    "UPLIFT_DECIMALS": true,
    "POINTS_RATE": true
  },
  "warnings": []
}
```

### GET `/api/config/public`
**Purpose**: Public configuration values
**Response**:
```json
{
  "mint": "TokenMintAddress",
  "decimals": 9,
  "pointsRate": 100,
  "pointsPerUsd": 10,
  "redemption": {
    "mode": "fixed",
    "pointUsd": 0.00001,
    "upliftPerPoint": 0.5,
    "dailyCap": 10000,
    "weeklyCap": 30000,
    "cooldownHours": 24
  },
  "sinks": {
    "buyAndBurnPct": 30,
    "treasuryLockPct": 20,
    "perkDeliveryPct": 50
  },
  "staking": {
    "requireLockForRedeem": false,
    "tiers": {
      "bronze": 1000,
      "silver": 5000,
      "gold": 25000
    }
  }
}
```

---

## Burn Tracking

### GET `/api/burn/total`
**Purpose**: Get total burned tokens
**Response**:
```json
{
  "total": 1000000
}
```

### GET `/api/burn/stream`
**Purpose**: SSE stream for real-time burn updates
**Response**: Server-Sent Events stream
```
event: snapshot
data: {"total": 1000000}
```

### POST `/api/burn/increment`
**Purpose**: Increment burn counter (admin only)
**Body**:
```json
{
  "amount": 100,
  "signature": "txSignature"
}
```

---

## Points & Redemption

### GET `/api/points/rate`
**Purpose**: Get current redemption rate
**Response**:
```json
{
  "type": "fixed",
  "rate": 0.5,
  "pointUsd": 0.00001,
  "upliftPerPoint": 0.5
}
```

### POST `/api/points/redeem`
**Purpose**: Redeem points for tokens
**Headers**:
```
Authorization: Bearer {firebaseIdToken}
```
**Body**:
```json
{
  "points": 1000
}
```
**Response**:
```json
{
  "success": true,
  "pointsRedeemed": 1000,
  "tokensEarned": 500,
  "transactionId": "abc123"
}
```
**Validation**:
- Minimum: 100 points
- Maximum: 10000 points
- Daily cap: 10000 points
- Weekly cap: 30000 points
- Cooldown: 24 hours

---

## User Management

### GET `/api/user/:wallet/points`
**Purpose**: Get user points by wallet
**Response**:
```json
{
  "wallet": "walletAddress",
  "points": 5000,
  "level": 10,
  "streak": 7
}
```

### POST `/api/user/:uid/xp`
**Purpose**: Add XP to user
**Headers**:
```
Authorization: Bearer {firebaseIdToken}
```
**Body**:
```json
{
  "xp": 50,
  "source": "task_completion"
}
```

### GET `/api/user/:uid/stats`
**Purpose**: Get comprehensive user statistics
**Response**:
```json
{
  "uid": "userId",
  "stats": {
    "totalXP": 5000,
    "level": 10,
    "streak": 7,
    "longestStreak": 30,
    "totalFocusMinutes": 1200,
    "tasksCompleted": 150,
    "achievementsUnlocked": 25
  }
}
```

---

## Authentication

### POST `/api/auth/phantom/nonce`
**Purpose**: Get nonce for wallet signing
**Response**:
```json
{
  "nonce": "randomNonce123",
  "message": "Sign this message to verify wallet ownership: randomNonce123",
  "expiresAt": 1234567890
}
```

### POST `/api/auth/phantom/link`
**Purpose**: Link Phantom wallet to account
**Headers**:
```
Authorization: Bearer {firebaseIdToken}
```
**Body**:
```json
{
  "address": "walletPublicKey",
  "signature": [/* signature bytes */],
  "nonce": "randomNonce123"
}
```
**Process**:
1. Verify Firebase auth token
2. Verify wallet signature
3. Check nonce validity
4. Link wallet to user account

### POST `/api/auth/phantom/unlink`
**Purpose**: Unlink wallet from account
**Headers**:
```
Authorization: Bearer {firebaseIdToken}
```
**Body**:
```json
{
  "address": "walletPublicKey"
}
```

### POST `/api/auth/phantom/verify`
**Purpose**: Verify wallet ownership
**Body**:
```json
{
  "address": "walletPublicKey",
  "signature": [/* signature bytes */],
  "message": "signedMessage"
}
```

---

## Token Information

### GET `/api/token/supply`
**Purpose**: Get current token supply
**Response**:
```json
{
  "totalSupply": 1000000000,
  "circulatingSupply": 800000000,
  "burnedSupply": 200000000,
  "lockedSupply": 50000000
}
```

### GET `/api/token/price`
**Purpose**: Get current token price
**Response**:
```json
{
  "price": 0.00001818,
  "priceUsd": 0.00001818,
  "marketCap": 18180,
  "volume24h": 5000,
  "priceChange24h": 5.2
}
```

### GET `/api/burns/history`
**Purpose**: Get burn transaction history
**Query Parameters**:
- `limit`: Number of records (default: 20, max: 100)
- `offset`: Pagination offset
**Response**:
```json
{
  "burns": [
    {
      "signature": "txSignature",
      "amount": 1000,
      "wallet": "walletAddress",
      "blockTime": 1234567890,
      "slot": 123456
    }
  ],
  "total": 500,
  "hasMore": true
}
```

---

## Leaderboard

### GET `/api/leaderboard/global`
**Purpose**: Get global leaderboard
**Query Parameters**:
- `limit`: Number of entries (default: 10, max: 100)
- `timeframe`: "daily" | "weekly" | "monthly" | "all"
**Response**:
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "uid",
      "username": "TopPlayer",
      "xp": 15000,
      "level": 25,
      "streak": 30
    }
  ],
  "totalPlayers": 1000,
  "timeframe": "weekly"
}
```

### GET `/api/leaderboard/friends`
**Purpose**: Get friends leaderboard
**Headers**:
```
Authorization: Bearer {firebaseIdToken}
```
**Response**: Similar to global leaderboard

### GET `/api/leaderboard/team/:teamId`
**Purpose**: Get team leaderboard
**Response**: Similar to global leaderboard

---

## Jobs & Background Tasks

### GET `/api/jobs/status`
**Purpose**: Get background job status
**Response**:
```json
{
  "jobs": {
    "burnSync": {
      "lastRun": "2025-01-01T00:00:00Z",
      "status": "success",
      "nextRun": "2025-01-01T01:00:00Z"
    },
    "leaderboardUpdate": {
      "lastRun": "2025-01-01T00:00:00Z",
      "status": "success",
      "nextRun": "2025-01-01T00:05:00Z"
    }
  }
}
```

---

## Fees & Buybacks

### GET `/api/fees/ingress`
**Purpose**: Get fee ingress data
**Response**:
```json
{
  "daily": 1000,
  "weekly": 7000,
  "monthly": 30000,
  "sources": {
    "trading": 60,
    "redemptions": 30,
    "partnerships": 10
  }
}
```

### GET `/api/fees/summary`
**Purpose**: Get fee distribution summary
**Response**:
```json
{
  "totalCollected": 100000,
  "distribution": {
    "buyAndBurn": 30000,
    "treasury": 20000,
    "perks": 50000
  },
  "lastUpdate": "2025-01-01T00:00:00Z"
}
```

### GET `/api/buybacks/log`
**Purpose**: Get buyback transaction log
**Response**:
```json
{
  "buybacks": [
    {
      "date": "2025-01-01",
      "amount": 10000,
      "price": 0.00002,
      "tokens": 500000000,
      "signature": "txSignature"
    }
  ]
}
```

---

# 🔥 BURN FEED FUNCTION

## GET `/burn-feed`
**Purpose**: Get recent burn transactions
**Query Parameters**:
- `mint`: Token mint address (required)
- `limit`: Number of burns (default: 20, max: 50)
**Response**:
```json
{
  "burns": [
    {
      "wallet": "walletAddress",
      "amount": 1000,
      "blockTime": "2025-01-01T00:00:00Z",
      "signature": "txSignature"
    }
  ],
  "total": 100
}
```

---

# 🤖 AI PROXY FUNCTION

## POST `/ai-proxy`
**Purpose**: Proxy requests to AI providers
**Body**:
```json
{
  "provider": "deepseek",
  "message": "User message",
  "context": {
    "userLevel": 10,
    "personality": {},
    "history": []
  }
}
```
**Supported Providers**:
- deepseek
- openai
- anthropic
- gemini
- huggingface
- xai
- perplexity

**Response**:
```json
{
  "response": "AI response text",
  "tokens": 150,
  "provider": "deepseek",
  "model": "deepseek-chat"
}
```

---

# 🔐 SECURITY MIDDLEWARE

## Rate Limiting
```javascript
{
  windowMs: 60000,     // 1 minute
  maxRequests: 120,    // per IP
  storage: "redis" | "memory"
}
```

## CORS Configuration
```javascript
{
  origins: [
    "https://operatoruplift.com",
    "https://app.operatoruplift.com",
    "http://localhost:3000"
  ],
  credentials: true
}
```

## Authentication Verification
```javascript
async function verifyFirebaseToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch {
    res.status(401).json({ error: 'invalid_token' });
  }
}
```

---

# 📊 ERROR CODES

## Standard Error Responses
```json
{
  "error": "error_code",
  "message": "Human readable message",
  "details": {}
}
```

## Error Code Reference
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Missing or invalid auth
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `409`: Conflict - Duplicate or conflicting operation
- `429`: Rate Limited - Too many requests
- `500`: Server Error - Internal error
- `503`: Service Unavailable - External service down

## Custom Error Codes
- `insufficient_points`: Not enough points for redemption
- `daily_cap_exceeded`: Daily redemption limit reached
- `weekly_cap_exceeded`: Weekly redemption limit reached
- `cooldown_active`: Redemption cooldown in effect
- `wallet_not_linked`: Wallet not linked to account
- `invalid_signature`: Wallet signature verification failed
- `nonce_expired`: Signing nonce has expired

---

# 🚀 DEPLOYMENT

## Environment Variables
```env
# Firebase Admin
FIREBASE_ADMIN_SDK_KEY=

# Solana/Helius
HELIUS_RPC_URL=
HELIUS_API_KEY=
UPLIFT_MINT=
UPLIFT_DECIMALS=9

# Redis (optional)
REDIS_URL=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120

# CORS
CORS_ALLOWED_ORIGINS=

# Points/Redemption
POINTS_RATE=100
POINTS_PER_USD=10
REDEMPTION_MODE=fixed
POINT_USD=0.00001
REDEEM_UPLIFT_PER_POINT=0.5
DAILY_REDEEM_POINTS_CAP=10000
WEEKLY_REDEEM_POINTS_CAP=30000
REDEEM_COOLDOWN_HOURS=24

# AI Providers
DEEPSEEK_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
HUGGINGFACE_API_KEY=
XAI_API_KEY=
PERPLEXITY_API_KEY=
```

## Netlify Configuration
```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[build]
  command = "npm run build"
  publish = "."
```

---

# 📈 MONITORING

## Key Metrics
- Request rate per endpoint
- Response time percentiles
- Error rate by status code
- Rate limit hits
- Cache hit ratio
- External API latency

## Logging
```javascript
console.log({
  timestamp: new Date().toISOString(),
  level: 'info',
  endpoint: req.path,
  method: req.method,
  userId: req.user?.uid,
  ip: req.ip,
  duration: Date.now() - startTime,
  status: res.statusCode
});
```

---

# 🧪 TESTING

## Local Development
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run functions locally
netlify dev

# Test endpoint
curl http://localhost:8888/.netlify/functions/api/health
```

## Integration Tests
```javascript
describe('API Endpoints', () => {
  test('GET /api/health', async () => {
    const response = await fetch('/api/health');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });
  
  test('POST /api/points/redeem', async () => {
    const response = await fetch('/api/points/redeem', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ points: 1000 })
    });
    expect(response.status).toBe(200);
  });
});
```

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Total Endpoints**: 30+
**Average Response Time**: <200ms
