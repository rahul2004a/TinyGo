import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { FaDownload, FaQrcode, FaSpinner, FaTimes, FaLink } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const QRCodeGenerator = ({ shortUrl, isOpen, onClose }) => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const canvasRef = useRef(null);

    const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL.replace(/^https?:\/\//, "");
    const fullUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/${shortUrl}`;

    useEffect(() => {
        if (isOpen && shortUrl) {
            generateQRCode();
        }
    }, [isOpen, shortUrl]);

    // ESC key functionality
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const generateQRCode = async () => {
        setLoading(true);
        try {
            const canvas = canvasRef.current;
            if (canvas) {
                // Generate QR code with custom styling
                await QRCode.toCanvas(canvas, fullUrl, {
                    width: 280,
                    margin: 2,
                    color: {
                        dark: '#059669', // Emerald color
                        light: '#FFFFFF'
                    },
                    errorCorrectionLevel: 'M'
                });

                // Convert to data URL for download
                const dataUrl = canvas.toDataURL('image/png');
                setQrCodeDataUrl(dataUrl);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadQRCode = async () => {
        if (qrCodeDataUrl) {
            setDownloadLoading(true);
            try {
                const link = document.createElement('a');
                link.download = `tinygo_${shortUrl}_qr.png`;
                link.href = qrCodeDataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Add a small delay to show loading state
                setTimeout(() => {
                    setDownloadLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error downloading QR code:', error);
                setDownloadLoading(false);
            }
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
                    style={{ zIndex: 9999 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-md w-full mx-4 relative"
                        style={{ zIndex: 10000 }}
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

                            <div className="flex items-center gap-3 mb-3 pr-10">
                                <div className="bg-white/20 rounded-full p-3">
                                    <FaQrcode className="text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">QR Code</h2>
                                    <p className="text-emerald-100 text-sm">
                                        Scan to visit your link
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Short URL Display */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaLink className="text-emerald-600" />
                                    <p className="text-sm font-medium text-emerald-800">Short URL:</p>
                                </div>
                                <p className="font-mono text-emerald-700 font-bold text-lg break-all">
                                    {subDomain}/{shortUrl}
                                </p>
                            </div>

                            {/* QR Code */}
                            <div className="flex justify-center mb-6">
                                {loading ? (
                                    <div className="w-72 h-72 bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                                        <FaSpinner className="text-3xl text-emerald-500 animate-spin mb-3" />
                                        <p className="text-gray-600 font-medium">Generating QR Code...</p>
                                    </div>
                                ) : (
                                    <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                                        <canvas
                                            ref={canvasRef}
                                            className="block rounded-lg"
                                        />
                                        <p className="text-center text-xs text-gray-500 mt-2 font-medium">
                                            280 x 280 pixels
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={downloadQRCode}
                                disabled={loading || !qrCodeDataUrl || downloadLoading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                            >
                                {downloadLoading ? (
                                    <>
                                        <FaSpinner className="text-xl animate-spin" />
                                        <span>Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaDownload className="text-xl" />
                                        <span>Download QR Code</span>
                                    </>
                                )}
                            </button>

                            {/* Help Text */}
                            <div className="mt-4 text-center bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-700 font-medium">
                                    💡 Scan this QR code with any camera app to instantly open your shortened URL
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.getElementById('modal-root') || document.body
    );
};

export default QRCodeGenerator;
