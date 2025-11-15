import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import farmService from '../services/farmService';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Agriculture as AgricultureIcon,
  LocationOn as LocationOnIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const farmTypes = ['Outdoor', 'Indoor', 'Greenhouse', 'Hydroponic', 'Vertical'];

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    farm_name: '',
    location: '',
    size_hectares: '',
    farm_type: 'Outdoor',
    description: '',
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const data = await farmService.getMyFarms();
      setFarms(data.farms);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      farm_name: '',
      location: '',
      size_hectares: '',
      farm_type: 'Outdoor',
      description: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await farmService.createFarm(formData);
      handleCloseDialog();
      loadFarms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create farm');
    }
  };

  const handleDelete = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        await farmService.deleteFarm(farmId);
        loadFarms();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete farm');
      }
    }
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

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            My Farms
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Farm
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {farms.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="40vh"
          >
            <AgricultureIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No farms yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
              Create Your First Farm
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {farms.map((farm) => (
              <Grid item xs={12} sm={6} md={4} key={farm.farm_id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {farm.farm_name}
                      </Typography>
                      <Chip
                        label={farm.farm_type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                      <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {farm.location}
                      </Typography>
                    </Box>
                    {farm.size_hectares && (
                      <Typography variant="body2" color="text.secondary">
                        Size: {farm.size_hectares} hectares
                      </Typography>
                    )}
                    {farm.description && (
                      <Typography variant="body2" mt={1}>
                        {farm.description.substring(0, 100)}
                        {farm.description.length > 100 && '...'}
                      </Typography>
                    )}
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        Crops: {farm.crops?.length || 0} • Sensors: {farm.sensors?.length || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(farm.farm_id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add Farm Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Farm</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="farm_name"
                label="Farm Name"
                type="text"
                fullWidth
                required
                value={formData.farm_name}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="location"
                label="Location"
                type="text"
                fullWidth
                required
                value={formData.location}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="size_hectares"
                label="Size (hectares)"
                type="number"
                fullWidth
                value={formData.size_hectares}
                onChange={handleChange}
                inputProps={{ step: '0.01', min: '0' }}
              />
              <TextField
                margin="dense"
                name="farm_type"
                label="Farm Type"
                select
                fullWidth
                required
                value={formData.farm_type}
                onChange={handleChange}
              >
                {farmTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create Farm
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Farms;
