# Beautiful Toaster System for TinyGo

This document explains how to use the enhanced toaster system that matches your website's beautiful design.

## Features

✨ **Beautiful Design**: Matches your emerald/teal/cyan gradient theme
🎨 **Custom Animations**: Smooth slide-in animations with hover effects
🔧 **Easy to Use**: Simple utility functions for different toast types
📱 **Responsive**: Works perfectly on mobile and desktop
🎯 **Consistent**: Maintains your website's design language

## Basic Usage

Import the toast utility:

```javascript
import { showToast } from "../utils/toast";
```

### Success Toasts

```javascript
showToast.success("URL shortened successfully!");
```

### Error Toasts

```javascript
showToast.error("Failed to create short URL");
```

### Loading Toasts

```javascript
const loadingToast = showToast.loading("Creating short URL...");
// Later dismiss it
showToast.remove(loadingToast);
```

### Info Toasts

```javascript
showToast.info("Your link will expire in 30 days");
```

### Warning Toasts

```javascript
showToast.warning("This action cannot be undone");
```

### TinyGo Branded Toasts

```javascript
// Success with TinyGo branding
showToast.tinygo("Short URL created and copied to clipboard!", "success");

// Error with TinyGo branding
showToast.tinygo("Something went wrong with your link", "error");

// Info with TinyGo branding
showToast.tinygo("Welcome to TinyGo URL Shortener!", "info");
```

## Promise-based Toasts

Perfect for async operations:

```javascript
const createUrlPromise = api.post("/api/urls/shorten", data);

showToast.promise(createUrlPromise, {
  loading: "Creating your short URL...",
  success: "URL created successfully!",
  error: "Failed to create URL",
});
```

## Advanced Options

All toast functions accept an optional options object:

```javascript
showToast.success("Success message", {
  duration: 5000, // 5 seconds
  style: {
    // Additional custom styles
  },
});
```

## Custom Styling

The toaster automatically uses your website's design tokens:

- **Colors**: Emerald, teal, and cyan gradients
- **Typography**: Inter font family
- **Spacing**: Consistent padding and margins
- **Shadows**: Beautiful depth with multiple shadow layers
- **Border Radius**: 12px rounded corners
- **Backdrop**: Blur effects for modern look

## Animation Details

- **Entry**: Smooth slide-down with scale animation
- **Hover**: Subtle lift and scale effect
- **Shimmer**: Animated highlight effect on hover
- **Loading Bar**: Animated progress indicator for loading states

## Utility Functions

```javascript
// Dismiss all toasts
showToast.dismiss();

// Remove specific toast
const toastId = showToast.success("Message");
showToast.remove(toastId);
```

## Examples in Your App

### URL Creation Success

```javascript
const shortenUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/${
  res.shortUrl
}`;
navigator.clipboard.writeText(shortenUrl).then(() => {
  showToast.tinygo("Short URL created and copied to clipboard!", "success");
});
```

### Login Success

```javascript
showToast.success("Welcome back! Login successful!");
```

### Registration Success

```javascript
showToast.success("Account created successfully! Please sign in.");
```

### Error Handling

```javascript
showToast.error("Network error. Please check your connection.");
```

## Design Philosophy

The toaster system follows your website's design principles:

1. **Consistency**: Uses the same gradients and colors as your UI
2. **Accessibility**: High contrast and readable typography
3. **Performance**: Smooth animations without affecting performance
4. **User Experience**: Clear, informative messages with appropriate timing
5. **Brand Identity**: Maintains TinyGo's visual identity

## Browser Support

The enhanced toaster works on all modern browsers and includes:

- CSS Grid and Flexbox for layout
- CSS Custom Properties for theming
- CSS Transforms and Transitions for animations
- Backdrop-filter for blur effects (with fallbacks)

Enjoy your beautiful, consistent toaster system!
