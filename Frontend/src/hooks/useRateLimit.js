import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useStoreContext } from '../contextApi/ContextApi';

export const useRateLimit = () => {
  const { token } = useStoreContext();
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const fetchRateLimitStatus = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await api.get('/api/urls/rate-limit-status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const status = response.data;
      setRateLimitStatus(status);
      setIsRateLimited(status.remainingRequests === 0);
      
      return status;
    } catch (error) {
      console.error('Failed to fetch rate limit status:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const checkRateLimit = useCallback(() => {
    return rateLimitStatus?.remainingRequests > 0;
  }, [rateLimitStatus]);

  const getRemainingTime = useCallback(() => {
    if (!rateLimitStatus?.nextAllowedTime) return null;
    
    const nextTime = new Date(rateLimitStatus.nextAllowedTime);
    const now = new Date();
    const diffMs = nextTime - now;
    
    if (diffMs <= 0) return null;
    
    return {
      milliseconds: diffMs,
      seconds: Math.ceil(diffMs / 1000),
      formatted: `${Math.ceil(diffMs / 1000)} seconds`
    };
  }, [rateLimitStatus]);

  useEffect(() => {
    fetchRateLimitStatus();
  }, [fetchRateLimitStatus]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchRateLimitStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchRateLimitStatus]);

  return {
    rateLimitStatus,
    loading,
    isRateLimited,
    fetchRateLimitStatus,
    checkRateLimit,
    getRemainingTime,
    refresh: fetchRateLimitStatus
  };
};

export default useRateLimit;
