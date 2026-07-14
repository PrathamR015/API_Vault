import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Sparkles, AlertTriangle, RotateCw, Check, ArrowRight, 
  Trash2, Terminal, Library, Info, ChevronRight, Zap
} from 'lucide-react';
import { curateAPIs } from '../services/api';

export default function AIChatDrawer({ isOpen, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your Project Assistant. Describe your project requirements or the system you want to build (e.g. 'I want to build a fitness tracker app showing user routes on a map with geocoding'), and I will curate the perfect API stack for you directly from our Vault.",
      isFirst: true
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setError(null);

    // Append user message
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Build history for the backend
      const backendHistory = chatHistory
        .filter(m => !m.isFirst) // Skip initial greeting
        .map(m => ({
          sender: m.sender,
          text: typeof m.text === 'string' ? m.text : m.text.explanation
        }));

      const data = await curateAPIs(userMessage, backendHistory);

      // Append AI response
      setChatHistory(prev => [...prev, { 
        sender: 'ai', 
        text: data, // holds { explanation, categories }
        userPrompt: userMessage
      }]);
    } catch (err) {
      console.error('Curation request failed:', err);
      setError(
        err.response?.data?.message || 
        "Failed to curate APIs. Please verify your backend server connection and OpenRouter configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCuration = (recommendation, userPrompt) => {
    // Extract all unique API IDs
    const apiIds = [];
    recommendation.categories.forEach(cat => {
      cat.apis.forEach(api => {
        if (api.id && !apiIds.includes(api.id)) {
          apiIds.push(api.id);
        }
      });
    });

    if (apiIds.length === 0) return;

    const newParams = new URLSearchParams();
    newParams.set('ids', apiIds.join(','));
    newParams.set('curated', 'true');
    newParams.set('curatedPrompt', userPrompt);
    setSearchParams(newParams);

    // Smooth scroll to grid section
    setTimeout(() => {
      document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);

    onClose();
  };

  const clearChat = () => {
    setChatHistory([
      {
        sender: 'ai',
        text: "Hello! I am your Project Assistant. Describe your project requirements or the system you want to build (e.g. 'I want to build a fitness tracker app showing user routes on a map with geocoding'), and I will curate the perfect API stack for you directly from our Vault.",
        isFirst: true
      }
    ]);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[3px] z-[110]"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-zinc-950 border-l border-zinc-900 shadow-2xl z-[120] flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Project Assistant</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Plan with AI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  title="Clear history"
                  className="p-2 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all select-none active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all select-none active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & History */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-fine-grid">
              {chatHistory.map((msg, index) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={index} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 border text-xs md:text-sm font-medium leading-relaxed ${
                      isAI 
                        ? 'bg-zinc-900/40 border-zinc-900 text-zinc-300' 
                        : 'bg-blue-600 border-blue-500 text-white font-semibold shadow-md'
                    }`}>
                      {isAI ? (
                        typeof msg.text === 'string' ? (
                          <p>{msg.text}</p>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-zinc-300 leading-relaxed">
                              {msg.text.explanation}
                            </p>

                            {/* Render Dynamic Curated Categories */}
                            {msg.text.categories && msg.text.categories.length > 0 && (
                              <div className="space-y-4 mt-4 pt-4 border-t border-zinc-900">
                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                                  <Library className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>Curated Architecture Stack</span>
                                </div>

                                {msg.text.categories.map((cat, catIdx) => (
                                  <div key={catIdx} className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-3.5 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-white font-extrabold text-xs">{cat.name}</h4>
                                      <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        {cat.apis.length} {cat.apis.length === 1 ? 'API' : 'APIs'}
                                      </span>
                                    </div>
                                    <p className="text-[10.5px] text-zinc-400 font-medium leading-relaxed italic border-l-2 border-zinc-800 pl-2">
                                      {cat.reason}
                                    </p>

                                    {/* Category APIs List */}
                                    <div className="space-y-2 pt-1.5">
                                      {cat.apis.map((api, apiIdx) => (
                                        <div key={apiIdx} className="bg-zinc-900/40 border border-zinc-900/60 hover:border-zinc-800 hover:bg-zinc-900/80 transition-all rounded-lg p-2.5 flex flex-col space-y-1 group">
                                          <div className="flex justify-between items-center">
                                            <span className="text-white font-bold text-[11px] group-hover:text-blue-400 transition-colors">
                                              {api.title}
                                            </span>
                                          </div>
                                          <span className="text-zinc-400 text-[10px] leading-relaxed font-medium">
                                            {api.reason}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}

                                {/* Curate Stack Master Button */}
                                <button
                                  onClick={() => handleApplyCuration(msg.text, msg.userPrompt)}
                                  className="w-full mt-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center space-x-2 py-3 active:scale-[0.98] select-none shadow-md shadow-black/40 group"
                                >
                                  <span>Apply Stack to Vault Grid</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 space-y-2 max-w-[85%] w-64 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <RotateCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                      <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Curating Database...</span>
                    </div>
                    <div className="h-3 bg-zinc-850 rounded w-full"></div>
                    <div className="h-3 bg-zinc-850 rounded w-5/6"></div>
                    <div className="h-3 bg-zinc-850 rounded w-4/6"></div>
                  </div>
                </div>
              )}

              {/* Error Bubble */}
              {error && (
                <div className="flex justify-center p-2">
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-medium space-y-2 flex flex-col w-full max-w-sm">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span className="font-extrabold uppercase tracking-wide">Curation Error</span>
                    </div>
                    <p className="leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-zinc-900 bg-zinc-950">
              <div className="relative flex items-center">
                <textarea
                  rows="1"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Ask for project spec APIs..."
                  className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-900 focus:border-zinc-700 text-white rounded-xl py-3 pl-4 pr-12 text-xs md:text-sm font-medium focus:outline-none placeholder-zinc-500 transition-all resize-none max-h-24 custom-scrollbar"
                />
                <button
                  type="submit"
                  disabled={!prompt.trim() || loading}
                  className="absolute right-2.5 p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none duration-150 active:scale-90"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[9px] text-zinc-600 mt-2 text-center select-none font-medium">
                Tip: Press Enter to send. Matches from 630+ local endpoints.
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
