import { useState, useCallback, useRef } from 'react';
import { fakeApi } from '../services/fakeApi';
import type { UploadStatus, UploadMode } from '../services/fakeApi';

const CHUNK_SIZE = 1024 * 1024; // 1MB

interface UploadState {
    status: UploadStatus;
    progress: number;
    uploadedChunks: number;
    error: string | null;
    file: File | null;
    checksum: string | null;
    speed: number;
    eta: number | null;
}

export const useFileUploader = (mode: UploadMode = 'normal') => {
    const [state, setState] = useState<UploadState>({
        status: 'idle',
        progress: 0,
        uploadedChunks: 0,
        error: null,
        file: null,
        checksum: null,
        speed: 0,
        eta: null
    });

    const pauseRef = useRef(false);
    const activeUploadId = useRef<number | null>(null);

    const generateChecksum = async (file: File): Promise<string> => {
        const buffer = await file.arrayBuffer();
        const hash = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const saveProgress = (checksum: string, chunks: number) => {
        localStorage.setItem(`upload_${checksum}`, String(chunks));
    };

    const loadProgress = (checksum: string) => {
        const value = localStorage.getItem(`upload_${checksum}`);
        return value ? Number(value) : 0;
    };

    const uploadChunks = useCallback(
        async (file: File, checksum: string, start: number) => {
            const uploadId = Date.now();
            activeUploadId.current = uploadId;
            pauseRef.current = false;

            const total = Math.ceil(file.size / CHUNK_SIZE);

            setState(s => ({
                ...s,
                status: 'uploading',
                error: null
            }));

            for (let i = start; i < total; i++) {
                if (pauseRef.current || activeUploadId.current !== uploadId) return;

                const chunk = file.slice(
                    i * CHUNK_SIZE,
                    Math.min(file.size, (i + 1) * CHUNK_SIZE)
                );

                const res = await fakeApi.uploadChunk(
                    checksum,
                    i,
                    total,
                    chunk,
                    mode
                );

                if (pauseRef.current || activeUploadId.current !== uploadId) return;

                if (!res.success) {
                    setState(s => ({
                        ...s,
                        status: 'error',
                        error: res.message,
                        uploadedChunks: i
                    }));
                    return;
                }

                const uploaded = i + 1;
                const progress = total ? Math.round((uploaded / total) * 100) : 100;

                const elapsedSeconds = (Date.now() - uploadId) / 1000;
                const bytesInSession = (uploaded - start) * CHUNK_SIZE;
                const speed = elapsedSeconds > 0 ? bytesInSession / elapsedSeconds : 0;
                const remainingBytes = Math.max(0, file.size - (uploaded * CHUNK_SIZE));
                const eta = speed > 0 ? Math.ceil(remainingBytes / speed) : null;

                setState(s => ({
                    ...s,
                    uploadedChunks: uploaded,
                    progress,
                    speed,
                    eta
                }));

                saveProgress(checksum, uploaded);
            }

            if (pauseRef.current || activeUploadId.current !== uploadId) return;

            const final = await fakeApi.finishUpload(checksum, checksum);

            if (final.success) {
                localStorage.removeItem(`upload_${checksum}`);
                setState(s => ({
                    ...s,
                    status: 'completed',
                    progress: 100
                }));
            } else {
                setState(s => ({
                    ...s,
                    status: 'error',
                    error: final.message
                }));
            }
        },
        [mode]
    );

    const startUpload = useCallback(async (file: File) => {
        if (state.status === 'uploading') return;

        setState(s => ({
            ...s,
            file,
            status: 'uploading',
            progress: 0,
            error: null
        }));

        const checksum = await generateChecksum(file);
        const saved = loadProgress(checksum);
        const total = Math.ceil(file.size / CHUNK_SIZE);

        setState(s => ({
            ...s,
            checksum,
            uploadedChunks: saved,
            progress: total ? Math.round((saved / total) * 100) : 0
        }));

        uploadChunks(file, checksum, saved);
    }, [state.status, uploadChunks]);

    const pauseUpload = useCallback(() => {
        pauseRef.current = true;
        setState(s => ({ ...s, status: 'paused' }));
    }, []);

    const resumeUpload = useCallback(() => {
        if (!state.file || !state.checksum) return;
        setState(s => ({ ...s, status: 'uploading' }));
        uploadChunks(state.file, state.checksum, state.uploadedChunks);
    }, [state.file, state.checksum, state.uploadedChunks, uploadChunks]);

    const retryUpload = useCallback(() => {
        resumeUpload();
    }, [resumeUpload]);

    const resetUpload = useCallback(() => {
        pauseRef.current = true;
        setState({
            status: 'idle',
            progress: 0,
            uploadedChunks: 0,
            error: null,
            file: null,
            checksum: null,
            speed: 0,
            eta: null
        });
    }, []);

    return {
        ...state,
        startUpload,
        pauseUpload,
        resumeUpload,
        retryUpload,
        resetUpload
    };
};
