# Edge Functions

Edge functions for Jestfly platform that run on the edge, close to users for optimal performance.

## Structure

- `deno/` - Deno-based edge functions
- `node/` - Node.js-based edge functions

## Available Functions

### Image Processing
- Resize, crop, and optimize images on the fly
- Generate thumbnails for content

### Authentication
- JWT verification at the edge
- Rate limiting for auth endpoints

### Content Delivery
- CDN-like content delivery
- Dynamic content transformation

### Analytics
- Track page views and events
- Real-time analytics aggregation

## Deployment

Edge functions can be deployed to:
- Cloudflare Workers
- Deno Deploy
- Vercel Edge Functions
- AWS Lambda@Edge
