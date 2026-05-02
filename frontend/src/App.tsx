import { useState, useEffect } from 'react';
import { DropZone } from './components/DropZone';
import { FileUploader } from './components/FileUploader';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { MyFiles } from './components/MyFiles';
import { UserProfile } from './components/UserProfile';
import { ThemeToggle } from './components/ThemeToggle';
import { useUploadQueue } from './hooks/useUploadQueue';
import { authService } from './services/authService';
import { User, LogOut, ChevronDown } from 'lucide-react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [showLanding, setShowLanding] = useState(!authService.isAuthenticated());
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [name, setName] = useState(authService.getName() || '');
    const [activeTab, setActiveTab] = useState<'upload' | 'files' | 'profile'>('upload');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filter, setFilter] = useState<'all' | 'uploading' | 'error'>('all');
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
            setShowLanding(true);
            setName('');
        } else {
            const isAuth = authService.isAuthenticated();
            setIsAuthenticated(isAuth);
            setShowLanding(!isAuth);
            setName(authService.getName() || '');
        }
    }, []);

    const handleLoginSuccess = (_isRegistration?: boolean) => {
        setIsAuthenticated(true);
        setName(authService.getName() || '');
        showToast(`Welcome back, ${authService.getName()}!`, 'success');
    };

    const handleLogout = () => {
        cancelAll();
        authService.logout();
        setIsAuthenticated(false);
        setShowLanding(true);
        setName('');
        showToast('Logged out successfully', 'warning');
    };

    const stats = {
        uploading: queue.filter(i => i.status === 'uploading').length,
        completed: queue.filter(i => i.status === 'completed').length,
        failed: queue.filter(i => i.status === 'error').length,
        total: queue.length
    };

    if (!isAuthenticated) {
        if (showLanding) {
            return (
                <LandingPage
                    onSignIn={() => { setAuthMode('login'); setShowLanding(false); }}
                    onGetStarted={() => { setAuthMode('register'); setShowLanding(false); }}
                />
            );
        }
        return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setShowLanding(true)} initialMode={authMode} />;
    }

    return (
        <div className="min-h-screen bg-[#fafcff] dark:bg-[#050505] pt-10 pb-4 px-4 sm:pt-14 sm:pb-6 sm:px-6 md:px-10 transition-colors duration-500 relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '7s' }}></div>
                <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-cyan-300/10 dark:bg-cyan-400/5 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '5s' }}></div>
            </div>

            {/* NAVBAR */}
            <div className="relative z-10 max-w-4xl mx-auto flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => setActiveTab('upload')}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">CloudDrop</span>
                </div>

                <div className="flex items-center gap-4 relative">
                    <ThemeToggle />
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`group flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all border shadow-sm ${activeTab === 'profile'
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all ${activeTab === 'profile'
                            ? 'bg-blue-600'
                            : 'bg-gray-400 dark:bg-gray-600'
                            }`}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
                {/* TAB SWITCHER */}
                <div className="flex p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[1.5rem] shadow-sm max-w-sm mx-auto mb-10 relative">
                    <div
                        className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-gray-900 dark:bg-gray-800 rounded-xl transition-transform duration-500 ease-out shadow-md ${activeTab === 'files' ? 'translate-x-full' : 'translate-x-0'
                            }`}
                    ></div>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 relative z-10 rounded-xl ${activeTab === 'upload'
                            ? 'text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Upload Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 relative z-10 rounded-xl ${activeTab === 'files'
                            ? 'text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        My Files
                    </button>
                </div>

                <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === 'upload' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-500/5 group hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Uploading</p>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.uploading}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-green-100 dark:border-green-900/30 shadow-xl shadow-green-500/5 group hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Completed</p>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.completed}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-red-100 dark:border-red-900/30 shadow-xl shadow-red-500/5 group hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Failed</p>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.failed}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-500/5 group hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total</p>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.total}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                                    <button 
                                        onClick={() => setFilter('all')}
                                        className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        All Uploads
                                    </button>
                                    <button 
                                        onClick={() => setFilter('uploading')}
                                        className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${filter === 'uploading' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Active
                                    </button>
                                    <button 
                                        onClick={() => setFilter('error')}
                                        className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${filter === 'error' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Failed {stats.failed > 0 && `(${stats.failed})`}
                                    </button>
                                </div>
                                {stats.failed > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Recovery Hub Active</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-black/40 border border-white dark:border-gray-800">
                                {filter === 'all' && <DropZone onFilesSelect={addFiles} />}
                                
                                <div className={`${filter === 'all' ? 'mt-12' : 'mt-0'} space-y-6`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                                {filter === 'error' ? 'Failed Items' : filter === 'uploading' ? 'Current Uploads' : 'Upload History'}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="grid gap-4">
                                        {queue.filter(item => filter === 'all' ? true : item.status === filter).map((item) => (
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
                                        {queue.filter(item => filter === 'all' ? true : item.status === filter).length === 0 && (
                                            <div className="text-center py-20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] bg-gray-50/50 dark:bg-gray-900/10 transition-all duration-500">
                                                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200/50 dark:shadow-black/40">
                                                    {filter === 'error' ? (
                                                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    ) : filter === 'uploading' ? (
                                                        <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                    ) : (
                                                        <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                                                    {filter === 'error' ? 'Zero Failures' : filter === 'uploading' ? 'Idle Monitor' : 'Start Your Journey'}
                                                </h3>
                                                <p className="text-gray-400 font-bold max-w-xs mx-auto leading-relaxed px-4">
                                                    {filter === 'error' 
                                                        ? "You're all good! No failed uploads in the queue." 
                                                        : filter === 'uploading' 
                                                        ? 'No active uploads. Upload a file to start tracking progress.' 
                                                        : 'Your queue is empty. Drop files above to begin uploading.'}
                                                </p>
                                                {filter !== 'all' && (
                                                    <button 
                                                        onClick={() => setFilter('all')}
                                                        className="mt-8 flex items-center gap-2 mx-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
                                                    >
                                                        <span>GO TO UPLOAD CENTER</span>
                                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'files' && <MyFiles showToast={showToast} onNavigate={() => setActiveTab('upload')} />}
                    {activeTab === 'profile' && <UserProfile />}
                </main>
            </div>

            {/* TOAST CONTAINER */}
            <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-full duration-300 ${toast.type === 'success' ? 'bg-white/90 dark:bg-green-950/40 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400' :
                            toast.type === 'error' ? 'bg-white/90 dark:bg-red-950/40 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400' :
                                'bg-white/90 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400'
                            }`}
                    >
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                            toast.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                                'bg-amber-100 dark:bg-amber-900/30'
                            }`}>
                            {toast.type === 'success' && <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            {toast.type === 'error' && <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>}
                            {toast.type === 'warning' && <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        </div>
                        <span className="font-bold text-xs sm:text-sm flex-1">{toast.message}</span>
                        <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
            {/* GLOBAL USER MENU OVERLAY */}
            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-[500] bg-black/10 dark:bg-black/50 backdrop-blur-sm sm:bg-transparent" onClick={() => setShowDropdown(false)} />
                    
                    {/* Mobile Full-Screen Menu */}
                    <div className="fixed inset-0 z-[600] sm:hidden bg-white dark:bg-gray-900 animate-in slide-in-from-bottom duration-300 p-8 flex flex-col items-center justify-center gap-8">
                        <button 
                            onClick={() => setShowDropdown(false)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 shadow-sm active:scale-95 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-500/40 mb-4">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{name}</h2>
                        
                        <div className="w-full space-y-4 max-w-xs">
                            <button
                                onClick={() => { setActiveTab('profile'); setShowDropdown(false); }}
                                className="w-full flex items-center justify-center gap-4 px-6 py-5 text-lg font-black text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-3xl active:scale-95 transition-all shadow-sm"
                            >
                                <User size={24} className="text-blue-500" />
                                <span>View Profile</span>
                            </button>
                            <button
                                onClick={() => { handleLogout(); setShowDropdown(false); }}
                                className="w-full flex items-center justify-center gap-4 px-6 py-5 text-lg font-black text-red-500 bg-red-50/50 dark:bg-red-900/10 rounded-3xl active:scale-95 transition-all shadow-sm"
                            >
                                <LogOut size={24} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Dropdown */}
                    <div className="hidden sm:block fixed z-[500] top-24 right-[calc((100vw-min(100vw-2rem,896px))/2+1rem)] w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-1.5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-1.5 space-y-1">
                            <button
                                onClick={() => { setActiveTab('profile'); setShowDropdown(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold group rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <User size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                <span className="group-hover:underline decoration-2 underline-offset-4">View Profile</span>
                            </button>
                            <button
                                onClick={() => { handleLogout(); setShowDropdown(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all font-bold group rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                <span className="group-hover:underline decoration-2 underline-offset-4 text-red-500 dark:text-red-400">Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
