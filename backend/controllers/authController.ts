import { Request, Response } from "express";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "@/utils/asyncHandler";
import { responseHandler } from "@/utils/responseHandler";
import {
  generateAccessToken,
  generateRefreshToken,
  Token,
} from "@/utils/token";

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, username, email, password } = req.body;

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
  responseHandler(res, "User Created Successfully", 201, {
    user: {
      id: newUser._id,
      name: newUser.fullName,
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

  const accessToken = generateAccessToken({
    userId: user._id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id,
    username: user.username,
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "prod",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  responseHandler(res, "User logged in successfully", 200, {
    user: {
      id: user._id,
      name: user.fullName,
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401);
      throw new Error("Refresh token not found");
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string
      ) as any;
    } catch (err) {
      res.status(403);
      throw new Error("Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403);
      throw new Error("Invalid refresh token");
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      username: user.username,
    });
    responseHandler(res, "Access token refreshed successfully", 200, {
      accessToken,
      user: {
        id: user._id,
        name: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  }
);

export const profile = asyncHandler(async (req: Request, res: Response) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (!accessToken) {
    res.status(401);
    throw new Error("Access token not found");
  }
  const decoded = jwt.decode(accessToken) as Token;
  const user = await User.findById(decoded?.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  responseHandler(res, "User profile", 200, {
    user: {
      id: user._id,
      name: user.fullName,
      username: user.username,
      email: user.email,
    },
  });
});
