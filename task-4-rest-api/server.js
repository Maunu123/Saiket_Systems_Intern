import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;
let nextId = 3;
let users = [
  { id: 1, name: 'Amina Yusuf', email: 'amina@example.com', age: 27 },
  { id: 2, name: 'Ravi Shah', email: 'ravi@example.com', age: 31 },
];

app.use(cors());
app.use(express.json());

function validateUser(body) {
  const { name, email, age } = body;
  if (!name || !email || age === undefined) return 'name, email, and age are required';
  if (!String(email).includes('@')) return 'email must be valid';
  if (!Number.isInteger(Number(age)) || Number(age) < 0) return 'age must be a non-negative integer';
  return null;
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', storage: 'in-memory' }));
app.get('/api/users', (_req, res) => res.json(users));
app.get('/api/users/:id', (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});
app.post('/api/users', (req, res) => {
  const error = validateUser(req.body);
  if (error) return res.status(400).json({ error });
  const user = { id: nextId++, name: req.body.name.trim(), email: req.body.email.trim(), age: Number(req.body.age) };
  users.push(user);
  return res.status(201).json(user);
});
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  const error = validateUser(req.body);
  if (error) return res.status(400).json({ error });
  users[index] = { id: users[index].id, name: req.body.name.trim(), email: req.body.email.trim(), age: Number(req.body.age) };
  return res.json(users[index]);
});
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  const [deleted] = users.splice(index, 1);
  return res.json({ message: 'User deleted', user: deleted });
});
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(port, () => console.log(`REST API running at http://localhost:${port}`));
