import { DropZone } from './components/DropZone';
import { FileUploader } from './components/FileUploader';
import { useUploadQueue } from './hooks/useUploadQueue';

function App() {
    const {
        queue,
        addFiles,
        removeFile,
        updateItemStatus,
        globalCommand,
        pauseAll,
        resumeAll,
        cancelAll
    } = useUploadQueue();

    const stats = {
        uploading: queue.filter(i => i.status === 'uploading').length,
        completed: queue.filter(i => i.status === 'completed').length,
        failed: queue.filter(i => i.status === 'error').length,
        total: queue.length
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* DASHBOARD - TOP */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Dashboard</h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Persistent chunked uploader with queue control
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={pauseAll}
                                className="px-3 py-1.5 text-xs font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors"
                                title="Pause active uploads"
                            >
                                Pause All
                            </button>
                            <button
                                onClick={resumeAll}
                                className="px-3 py-1.5 text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                                title="Resume uploads"
                            >
                                Resume All
                            </button>
                            <button
                                onClick={cancelAll}
                                className="px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                                title="Clear entire queue"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Uploading</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.uploading}</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                            <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">Completed</p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completed}</p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                            <p className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase">Failed</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.failed}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Total</p>
                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{stats.total}</p>
                        </div>
                    </div>
                </div>

                {/* DROPZONE - MIDDLE */}
                <DropZone onFilesSelect={addFiles} />

                {/* PROCESSING QUEUE - BOTTOM */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Processing Queue</h3>
                        {queue.length === 0 && (
                            <span className="text-sm text-gray-400 font-normal italic">Add files to begin uploading</span>
                        )}
                    </div>

                    <div className="grid gap-4">
                        {queue.map((item) => (
                            <FileUploader
                                key={item.id}
                                id={item.id}
                                file={item.file}
                                status={item.status}
                                command={globalCommand}
                                onStatusChange={(status) => updateItemStatus(item.id, status)}
                                onRemove={() => removeFile(item.id)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
