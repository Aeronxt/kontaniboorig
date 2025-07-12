/*
  # Seed Initial Product Data

  1. Data Population
    - Insert sample providers
    - Insert sample products
    - Insert product details for different categories

  2. Purpose
    - Populate the database with initial data for testing
    - Demonstrate the schema structure with real examples
*/

-- Insert sample providers
INSERT INTO providers (name, logo_url, website, description, rating, review_count) VALUES
  (
    'Royal Bank',
    'https://images.pexels.com/photos/7821486/pexels-photo-7821486.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://royalbank.example.com',
    'A leading financial institution offering comprehensive banking solutions',
    4.8,
    1250
  ),
  (
    'First National',
    'https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://firstnational.example.com',
    'Trusted nationwide bank with competitive rates',
    4.7,
    980
  );

-- Insert sample loan product
WITH loan_product AS (
  INSERT INTO products (
    provider_id,
    category_id,
    name,
    description,
    features,
    special_offer,
    tags,
    is_featured
  )
  VALUES (
    (SELECT id FROM providers WHERE name = 'Royal Bank'),
    (SELECT id FROM product_categories WHERE slug = 'loans'),
    'Personal Loan Plus',
    'Flexible personal loan with competitive rates',
    ARRAY['Quick approval', 'No early repayment fees', 'Flexible terms'],
    'No application fee',
    ARRAY['personal-loan', 'fast-approval', 'good-credit'],
    true
  )
  RETURNING id
)
INSERT INTO product_details (product_id, attribute_name, attribute_value)
VALUES
  ((SELECT id FROM loan_product), 'interest_rate', '7.99'),
  ((SELECT id FROM loan_product), 'max_amount', '50000'),
  ((SELECT id FROM loan_product), 'term', '1-7 years'),
  ((SELECT id FROM loan_product), 'monthly_payment', '657'),
  ((SELECT id FROM loan_product), 'total_repayment', '39432'),
  ((SELECT id FROM loan_product), 'approval_time', 'Same day');

-- Insert sample insurance product
WITH insurance_product AS (
  INSERT INTO products (
    provider_id,
    category_id,
    name,
    description,
    features,
    special_offer,
    tags,
    is_featured
  )
  VALUES (
    (SELECT id FROM providers WHERE name = 'First National'),
    (SELECT id FROM product_categories WHERE slug = 'insurance'),
    'Comprehensive Auto Insurance',
    'Complete protection for your vehicle',
    ARRAY['Accident forgiveness', 'Roadside assistance', 'Rental car coverage'],
    'First month free',
    ARRAY['auto', 'comprehensive', 'top-rated'],
    true
  )
  RETURNING id
)
INSERT INTO product_details (product_id, attribute_name, attribute_value)
VALUES
  ((SELECT id FROM insurance_product), 'monthly_premium', '89'),
  ((SELECT id FROM insurance_product), 'coverage', '500000'),
  ((SELECT id FROM insurance_product), 'deductible', '500'),
  ((SELECT id FROM insurance_product), 'claims_processing', '24-48 hours');