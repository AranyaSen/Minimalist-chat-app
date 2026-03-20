import { Request, Response } from "express";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "@/utils/asyncHandler";
import { generateAccessToken, generateRefreshToken } from "@/utils/token";

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    res.status(409);
    throw new Error("Username or email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
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
  res.status(201).json({
    message: "User Created Successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

export const signinUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    res.status(401);
    throw new Error("Incorrect username or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Incorrect username or password");
  }

  const accessToken = generateAccessToken(user._id, user.username);
  const refreshToken = generateRefreshToken(user?._id, user.username);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User verified",
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  if (users.length > 0) {
    res.status(200).json(users);
  } else {
    res.status(200).json({ message: "No users created" });
  }
});

export const getUserImage = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user || !user.image || !user.image.data) {
      res.status(404);
      throw new Error("Image not found");
    }

    res.set("Content-Type", user.image.contentType);
    res.send(user.image.data);
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const username = user.username;
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: `Deleted user ${username}` });
});

export const verifyUser = (req: Request, res: Response) => {
  res.json({ message: `User verified` });
};
