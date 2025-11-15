# SUFMS Frontend

React.js web application for the Smart Urban Farming Management System.

## Features

- **Authentication** - Login and registration with JWT tokens
- **Dashboard** - Overview of farms, sensors, alerts, and statistics
- **Farm Management** - Create and manage farms
- **Sensor Monitoring** - Real-time sensor data with charts
- **Marketplace** - Browse and search agricultural products
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- React 18 with Vite
- Material-UI (MUI) for components
- React Router for navigation
- Axios for API calls
- Chart.js for data visualization
- Context API for state management

## Prerequisites

- Node.js v18 or higher
- Backend API running on `http://localhost:4000`

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   └── common/      # Common components (Layout, PrivateRoute)
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Farms.jsx
│   │   ├── Sensors.jsx
│   │   └── Marketplace.jsx
│   ├── services/        # API services
│   │   ├── api.js       # Axios instance
│   │   ├── authService.js
│   │   ├── farmService.js
│   │   ├── sensorService.js
│   │   ├── productService.js
│   │   └── dashboardService.js
│   ├── context/         # React contexts
│   │   └── AuthContext.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:4000/api
```

## API Integration

The frontend communicates with the backend API via Axios. The API base URL is configured in `src/services/api.js`.

All API calls automatically include the JWT token from localStorage if the user is authenticated.

## Features by Page

### Login & Registration
- Email and password authentication
- Form validation
- Error handling
- Automatic redirect to dashboard after login

### Dashboard
- Statistics cards (farms, sensors, crops, tasks)
- Recent alerts list
- Quick actions
- Role-based content (Farmer vs Consumer)

### Farms
- View all user's farms
- Create new farm with form dialog
- Delete farms
- Display farm details (crops, sensors)

### Sensors
- Select farm to view sensors
- Real-time sensor status
- Historical data visualization (Chart.js)
- Last 24 hours of readings
- Battery level and signal strength

### Marketplace
- Browse all products
- Search by name/description
- Filter by category and organic status
- Pagination
- Product cards with details

## Authentication Flow

1. User logs in → JWT token stored in localStorage
2. Token included in all API requests via Axios interceptor
3. If token expires → Auto redirect to login page
4. Logout → Token removed from localStorage

## Protected Routes

All routes except `/login` and `/register` are protected by the `PrivateRoute` component. Unauthenticated users are redirected to the login page.

## Styling

- Material-UI components for consistent design
- Custom theme with agricultural color scheme
  - Primary: Green (#2E7D32)
  - Secondary: Orange (#FF6F00)
- Responsive grid layout
- Mobile-first design approach

## Testing

```bash
# Run tests
npm test
```

## Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in dist/ directory
```

## Deployment

The built application can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

**API connection errors:**
- Ensure backend is running on `http://localhost:4000`
- Check CORS settings in backend
- Verify API_URL in `.env` file

**Authentication issues:**
- Clear browser localStorage
- Check JWT token expiration
- Verify backend authentication endpoints

**Build errors:**
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

## License

MIT

## Authors

- Aniss Mail (Project Manager & Backend Developer)
- Sarah Ahmed (Frontend Developer & UI/UX Designer)
- Mohammed Hassan (IoT Specialist)
