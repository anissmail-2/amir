import api from './api';

const farmService = {
  getMyFarms: async () => {
    const response = await api.get('/farms/my-farms');
    return response.data;
  },

  getFarmById: async (id) => {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  },

  createFarm: async (farmData) => {
    const response = await api.post('/farms', farmData);
    return response.data;
  },

  updateFarm: async (id, farmData) => {
    const response = await api.put(`/farms/${id}`, farmData);
    return response.data;
  },

  deleteFarm: async (id) => {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  },
};

export default farmService;
