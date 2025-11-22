export interface BrandConfig {
  name: string;
  tone: string;
  tagline: string;
  palette: string;
  productName: string;
}

export interface AssetType {
  id: string;
  label: string;
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:3" | "3:4";
  width: number;
  height: number;
  description: string;
  mediaType: 'image' | 'video';
}

export enum StylePreset {
  LUXURY = 'Luxury',
  MINIMALIST = 'Minimalist',
  NATURAL = 'Natural',
  TECH = 'High-Tech',
  VIBRANT = 'Vibrant',
  CUSTOM = 'Custom'
}

export interface GeneratedAsset {
  id: string;
  url: string;
  typeId: string;
  timestamp: number;
  prompt: string;
  isLoading?: boolean;
  mediaType: 'image' | 'video';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  relatedAssetId?: string;
}

export interface SampleImage {
  id: string;
  name: string;
  description: string;
  url: string;
}