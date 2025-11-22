import { GoogleGenAI } from "@google/genai";
import { BrandConfig, AssetType, StylePreset } from "../types";
import { STYLE_PRESETS } from "../constants";

// Helper to convert base64 to standard format if needed, 
// though Gemini accepts the raw base64 string usually in `inlineData`.
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string;

  constructor() {
    // In a real scenario, this comes from process.env.API_KEY
    // For this generated code to be runnable by the user without .env setup immediately,
    // we assume it is available. 
    this.apiKey = process.env.API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async generateMarketingAsset(
    productImageBase64: string,
    brandConfig: BrandConfig,
    assetType: AssetType,
    stylePreset: StylePreset,
    customStyle?: string
  ): Promise<string> {
    
    if (!this.apiKey) throw new Error("API Key not found");

    const styleDescription = stylePreset === StylePreset.CUSTOM 
      ? customStyle 
      : STYLE_PRESETS[stylePreset];

    const prompt = `
      Create a professional high-quality marketing image for a product named "${brandConfig.productName}".
      
      Brand Identity:
      - Brand Name: ${brandConfig.name}
      - Tone: ${brandConfig.tone}
      - Tagline: ${brandConfig.tagline}
      - Color Palette: ${brandConfig.palette}
      
      Visual Style:
      ${styleDescription}
      
      Requirements:
      - The product (provided in the image) must be the central focal point.
      - Place the product in a scene fitting the description above.
      - Ensure the lighting is professional studio quality.
      - The aspect ratio is strictly ${assetType.aspectRatio}.
      - IMPORTANT: Try to include the text "${brandConfig.name}" elegantly in the image if it fits the composition naturaly.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt
            },
            {
              inlineData: {
                mimeType: getMimeType(productImageBase64),
                data: cleanBase64(productImageBase64)
              }
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: assetType.aspectRatio,
            // imageSize: "1K" // Flash image supports standard resolution
          }
        }
      });

      // Extract image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      
      throw new Error("No image generated in response");
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw error;
    }
  }

  async generateVideoAsset(
    productImageBase64: string,
    brandConfig: BrandConfig,
    stylePreset: StylePreset,
    customStyle?: string
  ): Promise<string> {
      // Re-initialize AI client to ensure we use the potentially newly selected API key for Veo
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const styleDescription = stylePreset === StylePreset.CUSTOM 
      ? customStyle 
      : STYLE_PRESETS[stylePreset];

      const prompt = `Create a high-quality, cinematic product advertisement video for "${brandConfig.productName}" by ${brandConfig.name}. 
      Style: ${styleDescription}. 
      Tone: ${brandConfig.tone}.
      The video should be engaging, professional, and suitable for social media (TikTok/Reels). Focus on the product details and aesthetic appeal. Motion should be dynamic but smooth.`;

      let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt,
          image: {
              imageBytes: cleanBase64(productImageBase64),
              mimeType: getMimeType(productImageBase64),
          },
          config: {
              numberOfVideos: 1,
              resolution: '720p',
              aspectRatio: '9:16'
          }
      });

      // Poll for completion
      while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.operations.getVideosOperation({operation: operation});
      }
      
      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) throw new Error("Video generation failed");
      
      // Append key for immediate fetch/display
      return `${videoUri}&key=${process.env.API_KEY}`;
  }

  async editAsset(
    originalImageBase64: string,
    instruction: string
  ): Promise<string> {
    if (!this.apiKey) throw new Error("API Key not found");

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Edit this image. Instruction: ${instruction}. Maintain the product identity but change the environment or elements as requested.`
            },
            {
              inlineData: {
                mimeType: getMimeType(originalImageBase64),
                data: cleanBase64(originalImageBase64)
              }
            }
          ]
        }
        // Note: editing typically keeps original aspect ratio unless specified
      });

       for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No edited image returned");
    } catch (error) {
      console.error("Gemini Edit Error:", error);
      throw error;
    }
  }

  async generateCaption(image: string, brandConfig: BrandConfig): Promise<string> {
    // Use the text model for captioning
     if (!this.apiKey) throw new Error("API Key not found");
     
     try {
       const response = await this.ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: {
           parts: [
             {
               text: `Write a catchy Instagram caption for this product image. Brand: ${brandConfig.name}. Product: ${brandConfig.productName}. Tone: ${brandConfig.tone}. Include 3 relevant hashtags.`
             },
             {
               inlineData: {
                 mimeType: getMimeType(image),
                 data: cleanBase64(image)
               }
             }
           ]
         }
       });
       return response.text || "Could not generate caption.";
     } catch (e) {
       console.error(e);
       return "Error generating caption.";
     }
  }
}

export const geminiService = new GeminiService();