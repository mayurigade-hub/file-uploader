import axios from 'axios';
import { authService } from './authService';

const API = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = `${API}/api/upload`;

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
});

// Helper to get headers
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export type UploadStatus =
  | 'idle'
  | 'waiting'
  | 'uploading'
  | 'paused'
  | 'error'
  | 'completed';

export interface InitResponse {
  uploadId: string;
  message: string;
  existingChunks: number[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
  uploadedChunks?: number[];
  errorCode?: string;
  fileUrl?: string;
}

export const uploadService = {
  initUpload: async (
    filename: string,
    totalSize: number,
    totalChunks: number
  ): Promise<InitResponse> => {
    const response = await api.post(
      '/init',
      { filename, totalSize, totalChunks },
      getAuthHeaders()
    );
    return response.data;
  },

  uploadChunk: async (
    uploadId: string,
    chunkIndex: number,
    chunk: Blob,
    onProgress?: (p: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex.toString());

    try {
      const response = await api.post(`/${uploadId}/chunk`, formData, {
        ...getAuthHeaders(),
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress?.(percent);
          }
        },
      });
      return { success: true, ...response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Chunk upload failed',
        errorCode: 'CHUNK_UPLOAD_FAILED',
      };
    }
  },

  completeUpload: async (uploadId: string): Promise<UploadResponse> => {
    try {
      const response = await api.post(`/${uploadId}/complete`, {}, getAuthHeaders());
      return { success: true, ...response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to complete upload',
        errorCode: 'COMPLETION_FAILED',
      };
    }
  },

  getUserFiles: async (): Promise<any[]> => {
    const response = await api.get('', getAuthHeaders());
    return response.data;
  },

  deleteFile: async (uploadId: string): Promise<void> => {
    await api.delete(`/${uploadId}`, getAuthHeaders());
  },
};
