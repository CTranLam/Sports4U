-- SQL Migration: Add is_popular column to products table (if not exists)
-- This is for PostgreSQL

-- Add is_popular column if it doesn't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster filtering by is_popular (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_products_is_popular ON products(is_popular);

