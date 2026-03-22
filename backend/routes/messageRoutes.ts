import express from "express";
import {
  createMessage,
  getAllMessages,
  getConversationMessages,
  updateMessageReaction,
} from "@/controllers/messageController";
import authMiddleware from "@/middlewares/authMiddleware";
import { validate } from "@/middlewares/validationMiddleware";
import {
  updateMessageReactionSchema,
  createMessageSchema,
} from "@/validators/messageValidator";

const router = express.Router();

router.get("/", authMiddleware, getAllMessages);
router.get("/conversation/:chatId", authMiddleware, getConversationMessages);
router.post(
  "/send",
  authMiddleware,
  validate(createMessageSchema),
  createMessage
);
router.post(
  "/react/:messageId",
  authMiddleware, // Assuming it should also be protected
  validate(updateMessageReactionSchema),
  updateMessageReaction
);

export default router;
