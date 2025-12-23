const pool = require("../db");

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

exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  await pool.query(
    "INSERT INTO stores (name,email,address,owner_id) VALUES ($1,$2,$3,$4)",
    [name, email, address, owner_id]
  );

  res.json({ message: "Store added" });
};
