import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import initializeSocket from "./sockets/chatSocket";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Connect to Database
connectDB();

app.set("io", io);
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", messageRoutes);

// Socket Initialization
initializeSocket(io);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is listening at ${url}`);
});
