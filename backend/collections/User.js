const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    image: { contentType: String, data: Buffer },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
