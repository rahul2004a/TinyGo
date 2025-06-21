import React from 'react';

const Logo = ({ className = "h-10 w-auto" }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <div className="flex items-center space-x-2">
                {/* Logo Icon */}
                <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                        {/* Stylized T with modern link symbol */}
                        <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            {/* T shape */}
                            <path d="M8 6h8M12 6v12" strokeLinecap="round" />
                            {/* Link symbol */}
                            <circle cx="18" cy="8" r="2" strokeWidth="1.5" />
                            <path d="M16.5 8h-1" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    {/* Enhanced glow effect */}
                    <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-500 rounded-xl opacity-30 blur-md -z-10"></div>
                </div>

                {/* Text Logo */}
                <div className="flex flex-col leading-none">
                    <span className="text-lg font-bold text-white tracking-tight">
                        Tiny<span className="text-yellow-300">Go</span>
                    </span>
                    <span className="text-[10px] text-emerald-200 font-medium tracking-wider uppercase">
                        URL Shortener
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Logo;
