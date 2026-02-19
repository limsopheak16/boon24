import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { ComparisonView } from './ComparisonView';

interface ResultPanelProps {
  inputImage: File | null;
  onImageUpload: (file: File | null) => void;
  generatedImages: string[] | null;
  history: string[];
  onClearHistory?: () => void;
  activeTab: 'result' | 'history';
  setActiveTab: (tab: 'result' | 'history') => void;
  error: string | null;
  groundingUrls?: any[];
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ 
  inputImage, 
  onImageUpload, 
  generatedImages, 
  history, 
  onClearHistory,
  activeTab, 
  setActiveTab, 
  error, 
  groundingUrls = [] 
}) => {
  const [fullImage, setFullImage] = useState<string | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (inputImage) {
      const reader = new FileReader();
      reader.onloadend = () => setInputPreview(reader.result as string);
      reader.readAsDataURL(inputImage);
    } else {
      setInputPreview(null);
    }
  }, [inputImage]);

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `boon24-render-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex-grow bg-white p-6 rounded-[2.5rem] flex flex-col animate-slide-in relative shadow-xl border border-slate-100">
      {/* Comparison Overlay */}
      {showComparison && inputPreview && generatedImages && generatedImages[0] && (
        <ComparisonView 
          before={inputPreview} 
          after={generatedImages[0]} 
          onClose={() => setShowComparison(false)} 
        />
      )}

      <div className="flex justify-between items-center border-b border-slate-100">
        <div className="flex">
            {['result', 'history'].map((tab: any) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                activeTab === tab ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-400 hover:text-brand-text-primary'
                }`}
            >
                {tab === 'result' && generatedImages ? 'Studio Output' : tab === 'result' ? 'Workspace' : 'History'}
            </button>
            ))}
        </div>
        
        {activeTab === 'history' && history.length > 0 && (
            <button 
                onClick={onClearHistory}
                className="mr-6 px-4 py-2 text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Clear Project History
            </button>
        )}
      </div>

      <div className="flex-grow mt-6 overflow-auto bg-slate-50/50 rounded-3xl p-6 flex flex-col scrollbar-hide">
        {activeTab === 'result' ? (
          <div className="flex-grow flex flex-col">
            {error && <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold text-xs uppercase tracking-widest text-center mb-6 shadow-sm">{error}</div>}
            
            {generatedImages ? (
              <div className="space-y-8 animate-fade-in flex flex-col items-center">
                {/* Status Bar */}
                <div className="w-full max-w-4xl flex justify-between items-center px-4 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/30"></div>
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] italic">Render Synthesis Complete</h4>
                    </div>
                    {inputPreview && (
                      <button 
                        onClick={() => setShowComparison(true)}
                        className="flex items-center gap-2 bg-brand-accent/5 hover:bg-brand-accent hover:text-white text-brand-accent border border-brand-accent/20 px-4 py-2 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                        Two Screen Compare
                      </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8 items-start justify-items-center w-full">
                  {generatedImages.map((img, i) => (
                    <div key={i} className="group relative rounded-[2rem] overflow-hidden shadow-2xl bg-white max-w-4xl border border-slate-100 p-1.5 transition-all">
                        <img 
                          src={img} 
                          alt="Render Result" 
                          className="w-full h-auto cursor-zoom-in transition-transform duration-1000 ease-out group-hover:scale-[1.01] rounded-[1.8rem]"
                          onClick={() => setFullImage(img)}
                        />
                        <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
                            <button onClick={(e) => { e.stopPropagation(); downloadImage(img); }} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-brand-accent hover:bg-brand-accent hover:text-white transition-all border border-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                        </div>
                        <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all bg-white/90 backdrop-blur-md px-5 py-2 rounded-xl shadow-lg border border-slate-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent italic">Studio Master V5.2 4K</span>
                        </div>
                    </div>
                  ))}
                </div>

                {groundingUrls.length > 0 && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 animate-fade-in shadow-sm w-full max-w-4xl">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" strokeWidth={2}/></svg>
                        Project Context Grounding
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {groundingUrls.map((chunk, i) => (
                        chunk.web && (
                          <a 
                            key={i} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-brand-accent hover:bg-white transition-all flex items-center gap-2 shadow-sm"
                          >
                            <span className="truncate max-w-[180px]">{chunk.web.title}</span>
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : inputImage ? (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                    <div className="max-w-2xl w-full space-y-6">
                        <div className="relative group rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl bg-white p-2">
                             {inputPreview && <img src={inputPreview} alt="Input" className="w-full h-auto rounded-[2.2rem]" />}
                             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <button 
                                    onClick={() => onImageUpload(null)} 
                                    className="bg-brand-accent text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-transform hover:scale-105"
                                >
                                    Replace Source Document
                                </button>
                             </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1 italic">Engine Calibrated</h3>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Adjust directives in the control panel to initiate synthesis.</p>
                        </div>
                    </div>
                </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-10 space-y-8 animate-fade-in">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-white border-2 border-dashed border-slate-200 flex items-center justify-center group hover:border-brand-accent hover:bg-slate-50 transition-all shadow-inner">
                    <svg className="w-16 h-16 text-slate-300 group-hover:text-brand-accent transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="max-w-lg space-y-4">
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-[0.2em] italic">Project Workspace</h3>
                      <p className="text-xs text-brand-text-secondary font-medium uppercase tracking-tight leading-relaxed max-w-sm mx-auto">Upload a base structure to synthesize, or switch to <strong className="text-brand-accent">Concept AI</strong> mode to generate from pure imagination.</p>
                      
                      <div className="pt-6">
                        <ImageUploader label="Initialize Workspace" onFileSelect={onImageUpload} />
                      </div>
                  </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {history.map((img, i) => (
              <div key={i} className="aspect-square rounded-3xl overflow-hidden cursor-pointer hover:ring-4 ring-brand-accent transition-all shadow-lg border border-slate-100 group relative bg-white">
                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onClick={() => setFullImage(img)} />
                <div className="absolute inset-0 bg-brand-accent/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                   <div className="flex gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setFullImage(img); }}
                            className="bg-white/90 p-2.5 rounded-xl shadow-lg text-slate-800 hover:bg-white transition-all scale-90 group-hover:scale-100"
                            title="View"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); downloadImage(img); }}
                            className="bg-brand-accent p-2.5 rounded-xl shadow-lg text-white hover:bg-brand-accent-hover transition-all scale-90 group-hover:scale-100"
                            title="Download"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        </button>
                   </div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
                <div className="col-span-full py-32 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                    Project history is currently empty
                </div>
            )}
          </div>
        )}
      </div>

      {fullImage && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-8 animate-fade-in" onClick={() => setFullImage(null)}>
          <img src={fullImage} className="max-w-full max-h-full object-contain rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200" />
          <button className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-brand-text-primary transition-all shadow-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};