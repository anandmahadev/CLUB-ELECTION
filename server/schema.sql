-- =============================================
-- COLLEGE ELECTION SYSTEM - Database Schema
-- PostgreSQL
-- =============================================

-- Create database (run as superuser)
-- CREATE DATABASE college_election;

-- =============================================
-- ADMINS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ELECTION STATUS TABLE
-- Stores global election configuration
-- =============================================
CREATE TABLE IF NOT EXISTS election_config (
  id SERIAL PRIMARY KEY,
  election_active BOOLEAN DEFAULT FALSE,
  election_name VARCHAR(255) DEFAULT 'College Club President Election',
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default election config
INSERT INTO election_config (election_active, election_name)
VALUES (FALSE, 'College Club President Election')
ON CONFLICT DO NOTHING;

-- =============================================
-- STUDENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100),
  year VARCHAR(10),
  password_hash VARCHAR(255) NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast login lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);

-- =============================================
-- CANDIDATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  manifesto TEXT,
  department VARCHAR(100),
  year VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- VOTES TABLE
-- Anonymous: we store student_id to prevent
-- duplicate votes, but the UI never reveals
-- which candidate a student voted for.
-- =============================================
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for counting votes per candidate
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);
