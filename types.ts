export type AppMode = 'render' | 'interior' | 'concept' | 'newAngle' | 'edit' | 'upscale' | 'material';
export type ModelQuality = 'Standard' | 'Pro';
export type ImageResolution = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type CreativityLevel = 'Precise' | 'Balanced' | 'Creative';
export type RenderMode = 'Exterior' | 'Interior';
export type ObjectIntensity = 'None' | 'Low' | 'Moderate' | 'High';
export type SunlightAngle = 'Left' | 'Right' | 'Front' | 'Back';
export type SunTemperature = 'Warm' | 'Neutral' | 'Cool';

export interface RenderOptions {
  inputImage: File | null;
  referenceImage: File | null;
  materialReference: File | null; // Specific material/texture reference photo
  modelQuality: ModelQuality;
  resolution: ImageResolution;
  aspectRatio: AspectRatio;
  useGoogleSearch: boolean;
  
  // Creative Controls
  renderMode: RenderMode;
  creativityLevel: CreativityLevel;
  
  // Scene Composition
  viewAngle: string;
  depthOfField: string;
  motionBlur: string;
  sunlightAngle: SunlightAngle;

  // Precision Sunlight Controls
  sunRotation: number;      // 0 - 360
  sunHeight: number;        // 0 - 90
  sunIntensityFine: number;   // 0 - 100
  sunTemperature: SunTemperature;
  
  // Objects to Include
  furnitureLevel: ObjectIntensity;
  vehiclesLevel: ObjectIntensity;
  peopleLevel: ObjectIntensity;
  treesLevel: ObjectIntensity;
  streetFurnitureLevel: ObjectIntensity;
  foregroundLevel: ObjectIntensity;
  
  // Environment & Atmosphere
  timeOfDay: string;
  weather: string;
  windStrength: string;
  interiorLights: string;
  volumetricLightingLevel: ObjectIntensity;
  sunlightIntensity: ObjectIntensity;
  moodStyle: string;
  
  // Style & Detailing
  renderStyle: string;
  roomType: string;
  furnitureStyle: string;
  activeReflection: string;
  additionalPrompt: string;
}