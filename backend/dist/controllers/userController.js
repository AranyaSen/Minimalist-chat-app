"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.deleteUser = exports.getUserImage = exports.getAllUsers = exports.refreshAccessToken = exports.signinUser = exports.signupUser = void 0;
const User_1 = __importDefault(require("@/models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = __importDefault(require("@/utils/asyncHandler"));
const token_1 = require("@/utils/token");
const responseHandler_1 = require("@/utils/responseHandler");
exports.signupUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { fullName, username, email, password } = req.body;
    const userExists = await User_1.default.findOne({
        $or: [{ username }, { email }],
    });
    if (userExists) {
        res.status(409);
        throw new Error("Username or email already exists");
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const newUser = new User_1.default({
        fullName,
        username,
        email,
        password: hashedPassword,
        image: req.file
            ? {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
            : undefined,
    });
    await newUser.save();
    (0, responseHandler_1.responseHandler)(res, "User Created Successfully", 201, {
        user: {
            id: newUser._id,
            name: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
        },
    });
});
exports.signinUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { username, password } = req.body;
    const user = await User_1.default.findOne({ username });
    if (!user) {
        res.status(401);
        throw new Error("Incorrect username or password");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Incorrect username or password");
    }
    const accessToken = (0, token_1.generateAccessToken)(user._id, user.username);
    const refreshToken = (0, token_1.generateRefreshToken)(user?._id, user.username);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "prod",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
    (0, responseHandler_1.responseHandler)(res, "User logged in successfully", 200, {
        user: {
            id: user._id,
            name: user.fullName,
            username: user.username,
            email: user.email,
        },
        accessToken,
    });
});
exports.refreshAccessToken = (0, asyncHandler_1.default)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401);
        throw new Error("Refresh token not found");
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
    }
    catch (err) {
        res.status(403);
        throw new Error("Invalid or expired refresh token");
    }
    const user = await User_1.default.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
        res.status(403);
        throw new Error("Invalid refresh token");
    }
    const accessToken = (0, token_1.generateAccessToken)(user._id, user.username);
    (0, responseHandler_1.responseHandler)(res, "Access token refreshed successfully", 200, {
        accessToken,
    });
});
exports.getAllUsers = (0, asyncHandler_1.default)(async (req, res) => {
    const users = await User_1.default.find().select("-password");
    if (users.length > 0) {
        (0, responseHandler_1.responseHandler)(res, "Users fetched successfully", 200, users);
    }
    else {
        (0, responseHandler_1.responseHandler)(res, "No users created", 200);
    }
});
exports.getUserImage = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user || !user.image || !user.image.data) {
        res.status(404);
        throw new Error("Image not found");
    }
    res.set("Content-Type", user.image.contentType);
    res.send(user.image.data);
});
exports.deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    const username = user.username;
    await User_1.default.findByIdAndDelete(req.params.id);
    (0, responseHandler_1.responseHandler)(res, `Deleted user ${username}`, 200);
});
const verifyUser = (req, res) => {
    (0, responseHandler_1.responseHandler)(res, "User verified", 200);
};
exports.verifyUser = verifyUser;
