import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import APICard from './APICard';
import { fetchAPIs } from '../services/api';
import { RotateCw, AlertTriangle, SearchCode } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function APIGrid() {
  const [searchParams] = useSearchParams();

  const { 
    data, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['apis', searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchAPIs(searchParams, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    }
  });

  const [selectedId, setSelectedId] = useState(null);

  // Premium Pulsing Card Skeletons while Loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-900/20 border border-slate-900 p-6 rounded-2xl h-52 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4.5 bg-slate-800/80 rounded-lg w-1/2"></div>
                <div className="h-3.5 bg-slate-800/60 rounded-full w-1/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-850 rounded w-full"></div>
                <div className="h-3 bg-slate-850 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-4 bg-slate-850 rounded w-14"></div>
              <div className="h-4 bg-slate-850 rounded w-14"></div>
              <div className="h-4 bg-slate-850 rounded w-18"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Refined Glass Alert for Connection Errors
  if (error) {
    return (
      <div className="text-center py-16 bg-slate-900/30 border border-rose-500/10 rounded-3xl max-w-md mx-auto space-y-4 shadow-2xl backdrop-blur-md">
        <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Vault Connection Error</h3>
          <p className="text-slate-400 text-xs px-8 leading-relaxed font-medium">
            We were unable to pull credentials from our database nodes. Please ensure your backend server and MongoDB services are active.
          </p>
        </div>
      </div>
    );
  }

  const apis = data?.pages.flatMap((page) => page.apis) || [];

  // Sleek Empty Search State
  if (!apis.length) {
    return (
      <div className="text-center py-20 flex flex-col items-center bg-slate-900/10 border border-slate-900/50 rounded-3xl p-8 backdrop-blur-md max-w-xl mx-auto shadow-xl">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl mb-4 text-slate-500">
          <SearchCode className="w-10 h-10 text-blue-500/80 animate-pulse" />
        </div>
        <h3 className="text-base font-extrabold text-white">No Endpoints Discovered</h3>
        <p className="text-slate-400 text-xs mt-2 max-w-sm leading-relaxed font-medium px-4">
          No matches found for this filter. Try adjusting your query keywords, selecting another category, or clearing secondary flags.
        </p>
      </div>
    );
  }

  const selectedApi = apis.find(api => api._id === selectedId);

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {apis.map((api) => (
            <motion.div
              key={api._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <APICard 
                api={api} 
                isSelected={selectedId === api._id} 
                onClick={() => setSelectedId(api._id)} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading Trigger Control */}
      {hasNextPage && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-250 font-bold flex items-center space-x-2 active:scale-95 shadow-xl shadow-black/25"
          >
            {isFetchingNextPage ? (
              <>
                <RotateCw className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-xs">Accessing next layer...</span>
              </>
            ) : (
              <span className="text-xs">Load More APIs</span>
            )}
          </button>
        </div>
      )}

      {/* Full-Screen Hover Overlay Modal */}
      <AnimatePresence>
        {selectedId && selectedApi && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            {/* Immersive backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-[6px] pointer-events-auto"
            />
            
            {/* Modal Glass Container with smooth weightless spring transition */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative w-full max-w-2xl pointer-events-auto z-10"
            >
              <APICard 
                api={selectedApi} 
                isSelected={true} 
                onClick={() => setSelectedId(null)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
