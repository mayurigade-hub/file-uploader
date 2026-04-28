import { useState, useEffect } from 'react';
import { DropZone } from './components/DropZone';
import { FileUploader } from './components/FileUploader';
import { Login } from './components/Login';
import { MyFiles } from './components/MyFiles';
import { UserProfile } from './components/UserProfile';
import { useUploadQueue } from './hooks/useUploadQueue';
import { authService } from './services/authService';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [name, setName] = useState(authService.getName() || '');
    const [isNewUser, setIsNewUser] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'files' | 'profile'>('upload');
    const [showDropdown, setShowDropdown] = useState(false);
    const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'error' | 'warning' }[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const {
        queue,
        addFiles,
        removeFile,
        updateItemStatus,
        cancelAll
    } = useUploadQueue();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setIsAuthenticated(false);
            setName('');
        } else {
            setIsAuthenticated(authService.isAuthenticated());
            setName(authService.getName() || '');
        }
    }, []);

    const handleLoginSuccess = (isRegistration: boolean = false) => {
        setIsAuthenticated(true);
        setName(authService.getName() || '');
        setIsNewUser(isRegistration);
        showToast(`Welcome back, ${authService.getName()}!`, 'success');
    };

    const handleLogout = () => {
        cancelAll();
        authService.logout();
        setIsAuthenticated(false);
        setName('');
        setIsNewUser(false);
        showToast('Logged out successfully', 'warning');
    };

    const stats = {
        uploading: queue.filter(i => i.status === 'uploading').length,
        completed: queue.filter(i => i.status === 'completed').length,
        failed: queue.filter(i => i.status === 'error').length,
        total: queue.length
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 sm:p-8 transition-colors duration-500">
            {/* NAVBAR */}
            <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('upload')}>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CloudDrop</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all shadow-lg ${
                            activeTab === 'profile'
                                ? 'bg-blue-600 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-black scale-105'
                                : 'bg-gray-400 dark:bg-gray-700 hover:bg-gray-500'
                        }`}
                    >
                        {name.charAt(0).toUpperCase()}
                    </button>

                    {showDropdown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{name}</p>
                                </div>
                                <button
                                    onClick={() => { setActiveTab('profile'); setShowDropdown(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                                >
                                    View Profile
                                </button>
                                <button
                                    onClick={() => { handleLogout(); setShowDropdown(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-semibold"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {/* TAB SWITCHER */}
                <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`pb-4 px-2 text-sm font-bold transition-all ${
                            activeTab === 'upload' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Upload Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`pb-4 px-2 text-sm font-bold transition-all ${
                            activeTab === 'files' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        My Files
                    </button>
                </div>

                <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === 'upload' && (
                        <div className="space-y-6">
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

                            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <DropZone onFilesSelect={addFiles} />
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Uploads</h3>
                                    <div className="grid gap-3">
                                        {queue.map((item) => (
                                            <FileUploader
                                                key={item.id}
                                                id={item.id}
                                                file={item.file}
                                                status={item.status}
                                                onStatusChange={(status) => updateItemStatus(item.id, status)}
                                                onRemove={() => removeFile(item.id)}
                                                showToast={showToast}
                                            />
                                        ))}
                                        {queue.length === 0 && (
                                            <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                                                <p className="text-gray-400 text-sm italic">Queue is empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'files' && <MyFiles onNavigate={() => setActiveTab('upload')} showToast={showToast} />}
                    {activeTab === 'profile' && <UserProfile />}
                </main>
            </div>

            {/* TOAST CONTAINER */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div 
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-full duration-300 ${
                            toast.type === 'success' ? 'bg-white/90 dark:bg-green-950/40 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400' :
                            toast.type === 'error' ? 'bg-white/90 dark:bg-red-950/40 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400' :
                            'bg-white/90 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            toast.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                            toast.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-amber-100 dark:bg-amber-900/30'
                        }`}>
                            {toast.type === 'success' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            {toast.type === 'error' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>}
                            {toast.type === 'warning' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        </div>
                        <span className="font-bold text-sm">{toast.message}</span>
                        <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
