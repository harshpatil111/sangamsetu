import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 👇 ADD THESE
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/accounts/login/', { username, password });
    return response.data; // Return the data directly
  },
  register: (data) => api.post('/accounts/register/', data).then(res => res.data),
};

export const statsAPI = {
  getDashboardStats: () => api.get('/cases/stats/').then(res => res.data),
};

export const missingPersonAPI = {
  create: (data) => api.post('/cases/missing/', data).then(res => res.data),
  list: () => api.get('/cases/missing/list/').then(res => res.data),
};

export const foundPersonAPI = {
  create: (data) => api.post('/cases/found/', data).then(res => res.data),
  list: () => api.get('/cases/found/list/').then(res => res.data),
};

export const matchAPI = {
  getMatches: () => api.get('/cases/matches/').then(res => res.data),
  getSuggestions: (params) => api.get('/cases/matches/', { params }).then(res => res.data),
  confirmMatch: (matchId) => api.post(`/cases/matches/confirm/${matchId}/`).then(res => res.data),
  rejectMatch: (matchId) => api.delete(`/cases/matches/reject/${matchId}/`).then(res => res.data),
};

// 👇 keep default export
export default api;
