package com.url.shortener.service;

import com.url.shortener.dtos.ClickEventDTO;
import com.url.shortener.dtos.UrlMappingDTO;
import com.url.shortener.models.ClickEvent;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import com.url.shortener.repository.ClickEventRepository;
import com.url.shortener.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.CRC32;

@Service
public class UrlMappingService {
    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    private static final String BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int BASE = BASE62_ALPHABET.length();

    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrlWithCRC32(originalUrl);

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setLocalDate(LocalDateTime.now());

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

    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);

            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvent);
        }
        return urlMapping;
    }
}
