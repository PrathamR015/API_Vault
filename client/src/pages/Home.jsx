import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import APIGrid from '../components/APIGrid';
import useStore from '../store/useStore';
import { checkAuthStatus } from '../services/api';

export default function Home() {
  const { isSidebarOpen, setUser } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is logged in
    const verifyAuth = async () => {
      try {
        const user = await checkAuthStatus();
        setUser(user);
      } catch (error) {
        setUser(null);
      }
    };
    verifyAuth();
  }, [setUser]);

  const handleCategoryClick = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
    document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] relative">
      <Sidebar />
      
      <div 
        className={`flex-grow p-6 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Banner Section */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row overflow-hidden relative group shadow-sm">
            <div className="p-8 md:w-1/2 flex flex-col justify-center z-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Welcome to API Vault</h2>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Discover a carefully curated collection of open-source APIs perfect for your next big project. 
                Whether you need mock data, AI models, or utility tools, we've got you covered.
              </p>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Connect your GitHub account to start voting and engaging with the community.
              </p>
              <div>
                <button 
                  onClick={() => document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-semibold text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-blue-500/20 border border-blue-500/50"
                >
                  <span>Explore APIs</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Banner Illustration placeholder */}
            <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-sm h-48 flex flex-col p-4 opacity-90 group-hover:scale-105 transition-transform duration-500 relative">
                {/* Abstract code representation */}
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="space-y-3 font-mono text-xs text-blue-600">
                  <div><span className="text-purple-600">import</span> {'{'} useQuery {'}'} <span className="text-purple-600">from</span> 'api-hub';</div>
                  <div className="pl-4 text-slate-700">const data = await fetchAPI();</div>
                  <div className="pl-4 text-slate-700">console.log(data);</div>
                </div>
                <div className="absolute bottom-4 right-4 text-4xl opacity-20">🚀</div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Top Categories</h3>
              <button 
                onClick={() => handleCategoryClick('All')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                View All Categories
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category 1 */}
              <div 
                onClick={() => handleCategoryClick('Cybersecurity')}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="text-2xl mb-3">🛡️</div>
                <h4 className="text-slate-900 font-semibold mb-2 group-hover:text-blue-600 transition-colors">Cybersecurity</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                  Threat intelligence, IP reputation, and vulnerability databases to secure your applications.
                </p>
                <span className="text-blue-600 text-sm font-medium mt-auto">Browse Category →</span>
              </div>
              
              {/* Category 2 */}
              <div 
                onClick={() => handleCategoryClick('Database')}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="text-2xl mb-3">💾</div>
                <h4 className="text-slate-900 font-semibold mb-2 group-hover:text-blue-600 transition-colors">Database</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                  Connect to relational, NoSQL, and graph databases to store and retrieve data efficiently.
                </p>
                <span className="text-blue-600 text-sm font-medium mt-auto">Browse Category →</span>
              </div>

              {/* Category 3 */}
              <div 
                onClick={() => handleCategoryClick('Financial')}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="text-2xl mb-3">📈</div>
                <h4 className="text-slate-900 font-semibold mb-2 group-hover:text-blue-600 transition-colors">Financial</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                  Real-time stock market data, cryptocurrency prices, and banking APIs for fintech applications.
                </p>
                <span className="text-blue-600 text-sm font-medium mt-auto">Browse Category →</span>
              </div>

              {/* Category 4 */}
              <div 
                onClick={() => handleCategoryClick('Tools')}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="text-2xl mb-3">🛠️</div>
                <h4 className="text-slate-900 font-semibold mb-2 group-hover:text-blue-600 transition-colors">Tools</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                  Developer utilities, format converters, scrapers, and essential tools for rapid development.
                </p>
                <span className="text-blue-600 text-sm font-medium mt-auto">Browse Category →</span>
              </div>
            </div>
          </div>

          {/* Main API Listing (Collections equivalent) */}
          <div id="api-grid-section" className="scroll-mt-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {searchParams.get('category') ? `${searchParams.get('category')} APIs` : 'Curated API Collection'}
              </h3>
              {searchParams.get('category') && (
                <button 
                  onClick={() => handleCategoryClick('All')}
                  className="text-slate-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
            <APIGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
