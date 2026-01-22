import React, { useEffect, useRef } from 'react';

interface ErrorMessageProps {
    message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    const errorRef = useRef<HTMLDivElement>(null);

    // Auto-focus when error appears (accessibility)
    useEffect(() => {
        if (message && errorRef.current) {
            errorRef.current.focus();
        }
    }, [message]);

    if (!message) return null;

    return (
        <div
            ref={errorRef}
            role="alert"
            tabIndex={-1}
            aria-live="assertive"
            className="
        mt-4 p-4 text-sm text-red-800 
        rounded-lg bg-red-50
        focus:outline-none 
        focus:ring-2 focus:ring-red-500
      "
        >
            <span className="font-bold">Error:</span> {message}
        </div>
    );
};
