import React, { useState, useEffect, useRef } from 'react';
import { GeneratedAsset, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  selectedAsset: GeneratedAsset | null;
  onEdit: (asset: GeneratedAsset, instruction: string) => Promise<void>;
  isProcessing: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedAsset, onEdit, isProcessing }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedAsset) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `I've loaded your ${selectedAsset.typeId} asset. How would you like to refine it? You can ask me to change the background, adjust lighting, or add elements.`,
          timestamp: Date.now()
        }
      ]);
    } else {
        setMessages([
            {
                id: 'intro',
                role: 'model',
                text: "Select a generated asset from the gallery to start editing it with AI.",
                timestamp: Date.now()
            }
        ])
    }
  }, [selectedAsset?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedAsset || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      await onEdit(selectedAsset, userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I've updated the image based on your request. How does it look?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an issue editing the image. Please try a different instruction.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const suggestions = [
    "Make the background darker",
    "Add a soft morning light",
    "Place it on a marble table",
    "Add tropical leaves in background"
  ];

  return (
    <div className="flex flex-col h-full bg-dark-surface border-l border-dark-border">
      <div className="p-4 border-b border-dark-border bg-slate-900/50">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-banana-400" />
          AI Editor
        </h3>
        {selectedAsset && (
            <p className="text-xs text-gray-400 mt-1">Editing: {selectedAsset.id.slice(0,8)}...</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-banana-600' : 'bg-slate-700'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-banana-400" />}
            </div>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-banana-500/20 text-white border border-banana-500/30' 
                : 'bg-slate-800 text-gray-200 border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-dark-border bg-slate-900/50">
        {selectedAsset && messages.length < 3 && (
           <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
               {suggestions.map(s => (
                   <button 
                    key={s}
                    onClick={() => setInput(s)}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-gray-300 transition-colors"
                   >
                       {s}
                   </button>
               ))}
           </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedAsset ? "Ask for changes..." : "Select an image first"}
            disabled={!selectedAsset || isProcessing}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:border-banana-500 outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 top-2 p-1.5 bg-banana-500 hover:bg-banana-600 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;