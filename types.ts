export enum EnhancementMode {
  LANDSCAPE = 'LANDSCAPE',
  PORTRAIT = 'PORTRAIT',
  PRODUCT = 'PRODUCT',
  RETOUCH = 'RETOUCH',
}

export enum UpscaleLevel {
  OG = 'OG',
  X2 = '2x',
  X4 = '4x',
  X8 = '8x',
}

export interface EnhancementOptions {
  mode: EnhancementMode;
  upscale: UpscaleLevel;
}

export interface ProcessedImage {
  originalUrl: string;
  enhancedUrl: string;
  stats: {
    originalSize: string;
    enhancedSize: string;
    processingTime: number; // seconds
  };
  metrics: {
    sharpness: number;
    colorAccuracy: number;
    textureDetail: number;
    noiseReduction: number;
  }[]; // [Before, After]
}