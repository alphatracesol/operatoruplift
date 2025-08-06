// Jest setup file for Operator Uplift testing
const { JSDOM } = require('jsdom');
const { TextEncoder, TextDecoder } = require('util');

// Set up TextEncoder and TextDecoder globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Create a virtual DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Set up global variables
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.location = dom.window.location;
global.history = dom.window.history;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;

// Mock Firebase
global.firebase = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn()
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      add: jest.fn(),
      where: jest.fn(),
      orderBy: jest.fn(),
      limit: jest.fn(),
      get: jest.fn()
    }))
  }))
};

// Mock Chart.js
global.Chart = jest.fn().mockImplementation(() => ({
  destroy: jest.fn(),
  update: jest.fn(),
  resize: jest.fn()
}));

// Mock GSAP
global.gsap = {
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn()
  }))
};

// Mock Tone.js
global.Tone = {
  start: jest.fn(),
  Player: jest.fn(),
  Synth: jest.fn(),
  Transport: {
    start: jest.fn(),
    stop: jest.fn()
  }
};

// Mock tsParticles
global.tsParticles = {
  load: jest.fn(),
  create: jest.fn()
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Helper function to load app.html content
global.loadAppHTML = async () => {
  const fs = require('fs');
  const path = require('path');
  const appHTML = fs.readFileSync(path.join(__dirname, '../app.html'), 'utf8');
  document.documentElement.innerHTML = appHTML;
  
  // Execute scripts
  const scripts = document.querySelectorAll('script');
  for (const script of scripts) {
    if (script.textContent) {
      try {
        eval(script.textContent);
      } catch (error) {
        console.warn('Script execution error:', error.message);
      }
    }
  }
};

// Helper function to simulate user interactions
global.simulateClick = (element) => {
  const event = new dom.window.Event('click', { bubbles: true });
  element.dispatchEvent(event);
};

global.simulateInput = (element, value) => {
  element.value = value;
  const event = new dom.window.Event('input', { bubbles: true });
  element.dispatchEvent(event);
};

global.simulateSubmit = (form) => {
  const event = new dom.window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
}); 