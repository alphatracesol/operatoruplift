/**
 * Jest Test Setup
 * Configures the testing environment for Operator Uplift
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// Mock setTimeout and setInterval (fixed to avoid recursion)
const originalSetTimeout = global.setTimeout;
const originalSetInterval = global.setInterval;

global.setTimeout = jest.fn((cb, delay) => {
  const id = Math.random();
  originalSetTimeout(() => cb(), delay || 0);
  return id;
});

global.setInterval = jest.fn((cb, delay) => {
  const id = Math.random();
  originalSetInterval(() => cb(), delay || 1000);
  return id;
});

// Mock clearTimeout and clearInterval
global.clearTimeout = jest.fn();
global.clearInterval = jest.fn();

// Mock crypto for secure random values
global.crypto = {
  getRandomValues: jest.fn((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
};

// Mock Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: { setValueAtTime: jest.fn() },
  })),
}));

// Mock GSAP
global.gsap = {
  to: jest.fn(() => ({ then: jest.fn() })),
  from: jest.fn(() => ({ then: jest.fn() })),
  fromTo: jest.fn(() => ({ then: jest.fn() })),
  timeline: jest.fn(() => ({
    to: jest.fn(() => ({ then: jest.fn() })),
    from: jest.fn(() => ({ then: jest.fn() })),
    fromTo: jest.fn(() => ({ then: jest.fn() })),
  })),
  set: jest.fn(),
  getProperty: jest.fn(),
  setProperty: jest.fn(),
};

// Mock Tone.js
global.Tone = {
  start: jest.fn(),
  Player: jest.fn(() => ({
    toDestination: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  Synth: jest.fn(() => ({
    toDestination: jest.fn(),
    triggerAttackRelease: jest.fn(),
  })),
};

// Mock Firebase
global.firebase = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      add: jest.fn(),
      where: jest.fn(),
      orderBy: jest.fn(),
      limit: jest.fn(),
    })),
  })),
};

// Mock environment variables
process.env = {
  ...process.env,
  HF_TOKEN: 'test_token',
  FIREBASE_API_KEY: 'test_api_key',
  FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
  FIREBASE_PROJECT_ID: 'test-project',
  FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
  FIREBASE_MESSAGING_SENDER_ID: '123456789',
  FIREBASE_APP_ID: 'test_app_id',
};

// Setup test utilities
global.testUtils = {
  // Create a mock DOM element
  createMockElement: (tagName = 'div', attributes = {}) => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  },

  // Create a mock event
  createMockEvent: (type, options = {}) => {
    return new Event(type, options);
  },

  // Wait for async operations
  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock user interaction
  simulateUserInteraction: (element, eventType = 'click') => {
    const event = new Event(eventType, { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
  },

  // Mock Firebase user
  mockFirebaseUser: (userData = {}) => ({
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
    ...userData
  }),

  // Mock Firestore document
  mockFirestoreDoc: (data = {}) => ({
    id: 'test-doc-id',
    data: () => data,
    exists: true,
    ref: {
      id: 'test-doc-id',
      path: 'test/path'
    }
  }),

  // Clear all mocks
  clearAllMocks: () => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  },
};

// Global test configuration
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset localStorage mock
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  // Reset fetch mock
  fetch.mockClear();
  
  // Reset console mocks
  console.log.mockClear();
  console.error.mockClear();
  console.warn.mockClear();
});

afterEach(() => {
  // Clean up after each test
  document.body.innerHTML = '';
}); 