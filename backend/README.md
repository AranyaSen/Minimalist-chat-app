🚀 Minimalist Chat App - Backend
The scalable engine powering real-time conversations.

Welcome to the backend repository of my Minimalist Chat App! This is the engine that powers the real-time messaging platform. I built this with Node.js, Express, and TypeScript, focusing on performance, scalability, and writing clean, maintainable code.

## 🏗️ Architecture Overview

I structured the backend using a clean, layered MVC-style (Model-View-Controller) architecture. This separates concerns to keep the codebase maintainable and easy to navigate:

- **Routes** handle inbound HTTP requests and direct them to specific controllers.
- **Controllers** process the core business logic for each endpoint.
- **Models** define the data structures and interact directly with the database.
- **Middlewares** intercept requests for tasks like authentication, logging, and error handling before they reach the controllers.
- **Sockets** manage real-time WebSocket connections independently from the standard HTTP REST endpoints.

## 📦 Core Packages & Utilizations

I carefully chose this stack to ensure reliability and speed:

- **Express (`express`)**: The core web framework used to handle HTTP routing and standard API endpoints.
- **Mongoose (`mongoose`)**: The ODM for MongoDB. I use it to create strongly-typed data schemas and perform fluent database operations.
- **Socket.io (`socket.io`)**: The heart of the real-time chat. It establishes WebSocket connections with the frontend to push live messages and status updates instantly.
- **Bcrypt (`bcrypt`)**: Before saving any user passwords to the database, I hash them securely using bcrypt.
- **Joi (`joi`)**: Strict data validation is crucial. I use Joi to validate all incoming request bodies (like signup/login forms) before they ever hit the controllers or the database.
- **Multer (`multer`)**: Manages file uploads, allowing users to share images or documents within the chat.
- **JSON Web Token (`jsonwebtoken`) & Cookie Parser (`cookie-parser`)**: These form the backbone of the robust authentication system, managing tokens smoothly and securely.

## 📂 Folder Structure

Here's an overview of how the codebase is organized:

```text
/config       # Database connections and environment setups
/controllers  # The brains of the routes containing business logic
/middlewares  # Custom Express middlewares (e.g., verifying auth tokens)
/models       # Mongoose schemas (Users, Messages, Conversations, etc.)
/routes       # API endpoint definitions
/sockets      # Real-time event listeners and emitters for Socket.io
/types        # TypeScript interfaces and custom types for end-to-end type safety
/uploads      # Temporary or local storage for file uploads via Multer
/utils        # Handy helper functions (custom response formatters, token generators)
/validators   # Joi schema definitions for strict request validation
```

## 🔐 Authentication Flow

I implemented a highly secure **Access Token + Refresh Token** authentication strategy to keep user data safe while ensuring a seamless user experience:

1. **Login**: When a user logs in, `bcrypt` verifies their password. If successful, `jsonwebtoken` creates two tokens:
   - A short-lived **Access Token** (expires in 15 minutes).
   - A long-lived **Refresh Token** (expires in 1 day).
2. **Delivery**:
   - The **Access Token** is sent back in the JSON body for the client to hold in memory.
   - The **Refresh Token** is attached to the response as a secure, `HttpOnly` cookie via `cookie-parser`. This prevents any malicious client-side scripts (XSS attacks) from accessing it.
3. **Authorization**: For subsequent protected requests, the frontend must attach the Access Token to the `Authorization` header. My custom auth middleware intercepts these requests, verifies the token, and grants access.
4. **Refreshing**: When the 15-minute Access Token expires, the client hits a dedicated `/refresh` endpoint. The server reads the secure Refresh Token cookie automatically, verifies it against the database, and issues a brand new Access Token.

## 🚀 Real-time Messaging Under the Hood

When a user sends a message via an API endpoint or socket event, the `controllers` save it to MongoDB via Mongoose. Instantly, the `sockets` layer broadcasts that new message to the recipient's active socket connection using `socket.io`. This dual approach ensures every message is permanently persisted in the database while being delivered in real-time to the screen.

---

Feel free to explore the code, and reach out if you have any questions!
