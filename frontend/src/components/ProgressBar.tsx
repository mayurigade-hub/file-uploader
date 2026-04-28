import React from 'react';
import type { UploadStatus } from '../services/fakeApi';

interface ProgressBarProps {
    progress: number;
    status: UploadStatus;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
    const isError = status === 'error';
    const isCompleted = status === 'completed';

    const label = isCompleted
        ? 'Upload complete'
        : isError
            ? 'Upload failed'
            : `Uploading... ${progress}%`;

    return (
        <div className="w-full">
            <div className="flex justify-between mb-1 items-center">
                <span
                    id="progress-label"
                    className={`text-sm font-medium ${isError
                            ? 'text-red-600'
                            : isCompleted
                                ? 'text-green-600'
                                : 'text-blue-700'
                        }`}
                >
                    {label}
                </span>
            </div>

            <div
                className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
                role="progressbar"
                aria-labelledby="progress-label"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className={`h-3 rounded-full transition-all duration-300 ease-out ${isError
                            ? 'bg-red-500'
                            : isCompleted
                                ? 'bg-green-500'
                                : 'bg-blue-600'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
