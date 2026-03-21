"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToGroup = exports.removeFromGroup = exports.renameGroup = exports.createGroupChat = exports.fetchChats = exports.accessChat = void 0;
const asyncHandler_1 = __importDefault(require("@/utils/asyncHandler"));
const Conversations_1 = __importDefault(require("@/models/Conversations"));
const User_1 = __importDefault(require("@/models/User"));
// Access or create a direct chat
exports.accessChat = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    // Find direct chat between these two users
    let isChat = await Conversations_1.default.find({
        type: "direct",
        $and: [
            { participants: { $elemMatch: { userId: req.user?.userId } } },
            { participants: { $elemMatch: { userId: userId } } },
        ],
    })
        .populate("participants.userId", "-password")
        .populate("lastMessage");
    isChat = await User_1.default.populate(isChat, {
        path: "lastMessage.sender",
        select: "name username email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            type: "direct",
            participants: [
                { userId: req.user?.userId, role: "member" },
                { userId: userId, role: "member" },
            ],
        };
        try {
            const createdChat = await Conversations_1.default.create(chatData);
            const FullChat = await Conversations_1.default.findOne({ _id: createdChat._id }).populate("participants.userId", "-password");
            res.status(200).json(FullChat);
        }
        catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});
// Fetch all chats for a user
exports.fetchChats = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        Conversations_1.default.find({
            participants: { $elemMatch: { userId: req.user?.userId } }
        })
            .populate("participants.userId", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
            results = await User_1.default.populate(results, {
                path: "lastMessage.sender",
                select: "name username email",
            });
            res.status(200).send(results);
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
// Create a group chat
exports.createGroupChat = (0, asyncHandler_1.default)(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }
    // Format participants for group chat
    const participants = users.map((uId) => ({
        userId: uId,
        role: "member",
        joinedAt: new Date(),
    }));
    // Add the creator as admin
    participants.push({
        userId: req.user?.userId,
        role: "admin",
        joinedAt: new Date(),
    });
    try {
        const groupChat = await Conversations_1.default.create({
            name: req.body.name,
            participants: participants,
            type: "group",
        });
        const fullGroupChat = await Conversations_1.default.findOne({ _id: groupChat._id })
            .populate("participants.userId", "-password");
        res.status(200).json(fullGroupChat);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
// Rename a group
exports.renameGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { chatId, name } = req.body;
    const updatedChat = await Conversations_1.default.findByIdAndUpdate(chatId, {
        name: name,
    }, {
        new: true,
    })
        .populate("participants.userId", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(updatedChat);
    }
});
// Remove user from a group
exports.removeFromGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Conversations_1.default.findByIdAndUpdate(chatId, {
        $pull: { participants: { userId: userId } },
    }, {
        new: true,
    })
        .populate("participants.userId", "-password");
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(removed);
    }
});
// Add user to a group
exports.addToGroup = (0, asyncHandler_1.default)(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Conversations_1.default.findByIdAndUpdate(chatId, {
        $push: { participants: { userId: userId, role: "member", joinedAt: new Date() } },
    }, {
        new: true,
    })
        .populate("participants.userId", "-password");
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(added);
    }
});
