import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "@/config/db";
import authRoutes from "@/routes/authRoutes";
import userRoutes from "@/routes/userRoutes";
import messageRoutes from "@/routes/messageRoutes";
import conversationRoutes from "@/routes/conversationRoutes";
import initializeSocket from "@/sockets/chatSocket";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "@/middlewares/errorMiddleware";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

// Connect to Database
connectDB();

app.set("io", io);
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", conversationRoutes);

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
