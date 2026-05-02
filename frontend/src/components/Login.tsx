import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ThemeToggle } from './ThemeToggle';

interface LoginProps {
  onLoginSuccess: (isRegistration?: boolean) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack, initialMode = 'login' }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(initialMode === 'register');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleModeSwitch = (register: boolean) => {
    setIsRegistering(register);
    setError('');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoadingStep(0);
    
    const loadingTimer = setInterval(() => {
      setLoadingStep(prev => prev + 1);
    }, 2000);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          clearInterval(loadingTimer);
          return;
        }
        await authService.register(name, username, email, phone, password);
        await authService.login(username, password);
        onLoginSuccess(true);
      } else {
        await authService.login(username, password);
        onLoginSuccess(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
      clearInterval(loadingTimer);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafcff] dark:bg-[#050505] font-sans relative py-12 px-4 transition-colors duration-500 overflow-hidden">

      {/* Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-[40%] right-[20%] w-[500px] h-[500px] bg-cyan-300/10 dark:bg-cyan-400/5 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>

      {/* Header Bar — Responsive and spaced */}
      <div className="absolute top-0 left-0 w-full px-4 sm:px-8 py-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-gray-700 group-hover:shadow-md transition-all">
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* CloudDrop logo — centered above card */}
      <div className="relative z-10 flex items-center gap-3 mb-10 cursor-pointer group" onClick={onBack}>
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <span className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white">CloudDrop</span>
      </div>

      {/* ── Centered form card ── */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/60 dark:shadow-black/40 p-8 sm:p-10">

          {/* Mode toggle tabs */}

          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => handleModeSwitch(false)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${!isRegistering
                ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch(true)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isRegistering
                ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {isRegistering ? 'Join us to start managing your files' : 'Sign in to access your dashboard'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <LightInput id="fullname" label="Full Name" type="text" value={name} onChange={setName} placeholder="John Doe"
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <LightInput id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />}
                  />
                  <LightInput id="phone" label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="1234567890"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                  />
                </div>
              </>
            )}

            <LightInput id="username" label="Username" type="text" value={username} onChange={setUsername} placeholder="Choose a username"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />}
            />

            <div className={`grid gap-4 ${isRegistering ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <LightInput
                id="password" label="Password" type={showPassword ? 'text' : 'password'}
                value={password} onChange={setPassword} placeholder="••••••••"
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                rightAction={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                }
              />
              {isRegistering && (
                <LightInput
                  id="confirmPassword" label="Confirm" type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••"
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                  rightAction={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirmPassword
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  }
                />
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-500 dark:text-red-400 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 text-base font-black rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-sky-500 dark:hover:bg-sky-400 dark:hover:text-white hover:shadow-xl hover:shadow-sky-400/30 dark:hover:shadow-sky-900/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className={`flex items-center justify-center gap-2 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {isRegistering ? 'Create Account' : 'Sign In'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center bg-inherit">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-sm font-bold animate-pulse">
                      {loadingStep === 0 ? 'Authenticating...' : loadingStep === 1 ? 'Securing Connection...' : 'Finalizing...'}
                    </span>
                  </div>
                </span>
              )}
            </button>
          </form>

          {/* Footer toggle */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => handleModeSwitch(!isRegistering)}
              className="font-bold text-sky-500 hover:text-sky-600 transition-colors underline underline-offset-4"
            >
              {isRegistering ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Light-themed floating label input ── */
interface LightInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightAction?: React.ReactNode;
}

const LightInput: React.FC<LightInputProps> = ({
  id, label, type, value, onChange, placeholder, icon, rightAction
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className={`absolute left-11 transition-all duration-200 pointer-events-none font-semibold z-10 ${focused || value
          ? '-top-2.5 text-xs text-sky-500 bg-white dark:bg-gray-900 px-1'
          : 'top-3.5 text-sm text-gray-400'
          }`}
      >
        {label}
      </label>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <svg className={`w-4 h-4 transition-colors duration-200 ${focused ? 'text-sky-500' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon}
        </svg>
      </div>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ''}
        className={`w-full pl-11 pt-4 pb-2 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white text-sm font-medium outline-none transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 ${focused
          ? 'border-sky-400 shadow-lg shadow-sky-300/20 dark:shadow-sky-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        style={{ paddingRight: rightAction ? '2.75rem' : '1rem' }}
      />
      {rightAction && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          {rightAction}
        </div>
      )}
    </div>
  );
};
