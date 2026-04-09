import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LoginRequired({ onSignIn, title = "CollabDocs" }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--surface-0)] flex items-center justify-center p-6 bg-dots relative">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/home')}
        className="absolute top-8 left-8 p-3 rounded-2xl bg-[var(--surface-1)] text-[var(--text-secondary)] hover:text-white border border-[var(--glass-border)] hover:border-[var(--brand-500)]/50 transition-all active:scale-95 group flex items-center gap-2 z-50"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back home</span>
      </button>

      <div className="relative w-full max-w-md animate-fade-in-scale">
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="glass rounded-[2rem] p-10 text-center relative overflow-hidden border border-[var(--glass-border)] shadow-2xl">
          {/* Logo Illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-2xl ring-1 ring-white/20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Login Required</h1>
          <p className="text-[var(--text-muted)] mb-10 leading-relaxed max-w-[280px] mx-auto text-sm">
            Please sign in to access and collaborate on <span className="text-[var(--text-primary)] font-semibold">"{title}"</span>.
          </p>

          <button
            onClick={onSignIn}
            className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-black font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Secure Collaboration</span>
          </div>
        </div>
        
        <p className="text-center mt-6 text-[10px] text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">
          Building the future of shared documentation
        </p>
      </div>
    </div>
  );
}

LoginRequired.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  title: PropTypes.string,
};
