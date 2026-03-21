import { Request, Response } from "express";
import User from "@/models/User";
import asyncHandler from "@/utils/asyncHandler";
import { responseHandler } from "@/utils/responseHandler";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  if (users.length > 0) {
    responseHandler(res, "Users fetched successfully", 200, users);
  } else {
    responseHandler(res, "No users created", 200);
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

  responseHandler(res, `Deleted user ${username}`, 200);
});
