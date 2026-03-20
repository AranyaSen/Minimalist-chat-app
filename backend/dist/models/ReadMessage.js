"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const readMessageSchema = new mongoose_1.default.Schema({
    messageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    readAt: {
        type: Date,
        default: Date.now,
    },
});
const ReadMessage = mongoose_1.default.model("ReadMessage", readMessageSchema);
exports.default = ReadMessage;
