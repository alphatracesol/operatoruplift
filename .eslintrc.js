module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    // Code Quality
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Best Practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-const-assign': 'error',
    'no-dupe-keys': 'error',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-else-if': 'error',
    'no-duplicate-imports': 'error',
    
    // Performance
    'no-loop-func': 'error',
    'no-new-object': 'error',
    'no-new-array': 'error',
    'no-new-wrappers': 'error',
    'no-array-constructor': 'error',
    'no-new': 'error',
    
    // Security
    'no-implied-eval': 'error',
    'no-script-url': 'error',
    'no-unsafe-finally': 'error',
    
    // Readability
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 2 }],
    
    // ES6+
    'arrow-spacing': 'error',
    'no-useless-constructor': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-destructuring': ['error', { 'array': false, 'object': true }],
    
    // Function Optimization
    'no-param-reassign': 'error',
    'prefer-rest-params': 'error',
    'no-useless-return': 'error',
    
    // Variable Declarations
    'no-use-before-define': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    
    // Control Flow
    'no-else-return': 'error',
    'no-unneeded-ternary': 'error',
    'no-nested-ternary': 'error',
    
    // Object/Array
    'no-array-constructor': 'error',
    'no-new-object': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // Async/Await
    'no-async-promise-executor': 'error',
    'require-await': 'error',
    'no-return-await': 'error'
  },
  globals: {
    // Browser globals
    'window': 'readonly',
    'document': 'readonly',
    'navigator': 'readonly',
    'localStorage': 'readonly',
    'sessionStorage': 'readonly',
    'console': 'readonly',
    'setTimeout': 'readonly',
    'setInterval': 'readonly',
    'clearTimeout': 'readonly',
    'clearInterval': 'readonly',
    'fetch': 'readonly',
    'Promise': 'readonly',
    'JSON': 'readonly',
    'Math': 'readonly',
    'Date': 'readonly',
    'Array': 'readonly',
    'Object': 'readonly',
    'String': 'readonly',
    'Number': 'readonly',
    'Boolean': 'readonly',
    'RegExp': 'readonly',
    'Error': 'readonly',
    'Map': 'readonly',
    'Set': 'readonly',
    'WeakMap': 'readonly',
    'WeakSet': 'readonly',
    'Symbol': 'readonly',
    'Proxy': 'readonly',
    'Reflect': 'readonly',
    'Intl': 'readonly',
    
    // Third-party libraries
    'Chart': 'readonly',
    'GSAP': 'readonly',
    'Tone': 'readonly',
    'firebase': 'readonly',
    'tsParticles': 'readonly',
    'dateFns': 'readonly'
  }
}; 