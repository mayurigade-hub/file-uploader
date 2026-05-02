const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const fileSchema = new mongoose.Schema({
  uploadId: String,
  filename: String,
  filePath: String,
  userId: mongoose.Schema.Types.ObjectId,
});

const File = mongoose.model('File', fileSchema);

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const files = await File.find({});
    console.log(`Found ${files.length} total records in database.`);
    
    let deletedCount = 0;
    const UPLOADS_DIR = path.join(__dirname, 'uploads');

    for (const file of files) {
      const actualPath = path.join(UPLOADS_DIR, `${file.uploadId}-${file.filename}`);
      
      if (!fs.existsSync(actualPath)) {
        console.log(`[MISSING] ${file.filename} (ID: ${file.uploadId}) - Removing from DB...`);
        await File.deleteOne({ _id: file._id });
        deletedCount++;
      }
    }

    console.log('------------------------------------------');
    console.log(`Cleanup complete! Removed ${deletedCount} broken records.`);
    console.log('Your "My Files" dashboard should now be clean.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

cleanup();
