import { useRef, useState } from 'react';

interface DropZoneProps {
    onFilesSelect: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesSelect(files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onFilesSelect(files);
        }
        // Reset input to allow selecting the same file again
        e.target.value = '';
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Click to upload or drag and drop files"
            className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all duration-200 ease-in-out
                ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
                focus:outline-none focus:ring-4 focus:ring-blue-500/20
            `}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                aria-hidden="true"
            />

            <div className="flex flex-col items-center gap-3">
                <svg
                    className={`w-12 h-12 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>

                <div>
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                        Click to upload <span className="text-gray-500 dark:text-gray-400">or drag and drop</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Any file, unlimited
                    </p>
                </div>
            </div>
        </div>
    );
};
