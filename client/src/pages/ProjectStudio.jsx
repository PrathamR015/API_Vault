import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Save, Trash2, Edit3, Loader2, Database, Code, 
  HelpCircle, Settings, ChevronRight, Play, AlertTriangle, Sparkles, Download
} from 'lucide-react';
import { 
  fetchProjectDetails, createEndpoint, updateEndpoint, deleteEndpoint, updateProject, generateEndpointsBulkWithAI, saveBulkEndpoints, exportProject
} from '../services/api';

export default function ProjectStudio() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Editor State
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // true if editing existing, false if creating new
  const [activeFormType, setActiveFormType] = useState('REST'); // REST, GraphQL, gRPC
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [restMethod, setRestMethod] = useState('GET');
  const [graphqlType, setGraphqlType] = useState('Query');
  const [grpcService, setGrpcService] = useState('');
  const [grpcMethodType, setGrpcMethodType] = useState('Unary');
  const [requestPayload, setRequestPayload] = useState('');
  const [responsePayload, setResponsePayload] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // AI Generator Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiType, setAiType] = useState('REST');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiReviewMode, setAiReviewMode] = useState(false);
  const [generatedEndpoints, setGeneratedEndpoints] = useState([]);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0);
  const [approvedIndices, setApprovedIndices] = useState([]);

  // Export State
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Mobile View State
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'design'

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchProjectDetails(id);
      setProject(data.project);
      setEndpoints(data.endpoints);
      if (data.endpoints.length > 0) {
        selectEndpointForEdit(data.endpoints[0]);
      } else {
        resetFormToNew('REST');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch project details.');
    } finally {
      setLoading(false);
    }
  };

  const selectEndpointForEdit = (ep) => {
    setSelectedEndpoint(ep);
    setIsEditing(true);
    setActiveFormType(ep.type);
    setName(ep.name);
    setDescription(ep.description || '');
    setRestMethod(ep.restMethod || 'GET');
    setGraphqlType(ep.graphqlType || 'Query');
    setGrpcService(ep.grpcService || '');
    setGrpcMethodType(ep.grpcMethodType || 'Unary');
    setRequestPayload(ep.requestPayload || '');
    setResponsePayload(ep.responsePayload || '');
    setMobileView('design');
  };

  const resetFormToNew = (type = 'REST') => {
    setSelectedEndpoint(null);
    setIsEditing(false);
    setActiveFormType(type);
    setName('');
    setDescription('');
    setRestMethod('GET');
    setGraphqlType('Query');
    setGrpcService('');
    setGrpcMethodType('Unary');
    setRequestPayload('');
    setResponsePayload('');
    setMobileView('design');
  };

  const handleGenerateWithAI = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    try {
      setAiGenerating(true);
      const data = await generateEndpointsBulkWithAI(id, aiPrompt, aiType);
      if (data && data.endpoints && Array.isArray(data.endpoints)) {
        setGeneratedEndpoints(data.endpoints);
        setApprovedIndices(data.endpoints.map((_, i) => i)); // Approve all by default
        setSelectedReviewIndex(0);
        setAiReviewMode(true);
      } else {
        alert('Invalid response format received from AI.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate endpoints with AI. Please verify your OpenRouter configuration.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApplyApprovedEndpoints = async () => {
    const endpointsToSave = generatedEndpoints.filter((_, idx) => approvedIndices.includes(idx));
    if (endpointsToSave.length === 0) {
      alert('Please select at least one endpoint to apply.');
      return;
    }

    try {
      setAiGenerating(true);
      const saved = await saveBulkEndpoints(id, endpointsToSave);
      setEndpoints(prev => [...saved, ...prev]);
      if (saved.length > 0) {
        selectEndpointForEdit(saved[0]);
      }
      setAiPrompt('');
      setGeneratedEndpoints([]);
      setApprovedIndices([]);
      setAiReviewMode(false);
      setAiModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save approved endpoint schemas.');
    } finally {
      setAiGenerating(false);
    }
  };

  const toggleApproveEndpoint = (index) => {
    setApprovedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const handleExportProject = async (format) => {
    try {
      const response = await exportProject(id, format);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const disposition = response.headers['content-disposition'];
      let filename = `api_spec_${id}.${format === 'openapi' ? 'json' : format === 'proto' ? 'proto' : 'graphql'}`;
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setExportDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to export designed specifications.');
    }
  };

  const handleSaveEndpoint = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      type: activeFormType,
      name,
      description,
      requestPayload,
      responsePayload
    };

    if (activeFormType === 'REST') {
      payload.restMethod = restMethod;
    } else if (activeFormType === 'GraphQL') {
      payload.graphqlType = graphqlType;
    } else if (activeFormType === 'gRPC') {
      payload.grpcService = grpcService;
      payload.grpcMethodType = grpcMethodType;
    }

    try {
      setSubmitting(true);
      if (isEditing && selectedEndpoint) {
        const updated = await updateEndpoint(selectedEndpoint._id, payload);
        setEndpoints(prev => prev.map(ep => ep._id === updated._id ? updated : ep));
        setSelectedEndpoint(updated);
      } else {
        const created = await createEndpoint(id, payload);
        setEndpoints(prev => [created, ...prev]);
        selectEndpointForEdit(created);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save endpoint schema.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEndpoint = async (e, epId) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this endpoint design?')) return;

    try {
      await deleteEndpoint(epId);
      setEndpoints(prev => prev.filter(ep => ep._id !== epId));
      if (selectedEndpoint && selectedEndpoint._id === epId) {
        const remaining = endpoints.filter(ep => ep._id !== epId);
        if (remaining.length > 0) {
          selectEndpointForEdit(remaining[0]);
        } else {
          resetFormToNew('REST');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete endpoint.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow w-full min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Opening Design Canvas...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-grow w-full min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h3 className="text-lg font-black text-white">Project Not Found</h3>
        <p className="text-zinc-500 text-xs max-w-sm">{error || 'This project may have been deleted.'}</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs hover:bg-zinc-800 transition-colors"
        >
          Back to Studio Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full h-[calc(100vh-4rem)] bg-zinc-950 text-white flex flex-col relative bg-fine-grid overflow-hidden">
      
      {/* Studio Top Navbar */}
      <header className="h-16 border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur-md px-6 flex items-center justify-between select-none">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-850 active:scale-95 transition-all"
            title="Back to Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xs md:text-sm font-black text-white max-w-[100px] sm:max-w-none truncate">{project.title}</h2>
              <span className="text-[8px] md:text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 md:px-2 py-0.5 rounded-full font-bold">API Studio</span>
            </div>
            <p className="text-[10px] text-zinc-500 truncate max-w-md font-medium hidden sm:block">{project.description || 'Custom endpoints workspace'}</p>
          </div>
        </div>

        <div className="flex gap-1.5 md:gap-2.5 relative">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-3 md:px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-zinc-800 hover:border-zinc-750 transition-all active:scale-95 select-none"
              title="Export Project Specifications"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Export Spec</span>
            </button>

            {exportDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setExportDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-950 border border-zinc-900 p-1.5 shadow-2xl z-40 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    type="button"
                    onClick={() => handleExportProject('openapi')}
                    className="w-full px-3 py-2 text-left text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>OpenAPI v3 (REST)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportProject('graphql')}
                    className="w-full px-3 py-2 text-left text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    <span>GraphQL SDL (.graphql)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportProject('proto')}
                    className="w-full px-3 py-2 text-left text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Protobuf v3 (.proto)</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setAiModalOpen(true)}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-indigo-500/15 border border-indigo-500/30"
            title="Generate with AI"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-200" />
            <span className="hidden sm:inline">Generate with AI</span>
          </button>
          
          <button
            onClick={() => resetFormToNew('REST')}
            className="px-3 md:px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-zinc-800 hover:border-zinc-750 transition-all active:scale-95"
            title="New Endpoint"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Endpoint</span>
          </button>
        </div>
      </header>

      {/* Mobile Toggle View Tabs */}
      <div className="flex md:hidden border-b border-zinc-900 bg-zinc-950/40 p-2.5 gap-2 select-none">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all active:scale-95 ${
            mobileView === 'list' 
              ? 'bg-zinc-900 text-white border border-zinc-800 shadow-inner' 
              : 'text-zinc-550 text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Schema List ({endpoints.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileView('design')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all active:scale-95 ${
            mobileView === 'design' 
              ? 'bg-zinc-900 text-white border border-zinc-800 shadow-inner' 
              : 'text-zinc-550 text-zinc-500 hover:text-zinc-400'
          }`}
        >
          {isEditing ? 'Modify Schema' : 'Draft New'}
        </button>
      </div>

      {/* Main Studio Body (Split Panel Layout) */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Panel: Endpoints List Sidebar */}
        <aside className={`w-full md:w-80 border-r border-zinc-900/60 bg-zinc-950/40 p-4 flex flex-col justify-between overflow-y-auto space-y-6 ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}`}>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Designed Schema List</h3>
            
            {endpoints.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-zinc-900 rounded-2xl bg-zinc-900/5">
                <p className="text-zinc-650 text-zinc-600 text-xs font-semibold">No endpoints designed</p>
                <p className="text-zinc-500 text-[10px] mt-1">Design a REST, GraphQL, or gRPC endpoint to get started.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {endpoints.map((ep) => {
                  const isSelected = selectedEndpoint?._id === ep._id;
                  let typeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (ep.type === 'GraphQL') typeColor = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
                  if (ep.type === 'gRPC') typeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

                  return (
                    <div
                      key={ep._id}
                      onClick={() => selectEndpointForEdit(ep)}
                      className={`w-full text-left px-3 py-3 rounded-xl border flex items-center justify-between group cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-800 text-white shadow-inner'
                          : 'bg-zinc-950/20 border-transparent hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate min-w-0">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border select-none shrink-0 ${typeColor}`}>
                          {ep.type === 'REST' ? ep.restMethod : ep.type}
                        </span>
                        <span className="text-xs font-bold truncate">{ep.name}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteEndpoint(e, ep._id)}
                        className="p-1 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Endpoint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="bg-zinc-900/20 border border-zinc-900/60 p-3.5 rounded-2xl space-y-1.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Designer Helpers</span>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans font-medium">Use Request and Response Payload editors to specify payloads, Proto files, or GraphQL type queries.</p>
          </div>
        </aside>

        {/* Right Panel: The Workspace Studio Form */}
        <main className={`flex-1 p-6 overflow-y-auto space-y-6 ${mobileView === 'design' ? 'block' : 'hidden md:block'}`}>
          <form onSubmit={handleSaveEndpoint} className="max-w-4xl space-y-6">
            
            {/* Header: Design Type Selector (Framer Motion tabs) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  {isEditing ? 'Modify Designed Schema' : 'Draft New Endpoint Schema'}
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => resetFormToNew(activeFormType)}
                    className="text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Switch to New</span>
                  </button>
                )}
              </div>

              {!isEditing && (
                <div className="flex gap-2.5 p-1 bg-zinc-950 border border-zinc-900 rounded-xl w-fit">
                  {['REST', 'GraphQL', 'gRPC'].map((type) => {
                    const isActive = activeFormType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setActiveFormType(type)}
                        className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-200 select-none ${
                          isActive
                            ? 'bg-zinc-900 text-white shadow-sm border border-zinc-800'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form Canvas Workspace */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-6 shadow-xl relative bg-fine-grid">
              
              {/* Endpoint Path / Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Protocol Specific Subfields */}
                {activeFormType === 'REST' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">HTTP Method</label>
                    <select
                      value={restMethod}
                      onChange={(e) => setRestMethod(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 outline-none transition-all cursor-pointer font-bold"
                    >
                      {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].map(m => (
                        <option key={m} value={m} className="bg-zinc-950">{m}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeFormType === 'GraphQL' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Operation Type</label>
                    <select
                      value={graphqlType}
                      onChange={(e) => setGraphqlType(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 outline-none transition-all cursor-pointer font-bold"
                    >
                      {['Query', 'Mutation', 'Subscription'].map(t => (
                        <option key={t} value={t} className="bg-zinc-950">{t}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeFormType === 'gRPC' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">gRPC Service</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UserService"
                      value={grpcService}
                      onChange={(e) => setGrpcService(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-650 outline-none transition-all font-bold"
                    />
                  </div>
                )}

                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {activeFormType === 'REST' ? 'Endpoint Path' : activeFormType === 'GraphQL' ? 'Query / Method Name' : 'RPC Method Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      activeFormType === 'REST' 
                        ? 'e.g. /api/v1/users' 
                        : activeFormType === 'GraphQL' 
                        ? 'e.g. getUserDetails' 
                        : 'e.g. GetUserByID'
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-650 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              {/* gRPC Connection Type */}
              {activeFormType === 'gRPC' && (
                <div className="space-y-1 max-w-xs">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">gRPC Stream Type</label>
                  <select
                    value={grpcMethodType}
                    onChange={(e) => setGrpcMethodType(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 outline-none transition-all cursor-pointer font-bold"
                  >
                    {['Unary', 'Client Streaming', 'Server Streaming', 'Bidirectional Streaming'].map(st => (
                      <option key={st} value={st} className="bg-zinc-950">{st}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Functional Description</label>
                <textarea
                  rows="2"
                  placeholder="What does this endpoint do? Specify core rules, authorization settings, or operational boundaries..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900/60 hover:bg-zinc-900 focus:bg-zinc-950 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-none font-medium"
                />
              </div>

              {/* Dynamic Payloads Editor Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Request Payload Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-blue-500" />
                      <span>Request Payload Definition</span>
                    </label>
                    <span className="text-[9px] text-zinc-600 font-semibold font-mono">
                      {activeFormType === 'gRPC' ? 'protobuf message' : 'JSON Schema'}
                    </span>
                  </div>
                  <textarea
                    rows="8"
                    placeholder={
                      activeFormType === 'REST' 
                        ? '{\n  "username": "string",\n  "email": "string"\n}' 
                        : activeFormType === 'GraphQL'
                        ? 'query GetUser($id: ID!) {\n  user(id: $id) {\n    name\n    email\n  }\n}'
                        : 'message GetUserRequest {\n  string user_id = 1;\n}'
                    }
                    value={requestPayload}
                    onChange={(e) => setRequestPayload(e.target.value)}
                    className="w-full bg-zinc-900/30 focus:bg-zinc-950 border border-zinc-850 focus:border-zinc-700 text-[11px] rounded-2xl px-4 py-4 text-zinc-200 placeholder-zinc-600 outline-none transition-all font-mono leading-relaxed"
                  />
                </div>

                {/* Response Payload Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Response Payload Definition</span>
                    </label>
                    <span className="text-[9px] text-zinc-600 font-semibold font-mono">
                      {activeFormType === 'gRPC' ? 'protobuf message' : 'JSON Schema'}
                    </span>
                  </div>
                  <textarea
                    rows="8"
                    placeholder={
                      activeFormType === 'REST' 
                        ? '{\n  "id": "660c6d7a4d57",\n  "status": "active"\n}' 
                        : activeFormType === 'GraphQL'
                        ? '{\n  "data": {\n    "user": {\n      "name": "Jane Doe",\n      "email": "jane@example.com"\n    }\n  }\n}'
                        : 'message UserResponse {\n  string id = 1;\n  string name = 2;\n  string email = 3;\n}'
                    }
                    value={responsePayload}
                    onChange={(e) => setResponsePayload(e.target.value)}
                    className="w-full bg-zinc-900/30 focus:bg-zinc-950 border border-zinc-850 focus:border-zinc-700 text-[11px] rounded-2xl px-4 py-4 text-zinc-200 placeholder-zinc-600 outline-none transition-all font-mono leading-relaxed"
                  />
                </div>

              </div>

              {/* Save Controls */}
              <div className="border-t border-zinc-900/60 pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-blue-500/30"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Endpoint Design</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>
        </main>

      </div>

      {/* AI Endpoint Generator Modal */}
      <AnimatePresence>
        {aiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !aiGenerating && setAiModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6 bg-fine-grid transition-all duration-305 ${
                aiReviewMode ? 'max-w-4xl' : 'max-w-lg'
              }`}
            >
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <span>{aiReviewMode ? 'Review & Approve Generated Schemas' : 'Generate Endpoints with AI'}</span>
                </h3>
                <p className="text-xs text-zinc-500 font-medium font-sans">
                  {aiReviewMode 
                    ? `Review and select which designed endpoints to apply to the "${project.title}" schema`
                    : 'Describe your system requirements and Nemotron AI will design all relevant API endpoints at once.'}
                </p>
              </div>

              {!aiReviewMode ? (
                <form onSubmit={handleGenerateWithAI} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Protocol Type</label>
                    <div className="flex gap-2.5 p-1 bg-zinc-900 border border-zinc-850 rounded-xl w-fit">
                      {['REST', 'GraphQL', 'gRPC'].map((type) => {
                        const isActive = aiType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setAiType(type)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 select-none ${
                              isActive
                                ? 'bg-zinc-950 text-white shadow-sm border border-zinc-800'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Describe System Requirements</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="e.g. Build a task manager backend requiring user authentication, task creation with tags, getting task list, and updating task status."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full bg-zinc-900/60 hover:bg-zinc-900 focus:bg-zinc-950 border border-zinc-850 focus:border-zinc-700 text-xs rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-655 outline-none transition-all duration-200 resize-none leading-relaxed font-medium"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={aiGenerating}
                      onClick={() => setAiModalOpen(false)}
                      className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-800 select-none text-center disabled:opacity-55"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={aiGenerating || !aiPrompt.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-indigo-500/30 flex justify-center items-center gap-1.5 select-none disabled:opacity-55"
                    >
                      {aiGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Architecting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
                          <span>Generate Schemas</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden max-h-[450px]">
                    <div className="md:col-span-1 border-r border-zinc-900/60 pr-4 space-y-2 overflow-y-auto">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Generated Endpoints</span>
                      {generatedEndpoints.map((ep, idx) => {
                        const isApproved = approvedIndices.includes(idx);
                        const isSelected = selectedReviewIndex === idx;
                        let typeBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                        if (ep.type === 'GraphQL') typeBadge = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
                        if (ep.type === 'gRPC') typeBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedReviewIndex(idx)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? 'bg-zinc-900 border-zinc-800'
                                : 'bg-zinc-950/40 border-transparent hover:bg-zinc-900/30'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate min-w-0">
                              <input
                                type="checkbox"
                                checked={isApproved}
                                onChange={() => toggleApproveEndpoint(idx)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 outline-none cursor-pointer bg-zinc-900 border-zinc-850"
                              />
                              <div className="truncate text-left">
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border select-none mr-2 ${typeBadge}`}>
                                  {ep.type === 'REST' ? ep.restMethod : ep.type}
                                </span>
                                <span className="text-xs font-bold text-zinc-200">{ep.name}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="md:col-span-2 space-y-4 overflow-y-auto pl-2">
                      {generatedEndpoints[selectedReviewIndex] && (
                        <div className="space-y-4 font-sans text-xs">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Endpoint Path / Name</span>
                              <p className="font-mono text-zinc-200 bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800 font-bold">{generatedEndpoints[selectedReviewIndex].name}</p>
                            </div>
                            {generatedEndpoints[selectedReviewIndex].type === 'REST' && (
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">HTTP Method</span>
                                <p className="font-mono text-emerald-400 bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/10 font-bold">{generatedEndpoints[selectedReviewIndex].restMethod}</p>
                              </div>
                            )}
                            {generatedEndpoints[selectedReviewIndex].type === 'GraphQL' && (
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">GraphQL Type</span>
                                <p className="font-mono text-pink-400 bg-pink-500/5 px-3 py-2 rounded-xl border border-pink-500/10 font-bold">{generatedEndpoints[selectedReviewIndex].graphqlType}</p>
                              </div>
                            )}
                            {generatedEndpoints[selectedReviewIndex].type === 'gRPC' && (
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">gRPC Stream Type</span>
                                <p className="font-mono text-blue-400 bg-blue-500/5 px-3 py-2 rounded-xl border border-blue-500/10 font-bold">{generatedEndpoints[selectedReviewIndex].grpcMethodType}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Description</span>
                            <p className="text-zinc-400 leading-relaxed font-medium bg-zinc-900/40 p-3 rounded-xl border border-zinc-850/60">{generatedEndpoints[selectedReviewIndex].description || 'No description'}</p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Request Payload Schema</span>
                              <pre className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 font-mono text-[10px] text-zinc-300 max-h-48 overflow-y-auto leading-relaxed font-medium">
                                {generatedEndpoints[selectedReviewIndex].requestPayload || 'None'}
                              </pre>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Response Payload Schema</span>
                              <pre className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 font-mono text-[10px] text-zinc-300 max-h-48 overflow-y-auto leading-relaxed font-medium">
                                {generatedEndpoints[selectedReviewIndex].responsePayload || 'None'}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-zinc-900/60 pt-4">
                    <button
                      type="button"
                      disabled={aiGenerating}
                      onClick={() => {
                        setAiReviewMode(false);
                        setGeneratedEndpoints([]);
                        setApprovedIndices([]);
                      }}
                      className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-800 select-none text-center disabled:opacity-55"
                    >
                      Discard & Back
                    </button>
                    <button
                      type="button"
                      disabled={aiGenerating || approvedIndices.length === 0}
                      onClick={handleApplyApprovedEndpoints}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-indigo-500/30 flex justify-center items-center gap-1.5 select-none disabled:opacity-55"
                    >
                      {aiGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Apply Approved Endpoints ({approvedIndices.length})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
