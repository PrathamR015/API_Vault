import { motion } from 'framer-motion';
import { ExternalLink, FileText, X, Heart, ShieldCheck, Activity, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 16 }
  },
  hover: {
    y: -4,
    boxShadow: '0 16px 24px -8px rgba(0, 0, 0, 0.6)',
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const badgeVariants = {
  hover: { scale: 1.02 }
};

export default function APICard({ api, isSelected, onClick }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(
    Math.floor((api.title.charCodeAt(0) * 13) % 45) + 12
  );

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const pricingColors = {
    FREE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    FREEMIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PAID: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    PAY_PER_USE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Unknown: 'bg-zinc-800 text-zinc-400 border-zinc-700'
  };

  return (
    <motion.div
      variants={!isSelected ? cardVariants : {}}
      whileHover={!isSelected ? "hover" : ""}
      onClick={onClick}
      className={`relative p-6 rounded-2xl bg-zinc-950/40 backdrop-blur-md border flex flex-col overflow-hidden group transition-all duration-300 ${
        isSelected 
          ? 'h-auto shadow-2xl shadow-black/80 border-zinc-800 bg-zinc-950' 
          : 'h-full cursor-pointer border-zinc-900/60 hover:border-zinc-800/80 hover:bg-zinc-900/25 shadow-lg shadow-black/20'
      }`}
    >
      {/* Subtle corner hover illumination */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent transition-opacity duration-500 pointer-events-none ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />

      {isSelected && (
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 hover:bg-zinc-900 rounded-xl transition-all duration-200 border border-transparent hover:border-zinc-800 z-20"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Title & Pricing Card */}
      <div className={`flex justify-between items-start mb-4 relative z-10 ${isSelected ? 'pr-8' : ''}`}>
        <div className="space-y-1 max-w-[70%]">
          <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors leading-snug flex items-center gap-1.5">
            <span>{api.title}</span>
            {!isSelected && (
              <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-blue-400 flex-shrink-0" />
            )}
          </h3>
        </div>
        <span 
          className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border select-none ${pricingColors[api.pricing] || pricingColors.Unknown}`}
        >
          {api.pricing || 'Unknown'}
        </span>
      </div>

      {/* Description text */}
      <p className="text-zinc-400 text-xs mb-6 flex-grow relative z-10 leading-relaxed font-medium">
        {api.description}
      </p>

      {/* Monospace Documentation Summary */}
      {isSelected && api.summaryDoc && (
        <div className="relative z-10 mb-6 bg-zinc-950 p-4 rounded-xl border border-zinc-900 font-mono shadow-inner shadow-black/10">
          <div className="flex items-center gap-1.5 mb-2 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Documentation Summary</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            {api.summaryDoc}
          </p>
        </div>
      )}

      {/* Call to actions */}
      {isSelected && (api.websiteUrl || api.documentationUrl) && (
        <div className="flex flex-wrap gap-3 mb-6 relative z-10">
          {(api.rapidApiUrl || api.websiteUrl) && (
            <a 
              href={api.rapidApiUrl || api.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md border border-blue-500/30 select-none"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Website
            </a>
          )}
          {(api.rapidApiUrl || api.documentationUrl) && (
            <a 
              href={api.rapidApiUrl ? `${api.rapidApiUrl}/details` : api.documentationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all select-none"
            >
              <FileText className="w-3.5 h-3.5" />
              Read Documentation
            </a>
          )}
        </div>
      )}

      {/* Metadata Tags Panel */}
      <div className="flex flex-wrap items-center gap-2 mt-auto relative z-10 pt-2 border-t border-zinc-900/50">
        <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-lg select-none">
          {api.category}
        </span>
        
        {/* Auth Type Badge */}
        <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-900/60 border border-zinc-900 text-zinc-300 rounded-lg flex items-center gap-1 select-none font-mono">
          <span>{api.authType || 'API Key'}</span>
        </span>

        {/* HTTPS Badge */}
        {api.https === 'Yes' ? (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-1 select-none">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Secure</span>
          </span>
        ) : api.https === 'No' ? (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg flex items-center gap-1 select-none">
            <span>HTTP Only</span>
          </span>
        ) : null}

        {/* CORS Badge */}
        {api.cors === 'Yes' ? (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg flex items-center gap-1 select-none font-mono">
            <span>CORS</span>
          </span>
        ) : api.cors === 'No' ? (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg flex items-center gap-1 select-none font-mono">
            <span>NO CORS</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-900/30 text-zinc-500 border border-zinc-900 rounded-lg select-none">
            CORS Unknown
          </span>
        )}

        {/* Upvote & Action Button Group (No intersection overlap) */}
        <div className="ml-auto flex items-center gap-2 relative z-20">
          {/* Reactive Heart Upvote Indicator */}
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all duration-200 active:scale-95 select-none ${
              liked 
                ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 shadow-md shadow-rose-500/5' 
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 transition-transform duration-300 ${liked ? 'fill-rose-500 stroke-rose-500 scale-110' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Clean monochromatic details hover arrow */}
          {!isSelected && (
            <div className="w-7 h-7 rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-500 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5 select-none">
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
