import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { Hourglass } from 'react-loader-spinner';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import Graph from './Graph';
import api from '../../api/api';
import { useStoreContext } from '../../contextApi/ContextApi';

const ShortenItem = ({ originalUrl, shortUrl, clickCount, createdDate, index }) => {
    const { token } = useStoreContext();
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);
    const [analyticToggle, setAnalyticToggle] = useState(false);

    const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL.replace(
        /^https?:\/\//,
        ""
    );

    const analyticsHandler = (shortUrl) => {
        if (!analyticToggle) {
            setSelectedUrl(shortUrl);
        }
        setAnalyticToggle(!analyticToggle);
    }

    const fetchMyShortUrl = async () => {
        setLoader(true);
        try {
            const { data } = await api.get(`/api/urls/analytics/${selectedUrl}?startDate=2024-12-01T00:00:00&endDate=2025-12-31T23:59:59`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            setAnalyticsData(data || []);
            setSelectedUrl("");
            console.log(data);

        } catch (error) {
            setAnalyticsData([]);
            navigate("/error");
            console.log(error);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        if (selectedUrl) {
            fetchMyShortUrl();
        }
    }, [selectedUrl]);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    // Truncate long URLs for better display
    const truncateUrl = (url, maxLength = 60) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    };

    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group animate-fadeIn`}
            style={{ animationDelay: `${index * 100}ms` }}>

            {/* Main Content */}
            <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                    {/* URL Information */}
                    <div className="flex-1 space-y-4">
                        {/* Short URL */}
                        <div className="flex items-center gap-3 group/link">
                            <a
                                href={`${import.meta.env.VITE_REACT_FRONT_END_URL}/${shortUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 flex items-center gap-2"
                            >
                                <span className="font-mono">{subDomain}/{shortUrl}</span>
                                <FaExternalLinkAlt className="text-sm text-emerald-600 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                            </a>
                        </div>

                        {/* Original URL */}
                        <div className="flex items-start gap-2">
                            <div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
                                <p className="text-gray-700 text-sm break-all" title={originalUrl}>
                                    {truncateUrl(originalUrl, 80)}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                                <MdOutlineAdsClick className="text-emerald-600 text-xl" />
                                <span className="font-semibold text-emerald-800">{clickCount}</span>
                                <span className="text-emerald-700 text-sm">
                                    {clickCount === 0 || clickCount === 1 ? "Click" : "Clicks"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 bg-teal-50 rounded-lg px-3 py-2">
                                <FaRegCalendarAlt className="text-teal-600" />
                                <span className="text-teal-800 font-medium">
                                    {dayjs(createdDate).format("MMM DD, YYYY")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
                        <CopyToClipboard
                            onCopy={() => setIsCopied(true)}
                            text={`${import.meta.env.VITE_REACT_FRONT_END_URL}/${shortUrl}`}
                        >
                            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${isCopied
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                                }`}>
                                <span className="text-sm">{isCopied ? "Copied!" : "Copy"}</span>
                                {isCopied ? (
                                    <LiaCheckSolid className="text-lg" />
                                ) : (
                                    <IoCopy className="text-lg" />
                                )}
                            </button>
                        </CopyToClipboard>

                        <button
                            onClick={() => analyticsHandler(shortUrl)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <span className="text-sm">Analytics</span>
                            <MdAnalytics className="text-lg" />
                            {analyticToggle ? (
                                <FaChevronUp className="text-sm" />
                            ) : (
                                <FaChevronDown className="text-sm" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className={`transition-all duration-500 ease-in-out ${analyticToggle ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50/30">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MdAnalytics className="text-emerald-600 text-xl" />
                            <h3 className="text-lg font-semibold text-gray-800">Analytics Overview</h3>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="h-80 relative">
                                {loader ? (
                                    <div className="flex flex-col justify-center items-center h-full">
                                        <div className="flex flex-col items-center gap-3">
                                            <Hourglass
                                                visible={true}
                                                height="50"
                                                width="50"
                                                ariaLabel="hourglass-loading"
                                                colors={['#10b981', '#14b8a6']}
                                            />
                                            <p className='text-gray-600 font-medium'>Loading analytics...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {!analyticsData || analyticsData.length === 0 ? (
                                            <div className="flex flex-col justify-center items-center h-full text-center">
                                                <div className="relative mb-6">
                                                    <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full p-5 w-18 h-18 flex items-center justify-center shadow-lg mx-auto">
                                                        <MdAnalytics className="text-cyan-600 text-3xl" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse">
                                                        <span className="text-white text-xs font-bold">0</span>
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                                                    No Analytics Data
                                                </h4>
                                                <p className="text-gray-600 max-w-sm leading-relaxed mb-4">
                                                    Share your short link to start collecting engagement data and see detailed analytics
                                                </p>
                                                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-200 max-w-sm">
                                                    <div className="flex items-center justify-center gap-2 text-cyan-700">
                                                        <div className="flex gap-1">
                                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                        </div>
                                                        <span className="text-xs font-medium">Waiting for first click...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Graph graphData={analyticsData} />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShortenItem