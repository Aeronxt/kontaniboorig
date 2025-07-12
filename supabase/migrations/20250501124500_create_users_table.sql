/*
  # Users Table Schema

  1. New Table
    - `users` - Stores user information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for public read access
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Set up security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to users"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert some sample data
INSERT INTO users (email, full_name) VALUES
  ('john.doe@example.com', 'John Doe'),
  ('jane.smith@example.com', 'Jane Smith'); 