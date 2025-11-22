import { AssetType, SampleImage, StylePreset } from "./types";
import { Monitor, Smartphone, Instagram, Globe, MessageSquare, Video } from "lucide-react";

export const ASSET_TYPES: AssetType[] = [
  {
    id: 'insta-post',
    label: 'Instagram Post',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    description: 'Perfect for square feed posts.',
    mediaType: 'image'
  },
  {
    id: 'insta-story',
    label: 'Instagram Story',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    description: 'Full vertical screen engagement.',
    mediaType: 'image'
  },
  {
    id: 'web-banner',
    label: 'Website Banner',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    description: 'Hero headers and desktop displays.',
    mediaType: 'image'
  },
  {
    id: 'ad-creative',
    label: 'Ad Creative',
    aspectRatio: '1:1',
    width: 1200,
    height: 1200,
    description: 'Optimized for performance marketing.',
    mediaType: 'image'
  },
  {
    id: 'tiktok-ad',
    label: 'TikTok / Reels Ad',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    description: 'Short viral video format (Veo).',
    mediaType: 'video'
  }
];

export const STYLE_PRESETS: { [key in StylePreset]: string } = {
  [StylePreset.LUXURY]: "Elegant, high-end, gold and black accents, studio lighting, premium materials, silk textures.",
  [StylePreset.MINIMALIST]: "Clean, plenty of whitespace, soft shadows, neutral colors, simple composition, modern font.",
  [StylePreset.NATURAL]: "Organic elements, wood textures, green leaves, sunlight, earthy tones, fresh atmosphere.",
  [StylePreset.TECH]: "Neon lights, futuristic glow, metallic surfaces, cyber aesthetics, sharp contrast, gradient background.",
  [StylePreset.VIBRANT]: "Bold colors, energetic patterns, high saturation, dynamic composition, playful mood.",
  [StylePreset.CUSTOM]: "Custom aesthetic based on brand description."
};

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-serum',
    name: 'Premium Serum',
    description: 'A luxury anti-aging serum bottle.',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600&h=600'
  },
  {
    id: 'sample-cream',
    name: 'Face Cream',
    description: 'Hydrating face cream in a jar.',
    url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=600&h=600'
  },
  {
    id: 'sample-oil',
    name: 'Beauty Oil',
    description: 'Organic essential oil dropper.',
    url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=600&h=600'
  }
];