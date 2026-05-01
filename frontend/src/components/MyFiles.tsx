import React, { useEffect, useState } from 'react';
import { uploadService } from '../services/uploadService';
import { Download, Trash2, Search, RotateCcw, FileText, Image as ImageIcon, Film, FileBarChart, Archive, File as FileIconGeneric, FolderOpen, ChevronRight, X } from 'lucide-react';

interface MyFilesProps {
  onNavigate?: () => void;
  showToast?: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

export const MyFiles: React.FC<MyFilesProps> = ({ onNavigate, showToast }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
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
    link.href = `http://localhost:5000/api/upload/view/${uploadId}?token=${token}&download=true`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileCategory = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) return 'documents';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) return 'images';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'videos';
    return 'others';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || getFileCategory(file.filename) === filter;
    return matchesSearch && matchesFilter;
  });

  const totalUsed = files.reduce((acc, file) => acc + (file.totalSize || 0), 0);
  const storageLimit = 100 * 1024 * 1024; // 100MB Limit
  const usagePercentage = Math.min((totalUsed / storageLimit) * 100, 100);

  const getUsageColor = (percent: number) => {
    if (percent > 85) return 'bg-red-500';
    if (percent > 60) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (['pdf'].includes(ext || '')) {
      return (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
      );
    }
    
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return (
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
      );
    }
    
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) {
      return (
        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Film className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        </div>
      );
    }
    
    if (['ppt', 'pptx'].includes(ext || '')) {
      return (
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <FileBarChart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
      );
    }
    
    if (['zip', 'rar', '7z', 'gz'].includes(ext || '')) {
      return (
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <Archive className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        </div>
      );
    }

    if (['doc', 'docx', 'txt', 'md'].includes(ext || '')) {
      return (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      );
    }
    
    return (
      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <FileIconGeneric className="w-4 h-4 text-gray-500" />
      </div>
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 p-10 rounded-[2rem] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <RotateCcw className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
          We couldn't reach the server. Please check your internet or restart the backend.
        </p>
        <button 
          onClick={fetchFiles}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all"
        >
          Retry Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* STORAGE CARD - SEPARATE */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Storage Usage</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total space across all uploads</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{usagePercentage.toFixed(1)}%</span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Occupied</p>
            </div>
          </div>
          
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3 shadow-inner">
            <div 
              className={`h-full ${getUsageColor(usagePercentage)} transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.3)]`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              <span className="text-gray-900 dark:text-gray-100 font-bold">{formatSize(totalUsed)}</span> used
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              Limit: {formatSize(storageLimit)}
            </span>
          </div>
        </div>
      )}

      {/* FILES TABLE CARD */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-500" />
              My Uploaded Files
            </h2>
            
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full"
              />
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex flex-wrap gap-2">
            {['all', 'documents', 'images', 'videos', 'others'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${
                  filter === type
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No files uploaded yet!</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
            Upload your first file to see it here. It's safe and fast.
          </p>
          <button 
            onClick={onNavigate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 group"
          >
            Go to Upload Dashboard
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">File Name</th>
                <th className="px-6 py-4 hidden sm:table-cell">Size</th>
                <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 italic text-sm">
                    No files found matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.uploadId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.filename)}
                        <div className="flex flex-col min-w-0">
                          <span 
                            onClick={() => setPreviewFile(file)}
                            className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px] cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-all"
                            title="Click to preview"
                          >
                            {file.filename}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium sm:hidden">
                            {formatSize(file.totalSize)} • {formatDate(file.createdAt)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono hidden sm:table-cell">
                      {formatSize(file.totalSize)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      {formatDate(file.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleDownload(file.uploadId, file.filename)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all hover:scale-110"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(file)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:scale-110"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setFileToDelete(null)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Delete File?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-8">
              Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{fileToDelete.filename}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setPreviewFile(null)}
          />
          
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-5xl h-full max-h-[85vh] relative z-10 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  {getFileIcon(previewFile.filename)}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                    {previewFile.filename}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {formatSize(previewFile.totalSize)} • {new Date(previewFile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownload(previewFile.uploadId, previewFile.filename)}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setPreviewFile(null)}
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body (Preview Content) */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 md:p-8">
              {(() => {
                const token = sessionStorage.getItem('token');
                const url = `http://localhost:5000/api/upload/view/${previewFile.uploadId}?token=${token}`;
                const ext = previewFile.filename.split('.').pop()?.toLowerCase();
                
                if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
                  return <img src={url} alt={previewFile.filename} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />;
                }
                
                if (['mp4', 'webm', 'ogg'].includes(ext)) {
                  return <video src={url} controls className="max-w-full max-h-full rounded-lg shadow-2xl" />;
                }
                
                if (ext === 'pdf') {
                  return <iframe src={url} className="w-full h-full rounded-lg border-0 shadow-2xl bg-white" title="PDF Preview" />;
                }

                if (['txt', 'js', 'ts', 'tsx', 'json', 'css', 'html', 'md'].includes(ext)) {
                  return (
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl p-6 overflow-auto shadow-2xl border border-gray-100 dark:border-gray-800 font-mono text-sm text-gray-700 dark:text-gray-300">
                      <iframe src={url} className="w-full h-full border-0" />
                    </div>
                  );
                }

                return (
                  <div className="text-center p-10">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold mb-2">No Preview Available</p>
                    <p className="text-gray-500 text-sm mb-6">This file type cannot be previewed directly in the browser.</p>
                    <button 
                      onClick={() => handleDownload(previewFile.uploadId, previewFile.filename)}
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                    >
                      Download to View
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
