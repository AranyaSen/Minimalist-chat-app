"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.empty": "Name is required",
    }),
    username: joi_1.default.string().required().messages({
        "string.empty": "Username is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Valid email is required",
        "string.empty": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
});
exports.signinSchema = joi_1.default.object({
    username: joi_1.default.string().required().messages({
        "string.empty": "Username is required",
    }),
    password: joi_1.default.string().required().messages({
        "string.empty": "Password is required",
    }),
});
