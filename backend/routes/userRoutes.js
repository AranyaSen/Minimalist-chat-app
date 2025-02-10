const express = require('express');
const User = require('../collections/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middlewares/authMiddleware');

// USER CREATION ROUTER
router.post("/user/signup", async (req, res) => {
    try {
        const { name, username, password } = req.body;
        const userExits = await User.findOne({ username: username });

        if (userExits) {
            return res.status(409).json({ message: 'Username already exits' });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is missing" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: "User Created Successfully", user: newUser });
    }
    catch (err) {
        return res.status(400).json({ error: "Error creating new user", message: err.message });
    }
});

// SIGNIN USER ROUTER 
router.post('/user/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }
        const token = jwt.sign({ username, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' });
        return res.status(200).json({ message: 'SignIn successful', token });
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});

// VERIFY THE USER AFTER SIGNIN
router.get('/user/verify', authenticateUser, (req, res) => {
    res.json({ message: `User verified` });
});

// GET ALL USERS ROUTER
router.get("/user", async (req, res) => {
    try {
        const users = await User.find();
        if (users.length > 0) {
            return res.status(200).json(users);
        }
        else {
            return res.status(200).json({ message: "No users created" });
        }
    } catch (error) {
        return res.status(400).json({ error: "Error fetching users", message: error });
    }
});

// DELETE USER ROUTER 
router.delete("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        const username = await User.findById(user).username;
        if (user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: `Deleted user ${username}` });
    }
    catch (err) {
        return res.status(400).json({ error: "Failed to delete the user", message: err.message });
    }
})

module.exports = router;
