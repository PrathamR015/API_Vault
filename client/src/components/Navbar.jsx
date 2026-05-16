import { useState } from 'react';
import { Github, Menu, Search } from 'lucide-react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import Logo from '../assets/Logo.png';

export default function Navbar() {
  const { user, toggleSidebar } = useStore();

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
    
    // If not on home page, redirect there with search params
    if (location.pathname !== '/') {
      navigate(`/?${params.toString()}`);
    } else {
      navigate(`?${params.toString()}`);
      // Smooth scroll to grid
      document.getElementById('api-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-slate-500 hover:text-blue-600 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-wide cursor-pointer flex items-center space-x-3">
          <div className="w-12 h-12 overflow-hidden flex items-center justify-center rounded-lg">
            <img src={Logo} alt="API Vault Logo" className="w-full h-full object-cover scale-[1]" />
          </div>
          <span>API Vault</span>
        </h1>
      </div>

      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search APIs by name, category, or description..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-100 hover:bg-slate-200 focus:bg-white border border-transparent focus:border-blue-500 text-sm rounded-lg pl-10 pr-4 py-2 text-slate-900 placeholder-slate-500 outline-none transition-all duration-200 shadow-sm"
          />
        </form>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center gap-4">
            <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-300" />
            <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 shadow-sm"
          >
            <Github className="w-4 h-4" />
            <span className="text-sm font-medium">Login with GitHub</span>
          </button>
        )}
      </div>
    </nav>
  );
}
