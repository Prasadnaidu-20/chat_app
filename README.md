# Realtime Chat App

A full-stack, real-time messaging application built with the **MERN** stack (**`MongoDB`**, **`Express`**, **`React`**, **`Node.js`**), featuring instant messaging via **`Socket.io`** and modern, responsive styling with **`Tailwind CSS`**.

## 🌟 Features
- **Real-Time Messaging**: Lightning-fast instant messaging powered by **`Socket.io`**.
- **Authentication & Authorization**: Secure user login, signup, and session management using **`JSON Web Tokens (JWT)`**.
- **Online Presence**: See who is currently online with live user status indicators.
- **Image Sharing**: Send images in chats with seamless **`Cloudinary`** integration.
- **Responsive Design**: Beautiful, mobile-friendly UI built with **`Tailwind CSS`** and **`daisyUI`** components.
- **Global State Management**: Fast and scalable state management utilizing **`Zustand`** on the frontend.
- **Production Ready**: Optimized build setup with **`Vite`** and unified full-stack serving for easy deployment (e.g., Render).

## ⚙️ Project Workflow

1. **Authentication**: Users create an account or log in. A secure **`JWT`** token is safely stored in an **HTTP-only cookie** to authorize subsequent requests.
2. **Real-time Connection**: Upon successful authentication, the client establishes a persistent two-way connection to the server via **`Socket.io`**. The server maps the active socket to the user's authentic ID, marking them "Online" and broadcasting this status to all connected clients.
3. **Data Fetching**: The **`React`** frontend (managed entirely by **`Zustand`**) queries the backend **REST API** to retrieve the sidebar user list and the messaging history for the currently active chat window. 
4. **Sending Messages**:
   - A user types a text message and/or attaches an image.
   - The payload is sent to the targeted **`Express`** backend API via a POST route.
   - Attached images are uploaded to **`Cloudinary`**, and the secure Media URL is attached to the message.
   - The backend creates and saves the message document into **`MongoDB`**.
   - Using **`Socket.io`**, the backend instantly emits a `newMessage` event **exclusively** to the intended receiver's active socket connection.
5. **Updating UI**: The receiver's client listens for the incoming `newMessage` event, verifies the sender ID matches their currently open chat, and seamlessly appends the new message to the UI instantly without requiring a page refresh.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Real-time Engine**: [Socket.io](https://socket.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Authentication**: `bcryptjs` for password hashing and `jsonwebtoken` for auth tokens.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local database or a free MongoDB Atlas URI)
- A [Cloudinary Account](https://cloudinary.com/) (For image uploads)

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd CHAT_APP
```

### 2. Install dependencies
From the root directory, install all required dependencies for both frontend and backend:
```bash
# This will install backend and frontend packages concurrently
npm run build
```
*(Alternatively, you can manually run `npm install` inside both the `backend/` and `frontend/` directories).*

### 3. Environment Variables Setup
Create a `.env` file in the **`backend`** directory (`backend/.env`) and add the following variables:

```env
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary Setup (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Running the Application Locally

You will need to run both the frontend and backend servers to develop locally.

**Start the Backend Server:**
Open a new terminal, navigate to the backend folder, and start the development server:
```bash
cd backend
npm run dev
```

**Start the Frontend Server:**
Open a second terminal, navigate to the frontend folder, and launch Vite:
```bash
cd frontend
npm run dev
```
Your frontend should now be running on `http://localhost:5173/` and securely communicating with the backend on `http://localhost:5001/`.

---

## 🌍 Building and Deployment (Production)

This project is configured so that the Express backend serves the React frontend statically in a production environment (like **Render** or **Heroku**).

To build and run the production version locally:

1. **Build the Frontend:**
   From the root folder run:
   ```bash
   npm run build
   ```
   *This compiles the React app into `frontend/dist`.*

2. **Start the Production Server:**
   Set your node environment and start the app:
   ```bash
   NODE_ENV=production npm start
   ```
   *The backend will now serve the backend API alongside all frontend static files.*

## 📂 Project Structure

```text
CHAT_APP/
├── backend/                  # Express server, MongoDB models, Controllers
│   ├── src/
│   │   ├── controllers/      # Route handler logic
│   │   ├── lib/              # Socket.io config, Database connection
│   │   ├── models/           # Mongoose schemas (User, Message)
│   │   ├── routes/           # Express API endpoints
│   │   └── index.js          # Main entry file
│   └── package.json
├── frontend/                 # React application via Vite
│   ├── src/
│   │   ├── components/       # Reusable UI elements (ChatUI, Sidebar)
│   │   ├── store/            # Zustand global state (useAuthStore, useChatStore)
│   │   ├── lib/              # Axios instance, formatting tools
│   │   ├── App.jsx           # Main routing component
│   │   └── index.css         # Tailwind directives and custom CSS
│   └── package.json
└── package.json              # Root package metadata for deployments
```
