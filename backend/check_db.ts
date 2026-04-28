import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/file-uploader';

console.log('--- DIAGNOSTIC START ---');
console.log('Testing MongoDB Connection...');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ DATABASE: Connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ DATABASE: Connection failed!');
    console.error('Error:', err.message);
    process.exit(1);
  });
