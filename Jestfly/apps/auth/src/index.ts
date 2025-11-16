import express, { Request, Response } from 'express';
import { config } from '@jestfly/config';
import { loginSchema, registerSchema } from '@jestfly/validation';
import type { LoginCredentials, RegisterData, AuthToken, User } from '@jestfly/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Database connection
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Routes
app.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body) as RegisterData;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [data.email, data.username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, username, display_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, username, display_name, created_at',
      [data.email, data.username, data.displayName, hashedPassword]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      data: {
        user,
        token: {
          accessToken: token,
          refreshToken: token,
          expiresIn: 604800,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
    });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const credentials = loginSchema.parse(req.body) as LoginCredentials;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      credentials.email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(credentials.password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.display_name,
        },
        token: {
          accessToken: token,
          refreshToken: token,
          expiresIn: 604800,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
    });
  }
});

app.get('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No token provided' },
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const result = await pool.query(
      'SELECT id, email, username, display_name, verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
      });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'auth' });
});

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
