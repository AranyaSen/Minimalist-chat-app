const express = require("express");
const router = express.Router();
const Message = require("../collections/Messages");

router.get("/messages", async (_, res) => {
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

router.post("/messages/conversation/", async (req, res) => {
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

// router.post("/messages/sender", async (req, res) => {
//   const { senderId, receiverId, messageContent } = req.body;
//   if (!senderId || !receiverId) {
//     return res.status(400).json({ error: "senderId,receiverId required" });
//   }
//   if (!messageContent) {
//     return res.status(400).json({ error: "No message to send" });
//   }
//   try {
//     const newMessage = new Message({
//       sender: senderId,
//       receiver: receiverId,
//       message: messageContent,
//     });
//     await newMessage.save();

//     await newMessage.populate("sender", "username");
//     await newMessage.populate("receiver", "username");

//     const io = req.app.get("io");
//     if (io) {
//       io.emit("new-message", newMessage);
//     }
//     return res
//       .status(201)
//       .json({ message: "Message sent successfully", content: newMessage });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to send message", error: error });
//   }
// });

router.post("/messages/react/:messageId", async (req, res) => {
  const { reaction } = req.body;
  const messageId = req.params.messageId;

  if (!reaction) {
    return res.status(400).json({ error: "reaction required" });
  }

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { messageReaction: reaction },
      { new: true }
    )
      .populate("sender", "username")
      .populate("receiver", "username");

    const io = req.app.get("io");
    if (io) {
      io.emit("message-reaction", message);
    }
    return res
      .status(200)
      .json({ message: "reaction updated", content: message });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
