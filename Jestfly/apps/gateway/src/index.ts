import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Service routes
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  users: process.env.USERS_SERVICE_URL || 'http://localhost:3002',
  notifications: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3003',
  wallet: process.env.WALLET_SERVICE_URL || 'http://localhost:3004',
  community: process.env.COMMUNITY_SERVICE_URL || 'http://localhost:3005',
  content: process.env.CONTENT_SERVICE_URL || 'http://localhost:3006',
  store: process.env.STORE_SERVICE_URL || 'http://localhost:3007',
  nft: process.env.NFT_SERVICE_URL || 'http://localhost:3008',
  career: process.env.CAREER_SERVICE_URL || 'http://localhost:3009',
  streaming: process.env.STREAMING_SERVICE_URL || 'http://localhost:3010',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3011',
  admin: process.env.ADMIN_SERVICE_URL || 'http://localhost:3012',
};

// Proxy configuration
const proxyOptions = {
  changeOrigin: true,
  onProxyReq: (proxyReq: any, req: Request) => {
    // Add custom headers if needed
    const correlationId = req.headers['x-correlation-id'] || generateId();
    proxyReq.setHeader('X-Correlation-Id', correlationId);
  },
  onError: (err: Error, req: Request, res: Response) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'GATEWAY_ERROR',
        message: 'Service temporarily unavailable',
      },
    });
  },
};

// Route proxies
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  pathRewrite: { '^/api/auth': '' },
  ...proxyOptions,
}));

app.use('/api/users', createProxyMiddleware({
  target: services.users,
  pathRewrite: { '^/api/users': '' },
  ...proxyOptions,
}));

app.use('/api/notifications', createProxyMiddleware({
  target: services.notifications,
  pathRewrite: { '^/api/notifications': '' },
  ...proxyOptions,
}));

app.use('/api/wallet', createProxyMiddleware({
  target: services.wallet,
  pathRewrite: { '^/api/wallet': '' },
  ...proxyOptions,
}));

app.use('/api/communities', createProxyMiddleware({
  target: services.community,
  pathRewrite: { '^/api/communities': '' },
  ...proxyOptions,
}));

app.use('/api/content', createProxyMiddleware({
  target: services.content,
  pathRewrite: { '^/api/content': '' },
  ...proxyOptions,
}));

app.use('/api/store', createProxyMiddleware({
  target: services.store,
  pathRewrite: { '^/api/store': '' },
  ...proxyOptions,
}));

app.use('/api/nft', createProxyMiddleware({
  target: services.nft,
  pathRewrite: { '^/api/nft': '' },
  ...proxyOptions,
}));

app.use('/api/careers', createProxyMiddleware({
  target: services.career,
  pathRewrite: { '^/api/careers': '' },
  ...proxyOptions,
}));

app.use('/api/streaming', createProxyMiddleware({
  target: services.streaming,
  pathRewrite: { '^/api/streaming': '' },
  ...proxyOptions,
}));

app.use('/api/analytics', createProxyMiddleware({
  target: services.analytics,
  pathRewrite: { '^/api/analytics': '' },
  ...proxyOptions,
}));

app.use('/api/admin', createProxyMiddleware({
  target: services.admin,
  pathRewrite: { '^/api/admin': '' },
  ...proxyOptions,
}));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'gateway',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Jestfly API Gateway',
    version: '1.0.0',
    endpoints: Object.keys(services).map(service => `/api/${service}`),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
});

// Helper function
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
  console.log('Service routes:');
  Object.entries(services).forEach(([name, url]) => {
    console.log(`  /api/${name} -> ${url}`);
  });
});
