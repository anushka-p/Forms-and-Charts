const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
}
function verifyUser(req, res, next) {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
}

module.exports = { verifyToken, verifyAdmin, verifyUser };
