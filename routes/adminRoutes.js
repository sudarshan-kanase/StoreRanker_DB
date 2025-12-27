const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");

// 🔥 getStores ADD केलं
const {
  dashboard,
  addStore,
  getStores,
  getUsers, // 👈 ADD THIS
} = require("../controllers/adminController");

const router = express.Router();

// Admin dashboard
router.get("/dashboard", verifyToken(["ADMIN"]), dashboard);

// Add store
router.post("/store", verifyToken(["ADMIN"]), addStore);

// ✅ Admin store list (THIS WAS MISSING)
router.get("/stores", verifyToken(["ADMIN"]), getStores);

module.exports = router;
// ✅ NEW ROUTE
router.get("/users", verifyToken(["ADMIN"]), getUsers);