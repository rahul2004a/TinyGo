package com.url.shortener.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class RateLimiterService {

    @Value("${rate.limit.max.requests:15}")
    private int maxRequests;

    @Value("${rate.limit.time.window.minutes:1}")
    private int timeWindowMinutes;

    private final Map<String, List<LocalDateTime>> userRequestLogs = new ConcurrentHashMap<>();

    public boolean isRequestAllowed(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(timeWindowMinutes);

        userRequestLogs.putIfAbsent(userId, new CopyOnWriteArrayList<>());
        List<LocalDateTime> requestLog = userRequestLogs.get(userId);

        cleanupOldRequests(requestLog, windowStart);

        if (requestLog.size() >= maxRequests) {
            return false;
        }

        requestLog.add(now);
        return true;
    }

    public int getRemainingRequests(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(timeWindowMinutes);

        List<LocalDateTime> requestLog = userRequestLogs.get(userId);
        if (requestLog == null) {
            return maxRequests;
        }

        cleanupOldRequests(requestLog, windowStart);
        return Math.max(0, maxRequests - requestLog.size());
    }

    public LocalDateTime getTimeUntilNextAllowedRequest(String userId) {
        List<LocalDateTime> requestLog = userRequestLogs.get(userId);
        if (requestLog == null || requestLog.size() < maxRequests) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(timeWindowMinutes);

        cleanupOldRequests(requestLog, windowStart);

        if (requestLog.size() < maxRequests) {
            return null;
        }

        LocalDateTime oldestRequest = requestLog.stream()
                .min(LocalDateTime::compareTo)
                .orElse(now);

        return oldestRequest.plusMinutes(timeWindowMinutes);
    }

    private void cleanupOldRequests(List<LocalDateTime> requestLog, LocalDateTime windowStart) {
        requestLog.removeIf(timestamp -> timestamp.isBefore(windowStart));
    }

    public void resetUserRateLimit(String userId) {
        userRequestLogs.remove(userId);
    }

    public int getCurrentRequestCount(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(timeWindowMinutes);

        List<LocalDateTime> requestLog = userRequestLogs.get(userId);
        if (requestLog == null) {
            return 0;
        }

        cleanupOldRequests(requestLog, windowStart);
        return requestLog.size();
    }

    public void cleanupExpiredLogs() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(timeWindowMinutes);

        userRequestLogs.entrySet().removeIf(entry -> {
            List<LocalDateTime> requestLog = entry.getValue();
            cleanupOldRequests(requestLog, windowStart);
            return requestLog.isEmpty();
        });
    }
}
