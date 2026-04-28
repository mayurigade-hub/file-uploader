import { useState, useCallback, useEffect } from 'react';
import { fileStore } from '../services/indexedDB';
import type { UploadStatus } from '../services/fakeApi';

export interface UploadItem {
    id: string;
    file: File;
    status: UploadStatus | 'waiting';
}

const QUEUE_STORAGE_KEY = 'upload_queue_metadata';

export const useUploadQueue = () => {
    const [queue, setQueue] = useState<UploadItem[]>([]);
    const [isRestored, setIsRestored] = useState(false);

    // Restore queue from storage on mount
    useEffect(() => {
        const restoreQueue = async () => {
            const savedMetadata = localStorage.getItem(QUEUE_STORAGE_KEY);
            if (savedMetadata) {
                try {
                    const metadata = JSON.parse(savedMetadata) as { id: string; name: string }[];
                    const restoredItems: UploadItem[] = [];

                    for (const meta of metadata) {
                        const file = await fileStore.getFile(meta.id);
                        if (file) {
                            restoredItems.push({
                                id: meta.id,
                                file,
                                status: 'waiting'
                            });
                        }
                    }
                    setQueue(restoredItems);
                } catch (e) {
                    console.error('Failed to restore queue', e);
                }
            }
            setIsRestored(true);
        };
        restoreQueue();
    }, []);

    // Persist queue metadata when it changes
    useEffect(() => {
        if (!isRestored) return;
        const metadata = queue.map(item => ({ id: item.id, name: item.file.name }));
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(metadata));
    }, [queue, isRestored]);

    const addFiles = useCallback(async (files: File[]) => {
        const newItems: UploadItem[] = [];
        for (const file of files) {
            const id = crypto.randomUUID();
            await fileStore.storeFile(id, file);
            newItems.push({
                id,
                file,
                status: 'waiting'
            });
        }
        setQueue(prev => [...prev, ...newItems]);
    }, []);

    const removeFile = useCallback(async (id: string) => {
        await fileStore.deleteFile(id);
        setQueue(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateItemStatus = useCallback((id: string, status: UploadStatus | 'waiting') => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, status } : item
        ));
    }, []);



    const cancelAll = useCallback(async () => {
        await fileStore.clearAll();
        localStorage.removeItem(QUEUE_STORAGE_KEY);
        setQueue([]);
    }, []);

    return {
        queue,
        addFiles,
        removeFile,
        updateItemStatus,
        cancelAll
    };
};
