# Jestfly Project Structure

Complete directory structure and file organization for the Jestfly platform.

```
Jestfly/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Continuous Integration workflow
│       └── deploy.yml                  # Deployment workflow
│
├── apps/                               # Microservices applications
│   ├── admin/                          # Admin panel service
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── analytics/                      # Analytics service
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth/                           # Authentication service
│   │   ├── src/
│   │   │   └── index.ts               # JWT auth, registration, login
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── career/                         # Job board service
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── community/                      # Community management
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── demos/                          # Content/Demo service
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── gateway/                        # API Gateway
│   │   ├── src/
│   │   │   └── index.ts               # Proxy to all services
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── nft/                            # NFT marketplace
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── notifications/                  # Notification service
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── store/                          # E-commerce service
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── streaming/                      # Live streaming service
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── users/                          # User management service
│   │   ├── src/
│   │   │   └── index.ts               # Profiles, search, follow
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── wallet/                         # Digital wallet service
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                           # Shared packages
│   ├── api-client/                     # HTTP client
│   │   ├── src/
│   │   │   └── index.ts               # Axios-based API client
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                         # Shared configuration
│   │   ├── src/
│   │   │   └── index.ts               # Environment config
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                          # TypeScript types
│   │   ├── src/
│   │   │   └── index.ts               # All type definitions
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                             # React UI components
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx             # Button component
│   │   │   ├── Card.tsx               # Card component
│   │   │   ├── Input.tsx              # Input component
│   │   │   ├── Avatar.tsx             # Avatar component
│   │   │   ├── Badge.tsx              # Badge component
│   │   │   └── Modal.tsx              # Modal component
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── validation/                     # Zod schemas
│       ├── src/
│       │   └── index.ts               # All validation schemas
│       ├── package.json
│       └── tsconfig.json
│
├── edge-functions/                     # Edge functions
│   ├── deno/
│   │   └── image-resize.ts            # Deno edge function
│   ├── node/
│   │   └── auth-middleware.ts         # Node.js edge function
│   └── README.md
│
├── database/                           # Database files
│   ├── schemas/
│   │   └── schema.sql                 # Complete PostgreSQL schema
│   └── migrations/                     # Future migrations
│
├── docs/                               # Documentation
│   ├── ARCHITECTURE.md                # Architecture documentation
│   ├── API.md                         # API documentation
│   ├── CONTRIBUTING.md                # Contributing guide
│   ├── DEPLOYMENT.md                  # Deployment guide
│   └── ROADMAP.md                     # Product roadmap
│
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── LICENSE                             # MIT License
├── package.json                        # Root package.json
├── PROJECT_STRUCTURE.md                # This file
├── README.md                           # Main README
├── tsconfig.json                       # TypeScript configuration
└── turbo.json                          # Turborepo configuration
```

## File Organization Principles

### Services (apps/)

Each service follows this structure:
```
service-name/
├── src/
│   ├── index.ts          # Entry point
│   ├── routes/           # API routes (optional)
│   ├── controllers/      # Business logic (optional)
│   ├── models/           # Data models (optional)
│   └── utils/            # Utilities (optional)
├── tests/                # Tests (optional)
├── package.json          # Dependencies
├── tsconfig.json         # TS config
└── Dockerfile            # Docker image
```

### Packages (packages/)

Shared code used across services:
```
package-name/
├── src/
│   └── index.ts          # Exports
├── package.json          # Package config
└── tsconfig.json         # TS config
```

## Key Technologies by Directory

### /apps
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL (via pg)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod

### /packages/ui
- **Framework**: React 18
- **Styling**: Tailwind CSS (inline classes)
- **Types**: TypeScript

### /packages/validation
- **Library**: Zod
- **Purpose**: Schema validation

### /edge-functions
- **Deno**: Native TypeScript runtime
- **Node**: Compatible with Vercel Edge, Lambda@Edge

### /database
- **Database**: PostgreSQL 14+
- **Schema**: SQL with UUID primary keys
- **Features**: JSONB, full-text search, indexes

## Service Ports

| Service       | Port |
|---------------|------|
| Gateway       | 3000 |
| Auth          | 3001 |
| Users         | 3002 |
| Notifications | 3003 |
| Wallet        | 3004 |
| Community     | 3005 |
| Demos         | 3006 |
| Store         | 3007 |
| NFT           | 3008 |
| Career        | 3009 |
| Streaming     | 3010 |
| Analytics     | 3011 |
| Admin         | 3012 |

## Development Commands

```bash
# Root level
npm install              # Install all dependencies
npm run dev              # Start all services
npm run build            # Build all packages
npm test                 # Run all tests
npm run lint             # Lint all code
npm run typecheck        # Type check all code
npm run clean            # Clean build artifacts

# Individual service
cd apps/auth
npm run dev              # Start auth service
npm run build            # Build auth service
npm test                 # Test auth service
```

## Environment Files

- `.env.example` - Template with all variables
- `.env` - Local development (not committed)
- `.env.staging` - Staging environment
- `.env.production` - Production environment

## Build Artifacts

Generated during build (ignored by git):
```
dist/                    # Compiled JavaScript
node_modules/            # Dependencies
.turbo/                  # Turborepo cache
coverage/                # Test coverage
*.log                    # Log files
```

## Configuration Files

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript compiler options
- `turbo.json` - Turborepo pipeline configuration
- `.gitignore` - Files to ignore in git
- `docker-compose.yml` - Local Docker setup
- `.env.example` - Environment variable template

## Documentation

- `README.md` - Getting started guide
- `docs/ARCHITECTURE.md` - System architecture
- `docs/API.md` - API endpoints
- `docs/CONTRIBUTING.md` - How to contribute
- `docs/DEPLOYMENT.md` - Deployment instructions
- `docs/ROADMAP.md` - Future plans

## Testing Structure

```
service/
├── src/
│   └── index.ts
└── tests/
    ├── unit/            # Unit tests
    ├── integration/     # Integration tests
    └── e2e/            # End-to-end tests
```

## Deployment Files

```
.github/workflows/
├── ci.yml              # Test and build
└── deploy.yml          # Deploy to staging/prod

k8s/                    # Kubernetes manifests
├── staging/
└── production/
```

## Notes

1. All services are TypeScript with strict mode enabled
2. Services communicate via REST APIs through the gateway
3. Shared code is in `/packages` and referenced in `package.json`
4. Database schema is in `/database/schemas/schema.sql`
5. All services expose a `/health` endpoint
6. Turborepo handles build caching and parallelization
7. Docker images are built for each service
8. CI/CD via GitHub Actions

## Future Additions

- E2E tests directory
- Load testing scripts
- Performance benchmarks
- Database seeds/fixtures
- API documentation (OpenAPI/Swagger)
- Postman collections
- Development tools
- Monitoring dashboards
