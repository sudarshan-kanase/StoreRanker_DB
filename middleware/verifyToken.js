const jwt = require("jsonwebtoken");

exports.verifyToken = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      // ✅ Support both formats:
      // 1) Authorization: <token>
      // 2) Authorization: Bearer <token>
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // role based check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded; // { id, role }
      next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
