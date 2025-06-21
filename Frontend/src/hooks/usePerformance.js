import { useEffect, useState, useRef } from "react";

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (process.env.NODE_ENV === "development") {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

        // Warn if render time is too long
        if (renderTime > 16) {
          // 60fps = 16.67ms per frame
          console.warn(
            `⚠️ ${componentName} took ${renderTime.toFixed(
              2
            )}ms to render (>16ms)`
          );
        }
      }
    };
  }, [componentName]);
};

// Lazy loading wrapper
export const LazyWrapper = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div style={{ height: "200px" }} />}
    </div>
  );
};
