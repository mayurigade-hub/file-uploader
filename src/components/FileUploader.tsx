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
    command?: { type: 'pause' | 'resume' | 'none'; ts: number };
    initialStatus?: UploadStatus;
    disableAutoStart?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    file,
    status: queueStatus,
    onStatusChange,
    onRemove,
    mode = 'normal',
    command,
    initialStatus,
    disableAutoStart = false
}) => {
    const {
        status,
        progress,
        error,
        speed,
        startUpload,
        pauseUpload,
        resumeUpload,
        retryUpload,
        resetUpload
    } = useFileUploader(mode);

    const [isDone, setIsDone] = useState(false);
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

    useEffect(() => {
        if (!disableAutoStart && status !== queueStatus) {
            onStatusChange?.(status, progress);
        }
    }, [status, progress, queueStatus, onStatusChange, disableAutoStart]);

    useEffect(() => {
        if (disableAutoStart) return;
        if (!command || command.type === 'none' || status === 'completed' || isDone) return;
        if (command.type === 'pause' && status === 'uploading') {
            pauseUpload();
        } else if (command.type === 'resume' && (status === 'paused' || status === 'error')) {
            resumeUpload();
        }
    }, [command, status, isDone, pauseUpload, resumeUpload, disableAutoStart]);

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

    const handleStorybookRetry = () => {
        if (disableAutoStart) {
            setStorybookStatus('uploading');
        } else {
            retryUpload();
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
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
                    {displayStatus === 'uploading' && !isDone && (
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                            <p>{disableAutoStart ? '2.4 MB/s' : formatSpeed(speed)}</p>
                        </div>
                    )}
                </div>

                {queueStatus !== 'waiting' && <ProgressBar progress={displayProgress} status={displayStatus} />}
                {(error || (disableAutoStart && storybookStatus === 'error')) && <ErrorMessage message={error || 'Simulated upload failure at chunk #3'} />}

                <div className="flex items-center justify-between">
                    {!isDone ? (
                        <UploadControls
                            status={displayStatus}
                            onPause={handleStorybookPause}
                            onResume={handleStorybookResume}
                            onRetry={handleStorybookRetry}
                            onReset={resetUpload}
                        />
                    ) : (
                        <div className="text-xs text-gray-400 italic font-medium">Upload complete</div>
                    )}

                    <div className="flex items-center gap-2">
                        {displayStatus === 'completed' && !isDone && (
                            <button
                                onClick={() => setIsDone(true)}
                                className="text-xs font-bold text-green-600 hover:text-green-700 dark:text-green-400 px-4 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 transition-all shadow-sm"
                            >
                                DONE
                            </button>
                        )}
                        <button
                            onClick={onRemove}
                            className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 px-4 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 transition-all shadow-sm"
                        >
                            REMOVE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
