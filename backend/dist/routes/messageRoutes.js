"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
router.get("/messages", messageController_1.getAllMessages);
router.post(
  "/messages/conversation/",
  messageController_1.getConversationMessages
);
router.post(
  "/messages/react/:messageId",
  messageController_1.updateMessageReaction
);
exports.default = router;
