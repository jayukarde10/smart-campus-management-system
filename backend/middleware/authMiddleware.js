const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // 🔥 Extract token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;

    next();

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;