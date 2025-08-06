// ===== PHASE 7: AESTHETIC & STORY ENHANCEMENTS =====
// Glassmorphism, Gradients, Animations, and Narrative Arc

console.log('🎨 Starting Phase 7: Aesthetic & Story Enhancements');

// Enhanced CSS Variables for Advanced Theming
const AESTHETIC_CONFIG = {
    // Glassmorphism Settings
    glassBlur: 'blur(20px)',
    glassOpacity: 0.15,
    glassBorder: '1px solid rgba(255, 255, 255, 0.2)',
    
    // Gradient Presets
    gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        error: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        light: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    },
    
    // Animation Settings
    animations: {
        duration: {
            fast: '0.2s',
            normal: '0.3s',
            slow: '0.5s',
            epic: '1s'
        },
        easing: {
            smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }
    },
    
    // Story Narrative Elements
    story: {
        phases: [
            'disappointment',
            'awakening',
            'discovery',
            'transformation',
            'empowerment',
            'ascent'
        ],
        colors: {
            disappointment: '#6b7280',
            awakening: '#3b82f6',
            discovery: '#8b5cf6',
            transformation: '#f59e0b',
            empowerment: '#10b981',
            ascent: '#ef4444'
        }
    }
};

// Enhanced Glassmorphism System
class GlassmorphismSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.createGlassStyles();
        this.applyGlassEffects();
        this.setupGlassAnimations();
    }
    
    createGlassStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced Glassmorphism Styles */
            .glass {
                background: rgba(255, 255, 255, ${AESTHETIC_CONFIG.glassOpacity});
                backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                -webkit-backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                border: ${AESTHETIC_CONFIG.glassBorder};
                border-radius: 16px;
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                transition: all ${AESTHETIC_CONFIG.animations.duration.normal} ${AESTHETIC_CONFIG.animations.easing.smooth};
            }
            
            .glass:hover {
                background: rgba(255, 255, 255, ${AESTHETIC_CONFIG.glassOpacity + 0.05});
                transform: translateY(-2px);
                box-shadow: 
                    0 12px 40px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
            
            .glass-card {
                background: rgba(42, 42, 42, 0.8);
                backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                -webkit-backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 24px;
                margin: 16px;
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            
            .glass-button {
                background: ${AESTHETIC_CONFIG.gradients.primary};
                border: none;
                border-radius: 12px;
                padding: 12px 24px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all ${AESTHETIC_CONFIG.animations.duration.normal} ${AESTHETIC_CONFIG.animations.easing.smooth};
                position: relative;
                overflow: hidden;
            }
            
            .glass-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }
            
            .glass-button:hover::before {
                left: 100%;
            }
            
            .glass-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
            
            .glass-modal {
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                -webkit-backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    applyGlassEffects() {
        // Apply glass effects to existing elements
        const elementsToGlass = document.querySelectorAll('.card, .modal, .button, .nav-item');
        elementsToGlass.forEach(element => {
            element.classList.add('glass');
        });
    }
    
    setupGlassAnimations() {
        // Add entrance animations for glass elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = `all ${AESTHETIC_CONFIG.animations.duration.normal} ${AESTHETIC_CONFIG.animations.easing.smooth}`;
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        });
        
        document.querySelectorAll('.glass').forEach(element => {
            observer.observe(element);
        });
    }
}

// Enhanced Gradient System
class GradientSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.createGradientStyles();
        this.applyGradientEffects();
        this.setupGradientAnimations();
    }
    
    createGradientStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced Gradient Styles */
            .gradient-bg {
                background: ${AESTHETIC_CONFIG.gradients.primary};
                background-size: 200% 200%;
                animation: gradientShift 3s ease infinite;
            }
            
            .gradient-text {
                background: ${AESTHETIC_CONFIG.gradients.accent};
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gradientText 2s ease infinite;
            }
            
            .gradient-border {
                position: relative;
                background: ${AESTHETIC_CONFIG.gradients.primary};
                padding: 2px;
                border-radius: 12px;
            }
            
            .gradient-border::before {
                content: '';
                position: absolute;
                inset: 0;
                background: ${AESTHETIC_CONFIG.gradients.primary};
                border-radius: 12px;
                z-index: -1;
                animation: gradientBorder 2s ease infinite;
            }
            
            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            @keyframes gradientText {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            @keyframes gradientBorder {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
    
    applyGradientEffects() {
        // Apply gradient effects to buttons and important elements
        const gradientElements = document.querySelectorAll('.button, .nav-item, .card-header');
        gradientElements.forEach(element => {
            element.classList.add('gradient-bg');
        });
        
        // Apply gradient text to headings
        const gradientTextElements = document.querySelectorAll('h1, h2, h3');
        gradientTextElements.forEach(element => {
            element.classList.add('gradient-text');
        });
    }
    
    setupGradientAnimations() {
        // Add gradient animation triggers
        document.addEventListener('mousemove', (e) => {
            const gradientElements = document.querySelectorAll('.gradient-bg');
            gradientElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                element.style.backgroundPosition = `${x}px ${y}px`;
            });
        });
    }
}

// Enhanced Animation System
class AnimationSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.createAnimationStyles();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupEntranceAnimations();
    }
    
    createAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced Animation Styles */
            .animate-fade-in {
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 0.6s ${AESTHETIC_CONFIG.animations.easing.smooth} forwards;
            }
            
            .animate-bounce-in {
                opacity: 0;
                transform: scale(0.8);
                animation: bounceIn 0.8s ${AESTHETIC_CONFIG.animations.easing.bounce} forwards;
            }
            
            .animate-slide-in {
                opacity: 0;
                transform: translateX(-30px);
                animation: slideInLeft 0.5s ${AESTHETIC_CONFIG.animations.easing.smooth} forwards;
            }
            
            .animate-float {
                animation: float 3s ${AESTHETIC_CONFIG.animations.easing.smooth} infinite;
            }
            
            .animate-pulse {
                animation: pulse 2s ${AESTHETIC_CONFIG.animations.easing.smooth} infinite;
            }
            
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes bounceIn {
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @keyframes slideInLeft {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .hover-lift {
                transition: transform ${AESTHETIC_CONFIG.animations.duration.normal} ${AESTHETIC_CONFIG.animations.easing.smooth};
            }
            
            .hover-lift:hover {
                transform: translateY(-5px);
            }
            
            .hover-glow {
                transition: box-shadow ${AESTHETIC_CONFIG.animations.duration.normal} ${AESTHETIC_CONFIG.animations.easing.smooth};
            }
            
            .hover-glow:hover {
                box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        });
        
        document.querySelectorAll('.card, .section, .feature').forEach(element => {
            observer.observe(element);
        });
    }
    
    setupHoverAnimations() {
        // Add hover animations to interactive elements
        const hoverElements = document.querySelectorAll('.button, .card, .nav-item');
        hoverElements.forEach(element => {
            element.classList.add('hover-lift', 'hover-glow');
        });
    }
    
    setupEntranceAnimations() {
        // Add entrance animations with staggered delays
        const entranceElements = document.querySelectorAll('.animate-entrance');
        entranceElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('animate-fade-in');
        });
    }
}

// Story Narrative System
class StorySystem {
    constructor() {
        this.currentPhase = 0;
        this.init();
    }
    
    init() {
        this.createStoryStyles();
        this.setupStoryProgression();
        this.applyStoryTheme();
    }
    
    createStoryStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Story Narrative Styles */
            .story-phase {
                transition: all ${AESTHETIC_CONFIG.animations.duration.slow} ${AESTHETIC_CONFIG.animations.easing.smooth};
            }
            
            .story-phase.disappointment {
                background: ${AESTHETIC_CONFIG.story.colors.disappointment};
                filter: grayscale(0.3);
            }
            
            .story-phase.awakening {
                background: ${AESTHETIC_CONFIG.story.colors.awakening};
                filter: brightness(1.1);
            }
            
            .story-phase.discovery {
                background: ${AESTHETIC_CONFIG.story.colors.discovery};
                filter: saturate(1.2);
            }
            
            .story-phase.transformation {
                background: ${AESTHETIC_CONFIG.story.colors.transformation};
                filter: contrast(1.1);
            }
            
            .story-phase.empowerment {
                background: ${AESTHETIC_CONFIG.story.colors.empowerment};
                filter: brightness(1.2) saturate(1.1);
            }
            
            .story-phase.ascent {
                background: ${AESTHETIC_CONFIG.story.colors.ascent};
                filter: brightness(1.3) saturate(1.2) contrast(1.1);
            }
            
            .story-progress {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                border-radius: 12px;
                padding: 16px;
                z-index: 1000;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .story-progress-bar {
                width: 200px;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-top: 8px;
            }
            
            .story-progress-fill {
                height: 100%;
                background: ${AESTHETIC_CONFIG.gradients.primary};
                transition: width ${AESTHETIC_CONFIG.animations.duration.slow} ${AESTHETIC_CONFIG.animations.easing.smooth};
            }
        `;
        document.head.appendChild(style);
    }
    
    setupStoryProgression() {
        // Create story progress indicator
        this.createStoryProgress();
        
        // Setup story phase transitions
        this.setupPhaseTransitions();
    }
    
    createStoryProgress() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'story-progress';
        progressContainer.innerHTML = `
            <div style="color: white; font-size: 14px; font-weight: 600;">Story Progress</div>
            <div class="story-progress-bar">
                <div class="story-progress-fill" style="width: 0%"></div>
            </div>
        `;
        document.body.appendChild(progressContainer);
    }
    
    setupPhaseTransitions() {
        // Simulate story progression based on user interactions
        let progress = 0;
        const progressFill = document.querySelector('.story-progress-fill');
        
        // Update progress based on various triggers
        const updateProgress = (increment) => {
            progress = Math.min(100, progress + increment);
            progressFill.style.width = `${progress}%`;
            
            // Determine current story phase
            const phaseIndex = Math.floor((progress / 100) * AESTHETIC_CONFIG.story.phases.length);
            this.setStoryPhase(phaseIndex);
        };
        
        // Trigger progress on various events
        document.addEventListener('click', () => updateProgress(2));
        document.addEventListener('scroll', () => updateProgress(0.5));
        
        // Simulate automatic progression
        setInterval(() => updateProgress(0.1), 5000);
    }
    
    setStoryPhase(phaseIndex) {
        if (phaseIndex !== this.currentPhase && phaseIndex < AESTHETIC_CONFIG.story.phases.length) {
            this.currentPhase = phaseIndex;
            const phaseName = AESTHETIC_CONFIG.story.phases[phaseIndex];
            
            // Apply story phase to body
            document.body.className = `story-phase ${phaseName}`;
            
            // Trigger celebration for phase completion
            if (window.app && window.app.celebrations) {
                window.app.celebrations.celebrate('confetti');
            }
            
            console.log(`🎭 Story Phase: ${phaseName}`);
        }
    }
    
    applyStoryTheme() {
        // Apply initial story theme
        this.setStoryPhase(0);
    }
}

// Theme System
class ThemeSystem {
    constructor() {
        this.currentTheme = 'dark';
        this.init();
    }
    
    init() {
        this.createThemeStyles();
        this.setupThemeToggle();
        this.applyTheme();
    }
    
    createThemeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Theme Styles */
            [data-theme="light"] {
                --bg-primary: #f8fafc;
                --bg-secondary: #ffffff;
                --bg-tertiary: #f1f5f9;
                --text-primary: #1e293b;
                --text-secondary: #64748b;
                --text-muted: #94a3b8;
                --border: #cbd5e1;
                --card-glass: rgba(241, 245, 249, 0.8);
                --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
            }
            
            [data-theme="dark"] {
                --bg-primary: #0a0a0a;
                --bg-secondary: #1a1a1a;
                --bg-tertiary: #2a2a2a;
                --text-primary: #ffffff;
                --text-secondary: #b0b0b0;
                --text-muted: #8a8a8a;
                --border: #404040;
                --card-glass: rgba(42, 42, 42, 0.8);
                --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
            }
            
            .theme-toggle {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: ${AESTHETIC_CONFIG.glassBlur};
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1000;
                transition: all ${AESTHETIC_CONFIG.animations.duration.normal} ${AESTHETIC_CONFIG.animations.easing.smooth};
            }
            
            .theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
            }
            
            .theme-toggle svg {
                width: 24px;
                height: 24px;
                fill: white;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupThemeToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>
            </svg>
        `;
        
        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.body.appendChild(toggle);
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        
        // Update toggle icon
        const toggle = document.querySelector('.theme-toggle svg');
        if (this.currentTheme === 'light') {
            toggle.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
        } else {
            toggle.innerHTML = '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>';
        }
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
}

// Main Aesthetic Enhancement System
class AestheticEnhancementSystem {
    constructor() {
        this.glassmorphism = null;
        this.gradients = null;
        this.animations = null;
        this.story = null;
        this.theme = null;
        this.init();
    }
    
    init() {
        console.log('🎨 Initializing Aesthetic Enhancement System...');
        
        // Initialize all aesthetic systems
        this.glassmorphism = new GlassmorphismSystem();
        this.gradients = new GradientSystem();
        this.animations = new AnimationSystem();
        this.story = new StorySystem();
        this.theme = new ThemeSystem();
        
        // Apply enhancements to existing elements
        this.enhanceExistingElements();
        
        console.log('✅ Aesthetic Enhancement System initialized!');
    }
    
    enhanceExistingElements() {
        // Enhance existing UI elements with aesthetic improvements
        this.enhanceButtons();
        this.enhanceCards();
        this.enhanceModals();
        this.enhanceNavigation();
    }
    
    enhanceButtons() {
        const buttons = document.querySelectorAll('button, .btn, .button');
        buttons.forEach(button => {
            button.classList.add('glass-button', 'animate-bounce-in');
        });
    }
    
    enhanceCards() {
        const cards = document.querySelectorAll('.card, .panel, .section');
        cards.forEach(card => {
            card.classList.add('glass-card', 'animate-fade-in', 'hover-lift');
        });
    }
    
    enhanceModals() {
        const modals = document.querySelectorAll('.modal, .dialog, .popup');
        modals.forEach(modal => {
            modal.classList.add('glass-modal', 'animate-bounce-in');
        });
    }
    
    enhanceNavigation() {
        const navItems = document.querySelectorAll('.nav-item, .menu-item, .tab');
        navItems.forEach(item => {
            item.classList.add('glass', 'hover-glow');
        });
    }
}

// Initialize aesthetic enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AestheticEnhancementSystem();
    });
} else {
    new AestheticEnhancementSystem();
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AestheticEnhancementSystem,
        GlassmorphismSystem,
        GradientSystem,
        AnimationSystem,
        StorySystem,
        ThemeSystem,
        AESTHETIC_CONFIG
    };
}

console.log('🎨 Phase 7: Aesthetic & Story Enhancements Complete!'); 