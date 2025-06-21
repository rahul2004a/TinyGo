import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ShortenUrlPage = () => {
    const { url } = useParams();

    useEffect(() => {
        console.log("Redirecting to:", url);
        if (url) {
            window.location.href = import.meta.env.VITE_BACKEND_URL + `/${url}`;
        }
    }, [url]);
    return <p>Redirecting...</p>;
}

export default ShortenUrlPage