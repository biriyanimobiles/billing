-- ═══════════════════════════════════════════════════════════════
-- MobiTrack — Mobile & Accessories Stock Management System
-- MySQL Database Schema
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS mobitrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mobitrack;

-- Admin / Authentication
CREATE TABLE admin (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,      -- bcrypt hash
  email      VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Default admin: username=admin, password=admin123
INSERT INTO admin (username, password) VALUES
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
-- ^ bcrypt hash of 'admin123'

-- Products
CREATE TABLE products (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(200) NOT NULL,
  brand          VARCHAR(100) NOT NULL,
  category       ENUM(
    'Mobile Phones','Chargers','Earphones','Bluetooth Speakers',
    'Power Banks','Screen Guards','Smart Watches','Mobile Covers','Accessories'
  ) NOT NULL,
  imei           VARCHAR(20)  DEFAULT '',
  purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  selling_price  DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock          INT          NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_brand    (brand),
  INDEX idx_imei     (imei)
);

-- Suppliers (optional normalized table)
CREATE TABLE suppliers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  phone      VARCHAR(20),
  email      VARCHAR(100),
  address    TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases
CREATE TABLE purchases (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  supplier_name   VARCHAR(200) NOT NULL,
  invoice_number  VARCHAR(100) NOT NULL,
  purchase_date   DATE         NOT NULL,
  product_id      INT          NOT NULL,
  quantity        INT          NOT NULL,
  unit_cost       DECIMAL(10,2) NOT NULL,
  total_cost      DECIMAL(10,2) NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product   (product_id),
  INDEX idx_date      (purchase_date),
  INDEX idx_invoice   (invoice_number)
);

-- Sales
CREATE TABLE sales (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  customer_name  VARCHAR(200) DEFAULT 'Walk-in Customer',
  sale_date      DATE         NOT NULL,
  product_id     INT          NOT NULL,
  quantity       INT          NOT NULL,
  selling_price  DECIMAL(10,2) NOT NULL,
  total_price    DECIMAL(10,2) NOT NULL,
  profit         DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes          TEXT,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product   (product_id),
  INDEX idx_date      (sale_date),
  INDEX idx_customer  (customer_name)
);

-- ─── USEFUL VIEWS ────────────────────────────────────────────────────────────

-- Stock overview by category
CREATE OR REPLACE VIEW vw_stock_by_category AS
  SELECT category,
         COUNT(*)         AS product_count,
         SUM(stock)       AS total_stock,
         SUM(stock * selling_price) AS stock_value
  FROM products GROUP BY category;

-- Profit by product
CREATE OR REPLACE VIEW vw_profit_by_product AS
  SELECT p.id, p.name, p.brand, p.category,
         COALESCE(SUM(s.quantity), 0)     AS units_sold,
         COALESCE(SUM(s.total_price), 0)  AS revenue,
         COALESCE(SUM(s.profit), 0)       AS profit
  FROM products p
  LEFT JOIN sales s ON s.product_id = p.id
  GROUP BY p.id;

-- Low stock report
CREATE OR REPLACE VIEW vw_low_stock AS
  SELECT * FROM products WHERE stock <= 3 ORDER BY stock ASC;

-- ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
INSERT INTO products (name, brand, category, imei, purchase_price, selling_price, stock) VALUES
  ('Samsung Galaxy A55',  'Samsung', 'Mobile Phones',      '356789012345678', 18000, 22500, 8),
  ('iPhone 15',           'Apple',   'Mobile Phones',      '490154203237518', 72000, 82000, 3),
  ('65W Fast Charger',    'OnePlus', 'Chargers',           '',                450,   799,   25),
  ('TWS Earbuds Pro',     'boAt',    'Earphones',          '',                700,   1299,  2),
  ('Bluetooth Speaker Mini','JBL',   'Bluetooth Speakers', '',                1200,  2199,  6),
  ('20000mAh Power Bank', 'Mi',      'Power Banks',        '',                900,   1499,  1),
  ('Tempered Glass 6.7"', 'Generic', 'Screen Guards',      '',                30,    99,    80),
  ('Redmi Note 13 Pro',   'Xiaomi',  'Mobile Phones',      '354125067891234', 16500, 19999, 5),
  ('Smart Watch Series 8','Fire-Boltt','Smart Watches',    '',                1800,  2999,  4),
  ('Silicone Back Cover', 'Generic', 'Mobile Covers',      '',                40,    149,   120);
