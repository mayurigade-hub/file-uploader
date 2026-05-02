const mongoose = require('mongoose');
require('dotenv').config();

const fileSchema = new mongoose.Schema({
  uploadId: String,
  filename: String,
  filePath: String,
  totalSize: Number,
  totalChunks: Number,
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const files = await File.find({});
  for (const f of files) {
    if (f.filename.includes('SingleThread')) {
      console.log('ID:', f.uploadId);
      console.log('Filename:', f.filename);
      console.log('Stored Path:', f.filePath);
      const path = require('path');
      const expected = path.join(__dirname, 'uploads', `${f.uploadId}-${f.filename}`);
      console.log('Expected Path:', expected);
      console.log('Exists on disk?', require('fs').existsSync(expected));
      console.log('---');
    }
  }
  process.exit(0);
}

test();
