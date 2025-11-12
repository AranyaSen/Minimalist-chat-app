const express = require("express");
const router = express.Router();
const Message = require("../collections/Messages");
const { WebSocketServer } = require("ws");

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    if (messages.length > 0) {
      return res.status(200).json(messages);
    }
    return res.status(404).json({ message: "No messages found for all users" });
  } catch (err) {
    return res.status(400).json({ message: "Some error occured", error: err });
  }
});

router.post("/messages/receiver/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Invalid sender or receiver" });
  }
  try {
    const messages = await Message.find({
      $or: [
        { sender: receiverId, receiver: senderId },
        { sender: senderId, receiver: receiverId },
      ],
    })
      .populate("sender", "username")
      .populate("receiver", "username")
      // messages schema uses `timeStamp` so sort by that field
      .sort({ timeStamp: 1 });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No message" });
    }
    return res.status(200).json(messages);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch messages", err: err });
  }
});

router.post("/messages/sender", async (req, res) => {
  const { senderId, receiverId, messageContent } = req.body;
  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "senderId,receiverId required" });
  }
  if (senderId && receiverId) {
    if (!messageContent) {
      return res.status(400).json({ error: "No message to send" });
    }
  }
  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message: messageContent,
    });
    await newMessage.save();
    // populate sender/receiver so the client receives the same shape as the
    // HTTP /messages/receiver response (sender and receiver as objects)
    await newMessage.populate("sender", "username");
    await newMessage.populate("receiver", "username");

    // send a plain object (not a Mongoose document) over websocket
    const payload = { type: "new-message", data: newMessage.toObject() };
    const wss = req.app.get("wss");
    if (wss) {
      wss.clients.forEach((client) => {
        // WebSocket.OPEN === 1
        if (client.readyState === 1) {
          client.send(JSON.stringify(payload));
        }
      });
    }
    return res
      .status(201)
      .json({ message: "Message sent successfully", content: newMessage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to send message", error: error });
  }
});

router.post('/messages/react/:messageId', async (req, res) => {
  const { reaction } = req.body;
  const messageId = req.params.messageId;

  if (!reaction) {
    return res.status(400).json({ error: "reaction required" });
  }

  try {
    // return the updated document
    const message = await Message.findByIdAndUpdate(
      messageId,
      { messageReaction: reaction },
      { new: true }
    ).populate("sender", "username").populate("receiver", "username");

    const wss = req.app.get("wss");
    const payload = { type: "new-message", data: message ? message.toObject() : null };
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(payload));
        }
      });
    }
    return res.status(200).json({ message: "reaction updated", content: message });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
