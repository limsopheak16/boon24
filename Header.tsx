
import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
    activeAppMode: AppMode;
    setActiveAppMode: (mode: AppMode) => void;
    onLogout: () => void;
}

const Boon24Logo: React.FC = () => (
  <div className="flex items-center group cursor-pointer transition-all hover:opacity-90">
    <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex flex-col items-center justify-center border border-white/20">
      <div className="flex items-baseline leading-none">
        <span className="text-2xl font-[900] tracking-tighter text-[#1065C0] italic" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Boon</span>
        <span className="text-2xl font-[900] tracking-tighter ml-0.5 italic" 
              style={{ 
                color: 'transparent', 
                WebkitTextStroke: '1.2px #1065C0',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
          24
        </span>
      </div>
      <span className="text-[7px] font-bold text-[#666] tracking-[0.25em] uppercase mt-1">
        Architecture Design
      </span>
    </div>
  </div>
);

const NavButton: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void; colorClass?: string }> = ({ children, active, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-[11px] sm:text-xs rounded-md transition-all duration-200 font-bold whitespace-nowrap ${
      active
        ? (colorClass || 'bg-brand-accent text-brand-bg shadow-lg shadow-brand-accent/20')
        : 'text-brand-text-secondary hover:bg-brand-surface/80 hover:text-brand-text-primary'
    }`}
  >
    {children}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ activeAppMode, setActiveAppMode, onLogout }) => {
  return (
    <header className="bg-brand-bg/90 backdrop-blur-md border-b border-brand-border sticky top-0 z-10 animate-fade-in shadow-xl">
      <div className="container mx-auto px-4 py-2 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <Boon24Logo />
        </div>
        
        <div className="flex items-center gap-1.5 bg-brand-panel/50 p-1.5 rounded-xl border border-brand-border/50 overflow-x-auto max-w-full scrollbar-hide">
            <NavButton active={activeAppMode === 'render'} onClick={() => setActiveAppMode('render')}>Exterior</NavButton>
            <NavButton active={activeAppMode === 'interior'} onClick={() => setActiveAppMode('interior')} colorClass="bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">Boon24 Interior</NavButton>
            <NavButton active={activeAppMode === 'concept'} onClick={() => setActiveAppMode('concept')} colorClass="bg-purple-600 text-white shadow-lg shadow-purple-500/20">New Concept</NavButton>
            <div className="w-px h-4 bg-brand-border mx-1" />
            <NavButton active={activeAppMode === 'material'} onClick={() => setActiveAppMode('material')} colorClass="bg-amber-600 text-white shadow-lg shadow-amber-500/20">Material Lab</NavButton>
            <NavButton active={activeAppMode === 'newAngle'} onClick={() => setActiveAppMode('newAngle')}>New Angle</NavButton>
            <NavButton active={activeAppMode === 'edit'} onClick={() => setActiveAppMode('edit')}>Two Screen</NavButton>
            <NavButton active={activeAppMode === 'upscale'} onClick={() => setActiveAppMode('upscale')}>Upscale</NavButton>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-bg rounded-full border border-brand-border/50 shadow-inner hidden sm:flex">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">Engine V5.0 Active</span>
            </div>
            <button 
                onClick={onLogout}
                className="p-2 text-brand-text-secondary hover:text-red-400 transition-colors"
                title="Logout"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
        </div>
      </div>
    </header>
  );
};
