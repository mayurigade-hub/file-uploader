import React, { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafcff] dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-100 overflow-hidden">

      {/* 
        UNIQUE FLOATING NAVBAR
        This replaces the standard top-bar with a dynamic, glassmorphic pill that floats.
      */}
      <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto transition-all duration-500">
        <nav className={`flex items-center justify-between sm:justify-center gap-2 sm:gap-4 p-1.5 sm:p-2 transition-all duration-500 rounded-[2rem] border shadow-2xl ${scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-white/40 dark:border-gray-700/50 shadow-sky-500/10'
          : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-white/20 dark:border-gray-800/30 shadow-black/5'
          }`}>
          {/* Logo Area */}
          <div className="flex items-center gap-2 px-2 sm:px-3 py-2 cursor-pointer group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="font-extrabold text-gray-900 dark:text-white hidden md:block tracking-tight text-lg">CloudDrop</span>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>

          {/* Interactive Nav Links - Removed Pricing & Solutions */}
          <div className="hidden sm:flex items-center">
            <a href="#features" className="relative group px-4 py-2 rounded-full overflow-hidden">
              <span className="relative z-10 text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Features</span>
              <div className="absolute inset-0 bg-sky-50 dark:bg-sky-900/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
            </a>
            <a href="#workflow" className="relative group px-4 py-2 rounded-full overflow-hidden">
              <span className="relative z-10 text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Workflow</span>
              <div className="absolute inset-0 bg-sky-50 dark:bg-sky-900/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
            </a>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>

          {/* Auth Actions with magnetic-like styling */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0 pr-1">
            <ThemeToggle className="scale-90 sm:scale-100 shadow-none border-none hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent dark:bg-transparent" />
            <button
              onClick={onSignIn}
              className="px-3 sm:px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 sm:px-6 py-2.5 text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-sky-500 dark:hover:bg-sky-400 hover:text-white rounded-[1.5rem] transition-all duration-300 shadow-xl hover:shadow-sky-500/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section with Ambient Background */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6">
        {/* Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '7s' }}></div>
          <div className="absolute top-[40%] right-[20%] w-[500px] h-[500px] bg-cyan-300/10 dark:bg-cyan-400/5 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '5s' }}></div>
        </div>

        {/* Floating Abstract UI Elements */}
        <div className="absolute top-1/4 left-[10%] hidden lg:block animate-bounce" style={{ animationDuration: '6s' }}>
          <div className="w-16 h-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50 flex items-center justify-center rotate-12">
            <svg className="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          </div>
        </div>
        <div className="absolute bottom-1/4 right-[10%] hidden lg:block animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
          <div className="w-20 h-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full shadow-2xl border border-white/50 dark:border-gray-700/50 flex items-center justify-center -rotate-12">
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-sky-600 dark:text-sky-400 text-sm font-bold mb-10 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
            New: Version 2.0 Architectural Overhaul
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-8 leading-[1.1]">
            <span className="inline-block text-gray-900 dark:text-white">Upload Anything.</span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 drop-shadow-sm">
              Lose Nothing.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            CloudDrop handles massive file uploads reliably — splitting them into chunks, surviving network failures, and resuming exactly where you left off.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-4 text-lg font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-sky-500 dark:hover:bg-sky-400 hover:text-white rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-sky-500/25 hover:-translate-y-1 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Uploading
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </button>
            <a
              href="https://github.com/mayurigade-hub/file-uploader"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1 group"
            >
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View Source
            </a>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">Powerful Storage, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Weightless Experience</span></h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Engineered for absolute reliability. We took the stress out of file transfers so you can focus on building what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[280px]">
            {/* Feature 1 - Spans 2 columns */}
            <div className="md:col-span-2 relative group rounded-[2.5rem] bg-white dark:bg-gray-800/50 p-6 sm:p-10 border border-gray-100 dark:border-gray-700/50 shadow-xl overflow-hidden hover:shadow-2xl hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-3 tracking-tight">Intelligent Chunking</h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Files are automatically split into optimized 5MB pieces to ensure maximum transfer visibility and bypass server limits.</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group rounded-[2.5rem] bg-white dark:bg-gray-800/50 p-6 sm:p-10 border border-gray-100 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-3 tracking-tight">Pause & Resume</h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Never start over. Network failures are handled gracefully.</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group rounded-[2.5rem] bg-white dark:bg-gray-800/50 p-6 sm:p-10 border border-gray-100 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-cyan-200 dark:hover:border-cyan-800 transition-all duration-500">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-3 tracking-tight">Native Preview</h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">View images and documents directly in the browser.</p>
                </div>
              </div>
            </div>

            {/* Feature 4 - Spans 2 columns */}
            <div className="md:col-span-2 relative group rounded-[2.5rem] bg-gray-900 dark:bg-black p-6 sm:p-10 border border-gray-800 shadow-2xl overflow-hidden hover:border-sky-500/50 transition-all duration-500">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-500/20 blur-[80px] rounded-full"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 bg-gray-800 text-sky-400 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">Enterprise Security</h3>
                  <p className="text-lg text-gray-400 font-medium">Bank-grade encryption for all assets. Secure JWT authentication and precise access controls keep your data safe and private.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section - Stepper with Glowing Lines */}
      <section id="workflow" className="py-32 bg-white dark:bg-[#080808] border-y border-gray-100 dark:border-gray-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTg2LCAyMzAsIDI1MywgMC4xKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent,white)]"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">The CloudDrop Flow</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Simple on the outside, sophisticated inside.</p>
          </div>

          <div className="relative">
            {/* Animated glowing line */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-[pulse_3s_ease-in-out_infinite] translate-x-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10">
              <WorkflowStep
                number="01"
                title="Drop"
                description="Drag and drop massive files. We handle validation and stream initialization."
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />}
              />
              <WorkflowStep
                number="02"
                title="Chunk"
                description="Files are intelligently split into 5MB blocks for parallel, resilient transfer."
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
                active
              />
              <WorkflowStep
                number="03"
                title="Manage"
                description="Instantly preview, share, download, or delete your assets from the dashboard."
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modern minimal CTA */}
      <section className="py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white">Ready to elevate your storage?</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of developers using CloudDrop for resilient large-file operations.
            </p>
            <button
              onClick={onGetStarted}
              className="px-12 py-5 text-lg font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:scale-105 hover:bg-sky-500 dark:hover:bg-sky-400 dark:hover:text-white rounded-[2rem] transition-all duration-300 shadow-2xl hover:shadow-sky-500/40"
            >
              Get Started for Free
            </button>
          </div>

          {/* Decorative rotating blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-[100px] group-hover:rotate-180 transition-transform duration-[3s] pointer-events-none"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800/60 bg-[#fafcff] dark:bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              CloudDrop
            </div>
            <p className="text-sm font-medium text-gray-500">
              © {new Date().getFullYear()} Ethereal storage for the modern web.
            </p>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const WorkflowStep = ({ number, title, description, icon, active = false }: { number: string, title: string, description: string, icon: React.ReactNode, active?: boolean }) => (
  <div className="flex flex-col items-center text-center relative group">
    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-xl font-bold mb-8 z-10 transition-all duration-500 ${active
      ? 'bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-2xl shadow-sky-500/40 scale-110'
      : 'bg-white dark:bg-gray-900 text-sky-500 border border-gray-200 dark:border-gray-800 shadow-xl group-hover:scale-105 group-hover:border-sky-300 dark:group-hover:border-sky-700'
      }`}>
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] font-black text-gray-50 dark:text-gray-900/50 pointer-events-none z-0 transition-transform group-hover:scale-110">
      {number}
    </div>
    <h3 className="text-2xl font-bold mb-3 relative z-10 tracking-tight">{title}</h3>
    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium px-4 relative z-10 leading-relaxed">{description}</p>
  </div>
);
