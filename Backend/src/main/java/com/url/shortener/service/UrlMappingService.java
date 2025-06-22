package com.url.shortener.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.url.shortener.dtos.ClickEventDTO;
import com.url.shortener.dtos.UrlMappingDTO;
import com.url.shortener.models.ClickEvent;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import com.url.shortener.repository.ClickEventRepository;
import com.url.shortener.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.zip.CRC32;

@Service
public class UrlMappingService implements Serializable {

    private static final Logger logger = LoggerFactory.getLogger(UrlMappingService.class);

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String URL_CACHE_PREFIX = "shorturl:";
    private static final int CLICK_DEDUP_WINDOW_SECONDS = 5;

    private static final String BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int BASE = BASE62_ALPHABET.length();

    private final Map<String, LocalDateTime> recentClicks = new ConcurrentHashMap<>();

    private boolean isRedisAvailable() {
        try {
            redisTemplate.opsForValue().get("redis_health_check");
            return true;
        } catch (Exception e) {
            logger.debug("Redis availability check failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean safeRedisOperation(Runnable operation, String failureMessage) {
        try {
            operation.run();
            return true;
        } catch (Exception e) {
            logger.warn("{}: {}", failureMessage, e.getMessage());
            return false;
        }
    }

    @Transactional
    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrlWithCRC32(originalUrl);

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setLocalDate(LocalDateTime.now());

        UrlMapping savedUrlMapping;

        if (isRedisAvailable()) {
            // Store in Redis first, then save to database
            boolean redisCacheSuccess = safeRedisOperation(
                    () -> redisTemplate.opsForValue().set(URL_CACHE_PREFIX + shortUrl, urlMapping, 1, TimeUnit.DAYS),
                    "Failed to cache URL mapping for short URL: " + shortUrl);

            if (redisCacheSuccess) {
                logger.info("Successfully cached URL mapping in Redis first for short URL: {}", shortUrl);
            }

            savedUrlMapping = urlMappingRepository.save(urlMapping);

            if (redisCacheSuccess) {
                safeRedisOperation(
                        () -> redisTemplate.opsForValue().set(URL_CACHE_PREFIX + shortUrl, savedUrlMapping, 1,
                                TimeUnit.DAYS),
                        "Failed to update Redis cache with saved URL mapping for short URL: " + shortUrl);
            }
        } else {
            logger.info("Redis is not available. Saving directly to database for short URL: {}", shortUrl);
            savedUrlMapping = urlMappingRepository.save(urlMapping);
        }

        return convertToDto(savedUrlMapping);
    }

    private UrlMappingDTO convertToDto(UrlMapping savedUrlMapping) {
        UrlMappingDTO urlMappingDTO = new UrlMappingDTO();
        urlMappingDTO.setId(savedUrlMapping.getId());
        urlMappingDTO.setOriginalUrl(savedUrlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(savedUrlMapping.getShortUrl());
        urlMappingDTO.setClickCount(savedUrlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(savedUrlMapping.getLocalDate());
        urlMappingDTO.setUsername(savedUrlMapping.getUser().getUsername());
        return urlMappingDTO;
    }

    private String generateShortUrlWithCRC32(String originalUrl) {
        String shortUrl = generateCRC32Hash(originalUrl);
        int collisionCount = 0;

        while (urlMappingRepository.findByShortUrl(shortUrl) != null) {
            collisionCount++;
            String modifiedUrl = originalUrl + "_collision_" + collisionCount;
            shortUrl = generateCRC32Hash(modifiedUrl);

            if (collisionCount > 1000) {
                shortUrl = generateCRC32Hash(originalUrl + System.currentTimeMillis());
                break;
            }
        }

        return shortUrl;
    }

    private String generateCRC32Hash(String input) {
        CRC32 crc32 = new CRC32();
        crc32.update(input.getBytes());
        long crcValue = crc32.getValue();

        return encodeBase62(Math.abs(crcValue));
    }

    private String encodeBase62(long number) {
        if (number == 0) {
            return String.valueOf(BASE62_ALPHABET.charAt(0));
        }

        StringBuilder encoded = new StringBuilder();
        while (number > 0) {
            encoded.insert(0, BASE62_ALPHABET.charAt((int) (number % BASE)));
            number /= BASE;
        }

        while (encoded.length() < 7) {
            encoded.insert(0, BASE62_ALPHABET.charAt(0));
        }

        return encoded.toString();
    }

    public List<UrlMappingDTO> getUrlByUser(User user) {
        return urlMappingRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ClickEventDTO> getClickEventByDate(String shortUrl, LocalDateTime start, LocalDateTime end) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            return clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping, start, end).stream()
                    .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()))
                    .entrySet().stream()
                    .map(entry -> {
                        ClickEventDTO clickEventDTO = new ClickEventDTO();
                        clickEventDTO.setClickDate(entry.getKey());
                        clickEventDTO.setCount(entry.getValue());
                        return clickEventDTO;
                    })
                    .collect(Collectors.toList());
        }
        return null;
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate start, LocalDate end) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings,
                start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
    }

    @Transactional
    public UrlMapping getOriginalUrl(String shortUrl) {
        boolean redisAvailable = isRedisAvailable();

        if (redisAvailable) {
            try {
                Object cached = redisTemplate.opsForValue().get(URL_CACHE_PREFIX + shortUrl);
                logger.debug("Checking Redis cache for shortUrl: {}, cached object: {}", shortUrl,
                        cached != null ? cached.getClass().getSimpleName() : "null");

                UrlMapping cachedUrlMapping = null;
                if (cached instanceof UrlMapping) {
                    cachedUrlMapping = (UrlMapping) cached;
                    logger.debug("Found UrlMapping in cache for shortUrl: {}", shortUrl);
                } else if (cached instanceof LinkedHashMap) {
                    cachedUrlMapping = objectMapper.convertValue(cached, UrlMapping.class);
                    logger.debug("Found LinkedHashMap in cache for shortUrl: {}, converted to UrlMapping", shortUrl);
                }

                if (cachedUrlMapping != null) {
                    UrlMapping validatedUrlMapping;
                    if (cachedUrlMapping.getId() == null) {
                        validatedUrlMapping = urlMappingRepository.findByShortUrl(shortUrl);
                        if (validatedUrlMapping == null) {
                            logger.warn("URL mapping found in cache but not in database for shortUrl: {}", shortUrl);
                            return null;
                        }
                    } else {
                        Long cachedId = cachedUrlMapping.getId();
                        validatedUrlMapping = urlMappingRepository.findById(cachedUrlMapping.getId())
                                .orElse(null);
                        if (validatedUrlMapping == null) {
                            logger.warn(
                                    "URL mapping found in cache but database record with ID {} not found for shortUrl: {}",
                                    cachedId, shortUrl);
                            return null;
                        }
                    }

                    recordClickAsync(validatedUrlMapping);
                    logger.info("Successfully retrieved URL from cache for shortUrl: {}", shortUrl);
                    return validatedUrlMapping;
                }
            } catch (Exception e) {
                logger.warn("Redis operation failed while retrieving URL '{}'. Falling back to database. Error: {}",
                        shortUrl, e.getMessage());
                redisAvailable = false;
            }
        } else {
            logger.info("Redis is not available. Using database directly for shortUrl: {}", shortUrl);
        }

        logger.debug("Cache miss or Redis unavailable for shortUrl: {}, querying database", shortUrl);
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            logger.info("Successfully retrieved URL from database for shortUrl: {}", shortUrl);
            recordClickAsync(urlMapping);

            if (redisAvailable) {
                final UrlMapping finalUrlMapping = urlMapping;
                safeRedisOperation(
                        () -> redisTemplate.opsForValue().set(URL_CACHE_PREFIX + shortUrl, finalUrlMapping, 1,
                                TimeUnit.DAYS),
                        "Failed to cache URL mapping from database for shortUrl: " + shortUrl);
            }
        } else {
            logger.info("URL mapping not found in database for shortUrl: {}", shortUrl);
        }
        return urlMapping;
    }

    public UrlMapping checkOriginalUrl(String shortUrl) {
        boolean redisAvailable = isRedisAvailable();

        if (redisAvailable) {
            try {
                Object cached = redisTemplate.opsForValue().get(URL_CACHE_PREFIX + shortUrl);

                UrlMapping cachedUrlMapping = null;
                if (cached instanceof UrlMapping) {
                    cachedUrlMapping = (UrlMapping) cached;
                } else if (cached instanceof LinkedHashMap) {
                    cachedUrlMapping = objectMapper.convertValue(cached, UrlMapping.class);
                }

                if (cachedUrlMapping != null) {
                    UrlMapping validatedUrlMapping;
                    if (cachedUrlMapping.getId() == null) {
                        validatedUrlMapping = urlMappingRepository.findByShortUrl(shortUrl);
                    } else {
                        validatedUrlMapping = urlMappingRepository.findById(cachedUrlMapping.getId())
                                .orElse(null);
                    }

                    if (validatedUrlMapping != null) {
                        final UrlMapping finalUrlMapping = validatedUrlMapping;
                        safeRedisOperation(
                                () -> redisTemplate.opsForValue().set(URL_CACHE_PREFIX + shortUrl, finalUrlMapping, 1,
                                        TimeUnit.DAYS),
                                "Failed to update cache for URL: " + shortUrl);
                    }

                    return validatedUrlMapping;
                }
            } catch (Exception e) {
                logger.warn("Redis connection failed while checking URL '{}'. Falling back to database. Error: {}",
                        shortUrl, e.getMessage());
                redisAvailable = false;
            }
        } else {
            logger.info("Redis is not available. Using database directly for shortUrl: {}", shortUrl);
        }

        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);

        if (redisAvailable && urlMapping != null) {
            final UrlMapping finalUrlMapping = urlMapping;
            safeRedisOperation(
                    () -> redisTemplate.opsForValue().set(URL_CACHE_PREFIX + shortUrl, finalUrlMapping, 1,
                            TimeUnit.DAYS),
                    "Failed to cache URL mapping from database for shortUrl: " + shortUrl);
        }

        return urlMapping;
    }

    @Async
    public CompletableFuture<Void> recordClickAsync(UrlMapping urlMapping) {
        String clickKey = urlMapping.getShortUrl();
        LocalDateTime now = LocalDateTime.now();

        synchronized (recentClicks) {
            LocalDateTime lastClick = recentClicks.get(clickKey);
            if (lastClick != null && now.isBefore(lastClick.plusSeconds(CLICK_DEDUP_WINDOW_SECONDS))) {
                return CompletableFuture.completedFuture(null);
            }

            recentClicks.put(clickKey, now);

            recentClicks.entrySet()
                    .removeIf(entry -> now.isAfter(entry.getValue().plusSeconds(CLICK_DEDUP_WINDOW_SECONDS * 2)));
        }

        urlMapping.setClickCount(urlMapping.getClickCount() + 1);
        urlMappingRepository.save(urlMapping);

        ClickEvent clickEvent = new ClickEvent();
        clickEvent.setClickDate(now);
        clickEvent.setUrlMapping(urlMapping);
        clickEventRepository.save(clickEvent);

        return CompletableFuture.completedFuture(null);
    }
}
