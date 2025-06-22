# URL Redirection with Error Handling

This implementation provides URL redirection functionality with proper error handling for non-existent URLs.

## Features

### Frontend (React)

- **ShortenUrlPage**: Handles URL validation and redirection
- **NoUrlFoundPage**: Beautiful error page shown when URL doesn't exist
- **API Integration**: Uses dedicated endpoint to check URL existence

### Backend (Spring Boot)

- **URL Validation Endpoint**: `GET /api/urls/check/{shortUrl}` - Returns `{"exists": true/false}`
- **Redirect Endpoint**: `GET /{shortUrl}` - Performs actual redirection or returns 404
- **CORS Configuration**: Properly configured to handle cross-origin requests
- **Security Configuration**: Updated to allow public access to check endpoint

## How It Works

1. **User visits short URL**: e.g., `localhost:3000/abc123`
2. **Frontend checks URL existence**: Makes API call to `/api/urls/check/abc123`
3. **Two outcomes**:
   - **URL exists**: Redirects to backend redirect endpoint (`/{shortUrl}`)
   - **URL doesn't exist**: Shows "No URL Found" page with helpful actions

## API Endpoints

### Check URL Existence (Public)

```
GET /api/urls/check/{shortUrl}
Response: {"exists": boolean}
```

### Redirect URL (Public)

```
GET /{shortUrl}
Response: 302 redirect or 404 not found
```

## Frontend Components

### ShortenUrlPage

- Validates URL existence before redirecting
- Shows loading spinner during validation
- Handles errors gracefully

### NoUrlFoundPage

- Clean, user-friendly error page
- Navigation options:
  - Return to homepage
  - Go to dashboard to create new URLs
- Modern, responsive design with Tailwind CSS

## Error Handling

- **Network errors**: Shows "URL not found" page
- **404 responses**: Shows "URL not found" page
- **Invalid URLs**: Shows "URL not found" page
- **Timeout**: Falls back to showing error page

## Security

- Check endpoint is public (no authentication required)
- Redirect endpoint is public for obvious reasons
- CORS properly configured for cross-origin requests
- Input validation on URL parameters

## Testing

To test the implementation:

1. **Valid URL**: Visit a short URL that exists - should redirect
2. **Invalid URL**: Visit a non-existent short URL - should show error page
3. **Malformed URL**: Visit an invalid URL pattern - should show error page

## File Changes

### Frontend

- `src/pages/ShortenUrlPage.jsx` - Updated with validation logic
- `src/pages/NoUrlFoundPage.jsx` - New error page component
- `src/AppRouter.jsx` - Updated routes and imports

### Backend

- `src/main/java/com/url/shortener/controller/UrlMappingController.java` - Added check endpoint
- `src/main/java/com/url/shortener/security/WebSecurityConfig.java` - Updated security config
- `src/main/java/com/url/shortener/security/CorsConfig.java` - New CORS configuration
