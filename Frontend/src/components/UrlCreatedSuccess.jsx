import React, { useState } from 'react';
import { FaCheck, FaCopy, FaQrcode, FaTimes, FaLink } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCodeGenerator from './QRCodeGenerator';
import { motion } from 'framer-motion';

const UrlCreatedSuccess = ({ shortUrl, originalUrl, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [qrCodeOpen, setQrCodeOpen] = useState(false);

    const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL.replace(/^https?:\/\//, "");
    const fullShortUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/${shortUrl}`;

    const handleCopy = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-lg w-full mx-4 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-6 text-white relative">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300 hover:scale-110 hover:rotate-90"
                        >
                            <FaTimes className="text-lg" />
                        </button>

                        <div className="flex items-center gap-3 mb-2 pr-10">
                            <div className="bg-white/20 rounded-full p-3">
                                <FaCheck className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">URL Created Successfully! 🎉</h2>
                                <p className="text-emerald-100 text-sm">
                                    Your link is ready to share
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Original URL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <FaLink className="text-gray-500" />
                                Original URL
                            </label>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-700 break-all font-medium">{originalUrl}</p>
                            </div>
                        </div>

                        {/* Short URL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <FaLink className="text-emerald-600" />
                                Shortened URL
                            </label>
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4">
                                <p className="font-mono text-emerald-700 font-bold text-lg break-all">
                                    {subDomain}/{shortUrl}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <CopyToClipboard
                                text={fullShortUrl}
                                onCopy={handleCopy}
                            >
                                <button className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${isCopied
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                                    }`}>
                                    {isCopied ? (
                                        <>
                                            <LiaCheckSolid className="text-lg" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <IoCopy className="text-lg" />
                                            <span>Copy URL</span>
                                        </>
                                    )}
                                </button>
                            </CopyToClipboard>

                            <button
                                onClick={() => setQrCodeOpen(true)}
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                            >
                                <FaQrcode className="text-lg" />
                                <span>QR Code</span>
                            </button>
                        </div>

                        {/* Success Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-700 font-medium">
                                <strong>🎯 Success!</strong> Your URL has been shortened and copied to your clipboard.
                                You can now share it or generate a QR code for easy scanning.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* QR Code Modal */}
            <QRCodeGenerator
                shortUrl={shortUrl}
                isOpen={qrCodeOpen}
                onClose={() => setQrCodeOpen(false)}
            />
        </>
    );
};

export default UrlCreatedSuccess;
