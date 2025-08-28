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

// Dynamic GIF Detection and Switching
let currentGifIndex = 0;
let availableGifs = [];
let isRandomMode = false; // Set to true for random switching

// Auto-detect available GIF files
async function detectAvailableGifs() {
  const gifs = [];
  let index = 0;

  while (index < 20) { // Check up to 20 possible GIFs
    try {
      const response = await fetch(`assets/images/thank-you${index}.gif`, { method: 'HEAD' });
      if (response.ok) {
        gifs.push(index);
      }
    } catch (error) {
      // File doesn't exist, continue checking
    }
    index++;
  }

  return gifs;
}

// Initialize GIF system
async function initializeGifSystem() {
  availableGifs = await detectAvailableGifs();

  if (availableGifs.length === 0) {
    console.log('No thank-you GIFs found');
    return;
  }

  console.log(`Found ${availableGifs.length} thank-you GIFs:`, availableGifs);

  // Set initial GIF
  const gifElement = document.getElementById('thankYouGif');
  if (gifElement && availableGifs.length > 0) {
    const firstGifNumber = availableGifs[0];
    gifElement.src = `assets/images/thank-you${firstGifNumber}.gif`;

    // Make sure the image is visible
    gifElement.style.display = 'block';
    gifElement.style.opacity = '1';
    gifElement.style.transform = 'scale(1)';

    currentGifIndex = 0;
  }
}

function switchThankYouGif() {
  const gifElement = document.getElementById('thankYouGif');
  if (!gifElement || availableGifs.length === 0) return;

  // Choose next GIF (sequential or random)
  if (isRandomMode) {
    const randomIndex = Math.floor(Math.random() * availableGifs.length);
    currentGifIndex = randomIndex;
  } else {
    currentGifIndex = (currentGifIndex + 1) % availableGifs.length;
  }

  // Make sure the GIF is visible
  gifElement.style.display = 'block';

  // Add transition effect
  gifElement.style.opacity = '0';
  gifElement.style.transform = 'scale(0.8)';

  setTimeout(() => {
    // Change GIF source
    const gifNumber = availableGifs[currentGifIndex];
    gifElement.src = `assets/images/thank-you${gifNumber}.gif`;

    // Fade back in
    gifElement.style.opacity = '1';
    gifElement.style.transform = 'scale(1)';

    // Optional celebration effect
    if (window.animationController) {
      const rect = gifElement.getBoundingClientRect();
      window.animationController.explodeHeart(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
    }
  }, 150);
}


// Thank You Message Switching
let currentMessageIndex = 0;
let isMessageRandomMode = true; // Set to false for sequential switching

const thankYouMessages = [
  "Your support allows us to keep going—every contribution is truly appreciated.",
  "Every donation brings us closer to our goal. Thank you for your generosity.",
  "Your support means the world to us. Every bit counts.",
  "Each contribution helps us achieve our dreams. Thank you for being part of it."
];

function switchThankYouMessage() {
  const messageElement = document.querySelector('.thanks-message');

  if (!messageElement || thankYouMessages.length === 0) return;

  // Choose next message (sequential or random)
  if (isMessageRandomMode) {
    // Random selection (avoid repeating the same message)
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * thankYouMessages.length);
    } while (randomIndex === currentMessageIndex && thankYouMessages.length > 1);
    currentMessageIndex = randomIndex;
  } else {
    // Sequential selection
    currentMessageIndex = (currentMessageIndex + 1) % thankYouMessages.length;
  }

  // Add transition effect
  messageElement.style.opacity = '0';
  messageElement.style.transform = 'translateY(10px)';

  setTimeout(() => {
    // Change message content
    messageElement.textContent = thankYouMessages[currentMessageIndex];

    // Fade back in
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateY(0)';

    // Add subtle highlight effect
    messageElement.style.background = 'linear-gradient(135deg, #f0fffe, #e6fffe)';
    messageElement.style.borderRadius = '8px';
    messageElement.style.padding = '8px 12px';

    // Remove highlight after a moment
    setTimeout(() => {
      messageElement.style.background = '';
      messageElement.style.borderRadius = '';
      messageElement.style.padding = '';
    }, 2000);
  }, 200);
}

// Initialize message system
function initializeMessageSystem() {
  const messageElement = document.querySelector('.thanks-message');
  if (messageElement) {
    // Set initial message
    messageElement.textContent = thankYouMessages[0];

    // Make message clickable
    messageElement.style.cursor = 'pointer';
    messageElement.style.transition = 'all 0.3s ease';
    messageElement.addEventListener('click', switchThankYouMessage);

    // Add hover effect
    messageElement.addEventListener('mouseenter', () => {
      messageElement.style.background = 'rgba(78, 205, 196, 0.05)';
      messageElement.style.borderRadius = '8px';
      messageElement.style.padding = '8px 12px';
    });

    messageElement.addEventListener('mouseleave', () => {
      messageElement.style.background = '';
      messageElement.style.borderRadius = '';
      messageElement.style.padding = '';
    });
  }
}

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
  },

  switchGif: switchThankYouGif,
  switchMessage: switchThankYouMessage,
  setRandomMode: (gif = false, message = false) => {
    isRandomMode = gif;
    isMessageRandomMode = message;
  }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize animation controller
  window.animationController = new AnimationController();

  // Initialize payment controller
  window.paymentController = new PaymentController();

  // Initialize main app
  window.donationApp = new DonationApp();

  // Initialize GIF system
  await initializeGifSystem();

  // Initialize message system
  initializeMessageSystem();

  console.log('Donation page initialized successfully');
  console.log(`Available GIFs: ${availableGifs.length}`);
  console.log(`Available messages: ${thankYouMessages.length}`);
});
