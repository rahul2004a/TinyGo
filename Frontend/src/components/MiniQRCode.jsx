import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const MiniQRCode = ({ shortUrl, size = 60 }) => {
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    const fullUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/${shortUrl}`;

    useEffect(() => {
        if (shortUrl) {
            generateMiniQRCode();
        }
    }, [shortUrl]);

    const generateMiniQRCode = async () => {
        setLoading(true);
        try {
            const canvas = canvasRef.current;
            if (canvas) {
                await QRCode.toCanvas(canvas, fullUrl, {
                    width: size,
                    margin: 1,
                    color: {
                        dark: '#059669',
                        light: '#FFFFFF'
                    },
                    errorCorrectionLevel: 'L'
                });
            }
        } catch (error) {
            console.error('Error generating mini QR code:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inline-block">
            {loading ? (
                <div
                    className="bg-gray-200 animate-pulse rounded"
                    style={{ width: size, height: size }}
                />
            ) : (
                <canvas
                    ref={canvasRef}
                    className="rounded border border-gray-200 shadow-sm"
                />
            )}
        </div>
    );
};

export default MiniQRCode;
