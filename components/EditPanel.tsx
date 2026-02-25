import React, { useState, useEffect, useRef } from 'react';
import { ImageUploader } from './ImageUploader';
import { editImageWithAi } from '../services/openaiService';
import { LoadingSpinner } from './LoadingSpinner';
import { MeasurementCanvas } from './MeasurementCanvas';
import { ComparisonView } from './ComparisonView';

const Panel: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({ title, children, className }) => (
    <div className={`bg-white rounded-[2rem] flex flex-col p-8 border border-slate-100 shadow-xl ${className}`}>
        <h3 className="text-[11px] font-black text-slate-400 mb-8 text-center uppercase tracking-[0.3em] border-b border-slate-50 pb-5">{title}</h3>
        <div className="flex-grow flex flex-col items-center justify-center">
            {children}
        </div>
    </div>
);

const EmptyState: React.FC<{message: string; previewUrl?: string | null}> = ({message, previewUrl}) => (
    <div className="text-center text-slate-400 p-8 flex flex-col items-center justify-center h-full opacity-60 relative w-full overflow-hidden">
        {previewUrl ? (
            <div className="absolute inset-0 opacity-10 blur-sm pointer-events-none">
                <img src={previewUrl} alt="Background ghost" className="w-full h-full object-contain" />
            </div>
        ) : (
            <div className="w-24 h-24 mb-8 rounded-[2rem] bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        )}
        <div className="relative z-10 flex flex-col items-center">
            <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed max-w-[240px] text-center italic">{message}</p>
        </div>
    </div>
);

export const EditPanel: React.FC = () => {
    const [inputImage, setInputImage] = useState<File | null>(null);
    const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
    const [annotationData, setAnnotationData] = useState<string | null>(null);
    const [showAnnotator, setShowAnnotator] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Initializing edit synthesis...");
    const [error, setError] = useState<string | null>(null);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const clickTimeoutRef = useRef<number | null>(null);

    const isEditable = !!inputImage && prompt.length > 0;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
              setIsFullScreen(false);
              setShowComparison(false);
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        };
      }, []);

    const handleInputFileSelect = (file: File | null) => {
        setInputImage(file);
        setAnnotationData(null);
        setResultImage(null);
        if (file) {
            setInputPreviewUrl(URL.createObjectURL(file));
        } else {
            setInputPreviewUrl(null);
        }
    };

    const handleEdit = async () => {
        if (!isEditable || !inputImage) {
            setError('Architectural source and modification prompt required.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultImage(null);
        setLoadingMessage("Synthesizing structural vision from guides...");

        try {
            const result = await editImageWithAi(inputImage, referenceImage, prompt, annotationData, 'Pro');
            if(result) {
                setResultImage(result);
            } else {
                setError('Engine returned empty frame. Retry required.');
            }
        } catch(err: any) {
            if (err.message?.includes("insufficient_quota") || err.message === 'QUOTA_ERROR') {
                setError('PRO Engine access denied. Please check your OpenAI billing settings.');
            } else {
                setError(err instanceof Error ? err.message : 'Autonomous synthesis failure.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const downloadImage = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `boon24-edit-${Date.now()}.png`;
        link.click();
    };
      
    const handleImageClick = (imageUrl: string) => {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
          downloadImage(imageUrl);
        } else {
          clickTimeoutRef.current = window.setTimeout(() => {
            if (imageUrl) {
              setFullScreenImage(imageUrl);
              setIsFullScreen(true);
            }
            clickTimeoutRef.current = null;
          }, 250);
        }
    };

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in p-2">
            {isLoading && <LoadingSpinner message={loadingMessage} />}
            {showAnnotator && inputPreviewUrl && (
                <MeasurementCanvas 
                    imageSrc={inputPreviewUrl} 
                    onSave={(b64) => { setAnnotationData(b64); setShowAnnotator(false); }} 
                    onClose={() => setShowAnnotator(false)} 
                />
            )}
            {showComparison && inputPreviewUrl && resultImage && (
                <ComparisonView before={inputPreviewUrl} after={resultImage} onClose={() => setShowComparison(false)} />
            )}
            
            <Panel title="Architecture Source">
                <div className="w-full flex flex-col gap-8 h-full">
                    <div className="flex-grow">
                        <ImageUploader label="Load Base Photo" onFileSelect={handleInputFileSelect} />
                    </div>
                    {inputPreviewUrl && (
                        <div className="flex flex-col gap-4 animate-slide-in">
                            <button 
                                onClick={() => setShowAnnotator(true)}
                                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border shadow-md ${
                                    annotationData 
                                    ? 'bg-emerald-50 border-emerald-100 text-white' 
                                    : 'bg-white border-brand-accent/30 text-brand-accent hover:bg-brand-accent/5'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                {annotationData ? "Update Drawing Guides" : "Define Precision Guides"}
                            </button>
                            {annotationData && (
                                <div className="relative rounded-[2rem] overflow-hidden border-2 border-brand-accent/20 group shadow-lg transition-transform hover:scale-[1.02] p-1 bg-white">
                                    <img src={annotationData} alt="Drawing preview" className="w-full h-auto max-h-48 object-contain rounded-[1.8rem] bg-slate-50" />
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button onClick={() => setAnnotationData(null)} className="bg-red-500 text-white p-3 rounded-2xl shadow-2xl">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12"/></svg>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 bg-brand-accent text-white text-[9px] font-black uppercase py-1.5 text-center tracking-widest italic">Precision Trace Engine Locked</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Panel>
            
            <Panel title="Modification Console">
                <div className="w-full space-y-8 flex flex-col h-full">
                    <div className="flex-grow">
                        <ImageUploader label="Load Aesthetic Target" onFileSelect={setReferenceImage} />
                    </div>
                    
                    <div className="flex-grow flex flex-col space-y-3">
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between mb-1 shadow-inner">
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Synthesis Mode</span>
                            <span className="text-[9px] font-black text-brand-accent bg-white border border-brand-accent/20 px-3 py-1 rounded-full uppercase italic animate-pulse">4K UHD Master</span>
                        </div>
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Final Directive
                            </label>
                            {annotationData && (
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Guide Tracking Enabled
                                </span>
                            )}
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={8}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent text-xs font-bold flex-grow shadow-inner outline-none transition-all placeholder:text-slate-300 resize-none leading-relaxed text-slate-800"
                            placeholder={annotationData 
                                ? "Command the engine to modify based on your trace guides..." 
                                : "Describe the structural transformation required..."
                            }
                        />
                    </div>
                    
                    <button
                        onClick={handleEdit}
                        disabled={!isEditable || isLoading}
                        className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-black py-5 px-8 rounded-2xl transition-all duration-500 text-[11px] shadow-2xl shadow-brand-accent/20 flex items-center justify-center gap-4 disabled:opacity-30 disabled:scale-95 uppercase tracking-[0.3em]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Execute Studio Master
                    </button>
                </div>
            </Panel>

            <Panel title="Studio Synthesis">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    {error && <div className="text-red-600 bg-red-50 border border-red-100 p-8 rounded-3xl w-full text-center text-[11px] font-black uppercase tracking-widest animate-fade-in shadow-sm">{error}</div>}
                    {!resultImage && !error && <EmptyState message="The synthesized 4K master vision will manifest here." previewUrl={inputPreviewUrl} />}
                    {resultImage && (
                        <div className="relative group cursor-pointer w-full h-full flex flex-col items-center justify-center gap-6 animate-fade-in" onClick={() => handleImageClick(resultImage)}>
                            <div className="w-full flex justify-between items-center px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] italic">Output Sync</h4>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 border border-amber-500/10 px-4 py-1.5 rounded-xl tracking-widest uppercase italic">4K UHD Master</span>
                                </div>
                            </div>

                            <div className="relative w-full flex-grow flex items-center justify-center rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100 group-hover:border-brand-accent/20 transition-all duration-700 p-1.5">
                                <img src={resultImage} alt="Edited result" className="object-contain max-h-[60vh] max-w-full rounded-[2.2rem] transition-transform group-hover:scale-[1.02] duration-1000" />
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 pointer-events-none backdrop-blur-[2px]">
                                    <div className="bg-white/90 px-8 py-4 rounded-[2rem] shadow-2xl border border-slate-100 text-center space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-800">Master Studio Vision</p>
                                        <p className="text-[9px] text-brand-accent font-black tracking-widest uppercase">Double Screen Compare Ready</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 w-full">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowComparison(true); }} 
                                    className="flex-1 bg-brand-accent text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-accent/20 hover:scale-105 active:scale-95"
                                >
                                    Double Screen View
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); downloadImage(resultImage); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:bg-black active:scale-95">Download Master</button>
                            </div>
                        </div>
                    )}
                </div>
            </Panel>

            {isFullScreen && fullScreenImage && (
                <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-12 animate-fade-in" onClick={() => setIsFullScreen(false)}>
                    <img src={fullScreenImage} alt="Edited result fullscreen" className="max-w-full max-h-full object-contain rounded-[3rem] shadow-[0_60px_180px_rgba(0,0,0,0.1)] border border-slate-100" onClick={(e) => e.stopPropagation()} />
                    <button onClick={() => setIsFullScreen(false)} className="absolute top-10 right-10 w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-800 transition-all shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
};