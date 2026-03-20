"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Conversation",
    },
    messageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
    },
    type: {
        type: String,
        enum: ["message", "group_invite", "group_remove", "reaction"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Notification = mongoose_1.default.model("Notification", notificationSchema);
exports.default = Notification;
