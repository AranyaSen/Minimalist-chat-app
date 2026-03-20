import express from "express";
import multer from "multer";
import { validate } from "@/middlewares/validationMiddleware";
import { signupSchema, signinSchema } from "@/validators/userValidator";
import authenticateUser from "@/middlewares/authMiddleware";
import {
  signupUser,
  signinUser,
  getAllUsers,
  getUserImage,
  deleteUser,
  verifyUser,
} from "@/controllers/userController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/signup",
  upload.single("image"),
  validate(signupSchema),
  signupUser
);

router.post("/signin", validate(signinSchema), signinUser);
router.get("/verify", authenticateUser, verifyUser);
router.get("/", getAllUsers);
router.get("/:id/image", getUserImage);
router.delete("/user/:id", deleteUser);

export default router;
