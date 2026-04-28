import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  totalSize: number;
  totalChunks: number;
  uploadId: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  uploadedChunks: number[];
  filePath?: string;
  userId?: string; // For future JWT integration
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    filename: { type: String, required: true },
    totalSize: { type: Number, required: true },
    totalChunks: { type: Number, required: true },
    uploadId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'uploading', 'completed', 'failed'],
      default: 'pending',
    },
    uploadedChunks: { type: [Number], default: [] },
    filePath: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IFile>('File', FileSchema);
