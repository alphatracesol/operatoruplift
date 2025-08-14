# REACT/NEXT.JS MIGRATION GUIDE

## Complete Migration Strategy from Vanilla to Modern Stack

---

# 🎯 MIGRATION OVERVIEW

## Current Stack → Target Stack
| Current | Target |
|---------|--------|
| Vanilla HTML/CSS/JS | React 18 + Next.js 14 |
| Inline Styles | Tailwind CSS + CSS Modules |
| localStorage | Zustand + React Query |
| Firebase Direct | Firebase Hooks + Context |
| Vanilla Modals | Radix UI + Framer Motion |
| Manual Routing | Next.js App Router |
| Netlify Functions | Next.js API Routes |
| Service Worker | next-pwa |

## Migration Phases
1. **Phase 1**: Project Setup & Infrastructure (Week 1)
2. **Phase 2**: Core Components & Layout (Week 2)
3. **Phase 3**: Feature Migration (Weeks 3-4)
4. **Phase 4**: API & Backend Integration (Week 5)
5. **Phase 5**: Testing & Optimization (Week 6)
6. **Phase 6**: Deployment & Migration (Week 7)

---

# 🏗️ PROJECT SETUP

## 1. Initialize Next.js Project
```bash
# Create Next.js app with TypeScript
npx create-next-app@latest operator-uplift-v2 \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd operator-uplift-v2

# Install core dependencies
npm install \
  @tanstack/react-query \
  zustand \
  firebase \
  react-firebase-hooks \
  @solana/web3.js \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-wallets \
  framer-motion \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  react-hook-form \
  zod \
  date-fns \
  chart.js \
  react-chartjs-2 \
  next-pwa \
  next-themes

# Dev dependencies
npm install -D \
  @types/node \
  @types/react \
  prettier \
  eslint-config-prettier \
  husky \
  lint-staged \
  @testing-library/react \
  @testing-library/jest-dom \
  jest \
  cypress
```

## 2. Project Structure
```
operator-uplift-v2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (app)/              # Main app group
│   │   │   ├── dashboard/
│   │   │   ├── focus/
│   │   │   ├── goals/
│   │   │   ├── habits/
│   │   │   ├── ai-chat/
│   │   │   ├── social/
│   │   │   ├── leaderboard/
│   │   │   ├── achievements/
│   │   │   ├── wallet/
│   │   │   └── settings/
│   │   ├── api/                # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── modals/             # Modal components
│   │   ├── cards/              # Card components
│   │   ├── charts/             # Chart components
│   │   └── layouts/            # Layout components
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities
│   ├── services/               # API services
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utility functions
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── tests/                      # Test files
└── config/                     # Configuration files
```

---

# 🧩 CORE COMPONENTS

## 1. Layout Components

### RootLayout.tsx
```typescript
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
```

### Providers.tsx
```typescript
'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FirebaseProvider } from '@/contexts/firebase'
import { WalletProvider } from '@/contexts/wallet'
import { AuthProvider } from '@/contexts/auth'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <FirebaseProvider>
          <WalletProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </WalletProvider>
        </FirebaseProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
```

## 2. State Management

### Zustand Store Example
```typescript
// stores/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: User | null
  level: number
  xp: number
  streak: number
  tokens: number
  points: number
  
  // Actions
  setUser: (user: User) => void
  updateXP: (amount: number) => void
  updateStreak: (streak: number) => void
  updateTokens: (amount: number) => void
  updatePoints: (amount: number) => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      level: 1,
      xp: 0,
      streak: 0,
      tokens: 0,
      points: 0,
      
      setUser: (user) => set({ user }),
      updateXP: (amount) => set((state) => {
        const newXP = state.xp + amount
        const newLevel = calculateLevel(newXP)
        return { xp: newXP, level: newLevel }
      }),
      updateStreak: (streak) => set({ streak }),
      updateTokens: (amount) => set((state) => ({ 
        tokens: state.tokens + amount 
      })),
      updatePoints: (amount) => set((state) => ({ 
        points: state.points + amount 
      })),
      reset: () => set({
        user: null,
        level: 1,
        xp: 0,
        streak: 0,
        tokens: 0,
        points: 0
      })
    }),
    {
      name: 'user-storage',
    }
  )
)
```

## 3. Custom Hooks

### useAuth Hook
```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore'

export function useAuth() {
  const [user, loading, error] = useAuthState(auth)
  const [userData, setUserData] = useState<UserData | null>(null)
  const setStoreUser = useUserStore((state) => state.setUser)
  
  useEffect(() => {
    if (user) {
      // Fetch user data from Firestore
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData
          setUserData(data)
          setStoreUser(data)
        }
      }
      fetchUserData()
    } else {
      setUserData(null)
      useUserStore.getState().reset()
    }
  }, [user, setStoreUser])
  
  return {
    user,
    userData,
    loading,
    error,
    isAuthenticated: !!user
  }
}
```

### useFocusTimer Hook
```typescript
// hooks/useFocusTimer.ts
import { useState, useEffect, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useUserStore } from '@/stores/userStore'

export function useFocusTimer(duration: number = 25) {
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const updateXP = useUserStore((state) => state.updateXP)
  const updateTokens = useUserStore((state) => state.updateTokens)
  
  const saveMutation = useMutation({
    mutationFn: async (session: FocusSession) => {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      })
      return response.json()
    },
    onSuccess: (data) => {
      updateXP(data.xpEarned)
      updateTokens(data.tokensEarned)
    }
  })
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      completeSession()
    }
    
    return () => clearInterval(interval)
  }, [isRunning, isPaused, timeLeft])
  
  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])
  
  const pause = useCallback(() => {
    setIsPaused(true)
  }, [])
  
  const resume = useCallback(() => {
    setIsPaused(false)
  }, [])
  
  const stop = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(duration * 60)
  }, [duration])
  
  const completeSession = useCallback(() => {
    const session: FocusSession = {
      duration: duration * 60 - timeLeft,
      completedAt: new Date(),
      xpEarned: Math.floor((duration * 60 - timeLeft) / 60),
      tokensEarned: Math.floor((duration * 60 - timeLeft) / 60 * 0.5)
    }
    
    saveMutation.mutate(session)
    stop()
  }, [duration, timeLeft, saveMutation, stop])
  
  return {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    completeSession,
    formatTime: (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }
}
```

---

# 🎨 UI COMPONENT MIGRATION

## Modal System Migration

### Current Modal → Radix UI Dialog
```typescript
// components/modals/BaseModal.tsx
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BaseModal({ isOpen, onClose, title, children }: BaseModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
              >
                <div className="bg-background border border-border rounded-2xl p-6">
                  {title && (
                    <Dialog.Title className="text-2xl font-bold mb-4">
                      {title}
                    </Dialog.Title>
                  )}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10 transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
```

### Achievement Modal Example
```typescript
// components/modals/AchievementModal.tsx
import { BaseModal } from './BaseModal'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
  achievement: Achievement
}

export function AchievementModal({ 
  isOpen, 
  onClose, 
  achievement 
}: AchievementModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isOpen])
  
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-6xl mb-4"
        >
          {achievement.icon}
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Achievement Unlocked!
        </h2>
        
        <h3 className="text-xl font-semibold mb-2">
          {achievement.name}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {achievement.description}
        </p>
        
        <div className="flex justify-center gap-4">
          <div className="bg-primary/10 px-4 py-2 rounded-lg">
            <span className="text-primary font-bold">+{achievement.xp} XP</span>
          </div>
          {achievement.tokens && (
            <div className="bg-accent/10 px-4 py-2 rounded-lg">
              <span className="text-accent font-bold">+{achievement.tokens} Tokens</span>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => shareAchievement(achievement)}
            className="btn btn-primary"
          >
            Share
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Continue
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
```

---

# 🔄 DATA MIGRATION

## Firebase Integration
```typescript
// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
```

## API Routes Migration
```typescript
// app/api/points/redeem/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'
import { db } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    // Verify auth token
    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid
    
    // Get request body
    const { points } = await req.json()
    
    // Validate redemption
    if (points < 100 || points > 10000) {
      return NextResponse.json(
        { error: 'Invalid points amount' },
        { status: 400 }
      )
    }
    
    // Check user balance
    const userDoc = await db.collection('users').doc(userId).get()
    const userData = userDoc.data()
    
    if (!userData || userData.points < points) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      )
    }
    
    // Process redemption
    const tokens = points * 0.5 // Conversion rate
    
    // Update user balance
    await db.collection('users').doc(userId).update({
      points: userData.points - points,
      tokens: userData.tokens + tokens
    })
    
    // Create redemption record
    await db.collection('redemptions').add({
      userId,
      points,
      tokens,
      status: 'completed',
      createdAt: new Date()
    })
    
    return NextResponse.json({
      success: true,
      pointsRedeemed: points,
      tokensEarned: tokens
    })
  } catch (error) {
    console.error('Redemption error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

# 🧪 TESTING STRATEGY

## Component Testing
```typescript
// __tests__/components/FocusTimer.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FocusTimer } from '@/components/FocusTimer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('FocusTimer', () => {
  it('should start timer when start button is clicked', async () => {
    render(<FocusTimer />, { wrapper })
    
    const startButton = screen.getByText('Start Focus')
    fireEvent.click(startButton)
    
    await waitFor(() => {
      expect(screen.getByText('Pause')).toBeInTheDocument()
    })
  })
  
  it('should display correct time format', () => {
    render(<FocusTimer initialMinutes={25} />, { wrapper })
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })
})
```

## E2E Testing
```typescript
// cypress/e2e/focus-session.cy.ts
describe('Focus Session Flow', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password')
    cy.visit('/focus')
  })
  
  it('should complete a focus session and earn rewards', () => {
    // Start session
    cy.get('[data-cy=start-focus]').click()
    
    // Fast forward time (using cy.clock)
    cy.clock()
    cy.tick(25 * 60 * 1000) // 25 minutes
    
    // Check completion
    cy.get('[data-cy=session-complete]').should('be.visible')
    cy.get('[data-cy=xp-earned]').should('contain', '+25 XP')
    cy.get('[data-cy=tokens-earned]').should('contain', '+12 Tokens')
  })
})
```

---

# 🚀 DEPLOYMENT

## Vercel Deployment
```json
// vercel.json
{
  "functions": {
    "app/api/ai/chat/route.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Environment Variables
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Server-side only
FIREBASE_ADMIN_SDK_KEY=
DEEPSEEK_API_KEY=
OPENAI_API_KEY=
HELIUS_API_KEY=
UPLIFT_TOKEN_MINT=
```

---

# 📊 MIGRATION CHECKLIST

## Phase 1: Setup ✅
- [ ] Initialize Next.js project
- [ ] Install dependencies
- [ ] Configure TypeScript
- [ ] Setup Tailwind CSS
- [ ] Configure ESLint/Prettier
- [ ] Setup Git hooks

## Phase 2: Core Infrastructure
- [ ] Firebase configuration
- [ ] Authentication context
- [ ] Zustand stores
- [ ] React Query setup
- [ ] Wallet integration
- [ ] PWA configuration

## Phase 3: Component Migration
- [ ] Layout components
- [ ] Navigation system
- [ ] Modal system
- [ ] Form components
- [ ] Card components
- [ ] Chart components

## Phase 4: Feature Migration
- [ ] Authentication flow
- [ ] Dashboard
- [ ] Focus timer
- [ ] Goal management
- [ ] Habit tracking
- [ ] AI chat
- [ ] Social features
- [ ] Leaderboard
- [ ] Achievements
- [ ] Token wallet

## Phase 5: API Migration
- [ ] User endpoints
- [ ] Session endpoints
- [ ] Points/redemption
- [ ] AI proxy
- [ ] Leaderboard
- [ ] Token operations

## Phase 6: Testing & Optimization
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility audit

## Phase 7: Deployment
- [ ] Environment setup
- [ ] CI/CD pipeline
- [ ] Staging deployment
- [ ] Production deployment
- [ ] DNS configuration
- [ ] Monitoring setup

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Migration Timeline**: 6-8 weeks
**Team Size**: 4 developers
