"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const chatSocket_1 = __importDefault(require("./sockets/chatSocket"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
  cors: {
    origin: "*",
  },
});
// Connect to Database
(0, db_1.default)();
app.set("io", io);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use("/api", userRoutes_1.default);
app.use("/api", messageRoutes_1.default);
// Socket Initialization
(0, chatSocket_1.default)(io);
// Error Handling
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is listening at ${url}`);
});
