/*
  # Add Orders and Order Items Tables

  1. New Tables
    - `orders` - Store order metadata
    - `order_items` - Store items within an order

  2. Tables Structure
    - orders: id, total_amount, status, created_at
    - order_items: id, order_id, product_id, product_name, quantity, unit_price, product_type, created_at

  3. Security
    - Enable RLS on both tables
    - Add public insert policies to allow guest checkout
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  product_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can insert order_items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
