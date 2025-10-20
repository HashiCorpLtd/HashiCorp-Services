Authentication Backend Setup

This project now includes a minimal Node/Express backend to support user registration, login, and profile management using MongoDB and JWTs.

Quick start
1. Install dependencies:
   npm install

2. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.

3. Start MongoDB (local or use Atlas).

4. Run the server:
   npm run start

Endpoints
- POST /api/auth/register  { name, email, password }
- POST /api/auth/login     { email, password }
- GET  /api/auth/profile  (Bearer <token>)
- PUT  /api/auth/profile  (Bearer <token>) { name, avatarUrl, password }

Frontend integration
- The existing `login.html` and `dashboard.html` were updated to use the API for login/profile flows.

Security notes
- Passwords are hashed with bcrypt.
- JWTs are used for authentication. Keep `JWT_SECRET` secure.

If you want, I can add a registration form UI and seed an admin user automatically.
