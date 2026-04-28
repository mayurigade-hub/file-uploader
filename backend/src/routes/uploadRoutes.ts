import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import File from '../models/File';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configuration
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const TEMP_DIR = path.join(__dirname, '../../temp');

// Ensure directories exist
[UPLOADS_DIR, TEMP_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer storage for memory (to handle chunks)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize a new upload session
router.post('/init', async (req, res) => {
  try {
    const { filename, totalSize, totalChunks } = req.body;
    
    if (!filename || !totalSize || !totalChunks) {
      return res.status(400).json({ error: 'Missing required file metadata.' });
    }

    // Check for duplicates
    const existingFile = await File.findOne({
      userId: (req as any).user.id,
      filename,
      totalSize,
      status: 'completed'
    });

    if (existingFile) {
      return res.status(400).json({ error: 'File already uploaded!' });
    }

    const uploadId = uuidv4();
    
    const newFile = new File({
      filename,
      totalSize,
      totalChunks,
      uploadId,
      status: 'pending',
      uploadedChunks: [],
      userId: (req as any).user.id,
    });

    await newFile.save();

    // Create temp directory for this upload
    const fileTempDir = path.join(TEMP_DIR, uploadId);
    if (!fs.existsSync(fileTempDir)) {
      fs.mkdirSync(fileTempDir, { recursive: true });
    }

    res.status(200).json({ 
      uploadId, 
      message: 'Upload initialized successfully.',
      existingChunks: [] 
    });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ error: 'Failed to initialize upload.' });
  }
});

// Upload a chunk
router.post('/:uploadId/chunk', upload.single('chunk'), async (req, res) => {
  try {
    const { uploadId } = req.params;
    const { chunkIndex } = req.body;
    const chunkFile = req.file;

    if (!chunkFile) {
      return res.status(400).json({ error: 'No chunk data provided.' });
    }

    const fileRecord = await File.findOne({ uploadId });
    if (!fileRecord) {
      return res.status(404).json({ error: 'Upload session not found.' });
    }

    // Save chunk to temp directory
    const chunkPath = path.join(TEMP_DIR, uploadId, `chunk-${chunkIndex}`);
    fs.writeFileSync(chunkPath, chunkFile.buffer);

    // Update DB record
    if (!fileRecord.uploadedChunks.includes(Number(chunkIndex))) {
      fileRecord.uploadedChunks.push(Number(chunkIndex));
      fileRecord.status = 'uploading';
      await fileRecord.save();
    }

    res.status(200).json({ 
      message: `Chunk ${chunkIndex} received successfully.`,
      uploadedChunks: fileRecord.uploadedChunks
    });
  } catch (error) {
    console.error('Chunk upload error:', error);
    res.status(500).json({ error: 'Failed to upload chunk.' });
  }
});

// Complete upload (merge chunks)
router.post('/:uploadId/complete', async (req, res) => {
  try {
    const { uploadId } = req.params;
    
    const fileRecord = await File.findOne({ uploadId });
    if (!fileRecord) {
      return res.status(404).json({ error: 'Upload session not found.' });
    }

    if (fileRecord.uploadedChunks.length !== fileRecord.totalChunks) {
      return res.status(400).json({ error: 'Not all chunks have been uploaded.' });
    }

    const finalPath = path.join(UPLOADS_DIR, `${uploadId}-${fileRecord.filename}`);
    const writeStream = fs.createWriteStream(finalPath);

    for (let i = 0; i < fileRecord.totalChunks; i++) {
      const chunkPath = path.join(TEMP_DIR, uploadId, `chunk-${i}`);
      const chunkData = fs.readFileSync(chunkPath);
      writeStream.write(chunkData);
      // Delete chunk after merging
      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    // Clean up temp directory
    fs.rmdirSync(path.join(TEMP_DIR, uploadId));

    fileRecord.status = 'completed';
    fileRecord.filePath = finalPath;
    await fileRecord.save();

    res.status(200).json({ 
      message: 'File upload completed and merged successfully.',
      fileUrl: `/uploads/${path.basename(finalPath)}` 
    });
  } catch (error) {
    console.error('Completion error:', error);
    res.status(500).json({ error: 'Failed to complete file upload.' });
  }
});

// Get all files for the current user
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const files = await File.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    console.error('Fetch files error:', error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
});

// View/Stream a file
router.get('/view/:uploadId', async (req, res) => {
  try {
    const { uploadId } = req.params;
    const fileRecord = await File.findOne({ uploadId });

    if (!fileRecord || !fileRecord.filePath) {
      return res.status(404).json({ error: 'File not found.' });
    }

    if (!fs.existsSync(fileRecord.filePath)) {
      return res.status(404).json({ error: 'Physical file missing on server.' });
    }

    // If download flag is present, force download, otherwise stream for view
    if (req.query.download === 'true') {
      res.download(fileRecord.filePath, fileRecord.filename);
    } else {
      res.sendFile(fileRecord.filePath);
    }
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ error: 'Failed to stream file.' });
  }
});

// Delete a file
router.delete('/:uploadId', async (req, res) => {
  try {
    const { uploadId } = req.params;
    const userId = (req as any).user.id;

    const fileRecord = await File.findOne({ uploadId, userId });
    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Delete physical file if it exists
    if (fileRecord.filePath && fs.existsSync(fileRecord.filePath)) {
      fs.unlinkSync(fileRecord.filePath);
    }

    // Delete from DB
    await File.deleteOne({ uploadId });

    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file.' });
  }
});

export default router;
