import React, { useEffect, useState } from 'react';
import { uploadService } from '../services/uploadService';
import { Download, Trash2, RotateCcw, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

interface MyFilesProps {
  showToast?: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

export const MyFiles: React.FC<MyFilesProps> = ({ showToast }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileToDelete, setFileToDelete] = useState<any>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await uploadService.getUserFiles();
      setFiles(data);
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDeleteClick = (file: any) => {
    setFileToDelete(file);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      await uploadService.deleteFile(fileToDelete.uploadId);
      setFiles(files.filter(f => f.uploadId !== fileToDelete.uploadId));
      setFileToDelete(null);
      showToast?.('File deleted successfully', 'success');
    } catch (err) {
      showToast?.('Failed to delete file', 'error');
    }
  };

  const handleDownload = (uploadId: string, filename: string) => {
    const token = sessionStorage.getItem('token');
    const link = document.createElement('a');
    link.href = `${API}/api/upload/view/${uploadId}?token=${token}&download=true`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-pulse">
        <RotateCcw className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p className="font-bold">Fetching your files...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">My Files</h2>

        {files.length === 0 ? (
          <p>No files uploaded</p>
        ) : (
          <table className="w-full">
            <tbody>
              {files.map((file) => (
                <tr key={file.uploadId}>
                  <td
                    onClick={() => setPreviewFile(file)}
                    className="cursor-pointer text-blue-600"
                  >
                    {file.filename}
                  </td>

                  <td>
                    <button onClick={() => handleDownload(file.uploadId, file.filename)}>
                      <Download />
                    </button>
                  </td>

                  <td>
                    <button onClick={() => handleDeleteClick(file)}>
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to delete this file?</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-white w-[80%] h-[80%] p-4 relative">
            <button onClick={() => setPreviewFile(null)} className="absolute top-2 right-2">
              <X />
            </button>

            {(() => {
              const token = sessionStorage.getItem('token');
              const url = `${API}/api/upload/view/${previewFile.uploadId}?token=${token}`;
              const ext = previewFile.filename.split('.').pop()?.toLowerCase();

              if (['jpg', 'jpeg', 'png'].includes(ext)) {
                return <img src={url} className="max-w-full max-h-full" />;
              }

              if (ext === 'pdf') {
                return <iframe src={url} className="w-full h-full" />;
              }

              return <p>No preview available</p>;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};