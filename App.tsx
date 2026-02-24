import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ResultPanel } from './components/ResultPanel';
import { EditPanel } from './components/EditPanel';
import { MaterialPanel } from './components/MaterialPanel';
import { Login } from './components/Login';
import { RenderOptions, AppMode } from './types';
import { renderWithAi } from './services/openaiService';
import { LoadingSpinner } from './components/LoadingSpinner';

const initialRenderOptions: Omit<RenderOptions, 'inputImage' | 'referenceImage'> = {
  materialReference: null,
  modelQuality: 'Standard',
  resolution: '4K',
  aspectRatio: '1:1',
  useGoogleSearch: false,
  
  // Creative Controls
  renderMode: 'Exterior',
  creativityLevel: 'Balanced',
  
  // Scene Composition
  viewAngle: 'None',
  depthOfField: 'None',
  motionBlur: 'None',
  sunlightAngle: 'Front',

  // Precision Sunlight Defaults
  sunRotation: 45,
  sunHeight: 45,
  sunIntensityFine: 80,
  sunTemperature: 'Neutral',
  
  // Objects to Include Intensities
  furnitureLevel: 'None',
  vehiclesLevel: 'None',
  peopleLevel: 'None',
  treesLevel: 'Moderate',
  streetFurnitureLevel: 'None',
  foregroundLevel: 'None',
  
  // Environment & Atmosphere
  timeOfDay: 'Day',
  weather: 'Clear',
  windStrength: 'None',
  interiorLights: 'On',
  volumetricLightingLevel: 'None',
  sunlightIntensity: 'Moderate',
  moodStyle: 'neutral',
  
  // Style & Detailing
  renderStyle: 'Photorealistic',
  roomType: 'Living Room',
  furnitureStyle: 'Modern',
  activeReflection: 'None',
  additionalPrompt: '',
};

const renderLoadingMessages = [
  "Initializing Nano Banana Boon24 Engine...",
  "Loading Corona High-Fidelity 4K shaders...",
  "Simulating IOR and subsurface scattering in UHD...",
  "Calculating UHD Cache global illumination...",
  "Refining ray-traced reflections in crystal clear 4K...",
  "Bona Engine: Polishing photoreal high-clarity vision...",
  "Finalizing Boon24 Corona Render 4K output...",
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('boon24_auth') === 'true';
  });

  const [renderOptions, setRenderOptions] = useState<RenderOptions>({
    ...initialRenderOptions,
    inputImage: null,
    referenceImage: null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState(renderLoadingMessages[0]);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [groundingUrls, setGroundingUrls] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'result' | 'history'>('result');
  const [activeAppMode, setActiveAppMode] = useState<AppMode>('render');

  const handleLogout = () => {
    localStorage.removeItem('boon24_auth');
    setIsAuthenticated(false);
  };

  const handleModeChange = (mode: AppMode) => {
    setActiveAppMode(mode);
    
    setRenderOptions(prev => {
      const base = { ...prev };
      
      switch (mode) {
        case 'interior':
          base.renderMode = 'Interior';
          base.creativityLevel = 'Balanced';
          base.renderStyle = 'Bona Nano Banana Boon24 Corona';
          base.furnitureLevel = 'Moderate';
          base.interiorLights = 'On';
          break;
        case 'concept':
          base.renderMode = 'Exterior';
          base.creativityLevel = 'Creative';
          base.renderStyle = 'Concept Sketch';
          base.moodStyle = 'Cinematic';
          base.volumetricLightingLevel = 'Low';
          break;
        case 'render':
          base.renderMode = 'Exterior';
          base.creativityLevel = 'Balanced';
          base.renderStyle = 'Photorealistic';
          break;
      }
      return base;
    });
  };

  useEffect(() => {
    let messageInterval: number;
    if (isLoading) {
      let i = 0;
      setLoadingMessage(renderLoadingMessages[i]);
      messageInterval = window.setInterval(() => {
        i = (i + 1) % renderLoadingMessages.length;
        setLoadingMessage(renderLoadingMessages[i]);
      }, 2500);
    }
    return () => clearInterval(messageInterval);
  }, [isLoading]);

  const checkProKey = async () => {
    // OpenAI doesn't require special key checking for Pro models
    return true;
  };

  const handleRender = async () => {
    if (!renderOptions.inputImage && renderOptions.creativityLevel !== 'Creative') {
      setError('An input image is required.');
      return;
    }

    try {
      await checkProKey();
      setIsLoading(true);
      setError(null);
      setGeneratedImages(null);
      setGroundingUrls([]);
      setActiveTab('result');

      const result = await renderWithAi(renderOptions);
      if (result && result.images.length > 0) {
        setGeneratedImages(result.images);
        if (result.urls) setGroundingUrls(result.urls);
        setHistory(prev => [...result.images, ...prev]);
      } else {
        setError('The model failed to return an image.');
      }
    } catch (err: any) {
      if (err.message === 'QUOTA_ERROR') {
        setError('API quota exceeded. Please check your OpenAI billing settings.');
      } else if (err.message?.includes("503") || err.message?.includes("Deadline expired") || err.message?.includes("UNAVAILABLE")) {
        setError('The rendering engine is currently under heavy load. Please try again in a few moments, or switch to "Standard" quality for a faster response.');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetControls = () => {
    setRenderOptions(prev => ({
      ...initialRenderOptions,
      inputImage: prev.inputImage,
      referenceImage: prev.referenceImage,
    }));
  };

  const handleClearHistory = () => {
    if (window.confirm("Purge studio history? This action cannot be reversed.")) {
      setHistory([]);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const isRenderMode = ['render', 'interior', 'concept'].includes(activeAppMode);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans text-brand-text-primary h-screen overflow-hidden">
      {isLoading && <LoadingSpinner message={loadingMessage} />}
      <Header 
        activeAppMode={activeAppMode}
        setActiveAppMode={handleModeChange}
        onLogout={handleLogout}
      />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        {isRenderMode ? (
            <>
                <Sidebar 
                  renderOptions={renderOptions} 
                  setRenderOptions={setRenderOptions} 
                  onResetControls={handleResetControls}
                  onRender={handleRender}
                />
                <ResultPanel 
                  inputImage={renderOptions.inputImage}
                  onImageUpload={(file) => setRenderOptions(p => ({ ...p, inputImage: file }))}
                  generatedImages={generatedImages} 
                  history={history}
                  onClearHistory={handleClearHistory}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  error={error}
                  groundingUrls={groundingUrls}
                />
            </>
        ) : activeAppMode === 'edit' ? (
            <EditPanel />
        ) : activeAppMode === 'material' ? (
            <MaterialPanel />
        ) : (
            <div className="flex-grow flex items-center justify-center bg-brand-surface p-4 rounded-3xl animate-fade-in w-full shadow-sm border border-brand-border">
                <div className="text-center text-brand-text-secondary">
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-2 uppercase tracking-widest">Engine Module Sync</h2>
                    <p className="text-sm">The {activeAppMode} module is currently being optimized for Studio Core 4K.</p>
                    <button 
                        onClick={() => handleModeChange('render')}
                        className="mt-6 px-8 py-3 bg-brand-accent text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                        Return to Workspace
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;