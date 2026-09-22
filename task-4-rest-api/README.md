# Task 4: Basic REST API

## Run

```bash
npm install
npm run dev
```

The API runs at `http://localhost:4000` and stores data in memory.

## Postman requests

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users` with `{ "name": "Maya", "email": "maya@example.com", "age": 25 }`
- `PUT /api/users/:id` with the same fields
- `DELETE /api/users/:id`
