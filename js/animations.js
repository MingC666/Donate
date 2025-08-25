/**
 * Animation Controller for Donation Page
 * Handles heart animations, explosions, and visual effects
 */

class AnimationController {
  constructor() {
    this.heartsContainer = null;
    this.heartInterval = null;
    this.isAnimationEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createHeartsContainer();
    if (this.isAnimationEnabled) {
      this.startHeartAnimation();
    }
    this.setupCardAnimations();
  }

  createHeartsContainer() {
    this.heartsContainer = document.querySelector('.hearts');
    if (!this.heartsContainer) {
      this.heartsContainer = document.createElement('div');
      this.heartsContainer.className = 'hearts';
      document.body.appendChild(this.heartsContainer);
    }
  }

  startHeartAnimation() {
    if (this.heartInterval) {
      clearInterval(this.heartInterval);
    }
    
    // Create hearts at intervals
    this.heartInterval = setInterval(() => {
      this.createHeart();
    }, 600); // Every 600ms for better performance
  }

  stopHeartAnimation() {
    if (this.heartInterval) {
      clearInterval(this.heartInterval);
      this.heartInterval = null;
    }
  }

  createHeart() {
    if (!this.heartsContainer || !this.isAnimationEnabled) return;

    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.setAttribute('role', 'presentation');
    heart.setAttribute('aria-hidden', 'true');

    // Random size between 15-30px
    const size = Math.random() * 15 + 15;
    heart.style.fontSize = `${size}px`;

    // Random horizontal position
    let x = Math.random() * (window.innerWidth - size);
    let y = -size;
    
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    // Random fall speed and horizontal drift
    const speed = Math.random() * 0.8 + 0.4; // 0.4-1.2 px/frame
    const vx = (Math.random() - 0.5) * 0.4; // Horizontal drift

    let paused = false;
    let animationFrame = null;

    // Event listeners
    const handleMouseEnter = () => {
      paused = true;
      heart.classList.add('hovered');
    };

    const handleMouseLeave = () => {
      paused = false;
      heart.classList.remove('hovered');
    };

    const handleClick = (e) => {
      e.preventDefault();
      this.explodeHeart(e.clientX, e.clientY);
      this.removeHeart(heart);
    };

    heart.addEventListener('mouseenter', handleMouseEnter);
    heart.addEventListener('mouseleave', handleMouseLeave);
    heart.addEventListener('click', handleClick);

    this.heartsContainer.appendChild(heart);

    // Animation loop
    const animate = () => {
      if (!paused) {
        y += speed;
        x += vx;
      }
      
      heart.style.top = `${y}px`;
      heart.style.left = `${x}px`;

      if (y < window.innerHeight + 50 && heart.parentNode) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        this.removeHeart(heart);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // Store cleanup function
    heart._cleanup = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      heart.removeEventListener('mouseenter', handleMouseEnter);
      heart.removeEventListener('mouseleave', handleMouseLeave);
      heart.removeEventListener('click', handleClick);
    };
  }

  removeHeart(heart) {
    if (heart && heart.parentNode) {
      if (heart._cleanup) {
        heart._cleanup();
      }
      heart.parentNode.removeChild(heart);
    }
  }

  explodeHeart(x, y) {
    if (!this.isAnimationEnabled) return;

    const sparkCount = 8;
    const sparkles = ['✨', '⭐', '💫', '🌟'];

    for (let i = 0; i < sparkCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
      star.setAttribute('role', 'presentation');
      star.setAttribute('aria-hidden', 'true');
      
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      
      // Random explosion direction
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 100 + 50;
      
      star.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      star.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      
      document.body.appendChild(star);
      
      // Remove after animation
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 800);
    }
  }

  setupCardAnimations() {
    const cards = document.querySelectorAll('.donate-option');
    
    // Add staggered entrance animation
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add sparkle effect on hover
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addSparkles(card);
      });
    });
  }

  addSparkles(element) {
    if (!this.isAnimationEnabled) return;

    const rect = element.getBoundingClientRect();
    const sparkleCount = 3;

    for (let i = 0; i < sparkleCount; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.setAttribute('role', 'presentation');
        sparkle.setAttribute('aria-hidden', 'true');
        
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
        
        element.style.position = 'relative';
        element.appendChild(sparkle);
        
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
        }, 1500);
      }, i * 100);
    }
  }

  // Utility methods for other components
  addSuccessAnimation(element) {
    if (!this.isAnimationEnabled) return;
    
    element.classList.add('success-bounce');
    setTimeout(() => {
      element.classList.remove('success-bounce');
    }, 600);
  }

  addErrorAnimation(element) {
    if (!this.isAnimationEnabled) return;
    
    element.classList.add('error-shake');
    setTimeout(() => {
      element.classList.remove('error-shake');
    }, 500);
  }

  addLoadingAnimation(element) {
    element.classList.add('loading');
  }

  removeLoadingAnimation(element) {
    element.classList.remove('loading');
  }

  // Cleanup method
  destroy() {
    this.stopHeartAnimation();
    
    // Remove all hearts
    if (this.heartsContainer) {
      const hearts = this.heartsContainer.querySelectorAll('.heart');
      hearts.forEach(heart => this.removeHeart(heart));
    }
  }
}

// Create global instance
window.animationController = new AnimationController();

// Handle visibility change to pause/resume animations
document.addEventListener('visibilitychange', () => {
  if (window.animationController) {
    if (document.hidden) {
      window.animationController.stopHeartAnimation();
    } else {
      window.animationController.startHeartAnimation();
    }
  }
});

// Handle reduced motion preference changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', () => {
    if (window.animationController) {
      window.animationController.isAnimationEnabled = !mediaQuery.matches;
      if (mediaQuery.matches) {
        window.animationController.stopHeartAnimation();
      } else {
        window.animationController.startHeartAnimation();
      }
    }
  });
}
