<div align="center" style="background-color:#0d1117; padding:40px; border-radius:12px;">

# File Uploader  
### Chunked Multi-File Upload System  
**React • Vite • Storybook • Chromatic**

</div>

---

## Overview

A modern **multi-file uploader** built with **React + Vite**, supporting **chunked uploads**, **pause/resume**, **retry on failure**, and **queue management**.

The project includes a **fully documented Storybook**, deployed via **Chromatic**, showcasing all UI states as required for the **Uzence Internship Assignment**.

---

## Features

- Chunked file uploads (large file support)
- Pause & resume uploads
- Retry on failure
- Upload queue management
- Progress persistence
- Dark UI design
- Fully documented Storybook

---

## Storybook Coverage

The Storybook demonstrates the following states:

- Uploading
- Paused
- Waiting
- Error
- Completed
- Multiple Files Queue

Each state is isolated, interactive, and visually documented.

---

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Storybook
- Chromatic
- Vitest

---

## Local Setup

```bash
npm install
npm run dev
npm run storybook
```

---

## 🚀 Next Phase: Full-Stack MERN Architecture

In the next phase, this project will evolve into a complete end-to-end system integrating a real backend and production-grade architecture, serving as a core feature inside a larger MERN application similar to Google Drive:

- **Node.js + Express API:** To handle authenticated upload requests and chunk processing.
- **Signed Upload URLs:** For secure, scalable, and direct-to-storage file handling.
- **MongoDB:** To store file metadata, upload status, and user associations.
- **JWT Authentication:** To enable user-specific uploads, access control, and secure endpoints.
- **Real Backend Service:** Replacing the current simulated fake API with robust backend logic.

