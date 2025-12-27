const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const { myRatings } = require("../controllers/ownerController");

const router = express.Router();

router.get("/ratings", verifyToken(["OWNER"]), myRatings);

module.exports = router;

