const pool = require("../db");

// 🔹 ADMIN DASHBOARD
exports.dashboard = async (req, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const stores = await pool.query("SELECT COUNT(*) FROM stores");
  const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

  res.json({
    totalUsers: users.rows[0].count,
    totalStores: stores.rows[0].count,
    totalRatings: ratings.rows[0].count,
  });
};

// 🔹 ADD STORE
exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  await pool.query(
    "INSERT INTO stores (name,email,address,owner_id) VALUES ($1,$2,$3,$4)",
    [name, email, address, owner_id]
  );

  res.json({ message: "Store added" });
};

// 🔹 ✅ GET ALL STORES (ADMIN LIST)
exports.getStores = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(AVG(r.rating), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.id
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};
// ✅ GET ALL USERS (ADMIN)
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        address,
        role
      FROM users
      ORDER BY id
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};