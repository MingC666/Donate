# Donation Page Project

A modern, responsive donation page supporting multiple payment methods including PayPal, Buy Me a Coffee, Venmo, and Apple Pay.

## Features

- 🎨 **Modern UI Design**: Clean, responsive design with animated gradient background
- 💳 **Multiple Payment Methods**: PayPal, Buy Me a Coffee, Venmo, and Apple Pay
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ♿ **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- 🎭 **Interactive Animations**: Floating hearts, sparkle effects, and smooth transitions
- 💰 **Flexible Amounts**: Preset amounts ($1, $3, $5, $10) and custom input
- 🔒 **Secure**: Direct integration with payment providers
- ⚡ **Performance**: Optimized loading and reduced motion support

## Project Structure

```
Donate/
├── index.html              # Main donation page (renamed from donate.html)
├── css/
│   ├── main.css           # Core styles and layout
│   ├── animations.css     # Animation effects
│   └── modals.css         # Payment modal styles
├── js/
│   ├── main.js           # Main application controller
│   ├── animations.js     # Animation controller
│   └── payments.js       # Payment modal controller
├── assets/
│   └── images/
│       ├── bmc_qr.png    # Buy Me a Coffee QR code
│       ├── venmo_qr.jpg  # Venmo QR code
│       ├── paypal_qr.png # PayPal QR code (placeholder)
│       └── applepay_qr.png # Apple Pay QR code (placeholder)
└── README.md
```

## Setup Instructions

### 1. Configuration

Update the payment method configurations in `js/payments.js`:

```javascript
paymentMethods: {
  paypal: {
    baseUrl: 'https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID'
  },
  bmc: {
    baseUrl: 'https://buymeacoffee.com/YOUR_USERNAME'
  },
  venmo: {
    baseUrl: 'https://venmo.com/YOUR_USERNAME'
  },
  applepay: {
    baseUrl: 'https://pay.apple.com' // Configure with Apple Pay JS
  }
}
```

### 2. Replace QR Code Images

Replace the placeholder images in `assets/images/` with your actual QR codes:
- `paypal_qr.png` - Your PayPal donation QR code
- `applepay_qr.png` - Your Apple Pay QR code

### 3. Analytics Setup (Optional)

Add your Google Analytics tracking ID in `js/main.js`:

```javascript
analytics: {
  enabled: true,
  trackingId: 'GA_TRACKING_ID' // Replace with your actual tracking ID
}
```

## Payment Method Integration

### PayPal
1. Create a PayPal donation button at https://www.paypal.com/donate/buttons
2. Replace `XXXXXX` in the PayPal URL with your actual button ID
3. Generate and replace the PayPal QR code image

### Buy Me a Coffee
1. Update the username in the BMC URL
2. The existing QR code should work if it points to the correct profile

### Venmo
1. Update the username in the Venmo URL
2. The existing QR code should work if it points to the correct profile

### Apple Pay
1. Set up Apple Pay merchant account
2. Configure Apple Pay JS integration
3. Update the merchant ID in the configuration

## Customization

### Colors and Styling
- Modify `css/main.css` for layout and color changes
- Update payment method colors in the CSS variables
- Customize animation effects in `css/animations.css`

### Payment Amounts
- Modify preset amounts in the HTML modal section
- Update the preset buttons data-amount attributes
- Customize validation rules in `js/payments.js`

### Animations
- Disable animations by setting `isAnimationEnabled: false` in `js/animations.js`
- Customize heart generation frequency in the animation controller
- Modify explosion effects and sparkle animations

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels and live regions
- Reduced motion support
- High contrast support

## Performance Optimizations

- Lazy loading for images
- Debounced resize handlers
- Efficient animation loops
- Minimal DOM manipulation
- CSS-based animations where possible

## Development

### Local Development
1. Clone the repository
2. Open `donate.html` in a web browser
3. For local server: `python -m http.server 8000` or use Live Server extension

### Testing
- Test all payment flows
- Verify responsive design on different devices
- Check accessibility with screen readers
- Test keyboard navigation
- Validate with different browsers

## Team Collaboration

### Roles and Responsibilities
- **Project Manager**: Timeline coordination and deliverable tracking
- **UI Designer**: Visual design and user experience optimization
- **Product Planner**: Feature requirements and user journey mapping
- **Developers**: Implementation and technical integration
- **QA Team**: Testing and quality assurance

### Discussion Points for Team Review
1. **Payment Method Priority**: Which payment methods are most important?
2. **Amount Presets**: Are $1, $3, $5, $10 the right preset amounts?
3. **Visual Design**: Does the current design align with brand guidelines?
4. **User Experience**: Is the donation flow intuitive and frictionless?
5. **Mobile Experience**: How does the page perform on mobile devices?
6. **Analytics**: What metrics should we track for donation success?

## License

This project is open source. Please ensure compliance with payment provider terms of service.

## Support

For technical issues or questions, please contact the development team or create an issue in the project repository.
