import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateJWT } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', authenticateJWT, uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // For any other request, send back the index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running correctly.' });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/file-uploader';

console.log(`📡 [${new Date().toLocaleTimeString()}] Starting connection to MongoDB...`);
// Log the URI but hide credentials if it's an atlas link
const maskedUri = MONGO_URI.includes('@') 
  ? MONGO_URI.replace(/\/\/.*@/, '//****:****@') 
  : MONGO_URI;
console.log(`🔗 MongoDB URI: ${maskedUri}`);

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Warning: Backend is running but database connection failed.');
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
