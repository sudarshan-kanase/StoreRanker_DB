const pool = require("../db");

exports.getStores = async (req, res) => {
  const result = await pool.query(
    `SELECT s.*, COALESCE(AVG(r.rating),0) AS rating
     FROM stores s
     LEFT JOIN ratings r ON s.id=r.store_id
     GROUP BY s.id`
  );
  res.json(result.rows);
};

exports.rateStore = async (req, res) => {
  const { store_id, rating } = req.body;

  await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1,$2,$3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating=$3`,
    [req.user.id, store_id, rating]
  );

  res.json({ message: "Rating submitted" });
};
