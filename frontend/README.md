✨ Minimalist Chat App - Frontend

A snappy, modern, and highly responsive chat UI.

Welcome to the frontend codebase for my Minimalist Chat App. I built this focusing on delivering a lightning-fast and intuitive user experience using React 19, TypeScript, and Vite.

## 🏗️ Architecture Overview

The React application is built upon a modern, modular component-driven architecture:

- **Pages**: Top-level route components representing full views (e.g., Login, Chat UI).
- **Components**: Reusable UI building blocks (buttons, modals, chat bubbles).
- **Hooks**: Custom React hooks encapsulating specific UI or business logic.
- **Store**: Global client-state managed effortlessly and predictably.
- **Services/Queries**: Clean abstractions for API calls and server-state management.

I strictly separate client-side UI state from server-side data caching to keep the app blazing fast, avoid redundant network requests, and maintain code readability.

## 📦 Core Packages & Utilizations

Here is the carefully selected toolbox powering the frontend:

- **React (`react` v19) & React DOM**: The foundational UI library for building component-driven interfaces.
- **Vite (`vite`)**: The build tool and development server, ensuring incredibly fast Hot Module Replacement (HMR) and optimized production builds.
- **Tailwind CSS v4 (`tailwindcss`)**: The styling engine. I use utility classes to rapidly build a responsive, themeable UI directly from the markup without writing bloated, custom CSS files.
- **Zustand (`zustand`)**: A lightweight, fast, and scalable bearbones state-management solution. I use it for global UI states like the currently active chat, unread message counts, and general user preferences.
- **TanStack React Query (`@tanstack/react-query`)**: The go-to solution for server state. Whenever I fetch data via **Axios (`axios`)**, React Query automatically manages caching, loading states, error handling, and background syncing.
- **React Router (`react-router-dom`)**: Handles single-page application (SPA) navigation and private route guarding.
- **React Hook Form (`react-hook-form`) & Zod (`zod`)**: A perfect combination for complex forms. React Hook Form manages form state without messy component rerenders, while Zod strictly validates input data structures via `@hookform/resolvers`.
- **Socket.io Client (`socket.io-client`)**: Connects to the backend server to send and receive real-time chat messages and online status updates instantly.
- **Lucide React (`lucide-react`)**: Clean, customizable SVG icons used consistently throughout the interface.

## 📂 Folder Structure

Here's how I organized the `src/` directory:

```text
/assets     # Static files like images, fonts, or global SVGs
/components # Reusable UI components (buttons, modals, input fields)
/guards     # Higher-order components protecting private routes
/hooks      # Custom React hooks for shared logic across multiple components
/pages      # The main views for application routing
/queries    # React Query hooks (e.g., useGetMessages) abstracting data fetching
/services   # Axios instances, interceptors, and raw API call definitions
/store      # Zustand store definitions for global client state
/types      # TypeScript definitions keeping the app securely type-safe
/utils      # Small, pure helper functions (date formatting, token decoding)
```

## 🔐 Authentication Flow

To communicate securely with the backend, I implemented a robust **Access Token + Refresh Token** strategy:

1. **Login & Token Storage**: Upon logging in, the backend returns a short-lived **Access Token** in the JSON response, and implicitly sets a long-lived **Refresh Token** in an `HttpOnly` cookie. The Access Token is stored safely in memory (not in local storage, which protects against XSS attacks).
2. **API Requests**: I configured an Axios interceptor (in `/services`) to automatically attach the Access Token to the `Authorization` header (`Bearer <token>`) for every outgoing protected request.
3. **Silent Token Refresh**: When the short-lived 15-minute Access Token expires, API calls will fail with a `401 Unauthorized` error. My Axios response interceptor intercepts this error, automatically fires a background request to the backend's `/refresh` endpoint (which seamlessly passes the secure HttpOnly cookie), obtains a new Access Token, updates the headers, and gracefully retries the original failed request without the user ever noticing.

## 🚀 Key Functionalities Under the Hood

- **Lightning-fast Chat**: Opening a chat triggers `react-query` to fetch the initial message history via `axios`. Simultaneously, `socket.io-client` listens for new incoming messages. As messages arrive, the React Query cache or `zustand` store is instantly updated, rendering changes to the UI without full page refreshes.
- **Form Handling & Validation**: When a user registers or logs in, their inputs are captured by `react-hook-form` and instantly validated against a `zod` schema as they type. This provides immediate visual feedback and prevents unnecessary API requests if required fields are missed.

---

I hope you enjoy exploring the codebase!
