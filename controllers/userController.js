const pool = require("../db");

exports.getStores = async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      COALESCE(AVG(r.rating),0) AS "avgRating",
      MAX(
        CASE WHEN r.user_id = $1 THEN r.rating END
      ) AS "userRating"
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
    `,
    [userId]
  );

  res.json(result.rows);
};

exports.rateStore = async (req, res) => {
  const { store_id, rating } = req.body;

  await pool.query(
    `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES ($1,$2,$3)
    ON CONFLICT (user_id, store_id)
    DO UPDATE SET rating = $3
    `,
    [req.user.id, store_id, rating]
  );

  res.json({ message: "Rating submitted" });
};
