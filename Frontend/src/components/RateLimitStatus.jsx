import React, { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../api/api';
import { useStoreContext } from '../contextApi/ContextApi';

const RateLimitStatus = ({ className = "" }) => {
    const { token } = useStoreContext();
    const [rateLimitStatus, setRateLimitStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRateLimitStatus = async () => {
        if (!token) {
            setRateLimitStatus(null);
            setError(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/api/urls/rate-limit-status', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRateLimitStatus(response.data);
            // console.log('Rate limit status fetched:', response.data);
        } catch (error) {
            console.error('Failed to fetch rate limit status:', error);
            setError(error.response?.data?.message || 'Failed to load rate limit status');
            // Set default values if API fails
            setRateLimitStatus({
                maxRequests: 15,
                timeWindowMinutes: 1,
                currentRequests: 0,
                remainingRequests: 15,
                canCreateUrl: true,
                nextAllowedTime: null
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRateLimitStatus();
    }, [token]);

    // Auto-refresh every 30 seconds instead of 10 to reduce load
    useEffect(() => {
        if (!token) return;

        const interval = setInterval(fetchRateLimitStatus, 30000);
        return () => clearInterval(interval);
    }, [token]);

    // Show loading state only initially
    if (loading && !rateLimitStatus) {
        return (
            <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
                <div className="animate-pulse flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Loading rate limit status...</div>
            </div>
        );
    }

    // Show error state but continue with default values
    if (error && !rateLimitStatus) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center gap-2 text-red-600">
                    <FaExclamationTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Rate Limit Unavailable</span>
                </div>
                <p className="text-xs text-red-500 mt-1">Using default limits (15/min)</p>
            </div>
        );
    }

    // If no token, don't show anything
    if (!token) {
        return null;
    }

    // Default fallback if no status but we have a token
    if (!rateLimitStatus) {
        return (
            <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center gap-2 text-blue-600">
                    <FaCheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Rate Limit: 15 URLs/min</span>
                </div>
                <p className="text-xs text-blue-500 mt-1">No current usage data</p>
            </div>
        );
    }

    const getStatusColor = () => {
        if (rateLimitStatus.remainingRequests === 0) return 'text-red-600';
        if (rateLimitStatus.remainingRequests <= 3) return 'text-amber-600';
        return 'text-green-600';
    };

    const getStatusIcon = () => {
        if (rateLimitStatus.remainingRequests === 0)
            return <FaExclamationTriangle className="text-red-600" />;
        if (rateLimitStatus.remainingRequests <= 3)
            return <FaClock className="text-amber-600" />;
        return <FaCheckCircle className="text-green-600" />;
    };

    const getProgressBarColor = () => {
        const percentage = (rateLimitStatus.remainingRequests / rateLimitStatus.maxRequests) * 100;
        if (percentage === 0) return 'bg-red-500';
        if (percentage <= 20) return 'bg-amber-500';
        return 'bg-green-500';
    };

    const progressPercentage = (rateLimitStatus.remainingRequests / rateLimitStatus.maxRequests) * 100;

    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <span className={`font-semibold text-sm ${getStatusColor()}`}>
                        Rate Limit Status
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {rateLimitStatus.timeWindowMinutes} min window
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                        URLs remaining:
                    </span>
                    <span className={`font-semibold ${getStatusColor()}`}>
                        {rateLimitStatus.remainingRequests}/{rateLimitStatus.maxRequests}
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                {rateLimitStatus.nextAllowedTime && (
                    <p className="text-xs text-gray-500 mt-2">
                        Next reset: {new Date(rateLimitStatus.nextAllowedTime).toLocaleTimeString()}
                    </p>
                )}

                {rateLimitStatus.remainingRequests === 0 && (
                    <p className="text-xs text-red-600 font-medium mt-2">
                        ⚠️ Rate limit reached. Please wait before creating more URLs.
                    </p>
                )}
            </div>
        </div>
    );
};

export default RateLimitStatus;
