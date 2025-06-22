import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UrlShortenerAnimation = React.memo(() => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    const longUrls = useMemo(() => [
        "https://www.example.com/very/long/path/to/some/resource?param1=value1&param2=value2&utm_source=newsletter",
        "https://another-long-domain.com/api/v1/users/123/profile/settings/notifications/preferences/email",
        "https://marketplace.website.com/products/electronics/smartphones/android/samsung/galaxy-s24-ultra-titanium"
    ], []);

    const shortUrls = useMemo(() => [
        "tiny-go.netlify.app/abc123",
        "tiny-go.netlify.app/def456",
        "tiny-go.netlify.app/ghi789"
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % 6);
        }, 3000); // Increased from 2000 to 3000 for better readability

        return () => clearInterval(interval);
    }, []);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }), []);

    return (
        <div className="w-full max-w-lg mx-auto p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center relative overflow-hidden"
                        animate={{
                            rotate: currentStep % 2 === 1 ? 360 : 0,
                            scale: currentStep % 2 === 1 ? [1, 1.1, 1] : 1
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {/* Background pulse */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl"
                            animate={{
                                scale: currentStep % 2 === 1 ? [1, 1.2, 1] : 1,
                                opacity: currentStep % 2 === 1 ? [1, 0.5, 1] : 1
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                        <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                        </svg>
                    </motion.div>
                    <motion.h3
                        className="text-xl font-bold text-slate-800"
                        animate={{
                            color: currentStep % 2 === 1 ? "#059669" : "#1e293b"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        TinyGo Magic ✨
                    </motion.h3>
                </motion.div>

                {/* URL Transformation */}
                <div className="space-y-6">
                    {/* Long URL Input */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Long URL
                        </label>
                        <div className="relative">
                            <motion.div
                                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-600 overflow-hidden"
                                animate={{
                                    borderColor: currentStep >= 1 ? "#10b981" : "#e2e8f0"
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={Math.floor(currentStep / 2)}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="truncate"
                                    >
                                        {longUrls[Math.floor(currentStep / 2) % longUrls.length]}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>

                            {/* Processing indicator */}
                            <AnimatePresence>
                                {currentStep % 2 === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Transformation Arrow */}
                    <motion.div
                        className="flex justify-center relative"
                        variants={itemVariants}
                    >
                        {/* Processing line animation */}
                        <motion.div
                            className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: currentStep % 2 === 1 ? 1 : 0,
                                opacity: currentStep % 2 === 1 ? 1 : 0
                            }}
                            transition={{ duration: 0.5 }}
                        />

                        <motion.div
                            animate={{
                                y: currentStep % 2 === 1 ? [0, -8, 0] : 0,
                                scale: currentStep % 2 === 1 ? [1, 1.2, 1] : 1,
                                rotate: currentStep % 2 === 1 ? [0, 180, 360] : 0
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: currentStep % 2 === 1 ? Infinity : 0,
                                ease: "easeInOut"
                            }}
                            className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl relative z-10"
                        >
                            {/* Pulsing ring */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full"
                                animate={{
                                    scale: currentStep % 2 === 1 ? [1, 1.5, 1] : 1,
                                    opacity: currentStep % 2 === 1 ? [1, 0, 1] : 1
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: currentStep % 2 === 1 ? Infinity : 0
                                }}
                            />
                            <motion.svg
                                className="w-6 h-6 text-white relative z-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{
                                    rotate: currentStep % 2 === 1 ? 180 : 0
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                            </motion.svg>
                        </motion.div>
                    </motion.div>

                    {/* Short URL Output */}
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Shortened URL
                        </label>
                        <motion.div
                            className="w-full p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 rounded-xl overflow-hidden"
                            animate={{
                                borderColor: currentStep % 2 === 0 && currentStep > 0 ? "#10b981" : "#e2e8f0",
                                scale: currentStep % 2 === 0 && currentStep > 0 ? [1, 1.02, 1] : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnimatePresence mode="wait">
                                {currentStep % 2 === 0 && currentStep > 0 ? (
                                    <motion.div
                                        key={Math.floor(currentStep / 2)}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-emerald-700 font-semibold">
                                            {shortUrls[Math.floor((currentStep - 2) / 2) % shortUrls.length]}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
                                            animate={{
                                                boxShadow: ["0 2px 4px rgba(16, 185, 129, 0.3)", "0 4px 8px rgba(16, 185, 129, 0.5)", "0 2px 4px rgba(16, 185, 129, 0.3)"]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            Copy
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-400 text-sm"
                                    >
                                        Your shortened URL will appear here...
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 grid grid-cols-3 gap-4 text-center"
                >
                    <div className="p-3 bg-emerald-50 rounded-xl">
                        <motion.div
                            className="text-xl font-bold text-emerald-600"
                            animate={{ scale: currentStep % 2 === 0 && currentStep > 0 ? [1, 1.1, 1] : 1 }}
                        >
                            99%
                        </motion.div>
                        <div className="text-xs text-slate-600">Shorter</div>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-xl">
                        <motion.div
                            className="text-xl font-bold text-teal-600"
                            animate={{ scale: currentStep % 2 === 1 ? [1, 1.1, 1] : 1 }}
                        >
                            &lt;0.1s
                        </motion.div>
                        <div className="text-xs text-slate-600">Speed</div>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-xl">
                        <motion.div
                            className="text-xl font-bold text-cyan-600"
                            animate={{ scale: currentStep > 0 ? [1, 1.1, 1] : 1 }}
                        >
                            100%
                        </motion.div>
                        <div className="text-xs text-slate-600">Reliable</div>
                    </div>
                </motion.div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                            animate={{
                                x: [
                                    Math.random() * 20,
                                    Math.random() * 100 - 50,
                                    Math.random() * 20
                                ],
                                y: [
                                    Math.random() * 20,
                                    Math.random() * 100 - 50,
                                    Math.random() * 20
                                ],
                                scale: [0, 1, 0.5, 1, 0],
                                opacity: [0, 0.6, 0.8, 0.6, 0],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut"
                            }}
                            style={{
                                left: `${10 + Math.random() * 80}%`,
                                top: `${10 + Math.random() * 80}%`,
                            }}
                        />
                    ))}

                    {/* Success particles when URL is shortened */}
                    <AnimatePresence>
                        {currentStep % 2 === 0 && currentStep > 0 && (
                            <>
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={`success-${i}`}
                                        className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                                        initial={{
                                            scale: 0,
                                            x: "50%",
                                            y: "50%",
                                            opacity: 0
                                        }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            x: `${50 + (Math.random() - 0.5) * 200}%`,
                                            y: `${50 + (Math.random() - 0.5) * 200}%`,
                                            opacity: [0, 1, 0]
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{
                                            duration: 1.5,
                                            delay: i * 0.1,
                                            ease: "easeOut"
                                        }}
                                        style={{
                                            left: "45%",
                                            top: "45%",
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
});

export default UrlShortenerAnimation;
