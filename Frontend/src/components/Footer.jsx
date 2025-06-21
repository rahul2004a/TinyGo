import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white py-8 z-40 relative border-t border-emerald-400/20 shadow-inner">
            <div className="container mx-auto px-6 lg:px-14 flex flex-col lg:flex-row lg:justify-between items-center gap-4">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-2 text-yellow-300 drop-shadow">TinyGo</h2>
                    <p className="text-emerald-100">Simplifying URL shortening for efficient sharing</p>
                </div>

                <p className="mt-4 lg:mt-0 text-yellow-200">
                    &copy; 2025 TinyGo. All rights reserved.
                </p>

                <div className="flex space-x-6 mt-4 lg:mt-0">
                    <a href="#" className="hover:text-yellow-300 transition-colors duration-200">
                        <FaFacebook size={24} />
                    </a>
                    <a href="#" className="hover:text-yellow-300 transition-colors duration-200">
                        <FaTwitter size={24} />
                    </a>
                    <a href="#" className="hover:text-yellow-300 transition-colors duration-200">
                        <FaInstagram size={24} />
                    </a>
                    <a href="#" className="hover:text-yellow-300 transition-colors duration-200">
                        <FaLinkedin size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;