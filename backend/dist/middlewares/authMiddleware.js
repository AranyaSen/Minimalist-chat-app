"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseHandler_1 = require("@/utils/responseHandler");
const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return (0, responseHandler_1.responseHandler)(res, "Access denied", 403);
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return (0, responseHandler_1.responseHandler)(res, "Invalid or expired token", 403);
        }
        req.user = decoded;
        next();
    });
};
exports.authMiddleware = authMiddleware;
exports.default = exports.authMiddleware;
