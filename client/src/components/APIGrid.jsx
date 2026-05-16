import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import APICard from './APICard';
import { fetchAPIs } from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function APIGrid() {
  const [searchParams] = useSearchParams();

  // React Query will automatically re-fetch when searchParams change
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">Failed to load APIs. Is the backend running?</p>
      </div>
    );
  }

  const apis = data?.pages.flatMap((page) => page.apis) || [];

  if (!apis.length) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">No APIs found</h3>
        <p className="text-slate-600 mt-2 max-w-sm">
          We couldn't find any APIs matching your current filters. Try selecting a different category or auth type.
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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

      {hasNextPage && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-colors shadow-sm font-medium flex items-center space-x-2"
          >
            {isFetchingNextPage ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading more...</span>
              </>
            ) : (
              <span>Load More APIs</span>
            )}
          </button>
        </div>
      )}

      {/* Full-Screen Hover Overlay Modal */}
      <AnimatePresence>
        {selectedId && selectedApi && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-20 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
            />
            
            {/* Expanded Card */}
            <div className="relative w-full max-w-3xl pointer-events-auto z-10">
              <APICard 
                api={selectedApi} 
                isSelected={true} 
                onClick={() => setSelectedId(null)} 
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
