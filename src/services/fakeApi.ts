export type UploadStatus =
    | 'idle'
    | 'waiting'
    | 'uploading'
    | 'paused'
    | 'error'
    | 'completed';

export interface UploadResponse {
    success: boolean;
    message: string;
    chunkIndex?: number;
    errorCode?: string;
}

export type UploadMode = 'normal' | 'failure' | 'slow';

/**
 * Simulated backend API for chunked uploads
 */
export const fakeApi = {
    uploadChunk: async (
        fileId: string,
        chunkIndex: number,
        totalChunks: number,
        chunk: Blob,
        mode: UploadMode = 'normal',
        onProgress?: (p: number) => void
    ): Promise<UploadResponse> => {
        let min = 300;
        let max = 1500;

        if (mode === 'slow') {
            min = 2000;
            max = 4000;
        }

        const delay = Math.random() * (max - min) + min;

        return new Promise((resolve) => {
            const start = Date.now();

            const timer = setInterval(() => {
                const elapsed = Date.now() - start;
                const percent = Math.min(
                    100,
                    Math.round((elapsed / delay) * 100)
                );

                onProgress?.(percent);

                if (percent >= 100) {
                    clearInterval(timer);

                    // deterministic failure
                    if (mode === 'failure' && chunkIndex === 2) {
                        resolve({
                            success: false,
                            message:
                                'Simulated server error on chunk #3',
                            errorCode: 'CHUNK_UPLOAD_FAILED',
                            chunkIndex
                        });
                        return;
                    }

                    resolve({
                        success: true,
                        message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded`,
                        chunkIndex
                    });
                }
            }, 100);
        });
    },

    finishUpload: async (
        fileId: string,
        checksum: string
    ): Promise<UploadResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message:
                        'File upload completed and verified'
                });
            }, 500);
        });
    }
};
