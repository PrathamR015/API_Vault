import { useState } from 'react';
import { Github, Menu, Search, LogOut, ChevronDown, Shield, User, Sparkles, BookOpen, Info } from 'lucide-react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import Logo from '../assets/tech.png';

export default function Navbar() {
  const { user, toggleSidebar } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/api/auth/logout';
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    
    if (location.pathname !== '/') {
      navigate(`/?${params.toString()}`);
    } else {
      navigate(`?${params.toString()}`);
      document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-zinc-950/75 backdrop-blur-xl border-b border-zinc-900/80 flex items-center justify-between px-6 shadow-lg shadow-black/20">
      {/* Brand & Drawer Control */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 transition-all text-zinc-400 hover:text-zinc-200 active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 overflow-hidden flex items-center justify-center rounded-xl border border-zinc-800 group-hover:border-zinc-700 shadow-md transition-all duration-300 p-0.5 bg-zinc-900">
              <img src={Logo} alt="API Vault Logo" className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight select-none">
              API Vault
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-2 border-l border-zinc-900 pl-6 text-xs md:text-[13px] font-black uppercase tracking-wider">
          <button 
            onClick={() => navigate('/')} 
            className={`hover:text-white px-3.5 py-2 rounded-xl transition-all select-none duration-150 active:scale-95 ${location.pathname === '/' ? 'text-blue-400 font-extrabold bg-zinc-900/60 border border-zinc-850 shadow-inner' : 'text-zinc-500 hover:bg-zinc-900/30 border border-transparent'}`}
          >
            Vault
          </button>
          <button 
            onClick={() => navigate('/know-more')} 
            className={`hover:text-white px-3.5 py-2 rounded-xl transition-all select-none duration-150 active:scale-95 ${location.pathname === '/know-more' ? 'text-blue-400 font-extrabold bg-zinc-900/60 border border-zinc-850 shadow-inner' : 'text-zinc-500 hover:bg-zinc-900/30 border border-transparent'}`}
          >
            Know More
          </button>
          <button 
            onClick={() => navigate('/about')} 
            className={`hover:text-white px-3.5 py-2 rounded-xl transition-all select-none duration-150 active:scale-95 ${location.pathname === '/about' ? 'text-blue-400 font-extrabold bg-zinc-900/60 border border-zinc-850 shadow-inner' : 'text-zinc-500 hover:bg-zinc-900/30 border border-transparent'}`}
          >
            About
          </button>
        </div>
      </div>

      {/* Dynamic Search Box */}
      <div className="flex-1 max-w-lg mx-8 hidden md:block">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors duration-200" />
          <input 
            type="text" 
            placeholder="Search verified APIs (e.g., Maps, Crypto)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-900 focus:bg-zinc-950 border border-zinc-800 group-hover:border-zinc-750 focus:border-zinc-700 text-xs rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200 shadow-inner"
          />
        </form>
      </div>

      {/* Identity Controls & Menu */}
      <div className="flex items-center space-x-3">
        {user && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('ai', 'true');
              navigate(`/?${params.toString()}`);
            }}
            className="p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 transition-all text-zinc-400 hover:text-blue-400 active:scale-95 flex items-center justify-center group"
            title="Ask AI Curator"
          >
            <Sparkles className="w-4.5 h-4.5 text-blue-400 group-hover:scale-110 transition-transform animate-pulse" />
          </button>
        )}

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all duration-200 active:scale-98"
            >
              <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-lg border border-slate-800 object-cover" />
              <span className="text-xs font-bold text-slate-300 hidden sm:inline-block max-w-[100px] truncate">{user.username}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-slate-950/95 border border-slate-800/80 backdrop-blur-xl p-2 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2.5 border-b border-slate-800/50 mb-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Session Authorized</p>
                    <p className="text-sm font-bold text-slate-100 truncate">{user.username}</p>
                  </div>
                  
                  <a 
                    href={`https://github.com/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </a>

                  <div className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 rounded-xl">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="flex items-center gap-1.5">
                      <span>Dev Portal</span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/20">Active</span>
                    </span>
                  </div>

                  <hr className="border-slate-800/50 my-1" />

                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/know-more');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition-all text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Know More</span>
                  </button>

                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/about');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition-all text-left"
                  >
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>About Page</span>
                  </button>

                  <hr className="border-slate-800/50 my-1" />

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Session</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 font-semibold"
          >
            <Github className="w-4.5 h-4.5" />
            <span className="text-sm">Sign in</span>
          </button>
        )}
      </div>
    </nav>
  );
}
