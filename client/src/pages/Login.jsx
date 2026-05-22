import React from 'react';
import { Github, Key, ShieldCheck, Activity, Sparkles, BookOpen, Lock } from 'lucide-react';
import Logo from '../assets/tech.png';

export default function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-zinc-950 overflow-hidden relative bg-fine-grid">
      {/* Dynamic backdrop glows across the screen - extremely subtle */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/[0.01] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/[0.01] rounded-full blur-3xl pointer-events-none"></div>

      {/* Left side: Premium Informative Dashboard (60% width) */}
      <div className="md:w-3/5 bg-zinc-950/40 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden min-h-[450px] md:min-h-0 border-r border-zinc-900/60 bg-fine-grid">
        {/* Subtle background highlighting */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/[0.01] rounded-full blur-3xl -z-10"></div>
        
        {/* Header Indicator */}
        <div className="flex items-center space-x-3 mb-8 md:mb-0">
          <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
            <Key className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase text-zinc-550 text-zinc-400">
            Developer Ecosystem
          </span>
        </div>

        {/* Hero content */}
        <div className="space-y-8 my-auto max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Unlock Your Ultimate <br />
              <span className="text-zinc-400">
                Public API Directory
              </span>
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-lg font-medium">
              API Vault is a meticulously curated index of open-source public APIs requiring API Key authentication.
              We simplify integrations by validating and verifying connection standards beforehand.
            </p>
          </div>

          {/* Grid detailing Purpose, Features, Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            {/* 1. Purpose */}
            <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl backdrop-blur-md space-y-2 hover:bg-zinc-900/20 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-zinc-400 group">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">Core Purpose</h3>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                To serve as a high-performance central vault, eliminating the friction of scouring developer forums for functional public endpoints.
              </p>
            </div>

            {/* 2. Key Features */}
            <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl backdrop-blur-md space-y-2 hover:bg-zinc-900/20 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">Technical Specs</h3>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                Directory mapping of 630+ verified keys, strict HTTPS security validations, and explicit CORS cross-origin tags.
              </p>
            </div>

            {/* 3. Delivered Services */}
            <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl backdrop-blur-md space-y-2 hover:bg-zinc-900/20 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-0.5 col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">Delivered Services</h3>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                Automatic hourly Background Health Monitoring job checking status pings, dynamic community rating decks, and detailed structural documentation summaries for developers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-zinc-600 text-[10px] mt-8 md:mt-0 flex items-center gap-2 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
          <span>Curated by and for software engineers globally.</span>
        </div>
      </div>

      {/* Right side: Login panel (40% width) */}
      <div className="md:w-2/5 flex flex-col justify-center items-center p-8 md:p-16 bg-zinc-950 border-l border-zinc-900/60 shadow-2xl relative z-10 bg-fine-grid">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 overflow-hidden rounded-2xl border border-zinc-800 flex items-center justify-center p-1 hover:scale-105 transition-transform duration-300 bg-zinc-900 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.05] to-indigo-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img src={Logo} alt="API Vault Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Unlock API Vault
            </h1>
            <p className="text-zinc-400 text-xs leading-relaxed px-4 font-medium">
              Enter the secured workspace to browse, filter, and interact with verified public API endpoints.
            </p>
          </div>

          <div className="bg-zinc-900/10 border border-zinc-900 p-6 rounded-2xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-[11px] font-mono border-b border-zinc-900/60 pb-3">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>SECURED ACCESS PORTAL</span>
            </div>

            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-200 shadow-lg active:scale-[0.98] select-none"
            >
              <Github className="w-4 h-4 text-white" />
              <span className="text-xs tracking-wide">Sign in with GitHub</span>
            </button>
            <div className="text-center text-[9px] text-zinc-555 text-zinc-500 leading-relaxed font-medium">
              By signing in, you authorize your GitHub account to upvote and rate API listings. We do not write to or read your private repositories.
            </div>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-2 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All services fully operational</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
