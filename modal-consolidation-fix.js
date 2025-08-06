// Modal Consolidation Fix - Phase 1 Critical Fix
// This script identifies and fixes cross-wrapper modal conflicts

console.log('🔧 Modal Consolidation Fix - Phase 1 Critical Fix');

function analyzeModalConflicts() {
    console.log('🔍 Analyzing modal system conflicts...');
    
    // 1. CHECK FOR DUPLICATE MODAL CSS
    const modalCSSRules = [];
    const styleSheets = document.styleSheets;
    
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                if (rule.selectorText && rule.selectorText.includes('.modal')) {
                    modalCSSRules.push({
                        selector: rule.selectorText,
                        sheet: i,
                        rule: j
                    });
                }
            }
        } catch (e) {
            // Cross-origin stylesheets will throw errors
        }
    }
    
    console.log('📊 Found modal CSS rules:', modalCSSRules.length);
    modalCSSRules.forEach(rule => {
        console.log('  -', rule.selector);
    });
    
    // 2. CHECK FOR MODAL ELEMENTS
    const modalElements = document.querySelectorAll('.modal');
    console.log('📊 Found modal elements:', modalElements.length);
    modalElements.forEach((modal, index) => {
        console.log(`  - Modal ${index + 1}:`, modal.id, modal.className);
    });
    
    // 3. CHECK FOR MODAL OVERLAY
    const modalOverlay = document.getElementById('modal-overlay');
    console.log('📊 Modal overlay found:', !!modalOverlay);
    
    // 4. CHECK FOR MODAL FUNCTIONS
    const hasShowModal = typeof window.app?.ui?.showModal === 'function';
    const hasHideModal = typeof window.app?.ui?.hideModal === 'function';
    console.log('📊 Modal functions found:', { hasShowModal, hasHideModal });
    
    // 5. IDENTIFY CONFLICTS
    const conflicts = [];
    
    if (modalCSSRules.length > 1) {
        conflicts.push('Multiple modal CSS definitions found');
    }
    
    if (modalElements.length > 0 && !modalOverlay) {
        conflicts.push('Modal elements exist but no overlay system');
    }
    
    if (modalElements.length > 0 && !hasShowModal) {
        conflicts.push('Modal elements exist but no showModal function');
    }
    
    console.log('🚨 Identified conflicts:', conflicts);
    
    return {
        modalCSSRules,
        modalElements: Array.from(modalElements),
        modalOverlay,
        hasShowModal,
        hasHideModal,
        conflicts
    };
}

function consolidateModalSystem() {
    console.log('🔧 Consolidating modal system...');
    
    // 1. REMOVE OLD MODAL CSS (first system)
    console.log('🗑️ Removing old modal CSS...');
    
    // Find and remove the first modal system CSS
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            for (let j = rules.length - 1; j >= 0; j--) {
                const rule = rules[j];
                if (rule.selectorText && 
                    (rule.selectorText === '.modal' || 
                     rule.selectorText === '.modal.active' ||
                     rule.selectorText === '.modal-content' ||
                     rule.selectorText === '.modal-close')) {
                    console.log('🗑️ Removing old modal rule:', rule.selectorText);
                    styleSheets[i].deleteRule(j);
                }
            }
        } catch (e) {
            // Cross-origin stylesheets will throw errors
        }
    }
    
    // 2. ENSURE MODAL OVERLAY EXISTS
    console.log('✅ Ensuring modal overlay exists...');
    
    let modalOverlay = document.getElementById('modal-overlay');
    if (!modalOverlay) {
        console.log('➕ Creating missing modal overlay...');
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'modal-overlay';
        modalOverlay.className = 'modal-overlay';
        document.body.appendChild(modalOverlay);
    }
    
    // 3. UPDATE MODAL ELEMENTS TO USE NEW SYSTEM
    console.log('🔄 Updating modal elements...');
    
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach((modal, index) => {
        console.log(`🔄 Updating modal ${index + 1}:`, modal.id);
        
        // Ensure modal has proper structure
        if (!modal.querySelector('.modal-content')) {
            console.log('  ⚠️ Modal missing modal-content wrapper');
            const content = modal.querySelector('*');
            if (content && content !== modal) {
                const wrapper = document.createElement('div');
                wrapper.className = 'modal-content';
                content.parentNode.insertBefore(wrapper, content);
                wrapper.appendChild(content);
            }
        }
        
        // Ensure modal has close button
        if (!modal.querySelector('.modal-close')) {
            console.log('  ➕ Adding missing close button');
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = () => app.ui.hideModal(modal.id);
            modal.appendChild(closeBtn);
        }
    });
    
    // 4. ENSURE MODAL FUNCTIONS EXIST
    console.log('✅ Ensuring modal functions exist...');
    
    if (!window.app) window.app = {};
    if (!window.app.ui) window.app.ui = {};
    
    if (!window.app.ui.showModal) {
        console.log('➕ Creating missing showModal function...');
        window.app.ui.showModal = function(modalId) {
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('modal-overlay');
            
            if (modal && overlay) {
                overlay.classList.add('active');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }
    
    if (!window.app.ui.hideModal) {
        console.log('➕ Creating missing hideModal function...');
        window.app.ui.hideModal = function(modalId) {
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('modal-overlay');
            
            if (modal) {
                modal.classList.remove('active');
            }
            
            if (overlay) {
                overlay.classList.remove('active');
            }
            
            document.body.style.overflow = '';
        };
    }
    
    console.log('✅ Modal system consolidation complete');
}

function testModalSystem() {
    console.log('🧪 Testing consolidated modal system...');
    
    // Test if modal functions work
    const testModal = document.querySelector('.modal');
    if (testModal) {
        console.log('🧪 Testing with modal:', testModal.id);
        
        // Test show
        try {
            window.app.ui.showModal(testModal.id);
            console.log('✅ showModal function works');
            
            // Test hide after 2 seconds
            setTimeout(() => {
                window.app.ui.hideModal(testModal.id);
                console.log('✅ hideModal function works');
            }, 2000);
            
        } catch (error) {
            console.error('❌ Modal functions failed:', error);
        }
    } else {
        console.log('⚠️ No modals found to test with');
    }
}

// Apply the consolidation fix
console.log('🎯 Applying modal consolidation fix...');

// Analyze first
const analysis = analyzeModalConflicts();

if (analysis.conflicts.length > 0) {
    console.log('🚨 Conflicts found, applying consolidation...');
    consolidateModalSystem();
    testModalSystem();
} else {
    console.log('✅ No conflicts found, modal system is clean');
}

console.log('✅ Modal Consolidation Fix script loaded'); 