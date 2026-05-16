import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const topCategories = ['All', 'Database', 'Financial', 'Jobs', 'Cybersecurity', 'Medical', 'Tools', 'Media', 'Science'];
const otherCategories = [
  'Education', 'Data', 'Mapping', 'Text Analysis', 'eCommerce', 'Communication', 'Search',
  'Payments', 'Transportation', 'News, Media', 'Video, Images', 'Energy', 'Movies',
  'Advertising', 'Artificial Intelligence/Machine Learning', 'Events', 'Email', 'Travel',
  'Gaming', 'Health and Fitness', 'Sports', 'Location', 'SMS', 'Devices', 'Logistics',
  'Social', 'Business', 'Commerce', 'Business Software', 'Translation', 'Food', 'Weather',
  'Monitoring', 'Finance', 'Visual Recognition', 'Music', 'Cryptography', 'Entertainment',
  'Storage', 'Reward', 'Other'
].sort();

const authTypes = ['All', 'OAuth', 'API Key', 'No Auth'];

export default function Sidebar() {
  const { isSidebarOpen } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const currentCategory = searchParams.get('category') || 'All';
  const currentAuth = searchParams.get('authType') || 'All';

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="w-64 fixed left-0 top-16 bottom-0 overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-slate-200 p-4 z-40 hidden md:flex flex-col"
        >
          <div className="flex-grow">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Categories</h3>
            <div className="space-y-1">
              {topCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilter('category', cat)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentCategory === cat
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
              
              <AnimatePresence>
                {showAllCategories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {otherCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => updateFilter('category', cat)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          currentCategory === cat
                            ? 'text-indigo-400 bg-indigo-500/10'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full flex items-center space-x-2 px-3 py-3 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${showAllCategories ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>{showAllCategories ? 'View Less' : 'View All Categories'}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 my-4"></div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Auth Type</h3>
            <div className="space-y-1">
              {authTypes.map((auth) => (
                <button
                  key={auth}
                  onClick={() => updateFilter('authType', auth)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentAuth === auth
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {auth}
                </button>
              ))}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
