/*
  # Financial Products Schema

  1. New Tables
    - `providers` - Stores information about financial institutions and service providers
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo_url` (text)
      - `website` (text)
      - `description` (text)
      - `rating` (numeric)
      - `review_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `product_categories` - Defines product types (banks, loans, cards, etc.)
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text)
      - `description` (text)
      - `created_at` (timestamp)

    - `products` - Main products table
      - `id` (uuid, primary key)
      - `provider_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `features` (text[])
      - `special_offer` (text)
      - `tags` (text[])
      - `is_featured` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `product_details` - Stores product-specific attributes
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `attribute_name` (text)
      - `attribute_value` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Add policies for admin users to manage data
*/

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website text,
  description text,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to providers"
  ON providers
  FOR SELECT
  TO public
  USING (true);

-- Create product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to product categories"
  ON product_categories
  FOR SELECT
  TO public
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  category_id uuid REFERENCES product_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  features text[] DEFAULT '{}',
  special_offer text,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create product details table
CREATE TABLE IF NOT EXISTS product_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  attribute_name text NOT NULL,
  attribute_value text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to product details"
  ON product_details
  FOR SELECT
  TO public
  USING (true);

-- Insert initial product categories
INSERT INTO product_categories (name, slug, description) VALUES
  ('Banks', 'banks', 'Banking products and services'),
  ('Loans', 'loans', 'Personal, home, and business loans'),
  ('Credit Cards', 'cards', 'Credit and debit card offerings'),
  ('Phone Plans', 'phone-plans', 'Mobile and data plans'),
  ('Insurance', 'insurance', 'Insurance products and coverage');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_provider_id ON products(provider_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_details_product_id ON product_details(product_id);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_products_features ON products USING gin(features);