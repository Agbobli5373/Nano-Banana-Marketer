import React, { useState } from 'react';
import { AssetType, BrandConfig, StylePreset } from '../types';
import { ASSET_TYPES, STYLE_PRESETS } from '../constants';
import { Wand2, Loader2, Image as ImageIcon, Video } from 'lucide-react';

interface AssetGeneratorProps {
  onGenerate: (assets: AssetType[], style: StylePreset, customStyle: string) => void;
  isGenerating: boolean;
}

const AssetGenerator: React.FC<AssetGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['insta-post']);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(StylePreset.MINIMALIST);
  const [customStyle, setCustomStyle] = useState('');

  const toggleType = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleGenerateClick = () => {
    const assetsToGen = ASSET_TYPES.filter(t => selectedTypes.includes(t.id));
    if (assetsToGen.length === 0) return;
    onGenerate(assetsToGen, selectedStyle, customStyle);
  };

  return (
    <div className="space-y-6 bg-dark-surface p-6 rounded-xl border border-dark-border">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-banana-400" />
          Target Formats
        </h3>
        <p className="text-sm text-gray-400 mb-4">Select the marketing assets you need.</p>
        <div className="grid grid-cols-2 gap-3">
          {ASSET_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden ${
                selectedTypes.includes(type.id)
                  ? 'bg-banana-500/20 border-banana-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-slate-600'
              }`}
            >
              {type.mediaType === 'video' && (
                  <div className="absolute top-0 right-0 bg-banana-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                      VIDEO
                  </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                  {type.mediaType === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  <div className="font-medium text-sm">{type.label}</div>
              </div>
              <div className="text-xs opacity-70 mt-1">{type.aspectRatio} • {type.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Visual Style</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {Object.values(StylePreset).map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStyle === style
                  ? 'bg-banana-500 text-white shadow-lg shadow-banana-500/20'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        
        {selectedStyle === StylePreset.CUSTOM ? (
           <textarea
           value={customStyle}
           onChange={(e) => setCustomStyle(e.target.value)}
           placeholder="Describe your custom style (e.g., 'Cyberpunk neon city with rain')..."
           className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-banana-500 focus:border-transparent outline-none h-24"
         />
        ) : (
          <p className="text-xs text-gray-500 italic bg-slate-900/50 p-3 rounded border border-slate-800">
            "{STYLE_PRESETS[selectedStyle]}"
          </p>
        )}
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={isGenerating || selectedTypes.length === 0}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          isGenerating || selectedTypes.length === 0
            ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-banana-500 to-banana-600 text-white hover:scale-[1.02] shadow-xl shadow-banana-500/20'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Magic...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Assets
          </>
        )}
      </button>
    </div>
  );
};

export default AssetGenerator;