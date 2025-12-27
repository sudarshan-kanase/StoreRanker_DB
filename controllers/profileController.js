const pool = require("../db");
const bcrypt = require("bcrypt");

/* ===================== GET PROFILE ===================== */
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, address, role
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/* ===================== UPDATE PASSWORD ONLY ===================== */
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const result = await pool.query(
      "SELECT password FROM users WHERE id=$1",
      [userId]
    );

    const match = await bcrypt.compare(
      oldPassword,
      result.rows[0].password
    );

    if (!match) {
      return res.status(401).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password=$1 WHERE id=$2",
      [hashed, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password update failed" });
  }
};
