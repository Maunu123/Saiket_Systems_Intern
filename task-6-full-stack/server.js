import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const { Pool } = pg;
const app = express();
const port = process.env.PORT || 4002;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const root = path.dirname(fileURLToPath(import.meta.url));
const fields = 'id, name, email, age, role, created_at';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(root, 'public')));

function validate(body) {
  if (!body.name || !body.email || body.age === undefined) return 'Name, email, and age are required.';
  if (!String(body.email).includes('@')) return 'Please provide a valid email.';
  if (!Number.isInteger(Number(body.age)) || Number(body.age) < 0) return 'Age must be a non-negative integer.';
  return null;
}
app.get('/api/profiles', async (_req, res, next) => { try { const { rows } = await pool.query(`SELECT ${fields} FROM profiles ORDER BY id DESC`); res.json(rows); } catch (error) { next(error); } });
app.post('/api/profiles', async (req, res, next) => { const message = validate(req.body); if (message) return res.status(400).json({ error: message }); try { const { rows } = await pool.query(`INSERT INTO profiles (name, email, age, role) VALUES ($1, $2, $3, $4) RETURNING ${fields}`, [req.body.name.trim(), req.body.email.trim(), Number(req.body.age), req.body.role?.trim() || 'Member']); return res.status(201).json(rows[0]); } catch (error) { if (error.code === '23505') return res.status(409).json({ error: 'That email is already in use.' }); return next(error); } });
app.put('/api/profiles/:id', async (req, res, next) => { const message = validate(req.body); if (message) return res.status(400).json({ error: message }); try { const { rows } = await pool.query(`UPDATE profiles SET name = $1, email = $2, age = $3, role = $4 WHERE id = $5 RETURNING ${fields}`, [req.body.name.trim(), req.body.email.trim(), Number(req.body.age), req.body.role?.trim() || 'Member', req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'Profile not found.' }); return res.json(rows[0]); } catch (error) { if (error.code === '23505') return res.status(409).json({ error: 'That email is already in use.' }); return next(error); } });
app.delete('/api/profiles/:id', async (req, res, next) => { try { const { rows } = await pool.query(`DELETE FROM profiles WHERE id = $1 RETURNING id`, [req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'Profile not found.' }); res.status(204).end(); } catch (error) { next(error); } });
app.use((_req, res) => res.sendFile(path.join(root, 'public', 'index.html')));
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: 'Server error. Check the database connection.' }); });
app.listen(port, () => console.log(`Full-stack app running at http://localhost:${port}`));
