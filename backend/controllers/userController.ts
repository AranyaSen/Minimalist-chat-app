import { Request, Response } from "express";
import User from "@/models/User";
import asyncHandler from "@/utils/asyncHandler";
import { responseHandler } from "@/utils/responseHandler";

import { AuthRequest } from "@/types/auth";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  const formattedUsers = users.map((u) => ({
    ...u.toObject(),
    image: u.image?.data ? `/api/user/${u._id}/image` : null,
  }));
  if (formattedUsers.length > 0) {
    responseHandler(res, "Users fetched successfully", 200, formattedUsers);
  } else {
    responseHandler(res, "No users created", 200);
  }
});

export const searchUsers = asyncHandler<AuthRequest>(async (req, res) => {
  const search = req.query.search as string | undefined;
  const currentUserId = req.user?.userId;

  if (!search || !search.trim()) {
    throw new Error("Search query is required");
  }

  const users = await User.find({
    _id: { $ne: currentUserId },
    $or: [
      { fullName: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
    ],
  }).select("-password -refreshToken -createdAt -joinedAt -__v -role");

  const formattedUsers = users.map((u) => ({
    ...u.toObject(),
    image: u.image?.data ? `/api/user/${u._id}/image` : null,
  }));

  responseHandler(res, "Users fetched successfully", 200, formattedUsers);
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

  responseHandler(res, `Deleted user ${username}`, 200);
});
