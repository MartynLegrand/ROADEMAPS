export const config = {
  api: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 30000,
  },
  auth: {
    tokenKey: 'jestfly_token',
    refreshTokenKey: 'jestfly_refresh_token',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'jestfly',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 's3',
    bucket: process.env.STORAGE_BUCKET || 'jestfly-uploads',
    region: process.env.STORAGE_REGION || 'us-east-1',
  },
  streaming: {
    rtmpUrl: process.env.RTMP_URL || 'rtmp://localhost:1935',
    hlsUrl: process.env.HLS_URL || 'http://localhost:8080',
  },
  blockchain: {
    network: process.env.BLOCKCHAIN_NETWORK || 'polygon',
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://polygon-rpc.com',
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY || '',
    fromEmail: process.env.EMAIL_FROM || 'noreply@jestfly.com',
  },
};

export type Config = typeof config;
