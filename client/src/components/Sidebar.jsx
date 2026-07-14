import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Tag, KeyRound, Globe, ListFilter, 
  Code2, MapPin, Coins, TrendingUp, Truck, Gamepad2, Shield, Brain 
} from 'lucide-react';
import useStore from '../store/useStore';

const topCategories = ['All', 'Development', 'Geocoding', 'Cryptocurrency', 'Finance', 'Transportation', 'Games & Comics', 'Security', 'Machine Learning'];
const otherCategories = [
  'Documents & Productivity', 'Weather', 'Government', 'Sports & Fitness', 'Photography', 'Anti-Malware',
  'News', 'Food & Drink', 'Open Data', 'Music', 'Jobs', 'Video', 'Email', 'Cloud Storage & File Sharing',
  'Business', 'Text Analysis', 'Environment', 'URL Shorteners', 'Shopping', 'Currency Exchange', 'Dictionaries',
  'Art & Design', 'Authentication & Authorization', 'Social', 'Tracking', 'Health', 'Blockchain', 'Animals',
  'Test Data', 'Continuous Integration', 'Data Validation', 'Calendar', 'Phone', 'Programming', 'Anime',
  'Science & Math', 'Books', 'Vehicle', 'Personality', 'Events', 'Entertainment', 'Patent'
].sort();

const authTypes = ['All', 'API Key'];

const categoryIcons = {
  All: Globe,
  Development: Code2,
  Geocoding: MapPin,
  Cryptocurrency: Coins,
  Finance: TrendingUp,
  Transportation: Truck,
  'Games & Comics': Gamepad2,
  Security: Shield,
  'Machine Learning': Brain
};

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useStore();
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
    newParams.delete('ids');
    newParams.delete('curated');
    newParams.delete('curatedPrompt');
    setSearchParams(newParams);
    
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
    
    // Smooth scroll to the APIs section below the key-value parameters
    setTimeout(() => {
      document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Mobile backdrop overlay */}
          <div 
            onClick={toggleSidebar} 
            className="fixed inset-0 top-16 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />

          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="w-64 fixed left-0 top-16 bottom-0 overflow-y-auto bg-zinc-950/85 backdrop-blur-xl border-r border-zinc-900/60 p-4 z-40 flex flex-col shadow-2xl shadow-black/50"
          >
          {/* Categories Title */}
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-4 px-3">
              <ListFilter className="w-3.5 h-3.5 text-blue-500" />
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categories</h3>
            </div>
            
            <div className="space-y-1">
              {topCategories.map((cat) => {
                const IconComponent = categoryIcons[cat] || Tag;
                const isActive = currentCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-98 group ${
                      isActive
                        ? 'text-white bg-zinc-900 border-zinc-800 shadow-inner'
                        : 'text-zinc-400 border-transparent hover:bg-zinc-900/50 hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      <span className="truncate">{cat}</span>
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
              
              <AnimatePresence>
                {showAllCategories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-1 mt-1"
                  >
                    {otherCategories.map((cat) => {
                      const isActive = currentCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => updateFilter('category', cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 group ${
                            isActive
                              ? 'text-white bg-zinc-900 border-zinc-850 shadow-inner'
                              : 'text-zinc-400 border-transparent hover:bg-zinc-900/50 hover:text-zinc-200'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 truncate pl-1">
                            <Tag className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-zinc-655 text-zinc-600'}`} />
                            <span className="truncate">{cat}</span>
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 mt-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-blue-400 hover:bg-zinc-900/30 transition-colors border border-transparent hover:border-zinc-900"
              >
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${showAllCategories ? 'rotate-180 text-blue-400' : 'text-zinc-500'}`} 
                />
                <span>{showAllCategories ? 'Show Less' : 'Browse All Categories'}</span>
              </button>
            </div>
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);
}
