# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/auth/package*.json ./apps/auth/
COPY packages/types/package*.json ./packages/types/
COPY packages/validation/package*.json ./packages/validation/
COPY packages/config/package*.json ./packages/config/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/auth ./apps/auth
COPY packages/types ./packages/types
COPY packages/validation ./packages/validation
COPY packages/config ./packages/config
COPY tsconfig.json ./

# Build
RUN npm run build --workspace=@jestfly/auth

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/auth/package*.json ./apps/auth/

# Install production dependencies only
RUN npm ci --production --workspace=@jestfly/auth

# Copy built files
COPY --from=builder /app/apps/auth/dist ./apps/auth/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/validation/dist ./packages/validation/dist
COPY --from=builder /app/packages/config/dist ./packages/config/dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start service
CMD ["node", "apps/auth/dist/index.js"]
