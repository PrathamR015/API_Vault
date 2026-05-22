import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import APIGrid from '../components/APIGrid';
import AIChatDrawer from '../components/AIChatDrawer';
import useStore from '../store/useStore';
import { 
  Terminal, Copy, Check, Shield, Globe, KeyRound, ArrowRight, Zap, Sparkles, 
  Code2, MapPin, Coins, TrendingUp 
} from 'lucide-react';

export default function Home() {
  const { isSidebarOpen } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('ai') === 'true') {
      setIsChatOpen(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('ai');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.delete('ids');
    newParams.delete('curated');
    newParams.delete('curatedPrompt');
    setSearchParams(newParams);
  };

  const handleCategoryClick = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    newParams.delete('ids');
    newParams.delete('curated');
    newParams.delete('curatedPrompt');
    setSearchParams(newParams);
    
    // Smooth scroll to the APIs section after DOM updates
    setTimeout(() => {
      document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const codeSnippet = `import { useQuery } from 'api-vault';

// Retrieve secure API credentials
const { data, loading } = useQuery({
  endpoint: 'geocoding/coordinates',
  auth: 'API Key'
});`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] relative bg-zinc-950 overflow-hidden bg-fine-grid">
      {/* Background ambient spotlight elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none -z-10 animate-slow-pulse"></div>

      <Sidebar />
      
      <div 
        className={`flex-grow p-6 md:p-8 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Gorgeous Welcome Banner */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col lg:flex-row overflow-hidden relative group shadow-xl p-6 md:p-8 gap-8 items-center bg-fine-grid">
            
            <div className="lg:w-1/2 flex flex-col justify-center space-y-5 z-10">
              <div className="flex items-center gap-2">
                <span className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 select-none shadow-sm">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>Version 1.0.4 Release</span>
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  API Vault
                </span>
              </h2>
              
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-md font-medium">
                Discover a carefully curated collection of verified open-source public APIs requiring API Keys. 
                Whether you need map geocoding data, blockchain telemetry, financial rates, or developer utilities, we have you covered.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md border border-blue-500/30 flex items-center space-x-2 px-5 py-3.5 active:scale-95 select-none"
                >
                  <span>Explore secure APIs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* High-End IDE Snippet Widget */}
            <div className="lg:w-1/2 w-full flex items-center justify-center">
              <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-2xl shadow-xl w-full max-w-md h-52 flex flex-col p-4 relative group/code font-mono overflow-hidden">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-900">
                  <div className="flex gap-1.5 select-none">
                    <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700"></div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-blue-500" />
                    <span>query_snippet.js</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-all select-none duration-150 active:scale-90"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                
                <div className="text-[11px] leading-relaxed text-zinc-300 select-all overflow-x-auto whitespace-pre">
                  <div>
                    <span className="text-pink-500 font-semibold">import</span> {'{'} <span className="text-cyan-400">useQuery</span> {'}'} <span className="text-pink-500 font-semibold">from</span> <span className="text-emerald-400">'api-vault'</span>;
                  </div>
                  <div className="text-zinc-500 my-1.5">// Retrieve secure API credentials</div>
                  <div>
                    <span className="text-pink-500 font-semibold">const</span> {'{'} data, loading {'}'} = <span className="text-cyan-400 font-semibold">useQuery</span>({'{'}
                  </div>
                  <div className="pl-4">
                    endpoint: <span className="text-emerald-400">'geocoding/coordinates'</span>,
                  </div>
                  <div className="pl-4">
                    auth: <span className="text-emerald-400">'API Key'</span>
                  </div>
                  <div>{'}'});</div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 text-6xl opacity-[0.015] rotate-12 select-none pointer-events-none font-bold text-white">
                  VAULT
                </div>
              </div>
            </div>
          </div>

          {/* Top Featured Categories */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white tracking-tight">Featured Collections</h3>
                <p className="text-xs text-zinc-500 font-medium">Quick filter endpoints by specialized service domains</p>
              </div>
              <button 
                onClick={() => handleCategoryClick('All')}
                className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-800 hover:border-zinc-700 transition-all select-none active:scale-95"
              >
                View All Categories
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Category 1: Development */}
              <div 
                onClick={() => handleCategoryClick('Development')}
                className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl cursor-pointer group flex flex-col h-full hover:border-zinc-800 hover:bg-zinc-900/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:border-zinc-700 transition-all duration-300">
                  <Code2 className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-white font-extrabold text-sm mb-1.5 group-hover:text-blue-400 transition-colors">Development</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-grow font-medium">
                  Boilerplate builders, documentation generators, scrapers, and other essential software engineering tools.
                </p>
                <span className="text-zinc-400 text-[10px] font-bold mt-auto group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
              
              {/* Category 2: Geocoding */}
              <div 
                onClick={() => handleCategoryClick('Geocoding')}
                className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl cursor-pointer group flex flex-col h-full hover:border-zinc-800 hover:bg-zinc-900/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:border-zinc-700 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-white font-extrabold text-sm mb-1.5 group-hover:text-blue-400 transition-colors">Geocoding</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-grow font-medium">
                  Map APIs, postcode lookups, IP tracking, route planning, and geographical coordinate systems.
                </p>
                <span className="text-zinc-400 text-[10px] font-bold mt-auto group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* Category 3: Cryptocurrency */}
              <div 
                onClick={() => handleCategoryClick('Cryptocurrency')}
                className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl cursor-pointer group flex flex-col h-full hover:border-zinc-800 hover:bg-zinc-900/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:border-zinc-700 transition-all duration-300">
                  <Coins className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-white font-extrabold text-sm mb-1.5 group-hover:text-blue-400 transition-colors">Cryptocurrency</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-grow font-medium">
                  Blockchain data explorers, crypto prices, mining calculations, gas fees, and wallet monitoring APIs.
                </p>
                <span className="text-zinc-400 text-[10px] font-bold mt-auto group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* Category 4: Finance */}
              <div 
                onClick={() => handleCategoryClick('Finance')}
                className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl cursor-pointer group flex flex-col h-full hover:border-zinc-800 hover:bg-zinc-900/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:border-zinc-700 transition-all duration-300">
                  <TrendingUp className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-white font-extrabold text-sm mb-1.5 group-hover:text-blue-400 transition-colors">Finance</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-grow font-medium">
                  Real-time stocks, market analytics, FX currency exchange rates, and business finance metrics.
                </p>
                <span className="text-zinc-400 text-[10px] font-bold mt-auto group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </div>

          {/* Key Vault Features Section */}
          <div className="bg-zinc-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group border border-zinc-900 bg-fine-grid">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-3xl -z-10 group-hover:bg-blue-500/[0.04] transition-all duration-700 pointer-events-none"></div>
            
            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-extrabold text-white">Key Vault Parameters</h3>
              <p className="text-zinc-400 text-xs max-w-2xl leading-relaxed font-medium">
                We curate and verify public endpoints to give developers a seamless, ready-to-use experience. 
                Our directory focuses on three crucial integration features:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Feature 1 */}
              <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 hover:bg-zinc-900/25 hover:border-zinc-800 transition-all duration-300">
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 font-bold shadow-sm">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-extrabold text-sm text-white mb-2">API Key Authentication</h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed font-medium">
                  Every single API in this database requires an API Key. No complicated multi-legged setups — obtain your credential and get down to building.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 hover:bg-zinc-900/25 hover:border-zinc-800 transition-all duration-300">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-emerald-400 font-bold shadow-sm">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-extrabold text-sm text-white mb-2">HTTPS Encryption</h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed font-medium">
                  Security at the core. Filter secure connections to enforce strict HTTPS standard TLS/SSL communication profiles on client apps.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 hover:bg-zinc-900/25 hover:border-zinc-800 transition-all duration-300">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4 text-indigo-400 font-bold shadow-sm">
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="font-extrabold text-sm text-white mb-2">CORS-Enabled</h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed font-medium">
                  Filter for direct client-to-API requests with standard Cross-Origin Resource Sharing (CORS) attributes, bypassing proxy servers.
                </p>
              </div>
            </div>
          </div>

          {/* Main API Listing (Collections equivalent) */}
          <div id="api-grid-section" className="scroll-mt-24 pt-6 border-t border-slate-900">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {searchParams.get('curated') ? 'AI Curated Stack' : searchParams.get('category') ? `${searchParams.get('category')} APIs` : 'Curated API Collection'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {searchParams.get('curated') ? 'Displaying expert matched APIs tailored to your specification' : 'Browsing verified endpoints matching query parameters'}
                </p>
              </div>
              {(searchParams.get('category') || searchParams.get('curated')) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-slate-400 hover:text-blue-400 text-xs font-bold flex items-center gap-1.5 transition-colors bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl active:scale-95 hover:border-slate-700"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* AI Curated Specific Banner */}
            {searchParams.get('curated') && (
              <div className="mb-6 p-4 bg-zinc-900/10 border border-zinc-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-fine-grid">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Active AI Filter
                    </span>
                    <p className="text-white font-extrabold text-xs mt-1 leading-relaxed">
                      Curated Stack: "{searchParams.get('curatedPrompt')}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-800 hover:border-zinc-700 active:scale-95 select-none"
                >
                  Reset View
                </button>
              </div>
            )}

            <APIGrid />
          </div>
        </div>
      </div>

      {/* Floating Sparkles Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 border border-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-zinc-850 hover:border-zinc-700 transition-all select-none active:scale-95 shadow-2xl z-50 group shadow-black/60 animate-bounce"
        style={{ animationDuration: '3s' }}
        title="Ask AI Curator"
      >
        <Sparkles className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform animate-pulse" />
      </button>

      {/* AI Curation Chat Drawer */}
      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
