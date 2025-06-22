package com.url.shortener.exception;

import java.time.LocalDateTime;

public class RateLimitExceededException extends RuntimeException {

    private final int maxRequests;
    private final int timeWindowMinutes;
    private final LocalDateTime nextAllowedTime;
    private final int remainingRequests;

    public RateLimitExceededException(String message, int maxRequests, int timeWindowMinutes,
            LocalDateTime nextAllowedTime, int remainingRequests) {
        super(message);
        this.maxRequests = maxRequests;
        this.timeWindowMinutes = timeWindowMinutes;
        this.nextAllowedTime = nextAllowedTime;
        this.remainingRequests = remainingRequests;
    }

    public int getMaxRequests() {
        return maxRequests;
    }

    public int getTimeWindowMinutes() {
        return timeWindowMinutes;
    }

    public LocalDateTime getNextAllowedTime() {
        return nextAllowedTime;
    }

    public int getRemainingRequests() {
        return remainingRequests;
    }
}
