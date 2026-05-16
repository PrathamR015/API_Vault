import { motion } from 'framer-motion';
import { ExternalLink, FileText, X } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  },
  hover: {
    y: -5,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    transition: { type: 'spring', stiffness: 300 }
  }
};

const badgeVariants = {
  hover: { scale: 1.05, transition: { yoyo: Infinity, duration: 0.3 } }
};

export default function APICard({ api, isSelected, onClick }) {
  const pricingColors = {
    FREE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FREEMIUM: 'bg-blue-50 text-blue-700 border-blue-200',
    PAID: 'bg-amber-50 text-amber-700 border-amber-200',
    PAY_PER_USE: 'bg-purple-50 text-purple-700 border-purple-200',
    Unknown: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <motion.div
      layoutId={`card-${api._id}`}
      variants={!isSelected ? cardVariants : {}}
      whileHover={!isSelected ? "hover" : ""}
      onClick={onClick}
      className={`relative p-6 rounded-2xl bg-white border border-slate-200 flex flex-col overflow-hidden group transition-all duration-300 ${
        isSelected ? 'h-auto shadow-2xl shadow-blue-500/10' : 'h-full cursor-pointer hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* Background glow */}
      <motion.div 
        layoutId={`glow-${api._id}`}
        className={`absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 transition-opacity duration-500 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />

      {isSelected && (
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className={`flex justify-between items-start mb-4 relative z-10 ${isSelected ? 'pr-8' : ''}`}>
        <motion.h3 layoutId={`title-${api._id}`} className="text-xl font-bold text-slate-900 tracking-tight">
          {api.title}
        </motion.h3>
        <motion.span 
          layoutId={`badge-${api._id}`}
          variants={badgeVariants}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${pricingColors[api.pricing] || pricingColors.Unknown}`}
        >
          {api.pricing || 'Unknown'}
        </motion.span>
      </div>

      <motion.p layoutId={`desc-${api._id}`} className="text-slate-600 text-sm mb-6 flex-grow relative z-10 leading-relaxed">
        {api.description}
      </motion.p>

      {isSelected && api.summaryDoc && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200"
        >
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Documentation Summary</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {api.summaryDoc}
          </p>
        </motion.div>
      )}

      {isSelected && (api.websiteUrl || api.documentationUrl) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-6 relative z-10"
        >
          {(api.rapidApiUrl || api.websiteUrl) && (
            <a 
              href={api.rapidApiUrl || api.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-500/20"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </a>
          )}
          {(api.rapidApiUrl || api.documentationUrl) && (
            <a 
              href={api.rapidApiUrl ? `${api.rapidApiUrl}/details` : api.documentationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Read Documentation
            </a>
          )}
        </motion.div>
      )}

      <motion.div layoutId={`tags-${api._id}`} className="flex flex-wrap gap-2 mt-auto relative z-10">
        <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          {api.category}
        </span>
        <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200">
          {api.authType}
        </span>
      </motion.div>

      {/* View Details Button (Only visible on hover when NOT selected) */}
      {!isSelected && (
        <motion.div 
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: 10 }}
          whileHover={{ x: 0 }}
        >
          <div className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg shadow-blue-500/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
