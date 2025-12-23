const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { dashboard, addStore } = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", verifyToken(["ADMIN"]), dashboard);
router.post("/store", verifyToken(["ADMIN"]), addStore);

module.exports = router;
