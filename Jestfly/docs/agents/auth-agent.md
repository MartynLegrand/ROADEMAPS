# Authentication Agent 🔐

Agente especializado em autenticação, segurança e gestão de tokens.

## Especialidades

- ✅ JWT Token Management
- ✅ OAuth2 Flows
- ✅ Password Security (bcrypt)
- ✅ Refresh Token Rotation
- ✅ 2FA/MFA Implementation
- ✅ Session Management
- ✅ Security Best Practices

## Arquitetura do Módulo

```
apps/auth/
├── src/
│   ├── index.ts           # Entry point
│   ├── controllers/
│   │   ├── auth.ts        # Auth logic
│   │   └── tokens.ts      # Token management
│   ├── middleware/
│   │   ├── validate.ts    # Input validation
│   │   └── rateLimite.ts  # Rate limiting
│   ├── services/
│   │   ├── jwt.ts         # JWT service
│   │   └── oauth.ts       # OAuth service
│   └── utils/
│       ├── hash.ts        # Password hashing
│       └── crypto.ts      # Cryptographic utils
├── tests/
│   ├── auth.test.ts
│   └── tokens.test.ts
└── package.json
```

## Endpoints Disponíveis

### POST /register
Registra um novo usuário

**Request:**
```typescript
{
  email: string;
  password: string;
  username: string;
  displayName: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    token: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }
  }
}
```

### POST /login
Autentica um usuário existente

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    token: AuthToken;
  }
}
```

### GET /verify
Verifica se um token é válido

**Headers:**
```
Authorization: ******
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
  }
}
```

### POST /refresh
Renova o access token usando o refresh token

**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    accessToken: string;
    expiresIn: number;
  }
}
```

## Implementações Recomendadas

### 1. Refresh Token Rotation

```typescript
// services/jwt.ts
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

export class JWTService {
  private pool: Pool;
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  async generateTokenPair(userId: string) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      this.accessTokenSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      this.refreshTokenSecret,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await this.pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(oldToken: string) {
    // Verify old token
    const decoded = jwt.verify(oldToken, this.refreshTokenSecret);
    
    // Invalidate old token
    await this.pool.query(
      'UPDATE refresh_tokens SET revoked = true WHERE token = $1',
      [oldToken]
    );

    // Generate new token pair
    return this.generateTokenPair(decoded.userId);
  }
}
```

### 2. Password Hashing

```typescript
// utils/hash.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// With timing attack protection
export async function safeVerifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const dummy = await bcrypt.hash('dummy', SALT_ROUNDS);
  const actualHash = hash || dummy;
  const result = await bcrypt.compare(password, actualHash);
  return hash ? result : false;
}
```

### 3. OAuth2 Implementation

```typescript
// services/oauth.ts
import { google } from 'googleapis';

export class OAuth2Service {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    });
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async getUserInfo(accessToken: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data;
  }
}
```

### 4. 2FA Implementation

```typescript
// services/twoFactor.ts
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export class TwoFactorService {
  async generateSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `Jestfly (${email})`,
      length: 32
    });

    // Store secret in database
    await this.storeSecret(userId, secret.base32);

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl
    };
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const secret = await this.getSecret(userId);
    
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });
  }
}
```

## Validação com Zod

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  username: z.string()
    .min(3, 'Username too short')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  displayName: z.string()
    .min(1, 'Display name required')
    .max(50, 'Display name too long')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
```

## Testes Recomendados

```typescript
// tests/auth.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../src/utils/hash';
import { JWTService } from '../src/services/jwt';

describe('Auth Service', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'Test123!';
      const hash = await hashPassword(password);
      
      expect(hash).not.toBe(password);
      expect(hash).toHaveLength(60); // bcrypt hash length
    });

    it('should verify correct password', async () => {
      const password = 'Test123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'Test123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('Wrong123!', hash);
      
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Service', () => {
    const jwtService = new JWTService();

    it('should generate valid token pair', async () => {
      const userId = 'test-user-id';
      const { accessToken, refreshToken } = await jwtService.generateTokenPair(userId);
      
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should rotate refresh token', async () => {
      const userId = 'test-user-id';
      const { refreshToken: oldToken } = await jwtService.generateTokenPair(userId);
      const { accessToken: newAccessToken } = await jwtService.rotateRefreshToken(oldToken);
      
      expect(newAccessToken).toBeDefined();
      expect(newAccessToken).not.toBe(oldToken);
    });
  });
});
```

## Security Checklist

- [ ] Senhas hasheadas com bcrypt (salt rounds >= 10)
- [ ] JWT tokens com expiração curta (15min recomendado)
- [ ] Refresh tokens armazenados no banco
- [ ] HTTPS obrigatório em produção
- [ ] Rate limiting configurado (max 5 tentativas/minuto)
- [ ] CSRF protection ativada
- [ ] Input validation em todas as rotas
- [ ] SQL injection protection (queries parametrizadas)
- [ ] XSS protection (sanitização de inputs)
- [ ] Logs de atividades suspeitas
- [ ] Account lockout após tentativas falhadas
- [ ] Email verification para novos usuários

## Variáveis de Ambiente

```bash
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Security
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=15m

# Rate Limiting
RATE_LIMIT_WINDOW=1m
RATE_LIMIT_MAX_REQUESTS=5
```

## Performance Tips

1. **Cache JWT Secret:** Carregue uma vez na inicialização
2. **Connection Pooling:** Use pool de conexões para o banco
3. **Async Operations:** Use async/await para operações de I/O
4. **Index Database:** Crie índices em `users.email` e `refresh_tokens.token`
5. **Monitor Performance:** Use APM para identificar gargalos

## Troubleshooting

### Token Expirado
```typescript
// Error: jwt expired
// Solução: Implementar refresh token flow
```

### Invalid Signature
```typescript
// Error: invalid signature
// Solução: Verificar JWT_SECRET está correto em todas as instâncias
```

### Rate Limit Exceeded
```typescript
// Error: Too many requests
// Solução: Implementar exponential backoff no cliente
```

## Próximos Passos

1. ✅ Implementar OAuth2 completo
2. ✅ Adicionar 2FA/MFA
3. ⏳ Implementar passwordless login
4. ⏳ Adicionar biometric authentication
5. ⏳ Implementar session management avançado

## Recursos Adicionais

- [JWT Best Practices](https://jwt.io/introduction)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt npm package](https://www.npmjs.com/package/bcryptjs)

---

**Mantido por:** Authentication Team
**Última Atualização:** 2024-11-16
**Versão:** 1.0.0
