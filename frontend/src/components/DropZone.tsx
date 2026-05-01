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
                relative group overflow-hidden rounded-[2.5rem] p-10 text-center cursor-pointer
                transition-all duration-500 ease-in-out border-2 shadow-sm hover:shadow-xl
                ${isDragging
                    ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20 scale-[1.02] shadow-sky-500/20'
                    : 'border-dashed border-gray-300 dark:border-gray-700 hover:border-sky-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
                focus:outline-none focus:ring-4 focus:ring-sky-500/20
            `}
        >
            {/* Background glowing orb effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-sky-400/10 to-blue-500/10 dark:from-sky-500/5 dark:to-blue-600/5 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 group-hover:opacity-100 opacity-50 transition-all duration-700"></div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Animated rings around icon */}
                    <div className={`absolute inset-0 rounded-full border-2 border-sky-400 transition-all duration-700 ${isDragging ? 'scale-[1.8] opacity-0' : 'scale-[1.2] opacity-0 group-hover:scale-[1.6] group-hover:opacity-30'}`}></div>
                    <div className={`absolute inset-0 rounded-full border-2 border-blue-500 transition-all duration-1000 ${isDragging ? 'scale-[2.2] opacity-0' : 'scale-[1.5] opacity-0 group-hover:scale-[2] group-hover:opacity-20'}`}></div>
                    
                    {/* Main icon container */}
                    <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-lg ${
                        isDragging 
                            ? 'bg-gradient-to-tr from-sky-400 to-blue-600 shadow-sky-500/50 scale-110 -translate-y-2' 
                            : 'bg-white dark:bg-gray-800 group-hover:scale-110 group-hover:-translate-y-2 group-hover:bg-gradient-to-tr group-hover:from-sky-400 group-hover:to-blue-600'
                    }`}>
                        <svg
                            className={`w-10 h-10 transition-colors duration-500 ${
                                isDragging ? 'text-white' : 'text-sky-500 group-hover:text-white'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-blue-600 transition-colors">
                        Click to upload <span className="font-semibold text-gray-400 dark:text-gray-500">or drag & drop</span>
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                        Any file type, unlimited size
                    </p>
                </div>
            </div>
        </div>
    );
};
