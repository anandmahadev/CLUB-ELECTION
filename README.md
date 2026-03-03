# 🗳️ College Election Portal

<div align="center">

**A secure, full-stack online voting system for College Club President Elections**

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

- 🔐 **Secure Authentication** — Students log in with Roll Number + Password (bcrypt hashed)
- 🗳️ **One Vote Per Student** — Enforced at both application and database level
- 🔒 **Anonymous Voting** — Admin only sees aggregated vote counts, never who voted for whom
- 👨‍💼 **Admin Control Panel** — Start/stop elections, manage candidates, upload students via CSV
- 📊 **Live Results** — Real-time vote counts with percentage bars and CSV export
- 🛡️ **Production-ready Security** — JWT auth, rate limiting, input validation, SQL injection prevention
- 📱 **Mobile-first Design** — Fully responsive, optimized for phone users

---

## 🖼️ Application Pages

| Student Side | Admin Side |
|---|---|
| Landing Page | Admin Login |
| Login Page | Dashboard (stats + election control) |
| Voting Page (candidates list) | Candidates Management |
| Vote Confirmation Modal | Students Upload (CSV) |
| Success Page | Live Results + CSV Export |
| Already Voted Page | |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Axios, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 14+ |
| **Auth** | JSON Web Tokens (JWT), bcrypt |
| **Security** | express-rate-limit, express-validator, parameterized queries |

---

## 📁 Project Structure

```
college-election/
├── server/                        # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                  # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js      # Student login + JWT issuance
│   │   ├── voteController.js      # Vote submission (transactional)
│   │   └── adminController.js     # All admin operations
│   ├── middleware/
│   │   ├── auth.js                # JWT guards (student + admin)
│   │   ├── rateLimiter.js         # Brute-force protection
│   │   └── validate.js            # Input sanitization
│   ├── routes/
│   │   ├── auth.js                # POST /api/auth/login
│   │   ├── vote.js                # GET /api/candidates, POST /api/vote
│   │   └── admin.js               # /api/admin/*
│   ├── scripts/
│   │   └── seedAdmin.js           # Creates initial admin user
│   ├── schema.sql                 # PostgreSQL database schema
│   ├── .env.example               # Environment variable template
│   └── server.js                  # Express entry point
│
└── client/                        # Frontend (React + Vite)
    └── src/
        ├── components/            # Navbar, Spinner, Modal, Route Guards
        ├── context/               # Auth state via React Context
        ├── services/
        │   └── api.js             # Axios API client (auto token injection)
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── VotingPage.jsx
            ├── SuccessPage.jsx
            ├── AlreadyVotedPage.jsx
            └── admin/
                ├── AdminLoginPage.jsx
                ├── AdminLayout.jsx
                ├── AdminDashboard.jsx
                ├── AdminCandidatesPage.jsx
                ├── AdminStudentsPage.jsx
                └── AdminResultsPage.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) 14+
- npm v9+

### 1. Clone the Repository

```bash
git clone https://github.com/anandmahadev/CLUB-ELECTION.git
cd CLUB-ELECTION
```

### 2. Set Up the Database

Open **psql** or **pgAdmin** and run:

```sql
CREATE DATABASE college_election;
```

Import the schema:

```bash
psql -U postgres -d college_election -f server/schema.sql
```

### 3. Configure Environment Variables

```bash
cd server
copy .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_election
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=change_this_to_a_long_random_string
JWT_ADMIN_SECRET=change_this_to_another_long_random_string
JWT_EXPIRY=1h

ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123

CLIENT_ORIGIN=http://localhost:5173
```

### 4. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 5. Seed Admin User

```bash
cd server
node scripts/seedAdmin.js
```

This creates the admin account defined in your `.env`.

### 6. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend (from /server)
npm run dev

# Terminal 2 — Frontend (from /client)
npm run dev
```

| URL | Purpose |
|---|---|
| `http://localhost:5173` | Student voting portal |
| `http://localhost:5173/admin` | Admin panel |
| `http://localhost:5000/api/health` | API health check |

---

## 👥 How It Works

### 👨‍🎓 Student Flow

1. Go to the portal → **Login to Vote**
2. Enter Roll Number + Password *(provided by admin)*
3. Browse candidates → click **Vote**
4. Confirm in the popup → vote is recorded permanently
5. Cannot vote again — redirected to "Already Voted" page on next login

### 👨‍💼 Admin Flow

1. Login at `/admin`
2. **Upload Students** via CSV file
3. **Add Candidates** with name, department, year, manifesto
4. **Start Election** — students can now vote
5. Monitor **live results** in real time
6. **Stop Election** when voting closes
7. **Export results** as CSV for official records

---

## 📋 Sample CSV for Student Upload

```csv
name,roll_number,department,year,password
Rahul Sharma,CSE2021001,Computer Science,3rd Year,Pass@123
Priya Verma,ECE2022010,Electronics Engineering,2nd Year,Pass@456
Arjun Singh,ME2020015,Mechanical Engineering,4th Year,Pass@789
```

> Passwords from the CSV are hashed with bcrypt before storing — the plain text is never saved.

---

## 🔗 API Reference

| Method | Endpoint | Auth Required | Description |
|:---:|---|:---:|---|
| `POST` | `/api/auth/login` | ❌ | Student login |
| `GET` | `/api/candidates` | ✅ Student JWT | Candidates + election status |
| `POST` | `/api/vote` | ✅ Student JWT | Submit vote |
| `POST` | `/api/admin/login` | ❌ | Admin login |
| `GET` | `/api/admin/dashboard` | ✅ Admin JWT | Stats overview |
| `POST` | `/api/admin/add-candidate` | ✅ Admin JWT | Add candidate |
| `GET` | `/api/admin/candidates` | ✅ Admin JWT | List candidates |
| `DELETE` | `/api/admin/candidates/:id` | ✅ Admin JWT | Remove candidate |
| `POST` | `/api/admin/upload-students` | ✅ Admin JWT | Bulk CSV upload |
| `GET` | `/api/admin/students` | ✅ Admin JWT | List all students |
| `POST` | `/api/admin/start-election` | ✅ Admin JWT | Activate election |
| `POST` | `/api/admin/stop-election` | ✅ Admin JWT | Deactivate election |
| `GET` | `/api/admin/results` | ✅ Admin JWT | Aggregated results |
| `GET` | `/api/admin/export-results` | ✅ Admin JWT | Download results CSV |

---

## 🔒 Security

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt with 10 salt rounds |
| JWT expiry | 1 hour (separate secrets for student/admin) |
| Login rate limiting | Max 10 attempts per 15 minutes |
| Vote rate limiting | Max 3 attempts per minute |
| Input sanitization | express-validator on all endpoints |
| SQL injection | Parameterized queries via `pg` library |
| Duplicate vote prevention | DB transaction + row-level FOR UPDATE lock |
| Vote anonymity | Admin UI shows only aggregated counts — no student→candidate mapping exposed |

---

## 🚢 Production Deployment

1. Set `NODE_ENV=production` in your `.env`
2. Use strong random values for all JWT secrets
3. Set `CLIENT_ORIGIN` to your deployed frontend URL
4. Build the frontend:
   ```bash
   cd client && npm run build
   ```
5. Serve `client/dist` via **Nginx** or a static host (Vercel, Netlify)
6. Run the backend with **PM2**:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name college-election-api
   ```
7. Never commit `.env` — use your hosting platform's environment variables

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Built with ❤️ for fair, secure, and anonymous college elections.

</div>
