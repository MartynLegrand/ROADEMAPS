import express, { Request, Response } from 'express';
import { config } from '@jestfly/config';
import { userSchema } from '@jestfly/validation';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
});

// Get user profile
app.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT id, email, username, display_name, avatar_url, bio, verified, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error' },
    });
  }
});

// Update user profile
app.patch('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = userSchema.partial().parse(req.body);

    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');

    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [userId, ...values]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
    });
  }
});

// Search users
app.get('/', async (req: Request, res: Response) => {
  try {
    const { q, page = 1, perPage = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(perPage);

    let query = 'SELECT id, username, display_name, avatar_url, verified FROM users';
    const params: any[] = [];

    if (q) {
      query += ' WHERE username ILIKE $1 OR display_name ILIKE $1';
      params.push(`%${q}%`);
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(perPage, offset);

    const result = await pool.query(query, params);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error' },
    });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'users' });
});

app.listen(PORT, () => {
  console.log(`Users service listening on port ${PORT}`);
});
