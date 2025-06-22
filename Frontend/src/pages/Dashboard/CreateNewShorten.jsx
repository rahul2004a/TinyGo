import React, { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';
import { FaLink, FaSpinner, FaClock } from 'react-icons/fa';
import { Tooltip } from '@mui/material';

import { useStoreContext } from '../../contextApi/ContextApi';
import TextField from '../../components/TextField';
import RateLimitStatus from '../../components/RateLimitStatus';
import api from '../../api/api';
import { showToast } from '../../utils/toast';
import UrlCreatedSuccess from '../../components/UrlCreatedSuccess';

const CreateNewShorten = ({ setOpen, refetch }) => {
    const { token } = useStoreContext();
    const [loading, setLoading] = useState(false);
    const [rateLimitStatus, setRateLimitStatus] = useState(null);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdUrl, setCreatedUrl] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            originalUrl: "",
        },
        mode: "onTouched",
    });

    // Fetch rate limit status
    useEffect(() => {
        fetchRateLimitStatus();
    }, []);

    const fetchRateLimitStatus = async () => {
        try {
            const response = await api.get('/api/urls/rate-limit-status', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRateLimitStatus(response.data);
            setIsRateLimited(response.data.remainingRequests === 0);
        } catch (error) {
            console.error('Failed to fetch rate limit status:', error);
        }
    };

    const createShortUrlHandler = async (data) => {
        if (isRateLimited) {
            showToast.error("Rate limit exceeded. Please wait before creating more URLs.");
            return;
        }

        setLoading(true);
        try {
            const { data: res } = await api.post("/api/urls/shorten", data, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            // Store the created URL data
            setCreatedUrl({
                shortUrl: res.shortUrl,
                originalUrl: data.originalUrl
            });

            const shortenUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/${res.shortUrl}`;
            navigator.clipboard.writeText(shortenUrl).then(() => {
                showToast.tinygo("Short URL created and copied to clipboard!", "success", {
                    duration: 4000,
                });
            });

            await refetch();
            await fetchRateLimitStatus(); // Refresh rate limit status
            reset();
            setOpen(false);
            setShowSuccessModal(true); // Show success modal
        } catch (error) {
            if (error.response?.status === 429) {
                setIsRateLimited(true);
                await fetchRateLimitStatus(); // Refresh status after rate limit error
            } else {
                showToast.error(error.response?.data?.message || "Failed to create short URL");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-md w-full mx-4 relative">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-6 text-white relative">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="bg-white/20 rounded-full p-2">
                                <FaLink className="text-xl" />
                            </div>
                            <h1 className="text-2xl font-bold">Create Short URL</h1>
                        </div>
                        <p className="text-emerald-100 text-center text-sm">
                            Transform your long URL into a short, shareable link
                        </p>

                        {/* Close Button */}
                        <Tooltip title="Close">
                            <button
                                disabled={loading}
                                onClick={() => setOpen(false)}
                                className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300 hover:scale-110"
                            >
                                <RxCross2 className="text-white text-xl" />
                            </button>
                        </Tooltip>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(createShortUrlHandler)} className="p-6 space-y-6">
                        {/* Rate Limit Status */}
                        <RateLimitStatus className="mb-4" />

                        {/* Rate Limit Warning */}
                        {isRateLimited && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-red-700">
                                    <FaClock className="text-sm" />
                                    <span className="text-sm font-medium">
                                        Rate limit reached! You've created the maximum number of URLs allowed per minute.
                                    </span>
                                </div>
                                <p className="text-xs text-red-600 mt-1">
                                    Please wait before creating more URLs.
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Enter your URL
                            </label>
                            <div className="relative">
                                <input
                                    {...register("originalUrl", {
                                        required: "URL is required",
                                        pattern: {
                                            value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                            message: "Please enter a valid URL"
                                        }
                                    })}
                                    type="url"
                                    placeholder="https://example.com"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${errors.originalUrl
                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                        : isRateLimited
                                            ? 'border-red-300 bg-red-50 cursor-not-allowed'
                                            : 'border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                                        }`}
                                    disabled={loading || isRateLimited}
                                />
                                {errors.originalUrl && (
                                    <div className="absolute -bottom-6 left-0">
                                        <p className="text-red-500 text-xs font-medium">
                                            {errors.originalUrl.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${isRateLimited
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : loading
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 text-white'
                                    }`}
                                disabled={loading || isRateLimited}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Creating...
                                    </>
                                ) : isRateLimited ? (
                                    <>
                                        <FaClock />
                                        Rate Limited
                                    </>
                                ) : (
                                    <>
                                        <FaLink />
                                        Create Link
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <FaLink className="text-emerald-600" />
                            <span>Your shortened URL will be automatically copied to clipboard</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && createdUrl && (
                <UrlCreatedSuccess
                    shortUrl={createdUrl.shortUrl}
                    originalUrl={createdUrl.originalUrl}
                    onClose={() => {
                        setShowSuccessModal(false);
                        setCreatedUrl(null);
                    }}
                />
            )}
        </>
    );
}

export default CreateNewShorten