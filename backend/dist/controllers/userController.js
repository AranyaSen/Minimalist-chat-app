"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser =
  exports.deleteUser =
  exports.getUserImage =
  exports.getAllUsers =
  exports.signinUser =
  exports.signupUser =
    void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
exports.signupUser = (0, asyncHandler_1.default)(async (req, res) => {
  const { name, username, password } = req.body;
  const userExists = await User_1.default.findOne({ username });
  if (userExists) {
    res.status(409);
    throw new Error("Username already exists");
  }
  if (!password) {
    res.status(400);
    throw new Error("Password is missing");
  }
  const salt = await bcrypt_1.default.genSalt(10);
  const hashedPassword = await bcrypt_1.default.hash(password, salt);
  const newUser = new User_1.default({
    name,
    username,
    password: hashedPassword,
    image: req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        }
      : undefined,
  });
  await newUser.save();
  res.status(201).json({
    message: "User Created Successfully",
    user: {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
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
  const token = jsonwebtoken_1.default.sign(
    { username, userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  res.status(200).json({ message: "SignIn successful", token });
});
exports.getAllUsers = (0, asyncHandler_1.default)(async (req, res) => {
  const users = await User_1.default.find().select("-password");
  if (users.length > 0) {
    res.status(200).json(users);
  } else {
    res.status(200).json({ message: "No users created" });
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
  res.status(200).json({ message: `Deleted user ${username}` });
});
const verifyUser = (req, res) => {
  res.json({ message: `User verified` });
};
exports.verifyUser = verifyUser;
