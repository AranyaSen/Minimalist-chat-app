"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ["direct", "group"],
        required: true,
    },
    participants: [
        {
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            role: {
                type: String,
                enum: ["member", "admin"],
                default: "member",
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            },
            lastReadMessageId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Message",
            },
        },
    ],
    lastMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
    },
    name: String, // for group
    avatar: String, // group icon
}, { timestamps: true });
const Conversation = mongoose_1.default.model("Conversation", conversationSchema);
exports.default = Conversation;
