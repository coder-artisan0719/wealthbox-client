import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, userData: any) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await api.post('/users/change-password', { currentPassword, newPassword });
  return response.data;
};

export const getOrganizations = async () => {
  const response = await api.get('/organizations');
  return response.data;
};

export const getOrganizationById = async (id: number) => {
  const response = await api.get(`/organizations/${id}`);
  return response.data;
};

export const createOrganization = async (organizationData: any) => {
  const response = await api.post('/organizations', organizationData);
  return response.data;
};

export const updateOrganization = async (id: number, organizationData: any) => {
  const response = await api.put(`/organizations/${id}`, organizationData);
  return response.data;
};

export const deleteOrganization = async (id: number) => {
  const response = await api.delete(`/organizations/${id}`);
  return response.data;
};

export const updateUserOrganization = async (userId: number, organizationId: number) => {
  const response = await api.put(`/users/${userId}/organization`, { organizationId });
  return response.data;
};

export const saveIntegrationConfig = async (configData: any) => {
  const response = await api.post('/integrations/config', configData);
  return response.data;
};

export const getIntegrationConfig = async (integrationType: string) => {
  const response = await api.get(`/integrations/config/${integrationType}`);
  return response.data;
};

export const syncWealthboxUsers = async () => {
  const response = await api.post('/integrations/wealthbox/sync');
  return response.data;
};

export const getWealthboxUsers = async (organizationId?: string | number) => {
  const params = organizationId && organizationId !== 'all' ? `?organizationId=${organizationId}` : '';
  const response = await api.get(`/integrations/wealthbox/users${params}`);
  return response.data;
};