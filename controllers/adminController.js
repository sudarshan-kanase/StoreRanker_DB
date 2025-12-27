const pool = require("../db");

/* ===================== ADMIN DASHBOARD ===================== */
exports.dashboard = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const stores = await pool.query("SELECT COUNT(*) FROM stores");
    const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

    res.json({
      totalUsers: Number(users.rows[0].count),
      totalStores: Number(stores.rows[0].count),
      totalRatings: Number(ratings.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

/* ===================== ADD STORE ===================== */
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES ($1,$2,$3,$4)",
      [name, email, address, owner_id]
    );

    res.status(201).json({ message: "Store added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add store" });
  }
};

/* ===================== GET ALL STORES ===================== */
exports.getStores = async (req, res) => {
  try {
    const result = await pool.query(`
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
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};

/* ===================== GET ALL USERS ===================== */
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, address, role
      FROM users
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ===================== DELETE USER ===================== */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 Check role first
    const result = await pool.query(
      "SELECT role FROM users WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (result.rows[0].role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "ADMIN user cannot be deleted" });
    }

    await pool.query("DELETE FROM users WHERE id=$1", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

/* ===================== DELETE STORE ===================== */
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM stores WHERE id=$1", [id]);

    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete store" });
  }
};

/* ===================== UPDATE USER ===================== */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await pool.query(
      "UPDATE users SET name=$1, email=$2, address=$3 WHERE id=$4",
      [name, email, address, id]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

/* ===================== CHANGE ROLE ===================== */
exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["ADMIN", "USER", "OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2",
      [role, id]
    );

    res.json({ message: "Role updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change role" });
  }
};

exports.getRatingChart = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.name AS store,
        ROUND(AVG(r.rating), 2) AS avg_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.name
      ORDER BY s.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load rating chart" });
  }
};

exports.exportUsersCSV = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id"
    );

    let csv = "ID,Name,Email,Role\n";
    result.rows.forEach((u) => {
      csv += `${u.id},${u.name},${u.email},${u.role}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export CSV" });
  }
};

