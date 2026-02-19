import React, { useState, useRef, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { editImageWithAi } from '../services/geminiService';
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            </div>
        )}
        <div className="relative z-10 flex flex-col items-center">
            <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed max-w-[240px] text-center italic">{message}</p>
        </div>
    </div>
);

export const MaterialPanel: React.FC = () => {
    const [inputImage, setInputImage] = useState<File | null>(null);
    const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
    const [annotationData, setAnnotationData] = useState<string | null>(null);
    const [showAnnotator, setShowAnnotator] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    
    const [materialImage, setMaterialImage] = useState<File | null>(null);
    const [materialPrompt, setMaterialPrompt] = useState('');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Preparing material shaders...");
    const [error, setError] = useState<string | null>(null);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    const canApply = !!inputImage && (materialPrompt.length > 0 || !!materialImage);

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

    const handleApplyMaterial = async () => {
        if (!canApply || !inputImage) {
            setError('Provide a base image and material definition.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultImage(null);
        setLoadingMessage("Applying physically-based material to selected surfaces...");

        const finalPrompt = `APPLY MATERIAL: ${materialPrompt}. ${materialImage ? 'Use the uploaded photo as the exact texture reference for the material.' : ''} Ensure the material follows the perspective, lighting, and scale of the original surface. If highlighted areas are provided, apply only to those regions.`;

        try {
            const result = await editImageWithAi(inputImage, materialImage, finalPrompt, annotationData, 'Pro');
            if(result) {
                setResultImage(result);
            } else {
                setError('Failed to apply material. Engine timeout.');
            }
        } catch(err: any) {
            if (err.message?.includes("Requested entity was not found") || err.message === 'PRO_KEY_ERROR') {
                setError('Material Lab requires an active Pro key.');
                await window.aistudio.openSelectKey();
            } else {
                setError(err instanceof Error ? err.message : 'Transformation failure.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const downloadImage = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `material-lab-${Date.now()}.png`;
        link.click();
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
            
            <Panel title="Base Architectural Photo">
                <div className="w-full flex flex-col gap-8 h-full">
                    <div className="flex-grow">
                        <ImageUploader label="Upload Base Image" onFileSelect={handleInputFileSelect} />
                    </div>
                    {inputPreviewUrl && (
                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => setShowAnnotator(true)}
                                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border shadow-md ${
                                    annotationData 
                                    ? 'bg-amber-50 border-amber-100 text-white' 
                                    : 'bg-white border-brand-accent/30 text-brand-accent hover:bg-brand-accent/5'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                {annotationData ? "Update Surface Selection" : "Highlight Surface Area"}
                            </button>
                            {annotationData && (
                                <div className="relative rounded-[2rem] overflow-hidden border-2 border-brand-accent/20 p-1 shadow-lg bg-white">
                                    <img src={annotationData} alt="Selection" className="w-full h-auto max-h-48 object-contain rounded-[1.8rem] bg-slate-50" />
                                    <div className="absolute bottom-0 inset-x-0 bg-brand-accent text-brand-bg text-[9px] font-black uppercase py-1.5 text-center tracking-widest italic">Target Surface Locked</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Panel>
            
            <Panel title="Material Definition">
                <div className="w-full space-y-8 flex flex-col h-full">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Option 1: Texture Sample (Photo)</label>
                        <ImageUploader label="Upload Material Photo" onFileSelect={setMaterialImage} />
                    </div>
                    
                    <div className="flex-grow flex flex-col space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Option 2: Material Description (Text)</label>
                        <textarea
                            value={materialPrompt}
                            onChange={(e) => setMaterialPrompt(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent text-xs font-bold flex-grow shadow-inner outline-none transition-all placeholder:text-slate-300 resize-none leading-relaxed text-slate-800"
                            placeholder="e.g., polished dark walnut wood with horizontal grain..."
                        />
                    </div>
                    
                    <button
                        onClick={handleApplyMaterial}
                        disabled={!canApply || isLoading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 text-[11px] shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-4 disabled:opacity-30 uppercase tracking-[0.3em]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        Apply Material Shaders
                    </button>
                </div>
            </Panel>

            <Panel title="Material Result">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    {error && <div className="text-red-600 bg-red-50 border border-red-100 p-8 rounded-3xl w-full text-center text-[11px] font-black uppercase tracking-widest shadow-sm">{error}</div>}
                    {!resultImage && !error && <EmptyState message="The material-modified vision will manifest here." previewUrl={inputPreviewUrl} />}
                    {resultImage && (
                        <div className="relative group cursor-pointer w-full h-full flex flex-col items-center justify-center gap-6 animate-fade-in">
                            <div className="w-full flex justify-between items-center px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-pulse shadow-lg shadow-brand-accent/50"></div>
                                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] italic">Output Sync</h4>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 border border-amber-500/10 px-4 py-1.5 rounded-xl tracking-widest uppercase italic">4K Material Lab</span>
                                </div>
                            </div>
                            <div className="relative w-full flex-grow flex items-center justify-center rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100 group-hover:border-brand-accent/20 transition-all duration-700 p-1.5">
                                <img src={resultImage} alt="Material result" className="object-contain max-h-[60vh] max-w-full rounded-[2.2rem] transition-transform group-hover:scale-[1.02] duration-1000" />
                            </div>
                            <div className="flex gap-4 w-full">
                                <button 
                                    onClick={() => setShowComparison(true)} 
                                    className="flex-1 bg-brand-accent text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-accent/20 hover:scale-105"
                                >
                                    Compare
                                </button>
                                <button onClick={() => downloadImage(resultImage)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl">Download</button>
                            </div>
                        </div>
                    )}
                </div>
            </Panel>

            {isFullScreen && fullScreenImage && (
                <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-12" onClick={() => setIsFullScreen(false)}>
                    <img src={fullScreenImage} alt="Result" className="max-w-full max-h-full object-contain rounded-[3rem] shadow-2xl border border-slate-100" />
                </div>
            )}
        </div>
    );
};