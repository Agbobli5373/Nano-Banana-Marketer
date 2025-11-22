import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { SAMPLE_IMAGES } from '../constants';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelect: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large (Max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSample = async (url: string) => {
    // Fetch blob and convert to base64 for consistency with upload
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageSelect(reader.result as string);
        }
        reader.readAsDataURL(blob);
    } catch (e) {
        console.error("Error loading sample", e);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all text-center ${
          currentImage 
            ? 'border-banana-500/50 bg-slate-900/50' 
            : 'border-slate-700 hover:border-banana-500/50 hover:bg-slate-800/50'
        }`}
      >
        {currentImage ? (
          <div className="relative group">
            <img 
              src={currentImage} 
              alt="Product" 
              className="max-h-64 mx-auto rounded-lg shadow-lg object-contain" 
            />
            <button 
              onClick={() => onImageSelect('')}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer py-8"
          >
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-banana-500">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Upload Product Image</h3>
            <p className="text-sm text-gray-400">PNG or JPG up to 5MB</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange} 
        />
      </div>

      {!currentImage && (
        <div className="bg-dark-surface rounded-xl p-4 border border-dark-border">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Or choose a sample</h4>
          <div className="grid grid-cols-3 gap-3">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => loadSample(sample.url)}
                className="group relative rounded-lg overflow-hidden border border-slate-700 hover:border-banana-500 transition-all"
              >
                <img src={sample.url} alt={sample.name} className="w-full h-20 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                  <p className="text-[10px] text-center text-white truncate">{sample.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;