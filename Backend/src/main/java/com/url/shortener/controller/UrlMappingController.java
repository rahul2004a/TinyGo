package com.url.shortener.controller;

import com.url.shortener.dtos.ClickEventDTO;
import com.url.shortener.dtos.UrlMappingDTO;
import com.url.shortener.exception.RateLimitExceededException;
import com.url.shortener.models.User;
import com.url.shortener.service.RateLimiterService;
import com.url.shortener.service.UrlMappingService;
import com.url.shortener.service.UserService;
import com.url.shortener.service.QRCodeService;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
public class UrlMappingController {

    private static final Logger logger = LoggerFactory.getLogger(UrlMappingController.class);

    @Value("${app.domain}")
    private static final String DOMAIN = "";

    @Autowired
    private UrlMappingService urlMappingService;

    @Autowired
    private UserService userService;

    @Autowired
    private RateLimiterService rateLimiterService;

    @Autowired
    private QRCodeService qrCodeService;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> createShortUrl(@RequestBody Map<String, String> request, Principal principal) {
        String originalUrl = request.get("originalUrl");
        String username = principal.getName();

        if (!rateLimiterService.isRequestAllowed(username)) {
            LocalDateTime nextAllowedTime = rateLimiterService.getTimeUntilNextAllowedRequest(username);
            int remainingRequests = rateLimiterService.getRemainingRequests(username);

            throw new RateLimitExceededException(
                    "Too many URLs created. You can create maximum 15 URLs per minute. Please wait before creating more URLs.",
                    15,
                    1,
                    nextAllowedTime,
                    remainingRequests);
        }

        User user = userService.findByUsername(username);
        UrlMappingDTO urlMappingDTO = urlMappingService.createShortUrl(originalUrl, user);
        return ResponseEntity.ok(urlMappingDTO);
    }

    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getUserUrls(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<UrlMappingDTO> url = urlMappingService.getUrlByUser(user);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(@PathVariable String shortUrl,
            @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        List<ClickEventDTO> clickEventDTOS = urlMappingService.getClickEventByDate(shortUrl, start, end);
        return ResponseEntity.ok(clickEventDTOS);
    }

    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClickByDate(Principal principal,
            @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        User user = userService.findByUsername(principal.getName());
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        Map<LocalDate, Long> totalClicks = urlMappingService.getTotalClicksByUserAndDate(user, start, end);
        return ResponseEntity.ok(totalClicks);
    }

    @GetMapping("/check/{shortUrl}")
    public ResponseEntity<Map<String, Boolean>> checkUrlExists(@PathVariable String shortUrl) {
        try {
            boolean exists = urlMappingService.checkOriginalUrl(shortUrl) != null;
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            // Log the error and return false for URL existence
            logger.error("Error checking URL existence for '{}': {}", shortUrl, e.getMessage());
            return ResponseEntity.ok(Map.of("exists", false));
        }
    }

    @GetMapping("/rate-limit-status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getRateLimitStatus(Principal principal) {
        String username = principal.getName();

        int currentRequests = rateLimiterService.getCurrentRequestCount(username);
        int remainingRequests = rateLimiterService.getRemainingRequests(username);
        LocalDateTime nextAllowedTime = rateLimiterService.getTimeUntilNextAllowedRequest(username);

        Map<String, Object> status = new java.util.HashMap<>();
        status.put("maxRequests", 15);
        status.put("timeWindowMinutes", 1);
        status.put("currentRequests", currentRequests);
        status.put("remainingRequests", remainingRequests);
        status.put("canCreateUrl", remainingRequests > 0);
        status.put("nextAllowedTime", nextAllowedTime != null ? nextAllowedTime.toString() : null);

        return ResponseEntity.ok(status);
    }

    @PostMapping("/admin/reset-rate-limit/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> resetUserRateLimit(@PathVariable String username) {
        rateLimiterService.resetUserRateLimit(username);
        return ResponseEntity.ok(Map.of(
                "message", "Rate limit reset successfully for user: " + username,
                "username", username,
                "resetTime", LocalDateTime.now().toString()));
    }

    @GetMapping(value = "/qr-code/{shortUrl}", produces = MediaType.IMAGE_PNG_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<byte[]> getQRCode(@PathVariable String shortUrl) throws WriterException, IOException {
        // Get the full URL for the QR code
        String fullUrl = DOMAIN + shortUrl; // You can adjust this domain
        byte[] qrCodeImage = qrCodeService.generateQRCodeImage(fullUrl, 300, 300);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("attachment", shortUrl + "_qr.png");
        return ResponseEntity.ok().headers(headers).body(qrCodeImage);
    }

    @GetMapping(value = "/qr-code/{shortUrl}/download", produces = MediaType.IMAGE_PNG_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<byte[]> downloadQRCode(@PathVariable String shortUrl) throws WriterException, IOException {
        // Get the full URL for the QR code
        String fullUrl = DOMAIN + shortUrl; // You can adjust this domain
        byte[] qrCodeImage = qrCodeService.generateQRCodeImage(fullUrl, 300, 300);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("attachment", "tinygo_" + shortUrl + "_qr.png");
        return ResponseEntity.ok().headers(headers).body(qrCodeImage);
    }

}
