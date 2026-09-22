import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;
const app = express();
const port = process.env.PORT || 4001;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());
const userFields = 'id, name, email, age, created_at';

function validUser(body) {
  if (!body.name || !body.email || body.age === undefined) return 'name, email, and age are required';
  if (!String(body.email).includes('@')) return 'email must be valid';
  if (!Number.isInteger(Number(body.age)) || Number(body.age) < 0) return 'age must be a non-negative integer';
  return null;
}

app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', storage: 'postgresql' }); }
  catch { res.status(503).json({ status: 'error', message: 'Database unavailable' }); }
});
app.get('/api/users', async (_req, res, next) => { try { const { rows } = await pool.query(`SELECT ${userFields} FROM users ORDER BY id DESC`); res.json(rows); } catch (error) { next(error); } });
app.get('/api/users/:id', async (req, res, next) => { try { const { rows } = await pool.query(`SELECT ${userFields} FROM users WHERE id = $1`, [req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'User not found' }); return res.json(rows[0]); } catch (error) { return next(error); } });
app.post('/api/users', async (req, res, next) => { const error = validUser(req.body); if (error) return res.status(400).json({ error }); try { const { rows } = await pool.query(`INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING ${userFields}`, [req.body.name.trim(), req.body.email.trim(), Number(req.body.age)]); return res.status(201).json(rows[0]); } catch (dbError) { if (dbError.code === '23505') return res.status(409).json({ error: 'Email already exists' }); return next(dbError); } });
app.put('/api/users/:id', async (req, res, next) => { const error = validUser(req.body); if (error) return res.status(400).json({ error }); try { const { rows } = await pool.query(`UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING ${userFields}`, [req.body.name.trim(), req.body.email.trim(), Number(req.body.age), req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'User not found' }); return res.json(rows[0]); } catch (dbError) { if (dbError.code === '23505') return res.status(409).json({ error: 'Email already exists' }); return next(dbError); } });
app.delete('/api/users/:id', async (req, res, next) => { try { const { rows } = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING ${userFields}`, [req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'User not found' }); return res.json({ message: 'User deleted', user: rows[0] }); } catch (error) { return next(error); } });
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: 'Internal server error' }); });
app.listen(port, () => console.log(`Database API running at http://localhost:${port}`));
