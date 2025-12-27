const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyToken");

// ✅ CHECK THIS LINE IN CONSOLE
console.log("getStores:", typeof userController.getStores);
console.log("rateStore:", typeof userController.rateStore);

router.get(
  "/stores",
  verifyToken(["USER"]),
  userController.getStores
);

router.post(
  "/rate",
  verifyToken(["USER"]),
  userController.rateStore
);

module.exports = router;
