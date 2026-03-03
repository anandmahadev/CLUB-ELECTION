# 🗳️ College Election Portal

A secure, full-stack web application for conducting a **College Club President Election**. Built with React (Vite) + Tailwind CSS on the frontend and Node.js + Express + PostgreSQL on the backend.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 3, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT (student + admin), bcrypt |
| Security | Rate limiting, input validation, SQL injection prevention |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm v9+

---

### 1. Clone the project

```bash
git clone <your-repo-url>
cd college-election
```

---

### 2. Set up the Database

Open PostgreSQL and run:

```sql
CREATE DATABASE college_election;
```

Then import the schema:

```bash
psql -U postgres -d college_election -f server/schema.sql
```

---

### 3. Configure Backend Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_election
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=some_long_random_secret
JWT_ADMIN_SECRET=another_long_random_secret
JWT_EXPIRY=1h

ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123

CLIENT_ORIGIN=http://localhost:5173
```

---

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

---

### 5. Seed Admin User

This creates the admin login account in the database:

```bash
cd server
node scripts/seedAdmin.js
```

---

### 6. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 7. Run the Application

**Start Backend** (in `/server`):
```bash
npm run dev
```

**Start Frontend** (in `/client`):
```bash
npm run dev
```

- **Student Portal**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin

---

## 👥 User Flows

### Student Flow
1. Go to `http://localhost:5173`
2. Click "Login to Vote"
3. Enter Roll Number + Password (set by admin)
4. Browse candidates and click "Vote"
5. Confirm in the modal
6. Vote is recorded permanently — cannot vote again

### Admin Flow
1. Go to `http://localhost:5173/admin`
2. Login with admin credentials
3. Upload students via CSV (`name`, `roll_number`, `department`, `year`, `password`)
4. Add candidates
5. Start the election
6. Monitor results in real time
7. Stop the election when done
8. Export results as CSV

---

## 📁 Project Structure

```
college-election/
├── server/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js     # Student login
│   │   ├── voteController.js     # Voting logic
│   │   └── adminController.js    # All admin operations
│   ├── middleware/
│   │   ├── auth.js               # JWT middleware
│   │   ├── rateLimiter.js        # Rate limiting
│   │   └── validate.js           # Input validation
│   ├── routes/
│   │   ├── auth.js               # /api/auth/*
│   │   ├── vote.js               # /api/candidates, /api/vote
│   │   └── admin.js              # /api/admin/*
│   ├── scripts/
│   │   └── seedAdmin.js          # Creates admin user
│   ├── schema.sql                # Database schema
│   ├── .env.example
│   └── server.js                 # Entry point
│
└── client/
    └── src/
        ├── components/           # Reusable UI components
        ├── context/              # Auth state (React Context)
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── VotingPage.jsx
        │   ├── SuccessPage.jsx
        │   ├── AlreadyVotedPage.jsx
        │   └── admin/
        │       ├── AdminLoginPage.jsx
        │       ├── AdminLayout.jsx
        │       ├── AdminDashboard.jsx
        │       ├── AdminCandidatesPage.jsx
        │       ├── AdminStudentsPage.jsx
        │       └── AdminResultsPage.jsx
        └── services/
            └── api.js            # Axios API client
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Student login |
| GET | `/api/candidates` | Student JWT | Get candidates + election status |
| POST | `/api/vote` | Student JWT | Submit vote |
| POST | `/api/admin/login` | — | Admin login |
| GET | `/api/admin/dashboard` | Admin JWT | Dashboard stats |
| POST | `/api/admin/add-candidate` | Admin JWT | Add candidate |
| GET | `/api/admin/candidates` | Admin JWT | List candidates |
| DELETE | `/api/admin/candidates/:id` | Admin JWT | Remove candidate |
| POST | `/api/admin/upload-students` | Admin JWT | Bulk CSV upload |
| GET | `/api/admin/students` | Admin JWT | List students |
| POST | `/api/admin/start-election` | Admin JWT | Activate election |
| POST | `/api/admin/stop-election` | Admin JWT | Deactivate election |
| GET | `/api/admin/results` | Admin JWT | Aggregated results |
| GET | `/api/admin/export-results` | Admin JWT | Download results CSV |

---

## 🔒 Security Features

- **Passwords**: hashed with bcrypt (10 salt rounds)
- **JWT tokens**: 1-hour expiry, separate secrets for students and admins
- **Rate limiting**: 10 login attempts per 15 minutes; 3 vote attempts per minute
- **Input validation**: All inputs sanitized with express-validator
- **SQL injection**: Prevented via parameterized queries (pg library)
- **Vote integrity**: DB transaction + row-level locking prevents race conditions
- **Anonymous votes**: Admin UI shows only aggregated counts — never individual student choices
- **Duplicate prevention**: `UNIQUE` constraint on `student_id` in votes table as database-level backup

---

## 📄 Sample CSV for Student Upload

```csv
name,roll_number,department,year,password
Rahul Sharma,CSE2021001,Computer Science,3rd Year,Pass@123
Priya Verma,ECE2022010,Electronics,2nd Year,Pass@456
Arjun Singh,ME2020015,Mechanical,4th Year,Pass@789
```

---

## 🚢 Production Deployment Notes

1. Set `NODE_ENV=production` in your `.env`
2. Change all JWT secrets to long random strings
3. Set `CLIENT_ORIGIN` to your frontend domain
4. Build frontend: `cd client && npm run build`
5. Serve the `client/dist` folder via nginx or a static host
6. Use a process manager like PM2 for the backend: `pm2 start server.js`
7. Use environment variables via your hosting platform (never commit `.env`)

---

*Built for secure, fair, and anonymous college elections.*
