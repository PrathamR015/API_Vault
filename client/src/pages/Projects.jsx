import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, Plus, Trash2, Calendar, FileCode2, 
  ExternalLink, Sparkles, AlertTriangle, ArrowRight, Loader2
} from 'lucide-react';
import { fetchProjects, createProject, deleteProject } from '../services/api';
import useStore from '../store/useStore';

export default function Projects() {
  const { user } = useStore();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load your designer projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      const newProj = await createProject({ title, description });
      setProjects(prev => [newProj, ...prev]);
      setTitle('');
      setDescription('');
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project and all its endpoints?')) return;

    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow w-full min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Accessing Project Vault...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full min-h-[calc(100vh-4rem)] bg-zinc-950 text-white p-6 md:p-8 relative overflow-hidden bg-fine-grid">
      {/* Background spotlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none -z-10 animate-slow-pulse"></div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <FolderKanban className="w-7 h-7 text-blue-500" />
              <span>API Architect Studio</span>
            </h2>
            <p className="text-xs text-zinc-500 font-medium">Design and structure your custom REST, gRPC, and GraphQL endpoints inside projects</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md border border-blue-500/30 flex items-center gap-2 px-5 py-3.5 active:scale-95 select-none"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center bg-zinc-900/10 border border-zinc-900/50 rounded-3xl p-8 backdrop-blur-md max-w-xl mx-auto shadow-xl">
            <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl mb-4 text-zinc-500">
              <FolderKanban className="w-10 h-10 text-blue-500/60" />
            </div>
            <h3 className="text-base font-extrabold text-white">No Architect Projects Yet</h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-xs leading-relaxed font-medium px-4">
              Get started by creating a project. Inside projects you can design endpoints for REST, gRPC, and GraphQL schemas.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-6 px-5 py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-800 hover:border-zinc-700 active:scale-95"
            >
              Start First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl cursor-pointer group flex flex-col justify-between h-56 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/10 shadow-lg relative bg-fine-grid"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(e, project._id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-zinc-500 text-[11px] font-medium leading-relaxed line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="border-t border-zinc-900/60 pt-4 flex justify-between items-center text-[10px] text-zinc-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-[9px]">
                      <span className="text-emerald-500 font-extrabold">●</span>
                      <span>{project.endpointCounts?.REST || 0} REST</span>
                    </span>
                    <span className="flex items-center gap-1 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-[9px]">
                      <span className="text-pink-500 font-extrabold">●</span>
                      <span>{project.endpointCounts?.GraphQL || 0} GQL</span>
                    </span>
                    <span className="flex items-center gap-1 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-[9px]">
                      <span className="text-blue-500 font-extrabold">●</span>
                      <span>{project.endpointCounts?.gRPC || 0} gRPC</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Glassmorphic Project Creator Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">Create Designer Project</h3>
                <p className="text-xs text-zinc-500 font-medium font-sans">Initialize a clean workspace for mock endpoints and schema drafting</p>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. E-Commerce Core API"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-900/60 hover:bg-zinc-900 focus:bg-zinc-950 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Provide a high-level summary of the APIs designed inside this collection..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-zinc-900/60 hover:bg-zinc-900 focus:bg-zinc-950 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-800 select-none text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !title.trim()}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-blue-500/30 flex justify-center items-center gap-1.5 select-none"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Save Project</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
