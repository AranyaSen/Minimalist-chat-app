import express from "express";
import {
  getAllMessages,
  getConversationMessages,
  updateMessageReaction,
} from "../controllers/messageController";

const router = express.Router();

router.get("/messages", getAllMessages);
router.post("/messages/conversation/", getConversationMessages);
router.post("/messages/react/:messageId", updateMessageReaction);

export default router;
