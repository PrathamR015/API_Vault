import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Video, Cpu, HelpCircle, Layers, ArrowRight, 
  Terminal, ShieldCheck, Zap, Globe, Sparkles, Code2 
} from 'lucide-react';

export default function KnowMore() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-grow min-h-[calc(100vh-4rem)] bg-zinc-950 p-6 md:p-8 flex items-center justify-center relative overflow-hidden bg-fine-grid">
      {/* Dynamic Background Spotlights for premium aesthetic */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/[0.02] rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-indigo-600/[0.025] rounded-full blur-3xl pointer-events-none -z-10"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full space-y-10 py-10"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <span className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5 select-none shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Developer Learning Center</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Demystifying <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-zinc-300 bg-clip-text text-transparent">APIs & Integrations</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm max-w-2xl mx-auto font-medium">
            Learn what APIs are, how they bridge external services together, and how to harness their full capability to build modern, high-fidelity applications.
          </p>
        </motion.div>

        {/* Video Section (Centerpiece) */}
        <motion.div 
          variants={itemVariants}
          className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden bg-fine-grid"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.015] to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                <Video className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">Featured Educational Video</h2>
            </div>
            
            <p className="text-zinc-400 text-xs text-center max-w-lg font-medium">
              Watch this highly-acclaimed visual explanation breaking down exactly how APIs handle request-response cycles in software design.
            </p>

            {/* Responsive Iframe Container */}
            <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-zinc-850 shadow-2xl bg-zinc-950 relative group">
              <iframe
                src="https://www.youtube.com/embed/s7wmiS2mSXY"
                title="What is an API?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 rounded-2xl"
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* Conceptual Grid Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Box 1: What is an API? */}
          <motion.div 
            variants={itemVariants} 
            className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group bg-fine-grid"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-transparent pointer-events-none"></div>
            
            <div className="space-y-4">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                <HelpCircle className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white">What is an API?</h3>
              <p className="text-zinc-400 text-[12px] leading-relaxed font-medium">
                An API (Application Programming Interface) is a software intermediary that allows two distinct applications to talk to each other. Whenever you use a mobile app to check the weather or send a message, you’re utilizing APIs.
              </p>
              
              {/* Process Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-blue-400 font-bold select-none mt-0.5">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300">The Request</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Your client application initiates an HTTP call specifying target URLs, parameters, and headers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-blue-400 font-bold select-none mt-0.5">2</span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300">The Server Processing</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">The target API server intercepts the call, verifies authorization, executes internal logic, and queries databases.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-blue-400 font-bold select-none mt-0.5">3</span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300">The Structured Response</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">The server formats data (typically as JSON) and sends a response back to the client application with HTTP status codes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-zinc-900/60 mt-6 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>REST Protocols</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>Structured JSON</span>
              </div>
            </div>
          </motion.div>

          {/* Box 2: What is API Integration? */}
          <motion.div 
            variants={itemVariants} 
            className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group bg-fine-grid"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-transparent pointer-events-none"></div>
            
            <div className="space-y-4">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                <Layers className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white">What is API Integration?</h3>
              <p className="text-zinc-400 text-[12px] leading-relaxed font-medium">
                API Integration refers to the seamless connection between multiple software systems that allows data to flow automatically. Rather than writing complex utilities from scratch, developers integrate mature APIs to delegate core heavy lifting.
              </p>

              {/* Pillars of Integration */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Rapid Development</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Instantly add maps, weather channels, AI processing, or payment gateways.</p>
                  </div>
                </div>
                
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Enhanced Security</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Keep credentials safe. API Vault focuses on APIs using standard Key verification layers.</p>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Flexible Modular Design</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Swap service providers easily without rewriting substantial application layouts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-zinc-900/60 mt-6 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>API Keys Layer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Scalable Architectures</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dynamic CTA Card calling back to Vault and AI curator */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-950/20 via-indigo-950/20 to-zinc-950/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
              <span>Ready to Architect Your App?</span>
            </h3>
            <p className="text-zinc-400 text-xs max-w-xl font-medium">
              Explore the database of 630+ public APIs, or launch the Project Assistant to leverage Gemini AI and compose your curated tech stack in seconds.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700 shadow-md select-none text-center active:scale-[0.98]"
            >
              Browse API Vault
            </button>
            <button
              onClick={() => navigate('/?ai=true')}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 select-none active:scale-[0.98]"
            >
              <span>Launch AI Curator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
