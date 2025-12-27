const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  getProfile,
  updatePassword,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", verifyToken(["USER", "OWNER"]), getProfile);
router.put("/password", verifyToken(["USER", "OWNER"]), updatePassword);

module.exports = router;
