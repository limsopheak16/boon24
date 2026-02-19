import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
    activeAppMode: AppMode;
    setActiveAppMode: (mode: AppMode) => void;
    onLogout: () => void;
}

const Boon24Logo: React.FC = () => (
  <div className="flex items-center group cursor-pointer transition-all">
    <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm flex flex-col items-center justify-center border border-slate-200 group-hover:border-brand-accent group-hover:shadow-md transition-all duration-300">
      <div className="flex items-baseline leading-none">
        <span className="text-3xl font-[900] tracking-tighter text-brand-accent italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Boon</span>
        <span className="text-3xl font-[900] tracking-tighter ml-1 italic" 
              style={{ 
                color: 'transparent', 
                WebkitTextStroke: '1.5px #1065C0',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}>
          24
        </span>
      </div>
      <div className="w-full h-[2px] bg-slate-100 mt-1.5 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-accent w-1/3 animate-[shimmer_2s_infinite]"></div>
      </div>
      <span className="text-[8px] font-black text-slate-400 tracking-[0.35em] uppercase mt-1.5">
        Architectural Studio
      </span>
    </div>
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(300%); }
      }
    `}</style>
  </div>
);

const NavButton: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void; colorClass?: string }> = ({ children, active, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-[11px] sm:text-xs rounded-xl transition-all duration-300 font-extrabold whitespace-nowrap uppercase tracking-wider ${
      active
        ? (colorClass || 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20 scale-105')
        : 'text-brand-text-secondary hover:bg-slate-100 hover:text-brand-text-primary'
    }`}
  >
    {children}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ activeAppMode, setActiveAppMode, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-brand-border sticky top-0 z-40 animate-fade-in shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
            <Boon24Logo />
            <div className="h-10 w-px bg-slate-200 hidden lg:block mx-2" />
            <div className="hidden xl:flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Engine</span>
              <span className="text-[11px] font-bold text-slate-700">Studio Core V5.2</span>
            </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto max-w-full scrollbar-hide shadow-inner">
            <NavButton active={activeAppMode === 'render'} onClick={() => setActiveAppMode('render')}>Exterior</NavButton>
            <NavButton active={activeAppMode === 'interior'} onClick={() => setActiveAppMode('interior')} colorClass="bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">Boon24 Interior</NavButton>
            <NavButton active={activeAppMode === 'concept'} onClick={() => setActiveAppMode('concept')} colorClass="bg-purple-600 text-white shadow-lg shadow-purple-500/20">New Concept</NavButton>
            <div className="w-px h-5 bg-slate-300 mx-2" />
            <NavButton active={activeAppMode === 'material'} onClick={() => setActiveAppMode('material')} colorClass="bg-amber-600 text-white shadow-lg shadow-amber-500/20">Material Lab</NavButton>
            <NavButton active={activeAppMode === 'newAngle'} onClick={() => setActiveAppMode('newAngle')}>New Angle</NavButton>
            <NavButton active={activeAppMode === 'edit'} onClick={() => setActiveAppMode('edit')}>Two Screen</NavButton>
            <NavButton active={activeAppMode === 'upscale'} onClick={() => setActiveAppMode('upscale')}>Upscale</NavButton>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 shadow-sm hidden sm:flex">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-white"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Core Engine Online</span>
            </div>
            <button 
                onClick={onLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                title="Logout"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
        </div>
      </div>
    </header>
  );
};