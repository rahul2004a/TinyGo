import axios from "axios";
import { showToast } from "../utils/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add response interceptor to handle rate limiting globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const errorData = error.response.data;
      const nextAllowedTime = errorData.nextAllowedTime;

      if (nextAllowedTime) {
        const waitTime = new Date(nextAllowedTime) - new Date();
        const waitSeconds = Math.ceil(waitTime / 1000);

        showToast.error(
          `Rate limit exceeded! You can create ${errorData.maxRequests} URLs per ${errorData.timeWindowMinutes} minute(s). Please wait ${waitSeconds} seconds.`,
          { duration: 6000 }
        );
      } else {
        showToast.error(
          errorData.message || "Too many requests. Please try again later.",
          { duration: 5000 }
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;
