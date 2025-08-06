module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'standard',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'jest'
  ],
  rules: {
    // Code quality rules
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Function and variable naming
    'camelcase': 'warn',
    'func-names': 'off',
    
    // Spacing and formatting
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    
    // Object and array rules
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // Function rules
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    
    // Error handling
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Jest specific rules
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error'
  },
  globals: {
    // Global variables available in the browser
    'window': 'readonly',
    'document': 'readonly',
    'navigator': 'readonly',
    'localStorage': 'readonly',
    'sessionStorage': 'readonly',
    'fetch': 'readonly',
    'console': 'readonly',
    
    // Firebase globals
    'firebase': 'readonly',
    
    // Chart.js globals
    'Chart': 'readonly',
    
    // GSAP globals
    'gsap': 'readonly',
    
    // Tone.js globals
    'Tone': 'readonly',
    
    // tsParticles globals
    'tsParticles': 'readonly',
    
    // Custom app globals
    'OperatorUplift': 'readonly',
    
    // Test globals
    'describe': 'readonly',
    'test': 'readonly',
    'it': 'readonly',
    'expect': 'readonly',
    'beforeEach': 'readonly',
    'afterEach': 'readonly',
    'beforeAll': 'readonly',
    'afterAll': 'readonly',
    'jest': 'readonly'
  },
  overrides: [
    {
      // HTML files (for inline scripts)
      files: ['*.html'],
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off'
      }
    }
  ]
}; 