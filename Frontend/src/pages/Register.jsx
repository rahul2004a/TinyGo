import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaUserPlus, FaLink } from 'react-icons/fa';

import api from '../api/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post(
                "/api/auth/public/register",
                data
            );
            reset();
            toast.success("Account created successfully! Please sign in.", {
                position: "bottom-center",
                duration: 3000,
            });
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 flex justify-center items-center p-4'>
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg">
                        <FaUserPlus className="text-white text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent mb-2">
                        Join TinyGo
                    </h1>
                    <p className="text-gray-600">Create your account and start shortening URLs</p>
                </div>

                {/* Register Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit(registerHandler)} className="p-8 space-y-6">

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                                    <FaUser className={`text-lg ${errors.username ? 'text-red-400' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message: "Username must be at least 3 characters"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: "Username can only contain letters, numbers, and underscores"
                                        }
                                    })}
                                    type="text"
                                    placeholder="Choose a username"
                                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${errors.username
                                            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                                        }`}
                                    disabled={loader}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                                    <FaEnvelope className={`text-lg ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email
                                            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                                        }`}
                                    disabled={loader}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                                    <FaLock className={`text-lg ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z0-9]).{6,}$/,
                                            message: "Password must contain at least one lowercase letter and one uppercase letter or number"
                                        }
                                    })}
                                    type="password"
                                    placeholder="Create a secure password"
                                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${errors.password
                                            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                                        }`}
                                    disabled={loader}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={loader}
                            type='submit'
                            className='w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        >
                            {loader ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <FaUserPlus />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                        <p className='text-center text-gray-600'>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className='font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-800 transition-all duration-300'
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-6 space-y-2">
                    <p className="text-sm text-gray-500">
                        By creating an account, you agree to our Terms of Service
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <FaLink />
                        <span>Secure registration with data encryption</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;