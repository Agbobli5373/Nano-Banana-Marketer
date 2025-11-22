import React, { useState, useEffect } from 'react';
import { BrandConfig, AssetType, StylePreset, GeneratedAsset } from './types';
import { geminiService } from './services/geminiService';
import BrandConfigPanel from './components/BrandConfigPanel';
import ImageUploader from './components/ImageUploader';
import AssetGenerator from './components/AssetGenerator';
import ChatInterface from './components/ChatInterface';
import { Download, LayoutGrid, Zap, Menu, Eye, Trash2, X, Video as VideoIcon, Play } from 'lucide-react';

const App: React.FC = () => {
  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
    name: '',
    tone: 'Luxury & Sophisticated',
    tagline: '',
    palette: '',
    productName: ''
  });

  const [productImage, setProductImage] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<GeneratedAsset | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check for API Key on mount
  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("WARNING: process.env.API_KEY is missing. The app will likely fail to generate images.");
    }
  }, []);

  const handleGenerate = async (types: AssetType[], style: StylePreset, customStyle: string) => {
    if (!productImage) return;
    setIsGenerating(true);

    try {
        // Check if any video types are selected
        const hasVideo = types.some(t => t.mediaType === 'video');
        
        // Check for Paid API Key selection for Veo
        if (hasVideo && (window as any).aistudio) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await (window as any).aistudio.openSelectKey();
                // Note: Race condition mentioned in instructions suggests proceeding immediately after.
            }
        }

      const promises = types.map(async (type) => {
        // Create placeholder
        const placeholderId = Date.now().toString() + Math.random();
        const placeholder: GeneratedAsset = {
          id: placeholderId,
          url: '',
          typeId: type.id,
          timestamp: Date.now(),
          prompt: style,
          isLoading: true,
          mediaType: type.mediaType
        };
        
        setGeneratedAssets(prev => [placeholder, ...prev]);

        let resultUrl = '';
        
        try {
            if (type.mediaType === 'video') {
                resultUrl = await geminiService.generateVideoAsset(
                    productImage,
                    brandConfig,
                    style,
                    customStyle
                );
            } else {
                resultUrl = await geminiService.generateMarketingAsset(
                    productImage,
                    brandConfig,
                    type,
                    style,
                    customStyle
                );
            }

            // Update placeholder
            setGeneratedAssets(prev => prev.map(a => 
              a.id === placeholderId 
                ? { ...a, url: resultUrl, isLoading: false }
                : a
            ));
        } catch (err) {
            console.error("Failed to generate asset", type.id, err);
            // Remove failed placeholder
            setGeneratedAssets(prev => prev.filter(a => a.id !== placeholderId));
            // Optional: notify user
        }
      });

      await Promise.all(promises);
    } catch (error) {
      alert("Error starting generation. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (asset: GeneratedAsset, instruction: string) => {
    if (asset.mediaType === 'video') {
        alert("Editing videos via chat is not yet supported.");
        return;
    }
    
    setIsGenerating(true);
    try {
        const newImageBase64 = await geminiService.editAsset(asset.url, instruction);
        const newAsset: GeneratedAsset = {
            id: Date.now().toString(),
            url: newImageBase64,
            typeId: asset.typeId,
            timestamp: Date.now(),
            prompt: "Edited: " + instruction,
            isLoading: false,
            mediaType: 'image'
        };
        setGeneratedAssets(prev => [newAsset, ...prev]);
        setSelectedAssetId(newAsset.id);
    } catch (error) {
        console.error("Edit failed", error);
        throw error;
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      setGeneratedAssets(prev => prev.filter(a => a.id !== assetId));
      if (selectedAssetId === assetId) setSelectedAssetId(null);
      if (previewAsset?.id === assetId) setPreviewAsset(null);
    }
  };

  const selectedAsset = generatedAssets.find(a => a.id === selectedAssetId) || null;

  return (
    <div className="flex h-screen bg-dark-bg text-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-dark-surface border-b border-dark-border z-50 p-4 flex justify-between items-center">
        <h1 className="font-bold text-banana-500">Nano Banana</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu /></button>
      </div>

      {/* Left Sidebar - Configuration */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 h-full bg-dark-surface border-r border-dark-border z-40 transition-transform duration-300 overflow-y-auto custom-scrollbar flex flex-col`}>
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-banana-400 to-banana-600 flex items-center justify-center text-black font-bold">
                 NB
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Nano Banana
             </h1>
          </div>
          <p className="text-xs text-gray-500">AI Product Marketing Suite</p>
        </div>

        <div className="p-6 space-y-8 pb-20">
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Input</h3>
            <ImageUploader 
              currentImage={productImage} 
              onImageSelect={setProductImage} 
            />
          </section>

          <section>
             <BrandConfigPanel config={brandConfig} onChange={setBrandConfig} />
          </section>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 border-b border-dark-border bg-dark-bg/50 backdrop-blur-sm flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-4">
               <h2 className="text-lg font-medium text-white">Workspace</h2>
               {!process.env.API_KEY && (
                   <span className="px-3 py-1 bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-full">
                       Missing API Key
                   </span>
               )}
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={() => {
                  if(window.confirm("Delete all assets?")) setGeneratedAssets([])
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors"
               >
                   Clear Gallery
               </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Generation Control */}
                {productImage && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AssetGenerator 
                            onGenerate={handleGenerate} 
                            isGenerating={isGenerating} 
                        />
                    </section>
                )}

                {/* Gallery */}
                <section>
                   <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-semibold flex items-center gap-2">
                           <LayoutGrid className="w-5 h-5 text-banana-400" />
                           Generated Assets
                       </h3>
                       <span className="text-sm text-gray-500">{generatedAssets.length} items</span>
                   </div>
                   
                   {generatedAssets.length === 0 ? (
                       <div className="h-64 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-gray-500">
                           <Zap className="w-12 h-12 mb-3 opacity-20" />
                           <p>No assets generated yet.</p>
                           <p className="text-sm opacity-60">Upload a product and click generate to start.</p>
                       </div>
                   ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {generatedAssets.map((asset) => (
                               <div 
                                key={asset.id}
                                onClick={() => !asset.isLoading && setSelectedAssetId(asset.id)}
                                className={`relative group rounded-xl overflow-hidden bg-dark-surface border transition-all cursor-pointer ${
                                    selectedAssetId === asset.id 
                                    ? 'border-banana-500 ring-2 ring-banana-500/20 shadow-lg shadow-banana-500/10' 
                                    : 'border-dark-border hover:border-gray-600'
                                }`}
                               >
                                   <div className={`aspect-[${asset.typeId === 'web-banner' ? '16/9' : asset.typeId === 'insta-story' || asset.typeId === 'tiktok-ad' ? '9/16' : '1/1'}] bg-slate-900 relative`}>
                                       {asset.isLoading ? (
                                           <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                               <div className="w-8 h-8 border-4 border-banana-500 border-t-transparent rounded-full animate-spin"></div>
                                               {asset.mediaType === 'video' && <p className="text-xs text-banana-400 animate-pulse">Generating Video...</p>}
                                           </div>
                                       ) : (
                                           asset.mediaType === 'video' ? (
                                               <div className="w-full h-full flex items-center justify-center bg-black relative">
                                                    <video src={asset.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                                                        <VideoIcon className="w-4 h-4 text-white" />
                                                    </div>
                                               </div>
                                           ) : (
                                               <img src={asset.url} alt="Generated" className="w-full h-full object-cover" />
                                           )
                                       )}
                                       
                                       {/* Overlays */}
                                       {!asset.isLoading && (
                                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                                               <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewAsset(asset);
                                                }}
                                                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-colors"
                                                title="View"
                                               >
                                                   {asset.mediaType === 'video' ? <Play className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                               </button>
                                               <a 
                                                href={asset.url} 
                                                download={`banana-asset-${asset.id}.${asset.mediaType === 'video' ? 'mp4' : 'png'}`}
                                                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                                title="Download"
                                               >
                                                   <Download className="w-5 h-5" />
                                               </a>
                                               <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAsset(asset.id);
                                                }}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/80 backdrop-blur rounded-full text-white transition-colors"
                                                title="Delete"
                                               >
                                                   <Trash2 className="w-5 h-5" />
                                               </button>
                                           </div>
                                       )}
                                   </div>
                                   <div className="p-3">
                                       <div className="flex justify-between items-center">
                                           <span className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded ${
                                               asset.mediaType === 'video' ? 'bg-purple-500/20 text-purple-400' : 'bg-banana-500/10 text-banana-400'
                                           }`}>
                                               {asset.typeId.replace('-', ' ')}
                                           </span>
                                           <span className="text-[10px] text-gray-500">
                                               {new Date(asset.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                           </span>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
                </section>
            </div>
        </main>
      </div>

      {/* Right Sidebar - Chat Editor */}
      <div className="w-80 border-l border-dark-border bg-dark-surface z-30 hidden lg:block">
         <ChatInterface 
            selectedAsset={selectedAsset} 
            onEdit={handleEdit}
            isProcessing={isGenerating}
         />
      </div>

      {/* Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setPreviewAsset(null)}>
            <div className="relative max-w-7xl w-full max-h-screen flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
                
                <button 
                    onClick={() => setPreviewAsset(null)}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-10 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center p-4">
                    {previewAsset.mediaType === 'video' ? (
                        <video 
                            src={previewAsset.url} 
                            controls 
                            autoPlay 
                            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                        />
                    ) : (
                        <img 
                            src={previewAsset.url} 
                            alt="Preview" 
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                        />
                    )}
                </div>

                <div className="flex gap-4 mt-6">
                    <a 
                        href={previewAsset.url} 
                        download={`banana-asset-${previewAsset.id}.${previewAsset.mediaType === 'video' ? 'mp4' : 'png'}`}
                        className="px-6 py-3 bg-banana-500 hover:bg-banana-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-banana-500/20 transition-all hover:scale-105"
                    >
                        <Download className="w-5 h-5" /> 
                        Download {previewAsset.mediaType === 'video' ? 'Video' : 'Asset'}
                    </a>
                     <button 
                        onClick={() => handleDeleteAsset(previewAsset.id)}
                        className="px-6 py-3 bg-red-500/20 hover:bg-red-500 text-white rounded-xl font-medium flex items-center gap-2 border border-red-500/50 transition-all hover:scale-105"
                    >
                        <Trash2 className="w-5 h-5" /> 
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;