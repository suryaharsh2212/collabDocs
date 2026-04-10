import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useYjs } from '../hooks/useYjs';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { getTemplateById } from '../lib/templates';
import Toolbar from '../components/Toolbar';
import Editor from '../components/Editor';
import UserPresence from '../components/UserPresence';
import ExportPanel from '../components/ExportPanel';
import ChatSidebar from '../components/ChatSidebar';
import SnippetSidebar from '../components/SnippetSidebar';
import Sidebar from '../components/Sidebar';
import AiAssistant from '../components/AiAssistant';
import LoginRequired from '../components/LoginRequired';
import PageGuides from '../components/PageGuides';
import FindReplace from '../components/FindReplace';
import ContextMenus from '../components/ContextMenus';
import InviteModal from '../components/InviteModal';
import { ChevronRight, Minimize2 } from 'lucide-react';


export default function DocPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle, signOutUser } = useAuth();
  const { room, loading: roomLoading, updateTitle, updateContent, updateRoomType } = useRoom(roomId, 'doc');

  useEffect(() => {
    if (room && room.type !== 'doc') {
      updateRoomType('doc');
    }
  }, [room?.type, updateRoomType]);

  const [showExport, setShowExport] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tiptapEditor, setTiptapEditor] = useState(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('outline');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);


  
  const [lastChatMessage, setLastChatMessage] = useState(null);
  const [showChatNotif, setShowChatNotif] = useState(false);
  const [localTitle, setLocalTitle] = useState('');

  useEffect(() => {
    if (room?.title) {
      setLocalTitle(room.title);
    }
  }, [room?.title]);

  const userInfo = {
    name: user?.displayName || 'Guest',
    color: undefined,
  };
  const { ydoc, provider, connectedUsers, isConnected, updateUser } = useYjs(roomId, userInfo);

  useEffect(() => {
    if (user) {
      updateUser({ name: user.displayName || 'User' });
    } else {
      updateUser({ name: 'Guest' });
    }
  }, [user, updateUser]);

  const handleTitleBlur = () => {
    const finalTitle = localTitle.trim() || '';
    if (finalTitle !== room?.title) {
      updateTitle(finalTitle);
    }
    setLocalTitle(finalTitle);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const getEditorHTML = () => {
    if (tiptapEditor) {
      return tiptapEditor.getHTML();
    }
    return '<p>No content</p>';
  };

  const getWordCount = () => {
    if (tiptapEditor) {
      const text = tiptapEditor.getText();
      return text.trim() ? text.trim().split(/\s+/).length : 0;
    }
    return 0;
  };

  useEffect(() => {
    const handleMagicFormat = () => {
      if (!tiptapEditor) return;

      const lines = tiptapEditor.getText().split('\n');
      let newHtml = '';
      let processed = false;

      lines.forEach(line => {
        const trimmed = line.trim();
        const apiMatch = trimmed.match(/^api\s+(\S+)\s+(get|post|put|delete|patch)\s*(.*)$/i);
        
        if (apiMatch) {
          processed = true;
          const [, name, method, paramsStr] = apiMatch;
          const params = paramsStr.split(/\s+/).filter(p => p.length > 0);
          
          newHtml += `<h2>API: ${name.toUpperCase()}</h2>`;
          newHtml += `<blockquote><strong>Method:</strong> <span style="background: ${method.toLowerCase() === 'post' ? '#10b981' : '#3b82f6'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${method.toUpperCase()}</span></blockquote>`;
          newHtml += `<p>Auto-generated reference for <code>${name}</code>.</p>`;
          
          if (params.length > 0) {
            newHtml += `<table><thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead><tbody>`;
            params.forEach(p => {
              newHtml += `<tr><td><code>${p}</code></td><td>String</td><td>...</td></tr>`;
            });
            newHtml += `</tbody></table>`;
          }
          newHtml += `<p></p>`;
        } else {
          newHtml += `<p>${line}</p>`;
        }
      });

      if (processed) {
        tiptapEditor.commands.setContent(newHtml);
      }
    };

    window.addEventListener('collabdocs:magic-format', handleMagicFormat);
    return () => window.removeEventListener('collabdocs:magic-format', handleMagicFormat);
  }, [tiptapEditor]);

  useEffect(() => {
    const handleOpenAi = () => setIsAiAssistantOpen(true);
    window.addEventListener('collabdocs:open-ai', handleOpenAi);
    return () => window.removeEventListener('collabdocs:open-ai', handleOpenAi);
  }, []);

  const handleOpenInvite = () => {
    setIsInviteModalOpen(true);
  };



  useEffect(() => {
    if (tiptapEditor) {
      const params = new URLSearchParams(window.location.search);
      const templateId = params.get('template');
      const isAI = params.get('ai');
      
      const isBlank = tiptapEditor.isEmpty || tiptapEditor.getText().trim().length === 0;
      if (!isBlank) return;

      if (templateId) {
        const template = getTemplateById(templateId);
        if (template && template.html) {
          tiptapEditor.commands.setContent(template.html);
        }
      } else if (isAI) {
        const data = sessionStorage.getItem(`pending_ai_content_${roomId}`);
        if (data) {
          const { title, html } = JSON.parse(data);
          updateTitle(title);
          tiptapEditor.commands.setContent(html);
          sessionStorage.removeItem(`pending_ai_content_${roomId}`);
        }
      }
      
      window.history.replaceState({}, '', `/doc/${roomId}`);
    }
  }, [tiptapEditor, roomId, updateTitle]);

  useEffect(() => {
    if (!tiptapEditor) return;

    let timeoutId;

    const handleUpdate = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const html = tiptapEditor.getHTML();
        const textSnippet = tiptapEditor.getText().substring(0, 150);
        updateContent(html, textSnippet);
      }, 3000);
    };

    tiptapEditor.on('update', handleUpdate);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      tiptapEditor.off('update', handleUpdate);
    };
  }, [tiptapEditor, updateContent]);

  useEffect(() => {
    if (!ydoc) return;
    const ychat = ydoc.getArray('chatMessages');
    
    const observer = (event) => {
      if (showChat) return;

      const added = event.changes.added;
      if (added.size > 0) {
        const lastMsg = ychat.get(ychat.length - 1);
        
        if (lastMsg && lastMsg.senderId !== provider?.awareness.clientID) {
          setLastChatMessage(lastMsg);
          setShowChatNotif(true);
          const timer = setTimeout(() => setShowChatNotif(false), 6000);
          return () => clearTimeout(timer);
        }
      }
    };

    ychat.observe(observer);
    return () => ychat.unobserve(observer);
  }, [ydoc, showChat, provider?.awareness.clientID]);

  useEffect(() => {
    if (showChat) setShowChatNotif(false);
  }, [showChat]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--surface-0)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginRequired onSignIn={signInWithGoogle} title={room?.title || 'this document'} />;
  }

  return (
    <div className={`h-screen overflow-hidden bg-[var(--surface-0)] flex flex-col ${isFullscreen ? 'blank-mode' : ''}`}>
      {!isFullscreen && (
        <Toolbar
          isCodePage={false}
          tiptapEditor={tiptapEditor}
          onExport={() => setShowExport(true)}
          onToggleChat={() => {
            setShowChat((prev) => !prev);
            setShowSnippets(false);
          }}
          onToggleSnippets={() => {
            setShowSnippets((prev) => !prev);
            setShowChat(false);
          }}
          user={user}
          onSignIn={signInWithGoogle}
          onSignOut={signOutUser}
          roomId={roomId}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          onToggleAi={() => setIsAiAssistantOpen(true)}
          title={localTitle}
          onTitleChange={setLocalTitle}
          onTitleBlur={handleTitleBlur}
          onToggleFind={() => setShowFindReplace((prev) => !prev)}
          onToggleInvite={handleOpenInvite}
        />
      )}

      {showFindReplace && tiptapEditor && (
        <FindReplace 
          editor={tiptapEditor} 
          onClose={() => setShowFindReplace(false)} 
        />
      )}

      {isFullscreen && (
        <button 
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 p-2 glass rounded-full opacity-0 hover:opacity-100 transition-opacity"
          title="Exit Fullscreen"
        >
           <Minimize2 size={16} />
        </button>
      )}

      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Side: Global Document Controls Sidebar */}
        {!isFullscreen && (
          <Sidebar 
            editor={tiptapEditor} 
            isVisible={showSidebar} 
            onClose={() => setShowSidebar(false)} 
            activeTab={sidebarTab}
            onTabChange={setSidebarTab}
            showLineNumbers={showLineNumbers}
            onToggleLineNumbers={() => setShowLineNumbers(!showLineNumbers)}
            showPageNumbers={showPageNumbers}
            onTogglePageNumbers={() => setShowPageNumbers(!showPageNumbers)}
          />

        )}
        
        {/* Toggle Sidebar Button (when hidden) */}
        {!showSidebar && !isFullscreen && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-4 h-16 bg-[var(--surface-2)] border border-l-0 border-[var(--glass-border)] rounded-r-md flex items-center justify-center hover:bg-indigo-500/20 text-[var(--text-muted)] transition-all"
          >
            <ChevronRight size={12} />
          </button>
        )}

        <div className="flex-1 relative flex flex-col min-w-0">
          {!isFullscreen && (
            <div className="px-4 py-1.5 flex items-center justify-between text-xs border-b border-[var(--surface-3)]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} ${isConnected ? 'animate-pulse' : ''}`} />
                  <span className="text-[var(--text-muted)]">
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="text-[var(--text-muted)]">
                  Room: <span className="text-[var(--text-secondary)] font-mono">{roomId}</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                {showChatNotif && lastChatMessage && (
                  <div 
                    className="chat-notification-pill group"
                    onClick={() => {
                      setShowChat(true);
                      setShowChatNotif(false);
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="opacity-80">New message from</span>
                    <span className="font-black text-white">{lastChatMessage.author}</span>
                    <span className="mx-1">•</span>
                    <span className="opacity-90 italic">"{lastChatMessage.text.length > 20 ? lastChatMessage.text.substring(0, 20) + '...' : lastChatMessage.text}"</span>
                  </div>
                )}
                <UserPresence connectedUsers={connectedUsers} />
              </div>
            </div>
          )}

          <div className={`flex-1 overflow-auto flex flex-col bg-[var(--surface-0)] ${isFullscreen ? 'pt-20' : ''} ${showLineNumbers ? 'show-line-numbers' : ''}`}>
            {ydoc && provider ? (
              <div className="doc-workspace">
                <div className={`doc-paper animate-fade-in ${isFullscreen ? 'fullscreen-paper' : ''}`}>
                  <PageGuides editor={tiptapEditor} showNumbers={showPageNumbers} />
                  <ContextMenus editor={tiptapEditor} />
                  <Editor
                    ydoc={ydoc}
                    provider={provider}
                    roomId={roomId}
                    onEditorReady={setTiptapEditor}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-[var(--text-muted)]">Initializing editor...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AiAssistant 
        isOpen={isAiAssistantOpen} 
        onClose={() => setIsAiAssistantOpen(false)} 
        editor={tiptapEditor} 
      />

      {!isFullscreen && showChat && (
        <ChatSidebar
          ydoc={ydoc}
          provider={provider}
          user={user}
          onClose={() => setShowChat(false)}
        />
      )}

      {!isFullscreen && showSnippets && (
        <SnippetSidebar
          tiptapEditor={tiptapEditor}
          onClose={() => setShowSnippets(false)}
        />
      )}

      {showExport && (
        <ExportPanel
          getHTML={getEditorHTML}
          getWordCount={getWordCount}
          title={room?.title || 'Untitled Document'}
          onClose={() => setShowExport(false)}
        />
      )}

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roomId={roomId}
        docTitle={localTitle || 'Untitled Document'}
        isCode={false}
        senderName={user?.displayName || 'A User From CollabDocs'}
      />

    </div>

  );
}

