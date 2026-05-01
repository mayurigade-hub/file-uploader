import { useEffect, useRef, useState } from 'react';
import { useFileUploader } from '../hooks/useFileUploader';
import { ProgressBar } from './ProgressBar';
import { UploadControls } from './UploadControls';
import { ErrorMessage } from './ErrorMessage';
import type { UploadMode, UploadStatus } from '../services/fakeApi';

interface FileUploaderProps {
    id: string;
    file?: File;
    status: UploadStatus | 'waiting';
    onStatusChange?: (status: UploadStatus | 'waiting', progress: number) => void;
    onRemove?: () => void;
    mode?: UploadMode;
    initialStatus?: UploadStatus;
    disableAutoStart?: boolean;
    showToast?: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    file,
    status: queueStatus,
    onStatusChange,
    onRemove,
    mode = 'normal',
    initialStatus,
    disableAutoStart = false,
    showToast
}) => {
    const {
        status,
        progress,
        error,
        speed,
        startUpload,
        pauseUpload,
        resumeUpload
    } = useFileUploader(mode);


    const hasStarted = useRef(false);
    const [storybookStatus, setStorybookStatus] = useState<UploadStatus | null>(initialStatus || null);

    if (!file) {
        return null;
    }

    const displayStatus = disableAutoStart && storybookStatus ? storybookStatus : (status !== 'idle' ? status : queueStatus);
    const displayProgress = disableAutoStart && storybookStatus === 'completed' ? 100 :
        disableAutoStart && storybookStatus === 'uploading' ? 45 :
            disableAutoStart && storybookStatus === 'paused' ? 60 : progress;

    useEffect(() => {
        if (!disableAutoStart && file && status === 'idle' && !hasStarted.current) {
            hasStarted.current = true;
            startUpload(file);
        }
    }, [file, status, startUpload, disableAutoStart]);

    const toastShownRef = useRef(false);

    useEffect(() => {
        if (!disableAutoStart && status !== queueStatus) {
            onStatusChange?.(status, progress);
        }
        
        // Handle Toast Notifications - Only show once per status change
        if (!toastShownRef.current) {
            if (status === 'completed') {
                showToast?.(`${file?.name || 'File'} uploaded successfully!`, 'success');
                toastShownRef.current = true;
            } else if (status === 'error') {
                showToast?.(`${file?.name || 'File'} upload failed.`, 'error');
                toastShownRef.current = true;
            }
        }
    }, [status, progress, queueStatus, onStatusChange, disableAutoStart, file, showToast]);



    const formatSpeed = (bytesPerSec: number) => {
        if (bytesPerSec === 0) return '0 B/s';
        const k = 1024;
        const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
        const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
        return parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const StatusLabel = ({ status }: { status: UploadStatus | 'waiting' }) => {
        const colors: Record<string, string> = {
            waiting: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
            uploading: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            paused: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            idle: 'bg-gray-100 text-gray-600'
        };

        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || colors.idle}`}>
                {status}
            </span>
        );
    };

    const handleStorybookPause = () => {
        if (disableAutoStart) {
            setStorybookStatus('paused');
        } else {
            pauseUpload();
        }
    };

    const handleStorybookResume = () => {
        if (disableAutoStart) {
            setStorybookStatus('uploading');
        } else {
            resumeUpload();
        }
    };





    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-100 dark:hover:border-blue-900/50 group">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <svg className="w-5 h-5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{file?.name ?? 'Unknown file'}</p>
                                <StatusLabel status={displayStatus} />
                            </div>
                            <p className="text-xs text-gray-400">{((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    {displayStatus === 'uploading' && (
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                            <p>{disableAutoStart ? '2.4 MB/s' : formatSpeed(speed)}</p>
                        </div>
                    )}
                </div>

                {queueStatus !== 'waiting' && <ProgressBar progress={displayProgress} status={displayStatus} />}
                {(error || (disableAutoStart && storybookStatus === 'error')) && <ErrorMessage message={error || 'Simulated upload failure at chunk #3'} />}

                <div className="flex items-center justify-between">
                    {displayStatus !== 'completed' ? (
                        <UploadControls
                            status={displayStatus}
                            onPause={handleStorybookPause}
                            onResume={handleStorybookResume}
                        />
                    ) : displayStatus === 'completed' ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Completed</span>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 italic font-medium">Upload complete</div>
                    )}

                    <div className="flex items-center gap-2">
                        {displayStatus === 'completed' ? (
                            <button
                                onClick={onRemove}
                                className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 px-6 py-2 rounded-lg transition-all shadow-md shadow-green-500/20"
                            >
                                DONE
                            </button>
                        ) : (
                            <button
                                onClick={onRemove}
                                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 px-4 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 transition-all shadow-sm"
                            >
                                REMOVE
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
