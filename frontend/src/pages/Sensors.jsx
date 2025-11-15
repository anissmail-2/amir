import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import farmService from '../services/farmService';
import sensorService from '../services/sensorService';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import {
  Sensors as SensorsIcon,
  WaterDrop as WaterDropIcon,
  Thermostat as ThermostatIcon,
  WbSunny as LightIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getSensorIcon = (type) => {
  switch (type) {
    case 'soil_moisture':
      return <WaterDropIcon />;
    case 'temperature':
      return <ThermostatIcon />;
    case 'light':
      return <LightIcon />;
    default:
      return <SensorsIcon />;
  }
};

const getSensorColor = (type) => {
  switch (type) {
    case 'soil_moisture':
      return 'info';
    case 'temperature':
      return 'error';
    case 'ph':
      return 'success';
    case 'humidity':
      return 'primary';
    case 'light':
      return 'warning';
    default:
      return 'default';
  }
};

const Sensors = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      loadSensors();
    }
  }, [selectedFarm]);

  useEffect(() => {
    if (selectedSensor) {
      loadReadings();
    }
  }, [selectedSensor]);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const data = await farmService.getMyFarms();
      setFarms(data.farms);
      if (data.farms.length > 0) {
        setSelectedFarm(data.farms[0].farm_id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const loadSensors = async () => {
    const farm = farms.find((f) => f.farm_id === selectedFarm);
    if (farm && farm.sensors) {
      setSensors(farm.sensors);
      if (farm.sensors.length > 0 && !selectedSensor) {
        setSelectedSensor(farm.sensors[0]);
      }
    }
  };

  const loadReadings = async () => {
    if (!selectedSensor) return;

    try {
      const data = await sensorService.getSensorReadings(selectedSensor.sensor_id, 24);
      setReadings(data.readings || []);
    } catch (err) {
      console.error('Failed to load sensor readings:', err);
    }
  };

  const getChartData = () => {
    if (!readings || readings.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const sortedReadings = [...readings].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return {
      labels: sortedReadings.map((r) =>
        new Date(r.timestamp).toLocaleTimeString()
      ),
      datasets: [
        {
          label: selectedSensor?.sensor_name || 'Sensor Reading',
          data: sortedReadings.map((r) => parseFloat(r.value)),
          borderColor: 'rgb(46, 125, 50)',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedSensor?.sensor_name || 'Sensor'} - Last 24 Hours`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (farms.length === 0) {
    return (
      <Layout>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
        >
          <SensorsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Please create a farm first to add sensors
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sensor Monitoring
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Farm Selector */}
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
          <InputLabel>Select Farm</InputLabel>
          <Select
            value={selectedFarm}
            label="Select Farm"
            onChange={(e) => setSelectedFarm(e.target.value)}
          >
            {farms.map((farm) => (
              <MenuItem key={farm.farm_id} value={farm.farm_id}>
                {farm.farm_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {sensors.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="40vh"
          >
            <SensorsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No sensors registered for this farm
            </Typography>
          </Box>
        ) : (
          <>
            {/* Sensor Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {sensors.map((sensor) => (
                <Grid item xs={12} sm={6} md={3} key={sensor.sensor_id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedSensor?.sensor_id === sensor.sensor_id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                    onClick={() => setSelectedSensor(sensor)}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Box>
                          {getSensorIcon(sensor.sensor_type)}
                        </Box>
                        <Chip
                          label={sensor.status}
                          size="small"
                          color={sensor.status === 'Online' ? 'success' : 'default'}
                        />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {sensor.sensor_name}
                      </Typography>
                      <Chip
                        label={sensor.sensor_type.replace('_', ' ')}
                        size="small"
                        color={getSensorColor(sensor.sensor_type)}
                        sx={{ textTransform: 'capitalize' }}
                      />
                      {sensor.battery_level && (
                        <Typography variant="caption" display="block" mt={1}>
                          Battery: {sensor.battery_level}%
                        </Typography>
                      )}
                      {sensor.last_reading_at && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Last: {new Date(sensor.last_reading_at).toLocaleString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Chart */}
            {selectedSensor && (
              <Paper sx={{ p: 3 }}>
                <Line data={getChartData()} options={chartOptions} />
                {readings.length === 0 && (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      No data available for this sensor
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Sensors;
