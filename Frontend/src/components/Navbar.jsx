import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaUser } from "react-icons/fa";

import { useStoreContext } from "../contextApi/ContextApi";
import Logo from "./Logo";

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, user, setUser } = useStoreContext();
    const path = useLocation().pathname;
    const [navbarOpen, setNavbarOpen] = useState(false);

    const onLogOutHandler = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("USER_DATA");
        navigate("/login");
    };

    return (
        <nav className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 backdrop-blur-md border-b border-emerald-400/20 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                    >
                        <Logo className="h-8" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${path === "/"
                                ? "text-yellow-300 font-semibold"
                                : "text-gray-100 hover:text-yellow-300 hover:scale-105"
                                }`}
                        >
                            Home
                            {path === "/" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md shadow-yellow-400/50"></div>
                            )}
                        </Link>

                        <Link
                            to="/about"
                            className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${path === "/about"
                                ? "text-yellow-300 font-semibold"
                                : "text-gray-100 hover:text-yellow-300 hover:scale-105"
                                }`}
                        >
                            About
                            {path === "/about" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md shadow-yellow-400/50"></div>
                            )}
                        </Link>

                        {token && (
                            <Link
                                to="/dashboard"
                                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${path === "/dashboard"
                                    ? "text-yellow-300 font-semibold"
                                    : "text-gray-100 hover:text-yellow-300 hover:scale-105"
                                    }`}
                            >
                                Dashboard
                                {path === "/dashboard" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md shadow-yellow-400/50"></div>
                                )}
                            </Link>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!token ? (
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transform hover:-translate-y-0.5"
                            >
                                Sign Up
                            </Link>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2 text-emerald-100">
                                    <span className="text-sm font-medium">Hello,</span>
                                    <span className="text-sm font-semibold text-yellow-300">
                                        {user?.username || user?.email || "User"}
                                    </span>
                                </div>
                                <button
                                    onClick={onLogOutHandler}
                                    className="inline-flex items-center px-6 py-2.5 border border-emerald-400 text-sm font-medium rounded-xl text-emerald-100 bg-emerald-800/50 backdrop-blur-sm hover:bg-emerald-700/50 hover:text-white hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Log Out
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setNavbarOpen(!navbarOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-100 hover:text-yellow-300 hover:bg-emerald-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500 transition-all duration-300"
                        >
                            {navbarOpen ? (
                                <RxCross2 className="h-6 w-6" />
                            ) : (
                                <IoIosMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden ${navbarOpen ? 'block' : 'hidden'}`}>
                <div className="px-4 pt-2 pb-3 space-y-1 bg-gradient-to-b from-emerald-700/95 to-teal-800/95 backdrop-blur-md border-t border-emerald-400/20">
                    <Link
                        to="/"
                        className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-300 ${path === "/"
                            ? "text-yellow-300 bg-yellow-500/10 border border-yellow-500/20"
                            : "text-gray-100 hover:text-yellow-300 hover:bg-emerald-800/50"
                            }`}
                        onClick={() => setNavbarOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-300 ${path === "/about"
                            ? "text-yellow-300 bg-yellow-500/10 border border-yellow-500/20"
                            : "text-gray-100 hover:text-yellow-300 hover:bg-emerald-800/50"
                            }`}
                        onClick={() => setNavbarOpen(false)}
                    >
                        About
                    </Link>

                    {token && (
                        <Link
                            to="/dashboard"
                            className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-300 ${path === "/dashboard"
                                ? "text-yellow-300 bg-yellow-500/10 border border-yellow-500/20"
                                : "text-gray-100 hover:text-yellow-300 hover:bg-emerald-800/50"
                                }`}
                            onClick={() => setNavbarOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}

                    <div className="pt-3 border-t border-emerald-500/30">
                        {!token ? (
                            <Link
                                to="/register"
                                className="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg transition-all duration-300 shadow-lg"
                                onClick={() => setNavbarOpen(false)}
                            >
                                Sign Up
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                {/* User info section - Mobile */}
                                <div className="px-3 py-2 text-center">
                                    <span className="text-emerald-200 text-sm">Hello, </span>
                                    <span className="text-yellow-300 font-semibold text-sm">
                                        {user?.username || user?.email || "User"}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        onLogOutHandler();
                                        setNavbarOpen(false);
                                    }}
                                    className="block w-full text-center px-4 py-3 text-sm font-medium text-emerald-100 bg-emerald-800/50 border border-emerald-400 hover:bg-emerald-700/50 hover:text-white rounded-lg transition-all duration-300"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;