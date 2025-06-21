import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLink, FaPlus, FaChartLine, FaUsers } from 'react-icons/fa'

import Graph from './Graph'
import ShortenPopUp from './ShortenPopUp'
import Loader from '../../components/Loader'
import ShortenUrlList from './ShortenUrlList'
import { useStoreContext } from '../../contextApi/ContextApi'
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { token } = useStoreContext();
    const [shortenPopUp, setShortenPopUp] = useState(false);

    const { isLoading, data: myShortenUrls = [], refetch } = useFetchMyShortUrls(token, onError)

    const { isLoading: loader, data: totalClicks = [], isError, error } = useFetchTotalClicks(token, onError)

    function onError(error) {
        console.error("Error fetching data:", error);
        navigate("/error");
    }

    // Calculate total links and total clicks for stats
    const totalLinks = myShortenUrls?.length || 0;
    const totalClicksCount = myShortenUrls?.reduce((sum, url) => sum + (url.clickCount || 0), 0) || 0;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
            {loader ? (
                <Loader />
            ) : (
                <div className="lg:px-14 sm:px-8 px-4 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent mb-2">
                            Dashboard
                        </h1>
                        <p className="text-gray-600 text-lg">Monitor and manage your shortened URLs</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Links</p>
                                    <p className="text-3xl font-bold text-emerald-700">{totalLinks}</p>
                                </div>
                                <div className="bg-emerald-100 rounded-full p-3">
                                    <FaLink className="text-emerald-600 text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
                                    <p className="text-3xl font-bold text-teal-700">{totalClicksCount}</p>
                                </div>
                                <div className="bg-teal-100 rounded-full p-3">
                                    <FaChartLine className="text-teal-600 text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Avg. Clicks</p>
                                    <p className="text-3xl font-bold text-cyan-700">
                                        {totalLinks > 0 ? Math.round(totalClicksCount / totalLinks) : 0}
                                    </p>
                                </div>
                                <div className="bg-cyan-100 rounded-full p-3">
                                    <FaUsers className="text-cyan-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Chart Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Analytics Overview</h2>
                            <p className="text-gray-600">Track your link performance over time</p>
                        </div>

                        <div className="p-6">
                            <div className="h-96 relative">
                                {isError ? (
                                    <div className="flex flex-col justify-center items-center h-full">
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                            <p className="text-red-600 font-medium">Error loading analytics data</p>
                                            <p className="text-red-500 text-sm mt-1">{error?.message}</p>
                                        </div>
                                    </div>
                                ) : !totalClicks || totalClicks.length === 0 ? (
                                    <div className="flex flex-col justify-center items-center h-full">
                                        <div className="text-center max-w-lg">
                                            <div className="relative mb-6">
                                                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center shadow-lg">
                                                    <FaChartLine className="text-emerald-600 text-3xl" />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">!</span>
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                                                No Analytics Data Yet
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                                Start sharing your short links to unlock powerful engagement analytics and detailed performance insights
                                            </p>
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                                                <div className="flex items-center justify-center gap-2 text-emerald-700">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    <span className="text-sm font-medium">Analytics will appear here once you start getting clicks</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Graph graphData={totalClicks} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Create New URL Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Your Links</h2>
                            <p className="text-gray-600">Manage and track all your shortened URLs</p>
                        </div>
                        <button
                            className='bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105'
                            onClick={() => setShortenPopUp(true)}
                        >
                            <FaPlus className="text-sm" />
                            Create New Link
                        </button>
                    </div>

                    {/* Links List Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {!isLoading && (!myShortenUrls || myShortenUrls.length === 0) ? (
                            <div className="p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="bg-emerald-50 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                        <FaLink className="text-emerald-600 text-3xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        No Links Created Yet
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        Start by creating your first shortened URL. It's quick and easy!
                                    </p>
                                    <button
                                        onClick={() => setShortenPopUp(true)}
                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                        Create Your First Link
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <ShortenUrlList data={myShortenUrls} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ShortenPopUp
                refetch={refetch}
                open={shortenPopUp}
                setOpen={setShortenPopUp}
            />
        </div>
    )
}

export default DashboardLayout