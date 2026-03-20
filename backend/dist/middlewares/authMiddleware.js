"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies?.token;
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }
  jsonwebtoken_1.default.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    }
  );
};
exports.default = authenticateUser;
