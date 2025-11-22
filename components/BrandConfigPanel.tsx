import React from 'react';
import { BrandConfig } from '../types';
import { Briefcase, MessageCircle, Palette, Tag } from 'lucide-react';

interface BrandConfigPanelProps {
  config: BrandConfig;
  onChange: (config: BrandConfig) => void;
}

const BrandConfigPanel: React.FC<BrandConfigPanelProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof BrandConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="bg-dark-surface rounded-xl border border-dark-border p-5 space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-banana-400" />
        Brand Identity
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Brand Name</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-banana-500 outline-none transition-colors"
            placeholder="e.g. Aura Glow"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Product Name</label>
          <div className="relative">
             <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={config.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-banana-500 outline-none transition-colors"
              placeholder="e.g. Vitamin C Serum"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Tagline</label>
          <input
            type="text"
            value={config.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-banana-500 outline-none transition-colors"
            placeholder="e.g. Radiance in a bottle"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Brand Tone & Voice</label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <select
              value={config.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-banana-500 outline-none appearance-none cursor-pointer"
            >
              <option value="Professional & Trustworthy">Professional & Trustworthy</option>
              <option value="Playful & Fun">Playful & Fun</option>
              <option value="Luxury & Sophisticated">Luxury & Sophisticated</option>
              <option value="Natural & Organic">Natural & Organic</option>
              <option value="Innovative & Tech-forward">Innovative & Tech-forward</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Color Palette</label>
          <div className="relative">
            <Palette className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={config.palette}
              onChange={(e) => handleChange('palette', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-banana-500 outline-none transition-colors"
              placeholder="e.g. Gold, Black, White"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandConfigPanel;