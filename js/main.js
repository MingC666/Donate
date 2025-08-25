/**
 * Main Application Controller for Donation Page
 * Coordinates all components and handles global functionality
 */

class DonationApp {
  constructor() {
    this.isInitialized = false;
    this.components = {};
    this.config = {
      version: '2.0.0',
      debug: false,
      analytics: {
        enabled: true,
        trackingId: 'GA_TRACKING_ID' // Replace with actual tracking ID
      },
      payments: {
        paypal: {
          enabled: true,
          buttonId: 'XXXXXX' // Replace with actual PayPal button ID
        },
        bmc: {
          enabled: true,
          username: 'chenming030'
        },
        venmo: {
          enabled: true,
          username: 'Ming-C_23333'
        },
        applepay: {
          enabled: true,
          merchantId: 'merchant.com.yoursite' // Replace with actual merchant ID
        }
      }
    };
    
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    try {
      this.log('Initializing Donation App...');
      
      // Initialize components
      this.initializeComponents();
      
      // Setup global event listeners
      this.setupGlobalEvents();
      
      // Setup accessibility features
      this.setupAccessibility();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Initialize analytics
      this.initializeAnalytics();
      
      this.isInitialized = true;
      this.log('Donation App initialized successfully');
      
      // Dispatch ready event
      this.dispatchEvent('app:ready');
      
    } catch (error) {
      console.error('Failed to initialize Donation App:', error);
      this.handleError(error);
    }
  }

  initializeComponents() {
    // Components are already initialized globally
    this.components.animation = window.animationController;
    this.components.payment = window.paymentController;
    
    // Verify components are loaded
    if (!this.components.animation) {
      throw new Error('Animation controller not found');
    }
    
    if (!this.components.payment) {
      throw new Error('Payment controller not found');
    }
  }

  setupGlobalEvents() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
      }, 500);
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.handleConnectionChange(true);
    });

    window.addEventListener('offline', () => {
      this.handleConnectionChange(false);
    });

    // Handle page visibility
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Handle unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Custom app events
    document.addEventListener('app:error', (e) => {
      this.handleError(e.detail);
    });
  }

  setupAccessibility() {
    // Add skip link for keyboard navigation
    this.addSkipLink();
    
    // Enhance keyboard navigation
    this.enhanceKeyboardNavigation();
    
    // Add ARIA live regions for dynamic content
    this.addLiveRegions();
    
    // Setup focus management
    this.setupFocusManagement();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1001;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not exists
    const mainContent = document.querySelector('.donate-container');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  enhanceKeyboardNavigation() {
    // Add keyboard support for donation cards
    const donationCards = document.querySelectorAll('.donate-option');
    
    donationCards.forEach((card, index) => {
      const button = card.querySelector('.button');
      if (button) {
        // Make card focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${button.textContent} - Press Enter to open payment options`);
        
        // Handle keyboard activation
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
          }
        });
      }
    });
  }

  addLiveRegions() {
    // Add live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(liveRegion);
  }

  setupFocusManagement() {
    // Store focus before modal opens
    let lastFocusedElement = null;
    
    document.addEventListener('modal:opened', () => {
      lastFocusedElement = document.activeElement;
    });
    
    document.addEventListener('modal:closed', () => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    });
  }

  setupPerformanceMonitoring() {
    // Monitor performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          this.log('Performance metrics:', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            totalTime: perfData.loadEventEnd - perfData.fetchStart
          });
        }, 0);
      });
    }
  }

  initializeAnalytics() {
    if (!this.config.analytics.enabled) return;
    
    // Initialize Google Analytics (example)
    if (typeof gtag !== 'undefined') {
      gtag('config', this.config.analytics.trackingId, {
        page_title: 'Donation Page',
        page_location: window.location.href
      });
      
      // Track page view
      gtag('event', 'page_view', {
        page_title: 'Donation Page',
        page_location: window.location.href
      });
    }
  }

  handleResize() {
    this.log('Window resized');
    
    // Notify components of resize
    this.dispatchEvent('app:resize', {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  handleConnectionChange(isOnline) {
    this.log(`Connection status: ${isOnline ? 'online' : 'offline'}`);
    
    // Show/hide offline indicator
    this.toggleOfflineIndicator(!isOnline);
    
    // Notify components
    this.dispatchEvent('app:connection', { isOnline });
  }

  handleVisibilityChange() {
    const isVisible = !document.hidden;
    this.log(`Page visibility: ${isVisible ? 'visible' : 'hidden'}`);
    
    // Notify components
    this.dispatchEvent('app:visibility', { isVisible });
  }

  toggleOfflineIndicator(show) {
    let indicator = document.getElementById('offline-indicator');
    
    if (show && !indicator) {
      indicator = document.createElement('div');
      indicator.id = 'offline-indicator';
      indicator.textContent = 'You are currently offline';
      indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b6b;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 1002;
        font-weight: bold;
      `;
      document.body.appendChild(indicator);
    } else if (!show && indicator) {
      indicator.remove();
    }
  }

  announce(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  handleError(error) {
    console.error('Application error:', error);
    
    // Track error in analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message || error,
        fatal: false
      });
    }
    
    // Show user-friendly error message
    this.announce('An error occurred. Please refresh the page and try again.');
  }

  dispatchEvent(eventName, detail = null) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  log(...args) {
    if (this.config.debug) {
      console.log('[DonationApp]', ...args);
    }
  }

  cleanup() {
    this.log('Cleaning up application...');
    
    // Cleanup components
    if (this.components.animation) {
      this.components.animation.destroy();
    }
    
    // Clear any intervals or timeouts
    // (Components should handle their own cleanup)
  }

  // Public API methods
  getVersion() {
    return this.config.version;
  }

  isReady() {
    return this.isInitialized;
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.log('Configuration updated:', this.config);
  }
}

// Initialize the application
window.donationApp = new DonationApp();

// Expose global utilities
window.DonationUtils = {
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },
  
  validateAmount: (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 10000;
  },
  
  debounce: (func, wait) => {
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
};
