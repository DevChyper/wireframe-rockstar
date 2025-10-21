/*
  # PT Rockstar ERP Database Schema

  1. New Tables
    - `production_records` - Manufacturing/production tracking
      - `id` (bigint, primary key, auto-increment)
      - `reference` (text, unique) - Production order reference
      - `product_name` (text) - Product being manufactured
      - `quantity` (integer) - Quantity to produce
      - `status` (text) - planned, in_progress, completed
      - `date` (date) - Production date
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `inventory_items` - Stock management
      - `id` (bigint, primary key, auto-increment)
      - `sku` (text, unique) - Stock keeping unit
      - `name` (text) - Item name
      - `quantity` (integer) - Current stock level
      - `unit` (text) - Unit of measurement
      - `min_stock` (integer) - Minimum stock alert level
      - `location` (text) - Storage location
      - `created_at` (timestamptz)
    
    - `finance_transactions` - Financial records
      - `id` (bigint, primary key, auto-increment)
      - `reference` (text, unique)
      - `type` (text) - income or expense
      - `category` (text) - Transaction category
      - `amount` (decimal) - Transaction amount
      - `description` (text)
      - `date` (date)
      - `created_at` (timestamptz)
    
    - `sales_orders` - Sales order management
      - `id` (bigint, primary key, auto-increment)
      - `reference` (text, unique)
      - `customer_name` (text)
      - `total_amount` (decimal)
      - `status` (text) - pending, confirmed, shipped, delivered
      - `date` (date)
      - `created_at` (timestamptz)
    
    - `marketing_campaigns` - Marketing campaign tracking
      - `id` (bigint, primary key, auto-increment)
      - `name` (text)
      - `channel` (text) - digital, print, social, etc.
      - `budget` (decimal)
      - `start_date` (date)
      - `end_date` (date)
      - `status` (text) - planned, active, completed
      - `created_at` (timestamptz)
    
    - `employees` - Human resources records
      - `id` (bigint, primary key, auto-increment)
      - `employee_id` (text, unique)
      - `name` (text)
      - `department` (text)
      - `position` (text)
      - `email` (text)
      - `phone` (text)
      - `hire_date` (date)
      - `created_at` (timestamptz)
    
    - `tax_records` - Tax and customs compliance
      - `id` (bigint, primary key, auto-increment)
      - `reference` (text, unique)
      - `type` (text) - ppn (VAT), pph (income tax), cukai (excise)
      - `period` (text) - Tax period (YYYY-MM)
      - `amount` (decimal)
      - `status` (text) - pending, filed, paid
      - `due_date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (demonstration mode)
    
  3. Important Notes
    - All tables use default values for better data integrity
    - Unique constraints on reference fields prevent duplicates
    - Decimal type used for monetary values
    - Created_at timestamps for audit trails
*/

-- Production Records Table
CREATE TABLE IF NOT EXISTS production_records (
  id bigserial PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  product_name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'planned',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE production_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to production records"
  ON production_records FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to production records"
  ON production_records FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to production records"
  ON production_records FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from production records"
  ON production_records FOR DELETE
  TO public
  USING (true);

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
  id bigserial PRIMARY KEY,
  sku text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  min_stock integer NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to inventory items"
  ON inventory_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to inventory items"
  ON inventory_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to inventory items"
  ON inventory_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from inventory items"
  ON inventory_items FOR DELETE
  TO public
  USING (true);

-- Finance Transactions Table
CREATE TABLE IF NOT EXISTS finance_transactions (
  id bigserial PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'expense',
  category text NOT NULL DEFAULT '',
  amount decimal(15,2) NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to finance transactions"
  ON finance_transactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to finance transactions"
  ON finance_transactions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to finance transactions"
  ON finance_transactions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from finance transactions"
  ON finance_transactions FOR DELETE
  TO public
  USING (true);

-- Sales Orders Table
CREATE TABLE IF NOT EXISTS sales_orders (
  id bigserial PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  total_amount decimal(15,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sales orders"
  ON sales_orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to sales orders"
  ON sales_orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to sales orders"
  ON sales_orders FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from sales orders"
  ON sales_orders FOR DELETE
  TO public
  USING (true);

-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id bigserial PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  channel text NOT NULL DEFAULT '',
  budget decimal(15,2) NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'planned',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to marketing campaigns"
  ON marketing_campaigns FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to marketing campaigns"
  ON marketing_campaigns FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to marketing campaigns"
  ON marketing_campaigns FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from marketing campaigns"
  ON marketing_campaigns FOR DELETE
  TO public
  USING (true);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id bigserial PRIMARY KEY,
  employee_id text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  hire_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to employees"
  ON employees FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to employees"
  ON employees FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to employees"
  ON employees FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from employees"
  ON employees FOR DELETE
  TO public
  USING (true);

-- Tax Records Table
CREATE TABLE IF NOT EXISTS tax_records (
  id bigserial PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'ppn',
  period text NOT NULL DEFAULT '',
  amount decimal(15,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  due_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tax records"
  ON tax_records FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to tax records"
  ON tax_records FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to tax records"
  ON tax_records FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from tax records"
  ON tax_records FOR DELETE
  TO public
  USING (true);
