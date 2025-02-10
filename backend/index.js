const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.get("/hi", (req, res) => {
    res.send('hi server is running!');
});

// const CORS_URL = 'http://localhost:3000/';

app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);
app.use('/api', messageRoutes);

// const mongoURILocal = `mongodb://localhost:27017/${process.env.LOCAL_DB_NAME}`;
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mycluster.fgzmg.mongodb.net/${process.env.MONGO_DB_NAME}`;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MondogDB connection failed", err);
    })

const PORT = 7000 || process.env.PORT;
app.listen(PORT, () => {
    const url = `${process.env.RENDER_EXTERNAL_URL}:${PORT}` || `http://localhost:${PORT}`;
    console.log(`server is listening at port ${url}`);
});