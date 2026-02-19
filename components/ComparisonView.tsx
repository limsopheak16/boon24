
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonViewProps {
  before: string;
  after: string;
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ before, after, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onMouseDown = () => (isDragging.current = true);
  const onMouseUp = () => (isDragging.current = false);
  const onMouseMove = (e: React.MouseEvent) => isDragging.current && handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-brand-bg/98 backdrop-blur-3xl flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-brand-border/50 bg-brand-surface/50">
        <div className="flex flex-col text-left">
            <h3 className="text-brand-text-primary text-sm font-black uppercase tracking-[0.3em]">
                {viewMode === 'slider' ? 'Overlay Compare 4K' : 'Side Comparison 4K'}
            </h3>
            <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest mt-1">( TWO SCREEN 4K ENGINE )</span>
        </div>

        <div className="flex bg-brand-bg p-1 rounded-xl border border-brand-border">
            <button 
                onClick={() => setViewMode('slider')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'slider' ? 'bg-brand-accent text-brand-bg' : 'text-brand-text-secondary hover:text-white'}`}
            >
                Slider
            </button>
            <button 
                onClick={() => setViewMode('side-by-side')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'side-by-side' ? 'bg-brand-accent text-brand-bg' : 'text-brand-text-secondary hover:text-white'}`}
            >
                Dual View
            </button>
        </div>

        <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors p-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center p-8 overflow-hidden">
        {viewMode === 'slider' ? (
          <div 
            ref={containerRef}
            className="relative w-full max-w-5xl aspect-video bg-brand-panel rounded-3xl overflow-hidden shadow-2xl border border-white/5 cursor-ew-resize select-none"
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onTouchMove={onTouchMove}
          >
            <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img src={after} alt="After" className="absolute inset-0 w-full h-full object-contain" />
            </div>
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">Original Structure</div>
            <div className="absolute bottom-6 right-6 bg-brand-accent/90 backdrop-blur-md px-4 py-1.5 rounded-lg border border-brand-accent/20 text-[10px] font-black text-brand-bg uppercase tracking-widest">4K Render Output</div>
            <div className="absolute inset-y-0 w-1 bg-brand-accent shadow-xl" style={{ left: `${sliderPos}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center shadow-2xl ring-4 ring-brand-bg">
                <svg className="w-5 h-5 text-brand-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7l-4 5 4 5M16 7l4 5-4 5" /></svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-8 w-full max-w-7xl h-full items-center">
            <div className="flex-1 flex flex-col h-full bg-brand-panel rounded-[2rem] overflow-hidden border border-brand-border/30 relative">
                <img src={before} alt="Before" className="w-full h-full object-contain" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">Input Structure</div>
            </div>
            <div className="flex-1 flex flex-col h-full bg-brand-panel rounded-[2rem] overflow-hidden border border-brand-accent/30 relative shadow-2xl">
                <img src={after} alt="After" className="w-full h-full object-contain" />
                <div className="absolute top-4 left-4 bg-brand-accent/90 backdrop-blur-md px-4 py-1.5 rounded-lg text-[9px] font-black text-brand-bg uppercase tracking-widest">4K Render Output</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 flex justify-center bg-brand-surface/30">
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all border border-white/10">Exit Comparison</button>
      </div>
    </div>
  );
};
