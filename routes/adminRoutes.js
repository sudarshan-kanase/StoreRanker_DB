const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");

const {
  dashboard,
  addStore,
  getStores,
  getUsers,
  deleteUser,
  deleteStore,
  updateUser,
  changeRole,
  getRatingChart,
  exportUsersCSV,
} = require("../controllers/adminController");

const router = express.Router();

/* ================= ADMIN ROUTES ================= */

// Dashboard
router.get("/dashboard", verifyToken(["ADMIN"]), dashboard);

// Add Store
router.post("/store", verifyToken(["ADMIN"]), addStore);

// Store List
router.get("/stores", verifyToken(["ADMIN"]), getStores);

// User List
router.get("/users", verifyToken(["ADMIN"]), getUsers);

// Delete User
router.delete("/users/:id", verifyToken(["ADMIN"]), deleteUser);

// Delete Store
router.delete("/stores/:id", verifyToken(["ADMIN"]), deleteStore);

// Update User
router.put("/users/:id", verifyToken(["ADMIN"]), updateUser);

// Change Role
router.put("/users/:id/role", verifyToken(["ADMIN"]), changeRole);

//////ratings chart
router.get(
  "/ratings/chart",
  verifyToken(["ADMIN"]),
  getRatingChart
);

router.get(
  "/export/users",
  verifyToken(["ADMIN"]),
  exportUsersCSV
);



/* ================================================= */

module.exports = router;

