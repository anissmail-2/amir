import api from './api';

const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentAlerts: async (limit = 5) => {
    const response = await api.get(`/dashboard/alerts?limit=${limit}`);
    return response.data;
  },

  getSensorSummary: async () => {
    const response = await api.get('/dashboard/sensor-summary');
    return response.data;
  },
};

export default dashboardService;
