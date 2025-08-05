// UI Module
// Handles all user interface components, responsive design, and visual interactions

class UIModule {
    constructor(core) {
        this.core = core;
        this.currentView = 'auth';
        this.modals = new Map();
        this.animations = new Map();
        this.responsiveBreakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1025
        };
    }

    // Initialize UI module
    async init() {
        try {
            console.log('🎨 Initializing UI Module...');
            
            // Initialize responsive design
            this.initResponsiveDesign();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize animations
            this.initAnimations();
            
            // Initialize modals
            this.initModals();
            
            console.log('✅ UI Module initialized');
            
        } catch (error) {
            console.error('❌ UI Module initialization failed:', error);
            this.core.errorBoundary?.catchError(error, 'ui-init');
        }
    }

    // Initialize responsive design
    initResponsiveDesign() {
        // Set initial responsive state
        this.updateResponsiveState();
        
        // Listen for resize events
        window.addEventListener('resize', this.debounce(() => {
            this.updateResponsiveState();
        }, 250));
    }

    // Update responsive state
    updateResponsiveState() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Remove existing responsive classes
        body.classList.remove('mobile', 'tablet', 'desktop');
        
        if (width <= this.responsiveBreakpoints.mobile) {
            body.classList.add('mobile');
            this.handleMobileLayout();
        } else if (width <= this.responsiveBreakpoints.tablet) {
            body.classList.add('tablet');
            this.handleTabletLayout();
        } else {
            body.classList.add('desktop');
            this.handleDesktopLayout();
        }
    }

    // Handle mobile layout
    handleMobileLayout() {
        // Mobile-specific UI adjustments
        this.adjustMobileNavigation();
        this.adjustMobileModals();
        this.adjustMobileForms();
    }

    // Handle tablet layout
    handleTabletLayout() {
        // Tablet-specific UI adjustments
        this.adjustTabletNavigation();
        this.adjustTabletModals();
    }

    // Handle desktop layout
    handleDesktopLayout() {
        // Desktop-specific UI adjustments
        this.adjustDesktopNavigation();
        this.adjustDesktopModals();
    }

    // Adjust mobile navigation
    adjustMobileNavigation() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (sidebar) {
            sidebar.classList.add('mobile-sidebar');
            sidebar.style.transform = 'translateX(-100%)';
        }
        
        if (mainContent) {
            mainContent.classList.add('mobile-content');
            mainContent.style.marginLeft = '0';
        }
    }

    // Adjust tablet navigation
    adjustTabletNavigation() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (sidebar) {
            sidebar.classList.remove('mobile-sidebar');
            sidebar.style.transform = 'translateX(0)';
            sidebar.style.width = '220px';
        }
        
        if (mainContent) {
            mainContent.classList.remove('mobile-content');
            mainContent.style.marginLeft = '220px';
        }
    }

    // Adjust desktop navigation
    adjustDesktopNavigation() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (sidebar) {
            sidebar.classList.remove('mobile-sidebar');
            sidebar.style.transform = 'translateX(0)';
            sidebar.style.width = '250px';
        }
        
        if (mainContent) {
            mainContent.classList.remove('mobile-content');
            mainContent.style.marginLeft = '250px';
        }
    }

    // Adjust mobile modals
    adjustMobileModals() {
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            modal.style.maxWidth = '95vw';
            modal.style.maxHeight = '90vh';
            modal.style.padding = '1.5rem';
        });
    }

    // Adjust tablet modals
    adjustTabletModals() {
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            modal.style.maxWidth = '80vw';
            modal.style.maxHeight = '85vh';
            modal.style.padding = '2rem';
        });
    }

    // Adjust desktop modals
    adjustDesktopModals() {
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            modal.style.maxWidth = '600px';
            modal.style.maxHeight = '80vh';
            modal.style.padding = '2rem';
        });
    }

    // Adjust mobile forms
    adjustMobileForms() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.fontSize = '16px'; // Prevent iOS zoom
            input.style.minHeight = '44px'; // Touch-friendly
        });
        
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.style.minHeight = '48px';
            button.style.padding = '0.875rem 1.25rem';
        });
    }

    // Setup UI event listeners
    setupEventListeners() {
        // Mobile menu toggle
        this.safeAddEventListener('mobile-menu-toggle', 'click', () => {
            this.toggleMobileMenu();
        });

        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Scroll to top button
        this.safeAddEventListener('scroll-to-top', 'click', () => {
            this.scrollToTop();
        });

        // Show scroll to top button on scroll
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScrollToTop();
        }, 100));
    }

    // Initialize animations
    initAnimations() {
        // Initialize GSAP animations if available
        if (window.gsap) {
            this.initGSAPAnimations();
        }
        
        // Initialize particle effects
        this.initParticleEffects();
        
        // Initialize matrix rain
        this.initMatrixRain();
    }

    // Initialize GSAP animations
    initGSAPAnimations() {
        // Fade in animations for cards
        gsap.from('.card', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        });

        // Sidebar slide animation
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            gsap.set(sidebar, { x: -250 });
            gsap.to(sidebar, {
                duration: 0.5,
                x: 0,
                ease: 'power2.out'
            });
        }
    }

    // Initialize particle effects
    initParticleEffects() {
        const particlesContainer = document.getElementById('tsparticles');
        if (particlesContainer && window.tsParticles) {
            try {
                window.tsParticles.load('tsparticles', {
                    particles: {
                        number: {
                            value: 50,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: '#f97316'
                        },
                        shape: {
                            type: 'circle'
                        },
                        opacity: {
                            value: 0.5,
                            random: false
                        },
                        size: {
                            value: 3,
                            random: true
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: '#f97316',
                            opacity: 0.4,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: 'none',
                            random: false,
                            straight: false,
                            out_mode: 'out',
                            bounce: false
                        }
                    },
                    interactivity: {
                        detect_on: 'canvas',
                        events: {
                            onhover: {
                                enable: true,
                                mode: 'repulse'
                            },
                            onclick: {
                                enable: true,
                                mode: 'push'
                            },
                            resize: true
                        }
                    },
                    retina_detect: true
                }).then(instance => {
                    this.core.state.particlesInstance = instance;
                });
            } catch (error) {
                console.error('Failed to initialize particles:', error);
            }
        }
    }

    // Initialize matrix rain
    initMatrixRain() {
        const canvas = document.getElementById('matrix-rain-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
            const matrixArray = matrix.split('');
            
            const fontSize = 10;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            };
            
            const interval = setInterval(draw, 35);
            this.core.memoryManager?.addInterval(interval);
        }
    }

    // Initialize modals
    initModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            this.modals.set(modal.id, {
                element: modal,
                isOpen: false
            });
        });
    }

    // Show modal
    showModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal && !modal.isOpen) {
            modal.element.classList.add('active');
            modal.isOpen = true;
            
            // Focus first input if exists
            const firstInput = modal.element.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal
    closeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal && modal.isOpen) {
            modal.element.classList.remove('active');
            modal.isOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    // Scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Handle scroll to top button visibility
    handleScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (scrollBtn) {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }
    }

    // Render dashboard
    renderDashboard() {
        const dashboard = document.getElementById('dashboard-view-wrapper');
        if (dashboard) {
            this.renderUserStats();
            this.renderGoals();
            this.renderTasks();
            this.renderAchievements();
        }
    }

    // Render user stats
    renderUserStats() {
        const user = this.core.state.currentUser;
        if (!user) return;

        const statsContainer = document.getElementById('user-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">${user.stats?.level || 1}</div>
                    <div class="stat-label">Level</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-value">${user.stats?.energy || 100}</div>
                    <div class="stat-label">Energy</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value">${user.stats?.streak || 0}</div>
                    <div class="stat-label">Streak</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-value">${user.stats?.completedGoals || 0}</div>
                    <div class="stat-label">Goals</div>
                </div>
            `;
        }
    }

    // Render goals
    renderGoals() {
        const user = this.core.state.currentUser;
        if (!user) return;

        const goalsContainer = document.getElementById('goals-list');
        if (goalsContainer) {
            const goals = user.goals || [];
            if (goals.length === 0) {
                goalsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🎯</div>
                        <div class="empty-title">No Goals Yet</div>
                        <div class="empty-description">Create your first goal to get started!</div>
                        <button class="btn btn-primary" onclick="app.getModule('goals').showAddGoalModal()">
                            Create Goal
                        </button>
                    </div>
                `;
            } else {
                goalsContainer.innerHTML = goals.map(goal => `
                    <div class="goal-item" data-goal-id="${goal.id}">
                        <div class="goal-header">
                            <div class="goal-title">${goal.title}</div>
                            <div class="goal-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${goal.progress || 0}%"></div>
                                </div>
                                <span class="progress-text">${goal.progress || 0}%</span>
                            </div>
                        </div>
                        <div class="goal-description">${goal.description}</div>
                        <div class="goal-actions">
                            <button class="btn btn-sm btn-primary" onclick="app.getModule('goals').editGoal('${goal.id}')">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-success" onclick="app.getModule('goals').completeGoal('${goal.id}')">
                                Complete
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Render tasks
    renderTasks() {
        const user = this.core.state.currentUser;
        if (!user) return;

        const tasksContainer = document.getElementById('tasks-list');
        if (tasksContainer) {
            const tasks = user.tasks || [];
            if (tasks.length === 0) {
                tasksContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <div class="empty-title">No Tasks Yet</div>
                        <div class="empty-description">Add tasks to your goals to track progress!</div>
                    </div>
                `;
            } else {
                tasksContainer.innerHTML = tasks.map(task => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                        <div class="task-checkbox">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                                   onchange="app.getModule('goals').toggleTask('${task.id}')">
                        </div>
                        <div class="task-content">
                            <div class="task-title">${task.title}</div>
                            <div class="task-description">${task.description}</div>
                        </div>
                        <div class="task-actions">
                            <button class="btn btn-sm btn-outline" onclick="app.getModule('goals').editTask('${task.id}')">
                                Edit
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Render achievements
    renderAchievements() {
        const user = this.core.state.currentUser;
        if (!user) return;

        const achievementsContainer = document.getElementById('achievements-list');
        if (achievementsContainer) {
            const achievements = user.achievements || [];
            if (achievements.length === 0) {
                achievementsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🏆</div>
                        <div class="empty-title">No Achievements Yet</div>
                        <div class="empty-description">Complete goals and tasks to earn achievements!</div>
                    </div>
                `;
            } else {
                achievementsContainer.innerHTML = achievements.map(achievement => `
                    <div class="achievement-item">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-content">
                            <div class="achievement-title">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                            <div class="achievement-tier">${achievement.tier}</div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Handle resize
    handleResize() {
        this.updateResponsiveState();
        
        // Update canvas sizes
        const canvas = document.getElementById('matrix-rain-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Safe event listener helper
    safeAddEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Element with id '${elementId}' not found for event '${event}'`);
        }
    }

    // Handle module events
    onEvent(event, data) {
        switch (event) {
            case 'stateChanged':
                if (data.activeView !== this.currentView) {
                    this.currentView = data.activeView;
                    this.renderDashboard();
                }
                break;
        }
    }

    // Cleanup
    cleanup() {
        // Clear animations
        this.animations.forEach(animation => {
            if (animation && typeof animation.kill === 'function') {
                animation.kill();
            }
        });
        this.animations.clear();
        
        // Clear modals
        this.modals.clear();
    }
}

// Export the UI module
export default UIModule; 