import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip,
    Filler,
} from "chart.js";

ChartJS.register(
    BarElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    Legend,
    Filler
);

const Graph = ({ graphData }) => {
    const labels = graphData?.map((item, i) => {
        const date = new Date(item.clickDate);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    });
    const userPerDay = graphData?.map((item) => item.count);

    // Create gradient colors for bars
    const createGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)'); // emerald-500 with low opacity
        gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.6)'); // teal-500 with medium opacity
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.9)'); // cyan-500 with high opacity
        return gradient;
    };

    const data = {
        labels:
            graphData && graphData.length > 0
                ? labels
                : ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7", "Jan 8", "Jan 9", "Jan 10", "Jan 11", "Jan 12", "Jan 13", "Jan 14"],
        datasets: [
            {
                label: "Daily Clicks",
                data:
                    graphData.length > 0
                        ? userPerDay
                        : [12, 19, 15, 22, 18, 25, 30, 28, 22, 18, 15, 12, 8, 5],
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                borderColor: 'rgba(6, 182, 212, 1)', // cyan-500
                borderWidth: 2,
                borderRadius: {
                    topLeft: 8,
                    topRight: 8,
                },
                borderSkipped: false,
                barThickness: 'flex',
                maxBarThickness: 40,
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                hoverBackgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                    gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.8)');
                    gradient.addColorStop(1, 'rgba(6, 182, 212, 1)');
                    return gradient;
                },
                hoverBorderColor: 'rgba(6, 182, 212, 1)',
                hoverBorderWidth: 3,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    borderRadius: 6,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 14,
                        weight: '500',
                    },
                    color: '#374151', // gray-700
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937', // gray-800
                bodyColor: '#374151', // gray-700
                borderColor: 'rgba(6, 182, 212, 0.2)',
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: true,
                titleFont: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 14,
                    weight: '600',
                },
                bodyFont: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 13,
                    weight: '500',
                },
                padding: 12,
                caretPadding: 8,
                caretSize: 6,
                titleMarginBottom: 8,
                callbacks: {
                    title: function (context) {
                        return `${context[0].label}`;
                    },
                    label: function (context) {
                        return ` ${context.parsed.y} clicks`;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(156, 163, 175, 0.2)', // gray-400 with low opacity
                    lineWidth: 1,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 12,
                        weight: '500',
                    },
                    color: '#6b7280', // gray-500
                    padding: 12,
                    maxTicksLimit: 8,
                    callback: function (value) {
                        if (Number.isInteger(value)) {
                            return value.toLocaleString();
                        }
                        return "";
                    },
                },
                title: {
                    display: true,
                    text: "Number of Clicks",
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 14,
                        weight: '600',
                    },
                    color: '#374151', // gray-700
                    padding: {
                        top: 0,
                        bottom: 16
                    }
                },
            },
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 12,
                        weight: '500',
                    },
                    color: '#6b7280', // gray-500
                    padding: 8,
                    maxRotation: 0,
                    minRotation: 0,
                },
                title: {
                    display: true,
                    text: "Date",
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 14,
                        weight: '600',
                    },
                    color: '#374151', // gray-700
                    padding: {
                        top: 16,
                        bottom: 0
                    }
                },
            },
        },
        elements: {
            bar: {
                borderSkipped: 'bottom',
            }
        },
        layout: {
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            }
        }
    };

    return (
        <div className="w-full h-full">
            <Bar
                data={data}
                options={options}
                className="!w-full !h-full"
            />
        </div>
    );
};

export default Graph;