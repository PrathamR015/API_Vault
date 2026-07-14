import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export const fetchAPIs = async (searchParams, pageParam = 1) => {
  const params = Object.fromEntries([...searchParams]);
  params.page = pageParam;
  const response = await api.get('/apis', { params });
  return response.data;
};

export const checkAuthStatus = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const curateAPIs = async (prompt, history = []) => {
  const response = await api.post('/curate', { prompt, history });
  return response.data;
};

// Project Designer Endpoints
export const fetchProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const fetchProjectDetails = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const createEndpoint = async (projectId, endpointData) => {
  const response = await api.post(`/projects/${projectId}/endpoints`, endpointData);
  return response.data;
};

export const updateEndpoint = async (endpointId, endpointData) => {
  const response = await api.put(`/projects/endpoints/${endpointId}`, endpointData);
  return response.data;
};

export const deleteEndpoint = async (endpointId) => {
  const response = await api.delete(`/projects/endpoints/${endpointId}`);
  return response.data;
};

export const generateEndpointsBulkWithAI = async (projectId, prompt, type) => {
  const response = await api.post(`/projects/${projectId}/endpoints/generate-bulk`, { prompt, type });
  return response.data; // returns { endpoints: [...] }
};

export const saveBulkEndpoints = async (projectId, endpoints) => {
  const response = await api.post(`/projects/${projectId}/endpoints/bulk`, { endpoints });
  return response.data; // returns array of saved Endpoint documents
};

export const exportProject = async (id, format) => {
  const response = await api.get(`/projects/${id}/export`, {
    params: { format },
    responseType: 'blob'
  });
  return response;
};



