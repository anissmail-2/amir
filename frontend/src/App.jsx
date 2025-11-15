import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Sensors from './pages/Sensors';
import Marketplace from './pages/Marketplace';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green 700
    },
    secondary: {
      main: '#FF6F00', // Orange 900
    },
    success: {
      main: '#43A047',
    },
    warning: {
      main: '#FFA000',
    },
    error: {
      main: '#D32F2F',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, system-ui, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/farms" element={
              <PrivateRoute>
                <Farms />
              </PrivateRoute>
            } />
            <Route path="/sensors" element={
              <PrivateRoute>
                <Sensors />
              </PrivateRoute>
            } />
            <Route path="/marketplace" element={
              <PrivateRoute>
                <Marketplace />
              </PrivateRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
