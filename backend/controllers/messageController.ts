import { Request, Response } from "express";
import Message from "@/models/Messages";
import asyncHandler from "@/utils/asyncHandler";
import { responseHandler } from "@/utils/responseHandler";

export const getAllMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const messages = await Message.find();
    if (messages.length > 0) {
      return responseHandler(
        res,
        "Messages fetched successfully",
        200,
        messages
      );
    }
    res.status(404);
    throw new Error("No messages found for all users");
  }
);

// Get messages for a specific conversation
export const getConversationMessages = asyncHandler(
  async (req: Request, res: Response) => {
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

      responseHandler(
        res,
        "Conversation messages fetched successfully",
        200,
        messages
      );
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
) as any;

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

    responseHandler(res, "reaction updated", 200, message);
  }
);
