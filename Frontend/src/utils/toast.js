import toast from "react-hot-toast";

// Enhanced toast utility with beautiful styling matching your website
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      style: {
        background:
          "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)",
        color: "white",
        border: "1px solid rgba(16, 185, 129, 0.4)",
        borderRadius: "12px",
        boxShadow: `
          0 20px 25px -5px rgba(16, 185, 129, 0.3), 
          0 10px 10px -5px rgba(16, 185, 129, 0.2),
          0 0 0 1px rgba(16, 185, 129, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth: "420px",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      },
      iconTheme: {
        primary: "white",
        secondary: "#10b981",
      },
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      style: {
        background:
          "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
        color: "white",
        border: "1px solid rgba(239, 68, 68, 0.4)",
        borderRadius: "12px",
        boxShadow: `
          0 20px 25px -5px rgba(239, 68, 68, 0.3), 
          0 10px 10px -5px rgba(239, 68, 68, 0.2),
          0 0 0 1px rgba(239, 68, 68, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth: "420px",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      },
      iconTheme: {
        primary: "white",
        secondary: "#ef4444",
      },
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      style: {
        background:
          "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
        color: "white",
        border: "1px solid rgba(59, 130, 246, 0.4)",
        borderRadius: "12px",
        boxShadow: `
          0 20px 25px -5px rgba(59, 130, 246, 0.3), 
          0 10px 10px -5px rgba(59, 130, 246, 0.2),
          0 0 0 1px rgba(59, 130, 246, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth: "420px",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      },
      iconTheme: {
        primary: "white",
        secondary: "#3b82f6",
      },
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      style: {
        background:
          "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
        color: "white",
        border: "1px solid rgba(6, 182, 212, 0.4)",
        borderRadius: "12px",
        boxShadow: `
          0 20px 25px -5px rgba(6, 182, 212, 0.3), 
          0 10px 10px -5px rgba(6, 182, 212, 0.2),
          0 0 0 1px rgba(6, 182, 212, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth: "420px",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      },
      icon: "ℹ️",
      iconTheme: {
        primary: "white",
        secondary: "#06b6d4",
      },
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      duration: 4500,
      style: {
        background:
          "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
        color: "white",
        border: "1px solid rgba(245, 158, 11, 0.4)",
        borderRadius: "12px",
        boxShadow: `
          0 20px 25px -5px rgba(245, 158, 11, 0.3), 
          0 10px 10px -5px rgba(245, 158, 11, 0.2),
          0 0 0 1px rgba(245, 158, 11, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth: "420px",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      },
      icon: "⚠️",
      iconTheme: {
        primary: "white",
        secondary: "#f59e0b",
      },
      ...options,
    });
  },

  // Custom toast with TinyGo branding
  tinygo: (message, type = "success", options = {}) => {
    const styles = {
      success: {
        background:
          "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)",
        borderColor: "rgba(16, 185, 129, 0.4)",
        shadowColor: "rgba(16, 185, 129, 0.3)",
      },
      error: {
        background:
          "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
        borderColor: "rgba(239, 68, 68, 0.4)",
        shadowColor: "rgba(239, 68, 68, 0.3)",
      },
      info: {
        background:
          "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
        borderColor: "rgba(6, 182, 212, 0.4)",
        shadowColor: "rgba(6, 182, 212, 0.3)",
      },
    };

    const currentStyle = styles[type] || styles.success;

    return toast(message, {
      duration: 4000,
      style: {
        background: currentStyle.background,
        color: "white",
        border: `1px solid ${currentStyle.borderColor}`,
        borderRadius: "12px",
        boxShadow: `
          0 20px 25px -5px ${currentStyle.shadowColor}, 
          0 10px 10px -5px ${currentStyle.shadowColor},
          0 0 0 1px ${currentStyle.borderColor},
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth: "420px",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      },
      icon: "🔗",
      ...options,
    });
  },

  // Promise-based toast for async operations
  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || "Loading...",
        success: messages.success || "Success!",
        error: messages.error || "Something went wrong!",
      },
      {
        style: {
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.95)",
          color: "#374151",
          border: "1px solid #d1d5db",
          padding: "16px 20px",
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "Inter, system-ui, sans-serif",
          maxWidth: "420px",
          backdropFilter: "blur(12px)",
        },
        success: {
          style: {
            background:
              "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)",
            color: "white",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            boxShadow: `
              0 20px 25px -5px rgba(16, 185, 129, 0.3), 
              0 10px 10px -5px rgba(16, 185, 129, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          },
          iconTheme: {
            primary: "white",
            secondary: "#10b981",
          },
        },
        error: {
          style: {
            background:
              "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
            color: "white",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            boxShadow: `
              0 20px 25px -5px rgba(239, 68, 68, 0.3), 
              0 10px 10px -5px rgba(239, 68, 68, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          },
          iconTheme: {
            primary: "white",
            secondary: "#ef4444",
          },
        },
        loading: {
          style: {
            background:
              "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
            color: "white",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            boxShadow: `
              0 20px 25px -5px rgba(59, 130, 246, 0.3), 
              0 10px 10px -5px rgba(59, 130, 246, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          },
          iconTheme: {
            primary: "white",
            secondary: "#3b82f6",
          },
        },
        ...options,
      }
    );
  },

  // Dismiss all toasts
  dismiss: () => toast.dismiss(),

  // Remove specific toast
  remove: (toastId) => toast.dismiss(toastId),
};

export default showToast;
