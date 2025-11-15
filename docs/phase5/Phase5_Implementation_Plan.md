# Phase 5: Implementation & Testing Plan

**Course:** SWE 401 - Software Engineering
**Project:** Smart Urban Farming Management System (SUFMS)
**Team Members:**
- Aniss Mail (Project Manager & Backend Developer)
- Sarah Ahmed (Frontend Developer & UI/UX Designer)
- Mohammed Hassan (IoT Specialist & AI/ML Engineer)

**Submission Date:** November 16, 2025
**Phase:** 5 of 5

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Implementation Scope](#2-implementation-scope)
3. [Technology Stack Setup](#3-technology-stack-setup)
4. [Backend Implementation](#4-backend-implementation)
5. [Database Implementation](#5-database-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [IoT Simulation](#7-iot-simulation)
8. [Testing Strategy](#8-testing-strategy)
9. [Deployment](#9-deployment)
10. [Documentation](#10-documentation)

---

## 1. Executive Summary

Phase 5 focuses on implementing a **functional prototype** of the Smart Urban Farming Management System (SUFMS) based on the designs created in Phase 4. Due to time constraints and the academic nature of this project, we will implement:

**Core Features (MVP):**
- ✅ User authentication and authorization
- ✅ Farm and crop management
- ✅ Sensor data monitoring (with simulation)
- ✅ Basic marketplace functionality
- ✅ Dashboard and analytics
- ✅ Responsive web interface

**Deferred to Future Work:**
- Mobile application (React Native)
- AI/ML features (pest detection, crop recommendation)
- Full payment integration (Stripe)
- Advanced IoT hardware deployment
- Full microservices architecture (will use monolithic for MVP)

---

## 2. Implementation Scope

### 2.1 What Will Be Implemented

**Backend (Node.js + Express.js):**
- RESTful API with JWT authentication
- User management (registration, login, profile)
- Farm CRUD operations
- Crop tracking
- Sensor data ingestion and retrieval
- Threshold management and alerts
- Product marketplace (listing, browsing)
- Order management (basic)
- Dashboard analytics

**Database (PostgreSQL):**
- All 15 tables from Phase 4 design
- Database migrations using Sequelize ORM
- Seed data for testing

**Frontend (React.js):**
- Authentication pages (login, registration)
- Main dashboard
- Farm management interface
- Sensor monitoring page
- Marketplace (browse, search, product details)
- Responsive design (desktop and tablet)

**IoT Simulation:**
- Python script to simulate sensor data
- MQTT publisher sending data to backend
- Realistic sensor value generation

**Testing:**
- Unit tests for critical backend functions
- Integration tests for API endpoints
- Basic frontend component tests

### 2.2 What Will Be Simulated/Mocked

- **IoT Devices:** Python script instead of actual Raspberry Pi
- **AI/ML Models:** Static recommendations instead of trained models
- **Payment Processing:** Mock Stripe integration (no actual charges)
- **Email/SMS:** Console logging instead of actual sending
- **Cloud Deployment:** Local Docker containers instead of AWS

### 2.3 What Is Out of Scope

- Mobile application (React Native)
- Full AI/ML model training and deployment
- Full microservices architecture with Kubernetes
- AWS cloud deployment
- Advanced features (chatbot, yield prediction)

---

## 3. Technology Stack Setup

### 3.1 Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "mqtt": "^5.3.0",
    "redis": "^4.6.11"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### 3.2 Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "@mui/material": "^5.14.20",
    "@mui/icons-material": "^5.14.19",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.2",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "vite": "^5.0.7",
    "@vitejs/plugin-react": "^4.2.1",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5"
  }
}
```

### 3.3 IoT Simulation Dependencies

```requirements.txt
paho-mqtt==1.6.1
python-dotenv==1.0.0
```

### 3.4 Development Environment

- **Node.js:** v18 LTS
- **PostgreSQL:** v15
- **Redis:** v7 (optional for MVP)
- **Python:** v3.9+
- **Docker:** v24+ (for containerization)
- **Git:** Version control

---

## 4. Backend Implementation

### 4.1 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Sequelize configuration
│   │   ├── jwt.js               # JWT configuration
│   │   └── mqtt.js              # MQTT broker configuration
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Farm.js              # Farm model
│   │   ├── Crop.js              # Crop model
│   │   ├── Sensor.js            # Sensor model
│   │   ├── SensorReading.js     # Sensor reading model (simplified)
│   │   ├── Threshold.js         # Threshold model
│   │   ├── Alert.js             # Alert model
│   │   ├── Task.js              # Task model
│   │   ├── Product.js           # Product model
│   │   ├── Order.js             # Order model
│   │   └── index.js             # Model associations
│   ├── controllers/
│   │   ├── authController.js    # Auth endpoints
│   │   ├── userController.js    # User CRUD
│   │   ├── farmController.js    # Farm CRUD
│   │   ├── cropController.js    # Crop CRUD
│   │   ├── sensorController.js  # Sensor management
│   │   ├── alertController.js   # Alert management
│   │   ├── productController.js # Product catalog
│   │   ├── orderController.js   # Order management
│   │   └── dashboardController.js # Dashboard analytics
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── users.js             # User routes
│   │   ├── farms.js             # Farm routes
│   │   ├── sensors.js           # Sensor routes
│   │   ├── products.js          # Product routes
│   │   └── index.js             # Route aggregator
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── validation.js        # Input validation
│   │   ├── errorHandler.js      # Error handling
│   │   └── rateLimiter.js       # Rate limiting
│   ├── services/
│   │   ├── mqttService.js       # MQTT message handling
│   │   ├── alertService.js      # Alert generation
│   │   └── analyticsService.js  # Analytics calculations
│   └── app.js                   # Express app setup
├── tests/
│   ├── auth.test.js
│   ├── farm.test.js
│   └── sensor.test.js
├── .env.example
├── package.json
└── server.js                    # Entry point
```

### 4.2 Key API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Farms:**
- `GET /api/farms` - List all farms (with pagination)
- `POST /api/farms` - Create farm
- `GET /api/farms/:id` - Get farm details
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

**Crops:**
- `GET /api/farms/:farmId/crops` - List crops for a farm
- `POST /api/farms/:farmId/crops` - Add crop
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

**Sensors:**
- `GET /api/farms/:farmId/sensors` - List sensors
- `POST /api/sensors` - Register sensor
- `GET /api/sensors/:id/readings` - Get sensor readings
- `POST /api/sensors/readings` - Add reading (via MQTT)

**Products:**
- `GET /api/products` - Search products (with filters)
- `POST /api/products` - Create product listing
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Dashboard:**
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-alerts` - Get recent alerts
- `GET /api/dashboard/sensor-summary` - Get sensor summary

---

## 5. Database Implementation

### 5.1 Sequelize Models

All 15 tables from Phase 4 will be implemented as Sequelize models with:
- Proper data types
- Validations
- Associations (hasMany, belongsTo, belongsToMany)
- Hooks (e.g., password hashing before save)
- Indexes

### 5.2 Migrations

Database migrations will be created for:
1. Create users table
2. Create farms table
3. Create crops table
4. Create sensors table
5. Create sensor_readings table (simplified without InfluxDB)
6. Create thresholds table
7. Create alerts table
8. Create tasks table
9. Create products table
10. Create orders and order_items tables

### 5.3 Seed Data

Seed scripts will populate:
- 3 test users (Farmer, Consumer, Admin)
- 2 sample farms
- 3 crops per farm
- 4 sensors per farm
- 100+ sensor readings
- 10 products in marketplace
- Sample thresholds and alerts

---

## 6. Frontend Implementation

### 6.1 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loading.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── AlertPanel.jsx
│   │   │   └── SensorSnapshot.jsx
│   │   ├── farms/
│   │   │   ├── FarmList.jsx
│   │   │   ├── FarmCard.jsx
│   │   │   └── FarmForm.jsx
│   │   ├── sensors/
│   │   │   ├── SensorCard.jsx
│   │   │   ├── SensorChart.jsx
│   │   │   └── ThresholdForm.jsx
│   │   └── marketplace/
│   │       ├── ProductGrid.jsx
│   │       ├── ProductCard.jsx
│   │       └── ProductDetails.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Farms.jsx
│   │   ├── Sensors.jsx
│   │   └── Marketplace.jsx
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   ├── authService.js      # Auth API calls
│   │   ├── farmService.js      # Farm API calls
│   │   └── sensorService.js    # Sensor API calls
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── utils/
│   │   ├── validators.js       # Form validation
│   │   └── formatters.js       # Data formatting
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

### 6.2 Key Pages

**1. Login Page**
- Email and password inputs
- Form validation
- Error handling
- Redirect to dashboard on success

**2. Dashboard**
- Stats cards (farms, sensors, alerts)
- Recent alerts panel
- Sensor snapshot
- Quick actions

**3. Farms Page**
- List of user's farms
- Add new farm button
- Farm cards with details
- Edit and delete actions

**4. Sensors Page**
- Sensor cards grid
- Real-time data display
- Historical charts (Chart.js)
- Threshold configuration

**5. Marketplace**
- Product grid with filters
- Search functionality
- Product cards
- Basic product details view

---

## 7. IoT Simulation

### 7.1 Sensor Simulator Script

```python
# iot-simulator/sensor_simulator.py

import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime

class SensorSimulator:
    def __init__(self, broker_host, broker_port):
        self.client = mqtt.Client()
        self.client.connect(broker_host, broker_port)

    def generate_soil_moisture(self):
        # Realistic soil moisture: 30-60% for healthy soil
        return round(random.uniform(30, 60), 1)

    def generate_ph(self):
        # pH range: 6.0-7.5 for most crops
        return round(random.uniform(6.0, 7.5), 2)

    def generate_temperature(self):
        # Temperature in Celsius: 15-30°C
        return round(random.uniform(15, 30), 1)

    def generate_humidity(self):
        # Humidity: 40-80%
        return round(random.uniform(40, 80), 1)

    def generate_light(self):
        # Light in lux: 1000-50000
        return round(random.uniform(1000, 50000), 0)

    def publish_reading(self, sensor_id, sensor_type, farm_id):
        value = 0
        unit = ""

        if sensor_type == "soil_moisture":
            value = self.generate_soil_moisture()
            unit = "%"
        elif sensor_type == "ph":
            value = self.generate_ph()
            unit = "pH"
        elif sensor_type == "temperature":
            value = self.generate_temperature()
            unit = "°C"
        elif sensor_type == "humidity":
            value = self.generate_humidity()
            unit = "%"
        elif sensor_type == "light":
            value = self.generate_light()
            unit = "lux"

        message = {
            "sensor_id": sensor_id,
            "sensor_type": sensor_type,
            "value": value,
            "unit": unit,
            "battery_level": round(random.uniform(70, 100), 1),
            "signal_strength": random.randint(-70, -40),
            "timestamp": datetime.now().isoformat()
        }

        topic = f"sensors/{farm_id}/{sensor_id}/data"
        self.client.publish(topic, json.dumps(message))
        print(f"Published: {message}")

    def run(self, sensors, interval=10):
        while True:
            for sensor in sensors:
                self.publish_reading(
                    sensor['id'],
                    sensor['type'],
                    sensor['farm_id']
                )
            time.sleep(interval)

# Usage
if __name__ == "__main__":
    simulator = SensorSimulator("localhost", 1883)

    # Define sensors to simulate
    sensors = [
        {"id": "sensor-1", "type": "soil_moisture", "farm_id": "farm-1"},
        {"id": "sensor-2", "type": "ph", "farm_id": "farm-1"},
        {"id": "sensor-3", "type": "temperature", "farm_id": "farm-1"},
        {"id": "sensor-4", "type": "humidity", "farm_id": "farm-1"},
    ]

    simulator.run(sensors, interval=10)
```

### 7.2 MQTT Broker Setup

For local development, we'll use Mosquitto MQTT broker:

```bash
# Install Mosquitto (Ubuntu/Debian)
sudo apt-get install mosquitto mosquitto-clients

# Start broker
mosquitto -p 1883
```

Or using Docker:

```bash
docker run -d -p 1883:1883 eclipse-mosquitto
```

---

## 8. Testing Strategy

### 8.1 Backend Testing (Jest + Supertest)

**Unit Tests:**
- Model validations
- Service functions
- Utility functions

**Integration Tests:**
- API endpoint responses
- Database operations
- Authentication flow

**Example Test:**
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Authentication Endpoints', () => {
  test('POST /api/auth/register - success', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        user_type: 'Farmer'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - success', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

### 8.2 Frontend Testing (React Testing Library)

**Component Tests:**
- Render tests
- User interaction tests
- Form validation tests

**Example Test:**
```javascript
// src/components/auth/__tests__/LoginForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('displays error on invalid email', async () => {
  render(<LoginForm />);
  const emailInput = screen.getByLabelText(/email/i);
  fireEvent.change(emailInput, { target: { value: 'invalid' } });
  fireEvent.blur(emailInput);

  expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
});
```

### 8.3 Test Coverage Goals

- Backend: >70% code coverage
- Frontend: >60% code coverage
- All critical paths tested (auth, CRUD operations)

---

## 9. Deployment

### 9.1 Local Development

```bash
# Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# IoT Simulator
cd iot-simulator
pip install -r requirements.txt
python sensor_simulator.py
```

### 9.2 Docker Deployment (Optional)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: sufms_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgres://postgres:password@postgres:5432/sufms_db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  mosquitto:
    image: eclipse-mosquitto
    ports:
      - "1883:1883"
```

---

## 10. Documentation

### 10.1 Deliverables

1. **User Guide** - How to use the application
2. **Developer Guide** - How to set up and run locally
3. **API Documentation** - Endpoint descriptions
4. **Test Report** - Test coverage and results
5. **Phase 5 Main Document** - Implementation summary

### 10.2 README.md Updates

- Installation instructions
- Environment setup
- Running the application
- Running tests
- Troubleshooting

---

## Implementation Timeline

| Day | Task | Status |
|-----|------|--------|
| Day 1 | Project setup, database models | Pending |
| Day 2 | Auth and user endpoints | Pending |
| Day 3 | Farm and sensor endpoints | Pending |
| Day 4 | Product and order endpoints | Pending |
| Day 5 | Frontend setup, auth pages | Pending |
| Day 6 | Dashboard and farm pages | Pending |
| Day 7 | Sensor monitoring page | Pending |
| Day 8 | Marketplace page | Pending |
| Day 9 | IoT simulator, testing | Pending |
| Day 10 | Documentation, final testing | Pending |

---

## Success Criteria

✅ User can register and log in
✅ User can create and manage farms
✅ User can view sensor data (simulated)
✅ User can browse marketplace products
✅ Dashboard displays relevant statistics
✅ Application is responsive (desktop/tablet)
✅ All core API endpoints working
✅ Database properly seeded with test data
✅ >70% test coverage on backend
✅ Documentation complete

---

**This plan will be executed starting now, with the goal of delivering a functional SUFMS prototype by November 16, 2025.**
