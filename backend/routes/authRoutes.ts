import express from "express";
import { signupSchema, signinSchema } from "@/validators/authValidator";
import { validate } from "@/middlewares/validationMiddleware";
import {
  signupUser,
  signinUser,
  refreshAccessToken,
  profile,
  logoutUser,
} from "@/controllers/authController";
import authMiddleware from "@/middlewares/authMiddleware";
import multer from "multer";

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
router.post("/refresh", refreshAccessToken);
router.post("/logout", authMiddleware, logoutUser);
router.get("/profile", authMiddleware, profile);

export default router;
