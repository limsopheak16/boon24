import { GoogleGenAI } from "@google/genai";
import { RenderOptions, AspectRatio } from '../types';

interface ViteEnv {
  [key: string]: string | undefined;
}

const getEnvVar = (key: string): string | undefined => {
  // Try Vite env first (browser)
  if ((import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  // Fallback to process.env (server)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

const fileToPart = async (file: File) => {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
  return {
    inlineData: {
      data: base64,
      mimeType: file.type,
    },
  };
};

const getBase64FromUrl = (dataUrl: string) => {
  return dataUrl.split(',')[1];
};

const getNearestAspectRatio = (width: number, height: number): AspectRatio => {
  const ratio = width / height;
  if (ratio > 1.4) return '16:9';
  if (ratio > 1.1) return '4:3';
  if (ratio < 0.7) return '9:16';
  if (ratio < 0.9) return '3:4';
  return '1:1';
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = URL.createObjectURL(file);
  });
};

const creativityInstructions = {
  Precise: "CRUCIAL INSTRUCTION: The primary goal is PRESERVATION. You MUST preserve the exact geometry, forms, proportions, and architectural elements from the input image. Focus on maximum clarity and sharp textures.",
  Balanced: "PRIMARY GOAL: ARCHITECTURAL ENHANCEMENT. The input image is your starting point. Enhance design by refining proportions and details. Aim for crystal clear 4K output.",
  Creative: "Artistically reinterprets the building's form based on the selected 'Mood / Style', while preserving the original materials and textures. Focus on high-clarity architectural vision.",
};

const styleTechnicalContext: Record<string, string> = {
  'Corona 11: Real-World PBR Material': "Emulate Corona Renderer 11 with physically accurate shaders. Ensure wood grain, concrete pores, and marble veins are visible with micro-displacement. Aim for a photorealistic 'professionally post-processed' raw render look.",
  'Corona 11: Interior Soft Daylight': "Emulate Corona Renderer 11 with UHD Cache. Technical: Large Sky Portals in window openings, physically accurate Global Illumination, photographic exposure (ISO 100, f/5.6), soft shadows with 0.5cm shadow blur. Hyper-realistic materials.",
  'Corona 11: Cinematic Dusk Archviz': "Emulate high-end Archviz Dusk workflow. Technical: HDRI Environment lighting mixed with Corona Lightmix. Balance warm interior light sources (3000K) with cool exterior sky (9000K). High contrast, sharp ray-traced reflections.",
  'Corona 11: Exterior Sun & Sky': "Emulate Corona Physical Sun and Sky. Technical: Clear sky environment, high sun angle, high intensity specular highlights, realistic atmospheric perspective, ray-traced glass with accurate IOR (1.52).",
  'V-Ray 6: Ultra Photoreal 4K': "Emulate Chaos V-Ray 6 production render. Technical: Brute force GI, complex material micro-facet distribution, high-quality anti-aliasing, detailed texture filtering, realistic motion blur and depth of field.",
  '3ds Max: Raw Clay Render': "Technical Override: Replace all scene textures with a neutral gray matte Corona Physical Material. Disable diffuse maps. Focus purely on geometric massing, shadow gradients, and ambient occlusion.",
  '3ds Max: Wireframe Technical': "Technical Override: Apply a 'Corona Wire' shader. Display architectural mesh topology and polygon edges clearly as thin lines over a solid matte volume.",
};

const callWithRetry = async (fn: () => Promise<any>, maxRetries = 3, initialDelay = 2000) => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRetryable = 
        error.message?.includes("503") || 
        error.message?.includes("504") || 
        error.message?.includes("Deadline expired") ||
        error.message?.includes("UNAVAILABLE");
      
      if (!isRetryable) throw error;
      
      console.warn(`Attempt ${i + 1} failed with retryable error. Retrying in ${initialDelay * Math.pow(2, i)}ms...`);
      await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, i)));
    }
  }
  throw lastError;
};

export const renderWithAi = async (options: RenderOptions): Promise<{images: string[], urls?: any[]} | null> => {
  const ai = new GoogleGenAI({ apiKey: getEnvVar('VITE_GOOGLE_API_KEY') });
  const { 
    inputImage, 
    referenceImage, 
    materialReference,
    modelQuality, 
    resolution, 
    aspectRatio, 
    useGoogleSearch,
    renderMode,
    creativityLevel,
    viewAngle,
    depthOfField,
    motionBlur,
    sunlightAngle,
    sunRotation,
    sunHeight,
    sunIntensityFine,
    sunTemperature,
    furnitureLevel,
    vehiclesLevel,
peopleLevel,
    treesLevel,
    streetFurnitureLevel,
    foregroundLevel,
    timeOfDay,
    weather,
    windStrength,
    interiorLights,
    volumetricLightingLevel,
    sunlightIntensity,
    moodStyle,
    renderStyle,
    roomType,
    furnitureStyle,
    activeReflection,
    additionalPrompt
  } = options;

  if (!inputImage && creativityLevel !== 'Creative') {
    throw new Error("Input image is required for this mode.");
  }
  
  const parts: any[] = [];
  
  if (inputImage) {
    parts.push(await fileToPart(inputImage));
  }
  
  if (referenceImage) {
    parts.push(await fileToPart(referenceImage));
  }

  if (materialReference) {
    parts.push(await fileToPart(materialReference));
  }

  const intensities = [
    furnitureLevel !== 'None' && `${furnitureLevel} density furniture`,
    vehiclesLevel !== 'None' && `${vehiclesLevel} amount of vehicles`,
    peopleLevel !== 'None' && `${peopleLevel} presence of people`,
    treesLevel !== 'None' && `${treesLevel} trees and vegetation`,
    streetFurnitureLevel !== 'None' && `${streetFurnitureLevel} street furniture`,
    foregroundLevel !== 'None' && `${foregroundLevel} foreground details`
  ].filter(Boolean).join(', ');

  const isTextToConcept = !inputImage && creativityLevel === 'Creative';

  const isBonaExterior = moodStyle === 'BONA exterior';
  const bonaExteriorPrompt = isBonaExterior ? `
    MOOD STYLE: BONA Exterior Premium.
    A contemporary architectural rendering showcasing a modern house with sleek lines and geometric forms. 
    HIGH-END contemporary aesthetic, ultra-sharp details, focus on clean lines and crystal clear 4K clarity.
  ` : '';

  const techContext = styleTechnicalContext[renderStyle] || "";

  // MANDATORY POST-PROCESSED CORONA ENGINE RULES
  const coronaPostProcessDirectives = `
    FINAL OUTPUT GOAL:
    Produce a photorealistic Corona-style render that looks professionally post-processed while keeping the original design, materials, and textures completely unchanged.
    - Bloom/Glow: Subtle atmospheric bloom on highlights.
    - Tone Mapping: Cinematic high-dynamic range with balanced exposure.
    - Geometry: 100% PRESERVATION of original structural lines and design elements.
    - Sharpness: Maximum 4K texture definition without artifacts.
  `;

  const sunlightMap = {
    'None': 'Overcast sky, no direct sunlight, flat ambient lighting.',
    'Low': 'Soft, diffused sunlight, weak shadows, gentle brilliance.',
    'Moderate': 'Standard natural sunlight balance, clear shadows.',
    'High': 'Strong, harsh direct sunlight, high-contrast sharp shadows, brilliant highlights.'
  };

  const precisionSunlight = `
    PHYSICAL SUNLIGHT CONTROL:
    - Position: Azimuth ${sunRotation}°, Altitude ${sunHeight}°.
    - Orientation: Primary light source is oriented to the ${sunlightAngle}.
    - Intensity: Corona Sunlight calibrated at ${sunIntensityFine}% strength.
    - Temperature: ${sunTemperature} spectrum (${sunTemperature === 'Warm' ? '3200K' : sunTemperature === 'Cool' ? '9000K' : '5600K'}).
    - Behavior: Natural physically-accurate shadow casting with soft gradients and precise specular highlights.
  `;

  // INTERIOR MATERIAL PHYSICS ENGINE LOGIC
  const materialPhysicsDirectives = renderMode === 'Interior' ? `
    PHYSICALLY BASED MATERIAL (PBR) SYNTHESIS:
    - High-Fidelity Textures: Render wood grains with micro-bump, marble with deep subsurface scattering and polished specular veins, and fabrics with realistic weave patterns.
    - Specular/Glossiness workflow: Ensure surfaces have accurate roughness maps. Matte surfaces should diffuse light realistically, while polished surfaces (floors, countertops) should show accurate Fresnel reflections.
    - Ambient Occlusion: Deepen contact shadows between furniture and floors for maximum realism.
    - Texture Mapping: Ensure all textures are correctly scaled and aligned with architectural perspective.
  ` : '';

  const engineContext = renderMode === 'Interior' 
    ? `SYSTEM ENGINE: NANO BANANA BOON24 CORONA RENDER ENGINE V12. 
       AESTHETIC: High-End Architectural Photography.
       OUTPUT QUALITY: 4K ULTRA-HIGH DEFINITION, CRYSTAL CLEAR, MAXIMUM TEXTURE SHARPNESS.
       ${techContext}
       ${coronaPostProcessDirectives}
       ${materialPhysicsDirectives}
       ${precisionSunlight}
       TECHNICAL DIRECTIVES: 
       - Corona Physical Material V2: physically based materials with accurate IOR and Fresnel reflections.
       - Lighting: Global Illumination via UHD Cache and path tracing for soft, natural shadows.
       - Emulate Boon24 camera settings: wide-angle (18-24mm), f/8 aperture, ISO 100.`
    : `SYSTEM ENGINE: Bona Nano Banana Boon24 Architectural Render Engine. ${bonaExteriorPrompt}
       ${techContext}
       ${coronaPostProcessDirectives}
       ${precisionSunlight}
       OUTPUT QUALITY: 4K RESOLUTION, SHARP EDGES, MAXIMUM CLARITY.`;

  // THE WORDS WE WRITE: Logic to prioritize user modifications
  const priorityModificationDirective = additionalPrompt 
    ? `CRITICAL MODIFICATION DIRECTIVE (THE WORDS WE WRITE): "${additionalPrompt}". You MUST execute these specific changes with top priority. Maintain maximum 4K clarity during modification.` 
    : '';

  const materialReferenceDirective = materialReference 
    ? `SPECIFIC MATERIAL SOURCE: Analyze the provided material reference photo and apply its exact texture, color, and reflectance properties to relevant interior surfaces with maximum sharpness.` 
    : '';

  const promptText = `
TASK: ${renderMode} ${isTextToConcept ? 'Conceptual Generation' : 'Architectural Rendering'}
${engineContext}
DIRECTIVE: ${creativityLevel} - ${creativityInstructions[creativityLevel]}

${priorityModificationDirective}
${materialReferenceDirective}

CRITICAL ARCHITECTURAL PRESERVATION INSTRUCTIONS:
- MANDATORY: You MUST use the uploaded architectural image as your PRIMARY reference
- FORBIDDEN: Do NOT generate a completely different building design
- REQUIRED: Preserve the exact building structure, roof design, window placement, and facade layout
- ENHANCE: Only improve lighting, materials, and rendering quality while maintaining the original design
- ANALYZE: Study the uploaded image carefully and recreate it with professional 4K rendering quality

ARCHITECTURAL INTENT:
${isTextToConcept ? '- Generate a GROUNDBREAKING architectural concept from scratch in 4K.' : '- Enhance the provided geometry with 4K clarity.'}
- Style Selection: ${renderStyle}
- Volumetric Strategy: ${creativityLevel === 'Creative' ? 'Bold, innovative massing and silhouettes' : 'Preserve existing proportions'}

SCENE PARAMETERS:
- View/Camera Intensity: ${viewAngle}
- Depth of Field: ${depthOfField}
- Motion Blur: ${motionBlur}
- Objects Intensity: ${intensities || 'Standard architectural context'}

ENVIRONMENT & ATMOSPHERE:
- Time of Day: ${timeOfDay}
- Weather: ${weather}
- Sunlight Control Strategy: ${sunlightMap[sunlightIntensity]}
- Interior Lighting: ${interiorLights}
- Volumetric Lighting / God Rays: ${volumetricLightingLevel}
- Mood/Style: ${moodStyle}

DETAILING:
- Room Type: ${roomType}
- Furniture Style: ${furnitureStyle}
- Reflections: ${activeReflection}

Output a ultra-photorealistic, high-fidelity 4K architectural visualization with cinematic clarity and sharp material physics. Final result should look indistinguishable from a real photograph.
`.trim();

  parts.push({ text: promptText });

  const model = modelQuality === 'Pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  const config: any = {
    imageConfig: {
      aspectRatio: aspectRatio,
    }
  };

  if (modelQuality === 'Pro') {
    config.imageConfig.imageSize = resolution; // Uses the default '4K' from App.tsx
};

if (modelQuality === 'Pro') {
config.imageConfig.imageSize = resolution; // Uses the default '4K' from App.tsx
if (useGoogleSearch) {
config.tools = [{ googleSearch: {} }];
}
}

try {
const response = await callWithRetry(() => ai.models.generateContent({
model: model,
contents: { parts: parts },
config: config
}));

const images: string[] = [];
let urls: any[] = [];

if (response.candidates && response.candidates[0]) {
const candidate = response.candidates[0];
if (candidate.groundingMetadata?.groundingChunks) {
urls = candidate.groundingMetadata.groundingChunks;
}
for (const part of candidate.content.parts) {
if (part.inlineData) {
images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
}
}
}

return { images, urls };
} catch (error: any) {
if (error.message?.includes("Requested entity was not found")) {
throw new Error("PRO_KEY_ERROR");
}
throw error;
}
};
