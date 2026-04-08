/**
 * Home.jsx — Landing Page
 *
 * Features:
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
  Trash2, ChevronRight, Sparkles 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserRooms } from '../hooks/useRoom';
import { TEMPLATES } from '../lib/templates';

const ICON_MAP = {
  File,
  Zap,
  GraduationCap,
  ClipboardList,
  FileText
};

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [joinInput, setJoinInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Custom hook for user documents
  const { rooms: recentRooms, loading: roomsLoading, deleteRoom } = useUserRooms();
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      if (redirectId) {
        const url = templateId ? `/doc/${redirectId}?template=${templateId}` : `/doc/${redirectId}`;
        navigate(url, { replace: true });
      }
    }
  }, [user, loading, navigate, location.search]);

  /** Create a new document with a random room ID */
  const handleNewDoc = () => {
    const roomId = nanoid(10);
    navigate(`/doc/${roomId}`);
  };

  const handleCreateFromTemplate = (templateId) => {
    const roomId = nanoid(10);
    if (user) {
      navigate(`/doc/${roomId}?template=${templateId}`);
    } else {
      navigate(`/?redirect=${roomId}&template=${templateId}`, { replace: true });
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
    try {
      const url = new URL(input);
      const pathParts = url.pathname.split('/');
      const docIndex = pathParts.indexOf('doc');
      if (docIndex !== -1 && pathParts[docIndex + 1]) {
        roomId = pathParts[docIndex + 1];
      }
    } catch {
      // Not a URL
    }

    navigate(`/doc/${roomId}`);
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

  return (
    <div className="h-screen bg-[var(--surface-0)] flex flex-col lg:flex-row relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--brand-500)]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-[var(--brand-600)]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* LEFT SECTION: Branding, User & Actions */}
      <aside className="w-full lg:w-[420px] xl:w-[480px] bg-[var(--surface-1)] border-r border-[var(--glass-border)] flex flex-col relative z-20 shadow-2xl transition-all duration-300">
        <div className="p-8 lg:p-12 flex flex-col h-full">
          {/* Logo & Theme Toggle */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-[var(--brand-500)]/20">
                <Layout className="text-white" size={22} strokeWidth={2.5} />
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
            <h1 className="text-4xl xl:text-5xl font-black tracking-tighter text-[var(--text-primary)] mb-4 leading-[1.1]">
              Create. <br />
              <span className="bg-gradient-to-r from-[var(--brand-500)] to-[#7c3aed] bg-clip-text text-transparent">Collaborate.</span>
            </h1>
            <p className="text-sm xl:text-base text-[var(--text-secondary)] font-medium leading-relaxed max-w-[320px]">
              The premium real-time workspace for teams who love clean documentation.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-6">
            <div className="space-y-3">
              <button
                disabled={loading}
                onClick={() => setShowTemplates(true)}
                className="btn btn-primary w-full py-4 text-base rounded-2xl shadow-xl active:scale-[0.98] transition-all"
              >
                <Plus size={20} strokeWidth={2.5} />
                New Document
              </button>
              
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

            {/* Feature small pills */}
            <div className="flex flex-wrap gap-2 pt-8 border-t border-[var(--glass-border)] mb-8">
              {['✍️ Editor', '👥 Live', '📤 PDF'].map(f => (
                <span key={f} className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2.5 py-1 rounded-full border border-[var(--glass-border)] bg-[var(--surface-2)]">{f}</span>
              ))}
            </div>

            {/* User Profile Section (Pinned to bottom) */}
            <div className="mt-auto p-5 rounded-[2rem] bg-[var(--brand-500)]/5 border border-[var(--brand-500)]/10 backdrop-blur-md">
              {loading ? (
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--surface-3)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-[var(--surface-3)] rounded-full" />
                    <div className="h-3 w-16 bg-[var(--surface-3)] rounded-full" />
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
                  <button
                    onClick={signInWithGoogle}
                    className="btn btn-primary w-full !py-3 !text-sm !rounded-2xl"
                  >
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT SECTION: Library Grid */}
      <main className="flex-1 bg-[var(--surface-0)] relative z-10 overflow-y-auto transition-colors duration-300">
        <div className="max-w-6xl mx-auto p-8 lg:p-16">
          {showTemplates ? (
            <div className="animate-fade-in-scale">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Select a template</h3>
                  <button onClick={() => setShowTemplates(false)} className="btn btn-ghost !px-6 !py-2.5 !text-xs !rounded-full bg-[var(--surface-1)] hover:bg-[var(--surface-2)] border border-[var(--glass-border)] text-[var(--text-primary)]">Go Back</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {TEMPLATES.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => handleCreateFromTemplate(t.id)} 
                      className="group bg-[var(--surface-1)] border border-[var(--glass-border)] hover:border-[var(--brand-500)] hover:bg-[var(--surface-2)] transition-all p-7 rounded-[2.5rem] text-left flex gap-6 active:scale-[0.98] relative overflow-hidden shadow-sm"
                    >
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--surface-2)] border border-[var(--glass-border)] shadow-inner group-hover:scale-110 transition-transform">
                        {(() => {
                          const IconComp = ICON_MAP[t.icon] || File;
                          return <IconComp size={32} className="text-[var(--brand-500)]" />;
                        })()}
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="font-bold text-xl text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors">{t.title}</div>
                        <div className="text-xs leading-relaxed text-[var(--text-muted)] mt-1">{t.desc}</div>
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            <section className="animate-fade-in">
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-gradient-brand rounded-full shadow-lg shadow-[var(--brand-500)]/20" />
                    <div>
                      <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Your Document Library</h3>
                      <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Cloud Sync Enabled</p>
                    </div>
                 </div>
                 <div className="hidden sm:block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] bg-[var(--surface-1)] px-4 py-2 rounded-xl border border-[var(--glass-border)]">
                   {recentRooms.length} Documents
                 </div>
              </div>

              {roomsLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                   <div className="w-10 h-10 border-3 border-[var(--brand-500)]/30 border-t-[var(--brand-500)] rounded-full animate-spin" />
                   <span className="text-[10px] font-black tracking-[.4em] uppercase text-[var(--text-muted)]">Syncing Library...</span>
                </div>
              ) : recentRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {recentRooms.map((room) => (
                    <div
                      key={room.id}
                      className="group flex flex-col bg-[var(--surface-1)] border border-[var(--glass-border)] hover:border-[var(--brand-500)]/50 hover:bg-[var(--surface-2)] transition-all rounded-[2rem] p-8 text-left relative overflow-hidden shadow-2xl hover:shadow-[var(--brand-500)]/10 cursor-pointer"
                      onClick={() => navigate(`/doc/${room.id}`)}
                    >
                      {/* Delete Button */}
                      <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                         <button 
                           onClick={(e) => { e.stopPropagation(); setRoomToDelete(room); }}
                           className="w-10 h-10 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
                         >
                           <Trash2 size={20} />
                         </button>
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-[var(--brand-500)]/10 flex items-center justify-center text-[var(--brand-500)] mb-6 border border-[var(--brand-500)]/10 group-hover:scale-110 transition-transform">
                        <File size={24} strokeWidth={2.5} />
                      </div>

                      <h4 className="text-lg font-black text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-500)] transition-colors line-clamp-1">
                        {room.title || 'Untitled Document'}
                      </h4>
                      
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-8 font-medium italic">
                        {room.preview || 'Empty document ready for collaboration...'}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-[var(--glass-border)] flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--brand-500)] group-hover:translate-x-1 transition-all flex items-center gap-2">
                           View <ChevronRight size={14} strokeWidth={3} />
                         </span>
                         <span className="text-[10px] font-bold text-[var(--text-muted)]">
                           {room.updatedAt?.toDate ? new Date(room.updatedAt.toDate()).toLocaleDateString() : 'Just now'}
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 px-12 rounded-[3rem] border-2 border-dashed border-[var(--glass-border)] bg-[var(--surface-1)]">
                   <div className="text-6xl mb-6 opacity-20 flex items-center justify-center"><File size={64} className="text-[var(--text-muted)]" /></div>
                   <h4 className="text-lg font-black text-[var(--text-primary)] mb-2">Workspace is quiet</h4>
                   <p className="text-sm text-[var(--text-muted)] text-center max-w-xs leading-relaxed">Your cloud-synced documents will automatically appear here once created.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal (Premium) */}
      {roomToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[var(--surface-0)]/80 backdrop-blur-xl animate-fade-in" onClick={() => !isDeleting && setRoomToDelete(null)} />
           <div className="relative w-full max-w-md bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-[3rem] shadow-2xl p-10 animate-fade-in-scale">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20 animate-bounce-subtle">
                   <Trash2 size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-black text-[var(--text-primary)] mb-3 tracking-tight">Delete Permanently?</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-10">
                   Confirm deletion of <span className="text-[var(--text-primary)] font-bold">"{roomToDelete.title || 'Untitled Document'}"</span>. This action cannot be reversed.
                </p>
                <div className="flex flex-col gap-3 w-full">
                   <button
                     disabled={isDeleting}
                     onClick={handleDeleteRoom}
                     className={`btn w-full py-4 text-sm font-black rounded-2xl transition-all ${isDeleting ? 'bg-red-500/50' : 'bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 text-white'}`}
                   >
                     {isDeleting ? 'Processing...' : 'Delete Workspace'}
                   </button>
                   <button
                     disabled={isDeleting}
                     onClick={() => setRoomToDelete(null)}
                     className="btn btn-ghost w-full py-4 font-black rounded-2xl text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                   >
                     Keep Document
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
