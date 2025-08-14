# CSS & STYLING PATTERNS

## Design System & Component Styles

---

# 🎨 DESIGN SYSTEM OVERVIEW

## Core Design Principles
1. **Dark Mode First**: Optimized for low-light productivity
2. **Glass Morphism**: Translucent surfaces with backdrop blur
3. **Neumorphism Elements**: Subtle depth and tactile feel
4. **Micro-animations**: Smooth transitions and feedback
5. **Mobile-First Responsive**: Progressive enhancement
6. **Accessibility**: WCAG 2.1 AA compliant

---

# 🎯 COLOR SYSTEM

## CSS Variables
```css
:root {
  /* Primary Colors */
  --primary-color: #f97316;        /* Orange - Main brand color */
  --primary-dark: #ea580c;         /* Darker orange for hover */
  --primary-light: #fb923c;        /* Lighter orange for accents */
  --primary-rgb: 249, 115, 22;     /* RGB for opacity */
  
  /* Secondary Colors */
  --secondary-color: #1e293b;      /* Dark slate */
  --secondary-dark: #0f172a;       /* Darker slate */
  --secondary-light: #334155;      /* Lighter slate */
  
  /* Accent Colors */
  --accent-color: #fb923c;          /* Bright orange accent */
  --accent-gradient: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
  
  /* Background Colors */
  --bg-primary: #0a0a0a;           /* Main background */
  --bg-secondary: #1a1a1a;         /* Card background */
  --bg-tertiary: #2a2a2a;          /* Elevated surfaces */
  --surface: rgba(255, 255, 255, 0.02);
  
  /* Text Colors */
  --text-primary: #ffffff;          /* Primary text */
  --text-secondary: #94a3b8;        /* Secondary text */
  --text-muted: #64748b;            /* Muted text */
  --text-disabled: #475569;         /* Disabled text */
  
  /* Status Colors */
  --success: #10b981;               /* Green */
  --success-bg: rgba(16, 185, 129, 0.1);
  --warning: #f59e0b;               /* Yellow */
  --warning-bg: rgba(245, 158, 11, 0.1);
  --error: #ef4444;                 /* Red */
  --error-bg: rgba(239, 68, 68, 0.1);
  --info: #3b82f6;                  /* Blue */
  --info-bg: rgba(59, 130, 246, 0.1);
  
  /* Glass Morphism */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --backdrop-blur: blur(16px);
  
  /* Borders */
  --border-light: rgba(255, 255, 255, 0.1);
  --border-medium: rgba(255, 255, 255, 0.15);
  --border-heavy: rgba(255, 255, 255, 0.2);
  --border-radius: 12px;
  --border-radius-sm: 8px;
  --border-radius-lg: 16px;
  --border-radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px rgba(249, 115, 22, 0.3);
  
  /* Animations */
  --transition-fast: 150ms;
  --transition-base: 250ms;
  --transition-slow: 350ms;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Light Mode Override */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);
}
```

---

# 🏗️ LAYOUT PATTERNS

## Container System
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 768px) {
  .container { padding: 0 2rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 3rem; }
}

/* Grid System */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (min-width: 640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Flexbox Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
```

---

# 🎴 COMPONENT STYLES

## Cards
```css
.card {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  transition: all var(--transition-base) var(--ease-in-out);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent,
    var(--primary-color),
    transparent
  );
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(249, 115, 22, 0.2);
}

.card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-icon {
  font-size: 1.5rem;
  opacity: 0.8;
}

.card-body {
  color: var(--text-secondary);
}

.card-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
}
```

## Buttons
```css
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all var(--transition-fast) var(--ease-in-out);
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

/* Primary Button */
.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.btn-primary:active::before {
  width: 300px;
  height: 300px;
}

/* Secondary Button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

/* Button Sizes */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-lg {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
}

/* Button States */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}
```

## Forms
```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all var(--transition-fast) var(--ease-in-out);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* Input with icon */
.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.input-group .form-input {
  padding-left: 2.75rem;
}

/* Checkbox & Radio */
.form-checkbox,
.form-radio {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid var(--border-light);
  border-radius: var(--border-radius-sm);
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.form-radio {
  border-radius: 50%;
}

.form-checkbox:checked,
.form-radio:checked {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.form-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
}

.form-radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}
```

## Modals
```css
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.modal.active {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--border-radius-xl);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: modalSlideUp var(--transition-base) var(--ease-bounce);
}

@keyframes modalSlideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.modal-body {
  color: var(--text-secondary);
}

.modal-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
```

---

# ✨ ANIMATIONS

## Keyframe Animations
```css
/* Spin */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

/* Shimmer (for skeletons) */
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Glow */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
  50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.5); }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide In */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

## Utility Classes
```css
/* Animation utilities */
.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-bounce { animation: bounce 1s infinite; }
.animate-glow { animation: glow 2s ease-in-out infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }

/* Transition utilities */
.transition-all { transition: all var(--transition-base); }
.transition-colors { transition: color, background-color, border-color var(--transition-base); }
.transition-transform { transition: transform var(--transition-base); }
.transition-opacity { transition: opacity var(--transition-base); }

/* Transform utilities */
.scale-95 { transform: scale(0.95); }
.scale-100 { transform: scale(1); }
.scale-105 { transform: scale(1.05); }
.scale-110 { transform: scale(1.1); }

.rotate-0 { transform: rotate(0deg); }
.rotate-45 { transform: rotate(45deg); }
.rotate-90 { transform: rotate(90deg); }
.rotate-180 { transform: rotate(180deg); }

/* Hover effects */
.hover\:scale-105:hover { transform: scale(1.05); }
.hover\:scale-110:hover { transform: scale(1.1); }
.hover\:rotate-12:hover { transform: rotate(12deg); }
.hover\:shadow-lg:hover { box-shadow: var(--shadow-lg); }
.hover\:shadow-glow:hover { box-shadow: var(--shadow-glow); }
```

---

# 📱 RESPONSIVE DESIGN

## Breakpoints
```css
/* Mobile First Approach */
/* Default: 0-639px */

/* Small devices */
@media (min-width: 640px) {
  /* sm: prefix */
}

/* Medium devices */
@media (min-width: 768px) {
  /* md: prefix */
}

/* Large devices */
@media (min-width: 1024px) {
  /* lg: prefix */
}

/* Extra large devices */
@media (min-width: 1280px) {
  /* xl: prefix */
}

/* 2XL devices */
@media (min-width: 1536px) {
  /* 2xl: prefix */
}
```

## Responsive Utilities
```css
/* Display */
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.flex { display: flex; }
.grid { display: grid; }

@media (min-width: 640px) {
  .sm\:hidden { display: none; }
  .sm\:block { display: block; }
  .sm\:flex { display: flex; }
  .sm\:grid { display: grid; }
}

@media (min-width: 768px) {
  .md\:hidden { display: none; }
  .md\:block { display: block; }
  .md\:flex { display: flex; }
  .md\:grid { display: grid; }
}

@media (min-width: 1024px) {
  .lg\:hidden { display: none; }
  .lg\:block { display: block; }
  .lg\:flex { display: flex; }
  .lg\:grid { display: grid; }
}

/* Spacing */
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

@media (min-width: 640px) {
  .sm\:p-6 { padding: 1.5rem; }
  .sm\:p-8 { padding: 2rem; }
}

@media (min-width: 768px) {
  .md\:p-8 { padding: 2rem; }
  .md\:p-10 { padding: 2.5rem; }
}

/* Text Size */
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }

@media (min-width: 640px) {
  .sm\:text-lg { font-size: 1.125rem; }
  .sm\:text-xl { font-size: 1.25rem; }
  .sm\:text-2xl { font-size: 1.5rem; }
}

@media (min-width: 768px) {
  .md\:text-xl { font-size: 1.25rem; }
  .md\:text-2xl { font-size: 1.5rem; }
  .md\:text-3xl { font-size: 1.875rem; }
  .md\:text-4xl { font-size: 2.25rem; }
}
```

---

# 🎭 SPECIAL EFFECTS

## Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-primary {
  background: rgba(249, 115, 22, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(249, 115, 22, 0.2);
}
```

## Gradient Effects
```css
.gradient-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-border {
  position: relative;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--border-radius-lg);
  padding: 2px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

## Skeleton Loading
```css
.skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-sm);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  animation: shimmer 1.2s infinite;
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.skeleton-title {
  height: 1.5rem;
  width: 50%;
  margin-bottom: 1rem;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-card {
  height: 200px;
  border-radius: var(--border-radius-lg);
}
```

---

# 🚀 MIGRATION TO TAILWIND CSS

## Recommended Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316',
          dark: '#ea580c',
          light: '#fb923c',
        },
        background: {
          DEFAULT: '#0a0a0a',
          secondary: '#1a1a1a',
          tertiary: '#2a2a2a',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
```

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**CSS Architecture**: Utility-First with Components
**Preprocessor**: None (vanilla CSS)
**Future**: Tailwind CSS + CSS Modules
