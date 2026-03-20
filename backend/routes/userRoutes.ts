import express from "express";
import multer from "multer";
import authenticateUser from "../middlewares/authMiddleware";
import {
  signupUser,
  signinUser,
  getAllUsers,
  getUserImage,
  deleteUser,
  verifyUser,
} from "../controllers/userController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/user/signup", upload.single("image"), signupUser);
router.post("/user/signin", signinUser);
router.get("/user/verify", authenticateUser, verifyUser);
router.get("/user", getAllUsers);
router.get("/user/:id/image", getUserImage);
router.delete("/user/:id", deleteUser);

export default router;
