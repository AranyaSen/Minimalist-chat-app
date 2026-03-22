# Minimalist Chat App 💬

A clean, fast, and simple real-time chat application. It focuses on giving you a smooth messaging experience without the clutter.

## 🚀 Tech Stack

The project is split into a frontend and backend. Both are fully written in **TypeScript**.

### Frontend
- **React** + **Vite**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for caching and API state
- **Socket.io-client** for real-time magic
- Forms built with **React Hook Form** + **Zod**
- **Lucide React** for icons and **Emoji Picker React** for fun

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose** for the database
- **Socket.io** for handling websocket connections
- JWT authentication & `bcrypt` for secure passwords
- `multer` for handling file/image uploads

## 🛠️ Getting Started

Getting this up and running on your local machine is pretty straightforward.

**1. Install dependencies**
I've set up a script in the root folder to install everything at once. Just run:
```bash
npm run install:all
```
*(Or you can manually run `npm install` inside both the `frontend` and `backend` directories if you prefer).*

**2. Setup your environment variables**
You'll need a `.env` file in the `backend` folder. It should look something like this:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

*(Note: Check if there are any other specific keys needed in the backend depending on the integrations)*

In the `frontend` folder, you might also need a `.env` file:
```env
VITE_API_URL=http://localhost:5000
```
*(Make sure this points to wherever your local backend is running!)*

**3. Run the development servers**
You can start both servers directly from the root directory using the handy package scripts.

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

The frontend should now be running (usually on `http://localhost:5173`), and the backend on the port you specified. Open it up in your browser and you're good to go!

## ✨ Building for Production
If you want to build the project, simply run:
```bash
npm run build
```
This handles building both the frontend and backend simultaneously.

## ✨ Features
- ⚡ **Real-time messaging**: Instant message delivery using WebSockets.
- 🔒 **Secure Auth**: Solid JWT-based user authentication.
- 📱 **Responsive Design**: Minimalist UI that looks great on mobile and desktop.
- 😊 **Emojis**: Built-in emoji picker for when you need a reaction.
- 📁 **File Uploads**: Backend support for handling media uploads.

Feel free to fork this, open a PR, or raise an issue if you find any bugs. Happy coding! ✌️
