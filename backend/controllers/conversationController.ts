import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { responseHandler } from "@/utils/responseHandler";
import Conversation from "@/models/Conversations";
import User from "@/models/User";
import { AuthRequest } from "@/types/auth";
import { ConversationPopulatedType } from "@/types/conversation";

// Fetch all chats for a user, with optional search filtering
export const fetchChats = asyncHandler<AuthRequest>(async (req, res) => {
  const search = req.query.search as string | undefined;
  const query: Record<string, unknown> = {
    participants: { $elemMatch: { user: req.user?.userId } },
  };
  if (search && search.trim()) {
    const matchingUsers = await User.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const matchingUserIds = matchingUsers.map((u) => u._id);

    query.$and = [
      { participants: { $elemMatch: { user: { $in: matchingUserIds } } } },
    ];
  }

  const results = await Conversation.find(query)
    .populate(
      "participants.user",
      "-password -refreshToken -createdAt -joinedAt -__v -role"
    )
    .populate("lastMessage", "-role -__v -_id")
    .sort({ updatedAt: -1 });

  const populatedResults = (await User.populate(results, {
    path: "lastMessage.senderId",
    select: "fullName username email",
  })) as unknown as ConversationPopulatedType[];

  responseHandler(res, "Chats fetched successfully", 200, populatedResults);
});

// Access or create a direct chat
export const initiateDirectChat = asyncHandler<AuthRequest>(
  async (req, res) => {
    const user = req.user;
    const { receiverId } = req.body;

    const receiver = await User.findById(receiverId);
    console.log(receiver);
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    const conversationExists = await Conversation.findOne({
      type: "direct",
      $and: [
        { participants: { $elemMatch: { user: user?.userId } } },
        { participants: { $elemMatch: { user: receiverId } } },
      ],
    })
      .populate("participants.user", "-password -refreshToken")
      .populate("lastMessage");

    if (conversationExists) {
      responseHandler(
        res,
        "Chat accessed successfully",
        200,
        conversationExists
      );
    } else {
      const chatData = {
        type: "direct",
        participants: [
          { user: user?.userId, role: "member" },
          { user: receiverId, role: "member" },
        ],
      };

      const createdChat = await Conversation.create(chatData);
      const FullChat = await Conversation.findOne({
        _id: createdChat._id,
      }).populate("participants.user", "-password -refreshToken");
      responseHandler(res, "Chat created successfully", 200, FullChat);
    }
  }
);

// Create a group chat
export const createGroupChat = asyncHandler<AuthRequest>(async (req, res) => {
  const users: string[] = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // Format participants for group chat
  const participants = users.map((uId: string) => ({
    user: uId,
    role: "member",
    joinedAt: new Date(),
  }));

  // Add the creator as admin
  participants.push({
    user: req.user?.userId as string,
    role: "admin",
    joinedAt: new Date(),
  });

  const groupChat = await Conversation.create({
    name: req.body.name,
    participants: participants,
    type: "group",
  });

  const fullGroupChat = await Conversation.findOne({
    _id: groupChat._id,
  }).populate("participants.user", "-password");

  responseHandler(res, "Group chat created successfully", 200, fullGroupChat);
});

// Rename a group
export const renameGroup = asyncHandler<Request>(async (req, res) => {
  const { chatId, name } = req.body;

  const updatedChat = await Conversation.findByIdAndUpdate(
    chatId,
    {
      name: name,
    },
    {
      new: true,
    }
  ).populate("participants.user", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    responseHandler(res, "Group renamed successfully", 200, updatedChat);
  }
});

// Remove user from a group
export const removeFromGroup = asyncHandler<Request>(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Conversation.findByIdAndUpdate(
    chatId,
    {
      $pull: { participants: { user: userId } },
    },
    {
      new: true,
    }
  ).populate("participants.user", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    responseHandler(res, "User removed from group successfully", 200, removed);
  }
});

// Add user to a group
export const addToGroup = asyncHandler<Request>(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Conversation.findByIdAndUpdate(
    chatId,
    {
      $push: {
        participants: { user: userId, role: "member", joinedAt: new Date() },
      },
    },
    {
      new: true,
    }
  ).populate("participants.user", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    responseHandler(res, "User added to group successfully", 200, added);
  }
});
