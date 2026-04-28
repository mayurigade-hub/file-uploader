import React from 'react';
import type { UploadStatus } from '../services/fakeApi';

interface UploadControlsProps {
    status: UploadStatus;
    onPause: () => void;
    onResume: () => void;
}

export const UploadControls: React.FC<UploadControlsProps> = ({
    status,
    onPause,
    onResume
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
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors focus:ring-4 focus:ring-yellow-300 focus:outline-none font-bold text-xs"
                        aria-label="Pause upload"
                    >
                        PAUSE
                    </button>
                )}

                {(status === 'paused' || status === 'error') && (
                    <button
                        type="button"
                        onClick={onResume}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none font-bold text-xs"
                        aria-label="Resume upload"
                    >
                        RESUME
                    </button>
                )}
            </div>
        </>
    );
};
