import express from "express";
import {
  getAllMessages,
  getConversationMessages,
  updateMessageReaction,
} from "@/controllers/messageController";
import authMiddleware from "@/middlewares/authMiddleware";

const router = express.Router();

router.get("/messages", authMiddleware, getAllMessages);
router.get(
  "/messages/conversation/:chatId",
  authMiddleware,
  getConversationMessages
);
router.post("/messages/react/:messageId", updateMessageReaction);

export default router;
