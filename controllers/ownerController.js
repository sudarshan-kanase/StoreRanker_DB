const pool = require("../db");

exports.myRatings = async (req, res) => {
  const result = await pool.query(
    `SELECT u.name, r.rating
     FROM ratings r
     JOIN stores s ON r.store_id=s.id
     JOIN users u ON r.user_id=u.id
     WHERE s.owner_id=$1`,
    [req.user.id]
  );

  res.json(result.rows);
};

