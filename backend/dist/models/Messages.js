"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "video", "file"],
        default: "text",
    },
    content: { type: String, required: true },
    replyTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
    },
    editedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
    messageReaction: [
        {
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            type: String,
            default: "",
        },
    ],
}, { timestamps: true });
const Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
