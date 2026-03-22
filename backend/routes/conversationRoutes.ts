import express from "express";
import {
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  initiateDirectChat,
} from "@/controllers/conversationController";
import authMiddleware from "@/middlewares/authMiddleware";
import { validate } from "@/middlewares/validationMiddleware";
import {
  accessChatSchema,
  createGroupChatSchema,
  renameGroupSchema,
  groupActionSchema,
} from "@/validators/conversationValidator";

const router = express.Router();

router.get("/", authMiddleware, fetchChats);
router.post(
  "/",
  authMiddleware,
  validate(accessChatSchema),
  initiateDirectChat
);
router.post(
  "/group",
  authMiddleware,
  validate(createGroupChatSchema),
  createGroupChat
);
router.put("/rename", authMiddleware, validate(renameGroupSchema), renameGroup);
router.put(
  "/groupremove",
  authMiddleware,
  validate(groupActionSchema),
  removeFromGroup
);
router.put(
  "/groupadd",
  authMiddleware,
  validate(groupActionSchema),
  addToGroup
);

export default router;
