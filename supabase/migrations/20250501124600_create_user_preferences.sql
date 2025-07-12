/*
  # User Preferences Schema

  1. New Table
    - `user_preferences` - Stores user settings and preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `theme` (text, light/dark)
      - `notification_enabled` (boolean)
      - `email_frequency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for user access
*/

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light',
  notification_enabled boolean DEFAULT true,
  email_frequency text DEFAULT 'weekly',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Set up security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Allow users to update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample preferences for our sample users
INSERT INTO user_preferences (user_id, theme, notification_enabled, email_frequency)
SELECT 
  id as user_id,
  'light' as theme,
  true as notification_enabled,
  'weekly' as email_frequency
FROM users
WHERE email IN ('john.doe@example.com', 'jane.smith@example.com'); 