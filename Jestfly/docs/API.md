# Jestfly API Documentation

## Base URL

```
Development: http://localhost:3000
Production: https://api.jestfly.com
```

## Authentication

Most endpoints require authentication using JWT tokens.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  }
}
```

## Authentication Endpoints

### Register

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "displayName": "John Doe"
    },
    "token": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 604800
    }
  }
}
```

### Login

Authenticate a user and receive JWT tokens.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    },
    "token": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 604800
    }
  }
}
```

### Verify Token

Verify if a token is valid.

**Endpoint:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "verified": true
    }
  }
}
```

## User Endpoints

### Get User Profile

**Endpoint:** `GET /api/users/:userId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatarUrl": "https://...",
    "bio": "Content creator",
    "verified": true,
    "followers": 1500,
    "following": 300,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile

**Endpoint:** `PATCH /api/users/:userId`

**Request Body:**
```json
{
  "displayName": "John Doe Updated",
  "bio": "New bio text",
  "avatarUrl": "https://..."
}
```

### Search Users

**Endpoint:** `GET /api/users?q=john&page=1&perPage=20`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "johndoe",
      "displayName": "John Doe",
      "avatarUrl": "https://...",
      "verified": true
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 50
  }
}
```

## Content Endpoints

### Create Content

**Endpoint:** `POST /api/content`

**Request Body:**
```json
{
  "title": "My Video Title",
  "description": "Video description",
  "type": "video",
  "url": "https://storage.example.com/video.mp4"
}
```

### Get Content

**Endpoint:** `GET /api/content/:contentId`

### List Content

**Endpoint:** `GET /api/content?userId=uuid&type=video&page=1`

### Update Content

**Endpoint:** `PATCH /api/content/:contentId`

### Delete Content

**Endpoint:** `DELETE /api/content/:contentId`

### Like Content

**Endpoint:** `POST /api/content/:contentId/like`

### Comment on Content

**Endpoint:** `POST /api/content/:contentId/comments`

**Request Body:**
```json
{
  "text": "Great content!",
  "parentId": "uuid" // optional, for replies
}
```

## Community Endpoints

### Create Community

**Endpoint:** `POST /api/communities`

**Request Body:**
```json
{
  "name": "Tech Creators",
  "description": "A community for tech content creators",
  "isPrivate": false
}
```

### Join Community

**Endpoint:** `POST /api/communities/:communityId/join`

### Leave Community

**Endpoint:** `POST /api/communities/:communityId/leave`

### List Communities

**Endpoint:** `GET /api/communities?page=1&perPage=20`

## Wallet Endpoints

### Get Wallet

**Endpoint:** `GET /api/wallet`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "address": "0x...",
    "balance": 1000.50,
    "currency": "USD"
  }
}
```

### Create Transaction

**Endpoint:** `POST /api/wallet/transactions`

**Request Body:**
```json
{
  "amount": 100.00,
  "type": "deposit",
  "metadata": {
    "description": "Deposit via credit card"
  }
}
```

### Transaction History

**Endpoint:** `GET /api/wallet/transactions?page=1&perPage=20`

## NFT Endpoints

### Mint NFT

**Endpoint:** `POST /api/nft/mint`

**Request Body:**
```json
{
  "name": "My Artwork",
  "description": "Digital art piece",
  "imageUrl": "https://...",
  "metadata": {
    "artist": "John Doe",
    "year": 2024
  }
}
```

### List NFTs

**Endpoint:** `GET /api/nft?forSale=true&page=1`

### Buy NFT

**Endpoint:** `POST /api/nft/:nftId/buy`

### List NFT

**Endpoint:** `POST /api/nft/:nftId/list`

**Request Body:**
```json
{
  "price": 500.00
}
```

## Store Endpoints

### Create Product

**Endpoint:** `POST /api/store/products`

**Request Body:**
```json
{
  "name": "T-Shirt",
  "description": "Cool branded t-shirt",
  "price": 29.99,
  "stock": 100,
  "images": ["https://..."],
  "category": "Apparel"
}
```

### List Products

**Endpoint:** `GET /api/store/products?category=Apparel&page=1`

### Create Order

**Endpoint:** `POST /api/store/orders`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
```

### Get Order

**Endpoint:** `GET /api/store/orders/:orderId`

## Streaming Endpoints

### Start Stream

**Endpoint:** `POST /api/streaming/start`

**Request Body:**
```json
{
  "title": "Live Gaming Session",
  "description": "Playing the latest game"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "streamId": "uuid",
    "streamKey": "secret-key",
    "rtmpUrl": "rtmp://streaming.jestfly.com/live",
    "streamUrl": "https://streaming.jestfly.com/live/secret-key"
  }
}
```

### Stop Stream

**Endpoint:** `POST /api/streaming/:streamId/stop`

### Get Active Streams

**Endpoint:** `GET /api/streaming/live`

## Notification Endpoints

### Get Notifications

**Endpoint:** `GET /api/notifications?read=false&page=1`

### Mark as Read

**Endpoint:** `POST /api/notifications/:notificationId/read`

### Mark All as Read

**Endpoint:** `POST /api/notifications/read-all`

## Career Endpoints

### Create Job Posting

**Endpoint:** `POST /api/careers/jobs`

**Request Body:**
```json
{
  "title": "Senior Developer",
  "description": "We're looking for...",
  "location": "Remote",
  "type": "full_time",
  "salary": "$100k - $150k",
  "requirements": ["5+ years experience", "TypeScript"],
  "benefits": ["Health insurance", "401k"]
}
```

### List Jobs

**Endpoint:** `GET /api/careers/jobs?type=full_time&page=1`

### Apply for Job

**Endpoint:** `POST /api/careers/jobs/:jobId/apply`

**Request Body:**
```json
{
  "coverLetter": "I am excited to apply...",
  "resumeUrl": "https://..."
}
```

## Analytics Endpoints

### Get User Analytics

**Endpoint:** `GET /api/analytics?period=month`

**Response:**
```json
{
  "success": true,
  "data": {
    "views": 10000,
    "uniqueVisitors": 5000,
    "likes": 500,
    "comments": 200,
    "shares": 100,
    "revenue": 1500.00,
    "topContent": ["content-id-1", "content-id-2"]
  }
}
```

## Admin Endpoints

### Get Platform Stats

**Endpoint:** `GET /api/admin/stats`

**Requires:** Admin role

### Moderate Content

**Endpoint:** `POST /api/admin/content/:contentId/moderate`

**Request Body:**
```json
{
  "action": "remove",
  "reason": "Violates community guidelines"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `USER_EXISTS` | User already exists |
| `USER_NOT_FOUND` | User not found |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `NO_TOKEN` | No authentication token provided |
| `INVALID_TOKEN` | Invalid or expired token |
| `UNAUTHORIZED` | User not authorized for this action |
| `NOT_FOUND` | Resource not found |
| `SERVER_ERROR` | Internal server error |
| `RATE_LIMITED` | Too many requests |

## Rate Limiting

- **Default:** 100 requests per minute per IP
- **Authenticated:** 1000 requests per minute per user
- **Heavy operations:** 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

All list endpoints support pagination with these query parameters:

- `page` - Page number (default: 1)
- `perPage` - Items per page (default: 20, max: 100)
- `sortBy` - Field to sort by
- `sortOrder` - `asc` or `desc` (default: desc)

## Webhooks

Configure webhooks to receive real-time notifications:

**Events:**
- `user.created`
- `content.created`
- `transaction.completed`
- `order.created`
- `stream.started`

**Webhook Payload:**
```json
{
  "event": "user.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": { ... }
}
```

## SDK & Libraries

- **JavaScript/TypeScript:** `@jestfly/api-client`
- **Python:** Coming soon
- **Go:** Coming soon

## Testing

Use the following test credentials in development:

```
Email: test@jestfly.com
Password: Test123!
```

## Support

- Documentation: https://docs.jestfly.com
- API Status: https://status.jestfly.com
- Support: api-support@jestfly.com
