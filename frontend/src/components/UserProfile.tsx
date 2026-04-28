import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { uploadService } from '../services/uploadService';
import { User, Mail, Phone, Calendar, Hash, HardDrive, FileText, Loader2, Key, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ count: 0, size: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Change Password State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch profile first
        let userProfile;
        try {
          userProfile = await authService.getProfile();
          setProfile(userProfile);
        } catch (pErr: any) {
          console.error('Profile fetch failed:', pErr);
          const msg = pErr.response?.data?.error || pErr.message || 'Failed to fetch user profile';
          throw new Error(msg);
        }

        // Fetch files stats separately
        try {
          const userFiles = await uploadService.getUserFiles();
          const totalSize = userFiles.reduce((acc: number, file: any) => acc + (file.totalSize || 0), 0);
          setStats({
            count: userFiles.length,
            size: totalSize
          });
        } catch (fErr: any) {
          console.error('Files fetch failed:', fErr);
          // Don't throw here, just leave stats as 0
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile information');
        console.error('Full fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage({ type: '', text: '' });

    if (passwords.new !== passwords.confirm) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.new.length < 6) {
      setPassMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setPassLoading(true);
      await authService.changePassword(passwords.current, passwords.new);
      setPassMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err: any) {
      setPassMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to update password' 
      });
    } finally {
      setPassLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Member since today';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Member since today';
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p className="animate-pulse font-medium">Fetching your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-6 rounded-2xl text-center">
        <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-500/30 border-4 border-white dark:border-gray-800">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
              {profile?.name}
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-4">
              @{profile?.username?.replace(/^@+/, '')}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                  {formatDate(profile?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL DETAILS CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Account Details
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                <p className="text-gray-900 dark:text-gray-100 font-bold break-all">{profile?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                <p className="text-gray-900 dark:text-gray-100 font-bold">{profile?.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Username</p>
                <p className="text-gray-900 dark:text-gray-100 font-bold">@{profile?.username?.replace(/^@+/, '')}</p>
              </div>
            </div>

            {/* CHANGE PASSWORD SECTION */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {!showPasswordForm ? (
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Update Password</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowPasswordForm(false)}
                      className="text-xs text-gray-400 hover:text-red-500 font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  {passMessage.text && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      passMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {passMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {passMessage.text}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"}
                        placeholder="Current Password"
                        required
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <input 
                      type={showPass ? "text" : "password"}
                      placeholder="New Password"
                      required
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input 
                      type={showPass ? "text" : "password"}
                      placeholder="Confirm New Password"
                      required
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={passLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* USAGE STATS CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-500" />
            Cloud Usage
          </h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.count}</p>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Files Uploaded</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-xl shadow-lg shadow-green-500/30">
                  <HardDrive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{formatSize(stats.size)}</p>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Total Space Used</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
             <p className="text-xs text-gray-400 italic">
               Your data is stored securely in our cloud environment.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
