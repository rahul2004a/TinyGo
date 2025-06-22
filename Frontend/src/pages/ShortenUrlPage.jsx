import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import NoUrlFoundPage from './NoUrlFoundPage'

const ShortenUrlPage = () => {
    const { url } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [urlNotFound, setUrlNotFound] = useState(false);
    const [errorType, setErrorType] = useState('not_found'); // 'not_found' | 'service_error'

    useEffect(() => {
        console.log("Checking URL:", url);
        if (url) {
            checkAndRedirectUrl(url);
        }
    }, [url]);

    const checkAndRedirectUrl = async (shortUrl) => {
        try {
            setIsLoading(true);

            // Use a dedicated API endpoint to check if URL exists
            const response = await api.get(`/api/urls/check/${shortUrl}`);

            if (response.status === 200 && response.data.exists) {
                // URL exists, redirect to the backend endpoint which will handle the actual redirect
                window.location.href = import.meta.env.VITE_BACKEND_URL + `/${shortUrl}`;
            } else {
                setErrorType('not_found');
                setUrlNotFound(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("URL check error:", error);

            if (error.response && error.response.status === 404) {
                setErrorType('not_found');
            } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                setErrorType('service_error');
            } else {
                // For other errors, also show URL not found but with different message
                setErrorType('service_error');
            }

            setUrlNotFound(true);
            setIsLoading(false);
        }
    };

    if (urlNotFound) {
        return <NoUrlFoundPage errorType={errorType} />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return null;
}

export default ShortenUrlPage