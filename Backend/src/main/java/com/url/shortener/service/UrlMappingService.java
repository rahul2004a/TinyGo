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
    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String URL_CACHE_PREFIX = "shorturl:";
    private static final int CLICK_DEDUP_WINDOW_SECONDS = 5; // 5 seconds deduplication window

    private static final String BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int BASE = BASE62_ALPHABET.length();

    // Map to track recent clicks for deduplication - in memory for performance
    private final Map<String, LocalDateTime> recentClicks = new ConcurrentHashMap<>();

    @Transactional
    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrlWithCRC32(originalUrl);

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setLocalDate(LocalDateTime.now());

        redisTemplate.opsForValue().set(URL_CACHE_PREFIX + shortUrl, urlMapping, 1, TimeUnit.DAYS);

        UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);
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

        // Convert to positive value and encode in Base62
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
        Object cached = redisTemplate.opsForValue().get(URL_CACHE_PREFIX + shortUrl);

        UrlMapping urlMapping = null;
        if (cached instanceof UrlMapping) {
            urlMapping = (UrlMapping) cached;
        } else if (cached instanceof LinkedHashMap) {
            urlMapping = objectMapper.convertValue(cached, UrlMapping.class);
        }

        if (urlMapping != null) {
            if (urlMapping.getId() == null) {
                urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
                if (urlMapping == null) {
                    return null;
                }
            } else {
                urlMapping = urlMappingRepository.findById(urlMapping.getId())
                        .orElse(null);
                if (urlMapping == null) {
                    return null;
                }
            }

            recordClickAsync(urlMapping);

            return urlMapping;
        }

        urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            recordClickAsync(urlMapping);
            redisTemplate.opsForValue().set(URL_CACHE_PREFIX + shortUrl, urlMapping, 1, TimeUnit.DAYS);
        }
        return urlMapping;
    }

    public UrlMapping checkOriginalUrl(String shortUrl) {
        Object cached = redisTemplate.opsForValue().get(URL_CACHE_PREFIX + shortUrl);

        UrlMapping urlMapping = null;
        if (cached instanceof UrlMapping) {
            urlMapping = (UrlMapping) cached;
        } else if (cached instanceof LinkedHashMap) {
            urlMapping = objectMapper.convertValue(cached, UrlMapping.class);
        }

        if (urlMapping != null) {
            if (urlMapping.getId() == null) {
                urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
            } else {
                urlMapping = urlMappingRepository.findById(urlMapping.getId())
                        .orElse(null);
            }
        } else {
            urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        }

        return urlMapping;
    }

    @Async
    public CompletableFuture<Void> recordClickAsync(UrlMapping urlMapping) {
        String clickKey = urlMapping.getShortUrl();
        LocalDateTime now = LocalDateTime.now();
        
        // Check if this is a duplicate click within the deduplication window
        synchronized (recentClicks) {
            LocalDateTime lastClick = recentClicks.get(clickKey);
            if (lastClick != null && now.isBefore(lastClick.plusSeconds(CLICK_DEDUP_WINDOW_SECONDS))) {
                // This is a duplicate click, ignore it
                return CompletableFuture.completedFuture(null);
            }
            
            // Record this click
            recentClicks.put(clickKey, now);
            
            // Clean up old entries to prevent memory leak
            recentClicks.entrySet().removeIf(entry -> 
                now.isAfter(entry.getValue().plusSeconds(CLICK_DEDUP_WINDOW_SECONDS * 2))
            );
        }
        
        // Record the click
        urlMapping.setClickCount(urlMapping.getClickCount() + 1);
        urlMappingRepository.save(urlMapping);

        ClickEvent clickEvent = new ClickEvent();
        clickEvent.setClickDate(now);
        clickEvent.setUrlMapping(urlMapping);
        clickEventRepository.save(clickEvent);

        return CompletableFuture.completedFuture(null);
    }
}
