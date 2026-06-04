/**
 * MobiTrack - Stock Management System Backend
 * Node.js + Express + MySQL REST API
 * 
 * Setup:
 *   npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
 *   node server.js
 */

require("dotenv").config();
const express  = require("express");
const mysql    = require("mysql2/promise");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const cors     = require("cors");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// ─── DB POOL ──────────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASS     || "",
  database: process.env.DB_NAME     || "mobitrack",
  waitForConnections: true,
  connectionLimit:    10,
});

// ─── AUTH MIDDLEWARE ─────────────────────────────────────────────────────────
const SECRET = process.env.JWT_SECRET || "mobitrack_secret_2024";

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM admin WHERE username = ?", [username]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: rows[0].id, username }, SECRET, { expiresIn: "8h" });
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
app.get("/api/dashboard", auth, async (req, res) => {
  try {
    const [[totalProds]]  = await pool.query("SELECT COUNT(*) AS count FROM products");
    const [[stockQty]]    = await pool.query("SELECT SUM(stock) AS total FROM products");
    const [[stockValue]]  = await pool.query("SELECT SUM(stock * selling_price) AS value FROM products");
    const today = new Date().toISOString().split("T")[0];
    const [[todaySales]]  = await pool.query("SELECT COALESCE(SUM(total_price),0) AS total FROM sales WHERE sale_date = ?", [today]);
    const [lowStock]      = await pool.query("SELECT * FROM products WHERE stock <= 3 ORDER BY stock ASC LIMIT 10");
    const [recentSales]   = await pool.query("SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id ORDER BY s.id DESC LIMIT 5");
    const [recentPurchases] = await pool.query("SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id ORDER BY pu.id DESC LIMIT 5");

    res.json({
      totalProducts:    totalProds.count,
      totalStockQty:    stockQty.total || 0,
      stockValue:       stockValue.value || 0,
      todaySales:       todaySales.total,
      lowStockItems:    lowStock,
      recentSales,
      recentPurchases,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
app.get("/api/products", auth, async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    let sql   = "SELECT * FROM products WHERE 1=1";
    const params = [];
    if (search) {
      sql += " AND (name LIKE ? OR brand LIKE ? OR imei LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category && category !== "All") { sql += " AND category = ?"; params.push(category); }
    sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const [rows] = await pool.query(sql, params);
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM products WHERE 1=1" + (search ? " AND (name LIKE ? OR brand LIKE ? OR imei LIKE ?)" : ""), search ? [`%${search}%`,`%${search}%`,`%${search}%`] : []);
    res.json({ data: rows, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", auth, async (req, res) => {
  const { name, brand, category, imei, purchase_price, selling_price, stock } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, brand, category, imei, purchase_price, selling_price, stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, brand, category, imei || "", purchase_price, selling_price, stock]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:id", auth, async (req, res) => {
  const { name, brand, category, imei, purchase_price, selling_price, stock } = req.body;
  try {
    await pool.query(
      "UPDATE products SET name=?, brand=?, category=?, imei=?, purchase_price=?, selling_price=?, stock=? WHERE id=?",
      [name, brand, category, imei, purchase_price, selling_price, stock, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PURCHASES ────────────────────────────────────────────────────────────────
app.get("/api/purchases", auth, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let sql = "SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id WHERE 1=1";
    const params = [];
    if (search) { sql += " AND (pu.supplier_name LIKE ? OR p.name LIKE ? OR pu.invoice_number LIKE ?)"; params.push(`%${search}%`,`%${search}%`,`%${search}%`); }
    sql += " ORDER BY pu.id DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), (parseInt(page)-1)*parseInt(limit));
    const [rows] = await pool.query(sql, params);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/purchases", auth, async (req, res) => {
  const { supplier_name, invoice_number, purchase_date, product_id, quantity, unit_cost } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const total_cost = quantity * unit_cost;
    const [result] = await conn.query(
      "INSERT INTO purchases (supplier_name, invoice_number, purchase_date, product_id, quantity, unit_cost, total_cost) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [supplier_name, invoice_number, purchase_date, product_id, quantity, unit_cost, total_cost]
    );
    await conn.query("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity, product_id]);
    await conn.commit();
    res.status(201).json({ id: result.insertId, total_cost });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ─── SALES ────────────────────────────────────────────────────────────────────
app.get("/api/sales", auth, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let sql = "SELECT s.*, p.name AS product_name, p.purchase_price AS cost FROM sales s JOIN products p ON s.product_id = p.id WHERE 1=1";
    const params = [];
    if (search) { sql += " AND (s.customer_name LIKE ? OR p.name LIKE ?)"; params.push(`%${search}%`,`%${search}%`); }
    sql += " ORDER BY s.id DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), (parseInt(page)-1)*parseInt(limit));
    const [rows] = await pool.query(sql, params);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sales", auth, async (req, res) => {
  const { customer_name, sale_date, product_id, quantity, selling_price } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[product]] = await conn.query("SELECT * FROM products WHERE id = ?", [product_id]);
    if (!product || product.stock < quantity) throw new Error("Insufficient stock");
    const total_price   = quantity * selling_price;
    const profit        = (selling_price - product.purchase_price) * quantity;
    const [result] = await conn.query(
      "INSERT INTO sales (customer_name, sale_date, product_id, quantity, selling_price, total_price, profit) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [customer_name || "Walk-in Customer", sale_date, product_id, quantity, selling_price, total_price, profit]
    );
    await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, product_id]);
    await conn.commit();
    res.status(201).json({ id: result.insertId, total_price, profit });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ─── REPORTS ─────────────────────────────────────────────────────────────────
app.get("/api/reports/profit-summary", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.name, SUM(s.quantity) AS units_sold,
             SUM(s.total_price) AS revenue,
             SUM(s.quantity * p.purchase_price) AS cost,
             SUM(s.profit) AS profit
      FROM sales s JOIN products p ON s.product_id = p.id
      GROUP BY p.id, p.name ORDER BY profit DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/reports/low-stock", auth, async (req, res) => {
  try {
    const threshold = req.query.threshold || 3;
    const [rows] = await pool.query("SELECT * FROM products WHERE stock <= ? ORDER BY stock ASC", [threshold]);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ MobiTrack API running on http://localhost:${PORT}`));
