# Jestfly Deployment Guide

This guide covers deploying Jestfly to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Providers](#cloud-providers)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)

## Prerequisites

### Required Tools

- Docker (20.10+)
- Kubernetes (1.24+) / kubectl
- Node.js (18+)
- PostgreSQL (14+)
- Redis (6+)

### Required Accounts

- Cloud provider account (AWS/GCP/Azure)
- Container registry access
- Domain name and DNS access
- SSL certificate

## Local Development

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/jestfly.git
cd jestfly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Setup Database

```bash
# Create database
createdb jestfly

# Run schema
psql -U postgres -d jestfly -f database/schemas/schema.sql
```

### 5. Start Services

```bash
# Start all services
npm run dev

# Or start individual services
cd apps/auth && npm run dev
```

## Docker Deployment

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker build -t jestfly/auth -f apps/auth/Dockerfile .
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: jestfly
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/schemas:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  redis:
    image: redis:6
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  gateway:
    build:
      context: .
      dockerfile: apps/gateway/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - auth
      - users
    env_file:
      - .env

  auth:
    build:
      context: .
      dockerfile: apps/auth/Dockerfile
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    env_file:
      - .env

  users:
    build:
      context: .
      dockerfile: apps/users/Dockerfile
    ports:
      - "3002:3002"
    depends_on:
      - postgres
    env_file:
      - .env

volumes:
  postgres-data:
  redis-data:
```

### Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Kubernetes Deployment

### 1. Prepare Cluster

```bash
# Create namespace
kubectl create namespace jestfly

# Set context
kubectl config set-context --current --namespace=jestfly
```

### 2. Configure Secrets

```bash
# Create secret for database
kubectl create secret generic db-credentials \
  --from-literal=username=postgres \
  --from-literal=password=your_password

# Create secret for JWT
kubectl create secret generic jwt-secret \
  --from-literal=secret=your_jwt_secret
```

### 3. Deploy PostgreSQL

`k8s/postgres.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        env:
        - name: POSTGRES_DB
          value: jestfly
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### 4. Deploy Services

`k8s/auth-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
      - name: auth
        image: ghcr.io/yourusername/jestfly/auth:latest
        ports:
        - containerPort: 3001
        env:
        - name: DB_HOST
          value: postgres
        - name: DB_PORT
          value: "5432"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: auth
spec:
  selector:
    app: auth
  ports:
  - port: 3001
    targetPort: 3001
```

### 5. Deploy Ingress

`k8s/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jestfly-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.jestfly.com
    secretName: jestfly-tls
  rules:
  - host: api.jestfly.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gateway
            port:
              number: 3000
```

### 6. Apply Configurations

```bash
# Apply all configurations
kubectl apply -f k8s/

# Check deployments
kubectl get deployments

# Check pods
kubectl get pods

# Check services
kubectl get services

# View logs
kubectl logs -f deployment/auth
```

## Cloud Providers

### AWS EKS

```bash
# Create EKS cluster
eksctl create cluster \
  --name jestfly \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name jestfly

# Deploy
kubectl apply -f k8s/
```

### Google GKE

```bash
# Create GKE cluster
gcloud container clusters create jestfly \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2

# Get credentials
gcloud container clusters get-credentials jestfly --zone us-central1-a

# Deploy
kubectl apply -f k8s/
```

### Azure AKS

```bash
# Create AKS cluster
az aks create \
  --resource-group jestfly-rg \
  --name jestfly \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2

# Get credentials
az aks get-credentials --resource-group jestfly-rg --name jestfly

# Deploy
kubectl apply -f k8s/
```

## Environment Configuration

### Production Environment Variables

```bash
NODE_ENV=production
LOG_LEVEL=warn

# Use managed database services
DB_HOST=your-rds-endpoint.amazonaws.com
REDIS_HOST=your-elasticache-endpoint.amazonaws.com

# Use secrets management
JWT_SECRET=${SECRET_MANAGER_JWT_SECRET}

# Enable monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
```

### Staging Environment

```bash
NODE_ENV=staging
LOG_LEVEL=info

DB_HOST=staging-db.example.com
```

## Database Setup

### Production Database

```bash
# Use managed service (RDS, Cloud SQL, etc.)
# Enable automated backups
# Enable encryption at rest
# Configure read replicas for scaling

# Migration
psql -h production-db.example.com -U admin -d jestfly -f database/schemas/schema.sql
```

### Connection Pooling

Configure in application:

```typescript
const pool = new Pool({
  host: process.env.DB_HOST,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring

### Prometheus & Grafana

Deploy monitoring stack:

```bash
# Install Prometheus operator
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# Deploy ServiceMonitor
kubectl apply -f k8s/monitoring/service-monitor.yaml
```

### Logging

Use centralized logging:

```bash
# Deploy ELK stack or use managed service
kubectl apply -f k8s/logging/elasticsearch.yaml
kubectl apply -f k8s/logging/fluentd.yaml
kubectl apply -f k8s/logging/kibana.yaml
```

### Health Checks

Each service exposes `/health`:

```bash
curl http://service-url/health
```

### Alerts

Configure alerts for:
- High error rate
- High response time
- Low availability
- Database connection issues
- Memory/CPU usage

## SSL/TLS

### Using cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f k8s/cert-manager/cluster-issuer.yaml
```

## Scaling

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Backup & Recovery

### Database Backup

```bash
# Automated backups (managed services)
# Or manual backup
pg_dump -h $DB_HOST -U $DB_USER -d jestfly > backup.sql

# Restore
psql -h $DB_HOST -U $DB_USER -d jestfly < backup.sql
```

### Disaster Recovery

- Multi-region deployment
- Database replication
- Regular backup testing
- Documented recovery procedures

## CI/CD Integration

Deployment happens automatically via GitHub Actions:

1. Push to `main` branch
2. CI tests run
3. Docker images built
4. Deploy to staging
5. Manual approval for production
6. Deploy to production

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Database Connection Issues

```bash
# Test connection
kubectl run -it --rm debug --image=postgres:14 --restart=Never -- psql -h postgres -U postgres -d jestfly
```

### Service Not Accessible

```bash
# Check service
kubectl get svc

# Check endpoints
kubectl get endpoints

# Port forward for testing
kubectl port-forward svc/auth 3001:3001
```

## Performance Optimization

- Enable CDN for static assets
- Use Redis for caching
- Configure database connection pooling
- Enable compression
- Optimize database queries
- Use read replicas

## Security Checklist

- [ ] Use secrets management
- [ ] Enable SSL/TLS
- [ ] Configure network policies
- [ ] Enable pod security policies
- [ ] Regular security updates
- [ ] Audit logging enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured

## Support

For deployment issues:
- Email: devops@jestfly.com
- Discord: #deployment channel
- Docs: https://docs.jestfly.com/deployment
