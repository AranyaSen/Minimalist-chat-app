import { Request, Response } from "express";
import Message from "@/models/Messages";
import Conversation from "@/models/Conversations";
import asyncHandler from "@/utils/asyncHandler";
import { responseHandler } from "@/utils/responseHandler";
import { AuthRequest } from "@/types/auth";

export const getAllMessages = asyncHandler<Request>(async (req, res) => {
  const messages = await Message.find();
  if (messages.length > 0) {
    return responseHandler(res, "Messages fetched successfully", 200, messages);
  }
  res.status(404);
  throw new Error("No messages found for all users");
});

// Get messages for a specific conversation
export const getConversationMessages = asyncHandler<Request>(
  async (req, res) => {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId: chatId })
      .populate("senderId", "fullName username email")
      .populate({
        path: "chatId",
        populate: {
          path: "participants.user",
          select: "fullName username email",
        },
      });

    responseHandler(
      res,
      "Conversation messages fetched successfully",
      200,
      messages
    );
  }
);

export const createMessage = asyncHandler<AuthRequest>(async (req, res) => {
  const { chatId, content, receiverId } = req.body;
  const user = req.user;

  // Create and save the new message
  const newMessage = new Message({
    senderId: user?.userId,
    receiverId: receiverId,
    chatId: chatId,
    messageType: "text",
    content: content,
  });

  await newMessage.save();

  await Conversation.findByIdAndUpdate(chatId, {
    lastMessage: newMessage._id,
  });

  const populatedMessage = await Message.findById(newMessage._id)
    .populate("senderId", "fullName email image username")
    .populate("chatId");

  const io = (req.app as any).get("io");
  if (io) {
    io.to(chatId).emit("message-received", populatedMessage);
  }

  responseHandler(res, "Message sent successfully", 200, populatedMessage);
});

export const updateMessageReaction = asyncHandler<AuthRequest>(
  async (req, res) => {
    const { reaction } = req.body;
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { messageReaction: reaction },
      { new: true }
    )
      .populate("senderId", "username")
      .populate({
        path: "chatId",
        populate: {
          path: "participants.user",
          select: "username",
        },
      });

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    const io = (req.app as any).get("io");
    if (io) {
      io.emit("message-reaction", message);
    }

    responseHandler(res, "reaction updated", 200, message);
  }
);
