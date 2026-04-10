import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle2, AlertCircle, Loader2, Users, Sparkles } from 'lucide-react';

export default function InviteModal({ isOpen, onClose, roomId, docTitle, isCode, senderName }) {

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const inviteLink = window.location.href;

      const response = await fetch(`${API_URL}/api/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, inviteLink, docTitle, isCode, senderName }),
      });


      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send invite');

      setStatus('success');
      setMessage('Invitation successfully sent to ' + email);
      setEmail('');
      
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
      }, 2000);

    } catch (err) {
      console.error('Invite Error:', err);
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
        
        {/* Decorative Header */}
        <div className="h-24 bg-gradient-brand flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
           <div className="z-10 bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl">
              <Users size={32} className="text-white" />
           </div>
           
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all outline-none"
           >
             <X size={18} />
           </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              Invite Collaborators
              <Sparkles size={16} className="text-indigo-400" />
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 font-medium italic">
              Share your session link via professional email
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-3)]/50 border border-[var(--glass-border)] mb-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                   <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-black uppercase text-[var(--text-muted)] leading-none mb-1">Target Document</p>
                   <p className="text-sm font-bold text-white truncate">{docTitle || 'Untitled Session'}</p>
                </div>
             </div>
          </div>

          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] ml-1">Recipient Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full bg-[var(--surface-2)] border border-[var(--surface-4)] focus:border-indigo-500 rounded-xl py-3 px-4 text-sm text-white placeholder:opacity-30 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !email}
              className={`
                w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                ${status === 'loading' 
                  ? 'bg-indigo-500/50 cursor-not-allowed' 
                  : status === 'success'
                  ? 'bg-emerald-500 cursor-default'
                  : 'bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 active:scale-[0.98]'
                }
              `}
            >
              {status === 'loading' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <Send size={16} />
              )}
              {status === 'loading' ? 'Processing...' : status === 'success' ? 'Sent Successfully' : 'Send Invitation'}
            </button>
          </form>

          {message && status === 'error' && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 animate-fade-in">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span className="text-[11px] font-bold">{message}</span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-[var(--surface-2)]/50 border-t border-[var(--glass-border)] text-center">
           <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-[0.1em]">
             Sent securely from <span className="text-indigo-400">collabdocs@zohomail.in</span>
           </p>
        </div>
      </div>
    </div>
  );
}
