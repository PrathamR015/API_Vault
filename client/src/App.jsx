import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import KnowMore from './pages/KnowMore';
import Projects from './pages/Projects';
import ProjectStudio from './pages/ProjectStudio';
import Navbar from './components/Navbar';
import useStore from './store/useStore';
import { checkAuthStatus } from './services/api';

function App() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const currentUser = await checkAuthStatus();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [setUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        {/* Sleek rotating loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-indigo-400/20 border-b-transparent animate-spin-reverse"></div>
        </div>
        <div className="text-slate-400 font-mono text-sm tracking-wider uppercase animate-pulse">
          Securing Environment...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30 bg-mesh-grid bg-fixed">
        {user && <Navbar />}
        <main className={`flex-grow flex ${user ? 'pt-16' : ''}`}>
          <Routes>
            {/* Login Route: Redirect to home if already logged in */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <Login />} 
            />

            {/* Protected Home Route: Redirect to login if not logged in */}
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" replace />} 
            />

            {/* Protected About Route */}
            <Route 
              path="/about" 
              element={user ? <About /> : <Navigate to="/login" replace />} 
            />

            {/* Protected Know More Route */}
            <Route 
              path="/know-more" 
              element={user ? <KnowMore /> : <Navigate to="/login" replace />} 
            />

            {/* Protected Projects Route */}
            <Route 
              path="/projects" 
              element={user ? <Projects /> : <Navigate to="/login" replace />} 
            />

            {/* Protected Project Studio Route */}
            <Route 
              path="/projects/:id" 
              element={user ? <ProjectStudio /> : <Navigate to="/login" replace />} 
            />

            {/* Catch-all: Redirect back based on auth status */}
            <Route 
              path="*" 
              element={<Navigate to={user ? "/" : "/login"} replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
