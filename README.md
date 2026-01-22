# Robust Chunked File Uploader

A production-style file uploader built with **React, TypeScript, and Tailwind CSS**.  
Supports chunked uploads, pause/resume, retry on failure, and upload persistence.

---

## 🚀 Project Overview

This project demonstrates how to upload large files reliably by splitting them into small chunks.  
It simulates real-world network conditions and provides full control to the user.

Users can:
- Pause uploads
- Resume from the exact chunk
- Retry after failures
- Continue uploads even after page refresh

---

## ✨ Features

- **Chunked Upload**
  - Files are split into **1MB chunks**
  - Uploaded sequentially for reliability

- **Pause & Resume**
  - Pause at any time
  - Resume from the exact same chunk

- **Retry on Failure**
  - Backend intentionally fails at **chunk #3**
  - Allows testing real retry logic

- **Persistent Upload**
  - Progress saved in `localStorage`
  - Uses file **SHA-256 checksum**
  - Upload resumes even after page refresh

- **Accessibility**
  - Keyboard navigation
  - Screen reader support
  - Proper ARIA roles

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js **v18+**
- npm **v9+**

### Install Dependencies
```bash
npm install
