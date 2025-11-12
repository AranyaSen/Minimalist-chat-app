const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { WebSocketServer } = require("ws");
require("dotenv").config();

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connected!");

  ws.on("message", (message) => {
    console.log("Message received via WS:", message);
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected");
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);
// Make wss accessible inside route files
app.set("wss", wss);
app.use("/api", messageRoutes);

// const mongoURILocal = `mongodb://localhost:27017/${process.env.LOCAL_DB_NAME}`;
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mycluster.fgzmg.mongodb.net/${process.env.MONGO_DB_NAME}`;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MondogDB connection failed", err);
  });

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  const url =
    `http://localhost:${PORT}` || `${process.env.RENDER_EXTERNAL_URL}:${PORT}`;
  console.log(`server is listening at port ${url}`);
});
