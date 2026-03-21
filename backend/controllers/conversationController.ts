import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { responseHandler } from "@/utils/responseHandler";
import Conversation from "@/models/Conversations";
import User from "@/models/User";
import { AuthRequest } from "@/types/user";

// Access or create a direct chat
export const accessChat = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }

    // Find direct chat between these two users
    let isChat: any = await Conversation.find({
      type: "direct",
      $and: [
        { participants: { $elemMatch: { userId: req.user?.userId } } },
        { participants: { $elemMatch: { userId: userId } } },
      ],
    })
      .populate("participants.userId", "-password")
      .populate("lastMessage");

    isChat = await User.populate(isChat, {
      path: "lastMessage.sender",
      select: "name username email",
    });

    if (isChat.length > 0) {
      responseHandler(res, "Chat accessed successfully", 200, isChat[0]);
    } else {
      var chatData = {
        type: "direct",
        participants: [
          { userId: req.user?.userId, role: "member" },
          { userId: userId, role: "member" },
        ],
      };

      try {
        const createdChat = await Conversation.create(chatData);
        const FullChat = await Conversation.findOne({
          _id: createdChat._id,
        }).populate("participants.userId", "-password");
        responseHandler(res, "Chat created successfully", 200, FullChat);
      } catch (error: any) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  }
) as any;

// Fetch all chats for a user
export const fetchChats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    try {
      Conversation.find({
        participants: { $elemMatch: { userId: req.user?.userId } },
      })
        .populate("participants.userId", "-password")
        .populate("lastMessage")
        .sort({ updatedAt: -1 })
        .then(async (results: any) => {
          results = await User.populate(results, {
            path: "lastMessage.sender",
            select: "name username email",
          });
          responseHandler(res, "Chats fetched successfully", 200, results);
        });
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
) as any;

// Create a group chat
export const createGroupChat = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    // Format participants for group chat
    const participants = users.map((uId: string) => ({
      userId: uId,
      role: "member",
      joinedAt: new Date(),
    }));

    // Add the creator as admin
    participants.push({
      userId: req.user?.userId,
      role: "admin",
      joinedAt: new Date(),
    });

    try {
      const groupChat = await Conversation.create({
        name: req.body.name,
        participants: participants,
        type: "group",
      });

      const fullGroupChat = await Conversation.findOne({
        _id: groupChat._id,
      }).populate("participants.userId", "-password");

      responseHandler(
        res,
        "Group chat created successfully",
        200,
        fullGroupChat
      );
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
) as any;

// Rename a group
export const renameGroup = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, name } = req.body;

  const updatedChat = await Conversation.findByIdAndUpdate(
    chatId,
    {
      name: name,
    },
    {
      new: true,
    }
  ).populate("participants.userId", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    responseHandler(res, "Group renamed successfully", 200, updatedChat);
  }
}) as any;

// Remove user from a group
export const removeFromGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, userId } = req.body;

    const removed = await Conversation.findByIdAndUpdate(
      chatId,
      {
        $pull: { participants: { userId: userId } },
      },
      {
        new: true,
      }
    ).populate("participants.userId", "-password");

    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      responseHandler(
        res,
        "User removed from group successfully",
        200,
        removed
      );
    }
  }
) as any;

// Add user to a group
export const addToGroup = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  const added = await Conversation.findByIdAndUpdate(
    chatId,
    {
      $push: {
        participants: { userId: userId, role: "member", joinedAt: new Date() },
      },
    },
    {
      new: true,
    }
  ).populate("participants.userId", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    responseHandler(res, "User added to group successfully", 200, added);
  }
}) as any;
