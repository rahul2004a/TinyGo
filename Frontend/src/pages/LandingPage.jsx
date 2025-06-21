import React, { useMemo } from 'react'
import { motion } from "framer-motion";

import Card from '../components/Card';
import UrlShortenerAnimation from '../components/UrlShortenerAnimation';
import { useStoreContext } from '../contextApi/ContextApi.jsx';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const { token } = useStoreContext();

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.15 // Reduced from 0.2 for faster loading
            }
        }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 } // Reduced duration
        }
    }), []);

    const floatingAnimation = useMemo(() => ({
        y: [-5, 5, -5], // Reduced range
        transition: {
            duration: 4, // Increased duration for smoother animation
            repeat: Infinity,
            ease: "easeInOut"
        }
    }), []);

    const features = useMemo(() => [
        {
            title: "Lightning Fast URL Shortening",
            desc: "Create short, memorable URLs in milliseconds with our cutting-edge technology. Our optimized infrastructure ensures instant link generation and blazing-fast redirects.",
            icon: "⚡",
            gradient: "from-yellow-400 to-orange-500"
        },
        {
            title: "Advanced Analytics & Insights",
            desc: "Unlock the power of data with comprehensive analytics. Track clicks, analyze user behavior, and gain valuable insights to optimize your marketing strategies.",
            icon: "📊",
            gradient: "from-emerald-400 to-teal-600"
        },
        {
            title: "Enterprise-Grade Security",
            desc: "Your data is protected by military-grade encryption and advanced security protocols. Rest assured knowing your links and analytics are completely secure.",
            icon: "🛡️",
            gradient: "from-green-400 to-emerald-600"
        },
        {
            title: "Global Infrastructure",
            desc: "Experience 99.9% uptime with our worldwide network of servers. Your shortened URLs are always available and responsive, no matter where your audience is.",
            icon: "🌍",
            gradient: "from-cyan-400 to-teal-600"
        }
    ], []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-60"
                ></motion.div>
                <motion.div
                    animate={{
                        x: [0, -120, 0],
                        y: [0, 80, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-60"
                ></motion.div>
            </div>

            <div className="relative z-10 lg:px-14 sm:px-8 px-4 pt-20">
                {/* Hero Section */}
                <motion.div
                    className="lg:flex-row flex-col lg:py-16 pt-8 lg:gap-16 gap-12 flex justify-between items-center min-h-[80vh]"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ willChange: 'transform' }}
                >
                    <motion.div className="flex-1 space-y-8" variants={itemVariants}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="inline-block"
                        >
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold text-sm tracking-wide uppercase">
                                ✨ Revolutionary URL Shortening
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="font-bold font-inter bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent md:text-6xl sm:text-5xl text-4xl md:leading-[70px] sm:leading-[55px] leading-[50px] lg:w-full md:w-[90%] w-full"
                        >
                            Transform Long URLs into
                            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Powerful Links
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-slate-600 text-lg leading-relaxed max-w-2xl"
                            variants={itemVariants}
                        >
                            Experience the future of link management with TinyGo. Create, track, and optimize your URLs with advanced analytics, custom domains, and enterprise-grade security.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            variants={itemVariants}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 group"
                            >
                                <Link to='/dashboard' className="flex items-center gap-2">
                                    Get Started Free
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </Link>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-white/50 backdrop-blur-sm"
                            >
                                <Link to='/dashboard' className="flex items-center gap-2">
                                    View Demo
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-10V3m-3 6V3m8 6V3"></path>
                                    </svg>
                                </Link>
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="flex flex-wrap gap-8 pt-8"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">1M+</div>
                                <div className="text-slate-600 text-sm">Links Created</div>
                            </motion.div>
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">50K+</div>
                                <div className="text-slate-600 text-sm">Active Users</div>
                            </motion.div>
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">99.9%</div>
                                <div className="text-slate-600 text-sm">Uptime</div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="flex-1 flex justify-center w-full relative"
                        variants={itemVariants}
                    >
                        <motion.div
                            animate={floatingAnimation}
                            className="relative w-full max-w-lg"
                        >
                            <UrlShortenerAnimation />

                            {/* Simplified decorative elements */}
                            <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-15 blur-3xl -z-10"></div>
                            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full opacity-15 blur-3xl -z-10"></div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    className="py-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-emerald-900 bg-clip-text text-transparent mb-6">
                            Why Choose TinyGo?
                        </h2>
                        <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
                            Join thousands of businesses and individuals who trust TinyGo for their link management needs
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                        {features.map((feature, index) => (
                            <Card
                                key={`${feature.title}-${index}`}
                                title={feature.title}
                                desc={feature.desc}
                                icon={feature.icon}
                                gradient={feature.gradient}
                                delay={index * 0.05} // Reduced delay for faster loading
                            />
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="py-20 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Transform Your Links?
                            </h3>
                            <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto">
                                Join over 50,000 users who have shortened millions of links with TinyGo
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Link to='/dashboard'>
                                    Start Shortening Now - It's Free!
                                </Link>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default LandingPage