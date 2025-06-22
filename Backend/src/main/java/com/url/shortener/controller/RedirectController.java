package com.url.shortener.controller;

import com.url.shortener.models.UrlMapping;
import com.url.shortener.service.UrlMappingService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@AllArgsConstructor
public class RedirectController {

    private static final Logger logger = LoggerFactory.getLogger(RedirectController.class);

    @Autowired
    private UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl) {
        try {
            UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl);
            if (urlMapping != null) {
                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.add("Location", urlMapping.getOriginalUrl());
                return ResponseEntity.status(302).headers(httpHeaders).build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Log the error and return 404
            logger.error("Error during URL redirect for '{}': {}", shortUrl, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @RequestMapping(value = "/{shortUrl}", method = RequestMethod.HEAD)
    public ResponseEntity<Void> checkUrl(@PathVariable String shortUrl) {
        try {
            UrlMapping urlMapping = urlMappingService.checkOriginalUrl(shortUrl);
            if (urlMapping != null) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Log the error and return 404
            logger.error("Error during URL check for '{}': {}", shortUrl, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
