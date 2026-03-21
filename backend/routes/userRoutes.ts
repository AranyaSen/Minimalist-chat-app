import express from "express";
import {
  getAllUsers,
  getUserImage,
  deleteUser,
} from "@/controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id/image", getUserImage);
router.delete("/user/:id", deleteUser);

export default router;
