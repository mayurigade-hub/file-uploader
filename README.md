<div align="center">

# CloudDrop ☁️

### Production-Grade Chunked File Upload System

*A robust, full-stack file management application that handles massive file uploads reliably — splitting them into chunks, surviving network failures, and resuming exactly where you left off.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

[🚀 Getting Started](#getting-started) · [🏗️ Architecture](#architecture) · [✨ Features](#features) · [📸 Screenshots](#screenshots)

</div>

---

## 🧠 What is CloudDrop?

CloudDrop is a production-grade MERN stack application built to answer one question:

> **How do you upload a 10GB file reliably over an unstable internet connection — without ever starting over?**

It solves this by breaking every file into small chunks (e.g. 5MB each), uploading them sequentially, and tracking exactly which chunks the server has already received. If your connection drops at chunk 37 of 200 — CloudDrop resumes at chunk 37. Not chunk 1.

No timeouts. No full restarts. Just reliable file delivery — with a full user authentication system, file management dashboard, and real-time progress tracking built on top.

---

## 📸 Screenshots

### 🚀 Upload Dashboard — Live Chunked Upload
> *Active upload session showing real-time progress. Stats panel tracks Uploading, Completed, Failed, and Total counts. Drag-and-drop zone accepts any file type. Recent Uploads queue shows per-file progress bar, status badge, and toast notification confirming successful upload.*

![Upload Dashboard](./assets/upload-dashboard.png)

---

### 📁 My Files — File Management Dashboard
> *Complete file library with Storage Usage card (2.53 MB used of 100 MB limit), file type filter tabs (All / Documents / Images / Videos / Others), live search bar, and per-file Download and Delete icon actions. Each file entry shows type icon, truncated name, size, and upload date.*

![My Files Dashboard](./assets/my-files.png)

---

### 👁️ File Preview — In-App Document Viewer
> *Clicking any file name opens a full in-app preview modal — no download required. PDF viewer with zoom, page navigation, and toolbar controls rendered directly inside CloudDrop. Header shows file name, size, date, and a direct Download button.*

![File Preview](./assets/file-preview.png)

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🧩 | **Chunked Uploads** | Files split into 5MB segments — only failed chunks are retried, never the whole file |
| ⏸️ | **Pause & Resume** | Suspend any upload mid-transfer and resume later — even after a full page refresh |
| 🔁 | **Auto Retry** | Failed chunks are automatically retried without user intervention |
| 📋 | **Upload Queue** | Manage multiple simultaneous uploads with per-file progress bars and status indicators |
| 👁️ | **File Preview** | Click any file to preview PDFs, images, and videos directly in the browser — no download needed |
| 🔍 | **Search & Filter** | Instantly search files by name; filter by type — Documents, Images, Videos, Others |
| 🔃 | **Sort Files** | Sort your library by Date, Name, or Size in either direction |
| 💾 | **Storage Tracker** | Visual storage usage bar with percentage, bytes used, and 100MB limit indicator |
| 🗑️ | **Safe Delete** | Confirmation modal prevents accidental deletions — removes from both storage and database |
| 🔐 | **JWT Auth** | Secure login and registration with token-based session management |
| 🛡️ | **Rate Limiting** | Auth and upload endpoints protected against brute-force and spam attacks |
| 🚫 | **Duplicate Prevention** | Backend checks prevent the same file from being saved multiple times |
| 🔔 | **Toast Notifications** | Non-blocking success, error, and loading feedback for every user action |
| 👤 | **User Profile** | Account details, cloud usage stats, and password management in one place |

---

## 🏗️ Architecture

<a name="architecture"></a>

The application is split into two independent services coordinated through a root workspace:

### Frontend — React + Vite + TypeScript

- **UI/UX:** Dark-themed, premium interface built with Tailwind CSS
- **State Management:** Custom hooks (`useUploadQueue`, `useFileUploader`) manage complex multi-upload state
- **Chunking Logic:** Files are sliced client-side into fixed segments and uploaded sequentially with pause/resume support
- **Auth:** JWT stored in localStorage with automatic injection into every API request header

### Backend — Node.js + Express + MongoDB

- **API:** RESTful endpoints under `/api/auth` and `/api/files`
- **Chunk Processing:** Multer receives individual segments; Node's `fs` module merges them into the final file once all parts arrive
- **Database:** MongoDB Atlas (via Mongoose) stores user profiles, file metadata, upload status, and chunk tracking
- **Security:** JWT middleware protects all upload and file routes; `express-rate-limit` guards auth and upload endpoints

### How a Chunked Upload Works

```
Your 1GB file
      ↓
Split into 200 chunks (5MB each) — client side
      ↓
POST /api/files/chunk  →  chunk 1  ✅  saved to /uploads/temp/
POST /api/files/chunk  →  chunk 2  ✅  saved to /uploads/temp/
POST /api/files/chunk  →  chunk 3  ❌  network drops
      ↓
Resume — retries chunk 3 only
      ↓
All 200 chunks received
      ↓
fs.createWriteStream merges chunks → final file saved
      ↓
Metadata written to MongoDB  ✅
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JSON Web Tokens (JWT), bcrypt |
| **File Handling** | Multer, Node.js `fs` module |
| **UI Libraries** | Lucide React, React Hot Toast |
| **Dev Tools** | Vitest, Storybook, Chromatic |

---

## 📂 Directory Structure

```
clouddrop/
│
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── hooks/                 # useUploadQueue, useFileUploader
│   │   ├── pages/                 # UploadDashboard, MyFiles, Profile
│   │   ├── utils/                 # Chunk slicing, formatting helpers
│   │   └── App.tsx                # Routes + Toaster setup
│   └── vite.config.ts
│
├── server/                        # Express backend
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile, change password
│   │   └── fileController.js      # Upload chunk, merge, fetch, delete, preview
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── rateLimiter.js         # express-rate-limit config
│   ├── models/
│   │   ├── User.js                # Name, email, phone, username, password
│   │   └── File.js                # Filename, size, mimetype, chunks, userId
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   └── fileRoutes.js          # /api/files/*
│   ├── uploads/                   # Merged files stored here
│   └── server.js                  # Entry point, MongoDB connection
│
├── docker-compose.yml             # Local MongoDB alternative
└── README.md
```

---

<a name="getting-started"></a>

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- MongoDB Atlas account (or Docker for local MongoDB)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/clouddrop.git
cd clouddrop

# 2. Install dependencies for both client and server
cd client && npm install
cd ../server && npm install

# 3. Create your environment file in /server
cp .env.example .env
```

Add your credentials to `/server/.env`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

```bash
# 4. Start the backend
cd server && npm run dev

# 5. Start the frontend (new terminal)
cd client && npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

---

## 🎮 Usage

### Uploading a File

1. Register or log in to your CloudDrop account
2. On the **Upload Dashboard**, drag and drop any file — or click to browse
3. Watch the real-time progress bar as chunks are uploaded sequentially
4. Use **Pause** to suspend mid-upload and **Resume** to continue anytime
5. Once complete, a toast notification confirms the upload — the file appears in **My Files**

### Managing Your Files

1. Navigate to **My Files** to see your complete file library
2. Use the **search bar** to find files by name
3. Use **filter tabs** to view only Documents, Images, Videos, or Others
4. Use **Sort By** to order files by date, name, or size
5. Click any **file name** to open a full in-app preview
6. Use the **download icon** to save a file locally
7. Use the **delete icon** to permanently remove a file (with confirmation)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

*Built with React, Node.js, MongoDB, and a lot of chunked requests.*

**CloudDrop — Upload anything. Lose nothing.**

</div>
