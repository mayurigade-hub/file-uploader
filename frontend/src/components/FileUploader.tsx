import { useEffect, useRef, useState } from 'react';
import { useFileUploader } from '../hooks/useFileUploader';
import { ProgressBar } from './ProgressBar';
import { UploadControls } from './UploadControls';
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
        speed,
        startUpload,
        pauseUpload,
        resumeUpload,
        uploadedChunks,
        totalChunks,
    } = useFileUploader(mode);


    const hasStarted = useRef(false);

    if (!file) return null;

    // Use the internal status for real-time updates, but fallback to prop status
    const displayStatus = status !== 'idle' ? status : (initialStatus || queueStatus || 'waiting');
    const displayProgress = progress;

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

    const retryCount = useRef(0);
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        retryCount.current += 1;
        await resumeUpload();
        setTimeout(() => setIsRetrying(false), 500);
    };

    const StatusLabel = ({ status, isRetrying, current, total }: { status: UploadStatus | 'waiting', isRetrying?: boolean, current: number, total: number }) => {
        const colors: Record<string, string> = {
            waiting: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
            uploading: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            paused: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            error: 'bg-red-500 text-white shadow-lg shadow-red-500/20',
            completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            idle: 'bg-gray-100 text-gray-600'
        };

        let label = status.toUpperCase();
        if (isRetrying) {
            label = `RETRYING (${retryCount.current}/5)`;
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-lg shadow-amber-400/20 animate-pulse">
                    {label}
                </span>
            );
        }

        if (status === 'error') {
            label = `FAILED (Chunk ${current}/${total || '?'})`;
        }

        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[status] || colors.idle}`}>
                {label}
            </span>
        );
    };

    const handlePause = () => {
        pauseUpload();
    };

    const handleResume = () => {
        resumeUpload();
    };

    return (
        <div className={`p-5 rounded-[2rem] border transition-all duration-500 shadow-sm hover:shadow-xl ${displayStatus === 'error'
            ? 'bg-gray-50 dark:bg-gray-900/60 border-red-200 dark:border-red-900/50 scale-[1.01]'
            : displayStatus === 'completed'
                ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 border-l-4 border-l-emerald-500'
                : isRetrying
                    ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30 border-l-4 border-l-amber-500'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
            }`}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 overflow-hidden">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${displayStatus === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                            displayStatus === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                                isRetrying ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                                    'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                            }`}>
                            {displayStatus === 'completed' ? (
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            ) : displayStatus === 'error' ? (
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            ) : (
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <p className="text-base font-black text-gray-900 dark:text-white truncate tracking-tight">{file?.name ?? 'Unknown file'}</p>
                                <StatusLabel status={displayStatus} isRetrying={isRetrying} current={uploadedChunks} total={totalChunks} />
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB</p>
                                {isRetrying && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></div>
                                        Manual Recovery Active
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {(displayStatus === 'uploading' || isRetrying) && (
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-blue-600 dark:text-blue-400">{disableAutoStart ? '2.4 MB/s' : formatSpeed(speed)}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Current Speed</p>
                        </div>
                    )}
                </div>

                <div className="relative pt-2">
                    <ProgressBar progress={displayProgress} status={displayStatus === 'error' ? 'error' : isRetrying ? 'paused' : displayStatus} />
                    {displayStatus === 'error' && (
                        <div className="absolute top-0 right-0 -mt-4 text-[10px] font-black text-red-500 uppercase">
                            Halted at {displayProgress}%
                        </div>
                    )}
                </div>

                {displayStatus === 'error' && (
                    <div className="p-4 bg-red-500/5 dark:bg-red-500/10 border-l-4 border-red-500 rounded-xl overflow-hidden">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide">Network Interruption Detected</p>
                                <p className="text-[11px] font-bold text-red-500/80 dark:text-red-400/60 mt-0.5 leading-relaxed">
                                    The upload was interrupted during Chunk #{uploadedChunks + 1}. You can resume exactly where you left off.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex-1">
                        {displayStatus === 'error' ? (
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-red-600/30 active:scale-95 disabled:opacity-50 group"
                            >
                                <svg className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${isRetrying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {isRetrying ? 'RECOVERING...' : 'RETRY FROM CHUNK'}
                            </button>
                        ) : displayStatus === 'completed' ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    <span>Sync Verified</span>
                                </div>
                            </div>
                        ) : (
                            <UploadControls
                                status={displayStatus}
                                onPause={handlePause}
                                onResume={handleResume}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRemove}
                            className={`
                                text-[10px] font-black px-6 py-2.5 rounded-2xl transition-all active:scale-95 tracking-[0.1em] uppercase
                                ${displayStatus === 'completed'
                                    ? 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                    : 'bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40'
                                }
                            `}
                        >
                            {displayStatus === 'completed' ? 'DISMISS' : 'CANCEL'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
