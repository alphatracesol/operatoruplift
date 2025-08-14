# WEB3 & SOLANA INTEGRATION

## Blockchain Architecture & Wallet Integration

---

# 🌐 WEB3 OVERVIEW

## Integration Points
1. **Wallet Connection**: Phantom, Solflare, Backpack
2. **Token Operations**: $UPLIFT token interactions
3. **Transaction Signing**: Message verification
4. **On-chain Data**: Burn tracking, supply monitoring
5. **DeFi Integration**: DEX prices, liquidity pools
6. **NFT Support**: Future achievement NFTs

## Tech Stack
- **Blockchain**: Solana (Mainnet)
- **Primary Wallet**: Phantom
- **RPC Provider**: Helius
- **Token Standard**: SPL Token
- **Web3 Libraries**: @solana/web3.js, @solana/spl-token

---

# 👻 PHANTOM WALLET INTEGRATION

## Connection Flow
```javascript
// 1. Detect Phantom
const detectPhantom = () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  return null;
};

// 2. Connect Wallet
async function connectPhantomWallet() {
  try {
    const provider = detectPhantom();
    
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return { error: 'Phantom not installed' };
    }
    
    // Request connection
    const resp = await provider.connect({ 
      onlyIfTrusted: false // Always prompt
    });
    
    const publicKey = resp.publicKey.toString();
    
    return {
      success: true,
      publicKey: publicKey,
      provider: provider
    };
  } catch (err) {
    return { 
      error: err.message,
      code: err.code 
    };
  }
}

// 3. Auto-connect on load
async function autoConnectWallet() {
  try {
    const provider = detectPhantom();
    if (!provider) return null;
    
    // Try silent connect
    const resp = await provider.connect({ 
      onlyIfTrusted: true // Don't prompt
    });
    
    if (resp.publicKey) {
      return resp.publicKey.toString();
    }
  } catch {
    return null;
  }
}
```

## Message Signing & Verification
```javascript
// Backend nonce generation
function generateNonce() {
  const nonce = crypto.randomBytes(32).toString('hex');
  const message = `Sign this message to verify wallet ownership:\n\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
  
  return {
    nonce: nonce,
    message: message,
    expiresAt: Date.now() + 300000 // 5 minutes
  };
}

// Frontend signing
async function signMessage(message) {
  const provider = window.phantom?.solana;
  if (!provider) throw new Error('Phantom not available');
  
  const encodedMessage = new TextEncoder().encode(message);
  const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
  
  return {
    signature: Array.from(signedMessage.signature),
    publicKey: signedMessage.publicKey.toString()
  };
}

// Backend verification
const nacl = require('tweetnacl');
const bs58 = require('bs58');

function verifySignature(message, signature, publicKey) {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = new Uint8Array(signature);
    const publicKeyBytes = bs58.decode(publicKey);
    
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch {
    return false;
  }
}
```

## Wallet Linking System
```javascript
// Link wallet to Firebase account
async function linkWalletToAccount(userId, walletAddress, signature) {
  // 1. Verify signature
  const isValid = await verifyWalletOwnership(walletAddress, signature);
  if (!isValid) {
    throw new Error('Invalid signature');
  }
  
  // 2. Check if wallet already linked
  const existing = await db.collection('walletLinks')
    .where('walletAddress', '==', walletAddress)
    .get();
    
  if (!existing.empty) {
    throw new Error('Wallet already linked to another account');
  }
  
  // 3. Create link
  await db.collection('users').doc(userId).update({
    walletAddress: walletAddress,
    walletLinked: true,
    walletLinkedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  // 4. Store link record
  await db.collection('walletLinks').add({
    userId: userId,
    walletAddress: walletAddress,
    linkedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true };
}
```

---

# 💰 $UPLIFT TOKEN INTEGRATION

## Token Configuration
```javascript
const UPLIFT_TOKEN = {
  mint: 'UPLIFTtokenMintAddressHere', // Replace with actual
  decimals: 9,
  symbol: 'UPLIFT',
  name: 'Operator Uplift',
  
  // Tokenomics
  totalSupply: 1000000000, // 1 billion
  initialBurn: 200000000,   // 200 million
  
  // Distribution
  distribution: {
    community: 0.40,    // 40% - Rewards, airdrops
    liquidity: 0.20,    // 20% - DEX liquidity
    team: 0.15,         // 15% - Team (vested)
    treasury: 0.15,     // 15% - Treasury
    marketing: 0.10     // 10% - Marketing
  },
  
  // Burn mechanism
  burnRate: {
    trading: 0.02,      // 2% on trades
    redemption: 0.01    // 1% on redemptions
  }
};
```

## Token Operations
```javascript
const { Connection, PublicKey, Transaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

class UpliftTokenService {
  constructor() {
    this.connection = new Connection(
      process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
    this.tokenMint = new PublicKey(UPLIFT_TOKEN.mint);
  }
  
  // Get token balance
  async getBalance(walletAddress) {
    try {
      const wallet = new PublicKey(walletAddress);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        wallet,
        { mint: this.tokenMint }
      );
      
      if (tokenAccounts.value.length === 0) {
        return 0;
      }
      
      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount;
      return balance.uiAmount; // Human readable amount
    } catch (err) {
      console.error('Error getting balance:', err);
      return 0;
    }
  }
  
  // Get token supply
  async getSupply() {
    try {
      const supply = await this.connection.getTokenSupply(this.tokenMint);
      return {
        total: supply.value.uiAmount,
        circulating: supply.value.uiAmount - this.getBurnedAmount(),
        decimals: supply.value.decimals
      };
    } catch (err) {
      console.error('Error getting supply:', err);
      return null;
    }
  }
  
  // Monitor burn transactions
  async getBurnTransactions(limit = 20) {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        this.tokenMint,
        { limit }
      );
      
      const burns = [];
      for (const sig of signatures) {
        const tx = await this.connection.getParsedTransaction(sig.signature);
        
        // Check if it's a burn transaction
        const burnInstruction = tx?.transaction.message.instructions.find(
          inst => inst.programId.toString() === TOKEN_PROGRAM_ID.toString() &&
                  inst.parsed?.type === 'burn'
        );
        
        if (burnInstruction) {
          burns.push({
            signature: sig.signature,
            amount: burnInstruction.parsed.info.amount,
            wallet: burnInstruction.parsed.info.account,
            blockTime: sig.blockTime,
            slot: sig.slot
          });
        }
      }
      
      return burns;
    } catch (err) {
      console.error('Error getting burns:', err);
      return [];
    }
  }
}
```

---

# 🔥 BURN MECHANISM

## Burn Tracking System
```javascript
class BurnTracker {
  constructor() {
    this.burnAddress = 'So11111111111111111111111111111111111111112'; // Solana burn address
    this.cache = new Map();
    this.updateInterval = 60000; // 1 minute
  }
  
  // Track burns in real-time
  async startTracking() {
    // Subscribe to burn address transactions
    const connection = new Connection(process.env.HELIUS_RPC_URL);
    
    connection.onAccountChange(
      new PublicKey(this.burnAddress),
      (accountInfo) => {
        this.processBurnEvent(accountInfo);
      },
      'confirmed'
    );
    
    // Periodic sync
    setInterval(() => {
      this.syncBurnData();
    }, this.updateInterval);
  }
  
  // Process burn event
  async processBurnEvent(accountInfo) {
    const burnData = {
      timestamp: Date.now(),
      amount: accountInfo.lamports,
      signature: accountInfo.signature
    };
    
    // Update cache
    this.cache.set(burnData.signature, burnData);
    
    // Emit to clients
    this.emitBurnUpdate(burnData);
    
    // Store in database
    await this.storeBurnRecord(burnData);
  }
  
  // Calculate burn statistics
  async getBurnStats() {
    const burns = await this.getAllBurns();
    
    return {
      totalBurned: burns.reduce((sum, b) => sum + b.amount, 0),
      burnCount: burns.length,
      last24h: this.getBurnsSince(Date.now() - 86400000),
      last7d: this.getBurnsSince(Date.now() - 604800000),
      last30d: this.getBurnsSince(Date.now() - 2592000000),
      largestBurn: Math.max(...burns.map(b => b.amount)),
      averageBurn: burns.reduce((sum, b) => sum + b.amount, 0) / burns.length
    };
  }
}
```

## Burn Feed Implementation
```javascript
// Real-time burn feed
class BurnFeed {
  constructor() {
    this.subscribers = new Set();
    this.recentBurns = [];
    this.maxBurns = 50;
  }
  
  // Subscribe to burn updates
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Send recent burns immediately
    callback(this.recentBurns);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }
  
  // Add new burn
  addBurn(burn) {
    // Add to recent burns
    this.recentBurns.unshift(burn);
    
    // Limit array size
    if (this.recentBurns.length > this.maxBurns) {
      this.recentBurns.pop();
    }
    
    // Notify subscribers
    this.notifySubscribers(burn);
  }
  
  // Notify all subscribers
  notifySubscribers(burn) {
    this.subscribers.forEach(callback => {
      callback([burn, ...this.recentBurns]);
    });
  }
  
  // Format burn for display
  formatBurn(burn) {
    return {
      wallet: `${burn.wallet.slice(0, 4)}...${burn.wallet.slice(-4)}`,
      amount: (burn.amount / Math.pow(10, UPLIFT_TOKEN.decimals)).toLocaleString(),
      time: new Date(burn.blockTime * 1000).toLocaleString(),
      txLink: `https://solscan.io/tx/${burn.signature}`
    };
  }
}
```

---

# 💱 REDEMPTION SYSTEM

## Points to Token Conversion
```javascript
class RedemptionService {
  constructor() {
    this.conversionRate = 0.5; // 1 point = 0.5 UPLIFT
    this.minRedemption = 100;  // Minimum points
    this.maxRedemption = 10000; // Maximum points per tx
    this.dailyCap = 5000;       // Daily limit
    this.weeklyCap = 20000;     // Weekly limit
  }
  
  // Validate redemption request
  async validateRedemption(userId, points) {
    // Check minimum
    if (points < this.minRedemption) {
      throw new Error(`Minimum redemption is ${this.minRedemption} points`);
    }
    
    // Check maximum
    if (points > this.maxRedemption) {
      throw new Error(`Maximum redemption is ${this.maxRedemption} points`);
    }
    
    // Check user balance
    const user = await this.getUser(userId);
    if (user.points < points) {
      throw new Error('Insufficient points');
    }
    
    // Check daily limit
    const dailyRedeemed = await this.getDailyRedemption(userId);
    if (dailyRedeemed + points > this.dailyCap) {
      throw new Error(`Daily cap exceeded. Available: ${this.dailyCap - dailyRedeemed}`);
    }
    
    // Check weekly limit
    const weeklyRedeemed = await this.getWeeklyRedemption(userId);
    if (weeklyRedeemed + points > this.weeklyCap) {
      throw new Error(`Weekly cap exceeded. Available: ${this.weeklyCap - weeklyRedeemed}`);
    }
    
    return true;
  }
  
  // Process redemption
  async processRedemption(userId, points, walletAddress) {
    // Validate
    await this.validateRedemption(userId, points);
    
    // Calculate tokens
    const tokens = points * this.conversionRate;
    const burnAmount = tokens * UPLIFT_TOKEN.burnRate.redemption;
    const netTokens = tokens - burnAmount;
    
    // Create redemption record
    const redemption = {
      userId: userId,
      points: points,
      tokens: netTokens,
      burnAmount: burnAmount,
      walletAddress: walletAddress,
      status: 'pending',
      createdAt: Date.now()
    };
    
    // Store in database
    const redemptionId = await this.createRedemption(redemption);
    
    // Queue for processing
    await this.queueRedemption(redemptionId);
    
    // Deduct points
    await this.deductPoints(userId, points);
    
    return {
      redemptionId: redemptionId,
      points: points,
      tokens: netTokens,
      estimatedTime: '24-48 hours'
    };
  }
}
```

---

# 📊 DEX INTEGRATION

## Price Feeds
```javascript
class PriceFeedService {
  constructor() {
    this.providers = {
      jupiter: 'https://price.jup.ag/v6/price',
      birdeye: 'https://api.birdeye.so/v1/price',
      dexscreener: 'https://api.dexscreener.com/latest/dex/tokens'
    };
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }
  
  // Get UPLIFT price
  async getPrice() {
    // Check cache
    const cached = this.cache.get('price');
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.price;
    }
    
    try {
      // Try Jupiter first
      const jupiterPrice = await this.getJupiterPrice();
      if (jupiterPrice) {
        this.cache.set('price', { price: jupiterPrice, timestamp: Date.now() });
        return jupiterPrice;
      }
      
      // Fallback to other providers
      const birdeyePrice = await this.getBirdeyePrice();
      if (birdeyePrice) {
        this.cache.set('price', { price: birdeyePrice, timestamp: Date.now() });
        return birdeyePrice;
      }
      
      // Use fallback price
      return 0.00001818; // Default price
    } catch (err) {
      console.error('Error getting price:', err);
      return 0.00001818;
    }
  }
  
  // Get Jupiter price
  async getJupiterPrice() {
    try {
      const response = await fetch(
        `${this.providers.jupiter}?ids=${UPLIFT_TOKEN.mint}`
      );
      const data = await response.json();
      return data.data[UPLIFT_TOKEN.mint]?.price || null;
    } catch {
      return null;
    }
  }
  
  // Get market data
  async getMarketData() {
    const price = await this.getPrice();
    const supply = await new UpliftTokenService().getSupply();
    
    return {
      price: price,
      marketCap: price * supply.circulating,
      volume24h: await this.get24hVolume(),
      priceChange24h: await this.get24hPriceChange(),
      holders: await this.getHolderCount(),
      liquidity: await this.getLiquidity()
    };
  }
}
```

---

# 🔐 SECURITY CONSIDERATIONS

## Wallet Security
```javascript
const walletSecurity = {
  // Never store private keys
  privateKeyHandling: 'NEVER_STORE_OR_TRANSMIT',
  
  // Always verify signatures
  signatureVerification: 'ALWAYS_VERIFY_SERVER_SIDE',
  
  // Use nonces to prevent replay attacks
  nonceStrategy: {
    generation: 'crypto.randomBytes(32)',
    expiration: 300000, // 5 minutes
    storage: 'redis_or_memory'
  },
  
  // Rate limit wallet operations
  rateLimits: {
    connections: '10_per_hour',
    signatures: '20_per_hour',
    redemptions: '5_per_day'
  },
  
  // Validate all addresses
  addressValidation: {
    format: 'base58_check',
    length: 44,
    pattern: /^[1-9A-HJ-NP-Za-km-z]{44}$/
  }
};
```

## Transaction Security
```javascript
// Transaction validation
async function validateTransaction(tx) {
  // 1. Verify transaction structure
  if (!tx.signature || !tx.from || !tx.to || !tx.amount) {
    throw new Error('Invalid transaction structure');
  }
  
  // 2. Verify signature
  const isValid = await verifyTransactionSignature(tx);
  if (!isValid) {
    throw new Error('Invalid signature');
  }
  
  // 3. Check for double spending
  const isDuplicate = await checkDuplicateTransaction(tx.signature);
  if (isDuplicate) {
    throw new Error('Duplicate transaction');
  }
  
  // 4. Validate amounts
  if (tx.amount <= 0 || tx.amount > MAX_TRANSACTION_AMOUNT) {
    throw new Error('Invalid amount');
  }
  
  // 5. Verify sender balance
  const balance = await getBalance(tx.from);
  if (balance < tx.amount) {
    throw new Error('Insufficient balance');
  }
  
  return true;
}
```

---

# 🚀 MIGRATION TO REACT/NEXT.JS

## Recommended Libraries
```bash
npm install \
  @solana/web3.js \
  @solana/spl-token \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets \
  @solana/wallet-adapter-phantom
```

## React Context Setup
```typescript
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

const WalletContextProvider: React.FC = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL;
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add other wallets here
    ],
    [network]
  );
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
```

## Custom Hooks
```typescript
// useUpliftToken hook
export const useUpliftToken = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const getBalance = useCallback(async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const tokenService = new UpliftTokenService(connection);
      const bal = await tokenService.getBalance(publicKey.toString());
      setBalance(bal);
    } catch (err) {
      console.error('Error getting balance:', err);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);
  
  useEffect(() => {
    getBalance();
  }, [getBalance]);
  
  return { balance, loading, refetch: getBalance };
};
```

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Blockchain**: Solana
**Token Standard**: SPL
**Primary Wallet**: Phantom
