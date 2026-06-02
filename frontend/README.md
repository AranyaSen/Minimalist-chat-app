# ✨ Minimalist Chat App - Frontend

A snappy, modern, and highly responsive chat UI.

## 📋 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand |
| **Server State** | TanStack React Query |
| **HTTP Client** | Axios |
| **Real-time** | Socket.io Client |
| **Forms** | React Hook Form + Zod |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **Notifications** | React Toastify |

## 🏗️ Architecture Overview

The application follows a **feature-first, layered architecture** with clear separation between UI state, server state, and business logic:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Pages (Routes)                           │
│   LandingPage │ SignIn │ Signup │ ChatPage │ NotfoundPage      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Components     │ │   Custom Hooks   │ │    Guards        │
│ - Chatbox        │ │ - useChatSocket  │ │ - Auth guards    │
│ - Nav            │ │ - useDebounce    │ │                  │
│ - Loader         │ │                  │ │                  │
│ - AllUsersModal  │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│   Zustand Store         │         │   React Query           │
│   (Client UI State)     │         │   (Server State)        │
│ - useAuthStore          │         │ - useGetMessages        │
│ - isLoggedIn            │         │ - useGetConversations   │
│ - accessToken           │         │ - useGetUsers           │
│ - user                  │         │                         │
└─────────────────────────┘         └─────────────────────────┘
            │                                   │
            └─────────────────┬─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Services Layer                              │
│  - apiClient.ts (Axios instance)                                 │
│  - request.interceptor.ts (Attach auth tokens)                   │
│  - response.interceptor.ts (Handle 401, refresh tokens)          │
│  - authService, messageService, userService                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend API + Socket.io Server                      │
└─────────────────────────────────────────────────────────────────┘
```

## 📂 Folder Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, SVGs
│   ├── components/     # Reusable UI components
│   │   ├── AllUsersModal/
│   │   ├── Chatbox/
│   │   ├── ConversationsLoader/
│   │   ├── Loader/
│   │   ├── Nav/
│   │   └── Texting/
│   ├── guards/         # Route protection components
│   ├── hooks/          # Custom React hooks
│   │   ├── useChatSocket.ts    # Socket.io connection management
│   │   └── useDebounce.ts      # Input debouncing utility
│   ├── pages/          # Page-level components (routes)
│   │   ├── LandingPage/
│   │   ├── ChatPage/
│   │   ├── SignIn/
│   │   ├── Signup/
│   │   └── NotfoundPage/
│   ├── queries/        # React Query hooks for server state
│   ├── services/       # API layer
│   │   ├── api/
│   │   │   ├── apiClient.ts       # Axios instance config
│   │   │   ├── request.interceptor.ts
│   │   │   └── response.interceptor.ts
│   │   ├── authService/
│   │   └── userService/
│   ├── store/          # Zustand stores
│   │   ├── useAuthStore.ts
│   │   └── useAuthStore.types.ts
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Root component with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles (Tailwind)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## 📦 Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI library (v19) |
| `react-router-dom` | Client-side routing and navigation guards |
| `axios` | HTTP client for API requests |
| `@tanstack/react-query` | Server state management (caching, background sync) |
| `zustand` | Lightweight client state management |
| `socket.io-client` | Real-time WebSocket communication |
| `react-hook-form` | Performant form handling |
| `zod` + `@hookform/resolvers` | Schema validation for forms |
| `tailwindcss` | Utility-first CSS framework (v4) |
| `lucide-react` | Icon library |
| `react-toastify` | Toast notifications |
| `jwt-decode` | Decode JWT tokens |
| `emoji-picker-react` | Emoji picker for chat |

### Development

| Package | Purpose |
|---------|---------|
| `vite` + `@vitejs/plugin-react` | Build tool with HMR |
| `@tailwindcss/vite` | Tailwind Vite plugin |
| `typescript` | Type safety |
| `eslint` + plugins | Code linting |
| `prettier` | Code formatting |

## 🔐 Authentication Flow

```
┌──────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│   User       │     │   Frontend        │     │   Backend           │
│   Login      │     │                   │     │                     │
└─────┬────────┘     └─────────┬─────────┘     └──────────┬──────────┘
      │                        │                          │
      │ 1. Submit credentials  │                          │
      │───────────────────────>│                          │
      │                        │ 2. POST /api/auth/signin │
      │                        │─────────────────────────>│
      │                        │                          │ Validates
      │                        │ 3. Returns:              │
      │                        │    - accessToken (body)  │
      │                        │    - refreshToken (cookie)│
      │                        │<─────────────────────────│
      │ 4. Store in memory     │                          │
      │<───────────────────────│                          │
      │                        │                          │
      │ 5. Protected request   │                          │
      │───────────────────────>│                          │
      │                        │ 6. Authorization: Bearer │
      │                        │─────────────────────────>│
      │                        │                          │
      │         If 401 ───────>│ 7. Auto-refresh token    │
      │                        │─────────────────────────>│
      │                        │ 8. New access token      │
      │                        │<─────────────────────────│
      │                        │ 9. Retry original request│
      │                        │─────────────────────────>│
```

### Key Implementation Details

- **Access Token**: Stored in memory via Zustand (not localStorage - XSS safe)
- **Refresh Token**: HttpOnly cookie (not accessible to JavaScript)
- **Axios Interceptors**:
  - Request: Attach `Authorization: Bearer <token>` header
  - Response: On 401, auto-refresh and retry failed requests

## 🚀 Real-time Features (Socket.io)

The `useChatSocket` hook manages WebSocket connections:

```typescript
// Usage in ChatPage
const { socket, joinChat, markAsRead } = useChatSocket(userId);

// Join a conversation room
joinChat(chatId);

// Mark messages as read
markAsRead(chatId);
```

| Socket Event | Direction | Description |
|--------------|-----------|-------------|
| `join-room` | Client → Server | Register user's personal room |
| `join-chat` | Client → Server | Join specific conversation |
| `mark-read` | Client → Server | Mark messages as read |
| `messages-read` | Server → Client | Read receipt broadcast |

## 🛠️ Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run format    # Format with Prettier
```

## ⚙️ Environment Variables

```env
VITE_BACKEND_URL=<backend_url>
VITE_WEBSOCKET_URL=<websocket_url>
```

## 🎨 Key Features

- **Optimistic UI Updates**: React Query caches provide instant feedback
- **Background Sync**: Data stays fresh without manual refreshing
- **Debounced Search**: Efficient user search with `useDebounce`
- **Loading States**: Skeleton loaders for conversations
- **Toast Notifications**: User-friendly error/success messages
- **Private Routes**: Auth guards protect authenticated pages

---

Built with React 19, TypeScript, Vite, Tailwind CSS, Zustand, and Socket.io.
