import React from 'react';
import type { UploadStatus } from '../services/fakeApi';

interface UploadControlsProps {
    status: UploadStatus;
    onPause: () => void;
    onResume: () => void;
    onRetry: () => void;
    onReset: () => void;
}

export const UploadControls: React.FC<UploadControlsProps> = ({
    status,
    onPause,
    onResume,
    onRetry,
    onReset
}) => {
    if (status === 'idle') return null;

    return (
        <>
            {/* Screen reader announcements */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
            >
                Upload status: {status}
            </div>

            <div className="flex gap-3 mt-4">
                {status === 'uploading' && (
                    <button
                        type="button"
                        onClick={onPause}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors focus:ring-4 focus:ring-yellow-300 focus:outline-none"
                        aria-label="Pause upload"
                    >
                        Pause
                    </button>
                )}

                {status === 'paused' && (
                    <button
                        type="button"
                        onClick={onResume}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none"
                        aria-label="Resume upload"
                    >
                        Resume
                    </button>
                )}

                {status === 'error' && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors focus:ring-4 focus:ring-red-300 focus:outline-none"
                        aria-label="Retry failed upload"
                    >
                        Retry
                    </button>
                )}

                {(status === 'paused' || status === 'error') && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none"
                        aria-label="Cancel and reset upload"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </>
    );
};
