import { useState, useEffect, useRef } from 'react';

export default function ChatSidebar({ ydoc, provider, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!ydoc) return;
    const ychat = ydoc.getArray('chatMessages');
    const update = () => setMessages(ychat.toArray());
    ychat.observe(update);
    update();
    return () => ychat.unobserve(update);
  }, [ydoc]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !ydoc || !provider) return;
    ydoc.getArray('chatMessages').push([{
      id: Date.now().toString(),
      text: inputVal.trim(),
      author: user?.displayName || 'Guest',
      uid: user?.uid || 'guest-id',
      senderId: provider.awareness.clientID,
      timestamp: new Date().toISOString(),
    }]);
    setInputVal('');
  };

  const isOwn = (msg) => {
    if (!provider) return false;
    return msg.senderId === provider.awareness.clientID;
  };

  return (
    <>
      <style>{`
        @keyframes popIn {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to   { transform: translateY(0) scale(1);    opacity: 1; }
        }
        .chat-widget {
          animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .chat-messages::-webkit-scrollbar { width: 5px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>

      <div className="chat-widget fixed bottom-6 right-6 w-[400px] h-[550px] flex flex-col bg-[var(--surface-1)] border border-[var(--surface-3)] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-[100] backdrop-blur-md">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--surface-3)] bg-[var(--surface-2)]/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight leading-none mb-1">Team Collaboration</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-medium">Real-time sync active</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-3)] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface-3)]/30 flex items-center justify-center border border-[var(--surface-4)]/50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Start a Thread</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-[180px]">Your messages are synced live with everyone in this room.</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${isOwn(msg) ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  {!isOwn(msg) && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 uppercase">
                      {msg.author?.[0] || '?'}
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                    {isOwn(msg) ? 'You' : msg.author}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed max-w-[92%] shadow-sm ${
                  isOwn(msg)
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-[var(--surface-3)] text-[var(--text-primary)] rounded-tl-none border border-[var(--surface-4)]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-5 border-t border-[var(--surface-3)] bg-[var(--surface-1)] rounded-b-3xl">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-[var(--surface-2)] border border-[var(--surface-3)] focus:border-indigo-500/50 rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
            />
            <div className="absolute right-2 flex items-center">
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-95 group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
          <div className="flex justify-center mt-3 gap-4 opacity-50">
             <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Markdown Supported</span>
             <span className="text-[10px] text-[var(--text-muted)]">•</span>
             <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Syncing Live</span>
          </div>
        </div>

      </div>
    </>
  );
}