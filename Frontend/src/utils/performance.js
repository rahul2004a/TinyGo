// Performance utilities for optimizing animations and rendering

export const createOptimizedVariants = (baseVariants) => {
  return {
    ...baseVariants,
    transition: {
      ...baseVariants.transition,
      ease: "easeOut", // More performant than complex easing
      duration: Math.min(baseVariants.transition?.duration || 0.3, 0.5), // Cap duration
    },
  };
};

export const optimizeMotionProps = {
  // Reduce layout thrashing
  layout: false,
  // Use transform for better performance
  transformTemplate: ({ x, y, rotate, scale }) =>
    `translate3d(${x}, ${y}, 0) rotate(${rotate}) scale(${scale})`,
  // Enable hardware acceleration
  style: {
    willChange: "transform",
    transform: "translateZ(0)",
  },
};

// Debounced intersection observer for better performance
export const createIntersectionObserver = (callback, options = {}) => {
  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: "50px",
    ...options,
  });
};
