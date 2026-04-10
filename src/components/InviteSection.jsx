import React, { useState } from 'react';
import { Send, Mail, CheckCircle2, AlertCircle, Loader2, Users } from 'lucide-react';

export default function InviteSection({ roomId, docTitle }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const inviteLink = window.location.href; // The current doc page URL

      const response = await fetch(`${API_URL}/api/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, inviteLink, docTitle }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to send invite');

      setStatus('success');
      setMessage('Invitation sent to ' + email);
      setEmail('');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (err) {
      console.error('Invite Error:', err);
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Users size={14} className="text-indigo-400" />
        <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Collaborators</h4>
      </div>

      <div className="p-4 rounded-xl bg-[var(--surface-3)]/30 border border-[var(--glass-border)] backdrop-blur-sm">
        <p className="text-[10px] text-[var(--text-secondary)] mb-3 leading-tight opacity-70">
          Invite others to view and edit this document in real-time.
        </p>

        <form onSubmit={handleInvite} className="relative">
          <div className="relative group">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="w-full bg-[var(--surface-1)] border border-[var(--surface-4)] focus:border-indigo-500/50 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/20 transition-all outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className={`
              mt-3 w-full py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all
              ${status === 'loading' 
                ? 'bg-indigo-500/50 cursor-not-allowed' 
                : 'bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 active:scale-95'
              }
            `}
          >
            {status === 'loading' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {status === 'loading' ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>

        {message && (
          <div className={`mt-3 flex items-start gap-2 animate-fade-in p-2 rounded-md ${status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {status === 'success' ? <CheckCircle2 size={12} className="mt-0.5" /> : <AlertCircle size={12} className="mt-0.5" />}
            <span className="text-[10px] font-medium leading-tight">{message}</span>
          </div>
        )}
      </div>

      <div className="pt-2 px-1">
        <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] italic">
          <span>* Users will receive an email from:</span>
        </div>
        <p className="text-[10px] font-mono text-indigo-300 mt-1 opacity-60">collabdocs@zohomail.in</p>
      </div>
    </div>
  );
}
