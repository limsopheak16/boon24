import React, { useState } from 'react';

const Boon24LogoLarge: React.FC = () => (
  <div className="flex flex-col items-center mb-10">
    <div className="bg-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center border border-slate-100 mb-8 transition-transform hover:scale-105 duration-500">
      <div className="flex items-baseline leading-none">
        <span className="text-5xl font-[900] tracking-tighter text-brand-accent italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Boon</span>
        <span className="text-5xl font-[900] tracking-tighter ml-1.5 italic" 
              style={{ 
                color: 'transparent', 
                WebkitTextStroke: '2px #1065C0',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}>
          24
        </span>
      </div>
      <div className="w-24 h-[3px] bg-brand-accent/10 mt-3 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-accent w-1/2 animate-[shimmer_3s_infinite]"></div>
      </div>
      <span className="text-[10px] font-black text-slate-400 tracking-[0.45em] uppercase mt-3 italic">
        Architectural Studio
      </span>
    </div>
    <div className="flex items-center gap-4">
        <div className="h-px w-10 bg-slate-200"></div>
        <h2 className="text-slate-800 text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Studio Authentication</h2>
        <div className="h-px w-10 bg-slate-200"></div>
    </div>
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(300%); }
      }
    `}</style>
  </div>
);

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const AUTH_E = "Ym9vbjI0OTk=";
  const AUTH_P = "Z29vZHN0dWRlbnQ5OTI0";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    setTimeout(() => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        if (cleanEmail === window.atob(AUTH_E) && cleanPassword === window.atob(AUTH_P)) {
          localStorage.setItem('boon24_auth', 'true');
          onLogin();
        } else {
          setError('Invalid architectural credentials provided.');
          setIsAuthenticating(false);
        }
      } catch (err) {
        setError('Authentication engine failure.');
        setIsAuthenticating(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-brand-bg flex items-center justify-center p-6 z-[1000]">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1065C0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/5 blur-[160px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[160px] rounded-full" />
      
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-[3.5rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-accent"></div>
        
        <Boon24LogoLarge />

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Studio Identifier</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isAuthenticating}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent outline-none transition-all placeholder:text-slate-300 disabled:opacity-50 shadow-inner"
              placeholder="Boon2499"
              required
            />
          </div>

          <div className="space-y-2.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Access Cipher</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAuthenticating}
              autoComplete="current-password"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent outline-none transition-all placeholder:text-slate-300 disabled:opacity-50 shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black text-center uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isAuthenticating}
            className={`w-full font-black py-5 px-8 rounded-2xl transition-all duration-500 text-[11px] shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.3em] ${
              isAuthenticating 
              ? 'bg-emerald-600 text-white cursor-wait' 
              : 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-brand-accent/30 hover:scale-[1.02]'
            }`}
          >
            {isAuthenticating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Engine Syncing...
              </>
            ) : (
              <>
                Initialize Studio Session
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold leading-relaxed">
            Authorized Personnel Access Only
            <br />
            <span className="opacity-50">Studio Core V5.2.09 &copy; Boon24</span>
          </p>
        </div>
      </div>
    </div>
  );
};