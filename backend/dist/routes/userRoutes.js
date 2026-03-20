"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = __importDefault(
  require("../middlewares/authMiddleware")
);
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post(
  "/user/signup",
  upload.single("image"),
  userController_1.signupUser
);
router.post("/user/signin", userController_1.signinUser);
router.get(
  "/user/verify",
  authMiddleware_1.default,
  userController_1.verifyUser
);
router.get("/user", userController_1.getAllUsers);
router.get("/user/:id/image", userController_1.getUserImage);
router.delete("/user/:id", userController_1.deleteUser);
exports.default = router;
