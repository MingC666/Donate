/**
 * Payment Modal Controller for Donation Page
 * Handles all payment method interactions and modal management
 */

class PaymentController {
  constructor() {
    this.modal = null;
    this.modalContent = null;
    this.modalTitle = null;
    this.customAmountInput = null;
    this.confirmButton = null;
    this.cancelButton = null;
    this.closeButton = null;
    this.presetButtons = [];
    this.currentPaymentMethod = null;
    this.selectedAmount = null;
    this.isProcessing = false;

    this.paymentMethods = {
      paypal: {
        name: 'PayPal',
        icon: '<i class="fab fa-paypal"></i>',
        baseUrl: 'https://paypal.me/mingc2333',
        color: '#0070ba'
      },
      bmc: {
        name: 'Buy Me a Coffee',
        icon: '<i class="fas fa-mug-hot"></i>',
        baseUrl: 'https://buymeacoffee.com/chenming030',
        color: '#ffdd00'
      },
      venmo: {
        name: 'Venmo',
        icon: '<i class="fab fa-venmo"></i>',
        baseUrl: 'https://venmo.com/Ming-C_23333',
        color: '#3d95ce'
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
    this.createModal();
    this.bindEvents();
    this.setupPaymentButtons();
  }

  createModal() {
    // Modal already exists in HTML, just get references
    this.modal = document.getElementById('paymentModal');
    if (!this.modal) {
      console.error('Payment modal not found in DOM');
      return;
    }

    this.modalContent = this.modal.querySelector('.modal-content');
    this.modalTitle = this.modal.querySelector('#modalTitle');
    this.customAmountInput = this.modal.querySelector('#customAmount');
    this.confirmButton = this.modal.querySelector('#confirmPayment');
    this.cancelButton = this.modal.querySelector('#cancelPayment');
    this.closeButton = this.modal.querySelector('.close');
    this.presetButtons = Array.from(this.modal.querySelectorAll('.preset-btn'));
    this.amountDisplay = this.modal.querySelector('#selectedAmountDisplay');
    this.amountDisplayContainer = this.modal.querySelector('.amount-display');
  }

  bindEvents() {
    if (!this.modal) return;

    // Close modal events
    this.closeButton?.addEventListener('click', () => this.closeModal());
    this.cancelButton?.addEventListener('click', () => this.closeModal());
    
    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.closeModal();
      }
    });

    // Preset amount buttons
    this.presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = btn.getAttribute('data-amount');
        this.selectAmount(amount, btn);
      });
    });

    // Custom amount input
    this.customAmountInput?.addEventListener('input', () => {
      this.clearPresetSelection();
      this.validateAmount();
    });

    this.customAmountInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.processPayment();
      }
    });

    // Confirm payment
    this.confirmButton?.addEventListener('click', () => {
      this.processPayment();
    });
  }

  setupPaymentButtons() {
    const paymentButtons = document.querySelectorAll('[data-payment]');

    paymentButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const paymentMethod = button.getAttribute('data-payment');

        // Only BMC redirects directly, PayPal and Venmo use modal
        if (paymentMethod === 'bmc') {
          // BMC is handled by its direct href link
          return;
        }

        this.openModal(paymentMethod);
      });
    });
  }

  openModal(paymentMethod) {
    if (!this.modal || !this.paymentMethods[paymentMethod]) {
      console.error('Invalid payment method or modal not found');
      return;
    }

    this.currentPaymentMethod = paymentMethod;
    const method = this.paymentMethods[paymentMethod];

    // Update modal content
    this.modalTitle.innerHTML = `${method.icon} ${method.name}`;

    // Apply payment method specific styling
    this.modal.className = `modal ${paymentMethod} show`;

    // Reset form
    this.resetForm();

    // Show modal with proper display
    this.modal.style.display = 'block';
    this.modal.setAttribute('aria-hidden', 'false');

    // Focus management
    this.trapFocus();

    // Analytics (if needed)
    this.trackEvent('modal_opened', paymentMethod);
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove('show');
    this.modal.style.display = 'none';
    this.modal.setAttribute('aria-hidden', 'true');

    // Reset state
    this.currentPaymentMethod = null;
    this.selectedAmount = null;
    this.isProcessing = false;

    // Remove loading state
    if (window.animationController) {
      window.animationController.removeLoadingAnimation(this.confirmButton);
    }
  }

  selectAmount(amount, buttonElement) {
    this.selectedAmount = parseFloat(amount);

    // Show selected amount in input field for user to see/modify
    this.customAmountInput.value = amount;

    // Update amount display
    this.updateAmountDisplay(amount);

    // Update button states
    this.presetButtons.forEach(btn => btn.classList.remove('selected'));
    buttonElement.classList.add('selected');

    // Add visual feedback to input
    this.customAmountInput.style.background = 'linear-gradient(135deg, #f0fffe, #e6fffe)';
    this.customAmountInput.style.borderColor = '#4ecdc4';

    // Reset input styling after a moment
    setTimeout(() => {
      this.customAmountInput.style.background = '';
      this.customAmountInput.style.borderColor = '';
    }, 1500);

    this.validateAmount();
  }

  updateAmountDisplay(amount) {
    if (this.amountDisplay) {
      this.amountDisplay.textContent = `$${amount}`;
      this.amountDisplayContainer.classList.add('active');

      // Remove active class after animation
      setTimeout(() => {
        this.amountDisplayContainer.classList.remove('active');
      }, 1000);
    }
  }

  clearPresetSelection() {
    this.presetButtons.forEach(btn => btn.classList.remove('selected'));

    const customValue = parseFloat(this.customAmountInput.value);
    if (customValue > 0) {
      this.selectedAmount = customValue;
      // Update display when user types custom amount
      this.updateAmountDisplay(customValue);
    } else {
      this.selectedAmount = null;
      if (this.amountDisplay) {
        this.amountDisplay.textContent = '$0';
      }
    }

    // Reset input styling when user types
    this.customAmountInput.style.background = '';
    this.customAmountInput.style.borderColor = '';
  }

  validateAmount() {
    const isValid = this.selectedAmount && this.selectedAmount > 0;
    
    this.confirmButton.disabled = !isValid;
    
    // Remove any previous error messages
    this.hideErrorMessage();
    
    return isValid;
  }

  async processPayment() {
    if (this.isProcessing) return;
    
    // Get final amount
    if (this.customAmountInput.value) {
      this.selectedAmount = parseFloat(this.customAmountInput.value);
    }
    
    if (!this.validateAmount()) {
      this.showErrorMessage('Please select or enter a valid amount');
      return;
    }

    this.isProcessing = true;
    
    // Add loading animation
    if (window.animationController) {
      window.animationController.addLoadingAnimation(this.confirmButton);
    }

    try {
      const paymentUrl = this.buildPaymentUrl();
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Open payment URL
      window.open(paymentUrl, '_blank');
      
      // Show success and close modal
      this.showSuccessMessage('Redirecting to payment...');
      
      setTimeout(() => {
        this.closeModal();
      }, 1500);
      
      // Track successful payment initiation
      this.trackEvent('payment_initiated', this.currentPaymentMethod, this.selectedAmount);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      this.showErrorMessage('Payment processing failed. Please try again.');
      
      if (window.animationController) {
        window.animationController.addErrorAnimation(this.modalContent);
      }
    } finally {
      this.isProcessing = false;
      
      if (window.animationController) {
        window.animationController.removeLoadingAnimation(this.confirmButton);
      }
    }
  }

  buildPaymentUrl() {
    const method = this.paymentMethods[this.currentPaymentMethod];
    let url = method.baseUrl;

    switch (this.currentPaymentMethod) {
      case 'paypal':
        // PayPal.me URL with amount
        url = `https://paypal.me/mingc2333/${this.selectedAmount}`;
        break;

      case 'venmo':
        // Venmo URL with amount and note
        url = `https://venmo.com/Ming-C_23333?txn=pay&amount=${encodeURIComponent(this.selectedAmount)}&note=${encodeURIComponent('Thanks for your support!')}`;
        break;
    }

    return url;
  }

  resetForm() {
    this.selectedAmount = null;
    this.customAmountInput.value = '';
    this.presetButtons.forEach(btn => btn.classList.remove('selected'));
    this.confirmButton.disabled = false;
    this.hideErrorMessage();
    this.hideSuccessMessage();
  }

  showErrorMessage(message) {
    let errorElement = this.modal.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      this.modal.querySelector('.modal-body').appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  hideErrorMessage() {
    const errorElement = this.modal.querySelector('.error-message');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  showSuccessMessage(message) {
    let successElement = this.modal.querySelector('.success-message');
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'success-message';
      this.modal.querySelector('.modal-body').appendChild(successElement);
    }
    
    successElement.textContent = message;
    successElement.classList.add('show');
  }

  hideSuccessMessage() {
    const successElement = this.modal.querySelector('.success-message');
    if (successElement) {
      successElement.classList.remove('show');
    }
  }

  trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    // Handle tab navigation
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    });
  }

  trackEvent(eventName, paymentMethod, amount = null) {
    // Analytics tracking (implement based on your analytics service)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        payment_method: paymentMethod,
        amount: amount,
        currency: 'USD'
      });
    }
    
    console.log('Payment Event:', { eventName, paymentMethod, amount });
  }
}

// Initialize payment controller
window.paymentController = new PaymentController();
