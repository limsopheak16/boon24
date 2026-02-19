import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { RenderOptions, ModelQuality, RenderMode, CreativityLevel, ObjectIntensity, SunlightAngle, SunTemperature } from '../types';

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const SunCompass: React.FC<{ rotation: number; height: number }> = ({ rotation, height }) => {
    const shadowLength = Math.max(0, (90 - height) / 90) * 35;
    const shadowOpacity = Math.max(0.1, (90 - height) / 90) * 0.25;

    return (
        <div className="flex flex-col items-center py-6 bg-slate-50 border border-slate-200 rounded-[2rem] mb-4 shadow-inner relative overflow-hidden group">
            <div className="absolute top-3 left-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Live Light Orbit</span>
            </div>
            
            <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-[3px] border-slate-200 rounded-full border-dashed opacity-50" />
                
                <div className="relative z-20 w-10 h-10 bg-white border-2 border-slate-100 rounded-lg shadow-lg flex items-center justify-center">
                    <Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" className="w-5 h-5 text-slate-400" />
                </div>

                <div 
                    className="absolute z-10 origin-bottom transition-all duration-300 ease-out"
                    style={{ 
                        height: `${shadowLength}px`, 
                        width: '18px',
                        background: `linear-gradient(to top, rgba(15, 23, 42, ${shadowOpacity}), transparent)`,
                        bottom: '50%',
                        left: 'calc(50% - 9px)',
                        transformOrigin: 'bottom center',
                        transform: `rotate(${rotation + 180}deg)`,
                        filter: 'blur(3px)',
                        borderRadius: '10px 10px 0 0'
                    }} 
                />

                <div 
                    className="absolute inset-0 transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-6 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)] border-2 border-white flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-white rounded-full opacity-40 blur-[1px]" />
                        </div>
                    </div>
                </div>

                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-300 uppercase">N</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-300 uppercase">S</span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300 uppercase">W</span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300 uppercase">E</span>
            </div>
        </div>
    );
};

const IntensitySlider: React.FC<{
    label: string;
    value: string;
    options?: readonly string[];
    onChange: (val: any) => void;
}> = ({ label, value, options, onChange }) => {
    const levels = options || ['None', 'Low', 'Moderate', 'High'];
    const currentIndex = levels.indexOf(value as any);

    return (
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 group hover:border-brand-accent/30 transition-all shadow-sm">
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">{label}</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest ${value === 'None' || value === 'Center' || value === 'Front' ? 'bg-slate-200 text-slate-500' : 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'}`}>
                    {value}
                </span>
            </div>
            <div className="relative h-6 flex items-center pt-1">
                <div className="absolute w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-accent transition-all duration-300 ease-out shadow-[0_0_8px_rgba(16,101,192,0.3)]" 
                        style={{ width: `${(currentIndex / (levels.length - 1)) * 100}%` }}
                    />
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max={levels.length - 1} 
                    step="1"
                    value={currentIndex}
                    onChange={(e) => onChange(levels[parseInt(e.target.value)])}
                    className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute w-5 h-5 bg-white border-2 border-brand-accent rounded-full shadow-md pointer-events-none transition-all duration-300"
                    style={{ left: `calc(${(currentIndex / (levels.length - 1)) * 100}% - 10px)` }}
                />
            </div>
        </div>
    );
};

const FineSlider: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    unit?: string;
    onChange: (val: number) => void;
}> = ({ label, value, min, max, unit = "", onChange }) => (
    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 group hover:border-brand-accent/30 transition-all shadow-sm">
        <div className="flex justify-between items-center">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">{label}</span>
            <span className="text-[10px] font-black text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-md border border-brand-accent/20">
                {value}{unit}
            </span>
        </div>
        <div className="relative h-6 flex items-center pt-1">
            <div className="absolute w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-accent transition-all duration-300 ease-out" 
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
            />
            <div 
                className="absolute w-5 h-5 bg-white border-2 border-brand-accent rounded-full shadow-sm pointer-events-none transition-all duration-300"
                style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 10px)` }}
            />
        </div>
    </div>
);

const CollapsibleSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-5 text-left group">
                <div className="flex items-center gap-4">
                    <div className="text-brand-accent p-2 bg-brand-accent/5 rounded-lg group-hover:bg-brand-accent/10 transition-colors">{icon}</div>
                    <h4 className="font-black text-[13px] text-slate-800 tracking-widest uppercase italic">{title}</h4>
                </div>
                <Icon path={isOpen ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
            </button>
            {isOpen && <div className="pb-6 px-1 space-y-5 animate-fade-in">{children}</div>}
        </div>
    );
};

const SelectControl: React.FC<{
  label: string;
  name: string;
  value: string;
  options: readonly string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, name, value, options, onChange }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-xs font-bold text-slate-800 appearance-none focus:ring-2 focus:ring-brand-accent/10 focus:border-brand-accent transition-all cursor-pointer group-hover:border-slate-300 shadow-sm"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Icon path="M19 9l-7 7-7-7" className="w-4 h-4" />
        </div>
    </div>
  </div>
);

const QualitySelector: React.FC<{
    quality: ModelQuality;
    setQuality: (q: ModelQuality) => void;
}> = ({ quality, setQuality }) => (
    <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 border border-slate-200 shadow-inner">
        <button
            onClick={() => setQuality('Standard')}
            className={`flex-1 text-[11px] font-black py-3 rounded-xl transition-all uppercase tracking-[0.2em] ${
                quality === 'Standard' ? 'bg-white text-brand-accent shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
            }`}
        >
            Standard
        </button>
        <button
            onClick={() => setQuality('Pro')}
            className={`flex-1 text-[11px] font-black py-3 rounded-xl transition-all uppercase tracking-[0.2em] ${
                quality === 'Pro' ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20' : 'text-slate-500 hover:text-slate-800'
            }`}
        >
            PRO UHD
        </button>
    </div>
);

const sunlightAngleOptions: SunlightAngle[] = ['Front', 'Back', 'Left', 'Right'];

export const Sidebar: React.FC<{
  renderOptions: RenderOptions;
  setRenderOptions: React.Dispatch<React.SetStateAction<RenderOptions>>;
  onResetControls: () => void;
  onRender: () => void;
}> = ({ renderOptions, setRenderOptions, onResetControls, onRender }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRenderOptions(prev => ({ ...prev, [name]: value }));
  };

  const isConceptMode = renderOptions.creativityLevel === 'Creative';
  const isInteriorMode = renderOptions.renderMode === 'Interior';
  const canRender = !!renderOptions.inputImage || isConceptMode;

  const filteredMoodStyles = !isInteriorMode 
    ? ['neutral', 'Dark & Moody', 'Bright & Airy', 'Vibrant', 'Ethereal', 'Cinematic', 'BONA exterior'] 
    : ['neutral', 'Dark & Moody', 'Bright & Airy', 'Vibrant', 'Ethereal', 'Cinematic'];

  const renderStyleOptions = [
    'Bona Nano Banana Boon24 Corona',
    'Corona 11: Real-World PBR Material',
    'Corona 11: Interior Soft Daylight',
    'Corona 11: Cinematic Dusk Archviz',
    'Corona 11: Exterior Sun & Sky',
    'V-Ray 6: Ultra Photoreal 4K',
    '3ds Max: Raw Clay Render',
    '3ds Max: Wireframe Technical'
  ];

  const applyTimePreset = (preset: string) => {
    switch (preset) {
        case 'Morning':
            setRenderOptions(p => ({ ...p, timeOfDay: 'Morning', sunHeight: 15, sunRotation: 45, sunIntensityFine: 70, sunTemperature: 'Neutral' }));
            break;
        case 'Noon':
            setRenderOptions(p => ({ ...p, timeOfDay: 'Noon', sunHeight: 85, sunRotation: 0, sunIntensityFine: 100, sunTemperature: 'Neutral' }));
            break;
        case 'Evening':
            setRenderOptions(p => ({ ...p, timeOfDay: 'Evening', sunHeight: 10, sunRotation: 180, sunIntensityFine: 60, sunTemperature: 'Warm' }));
            break;
        case 'Golden Hour':
            setRenderOptions(p => ({ ...p, timeOfDay: 'Golden Hour', sunHeight: 5, sunRotation: 210, sunIntensityFine: 90, sunTemperature: 'Warm' }));
            break;
        case 'Night':
            setRenderOptions(p => ({ ...p, timeOfDay: 'Night', sunHeight: 0, sunRotation: 0, sunIntensityFine: 10, sunTemperature: 'Cool' }));
            break;
    }
  };

  return (
    <aside className="w-full md:w-[420px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 animate-slide-in overflow-hidden shadow-xl relative">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full border border-white/50 shadow-sm ${isConceptMode ? 'bg-indigo-500' : isInteriorMode ? 'bg-emerald-500' : 'bg-brand-accent'} animate-pulse`} />
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.25em] italic">
                Studio Configuration
            </h2>
        </div>
        <button onClick={onResetControls} className="text-[10px] font-black text-slate-400 hover:text-brand-accent uppercase tracking-widest transition-colors">Reset</button>
      </div>

      <div className="flex-grow overflow-y-auto px-6 pb-12 scrollbar-hide">
        <div className="py-8 space-y-6 border-b border-slate-100">
            <ImageUploader 
                label={isConceptMode ? "Initialize Concept Base" : "Import Source Structure"} 
                onFileSelect={(f) => setRenderOptions(p => ({ ...p, inputImage: f }))} 
            />
            
            <CollapsibleSection title="PBR Material Lab" defaultOpen={false} icon={<Icon path="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />}>
                <ImageUploader label="Import Texture Specimen" onFileSelect={(f) => setRenderOptions(p => ({ ...p, materialReference: f }))} />
            </CollapsibleSection>
        </div>

        <div className="py-6 space-y-5 border-b border-slate-100">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Nano-Engine Quality</label>
             <QualitySelector 
                quality={renderOptions.modelQuality} 
                setQuality={(q) => setRenderOptions(p => ({ ...p, modelQuality: q }))} 
            />
            {renderOptions.modelQuality === 'Pro' && (
                <div className="animate-fade-in grid grid-cols-2 gap-4">
                    <SelectControl label="Resolution" name="resolution" value={renderOptions.resolution} options={['1K', '2K', '4K']} onChange={handleSelectChange} />
                    <SelectControl label="Aspect Ratio" name="aspectRatio" value={renderOptions.aspectRatio} options={['1:1', '16:9', '9:16', '4:3', '3:4']} onChange={handleSelectChange} />
                </div>
            )}
        </div>

        <CollapsibleSection title="Creative Directives" icon={<Icon path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 border border-slate-200">
                <button 
                    onClick={() => setRenderOptions(p => ({...p, renderMode: 'Exterior'}))}
                    className={`flex-1 flex items-center justify-center py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${renderOptions.renderMode === 'Exterior' ? 'bg-white text-brand-accent shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Exterior
                </button>
                <button 
                    onClick={() => setRenderOptions(p => ({...p, renderMode: 'Interior'}))}
                    className={`flex-1 flex items-center justify-center py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${renderOptions.renderMode === 'Interior' ? 'bg-white text-brand-accent shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Interior
                </button>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 border border-slate-200">
                {['Precise', 'Balanced', 'Creative'].map((level) => (
                    <button
                        key={level}
                        onClick={() => setRenderOptions(p => ({...p, creativityLevel: level as CreativityLevel}))}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${renderOptions.creativityLevel === level ? 'bg-brand-accent text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Sunlight Control" icon={<Icon path="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 pb-2">
                    {['Morning', 'Noon', 'Evening', 'Golden Hour', 'Night'].map((preset) => (
                        <button 
                            key={preset}
                            onClick={() => applyTimePreset(preset)}
                            className="bg-slate-50 border border-slate-200 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all text-slate-500 hover:text-brand-accent"
                        >
                            {preset}
                        </button>
                    ))}
                </div>
                
                <SunCompass rotation={renderOptions.sunRotation} height={renderOptions.sunHeight} />
                
                <FineSlider label="Sun Rotation" value={renderOptions.sunRotation} min={0} max={360} unit="°" onChange={(v) => setRenderOptions(p => ({...p, sunRotation: v}))} />
                <FineSlider label="Sun Height" value={renderOptions.sunHeight} min={0} max={90} unit="°" onChange={(v) => setRenderOptions(p => ({...p, sunHeight: v}))} />
                <FineSlider label="Sun Intensity" value={renderOptions.sunIntensityFine} min={0} max={100} unit="%" onChange={(v) => setRenderOptions(p => ({...p, sunIntensityFine: v}))} />
                
                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 border border-slate-200">
                    {['Warm', 'Neutral', 'Cool'].map((temp) => (
                        <button
                            key={temp}
                            onClick={() => setRenderOptions(p => ({...p, sunTemperature: temp as SunTemperature}))}
                            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${renderOptions.sunTemperature === temp ? 'bg-brand-accent text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {temp}
                        </button>
                    ))}
                </div>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Scene Composition" icon={<Icon path="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />}>
            <div className="space-y-5">
                <SelectControl label="View / Camera Angle" name="viewAngle" value={renderOptions.viewAngle} options={['None', 'Subtle', 'Moderate', 'Strong']} onChange={handleSelectChange} />
                <div className="grid grid-cols-2 gap-4">
                    <SelectControl label="Depth of Field" name="depthOfField" value={renderOptions.depthOfField} options={['None', 'Shallow', 'Deep']} onChange={handleSelectChange} />
                    <SelectControl label="Motion Blur" name="motionBlur" value={renderOptions.motionBlur} options={['None', 'Low', 'High']} onChange={handleSelectChange} />
                </div>

                <div className="pt-4 space-y-4">
                    <IntensitySlider 
                        label="Primary Sunlight Target" 
                        value={renderOptions.sunlightAngle} 
                        options={sunlightAngleOptions}
                        onChange={(v) => setRenderOptions(p => ({...p, sunlightAngle: v}))} 
                    />
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-4 bg-brand-accent rounded-full shadow-[0_0_8px_rgba(16,101,192,0.4)]" />
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] italic">Objects to Include</h4>
                    </div>
                    <div className="space-y-4">
                        <IntensitySlider label="Furniture" value={renderOptions.furnitureLevel} onChange={(v) => setRenderOptions(p => ({...p, furnitureLevel: v}))} />
                        <IntensitySlider label="Vehicles" value={renderOptions.vehiclesLevel} onChange={(v) => setRenderOptions(p => ({...p, vehiclesLevel: v}))} />
                        <IntensitySlider label="People" value={renderOptions.peopleLevel} onChange={(v) => setRenderOptions(p => ({...p, peopleLevel: v}))} />
                        <IntensitySlider label="Trees & Vegetation" value={renderOptions.treesLevel} onChange={(v) => setRenderOptions(p => ({...p, treesLevel: v}))} />
                    </div>
                </div>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Atmospheric Parameters" icon={<Icon path="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.91 5 5 0 00-9.46 2A4.5 4.5 0 003 15z" />}>
            <div className="space-y-5">
                <SelectControl label="Time of Day" name="timeOfDay" value={renderOptions.timeOfDay} options={['Day', 'Soft Daylight', 'Golden Hour', 'Blue Hour', 'Dusk', 'Night']} onChange={handleSelectChange} />
                <SelectControl label="Weather System" name="weather" value={renderOptions.weather} options={['Clear', 'Cloudy', 'Overcast', 'Foggy', 'Misty', 'Light Rain']} onChange={handleSelectChange} />
                <SelectControl label="Engine Aesthetic" name="moodStyle" value={renderOptions.moodStyle} options={filteredMoodStyles} onChange={handleSelectChange} />
                
                <div className="pt-2">
                    <IntensitySlider 
                        label="Particle Scattering (Fog)" 
                        value={renderOptions.volumetricLightingLevel} 
                        onChange={(v) => setRenderOptions(p => ({...p, volumetricLightingLevel: v}))} 
                    />
                </div>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Engine & Detailing" icon={<Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />}>
            <div className="space-y-5">
                <SelectControl label="Render Style" name="renderStyle" value={renderOptions.renderStyle} options={renderStyleOptions} onChange={handleSelectChange} />
                <SelectControl label="Asset Fidelity" name="activeReflection" value={renderOptions.activeReflection} options={['Standard', 'High', 'Full Raytracing']} onChange={handleSelectChange} />
                <SelectControl label="Object Style" name="furnitureStyle" value={renderOptions.furnitureStyle} options={['Modern', 'Minimalist', 'Industrial', 'Scandinavian']} onChange={handleSelectChange} />
            </div>
        </CollapsibleSection>

        <div className="py-8 space-y-5">
            <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Manual Studio Directives</label>
                <span className="text-[9px] font-black text-brand-accent uppercase italic">Prompt Overwrite</span>
            </div>
            <textarea
                name="additionalPrompt"
                value={renderOptions.additionalPrompt}
                onChange={handleSelectChange}
                placeholder="e.g., Modify material: white travertine walls, bronze frames, custom sunset..."
                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-6 text-xs font-bold text-slate-800 focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent min-h-[160px] scrollbar-hide shadow-inner outline-none resize-none leading-relaxed transition-all placeholder:text-slate-300"
            />
        </div>
      </div>

      <div className="p-8 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <button
              onClick={onRender}
              disabled={!canRender}
              className={`w-full font-black py-5 px-10 rounded-2xl transition-all duration-500 shadow-xl flex items-center justify-center gap-4 disabled:opacity-30 disabled:scale-95 text-[12px] uppercase tracking-[0.4em] ${
                  renderOptions.modelQuality === 'Pro' 
                    ? 'bg-brand-accent text-white shadow-brand-accent/20 hover:scale-[1.03] hover:shadow-brand-accent/40' 
                    : 'bg-slate-800 text-white shadow-slate-900/10 hover:scale-[1.03]'
              }`}
          >
              <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-6 h-6" />
              {isConceptMode ? 'Synthesize Concept' : 'Execute Render'}
          </button>
      </div>
    </aside>
  );
};