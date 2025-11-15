# SUFMS Backend API

Node.js/Express.js backend for the Smart Urban Farming Management System.

## Features

- **Authentication:** JWT-based user authentication
- **Farm Management:** CRUD operations for farms and crops
- **IoT Monitoring:** Real-time sensor data ingestion via MQTT
- **Marketplace:** Product listings and search
- **Dashboard:** Analytics and statistics
- **PostgreSQL:** Relational database with Sequelize ORM

## Tech Stack

- Node.js v18+
- Express.js 4.x
- PostgreSQL 15
- Sequelize ORM 6.x
- JWT authentication
- MQTT (Mosquitto)
- bcrypt for password hashing

## Prerequisites

- Node.js v18 or higher
- PostgreSQL 15
- MQTT broker (Mosquitto) running on `localhost:1883`

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

## Database Setup

```bash
# Create PostgreSQL database
createdb sufms_db

# Run migrations (auto-sync in development)
npm run dev
```

## Running the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will be available at `http://localhost:4000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (requires auth)
- `POST /logout` - Logout user (requires auth)

### Farms (`/api/farms`)
- `GET /` - Get all farms
- `GET /my-farms` - Get current user's farms (requires auth)
- `GET /:id` - Get farm by ID
- `POST /` - Create farm (requires auth, Farmer/Gardener only)
- `PUT /:id` - Update farm (requires auth, owner only)
- `DELETE /:id` - Delete farm (requires auth, owner only)

### Sensors (`/api/sensors`)
- `POST /` - Register sensor (requires auth, Farmer/Gardener only)
- `GET /:id/readings` - Get sensor readings (requires auth)
- `POST /readings` - Add sensor reading (used by MQTT service)
- `POST /:id/thresholds` - Set sensor threshold (requires auth, owner only)
- `PUT /:id` - Update sensor (requires auth, owner only)
- `DELETE /:id` - Delete sensor (requires auth, owner only)

### Products (`/api/products`)
- `GET /` - Get all products (with search/filter)
- `GET /:id` - Get product by ID
- `POST /` - Create product (requires auth, Farmer/Gardener only)
- `PUT /:id` - Update product (requires auth, owner only)
- `DELETE /:id` - Delete product (requires auth, owner only)

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics (requires auth)
- `GET /alerts` - Get recent alerts (requires auth)
- `GET /sensor-summary` - Get sensor summary (requires auth)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by registering or logging in.

## Database Models

- **User** - User accounts
- **Farm** - Farm information
- **Crop** - Crop tracking
- **Sensor** - IoT sensor registry
- **SensorReading** - Sensor data readings
- **Threshold** - Alert thresholds
- **Alert** - System alerts
- **Task** - Farm tasks
- **Product** - Marketplace products
- **Order** - Purchase orders
- **OrderItem** - Order line items
- **Review** - Product reviews

## MQTT Integration

The backend subscribes to MQTT topics for real-time sensor data:

- **Topic Pattern:** `sensors/{farm_id}/{sensor_id}/data`
- **Message Format:** JSON
  ```json
  {
    "sensor_id": "uuid",
    "sensor_type": "soil_moisture",
    "value": 45.2,
    "unit": "%",
    "battery_level": 87.5,
    "signal_strength": -65,
    "timestamp": "2025-11-15T10:30:00Z"
  }
  ```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL connection
- `JWT_SECRET` - Secret key for JWT tokens
- `MQTT_BROKER_URL` - MQTT broker URL (default: `mqtt://localhost:1883`)
- `PORT` - API server port (default: 4000)

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   └── app.js           # Express app setup
├── tests/               # Test files
├── .env.example         # Environment template
├── package.json
├── README.md
└── server.js            # Entry point
```

## Error Handling

All errors return JSON in the following format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "details": [] // Optional validation details
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Development

```bash
# Install nodemon globally (optional)
npm install -g nodemon

# Run in development mode
npm run dev
```

The server will automatically restart on file changes.

## License

MIT

## Authors

- Aniss Mail (Project Manager & Backend Developer)
- Sarah Ahmed (Frontend Developer)
- Mohammed Hassan (IoT Specialist)
