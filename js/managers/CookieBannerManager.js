// Cookie Banner Manager
// Handles cookie consent banner and cookie management

class CookieBannerManager {
  constructor() {
    this.banner = null;
    this.isInitialized = false;
    this.cookieConsent = null;
    this.bannerShown = false;
  }

  init() {
    if (this.isInitialized) {return;}

    console.log('🍪 Cookie Banner Manager initialized');
    this.isInitialized = true;

    // Get cookie consent status
    this.cookieConsent = this.getCookieConsent();

    // Setup banner
    this.setupBanner();

    // Show banner if consent not given
    if (!this.cookieConsent) {
      this.showBanner();
    }
  }

  // Get cookie consent status
  getCookieConsent() {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      try {
        return JSON.parse(consent);
      } catch (error) {
        console.warn('Invalid cookie consent data, resetting');
        localStorage.removeItem('cookie-consent');
        return null;
      }
    }
    return null;
  }

  // Save cookie consent
  saveCookieConsent(consent) {
    const consentData = {
      accepted: consent,
      timestamp: Date.now(),
      version: '1.0'
    };

    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    this.cookieConsent = consentData;

    console.log('🍪 Cookie consent saved:', consent);
  }

  // Setup banner elements
  setupBanner() {
    this.banner = document.getElementById('cookie-consent-banner');

    if (!this.banner) {
      console.warn('Cookie banner element not found');
      return;
    }

    // Setup accept button
    const acceptBtn = document.getElementById('cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        this.acceptCookies();
      });
    }

    // Setup decline button
    const declineBtn = document.getElementById('cookie-decline');
    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        this.declineCookies();
      });
    }

    // Setup manage cookies button
    const manageBtn = document.getElementById('manage-cookies');
    if (manageBtn) {
      manageBtn.addEventListener('click', () => {
        this.showCookieSettings();
      });
    }
  }

  // Show banner
  showBanner() {
    if (!this.banner || this.bannerShown) {return;}

    this.banner.classList.remove('hidden');
    this.banner.classList.add('visible');
    this.bannerShown = true;

    // Ensure proper z-index
    this.banner.style.zIndex = 'var(--z-cookie-banner)';

    console.log('🍪 Cookie banner shown');
  }

  // Hide banner
  hideBanner() {
    if (!this.banner) {return;}

    this.banner.classList.remove('visible');
    this.banner.classList.add('hidden');
    this.bannerShown = false;

    console.log('🍪 Cookie banner hidden');
  }

  // Accept cookies
  acceptCookies() {
    this.saveCookieConsent(true);
    this.hideBanner();

    // Enable analytics and tracking (if implemented)
    this.enableAnalytics();

    console.log('🍪 Cookies accepted');
  }

  // Decline cookies
  declineCookies() {
    this.saveCookieConsent(false);
    this.hideBanner();

    // Disable analytics and tracking
    this.disableAnalytics();

    console.log('🍪 Cookies declined');
  }

  // Show cookie settings modal
  showCookieSettings() {
    // Create or show cookie settings modal
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.classList.add('active');
    } else {
      this.createCookieSettingsModal();
    }
  }

  // Create cookie settings modal
  createCookieSettingsModal() {
    const modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.className = 'modal';
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Cookie Settings</h3>
                    <button class="modal-close" onclick="this.closest('.modal').classList.remove('active')">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Manage your cookie preferences:</p>
                    <div class="cookie-option">
                        <label>
                            <input type="checkbox" id="essential-cookies" checked disabled>
                            Essential Cookies (Required)
                        </label>
                        <p>These cookies are necessary for the website to function properly.</p>
                    </div>
                    <div class="cookie-option">
                        <label>
                            <input type="checkbox" id="analytics-cookies">
                            Analytics Cookies
                        </label>
                        <p>These cookies help us understand how visitors interact with our website.</p>
                    </div>
                    <div class="cookie-option">
                        <label>
                            <input type="checkbox" id="marketing-cookies">
                            Marketing Cookies
                        </label>
                        <p>These cookies are used to deliver relevant advertisements.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').classList.remove('active')">Cancel</button>
                    <button class="btn btn-primary" onclick="window.app?.cookieBannerManager?.saveCookieSettings()">Save Settings</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
    modal.classList.add('active');
  }

  // Save cookie settings
  saveCookieSettings() {
    const analytics = document.getElementById('analytics-cookies')?.checked || false;
    const marketing = document.getElementById('marketing-cookies')?.checked || false;

    const settings = {
      essential: true, // Always required
      analytics,
      marketing,
      timestamp: Date.now()
    };

    localStorage.setItem('cookie-settings', JSON.stringify(settings));

    // Apply settings
    if (analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Close modal
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.classList.remove('active');
    }

    console.log('🍪 Cookie settings saved:', settings);
  }

  // Enable analytics
  enableAnalytics() {
    // Enable Google Analytics, etc.
    console.log('📊 Analytics enabled');
  }

  // Disable analytics
  disableAnalytics() {
    // Disable Google Analytics, etc.
    console.log('📊 Analytics disabled');
  }

  // Check if cookies are accepted
  areCookiesAccepted() {
    return this.cookieConsent?.accepted === true;
  }

  // Get cookie settings
  getCookieSettings() {
    const settings = localStorage.getItem('cookie-settings');
    if (settings) {
      try {
        return JSON.parse(settings);
      } catch (error) {
        console.warn('Invalid cookie settings, using defaults');
        return this.getDefaultCookieSettings();
      }
    }
    return this.getDefaultCookieSettings();
  }

  // Get default cookie settings
  getDefaultCookieSettings() {
    return {
      essential: true,
      analytics: false,
      marketing: false
    };
  }

  // Reset cookie consent
  resetCookieConsent() {
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-settings');
    this.cookieConsent = null;
    this.showBanner();

    console.log('🍪 Cookie consent reset');
  }

  // Get cookie statistics
  getCookieStats() {
    return {
      consentGiven: !!this.cookieConsent,
      consentAccepted: this.cookieConsent?.accepted || false,
      bannerShown: this.bannerShown,
      settings: this.getCookieSettings()
    };
  }

  // Cleanup
  cleanup() {
    this.hideBanner();
    this.banner = null;
    this.isInitialized = false;
    console.log('🍪 Cookie Banner Manager cleanup completed');
  }
}

export default CookieBannerManager;
