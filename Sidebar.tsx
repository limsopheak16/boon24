
import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { RenderOptions, ModelQuality, RenderMode, CreativityLevel, ObjectIntensity } from '../types';

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const IntensitySlider: React.FC<{
    label: string;
    value: ObjectIntensity;
    onChange: (val: ObjectIntensity) => void;
}> = ({ label, value, onChange }) => {
    const levels: ObjectIntensity[] = ['None', 'Low', 'Moderate', 'High'];
    const currentIndex = levels.indexOf(value);

    return (
        <div className="bg-brand-bg/40 border border-brand-border/40 p-3 rounded-lg space-y-3 group hover:border-brand-border transition-colors">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${value === 'None' ? 'bg-brand-panel text-brand-text-secondary' : 'bg-brand-accent/20 text-brand-accent'}`}>
                    {value}
                </span>
            </div>
            <div className="relative h-6 flex items-center">
                <div className="absolute w-full h-1 bg-brand-panel rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-accent/30 transition-all duration-300" 
                        style={{ width: `${(currentIndex / (levels.length - 1)) * 100}%` }}
                    />
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="3" 
                    step="1"
                    value={currentIndex}
                    onChange={(e) => onChange(levels[parseInt(e.target.value)] as ObjectIntensity)}
                    className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-200"
                    style={{ left: `calc(${(currentIndex / (levels.length - 1)) * 100}% - 8px)` }}
                />
            </div>
        </div>
    );
};

const CollapsibleSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-brand-border/50 last:border-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left group">
                <div className="flex items-center gap-3">
                    <div className="text-brand-accent group-hover:text-brand-accent-hover transition-colors">{icon}</div>
                    <h4 className="font-bold text-sm text-brand-text-primary tracking-tight">{title}</h4>
                </div>
                <Icon path={isOpen ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} className="w-3.5 h-3.5 text-brand-text-secondary" />
            </button>
            {isOpen && <div className="pb-5 space-y-4 animate-fade-in">{children}</div>}
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
    <label className="block text-xs font-semibold text-brand-text-secondary">
      {label}
    </label>
    <div className="relative group">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2.5 text-xs text-brand-text-primary appearance-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all cursor-pointer group-hover:border-brand-text-secondary/50"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-secondary">
            <Icon path="M19 9l-7 7-7-7" className="w-3 h-3" />
        </div>
    </div>
  </div>
);

const QualitySelector: React.FC<{
    quality: ModelQuality;
    setQuality: (q: ModelQuality) => void;
}> = ({ quality, setQuality }) => (
    <div className="flex bg-brand-bg p-1 rounded-lg gap-1 border border-brand-border/50">
        <button
            onClick={() => setQuality('Standard')}
            className={`flex-1 text-[10px] font-bold py-2 rounded-md transition-all ${
                quality === 'Standard' ? 'bg-brand-accent text-brand-bg shadow' : 'text-brand-text-secondary hover:bg-brand-panel'
            }`}
        >
            Standard (2.5)
        </button>
        <button
            onClick={() => setQuality('Pro')}
            className={`flex-1 text-[10px] font-bold py-2 rounded-md transition-all relative overflow-hidden ${
                quality === 'Pro' ? 'bg-amber-400 text-brand-bg shadow' : 'text-brand-text-secondary hover:bg-brand-panel'
            }`}
        >
            PRO (Nano 5)
        </button>
    </div>
);

const creativityDescriptions = {
  Precise: "CRUCIAL INSTRUCTION: The primary goal is PRESERVATION. You MUST preserve the exact geometry, forms, proportions, and architectural elements from the input image.",
  Balanced: "PRIMARY GOAL: ARCHITECTURAL ENHANCEMENT. The input image is your starting point. Enhance design by refining proportions and details.",
  Creative: "Artistically reinterprets the building's form. If no image is provided, it creates a new concept from scratch using your prompt.",
};

const timeOfDayOptions = [
    "Day", "Soft Daylight", "Midday Sun", "Night", "Golden Hour", "Blue Hour", "Dawn", "Dusk",
    "Archviz Daylight", "Purple Hour", "Evening", "Sunrise", "Sunset", "Early Morning",
    "Late Afternoon", "Twilight", "Moonlit Night", "Foggy Morning", "Overcast Noon",
    "Rainy Afternoon", "Stormy Evening", "Snowy Morning", "Winter Sunset", "Summer Sunrise",
    "Autumn Evening", "Spring Twilight", "Cloudy Afternoon", "Evening Glow", "Evening Mist",
    "Warm Sunset", "Cold Sunrise", "Night with Streetlights", "Misty Morning", "Foggy Evening",
    "Purple Twilight"
];

const weatherOptions = [
    "Clear", "Cloudy", "Overcast", "Foggy", "Misty", "Light Rain", "Heavy Rain", "Stormy", "Light Snow", "Blizzard"
];

const windStrengthOptions = [
    "None", "Subtle", "Moderate", "Strong", "Gale Force"
];

const viewAngleOptions = [
    "None", "Subtle", "Moderate", "Strong"
];

const renderStyleOptions = [
    'Bona Nano Banana Boon24 Corona',
    'Corona 11 (High-Fidelity)',
    'V-Ray 6 (Ultra Photoreal)',
    'Boon24 Corona Renderer',
    'Photorealistic', 
    'Concept Sketch', 
    '3D Model Look', 
    'Isometric View', 
    'Digital Painting',
    'Parametric Fluidity',
    'Biophilic Organic',
    'Neo-Futurist',
    'Deconstructivist',
    'Brutalist Monolith'
];

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

  const setRenderMode = (mode: RenderMode) => {
    setRenderOptions(prev => ({ ...prev, renderMode: mode }));
  };

  const setCreativity = (level: CreativityLevel) => {
    setRenderOptions(prev => ({ ...prev, creativityLevel: level }));
  };

  const setIntensity = (key: keyof RenderOptions, val: ObjectIntensity) => {
    setRenderOptions(prev => ({ ...prev, [key]: val }));
  };

  const isConceptMode = renderOptions.creativityLevel === 'Creative';
  const isInteriorMode = renderOptions.renderMode === 'Interior';
  const canRender = !!renderOptions.inputImage || isConceptMode;

  const moodStyles = [
    'neutral', 'Dark & Moody', 'Bright & Airy', 'Vibrant', 'Ethereal', 'Cinematic'
  ];

  // Add BONA exterior to mood styles if in Exterior mode
  const filteredMoodStyles = !isInteriorMode ? [...moodStyles, 'BONA exterior'] : moodStyles;

  return (
    <aside className="w-full md:w-[380px] bg-brand-surface border-r border-brand-border/30 flex flex-col flex-shrink-0 animate-slide-in overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-brand-border flex justify-between items-center bg-brand-surface/50">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConceptMode ? 'bg-purple-500' : isInteriorMode ? 'bg-emerald-500' : 'bg-brand-accent'} animate-pulse`} />
            <h2 className="text-sm font-bold text-brand-text-primary tracking-tight">
                {isConceptMode ? 'New Concept' : isInteriorMode ? 'Boon24 Interior Engine' : 'Architectural Render'}
            </h2>
        </div>
        <button onClick={onResetControls} className="text-xs text-brand-text-secondary hover:text-brand-accent transition-colors">Reset</button>
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-6 scrollbar-hide">
        <div className="py-4 space-y-4 border-b border-brand-border/50">
            <ImageUploader 
                label={isConceptMode ? "Upload Base Structure (Optional)" : "Upload Base Structure"} 
                onFileSelect={(f) => setRenderOptions(p => ({ ...p, inputImage: f }))} 
            />
            <CollapsibleSection title="Apply Material (1 Prompt / 2 Photo)" defaultOpen={false} icon={<Icon path="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />}>
                <ImageUploader label="2. Upload Material Photo" onFileSelect={(f) => setRenderOptions(p => ({ ...p, materialReference: f }))} />
            </CollapsibleSection>
             <CollapsibleSection title="Aesthetic Reference (Optional)" defaultOpen={false} icon={<Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}>
                <ImageUploader label="Upload Aesthetic Style" onFileSelect={(f) => setRenderOptions(p => ({ ...p, referenceImage: f }))} />
            </CollapsibleSection>
        </div>

        <div className="py-4 space-y-3 border-b border-brand-border/50">
             <label className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">2. Nano Banana Engine</label>
             <QualitySelector 
                quality={renderOptions.modelQuality} 
                setQuality={(q) => setRenderOptions(p => ({ ...p, modelQuality: q }))} 
            />
            {renderOptions.modelQuality === 'Pro' && (
                <div className="animate-fade-in grid grid-cols-2 gap-2">
                    <SelectControl label="Resolution" name="resolution" value={renderOptions.resolution} options={['1K', '2K', '4K']} onChange={handleSelectChange} />
                    <SelectControl label="Aspect Ratio" name="aspectRatio" value={renderOptions.aspectRatio} options={['1:1', '16:9', '9:16', '4:3', '3:4']} onChange={handleSelectChange} />
                </div>
            )}
        </div>

        <div className="mt-4">
            <label className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">3. Creative Controls</label>
        </div>

        <CollapsibleSection title="Core Directives" icon={<Icon path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}>
            <div className="flex bg-brand-bg p-1 rounded-lg border border-brand-border/50">
                <button 
                    onClick={() => setRenderMode('Exterior')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${renderOptions.renderMode === 'Exterior' ? 'bg-brand-accent text-brand-bg shadow-lg shadow-brand-accent/20' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
                >
                    <Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" className="w-4 h-4" />
                    Exterior
                </button>
                <button 
                    onClick={() => setRenderMode('Interior')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${renderOptions.renderMode === 'Interior' ? 'bg-brand-accent text-brand-bg shadow-lg shadow-brand-accent/20' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
                >
                    <Icon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" className="w-4 h-4" />
                    Interior
                </button>
            </div>

            <div className="flex bg-brand-bg p-1 rounded-lg border border-brand-border/50">
                {['Precise', 'Balanced', 'Creative'].map((level) => (
                    <button
                        key={level}
                        onClick={() => setCreativity(level as CreativityLevel)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${renderOptions.creativityLevel === level ? 'bg-brand-accent text-brand-bg' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
                    >
                        {level}
                    </button>
                ))}
            </div>
            <p className="text-[10px] text-brand-text-secondary leading-relaxed px-1">
                {creativityDescriptions[renderOptions.creativityLevel]}
            </p>
        </CollapsibleSection>

        <CollapsibleSection title="Scene Composition" icon={<Icon path="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />}>
            <SelectControl label="View / Camera Angle" name="viewAngle" value={renderOptions.viewAngle} options={viewAngleOptions} onChange={handleSelectChange} />
            <div className="grid grid-cols-2 gap-3">
                <SelectControl label="Depth of Field" name="depthOfField" value={renderOptions.depthOfField} options={['None', 'Shallow', 'Deep']} onChange={handleSelectChange} />
                <SelectControl label="Motion Blur" name="motionBlur" value={renderOptions.motionBlur} options={['None', 'Low', 'High']} onChange={handleSelectChange} />
            </div>
            
            <div className="space-y-4 pt-2">
                <label className="text-xs font-bold text-brand-text-primary flex items-center gap-2">
                    <div className="w-1 h-3 bg-brand-accent rounded-full" />
                    Objects to Include
                </label>
                <div className="space-y-3">
                    <IntensitySlider label="Furniture" value={renderOptions.furnitureLevel} onChange={(v) => setIntensity('furnitureLevel', v)} />
                    <IntensitySlider label="Vehicles" value={renderOptions.vehiclesLevel} onChange={(v) => setIntensity('vehiclesLevel', v)} />
                    <IntensitySlider label="People" value={renderOptions.peopleLevel} onChange={(v) => setIntensity('peopleLevel', v)} />
                    <IntensitySlider label="Trees & Veg." value={renderOptions.treesLevel} onChange={(v) => setIntensity('treesLevel', v)} />
                    <IntensitySlider label="Street Furniture" value={renderOptions.streetFurnitureLevel} onChange={(v) => setIntensity('streetFurnitureLevel', v)} />
                    <IntensitySlider label="Foreground" value={renderOptions.foregroundLevel} onChange={(v) => setIntensity('foregroundLevel', v)} />
                </div>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Environment & Atmosphere" icon={<Icon path="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />}>
            <div className="space-y-4">
                <SelectControl label="Time of Day" name="timeOfDay" value={renderOptions.timeOfDay} options={timeOfDayOptions} onChange={handleSelectChange} />
                <SelectControl label="Weather" name="weather" value={renderOptions.weather} options={weatherOptions} onChange={handleSelectChange} />
                <SelectControl label="Wind Strength" name="windStrength" value={renderOptions.windStrength} options={windStrengthOptions} onChange={handleSelectChange} />
                <SelectControl label="Interior Lights" name="interiorLights" value={renderOptions.interiorLights} options={['On', 'Off', 'Subtle Dimmed']} onChange={handleSelectChange} />
                
                <div className="pt-2">
                    <IntensitySlider 
                        label="Volumetric Lighting / God Rays" 
                        value={renderOptions.volumetricLightingLevel} 
                        onChange={(v) => setIntensity('volumetricLightingLevel', v)} 
                    />
                </div>
                
                <SelectControl label="Mood / Style" name="moodStyle" value={renderOptions.moodStyle} options={filteredMoodStyles} onChange={handleSelectChange} />
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Style & Detailing" icon={<Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />}>
            <SelectControl label="Render Style" name="renderStyle" value={renderOptions.renderStyle} options={renderStyleOptions} onChange={handleSelectChange} />
            {renderOptions.renderMode === 'Interior' && (
                <SelectControl label="Room Type" name="roomType" value={renderOptions.roomType} options={['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Hotel Lobby', 'Restaurant']} onChange={handleSelectChange} />
            )}
            <SelectControl label="Furniture Style" name="furnitureStyle" value={renderOptions.furnitureStyle} options={['Modern', 'Minimalist', 'Industrial', 'Scandinavian', 'Classical', 'Mid-Century']} onChange={handleSelectChange} />
            <SelectControl label="Active Reflection" name="activeReflection" value={renderOptions.activeReflection} options={['None', 'Glass Only', 'Full Raytracing', 'Subtle Gloss']} onChange={handleSelectChange} />
            
            <div className="space-y-1.5 p-3 bg-brand-bg/60 rounded-xl border border-brand-accent/20">
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-black text-brand-text-secondary uppercase tracking-widest italic">1. Write Prompt (The words we write)</label>
                    <span className="text-[8px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full border border-brand-accent/30 font-black">HIGH PRIORITY</span>
                </div>
                <textarea
                    name="additionalPrompt"
                    value={renderOptions.additionalPrompt}
                    onChange={handleSelectChange}
                    placeholder={isConceptMode ? "e.g., A floating glass pavilion in a dense tropical forest..." : "e.g., change the floor to dark gray marble, apply polished gold to frames..."}
                    className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-xs text-brand-text-primary focus:ring-1 focus:ring-brand-accent focus:border-brand-accent min-h-[100px] scrollbar-hide shadow-inner transition-all hover:border-brand-text-secondary/50"
                />
                <p className="text-[9px] text-brand-text-secondary/60 mt-2 leading-tight italic">These words drive the architectural modifications. Be specific with materials and objects.</p>
            </div>
        </CollapsibleSection>
      </div>

      <div className="p-4 bg-brand-surface/80 backdrop-blur-md border-t border-brand-border">
          <button
              onClick={onRender}
              disabled={!canRender}
              className={`w-full font-bold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed ${
                  renderOptions.modelQuality === 'Pro' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-brand-bg shadow-amber-500/20 hover:scale-[1.02]' 
                    : isConceptMode 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20 hover:scale-[1.02]'
                      : isInteriorMode
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-[1.02]'
                        : 'bg-[#3b6ea5] hover:bg-[#4a85c2] text-white shadow-brand-accent/20 hover:scale-[1.02]'
              }`}
          >
              <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5" />
              {isConceptMode ? 'Generate Concept' : 'Generate Boon24 Render'}
          </button>
      </div>
    </aside>
  );
};
