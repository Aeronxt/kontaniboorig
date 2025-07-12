/*
  # Items Table Schema

  1. New Table
    - `items` - Stores inventory items
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `qty` (integer)
      - `price` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for public read access
*/

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    qty integer NOT NULL DEFAULT 0,
    price decimal(10,2),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Set up security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to items"
    ON items
    FOR SELECT
    TO public
    USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_price ON items(price);

-- Insert sample data
INSERT INTO items (name, description, qty, price) VALUES
    ('Laptop', 'High-performance laptop', 10, 999.99),
    ('Mouse', 'Wireless mouse', 50, 29.99),
    ('Keyboard', 'Mechanical keyboard', 25, 89.99); 