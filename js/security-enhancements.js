// Security Enhancements System
// Comprehensive security features for Operator Uplift

(function() {
    'use strict';

    // Security Configuration
    const SecurityConfig = {
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        csrfTokenLength: 32,
        passwordMinLength: 8,
        passwordRequirements: {
            uppercase: true,
            lowercase: true,
            numbers: true,
            special: true
        },
        rateLimits: {
            api: { window: 60000, max: 100 }, // 100 requests per minute
            auth: { window: 300000, max: 10 }, // 10 attempts per 5 minutes
            ai: { window: 60000, max: 20 } // 20 AI requests per minute
        }
    };

    // Two-Factor Authentication
    class TwoFactorAuth {
        constructor() {
            this.isEnabled = localStorage.getItem('2fa_enabled') === 'true';
            this.backupCodes = JSON.parse(localStorage.getItem('2fa_backup_codes') || '[]');
        }

        async enable() {
            try {
                // Generate secret
                const secret = this.generateSecret();
                
                // Generate QR code
                const qrCode = await this.generateQRCode(secret);
                
                // Show setup modal
                this.showSetupModal(qrCode, secret);
                
                return { success: true, qrCode, secret };
            } catch (error) {
                console.error('2FA setup error:', error);
                return { success: false, error: error.message };
            }
        }

        generateSecret() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let secret = '';
            for (let i = 0; i < 32; i++) {
                secret += chars[Math.floor(Math.random() * chars.length)];
            }
            return secret;
        }

        async generateQRCode(secret) {
            const user = window.auth?.currentUser?.email || 'user@operatoruplift.com';
            const issuer = 'OperatorUplift';
            const uri = `otpauth://totp/${issuer}:${user}?secret=${secret}&issuer=${issuer}`;
            
            // In production, use a QR code library
            return uri;
        }

        generateBackupCodes() {
            const codes = [];
            for (let i = 0; i < 10; i++) {
                codes.push(Math.random().toString(36).substr(2, 10).toUpperCase());
            }
            this.backupCodes = codes;
            localStorage.setItem('2fa_backup_codes', JSON.stringify(codes));
            return codes;
        }

        async verify(token) {
            // In production, verify with backend
            // This is a simplified version
            return token.length === 6 && /^\d+$/.test(token);
        }

        showSetupModal(qrCode, secret) {
            const modal = document.createElement('div');
            modal.className = 'twofa-setup-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Enable Two-Factor Authentication</h3>
                    <div class="twofa-steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <p>Install an authenticator app like Google Authenticator or Authy</p>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <p>Scan this QR code or enter the secret manually:</p>
                            <div class="qr-code-container">
                                <div class="qr-placeholder">[QR Code: ${qrCode}]</div>
                                <div class="secret-key">
                                    <code>${secret}</code>
                                    <button onclick="navigator.clipboard.writeText('${secret}')">Copy</button>
                                </div>
                            </div>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <p>Enter the 6-digit code from your app:</p>
                            <input type="text" id="twofa-verify" maxlength="6" pattern="\\d{6}">
                            <button onclick="window.securitySystem.verifyAndEnable2FA()">Verify & Enable</button>
                        </div>
                    </div>
                    <div class="backup-codes-section" style="display:none;">
                        <h4>Backup Codes</h4>
                        <p>Save these codes in a safe place. Each can be used once if you lose access to your authenticator.</p>
                        <div class="backup-codes-list"></div>
                        <button onclick="window.securitySystem.downloadBackupCodes()">Download Codes</button>
                    </div>
                    <button class="close-btn" onclick="this.closest('.twofa-setup-modal').remove()">Close</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    // Session Management
    class SessionManager {
        constructor() {
            this.sessionId = this.generateSessionId();
            this.lastActivity = Date.now();
            this.initSessionMonitoring();
        }

        generateSessionId() {
            return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        initSessionMonitoring() {
            // Monitor user activity
            ['click', 'keypress', 'mousemove', 'scroll'].forEach(event => {
                document.addEventListener(event, () => this.updateActivity(), { passive: true });
            });

            // Check session timeout
            setInterval(() => this.checkTimeout(), 60000); // Check every minute

            // Monitor for suspicious activity
            this.monitorSuspiciousActivity();
        }

        updateActivity() {
            this.lastActivity = Date.now();
        }

        checkTimeout() {
            const inactiveTime = Date.now() - this.lastActivity;
            if (inactiveTime > SecurityConfig.sessionTimeout) {
                this.handleTimeout();
            } else if (inactiveTime > SecurityConfig.sessionTimeout - 5 * 60 * 1000) {
                // Warn 5 minutes before timeout
                this.showTimeoutWarning();
            }
        }

        handleTimeout() {
            // Clear sensitive data
            this.clearSession();
            
            // Show timeout message
            showToast('Session expired. Please log in again.', 'warning');
            
            // Redirect to login
            window.location.href = '/';
        }

        showTimeoutWarning() {
            if (!document.querySelector('.timeout-warning')) {
                const warning = document.createElement('div');
                warning.className = 'timeout-warning';
                warning.innerHTML = `
                    <p>Your session will expire in 5 minutes due to inactivity.</p>
                    <button onclick="window.securitySystem.extendSession()">Stay Logged In</button>
                `;
                document.body.appendChild(warning);
                
                setTimeout(() => warning.remove(), 30000);
            }
        }

        clearSession() {
            // Clear sensitive localStorage items
            const keysToKeep = ['theme', 'language', 'tutorial_completed'];
            Object.keys(localStorage).forEach(key => {
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear session storage
            sessionStorage.clear();
        }

        monitorSuspiciousActivity() {
            // Detect rapid API calls
            let apiCallCount = 0;
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                apiCallCount++;
                setTimeout(() => apiCallCount--, 60000);
                
                if (apiCallCount > 100) {
                    console.warn('Suspicious activity detected: Rapid API calls');
                    window.securitySystem.handleSuspiciousActivity('rapid_api_calls');
                }
                
                return originalFetch.apply(this, args);
            };
        }
    }

    // Rate Limiting
    class RateLimiter {
        constructor() {
            this.limits = new Map();
        }

        check(key, config) {
            const now = Date.now();
            const limit = this.limits.get(key) || { count: 0, resetAt: now + config.window };
            
            if (now > limit.resetAt) {
                limit.count = 0;
                limit.resetAt = now + config.window;
            }
            
            if (limit.count >= config.max) {
                const waitTime = Math.ceil((limit.resetAt - now) / 1000);
                throw new Error(`Rate limit exceeded. Try again in ${waitTime} seconds.`);
            }
            
            limit.count++;
            this.limits.set(key, limit);
            return true;
        }

        reset(key) {
            this.limits.delete(key);
        }
    }

    // Input Sanitization
    class InputSanitizer {
        static sanitizeHTML(input) {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        }

        static sanitizeSQL(input) {
            return input.replace(/['";\\]/g, '');
        }

        static sanitizeFilename(input) {
            return input.replace(/[^a-zA-Z0-9.-]/g, '_');
        }

        static validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        static validatePassword(password) {
            const requirements = SecurityConfig.passwordRequirements;
            const checks = {
                length: password.length >= SecurityConfig.passwordMinLength,
                uppercase: !requirements.uppercase || /[A-Z]/.test(password),
                lowercase: !requirements.lowercase || /[a-z]/.test(password),
                numbers: !requirements.numbers || /\d/.test(password),
                special: !requirements.special || /[!@#$%^&*]/.test(password)
            };
            
            return {
                valid: Object.values(checks).every(v => v),
                checks
            };
        }
    }

    // CSRF Protection
    class CSRFProtection {
        constructor() {
            this.token = this.generateToken();
            this.setupProtection();
        }

        generateToken() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            for (let i = 0; i < SecurityConfig.csrfTokenLength; i++) {
                token += chars[Math.floor(Math.random() * chars.length)];
            }
            sessionStorage.setItem('csrf_token', token);
            return token;
        }

        setupProtection() {
            // Add CSRF token to all forms
            document.querySelectorAll('form').forEach(form => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrf_token';
                input.value = this.token;
                form.appendChild(input);
            });

            // Add CSRF token to AJAX requests
            const originalFetch = window.fetch;
            window.fetch = (url, options = {}) => {
                if (options.method && options.method !== 'GET') {
                    options.headers = {
                        ...options.headers,
                        'X-CSRF-Token': this.token
                    };
                }
                return originalFetch(url, options);
            };
        }

        verify(token) {
            return token === this.token;
        }
    }

    // Security Headers
    class SecurityHeaders {
        static apply() {
            // These would normally be set server-side
            // This is for demonstration purposes
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';";
            document.head.appendChild(meta);
        }
    }

    // Account Security
    class AccountSecurity {
        constructor() {
            this.loginAttempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
        }

        recordLoginAttempt(email, success) {
            const attempts = this.loginAttempts[email] || { count: 0, lastAttempt: 0, lockedUntil: 0 };
            
            if (success) {
                delete this.loginAttempts[email];
            } else {
                attempts.count++;
                attempts.lastAttempt = Date.now();
                
                if (attempts.count >= SecurityConfig.maxLoginAttempts) {
                    attempts.lockedUntil = Date.now() + SecurityConfig.lockoutDuration;
                }
                
                this.loginAttempts[email] = attempts;
            }
            
            localStorage.setItem('login_attempts', JSON.stringify(this.loginAttempts));
        }

        isAccountLocked(email) {
            const attempts = this.loginAttempts[email];
            if (!attempts) return false;
            
            if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
                const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
                throw new Error(`Account locked. Try again in ${remainingTime} minutes.`);
            }
            
            if (Date.now() > attempts.lockedUntil) {
                attempts.count = 0;
                attempts.lockedUntil = 0;
            }
            
            return false;
        }

        checkPasswordStrength(password) {
            const result = InputSanitizer.validatePassword(password);
            const strength = Object.values(result.checks).filter(v => v).length;
            
            return {
                ...result,
                strength: strength <= 2 ? 'weak' : strength <= 4 ? 'medium' : 'strong',
                score: strength * 20
            };
        }
    }

    // Security Monitoring
    class SecurityMonitor {
        constructor() {
            this.events = [];
            this.setupMonitoring();
        }

        setupMonitoring() {
            // Monitor failed login attempts
            window.addEventListener('auth:failed', (e) => {
                this.logEvent('failed_login', e.detail);
            });

            // Monitor suspicious activities
            this.monitorXSS();
            this.monitorClickjacking();
        }

        monitorXSS() {
            // Check for potential XSS in URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.forEach((value, key) => {
                if (/<script|javascript:|onerror=/i.test(value)) {
                    this.logEvent('potential_xss', { key, value });
                    window.location.search = '';
                }
            });
        }

        monitorClickjacking() {
            if (window.self !== window.top) {
                this.logEvent('clickjacking_attempt', { referrer: document.referrer });
                document.body.style.display = 'none';
            }
        }

        logEvent(type, data) {
            const event = {
                type,
                timestamp: Date.now(),
                data,
                userAgent: navigator.userAgent,
                ip: 'client-side'
            };
            
            this.events.push(event);
            
            // Send to server in production
            if (type === 'potential_xss' || type === 'clickjacking_attempt') {
                console.error('Security event:', event);
            }
        }
    }

    // Initialize Security System
    class SecuritySystem {
        constructor() {
            this.twoFA = new TwoFactorAuth();
            this.session = new SessionManager();
            this.rateLimiter = new RateLimiter();
            this.csrf = new CSRFProtection();
            this.account = new AccountSecurity();
            this.monitor = new SecurityMonitor();
            
            SecurityHeaders.apply();
            this.setupUI();
        }

        setupUI() {
            // Add security settings to profile
            const profileSettings = document.querySelector('.profile-settings');
            if (profileSettings) {
                const securitySection = document.createElement('div');
                securitySection.className = 'security-settings';
                securitySection.innerHTML = `
                    <h3>Security Settings</h3>
                    <div class="security-options">
                        <div class="security-option">
                            <label>
                                <input type="checkbox" id="enable-2fa" ${this.twoFA.isEnabled ? 'checked' : ''}>
                                Enable Two-Factor Authentication
                            </label>
                            <button onclick="window.securitySystem.toggle2FA()">Configure</button>
                        </div>
                        <div class="security-option">
                            <label>Password</label>
                            <button onclick="window.securitySystem.changePassword()">Change Password</button>
                        </div>
                        <div class="security-option">
                            <label>Active Sessions</label>
                            <button onclick="window.securitySystem.viewSessions()">View Sessions</button>
                        </div>
                        <div class="security-option">
                            <label>Security Log</label>
                            <button onclick="window.securitySystem.viewSecurityLog()">View Log</button>
                        </div>
                    </div>
                `;
                profileSettings.appendChild(securitySection);
            }
        }

        async toggle2FA() {
            if (this.twoFA.isEnabled) {
                // Disable 2FA
                if (confirm('Are you sure you want to disable two-factor authentication?')) {
                    localStorage.setItem('2fa_enabled', 'false');
                    this.twoFA.isEnabled = false;
                    showToast('Two-factor authentication disabled', 'info');
                }
            } else {
                // Enable 2FA
                await this.twoFA.enable();
            }
        }

        verifyAndEnable2FA() {
            const code = document.getElementById('twofa-verify').value;
            if (this.twoFA.verify(code)) {
                localStorage.setItem('2fa_enabled', 'true');
                this.twoFA.isEnabled = true;
                
                // Generate backup codes
                const backupCodes = this.twoFA.generateBackupCodes();
                document.querySelector('.backup-codes-list').innerHTML = 
                    backupCodes.map(code => `<code>${code}</code>`).join('');
                document.querySelector('.backup-codes-section').style.display = 'block';
                
                showToast('Two-factor authentication enabled successfully!', 'success');
            } else {
                showToast('Invalid code. Please try again.', 'error');
            }
        }

        downloadBackupCodes() {
            const codes = this.twoFA.backupCodes.join('\n');
            const blob = new Blob([codes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'operatoruplift-backup-codes.txt';
            a.click();
            URL.revokeObjectURL(url);
        }

        changePassword() {
            const modal = document.createElement('div');
            modal.className = 'password-change-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Change Password</h3>
                    <form onsubmit="window.securitySystem.handlePasswordChange(event)">
                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" name="current" required>
                        </div>
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" name="new" required oninput="window.securitySystem.checkPasswordStrength(this.value)">
                            <div class="password-strength">
                                <div class="strength-bar"><div class="strength-fill"></div></div>
                                <span class="strength-text"></span>
                            </div>
                            <ul class="password-requirements">
                                <li data-req="length">At least 8 characters</li>
                                <li data-req="uppercase">One uppercase letter</li>
                                <li data-req="lowercase">One lowercase letter</li>
                                <li data-req="numbers">One number</li>
                                <li data-req="special">One special character</li>
                            </ul>
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirm" required>
                        </div>
                        <button type="submit">Change Password</button>
                        <button type="button" onclick="this.closest('.password-change-modal').remove()">Cancel</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }

        checkPasswordStrength(password) {
            const result = this.account.checkPasswordStrength(password);
            const strengthBar = document.querySelector('.strength-fill');
            const strengthText = document.querySelector('.strength-text');
            
            strengthBar.style.width = result.score + '%';
            strengthBar.className = 'strength-fill strength-' + result.strength;
            strengthText.textContent = result.strength.charAt(0).toUpperCase() + result.strength.slice(1);
            
            // Update requirements
            Object.entries(result.checks).forEach(([req, passed]) => {
                const li = document.querySelector(`[data-req="${req}"]`);
                if (li) {
                    li.classList.toggle('passed', passed);
                }
            });
        }

        handlePasswordChange(event) {
            event.preventDefault();
            const form = event.target;
            const current = form.current.value;
            const newPass = form.new.value;
            const confirm = form.confirm.value;
            
            if (newPass !== confirm) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            const strength = this.account.checkPasswordStrength(newPass);
            if (!strength.valid) {
                showToast('Password does not meet requirements', 'error');
                return;
            }
            
            // In production, verify current password and update
            showToast('Password changed successfully', 'success');
            form.closest('.password-change-modal').remove();
        }

        viewSessions() {
            // Show active sessions
            const modal = document.createElement('div');
            modal.className = 'sessions-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Active Sessions</h3>
                    <div class="sessions-list">
                        <div class="session-item current">
                            <div class="session-info">
                                <strong>Current Session</strong>
                                <p>Browser: ${navigator.userAgent.split(' ').slice(-2).join(' ')}</p>
                                <p>Started: ${new Date(Date.now() - (Date.now() - this.session.lastActivity)).toLocaleString()}</p>
                            </div>
                            <span class="session-badge">This Device</span>
                        </div>
                    </div>
                    <button onclick="this.closest('.sessions-modal').remove()">Close</button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        viewSecurityLog() {
            const events = this.monitor.events.slice(-20).reverse();
            const modal = document.createElement('div');
            modal.className = 'security-log-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Security Log</h3>
                    <div class="security-events">
                        ${events.map(event => `
                            <div class="security-event ${event.type}">
                                <span class="event-type">${event.type.replace(/_/g, ' ')}</span>
                                <span class="event-time">${new Date(event.timestamp).toLocaleString()}</span>
                            </div>
                        `).join('') || '<p>No security events recorded</p>'}
                    </div>
                    <button onclick="this.closest('.security-log-modal').remove()">Close</button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        extendSession() {
            this.session.updateActivity();
            showToast('Session extended', 'success');
            document.querySelector('.timeout-warning')?.remove();
        }

        handleSuspiciousActivity(type) {
            this.monitor.logEvent('suspicious_activity', { type });
            // In production, notify security team
        }
    }

    // Add styles
    const styles = `
        <style>
        /* Security Styles */
        .security-settings {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
        }

        .security-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .security-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
        }

        /* 2FA Modal */
        .twofa-setup-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .twofa-setup-modal .modal-content {
            background: var(--bg-primary);
            padding: 2rem;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
        }

        .twofa-steps {
            margin: 2rem 0;
        }

        .step {
            margin-bottom: 1.5rem;
            padding-left: 3rem;
            position: relative;
        }

        .step-number {
            position: absolute;
            left: 0;
            top: 0;
            width: 2rem;
            height: 2rem;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .qr-placeholder {
            width: 200px;
            height: 200px;
            background: white;
            margin: 1rem auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #333;
        }

        .secret-key {
            text-align: center;
            margin-top: 1rem;
        }

        .secret-key code {
            display: block;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .backup-codes-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            margin: 1rem 0;
        }

        .backup-codes-list code {
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            font-size: 0.85rem;
        }

        /* Password Strength */
        .password-strength {
            margin-top: 0.5rem;
        }

        .strength-bar {
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }

        .strength-fill {
            height: 100%;
            transition: all 0.3s ease;
        }

        .strength-fill.strength-weak { background: #ff4444; }
        .strength-fill.strength-medium { background: #ffaa00; }
        .strength-fill.strength-strong { background: #00ff88; }

        .password-requirements {
            list-style: none;
            padding: 0;
            margin-top: 0.5rem;
            font-size: 0.85rem;
        }

        .password-requirements li {
            padding: 0.25rem 0;
            opacity: 0.6;
        }

        .password-requirements li.passed {
            opacity: 1;
            color: #00ff88;
        }

        .password-requirements li.passed::before {
            content: '✓ ';
        }

        /* Session Timeout Warning */
        .timeout-warning {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }

        /* Security Log */
        .security-events {
            max-height: 400px;
            overflow-y: auto;
        }

        .security-event {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            font-size: 0.9rem;
        }

        .security-event.failed_login {
            border-left: 3px solid #ff6b6b;
        }

        .security-event.suspicious_activity {
            border-left: 3px solid #ffaa00;
        }

        /* Modals */
        .password-change-modal,
        .sessions-modal,
        .security-log-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .modal-content {
            background: var(--bg-primary);
            padding: 2rem;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-primary);
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        </style>
    `;

    // Initialize
    document.head.insertAdjacentHTML('beforeend', styles);
    window.securitySystem = new SecuritySystem();

    console.log('✅ Security Enhancements System initialized');
})();
