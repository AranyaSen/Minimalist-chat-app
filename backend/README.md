# 🚀 Minimalist Chat App - Backend

The scalable engine powering real-time conversations.

## 📋 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Real-time** | Socket.io |
| **Authentication** | JWT (Access + Refresh tokens) |

## 🏗️ Architecture Overview

The backend follows a clean **MVC (Model-View-Controller)** architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      HTTP Request                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Routes  →  Middlewares (Auth, Validation, Error Handling)  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Controllers  →  Business Logic Processing                   │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│  Models (Mongoose)    │       │  Sockets (WebSocket)  │
│  - User               │       │  - join-room          │
│  - Message            │       │  - join-chat          │
│  - Conversation       │       │  - mark-read          │
│  - Notifications      │       │  - disconnect         │
│  - ReadMessage        │       │                       │
└───────────────────────┘       └───────────────────────┘
            │
            ▼
┌───────────────────────┐
│     MongoDB           │
└───────────────────────┘
```

### Layers Explained

- **Routes** (`/routes`) - Define API endpoints and map to controllers
- **Controllers** (`/controllers`) - Handle business logic for auth, messages, conversations, users
- **Models** (`/models`) - Mongoose schemas for data structures
- **Middlewares** (`/middlewares`) - Auth verification, validation, error handling
- **Sockets** (`/sockets`) - WebSocket event handlers for real-time features

## 📂 Folder Structure

```
backend/
├── config/           # Database connection configuration
├── controllers/      # Business logic handlers
│   ├── authController.ts
│   ├── conversationController.ts
│   ├── messageController.ts
│   └── userController.ts
├── middlewares/      # Express middleware
│   ├── authMiddleware.ts    # JWT verification
│   ├── errorMiddleware.ts   # Global error handling
│   └── validationMiddleware.ts # Joi validation
├── models/           # Mongoose schemas
│   ├── Conversations.ts
│   ├── Messages.ts
│   ├── Notifications.ts
│   ├── ReadMessage.ts
│   └── User.ts
├── routes/           # API route definitions
│   ├── authRoutes.ts
│   ├── conversationRoutes.ts
│   ├── messageRoutes.ts
│   └── userRoutes.ts
├── sockets/          # Socket.io handlers
│   └── chatSocket.ts
├── types/            # TypeScript type definitions
├── utils/            # Helper functions (token generation, response formatting)
├── validators/       # Joi validation schemas
├── uploads/          # File upload storage (Multer)
├── index.ts          # Application entry point
├── package.json
└── tsconfig.json
```

## 📦 Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `express` | Web framework for HTTP routing |
| `mongoose` | MongoDB ODM with typed schemas |
| `socket.io` | WebSocket server for real-time communication |
| `bcrypt` | Password hashing for security |
| `jsonwebtoken` | JWT token generation/verification |
| `joi` | Request body validation |
| `multer` | File upload handling (profile images) |
| `cookie-parser` | Parse HTTP cookies for refresh tokens |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |
| `ws` | WebSocket library |
| `ngrok` | Tunneling for development |
| `tsconfig-paths` | TypeScript path resolution |

### Development

| Package | Purpose |
|---------|---------|
| `typescript` | Type safety |
| `ts-node-dev` | Development server with hot reload |
| `@types/*` | TypeScript type definitions |
| `prettier` | Code formatting |

## 🔐 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/signin` | User login |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | User logout |
| GET | `/profile` | Get current user profile |

### User (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users |
| GET | `/:id/image` | Get user profile image |

### Messages (`/api/message`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Send a new message |
| GET | `/:chatId` | Get messages for a conversation |

### Conversations (`/api/chat`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's conversations |
| POST | `/` | Create new conversation |

## 🔐 Authentication Flow

1. **Login**: User credentials verified with bcrypt
2. **Token Generation**:
   - Access Token (15 min expiry) → returned in JSON body
   - Refresh Token (24 hr expiry) → set as HttpOnly cookie
3. **Protected Routes**: Access token sent via `Authorization: Bearer <token>` header
4. **Token Refresh**: Automatic refresh via `/refresh` endpoint using cookie

## 🚀 Real-time Features (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` | Client → Server | Register user to receive messages |
| `join-chat` | Client → Server | Join specific conversation room |
| `mark-read` | Client → Server | Mark messages as read |
| `messages-read` | Server → Client | Broadcast read receipts |
| `disconnect` | Client → Server | Handle user disconnection |

## 🛠️ Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm run start    # Start production server
npm run format   # Format code with Prettier
```

## ⚙️ Environment Variables

```env
MONGO_USER=<username>
MONGO_PASSWORD=<password>
MONGO_DB_NAME=<database_name>
JWT_SECRET=<secret_key>
PORT=7000
ALLOWED_ORIGINS=<comma_separated_origins>
```

---

Built with Node.js, Express, TypeScript, and Socket.io for real-time messaging.
