import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useYjs } from '../hooks/useYjs';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import Toolbar from '../components/Toolbar';
import CodeEditor from '../components/CodeEditor';
import UserPresence from '../components/UserPresence';
import ChatSidebar from '../components/ChatSidebar';
import ExecutionConsole from '../components/ExecutionConsole';
import ExportPanel from '../components/ExportPanel';
import LoginRequired from '../components/LoginRequired';
import AiAssistant from '../components/AiAssistant';
import InviteModal from '../components/InviteModal';
import { Sparkles } from 'lucide-react';


export default function CodePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle, signOutUser } = useAuth();
  const { room, loading: roomLoading, updateTitle, updateRoomType } = useRoom(roomId, 'code');

  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showExport, setShowExport] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [lastChatMessage, setLastChatMessage] = useState(null);
  const [showChatNotif, setShowChatNotif] = useState(false);
  const [localTitle, setLocalTitle] = useState('');
  
  // Execution console state
  const [logs, setLogs] = useState([]);
  const [showConsole, setShowConsole] = useState(false);

  // AI Assistant state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [monacoEditor, setMonacoEditor] = useState(null);


  useEffect(() => {
    if (room && room.type !== 'code') {
      updateRoomType('code');
    }
  }, [room?.type, updateRoomType]);

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

  const getCodeHTML = () => {
    if (!ydoc) return '';
    const code = ydoc.getText('code').toString();
    // Wrap in pre/code for the PDF exporter to recognize it as code
    return `<pre style="background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.5;"><code>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  };

  const getLineCount = () => {
    if (!ydoc) return 0;
    const code = ydoc.getText('code').toString();
    return code.split('\n').length;
  };

  // We no longer redirect automatically
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     navigate(`/?redirect=${roomId}&type=code`, { replace: true });
  //   }
  // }, [authLoading, user, navigate, roomId]);

  // Chat Notifications
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

  const handleRun = () => {
    if (!ydoc) return;
    setShowConsole(true);
    
    if (codeLanguage !== 'javascript') {
      setLogs(prev => [...prev, { 
        type: 'error', 
        content: `Execution for '${codeLanguage}' is not yet supported. Currently only JavaScript is available.`,
        timestamp: Date.now() 
      }]);
      return;
    }

    const code = ydoc.getText('code').toString();
    const newLogs = [];
    
    const customConsole = {
      log: (...args) => {
        newLogs.push({ type: 'log', content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), timestamp: Date.now() });
      },
      error: (...args) => {
        newLogs.push({ type: 'error', content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), timestamp: Date.now() });
      },
      warn: (...args) => {
        newLogs.push({ type: 'log', content: `[WARN] ${args.map(a => String(a)).join(' ')}`, timestamp: Date.now() });
      }
    };

    try {
      const runner = new Function('console', code);
      runner(customConsole);
      setLogs(prev => [...prev, ...newLogs]);
    } catch (err) {
      setLogs(prev => [...prev, ...newLogs, { type: 'error', content: err.message, timestamp: Date.now() }]);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--surface-0)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginRequired onSignIn={signInWithGoogle} title={room?.title || 'this session'} />;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-0)] flex flex-col">
      <Toolbar
        isCodePage={true}
        codeLanguage={codeLanguage}
        onLanguageChange={setCodeLanguage}
        onRun={handleRun}
        onToggleAi={() => setIsAiAssistantOpen(true)}
        onExport={() => setShowExport(true)}
        onToggleChat={() => setShowChat(!showChat)}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOutUser}
        roomId={roomId}
        isConnected={isConnected}
        connectedUsers={connectedUsers}
        onToggleInvite={() => setIsInviteModalOpen(true)}
      />


      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative flex flex-col min-w-0">
          <div className="flex-1 flex flex-col bg-[var(--surface-0)] relative">
            {ydoc && provider ? (
              <CodeEditor
                ydoc={ydoc}
                provider={provider}
                language={codeLanguage}
                onEditorReady={setMonacoEditor}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {showChat && (
        <ChatSidebar
          ydoc={ydoc}
          provider={provider}
          user={user}
          onClose={() => setShowChat(false)}
        />
      )}

      {showExport && (
        <ExportPanel
          getHTML={getCodeHTML}
          getWordCount={getLineCount}
          title={room?.title || 'Untitled Snippet'}
          onClose={() => setShowExport(false)}
          isCode={true}
        />
      )}

      <ExecutionConsole 
        logs={logs} 
        isOpen={showConsole} 
        onClose={() => setShowConsole(false)} 
        onClear={() => setLogs([])}
      />

      <AiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        editor={monacoEditor}
        mode="code"
        variant="sidebar"
      />

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roomId={roomId}
        docTitle={localTitle || 'Untitled Session'}
        isCode={true}
        senderName={user?.displayName || 'A colleague'}
      />

    </div>

  );
}
