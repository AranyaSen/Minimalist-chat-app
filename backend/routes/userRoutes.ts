import express from "express";
import {
  getAllUsers,
  getUserImage,
  deleteUser,
  searchUsers,
} from "@/controllers/userController";
import authMiddleware from "@/middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/search", authMiddleware, searchUsers);
router.get("/:id/image", authMiddleware, getUserImage);
router.delete("/user/:id", authMiddleware, deleteUser);

export default router;
