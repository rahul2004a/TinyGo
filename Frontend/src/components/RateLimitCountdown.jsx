import React, { useState, useEffect } from 'react';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';

const RateLimitCountdown = ({ nextAllowedTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!nextAllowedTime) {
      onComplete?.();
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(nextAllowedTime).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft(Math.ceil(difference / 1000));
      } else {
        setTimeLeft(0);
        onComplete?.();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextAllowedTime, onComplete]);

  if (timeLeft <= 0) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 min-w-[280px]">
      <FaExclamationTriangle className="text-yellow-300" />
      <div className="flex-1">
        <p className="font-semibold text-sm">Rate Limit Active</p>
        <p className="text-xs">
          Next URL creation in: {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
        </p>
      </div>
      <FaClock className="text-red-200" />
    </div>
  );
};

export default RateLimitCountdown;
