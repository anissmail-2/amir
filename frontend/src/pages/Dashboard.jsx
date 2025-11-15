import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import dashboardService from '../services/dashboardService';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  Sensors as SensorsIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: color + '.light',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, alertsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentAlerts(),
      ]);
      setStats(statsData.stats);
      setAlerts(alertsData.alerts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'error';
      case 'Warning':
        return 'warning';
      default:
        return 'info';
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
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.first_name || user?.email}!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Here's what's happening with your farms today.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {['Farmer', 'Gardener'].includes(user?.user_type) && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Farms"
                  value={stats?.farms || 0}
                  icon={<AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Sensors"
                  value={`${stats?.sensors?.online || 0}/${stats?.sensors?.total || 0}`}
                  icon={<SensorsIcon sx={{ fontSize: 40, color: 'success.main' }} />}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Growing Crops"
                  value={stats?.crops || 0}
                  icon={<AgricultureIcon sx={{ fontSize: 40, color: 'info.main' }} />}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Pending Tasks"
                  value={stats?.pending_tasks || 0}
                  icon={<AssignmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />}
                  color="warning"
                />
              </Grid>
            </>
          )}

          {['Consumer', 'Restaurant'].includes(user?.user_type) && (
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Available Products"
                value={stats?.available_products || 0}
                icon={<AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                color="primary"
              />
            </Grid>
          )}
        </Grid>

        {/* Alerts Section */}
        {['Farmer', 'Gardener'].includes(user?.user_type) && alerts.length > 0 && (
          <Paper sx={{ mt: 3, p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Alerts
              </Typography>
              {stats?.critical_alerts > 0 && (
                <Chip
                  label={`${stats.critical_alerts} Critical`}
                  color="error"
                  size="small"
                />
              )}
            </Box>
            <List>
              {alerts.slice(0, 5).map((alert) => (
                <ListItem key={alert.alert_id} divider>
                  <ListItemText
                    primary={alert.message}
                    secondary={`${alert.alert_type} • ${new Date(alert.created_at).toLocaleString()}`}
                  />
                  <Chip
                    label={alert.severity}
                    color={getSeverityColor(alert.severity)}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Quick Actions */}
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {['Farmer', 'Gardener'].includes(user?.user_type) && (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<AgricultureIcon />}
                    onClick={() => navigate('/farms')}
                  >
                    Manage Farms
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<SensorsIcon />}
                    onClick={() => navigate('/sensors')}
                  >
                    View Sensors
                  </Button>
                </Grid>
              </>
            )}
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate('/marketplace')}
              >
                Browse Marketplace
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Dashboard;
