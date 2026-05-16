import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
