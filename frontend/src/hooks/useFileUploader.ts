import { useState, useCallback, useRef } from 'react';
import { uploadService, type UploadStatus } from '../services/uploadService';
import type { UploadMode } from '../services/fakeApi'; // Keep for now as it's used in components

const CHUNK_SIZE = 1024 * 1024; // 1MB

interface UploadState {
    status: UploadStatus;
    progress: number;
    uploadedChunks: number;
    error: string | null;
    file: File | null;
    uploadId: string | null;
    speed: number;
    eta: number | null;
    fileUrl: string | null;
    totalChunks: number;
}

export const useFileUploader = (_mode: UploadMode = 'normal') => {
    const [state, setState] = useState<UploadState>({
        status: 'idle',
        progress: 0,
        uploadedChunks: 0,
        error: null,
        file: null,
        uploadId: null,
        speed: 0,
        eta: null,
        fileUrl: null,
        totalChunks: 0
    });

    const pauseRef = useRef(false);
    const activeUploadIdRef = useRef<string | null>(null);
    const isLoopRunningRef = useRef(false);

    const uploadChunks = useCallback(
        async (file: File, uploadId: string, startChunk: number) => {
            if (isLoopRunningRef.current && activeUploadIdRef.current === uploadId) {
                pauseRef.current = false;
                return;
            }

            activeUploadIdRef.current = uploadId;
            pauseRef.current = false;
            isLoopRunningRef.current = true;

            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            const startTime = Date.now();
            const CONCURRENT = 2;

            setState(s => ({
                ...s,
                status: 'uploading',
                error: null,
                totalChunks
            }));

            try {
                for (let i = startChunk; i < totalChunks; i += CONCURRENT) {
                    // Step C: Respect pause (Wait while paused)
                    while (pauseRef.current) {
                        if (activeUploadIdRef.current !== uploadId) return;
                        await new Promise(res => setTimeout(res, 100));
                    }

                    if (activeUploadIdRef.current !== uploadId) return;

                    const batchIndices = [];
                    for (let j = 0; j < CONCURRENT && (i + j) < totalChunks; j++) {
                        batchIndices.push(i + j);
                    }

                    // Step A: Limit concurrency
                    await Promise.all(batchIndices.map(async (index) => {
                        if (activeUploadIdRef.current !== uploadId) return;

                        const chunk = file.slice(
                            index * CHUNK_SIZE,
                            Math.min(file.size, (index + 1) * CHUNK_SIZE)
                        );

                        const res = await uploadService.uploadChunk(uploadId, index, chunk);

                        if (!res.success) {
                            throw new Error(res.message || 'Chunk upload failed');
                        }

                        // Step B: Add small delay (for UX)
                        await new Promise(res => setTimeout(res, 150));

                        // Update progress
                        setState(s => {
                            const newUploadedChunks = s.uploadedChunks + 1;
                            const progress = Math.round((newUploadedChunks / totalChunks) * 100);
                            const elapsedSeconds = (Date.now() - startTime) / 1000;
                            const bytesInSession = (newUploadedChunks - startChunk) * CHUNK_SIZE;
                            const speed = elapsedSeconds > 0 ? bytesInSession / elapsedSeconds : 0;
                            const remainingBytes = Math.max(0, file.size - (newUploadedChunks * CHUNK_SIZE));
                            const eta = speed > 0 ? Math.ceil(remainingBytes / speed) : null;

                            return {
                                ...s,
                                uploadedChunks: newUploadedChunks,
                                progress,
                                speed,
                                eta
                            };
                        });
                    }));
                }

                if (activeUploadIdRef.current !== uploadId) return;

                // Complete upload
                const final = await uploadService.completeUpload(uploadId);

                if (final.success) {
                    setState(s => ({
                        ...s,
                        status: 'completed',
                        progress: 100,
                        fileUrl: final.fileUrl || null
                    }));
                } else {
                    setState(s => ({
                        ...s,
                        status: 'error',
                        error: final.message
                    }));
                }
            } catch (err: any) {
                if (activeUploadIdRef.current === uploadId) {
                    setState(s => ({
                        ...s,
                        status: 'error',
                        error: err.message
                    }));
                }
            } finally {
                isLoopRunningRef.current = false;
            }
        },
        []
    );

    const startUpload = useCallback(async (file: File) => {
        if (state.status === 'uploading') return;

        console.log(`🚀 [${file.name}] Starting upload sequence...`);
        setState(s => ({
            ...s,
            file,
            status: 'waiting',
            progress: 0,
            error: null,
            fileUrl: null
        }));

        try {
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            console.log(`📡 [${file.name}] Initializing session with backend...`);
            const initRes = await uploadService.initUpload(file.name, file.size, totalChunks);
            
            console.log(`✅ [${file.name}] Session initialized:`, initRes.uploadId);
            setState(s => ({
                ...s,
                uploadId: initRes.uploadId,
                status: 'uploading'
            }));

            uploadChunks(file, initRes.uploadId, 0);
        } catch (err: any) {
            console.error(`❌ [${file.name}] Initialization failed:`, err.message);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to initialize upload';
            
            // If the server says it's already there, treat it as a success for the UI
            if (errorMessage === 'File already uploaded!') {
                setState(s => ({
                    ...s,
                    status: 'completed',
                    progress: 100,
                    error: null
                }));
                return;
            }

            setState(s => ({
                ...s,
                status: 'error',
                error: errorMessage
            }));
        }
    }, [state.status, uploadChunks]);

    const pauseUpload = useCallback(() => {
        pauseRef.current = true;
        setState(s => ({ ...s, status: 'paused' }));
    }, []);

    const resumeUpload = useCallback(() => {
        if (!state.file || !state.uploadId) return;
        
        if (isLoopRunningRef.current && activeUploadIdRef.current === state.uploadId) {
            pauseRef.current = false;
            setState(s => ({ ...s, status: 'uploading' }));
        } else {
            uploadChunks(state.file, state.uploadId, state.uploadedChunks);
        }
    }, [state.file, state.uploadId, state.uploadedChunks, state.status, uploadChunks]);

    const retryUpload = useCallback(() => {
        resumeUpload();
    }, [resumeUpload]);

    const resetUpload = useCallback(() => {
        pauseRef.current = true;
        activeUploadIdRef.current = null;
        setState({
            status: 'idle',
            progress: 0,
            uploadedChunks: 0,
            error: null,
            file: null,
            uploadId: null,
            speed: 0,
            eta: null,
            fileUrl: null,
            totalChunks: 0
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
