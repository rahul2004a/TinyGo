import React from "react";
import { FaLink, FaShareAlt, FaShieldAlt, FaChartLine } from "react-icons/fa";

const AboutPage = () => {
    return (
        <div className="lg:px-14 sm:px-8 px-5 min-h-[calc(100vh-64px)] pt-8">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="sm:text-5xl text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 bg-clip-text text-transparent mb-6">
                    About TinyGo
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                    TinyGo simplifies URL shortening for efficient sharing and powerful analytics.
                    Transform your long URLs into short, memorable links while gaining valuable insights
                    into your audience engagement and link performance.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-start">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-3 mr-6 group-hover:scale-110 transition-transform duration-300">
                            <FaLink className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                                Simple URL Shortening
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Experience the ease of creating short, memorable URLs in just a few clicks.
                                Our intuitive interface and quick setup process ensure you can start
                                shortening URLs without any hassle.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-teal-200 transition-all duration-300">
                    <div className="flex items-start">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-3 mr-6 group-hover:scale-110 transition-transform duration-300">
                            <FaChartLine className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors duration-300">
                                Powerful Analytics
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Gain insights into your link performance with our comprehensive analytics
                                dashboard. Track clicks, geographical data, and referral sources to
                                optimize your marketing strategies.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-cyan-200 transition-all duration-300">
                    <div className="flex items-start">
                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-600 rounded-xl p-3 mr-6 group-hover:scale-110 transition-transform duration-300">
                            <FaShieldAlt className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-cyan-700 transition-colors duration-300">
                                Enhanced Security
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Rest assured with our robust security measures. All shortened URLs are
                                protected with advanced encryption, ensuring your data remains safe and secure.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-start">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-3 mr-6 group-hover:scale-110 transition-transform duration-300">
                            <FaShareAlt className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                                Fast and Reliable
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Enjoy lightning-fast redirects and high uptime with our reliable
                                infrastructure. Your shortened URLs will always be available and
                                responsive, ensuring a seamless experience for your users.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 rounded-2xl p-12 text-center text-white mb-16">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                    To empower individuals and businesses with simple, powerful tools that make
                    sharing and tracking links effortless. We believe in the power of connection
                    and strive to make every click count in your digital journey.
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        10M+
                    </div>
                    <div className="text-gray-600 font-medium">Links Created</div>
                </div>
                <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent mb-2">
                        500K+
                    </div>
                    <div className="text-gray-600 font-medium">Active Users</div>
                </div>
                <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                        99.9%
                    </div>
                    <div className="text-gray-600 font-medium">Uptime</div>
                </div>
                <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent mb-2">
                        24/7
                    </div>
                    <div className="text-gray-600 font-medium">Support</div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gray-50 rounded-2xl p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Ready to Get Started?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Join millions of users who trust TinyGo for their URL shortening needs.
                </p>
                <button className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 hover:from-emerald-700 hover:via-teal-800 hover:to-cyan-900">
                    Start Shortening Now
                </button>
            </div>
        </div>
    );
};

export default AboutPage;