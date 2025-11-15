import api from './api';

const sensorService = {
  registerSensor: async (sensorData) => {
    const response = await api.post('/sensors', sensorData);
    return response.data;
  },

  getSensorReadings: async (sensorId, hours = 24) => {
    const response = await api.get(`/sensors/${sensorId}/readings?hours=${hours}`);
    return response.data;
  },

  setThreshold: async (sensorId, thresholdData) => {
    const response = await api.post(`/sensors/${sensorId}/thresholds`, thresholdData);
    return response.data;
  },
};

export default sensorService;
