import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Globe, Sparkles, FileText, Code, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--text-primary)] overflow-hidden relative selection:bg-[var(--brand-500)]/30">
      {/* Premium Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,var(--brand-500),transparent_50%)] animate-mesh" />
        
        {/* Floating Blobs */}
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[150px] animate-blob [animation-delay:-5s]" />
        <div className="absolute top-[60%] left-[40%] w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px] animate-blob [animation-delay:-10s]" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--glass-border)_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-[var(--brand-500)]/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight">CollabDocs</span>
        </div>
        
        <button 
          onClick={() => navigate('/home')}
          className="btn btn-secondary !rounded-full !px-8 !py-2.5 !text-xs border-[var(--glass-border)] hover:border-[var(--brand-500)]/50 transition-all font-bold backdrop-blur-md"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 md:pt-32 pb-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-500)]/10 border border-[var(--brand-500)]/20 text-[var(--brand-500)] text-[10px] font-black uppercase tracking-widest mb-8 animate-fade-in shadow-sm">
          <Sparkles size={12} />
          <span>Now with AI</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9] animate-slide-up">
          Write together. <br />
          <span className="bg-gradient-to-r from-[var(--brand-500)] via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">Innovate faster.</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] font-medium max-w-2xl mb-12 leading-relaxed animate-fade-in [animation-delay:200ms]">
          A premium real-time workspace for high-performance teams. 
          Create, collaborate, and architect your vision in a seamless environment.
        </p>

        <div className="flex animate-fade-in [animation-delay:400ms]">
          <button 
            onClick={() => navigate('/home')}
            className="group btn btn-primary !h-16 !px-12 !rounded-full !text-base !font-black shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] active:scale-95 transition-all"
          >
            Get Started for Free
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform ml-1" />
          </button>
        </div>

        {/* Feature Grid Brief */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24 md:mt-32 w-full animate-fade-in [animation-delay:600ms]">
          {[
            { icon: <Users className="text-indigo-400" />, title: "Real-time Sync", desc: "Built for instant collaboration with conflict-free editing." },
            { icon: <Sparkles className="text-fuchsia-400" />, title: "AI Powered", desc: "Generate professional document blueprints using Gemini AI." },
            { icon: <Code className="text-emerald-400" />, title: "Code Lab", desc: "A first-class collaborative coding environment." }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-[var(--surface-1)]/40 border border-[var(--glass-border)] backdrop-blur-xl text-left hover:border-[var(--brand-500)]/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                {f.icon}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform relative z-10">
                {f.icon}
              </div>
              <h3 className="text-lg font-black mb-2 relative z-10">{f.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium relative z-10">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--brand-500)]/50 to-transparent" />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--brand-500)]/10 blur-[120px] pointer-events-none" />
    </div>
  );
}
