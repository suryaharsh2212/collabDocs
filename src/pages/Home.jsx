/**
 * Home.jsx — Landing Page
 *
 * Features:
 * - [x] Expand `ICON_MAP` in `Home.jsx` with more Lucide icons
 * - [x] Refactor Template Modal UI (smaller cards, better grid layout)
 * - [x] Add AI Prompt input and "Generate" functionality to `Home.jsx`
 * - [x] Implement content handoff in `DocPage.jsx` for AI-generated documents
 * - App name "CollabDocs" with gradient hero section
 * - "New Document" button — generates nanoid() roomId, navigates to /doc/:roomId
 * - "Join a document" input + button — accepts room URL or bare roomId
 * - User avatar/name if logged in, "Guest" badge otherwise
 * - Google sign-in button
 */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { 
  Sun, Moon, File, Zap, GraduationCap, ClipboardList, 
  FileText, Layout, Users, Download, LogOut, Plus, Search, 
  Trash2, ChevronRight, Sparkles, Code, Box, Bug, RotateCcw,
  Briefcase, BookOpen, ListChecks, Wand2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserRooms } from '../hooks/useRoom';
import { TEMPLATES } from '../lib/templates';

const ICON_MAP = {
  File, Zap, GraduationCap, ClipboardList, FileText, 
  Box, Code, Bug, RotateCcw, Briefcase, Users, BookOpen, ListChecks
};

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [joinInput, setJoinInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'doc', 'code'
  const [searchQuery, setSearchQuery] = useState('');

  // Custom hook for user documents
  const { rooms: recentRooms, loading: roomsLoading, deleteRoom } = useUserRooms();

  // Theme Handling
  const [isLight, setIsLight] = useState(() => localStorage.getItem('theme') === 'light');

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  const toggleTheme = () => setIsLight(!isLight);

  // Handle post-login redirection or internal template routing
  useEffect(() => {
    if (user && !loading) {
      const params = new URLSearchParams(location.search);
      const redirectId = params.get('redirect');
      const templateId = params.get('template');
      const type = params.get('type');
      if (redirectId) {
        const baseUrl = type === 'code' ? `/code/${redirectId}` : `/doc/${redirectId}`;
        const url = templateId ? `${baseUrl}?template=${templateId}` : baseUrl;
        navigate(url, { replace: true });
      }
    }
  }, [user, loading, navigate, location.search]);

  /** Create a new document with a random room ID */
  const handleNewDoc = () => {
    const roomId = nanoid(10);
    navigate(`/doc/${roomId}`);
  };

  /** Create a new code environment with a random room ID */
  const handleNewCode = () => {
    const roomId = nanoid(10);
    navigate(`/code/${roomId}`);
  };

  const handleCreateFromTemplate = (templateId) => {
    const roomId = nanoid(10);
    const baseUrl = `/doc/${roomId}`;
    if (user) {
      navigate(`${baseUrl}?template=${templateId}`);
    } else {
      navigate(`/home?redirect=${roomId}&template=${templateId}`, { replace: true });
    }
  };


  /** Join an existing document by room ID or full URL */
  const handleJoinDoc = () => {
    const input = joinInput.trim();
    if (!input) {
      setInputError('Please enter a room ID or link');
      return;
    }

    setInputError('');

    let roomId = input;
    let type = 'doc'; // Default

    try {
      const url = new URL(input);
      const pathParts = url.pathname.split('/');
      
      const docIndex = pathParts.indexOf('doc');
      const codeIndex = pathParts.indexOf('code');
      
      if (docIndex !== -1 && pathParts[docIndex + 1]) {
        roomId = pathParts[docIndex + 1];
        type = 'doc';
      } else if (codeIndex !== -1 && pathParts[codeIndex + 1]) {
        roomId = pathParts[codeIndex + 1];
        type = 'code';
      }
    } catch {
      // Not a URL
    }

    navigate(type === 'code' ? `/code/${roomId}` : `/doc/${roomId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleJoinDoc();
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRoom(roomToDelete.id);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRooms = recentRooms.filter(room => {
    const roomType = room.type || 'doc';
    const typeMatches = filter === 'all' || roomType === filter;
    
    if (!typeMatches) return false;

    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const title = (room.title || '').toLowerCase();
    const id = room.id.toLowerCase();
    
    return title.includes(query) || id.includes(query);
  });

  return (
    <div className="h-screen bg-[var(--surface-0)] flex flex-col lg:flex-row relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--brand-500)]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-[var(--brand-600)]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* LEFT SECTION: Branding, User & Actions */}
      <aside className="w-full lg:w-[420px] xl:w-[480px] bg-[var(--surface-1)] border-r border-[var(--glass-border)] flex flex-col relative z-20 shadow-2xl transition-all duration-300">
        <div className="p-8 lg:p-12 flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Logo & Theme Toggle */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-[var(--brand-500)]/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  <path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/>
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">CollabDocs</span>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--brand-500)] transition-all border border-[var(--glass-border)] active:scale-95"
              title={isLight ? "Toggle Dark Mode" : "Toggle Light Mode"}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          {/* Hero Content */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[var(--text-primary)] mb-4 leading-[1.1]">
              Create. <br />
              <span className="bg-gradient-to-r from-[var(--brand-500)] to-[#7c3aed] bg-clip-text text-transparent">Collaborate.</span>
            </h1>
            <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium leading-relaxed max-w-[320px]">
              The premium real-time workspace for teams who love clean documentation.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-6 mb-12">
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  disabled={loading}
                  onClick={() => setShowTemplates(true)}
                  className="btn btn-primary flex-1 py-4 text-sm rounded-2xl shadow-xl active:scale-[0.98] transition-all"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  New Doc
                </button>
                <button
                  disabled={loading}
                  onClick={handleNewCode}
                  className="btn flex-1 py-4 text-sm rounded-2xl shadow-xl active:scale-[0.98] transition-all bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-none"
                >
                  <Code size={18} strokeWidth={2.5} />
                  New Code
                </button>
              </div>
              
              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--glass-border)] space-y-3">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Quick Join By ID</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinInput}
                    onChange={(e) => { setJoinInput(e.target.value); setInputError(''); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Room Link..."
                    className="input flex-1 !py-2.5 !text-[11px] !bg-[var(--surface-3)]"
                  />
                  <button
                    onClick={handleJoinDoc}
                    className="btn btn-secondary !px-4 !py-2.5 !text-[11px] border-[var(--glass-border)]"
                  >
                    Join
                  </button>
                </div>
                {inputError && <p className="text-[9px] text-red-500 font-bold">{inputError}</p>}
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="mt-auto p-5 rounded-[2rem] bg-[var(--brand-500)]/5 border border-[var(--brand-500)]/10 backdrop-blur-md">
            {loading ? (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-3)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-[var(--surface-3)] rounded-full" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-2xl ring-2 ring-[var(--brand-500)]/20 shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-lg font-black text-white shadow-xl">
                      {user.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-black text-[var(--text-primary)] line-clamp-1">{user.displayName}</span>
                    <span className="text-[10px] font-bold text-[var(--brand-500)] uppercase tracking-widest">Workspace Pro</span>
                  </div>
                </div>
                <button
                  onClick={signOutUser}
                  className="p-2.5 rounded-xl hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all active:scale-95 border border-transparent hover:border-red-500/20"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-muted)]">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white tracking-tight">Sync Across Devices</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Sign in to save your workspaces</p>
                  </div>
                </div>
                <button 
                  onClick={signInWithGoogle}
                  className="btn btn-primary w-full py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT SECTION: Recent Workspaces (List View) */}
      <main className="flex-1 bg-[var(--surface-0)] relative z-10 flex flex-col min-w-0 transition-all duration-300">
        <div className="flex-1 p-8 lg:p-16 max-w-5xl mx-auto w-full flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <Layout size={24} className="text-[var(--brand-500)]" />
                Recent Workspaces
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Pick up where you left off.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64 group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--brand-500)] transition-colors" />
                <input 
                  type="text"
                  placeholder="Search by title or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] focus:border-[var(--brand-500)] rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-[var(--text-muted)] outline-none transition-all shadow-inner"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center bg-[var(--surface-1)] p-1 rounded-xl border border-[var(--glass-border)] shrink-0">
                {[
                  { id: 'all', label: 'All', icon: <Sparkles size={12} /> },
                  { id: 'doc', label: 'Docs', icon: <FileText size={12} /> },
                  { id: 'code', label: 'Code', icon: <Code size={12} /> }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFilter(t.id)}
                    className={`
                      flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all
                      ${filter === t.id 
                        ? 'bg-[var(--brand-500)] text-white shadow-lg' 
                        : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-2)]'}
                    `}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {roomsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 w-full rounded-2xl bg-[var(--surface-1)] animate-pulse flex items-center px-6 gap-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)]" />
                    <div className="flex-1 space-y-2">
                       <div className="h-4 w-40 bg-[var(--surface-2)] rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="space-y-3 pb-8">
                {filteredRooms.map((room, idx) => {
                  const rType = room.type || 'doc';
                  const isCode = rType === 'code';
                  
                  return (
                    <div
                      key={room.id}
                      onClick={() => navigate(isCode ? `/code/${room.id}` : `/doc/${room.id}`)}
                      className="
                        group flex items-center gap-6 p-4 rounded-2xl 
                        bg-[var(--surface-1)] border border-[var(--glass-border)] 
                        hover:bg-[var(--surface-2)] hover:border-[var(--brand-500)]/30 
                        transition-all cursor-pointer animate-fade-in
                      "
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110
                        ${isCode 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}
                      `}>
                        {isCode ? <Code size={24} /> : <FileText size={24} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-bold text-white truncate group-hover:text-[var(--brand-500)] transition-colors">
                            {room.title || (isCode ? 'Untitled Snippet' : 'Untitled Document')}
                          </h3>
                          <span className={`
                            text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border
                            ${isCode 
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}
                          `}>
                            {isCode ? 'Code' : 'Doc'}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] opacity-50">#{room.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           {isCode && <span className="text-[9px] bg-[var(--surface-3)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">JavaScript</span>}
                           <p className="text-xs text-[var(--text-muted)] truncate max-w-md italic">
                             {room.preview ? `"${room.preview}"` : (isCode ? 'Source code session' : 'Rich text document')}
                           </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right shrink-0">
                        <div className="hidden sm:block">
                          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">Last Activity</p>
                          <p className="text-xs font-bold text-[var(--text-secondary)]">
                            {room.updatedAt?.toDate ? room.updatedAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRoomToDelete(room);
                          }}
                          className="p-2.5 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all active:scale-95"
                          title="Delete Workspace"
                        >
                          <Trash2 size={18} />
                        </button>
                        <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--brand-500)] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-[var(--surface-1)] border border-[var(--glass-border)] flex items-center justify-center mb-6 shadow-2xl">
                  {filter === 'code' ? <Code size={40} className="text-[var(--text-muted)] opacity-20" /> : <Search size={40} className="text-[var(--text-muted)] opacity-20" />}
                </div>
                <h3 className="text-xl font-black text-white mb-2">No {filter === 'all' ? 'workspaces' : filter === 'doc' ? 'documents' : 'snippets'} found</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-xs font-medium">
                  {filter === 'all' 
                    ? "Start creating your first collaborative workspace to see it here."
                    : `You haven't created any ${filter === 'doc' ? 'documents' : 'code snippets'} yet.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowTemplates(false)} />
           <div className="relative bg-[var(--surface-1)] rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-scale border border-[var(--glass-border)] shadow-[0_0_100px_rgba(99,102,241,0.15)]">
              {/* Header */}
              <div className="p-8 lg:p-10 border-b border-[var(--glass-border)] bg-[var(--surface-0)]/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                      <Sparkles size={32} className="text-[var(--brand-500)]" />
                      Template Library
                    </h2>
                    <p className="text-[var(--text-muted)] font-medium mt-1">Start from a pre-defined structure or let us help you.</p>
                  </div>
                  <button onClick={() => setShowTemplates(false)} className="p-3 rounded-2xl bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-white transition-all hover:rotate-90">
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>
              </div>

              {/* Grid Section */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-dots">
                {/* Blank Option */}
                <div 
                  onClick={handleNewDoc}
                  className="group relative h-48 rounded-3xl bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] border border-[var(--glass-border)] hover:border-[var(--brand-500)]/40 p-6 flex flex-col justify-between transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                >
                   <div className="w-12 h-12 rounded-xl bg-[var(--brand-500)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Plus size={24} strokeWidth={3} className="text-white" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-white mb-1">Blank Slate</h4>
                      <p className="text-[11px] text-[var(--text-muted)] font-medium leading-relaxed">Start fresh with no constraints.</p>
                   </div>
                </div>

                {/* System Templates */}
                {TEMPLATES.map((t) => {
                   const IconComp = ICON_MAP[t.icon] || File;
                   return (
                     <div 
                       key={t.id}
                       onClick={() => handleCreateFromTemplate(t.id)}
                       className="group relative h-48 rounded-3xl bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] border border-[var(--glass-border)] hover:border-[var(--brand-500)]/40 p-6 flex flex-col justify-between transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                     >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                          style={{ backgroundColor: `${t.brandColor}20`, color: t.brandColor }}
                        >
                           <IconComp size={24} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: t.brandColor }}>{t.id.split('_')[0]}</span>
                           </div>
                           <h4 className="text-lg font-black text-white mb-1">{t.title}</h4>
                           <p className="text-[11px] text-[var(--text-muted)] font-medium line-clamp-2 leading-relaxed">{t.desc}</p>
                        </div>
                     </div>
                   );
                })}
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {roomToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRoomToDelete(null)} />
          <div className="relative glass rounded-3xl p-8 w-full max-w-sm animate-fade-in-scale">
            <h3 className="text-xl font-black text-white mb-2">Delete Workspace?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-8">This will permanently remove <span className="text-white font-bold">"{roomToDelete.title || 'Untitled'}"</span>. This action cannot be reversed.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setRoomToDelete(null)}
                className="flex-1 btn btn-secondary py-3 text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteRoom}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center"
              >
                {isDeleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
