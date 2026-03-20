import { Request, Response } from "express";
import Message from "@/models/Messages";
import asyncHandler from "@/utils/asyncHandler";

export const getAllMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const messages = await Message.find();
    if (messages.length > 0) {
      return res.status(200).json(messages);
    }
    res.status(404);
    throw new Error("No messages found for all users");
  }
);

// Get messages for a specific conversation
export const getConversationMessages = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId: chatId })
      .populate("senderId", "name username email")
      .populate({
        path: "chatId",
        populate: {
          path: "participants.userId",
          select: "name username email",
        },
      });

    res.status(200).json(messages);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
}) as any;

export const updateMessageReaction = asyncHandler(
  async (req: Request, res: Response) => {
    const { reaction } = req.body;
    const messageId = req.params.messageId;

    if (!reaction) {
      res.status(400);
      throw new Error("reaction required");
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { messageReaction: reaction },
      { new: true }
    )
      .populate("sender", "username")
      .populate("receiver", "username");

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    const io = (req.app as any).get("io");
    if (io) {
      io.emit("message-reaction", message);
    }

    res.status(200).json({ message: "reaction updated", content: message });
  }
);
