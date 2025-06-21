import React, { useState } from 'react'

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';
import { FaLink, FaSpinner } from 'react-icons/fa';
import { Tooltip } from '@mui/material';

import { useStoreContext } from '../../contextApi/ContextApi';
import TextField from '../../components/TextField';
import api from '../../api/api';

const CreateNewShorten = ({ setOpen, refetch }) => {
    const { token } = useStoreContext();
    const [loading, setLoading] = useState(false);

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

    const createShortUrlHandler = async (data) => {
        setLoading(true);
        try {
            const { data: res } = await api.post("/api/urls/shorten", data, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            const shortenUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/${res.shortUrl}`;
            navigator.clipboard.writeText(shortenUrl).then(() => {
                toast.success("Short URL created and copied to clipboard!", {
                    position: "bottom-center",
                    className: "mb-5",
                    duration: 3000,
                });
            });

            await refetch();
            reset();
            setOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create short URL");
        } finally {
            setLoading(false);
        }
    };

    return (
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
                                        : 'border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                                    }`}
                                disabled={loading}
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
                            className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Creating...
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
    )
}

export default CreateNewShorten