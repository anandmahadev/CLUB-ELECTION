<div align="center">

<br/>

<img src="https://raw.githubusercontent.com/anandmahadev/CLUB-ELECTION/main/client/public/vite.svg" width="60" alt="logo" />

<h1>🗳️ College Election Portal</h1>

<p><strong>A secure, anonymous, mobile-first voting system for College Club Elections</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

<p>
  <a href="https://github.com/anandmahadev/CLUB-ELECTION/stargazers"><img src="https://img.shields.io/github/stars/anandmahadev/CLUB-ELECTION?style=flat-square&color=yellow" /></a>
  <a href="https://github.com/anandmahadev/CLUB-ELECTION/issues"><img src="https://img.shields.io/github/issues/anandmahadev/CLUB-ELECTION?style=flat-square" /></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" />
</p>

<br/>

<a href="#-getting-started">Get Started</a> &nbsp;·&nbsp;
<a href="#-api-reference">API Docs</a> &nbsp;·&nbsp;
<a href="#-deployment">Deploy</a>

<br/><br/>

---

</div>

## 💡 What Is This?

The **College Election Portal** is a production-ready, full-stack web application that lets colleges run **secure, digital, anonymous elections** — built specifically for electing a **Club President**.

> No paper ballots. No manual counting. No duplicate votes. No exposed identities.

Students log in with their Roll Number, cast one vote, and they're done. Admins get a full control panel to manage candidates, upload students in bulk, run the election, and export results.

<br/>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🎓 Student Side
- ✅ Login with Roll Number + Password
- ✅ View all candidates with photos & manifesto
- ✅ One click vote with confirmation modal
- ✅ Permanent vote lock after submission
- ✅ "Already Voted" gate on re-login
- ✅ Session expires after 1 hour (JWT)

</td>
<td width="50%">

### 👨‍💼 Admin Side
- ✅ Separate admin login portal
- ✅ Dashboard with live vote stats
- ✅ Add / remove candidates
- ✅ Bulk upload students via CSV
- ✅ Start & stop election with one click
- ✅ Export results as CSV

</td>
</tr>
</table>

<br/>

---

## 🔒 Security at Every Layer

| Layer | Protection |
|:---:|---|
| 🔑 **Passwords** | Hashed with `bcrypt` (10 rounds) — plain text never stored |
| 🪙 **JWT Tokens** | 1-hour expiry · Separate secrets for students and admins |
| 🚦 **Rate Limiting** | 10 login attempts / 15 min · 3 vote attempts / min |
| 🧹 **Input Validation** | `express-validator` sanitizes all inputs before DB touch |
| 💉 **SQL Injection** | Fully parameterized queries via `pg` — no raw string queries |
| 🔐 **Duplicate Votes** | DB transaction + `SELECT ... FOR UPDATE` row-level lock |
| 👁️ **Anonymity** | Admin sees **only aggregated counts** — never who voted for whom |

<br/>

---

## 🗺️ Application Flow

```
Student                                      Admin
───────                                      ─────
  │                                            │
  ├── / (Landing Page)                         ├── /admin (Admin Login)
  │                                            │
  ├── /login (Enter Roll No + Password)        ├── /admin/dashboard
  │      │                                     │      ├── Live stats (students, votes, turnout)
  │      ▼ JWT issued                          │      └── Start / Stop Election button
  │                                            │
  ├── /vote (Browse Candidates)                ├── /admin/candidates
  │      │    [Election must be active]        │      ├── Add candidate (name, dept, manifesto)
  │      ▼ Select + Confirm modal              │      └── Remove candidate
  │                                            │
  ├── /success (Vote Recorded ✅)              ├── /admin/students
  │                                            │      ├── Upload via CSV
  └── /already-voted (Permanent lock 🔒)       │      └── View all students + voted status
                                               │
                                               └── /admin/results
                                                      ├── Vote counts + % bars
                                                      ├── Winner highlight
                                                      └── Export as CSV
```

<br/>

---

## 🗄️ Database Schema

```sql
students        → id, name, roll_number (UNIQUE), department, year,
                  password_hash, has_voted, created_at

candidates      → id, name, photo_url, manifesto, department, year, created_at

votes           → id, student_id (UNIQUE FK), candidate_id (FK), created_at
                  ↑ UNIQUE on student_id = one vote per student, enforced at DB level

admins          → id, username (UNIQUE), password_hash, created_at

election_config → id, election_active (bool), election_name,
                  started_at, ended_at, updated_at
```

<br/>

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- [PostgreSQL](https://www.postgresql.org) 14+

### 1 · Clone

```bash
git clone https://github.com/anandmahadev/CLUB-ELECTION.git
cd CLUB-ELECTION
```

### 2 · Setup Database

```sql
-- In psql or pgAdmin
CREATE DATABASE college_election;
```

```bash
psql -U postgres -d college_election -f server/schema.sql
```

### 3 · Configure Environment

```bash
cd server
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux
```

Fill in `server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_election
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=long_random_string_here
JWT_ADMIN_SECRET=another_long_random_string

ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123

CLIENT_ORIGIN=http://localhost:5173
```

### 4 · Install & Seed

```bash
# Backend
cd server && npm install
node scripts/seedAdmin.js   # Creates admin account

# Frontend
cd ../client && npm install
```

### 5 · Run

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

| URL | |
|---|---|
| `http://localhost:5173` | 🎓 Student Portal |
| `http://localhost:5173/admin` | 👨‍💼 Admin Panel |
| `http://localhost:5000/api/health` | 💚 API Health Check |

<br/>

---

## 📋 Sample CSV — Student Upload

```csv
name,roll_number,department,year,password
Rahul Sharma,CSE2021001,Computer Science,3rd Year,Pass@123
Priya Verma,ECE2022010,Electronics,2nd Year,Pass@456
Arjun Singh,ME2020015,Mechanical,4th Year,Pass@789
```

> Passwords in the CSV are hashed before storage — plain text is **never saved**.

<br/>

---

## 🔗 API Reference

<details>
<summary><strong>Student Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/auth/login` | ❌ | Login with roll number + password |
| `GET` | `/api/candidates` | ✅ JWT | Get candidates and election status |
| `POST` | `/api/vote` | ✅ JWT | Submit vote |

</details>

<details>
<summary><strong>Admin Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/admin/login` | ❌ | Admin login |
| `GET` | `/api/admin/dashboard` | ✅ Admin | Stats overview |
| `POST` | `/api/admin/add-candidate` | ✅ Admin | Add candidate |
| `GET` | `/api/admin/candidates` | ✅ Admin | List candidates |
| `DELETE` | `/api/admin/candidates/:id` | ✅ Admin | Remove candidate |
| `POST` | `/api/admin/upload-students` | ✅ Admin | Bulk CSV upload |
| `GET` | `/api/admin/students` | ✅ Admin | All students + vote status |
| `POST` | `/api/admin/start-election` | ✅ Admin | Activate election |
| `POST` | `/api/admin/stop-election` | ✅ Admin | Deactivate election |
| `GET` | `/api/admin/results` | ✅ Admin | Aggregated results |
| `GET` | `/api/admin/export-results` | ✅ Admin | Download results as CSV |

</details>

<br/>

---

## 🚢 Deployment

> The frontend and backend must be **hosted separately**.

| Part | Recommended Platform | Free |
|---|---|:---:|
| 🎨 **Frontend** (React/Vite) | [Vercel](https://vercel.com) | ✅ |
| ⚙️ **Backend** (Node/Express) | [Render](https://render.com) | ✅ |
| 🗄️ **Database** (PostgreSQL) | [Railway](https://railway.app) or [Supabase](https://supabase.com) | ✅ |

### Vercel (Frontend)
1. Import repo on Vercel
2. Set **Root Directory** → `client`
3. Framework: **Vite** · Build: `npm run build` · Output: `dist`
4. Add env var: `VITE_API_URL=https://your-render-backend.onrender.com/api`

### Render (Backend)
1. New Web Service → connect repo
2. Root directory: `server`
3. Build: `npm install` · Start: `node server.js`
4. Add all variables from `server/.env.example`

<br/>

---

## 📁 Project Structure

```
CLUB-ELECTION/
├── server/                    # Node.js + Express Backend
│   ├── config/db.js           # PostgreSQL pool
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth · Rate limit · Validation
│   ├── routes/                # API route definitions
│   ├── scripts/seedAdmin.js   # One-time admin setup
│   ├── schema.sql             # Database schema
│   └── server.js              # Entry point
│
└── client/                    # React + Vite Frontend
    └── src/
        ├── context/           # Auth state (React Context)
        ├── services/api.js    # Axios client (auto-injects JWT)
        ├── components/        # Navbar, Modal, Spinner, Guards
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── VotingPage.jsx
            ├── SuccessPage.jsx
            ├── AlreadyVotedPage.jsx
            └── admin/         # Full admin panel (5 pages)
```

<br/>

## 🤝 Community & Support

- **Bug Reports:** Open an issue [here](https://github.com/anandmahadev/CLUB-ELECTION/issues)
- **Feature Requests:** Share your ideas in the issues or start a discussion.
- **Questions:** Feel free to reach out to the maintainers.

## 👨‍💻 Maintainers

- **Anand Mahadev** - [GitHub](https://github.com/anandmahadev)

---

<div align="center">

**Made for fair, secure, and anonymous college elections.**

If this helped you, consider giving it a ⭐

</div>
