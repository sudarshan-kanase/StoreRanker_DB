const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getStores, rateStore } = require("../controllers/userController");

const router = express.Router();


router.get("/stores", verifyToken(["USER"]), getStores);
router.post("/rate", verifyToken(["USER"]), rateStore);

module.exports = router;
