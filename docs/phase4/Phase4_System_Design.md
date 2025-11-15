# Phase 4: System Design

**Course:** SWE 401 - Software Engineering
**Project:** Smart Urban Farming Management System (SUFMS)
**Team Members:**
- Aniss Mail (Project Manager & Backend Developer)
- Sarah Ahmed (Frontend Developer & UI/UX Designer)
- Mohammed Hassan (IoT Specialist & AI/ML Engineer)

**Submission Date:** November 9, 2025
**Phase:** 4 of 5

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Software Architecture Design](#2-software-architecture-design)
3. [Subsystem Decomposition](#3-subsystem-decomposition)
4. [Data Design](#4-data-design)
5. [Hardware Design](#5-hardware-design)
6. [User Interface Design](#6-user-interface-design)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Security Design](#8-security-design)
9. [Performance Considerations](#9-performance-considerations)
10. [Traceability Matrix](#10-traceability-matrix)
11. [Conclusion](#11-conclusion)
12. [References](#12-references)

---

## 1. Executive Summary

This document presents the comprehensive system design for the Smart Urban Farming Management System (SUFMS), building upon the foundation established in Phase 1 (Project Proposal), Phase 2 (Requirements Engineering), and Phase 3 (System Analysis).

The system design encompasses:
- **Software Architecture:** A 3-tier architecture with microservices pattern for scalability and maintainability
- **Data Design:** Multi-database strategy utilizing PostgreSQL (relational data), InfluxDB (time-series sensor data), and Redis (caching and queuing)
- **Hardware Design:** IoT gateway architecture using Raspberry Pi 4 and Arduino for sensor integration
- **User Interface Design:** 8 comprehensive UI mockups covering all major user interactions
- **Deployment Architecture:** Cloud-native deployment on AWS using Kubernetes (EKS) for container orchestration

This design ensures the system meets all functional requirements (FR-001 to FR-037) and non-functional requirements (NFR-001 to NFR-032) identified in Phase 2, while adhering to the Boundary-Control-Entity (BCE) architectural pattern analyzed in Phase 3.

---

## 2. Software Architecture Design

### 2.1 Architectural Style

SUFMS employs a **3-tier layered architecture** combined with a **microservices pattern** to achieve:
- **Scalability:** Independent scaling of services based on load
- **Maintainability:** Clear separation of concerns
- **Flexibility:** Easy integration of new features and services
- **Resilience:** Fault isolation and graceful degradation

### 2.2 Architecture Layers

#### 2.2.1 Presentation Tier
- **Web Application:** React.js 18+ with Material-UI component library
- **Mobile Application:** React Native for cross-platform (iOS/Android) support
- **Responsibilities:**
  - User interface rendering
  - Client-side state management (Redux Toolkit)
  - Form validation and user input handling
  - Real-time data visualization (Chart.js, D3.js)
  - WebSocket client for live sensor updates

#### 2.2.2 Business Logic Tier
- **API Gateway:** Express.js-based routing and load balancing
- **Microservices Architecture:**
  1. **Authentication Service:** User login, JWT tokens, OAuth integration
  2. **User Management Service:** Profile management, role-based access control
  3. **Farm Management Service:** Farm registration, crop tracking, task scheduling
  4. **IoT Monitoring Service:** Sensor data ingestion, threshold management, alerts
  5. **AI/ML Service:** Pest detection, crop recommendation, yield prediction
  6. **Marketplace Service:** Product catalog, orders, payments, reviews
  7. **Notification Service:** Email, SMS, push notifications
  8. **Analytics Service:** Reporting, data aggregation, trend analysis

#### 2.2.3 Data Tier
- **PostgreSQL:** Primary relational database for structured data
- **InfluxDB:** Time-series database for high-frequency sensor readings
- **Redis:** In-memory cache and message queue
- **AWS S3:** Object storage for images, reports, and files

### 2.3 Architecture Diagram

The complete software architecture is documented in `SoftwareArchitecture.puml`, illustrating:
- All architectural layers and components
- Communication patterns between services
- External service integrations (Stripe, OpenWeatherMap, SendGrid, Twilio, OpenAI)
- IoT device layer integration
- DevOps and monitoring infrastructure (Grafana, Prometheus, ELK Stack)

**Key Architectural Decisions:**
- **API Gateway Pattern:** Centralized entry point for all client requests
- **Service Discovery:** Kubernetes DNS for automatic service discovery
- **Inter-Service Communication:** RESTful APIs for synchronous calls, Redis pub/sub for asynchronous events
- **Data Consistency:** Event-driven architecture with eventual consistency for distributed data

---

## 3. Subsystem Decomposition

The system is decomposed into 9 major subsystems, each with clearly defined responsibilities and interfaces. Detailed component interactions are documented in `ComponentDiagram.puml`.

### 3.1 Identity & Access Management Subsystem

**Components:**
- Authentication Service
- Authorization Service

**Responsibilities:**
- User authentication (email/password, OAuth)
- JWT token generation and validation
- Session management (Redis-backed)
- Role-based access control (RBAC)
- Password hashing using bcrypt (cost factor: 12)

**Interfaces:**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/verify` - Token verification

**Dependencies:**
- PostgreSQL (users table)
- Redis (session storage)

### 3.2 User Management Subsystem

**Components:**
- User Profile Service
- Farmer Profile Service
- Consumer Profile Service

**Responsibilities:**
- User registration and profile management
- User type-specific data (farm details for farmers, delivery addresses for consumers)
- Account verification and password reset
- User search and discovery

**Interfaces:**
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `GET /api/v1/farmers` - List farmers
- `GET /api/v1/consumers` - List consumers

**Dependencies:**
- Authentication Service (user validation)
- PostgreSQL (users table)
- S3 (profile pictures)

### 3.3 Farm Management Subsystem

**Components:**
- Farm Service
- Crop Service
- Task Scheduler
- Planting Calendar

**Responsibilities:**
- Farm registration and location management (geocoding)
- Crop lifecycle tracking (planting → harvesting)
- Automated and manual task scheduling
- Planting calendar with crop rotation suggestions
- Farm photo management

**Interfaces:**
- `POST /api/v1/farms` - Create farm
- `GET /api/v1/farms/:id` - Get farm details
- `POST /api/v1/crops` - Add crop
- `GET /api/v1/crops/:id` - Get crop details
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/:id` - Update task status

**Dependencies:**
- User Management Service (farmer verification)
- PostgreSQL (farms, crops, tasks tables)
- S3 (farm images)

### 3.4 IoT Monitoring Subsystem

**Components:**
- Sensor Data Ingestion Service
- Threshold Manager
- Alert Service
- Sensor Registry
- MQTT Broker (Mosquitto)

**Responsibilities:**
- MQTT message subscription and parsing
- Real-time sensor data validation and storage
- Custom threshold management per sensor
- Automated alert generation on threshold violations
- Sensor device registration and health monitoring

**Interfaces:**
- `MQTT Topic: sensors/{farm_id}/{sensor_id}/data` - Sensor data publication
- `POST /api/v1/sensors` - Register sensor
- `GET /api/v1/sensors/:id/data` - Query sensor history
- `POST /api/v1/thresholds` - Set threshold
- `GET /api/v1/alerts` - List alerts

**Dependencies:**
- AWS IoT Core (MQTT broker)
- InfluxDB (sensor_readings measurement)
- PostgreSQL (sensors, thresholds, alerts tables)
- Redis (pub/sub for real-time updates)
- Notification Service (alert delivery)

### 3.5 AI/ML Subsystem

**Components:**
- Pest Detection Engine (CNN-based)
- Crop Recommendation Engine
- Yield Prediction Model
- Irrigation Optimizer
- AI Chatbot (GPT-powered)
- Model Registry

**Responsibilities:**
- Image-based pest identification using TensorFlow/PyTorch
- Crop suitability recommendations based on soil and climate
- Yield forecasting using historical data
- Irrigation schedule optimization based on weather and soil moisture
- Conversational AI for farming advice

**Interfaces:**
- `POST /api/v1/ml/pest-detection` - Upload pest image
- `POST /api/v1/ml/crop-recommendation` - Get crop suggestions
- `POST /api/v1/ml/yield-prediction` - Predict yield
- `POST /api/v1/ml/irrigation-optimize` - Optimize irrigation
- `POST /api/v1/chatbot` - Chat with AI assistant

**Dependencies:**
- S3 (image storage)
- PostgreSQL (detection history)
- OpenWeatherMap API (weather data)
- OpenAI API (chatbot)
- InfluxDB (sensor data for ML models)

### 3.6 Marketplace Subsystem

**Components:**
- Product Catalog Service
- Order Management Service
- Payment Service
- Search & Filter Service
- Review & Rating Service
- Inventory Service

**Responsibilities:**
- Product listing and catalog management
- Advanced search with filters (category, price, location, organic)
- Order creation, tracking, and fulfillment
- Secure payment processing (Stripe integration)
- Product reviews and ratings
- Real-time inventory management

**Interfaces:**
- `GET /api/v1/products` - Search products
- `POST /api/v1/products` - Create product listing
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Track order
- `POST /api/v1/payments` - Process payment
- `POST /api/v1/reviews` - Submit review

**Dependencies:**
- User Management Service (buyer/seller verification)
- PostgreSQL (products, orders, payments, reviews tables)
- Stripe API (payment processing)
- S3 (product images)
- Notification Service (order updates)

### 3.7 Notification Subsystem

**Components:**
- Email Notification Service (SendGrid)
- SMS Notification Service (Twilio)
- Push Notification Service (Firebase Cloud Messaging)
- Notification Queue (Redis)

**Responsibilities:**
- Multi-channel notification delivery
- Template-based messaging
- Queue management with retry logic
- Notification preferences management
- Delivery status tracking

**Interfaces:**
- `POST /api/v1/notifications/email` - Send email
- `POST /api/v1/notifications/sms` - Send SMS
- `POST /api/v1/notifications/push` - Send push notification
- `GET /api/v1/notifications/preferences` - Get user preferences

**Dependencies:**
- Redis (notification queue)
- SendGrid API (email)
- Twilio API (SMS)
- Firebase Cloud Messaging (push)
- PostgreSQL (notification_logs table)

### 3.8 Analytics & Reporting Subsystem

**Components:**
- Report Generator
- Analytics Engine
- Dashboard Service

**Responsibilities:**
- Generate PDF/CSV reports
- Revenue and yield analytics
- Resource usage tracking (water, fertilizers)
- Trend analysis and forecasting
- Real-time dashboard data aggregation

**Interfaces:**
- `GET /api/v1/analytics/revenue` - Revenue analytics
- `GET /api/v1/analytics/yield` - Yield analytics
- `GET /api/v1/analytics/resources` - Resource usage
- `POST /api/v1/reports/generate` - Generate report
- `GET /api/v1/dashboard` - Dashboard summary

**Dependencies:**
- PostgreSQL (transactional data)
- InfluxDB (sensor trends)
- All core services (data aggregation)

### 3.9 External Services Integration

**Adapters:**
- Stripe Adapter (payments)
- OpenWeatherMap Adapter (weather forecasts)
- SendGrid Adapter (email)
- Twilio Adapter (SMS)
- Firebase Cloud Messaging Adapter (push)
- OpenAI Adapter (GPT chatbot)

**Pattern:** Adapter Pattern for consistent interfaces to external APIs

---

## 4. Data Design

The system employs a **polyglot persistence** strategy, using the right database for each data type. Complete schemas are documented in separate files.

### 4.1 PostgreSQL - Relational Database

**Purpose:** Primary database for structured, transactional data

**Database Name:** `sufms_db`

**Tables:** 15 tables with full normalization (3NF)

#### 4.1.1 Core Tables

1. **users** (User accounts)
   - Primary Key: `user_id` (UUID)
   - Attributes: email, password_hash, user_type, status, created_at, updated_at
   - Indexes: email (unique), user_type
   - Constraints: CHECK (user_type IN ('Farmer', 'Gardener', 'Consultant', 'Consumer', 'Restaurant', 'Admin'))

2. **farms** (Farm information)
   - Primary Key: `farm_id` (UUID)
   - Foreign Keys: `owner_id` → users(user_id)
   - Attributes: farm_name, location, size_hectares, farm_type, coordinates (PostGIS)
   - Indexes: owner_id, coordinates (spatial index)

3. **crops** (Crop tracking)
   - Primary Key: `crop_id` (UUID)
   - Foreign Keys: `farm_id` → farms(farm_id)
   - Attributes: crop_name, variety, planting_date, expected_harvest_date, actual_harvest_date, status

4. **sensors** (IoT sensor registry)
   - Primary Key: `sensor_id` (UUID)
   - Foreign Keys: `farm_id` → farms(farm_id)
   - Attributes: sensor_type, location, calibration_date, battery_level, status

5. **thresholds** (Sensor alert thresholds)
   - Primary Key: `threshold_id` (UUID)
   - Foreign Keys: `sensor_id` → sensors(sensor_id)
   - Attributes: min_value, max_value, alert_severity

6. **alerts** (System alerts)
   - Primary Key: `alert_id` (UUID)
   - Foreign Keys: `sensor_id` → sensors(sensor_id)
   - Attributes: alert_type, severity, message, acknowledged_at

7. **tasks** (Farm tasks)
   - Primary Key: `task_id` (UUID)
   - Foreign Keys: `farm_id` → farms(farm_id), `assigned_to` → users(user_id)
   - Attributes: title, description, due_date, priority, status

8. **products** (Marketplace products)
   - Primary Key: `product_id` (UUID)
   - Foreign Keys: `seller_id` → users(user_id)
   - Attributes: product_name, category, price, quantity_available, unit, is_organic

9. **orders** (Purchase orders)
   - Primary Key: `order_id` (UUID)
   - Foreign Keys: `buyer_id` → users(user_id)
   - Attributes: total_amount, delivery_method, delivery_address, status

10. **order_items** (Order line items)
    - Primary Key: `order_item_id` (UUID)
    - Foreign Keys: `order_id` → orders(order_id), `product_id` → products(product_id)
    - Attributes: quantity, unit_price, subtotal

11. **payments** (Payment records)
    - Primary Key: `payment_id` (UUID)
    - Foreign Keys: `order_id` → orders(order_id)
    - Attributes: stripe_payment_intent_id, amount, currency, status

12. **reviews** (Product reviews)
    - Primary Key: `review_id` (UUID)
    - Foreign Keys: `product_id` → products(product_id), `reviewer_id` → users(user_id)
    - Attributes: rating (1-5), comment

13. **pest_detection_records** (AI detection history)
    - Primary Key: `detection_id` (UUID)
    - Foreign Keys: `farm_id` → farms(farm_id), `detected_by` → users(user_id)
    - Attributes: image_url, pest_type, confidence_score, treatment_recommendation

14. **irrigation_schedules** (Irrigation plans)
    - Primary Key: `schedule_id` (UUID)
    - Foreign Keys: `farm_id` → farms(farm_id), `crop_id` → crops(crop_id)
    - Attributes: scheduled_time, duration_minutes, water_amount_liters, status

15. **notification_logs** (Notification history)
    - Primary Key: `log_id` (UUID)
    - Foreign Keys: `user_id` → users(user_id)
    - Attributes: notification_type, channel, subject, status, sent_at

**Complete Schema:** See `DatabaseSchema_PostgreSQL.md`

#### 4.1.2 Relationships

- One-to-Many: users → farms, farms → crops, farms → sensors, farms → tasks
- Many-to-Many: orders ↔ products (through order_items)
- Self-referencing: users can reference users (consultant assignments)

### 4.2 InfluxDB - Time-Series Database

**Purpose:** High-frequency sensor data storage and querying

**Organization:** Bucket-based with retention policies

**Measurement:** `sensor_readings`

**Schema:**
```
sensor_readings
├── tags (indexed)
│   ├── sensor_id (UUID reference)
│   ├── farm_id (UUID reference)
│   ├── sensor_type (soil_moisture, ph, temperature, humidity, light)
│   └── location (field identifier)
├── fields
│   ├── value (float)
│   ├── battery_level (float, percentage)
│   └── signal_strength (int, dBm)
└── timestamp (nanosecond precision)
```

**Retention Policies:**
- Raw data: 2 years
- Hourly aggregates: 5 years
- Daily aggregates: 10 years

**Down-sampling Tasks:**
- Hourly: AVG, MIN, MAX, STDDEV
- Daily: AVG, MIN, MAX, COUNT

**Query Examples:**
```flux
// Get last 24 hours of soil moisture for a farm
from(bucket: "sufms_sensors")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["farm_id"] == "farm-uuid")
  |> filter(fn: (r) => r["sensor_type"] == "soil_moisture")
  |> aggregateWindow(every: 1h, fn: mean)
```

**Complete Schema:** See `DatabaseSchema_InfluxDB.md`

### 4.3 Redis - In-Memory Cache & Queue

**Purpose:** Session storage, caching, real-time pub/sub, job queues

**Data Structures:**

#### 4.3.1 Session Management
```redis
# Key pattern: session:<user_id>
HSET session:uuid email user@example.com user_type Farmer
EXPIRE session:uuid 86400
```

#### 4.3.2 Caching
```redis
# User profiles (1 hour TTL)
SET cache:user:uuid '{"name":"..."}' EX 3600

# Product catalog (15 minutes TTL)
SET cache:products:page:1 '[{...}]' EX 900

# Sensor latest readings (5 minutes TTL)
SET cache:sensor:uuid:latest '{"value":45.2}' EX 300
```

#### 4.3.3 Rate Limiting
```redis
INCR ratelimit:api:uuid:/products:timestamp
EXPIRE ratelimit:api:uuid:/products:timestamp 60
```

#### 4.3.4 Job Queues
```redis
# Email queue
LPUSH queue:notifications:email '{"to":"...","subject":"..."}'

# Worker consumes
BRPOP queue:notifications:email 0
```

#### 4.3.5 Pub/Sub (Real-time Updates)
```redis
# Publish sensor update
PUBLISH channel:sensor:uuid:updates '{"value":45.2,"timestamp":"..."}'

# Subscribe to farm alerts
SUBSCRIBE channel:farm:uuid:alerts
```

#### 4.3.6 Geospatial Indexes
```redis
# Add farm location
GEOADD farms:locations -73.935242 40.730610 farm-uuid

# Find nearby farms (5km radius)
GEORADIUS farms:locations -73.935242 40.730610 5 km
```

**Complete Schema:** See `DatabaseSchema_Redis.md`

### 4.4 AWS S3 - Object Storage

**Bucket Structure:**
```
s3://sufms-storage/
├── farm-images/
│   └── {farm_id}/
│       └── {image_id}.jpg
├── product-images/
│   └── {product_id}/
│       └── {image_id}.jpg
├── pest-detection/
│   └── {farm_id}/
│       └── {detection_id}.jpg
├── profile-pictures/
│   └── {user_id}.jpg
└── reports/
    └── {user_id}/
        └── {report_id}.pdf
```

**Access Control:**
- Private bucket with IAM role-based access
- Pre-signed URLs for temporary public access (15 minutes)
- CloudFront CDN for image delivery

### 4.5 Data Consistency & Integrity

**Strategies:**
- **ACID Transactions:** PostgreSQL for critical operations (orders, payments)
- **Eventual Consistency:** Microservices with event-driven updates
- **Data Validation:** Input validation at API gateway and service layers
- **Referential Integrity:** Foreign key constraints in PostgreSQL
- **Data Deduplication:** Unique constraints on email, sensor_id, etc.
- **Backup & Recovery:**
  - PostgreSQL: Automated daily backups (7-day retention)
  - InfluxDB: Daily snapshots to S3
  - Redis: RDB snapshots every 6 hours + AOF for durability

---

## 5. Hardware Design

The IoT hardware architecture enables real-time environmental monitoring across distributed farm locations.

### 5.1 Hardware Components

#### 5.1.1 Sensor Layer

**Soil Moisture Sensor (Capacitive)**
- Model: DFRobot SEN0193 or equivalent
- Measurement Range: 0-100% volumetric water content
- Accuracy: ±3%
- Interface: Analog (0-3V)
- Cost: ~$8 per unit

**pH Sensor**
- Model: DFRobot SEN0161 or equivalent
- Measurement Range: pH 0-14
- Accuracy: ±0.1 pH
- Interface: Analog (0-3V)
- Cost: ~$30 per unit

**Temperature & Humidity Sensor**
- Model: DHT22 / AM2302
- Temperature Range: -40°C to 80°C (±0.5°C)
- Humidity Range: 0-100% RH (±2%)
- Interface: Digital (1-wire)
- Cost: ~$10 per unit

**Light Sensor (LDR)**
- Model: Photoresistor GL5528
- Resistance Range: 10-20 kΩ (10 lux) to 200 kΩ (dark)
- Interface: Analog (voltage divider)
- Cost: ~$2 per unit

**NPK Sensor (Optional)**
- Model: RS485 Soil NPK Sensor
- Measures: Nitrogen, Phosphorus, Potassium
- Interface: RS485 (Modbus)
- Cost: ~$80 per unit

#### 5.1.2 Microcontroller Layer

**Arduino Uno R3**
- Purpose: Analog sensor reading and ADC conversion
- MCU: ATmega328P
- Operating Voltage: 5V
- Analog Inputs: 6 channels (10-bit ADC)
- Interface to Gateway: I2C or SPI
- Cost: ~$25 per unit

**Firmware Responsibilities:**
- Read analog sensors every 10 seconds
- Convert ADC values to physical units (%, pH, °C, lux)
- Send data to Raspberry Pi via I2C
- Low-power sleep mode between readings

#### 5.1.3 Gateway Layer

**Raspberry Pi 4 Model B (4GB RAM)**
- Purpose: IoT gateway and MQTT client
- OS: Raspbian OS Lite (headless)
- Connectivity: Wi-Fi 802.11ac, Ethernet, 4G LTE (via USB dongle)
- Power: 5V 3A USB-C
- Storage: 32GB microSD card
- Cost: ~$55 per unit

**Software Stack:**
- Python 3.9+
- Paho MQTT client library
- I2C communication library (smbus2)
- System monitoring (CPU temp, uptime)

**Gateway Responsibilities:**
- Collect data from Arduino via I2C
- Publish data to AWS IoT Core via MQTT
- Local data buffering (if connectivity lost)
- Remote firmware updates (OTA)
- Health monitoring and self-diagnostics

#### 5.1.4 Power Supply

**Option 1: Mains Power**
- 12V 2A AC adapter
- 12V to 5V buck converter for Raspberry Pi
- Cost: ~$15 per unit

**Option 2: Solar Power (Remote Farms)**
- 20W Solar Panel
- 12V 7Ah Lead-Acid Battery
- Solar Charge Controller (PWM)
- 12V to 5V buck converter
- Cost: ~$80 per unit
- Runtime: 3-5 days without sunlight

### 5.2 Network Architecture

**Data Flow:**
```
Sensors → Arduino → Raspberry Pi → MQTT (TLS) → AWS IoT Core → Sensor Ingestion Service → InfluxDB
```

**MQTT Configuration:**
- Protocol: MQTT 3.1.1 over TLS 1.3
- QoS Level: 1 (at least once delivery)
- Topic Structure: `sensors/{farm_id}/{sensor_id}/data`
- Message Format: JSON
  ```json
  {
    "sensor_id": "uuid",
    "sensor_type": "soil_moisture",
    "value": 45.2,
    "unit": "%",
    "battery_level": 87.5,
    "signal_strength": -65,
    "timestamp": "2025-11-09T14:32:10.123Z"
  }
  ```
- Publish Frequency: Every 5 minutes (configurable)

**Connectivity:**
- Primary: Wi-Fi (802.11ac)
- Fallback: 4G LTE (USB dongle)
- Local Buffering: Up to 1000 messages if offline

### 5.3 Hardware Deployment

**Per-Farm Gateway Configuration:**
- 1× Raspberry Pi 4 Gateway
- 1× Arduino Uno
- 4-6× Sensors (soil moisture, pH, DHT22, light)
- 1× Power Supply (mains or solar)
- Weatherproof enclosure (IP65 rated)

**Total Cost per Gateway:** ~$150-$230 (depending on power option and sensor count)

**Scalability:**
- Each gateway supports up to 10 sensors
- Large farms can deploy multiple gateways
- Gateway auto-registration via QR code provisioning

**Complete Hardware Design:** See `HardwareDesign_IoT.puml`

---

## 6. User Interface Design

The user interface is designed with a mobile-first, responsive approach, adhering to Material Design principles for consistency and usability.

### 6.1 Design Principles

- **Accessibility:** WCAG 2.1 AA compliance (color contrast, keyboard navigation, screen reader support)
- **Responsiveness:** Fluid layouts for desktop (1920px), tablet (768px), mobile (375px)
- **Consistency:** Unified color scheme, typography, and component library
- **Progressive Enhancement:** Core functionality works without JavaScript
- **Performance:** Lazy loading, code splitting, optimized images (WebP format)

### 6.2 Design System

**Color Palette:**
- Primary: #2E7D32 (Green 700) - Agricultural theme
- Secondary: #FF6F00 (Orange 900) - Call-to-action
- Success: #43A047 (Green 600)
- Warning: #FFA000 (Amber 700)
- Error: #D32F2F (Red 700)
- Background: #FAFAFA (Grey 50)
- Surface: #FFFFFF (White)

**Typography:**
- Font Family: Roboto, system-ui, sans-serif
- Headings: Roboto Medium (500)
- Body: Roboto Regular (400)
- Size Scale: 12px, 14px, 16px (base), 20px, 24px, 32px, 48px

**Spacing:**
- Base Unit: 8px
- Scale: 8px, 16px, 24px, 32px, 48px, 64px

### 6.3 UI Mockups

Eight comprehensive UI mockups have been designed covering all major user workflows:

#### 6.3.1 Mockup 1: Main Dashboard
**Purpose:** Landing page after login showing system overview

**Components:**
- [1] Top Navigation Bar (logo, search, notifications, profile menu)
- [2] Sidebar Navigation (Dashboard, Farms, Sensors, Marketplace, Analytics)
- [3] Welcome Section (personalized greeting, quick stats)
- [4] Stats Cards (Total Farms, Active Sensors, Pending Tasks, Revenue)
- [5] Active Alerts Panel (critical/warning/info alerts with severity badges)
- [6] Recent Tasks Widget (task list with status indicators)
- [7] Sensor Snapshot (quick view of latest sensor readings)
- [8] Quick Actions (Add Farm, Register Sensor, Create Task buttons)

**User Types:** All

**Complete Mockup:** See `UI_Mockups_1-4.md` (Mockup 1)

#### 6.3.2 Mockup 2: Sensor Monitoring
**Purpose:** Real-time monitoring of all farm sensors

**Components:**
- [1] Breadcrumb Navigation
- [2] Filters (Farm, Sensor Type, Date Range)
- [3] Sensor Cards Grid (4 sensors per row on desktop)
  - Sensor name and type
  - Current value with unit
  - Status indicator (online/offline)
  - Battery level
  - Last updated timestamp
- [4] Historical Data Chart (line chart, last 24h)
- [5] Threshold Configuration Button
- [6] Export Data Button (CSV/Excel)
- [7] Real-time Update Indicator (WebSocket status)

**User Types:** Farmer, Gardener, Consultant

**Complete Mockup:** See `UI_Mockups_1-4.md` (Mockup 2)

#### 6.3.3 Mockup 3: Pest Detection
**Purpose:** AI-powered pest identification and treatment

**Components:**
- [1] Image Upload Area (drag & drop or click to browse)
- [2] Camera Capture Button (mobile only)
- [3] Upload Progress Bar
- [4] AI Analysis Status (processing animation)
- [5] Detection Results Card
  - Pest type identified
  - Confidence score (%)
  - Affected crop area estimate
- [6] Treatment Recommendations Panel
  - Organic treatment options
  - Chemical treatment options
  - Preventive measures
- [7] Save to History Button
- [8] Detection History List (previous detections)

**User Types:** Farmer, Gardener, Consultant

**Complete Mockup:** See `UI_Mockups_1-4.md` (Mockup 3)

#### 6.3.4 Mockup 4: Marketplace Search
**Purpose:** Browse and search agricultural products

**Components:**
- [1] Search Bar (keyword search)
- [2] Filters Sidebar
  - Category (Vegetables, Fruits, Grains, etc.)
  - Price Range (slider)
  - Location (radius from user)
  - Organic/Conventional toggle
  - Seller Rating (star filter)
- [3] Sort Dropdown (Relevance, Price, Distance, Rating)
- [4] Product Cards Grid (3 per row on desktop)
  - Product image
  - Product name
  - Price per unit
  - Seller name and rating
  - Distance from buyer
  - Add to Cart button
- [5] Pagination (pages 1-10)
- [6] Results Count
- [7] Map View Toggle

**User Types:** Consumer, Restaurant, All

**Complete Mockup:** See `UI_Mockups_1-4.md` (Mockup 4)

#### 6.3.5 Mockup 5: Product Details & Purchase
**Purpose:** Detailed product view and purchase initiation

**Components:**
- [1] Product Image Gallery (main image + thumbnails)
- [2] Product Title and Category
- [3] Price and Unit
- [4] Seller Information Card (name, rating, farm location)
- [5] Product Description
- [6] Quantity Selector (with stock availability)
- [7] Delivery Options (Pickup, Standard, Express)
- [8] Add to Cart Button
- [9] Buy Now Button (direct checkout)
- [10] Organic Certification Badge
- [11] Product Specifications (harvest date, shelf life)
- [12] Customer Reviews Section
  - Average rating (stars)
  - Individual reviews with ratings, comments, dates
  - Pagination for reviews
- [13] Related Products Carousel

**User Types:** Consumer, Restaurant, All

**Complete Mockup:** See `UI_Mockups_5-8.md` (Mockup 5)

#### 6.3.6 Mockup 6: Checkout & Payment
**Purpose:** Complete purchase with payment processing

**Components:**
- [1] Multi-Step Progress Indicator (Cart → Delivery → Payment → Confirmation)
- [2] Order Summary Card
  - Line items (product, quantity, price)
  - Subtotal
  - Delivery fee
  - Total amount
- [3] Delivery Address Form
  - Address autocomplete
  - Save address checkbox
- [4] Delivery Date Selection
- [5] Payment Method Selection (Credit Card, Debit Card, Digital Wallet)
- [6] Stripe Payment Form
  - Card number (masked)
  - Expiry date
  - CVC
  - Cardholder name
  - Save card checkbox
- [7] Order Notes (optional)
- [8] Terms & Conditions Checkbox
- [9] Place Order Button
- [10] Secure Payment Badge (PCI-DSS, SSL)
- [11] Back Button (return to cart)

**User Types:** Consumer, Restaurant

**Complete Mockup:** See `UI_Mockups_5-8.md` (Mockup 6)

#### 6.3.7 Mockup 7: Farm & Crop Management
**Purpose:** Manage farm details, crops, and planting schedule

**Components:**
- [1] Farm Selector Dropdown (for users with multiple farms)
- [2] Farm Details Panel
  - Farm name, size, location
  - Farm type (Indoor/Outdoor)
  - Edit Farm Button
- [3] Planting Calendar (Gantt-style)
  - Timeline (months)
  - Crop rows with planting/harvesting bars
  - Color-coded by crop status (planted, growing, harvesting, harvested)
  - Drag & drop to reschedule
- [4] Crop Cards Grid
  - Crop name and variety
  - Planting date
  - Expected harvest date
  - Growth stage (seedling, vegetative, flowering, fruiting)
  - Health status indicator
  - View Details button
- [5] Add New Crop Button
- [6] Tasks Widget
  - Today's tasks
  - Overdue tasks
  - Task completion checkbox
- [7] Crop Rotation Suggestions (AI-powered)

**User Types:** Farmer, Gardener

**Complete Mockup:** See `UI_Mockups_5-8.md` (Mockup 7)

#### 6.3.8 Mockup 8: Analytics & Reports Dashboard
**Purpose:** Data visualization and business intelligence

**Components:**
- [1] Date Range Selector (Last 7 days, 30 days, 90 days, Custom)
- [2] Key Metrics Cards
  - Total Revenue (with % change)
  - Total Yield (kg)
  - Average Crop Health Score
  - Customer Satisfaction (avg rating)
- [3] Revenue Chart (line chart, monthly trend)
- [4] Yield by Crop Type (bar chart)
- [5] Sensor Trends (multi-line chart: soil moisture, temp, humidity)
- [6] Resource Usage Chart (water, fertilizer consumption)
- [7] Top Selling Products Table (product, quantity sold, revenue)
- [8] Sales by Region (map visualization)
- [9] Sustainability Metrics
  - Water efficiency (L/kg yield)
  - Carbon footprint estimate
  - Organic percentage
- [10] Export Report Button (PDF/Excel)
- [11] Schedule Report Button (automated email reports)

**User Types:** Farmer, Restaurant (sales analytics), Admin

**Complete Mockup:** See `UI_Mockups_5-8.md` (Mockup 8)

### 6.4 Responsive Design Considerations

**Desktop (≥1200px):**
- Sidebar navigation (fixed)
- Multi-column layouts (3-4 columns)
- Expanded charts and data visualizations

**Tablet (768px - 1199px):**
- Collapsible sidebar navigation
- 2-column layouts
- Simplified charts (smaller canvas)

**Mobile (≤767px):**
- Bottom navigation bar
- Single-column layouts
- Stacked components
- Touch-optimized controls (larger buttons, swipe gestures)
- Progressive disclosure (accordion menus)

### 6.5 Accessibility Features

- **Keyboard Navigation:** Full keyboard support (Tab, Arrow keys, Enter, Esc)
- **Screen Reader Support:** Semantic HTML, ARIA labels, alt text for images
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** Visible focus outlines (2px solid)
- **Error Handling:** Clear error messages with recovery suggestions
- **Loading States:** Skeleton screens and progress indicators

---

## 7. Deployment Architecture

The system is deployed on AWS using a cloud-native, containerized approach for scalability and reliability.

### 7.1 Infrastructure Overview

**Cloud Provider:** Amazon Web Services (AWS)
**Region:** us-east-1 (primary), us-west-2 (disaster recovery)
**Deployment Strategy:** Blue-Green deployments for zero downtime
**Infrastructure as Code:** Terraform for reproducible infrastructure

### 7.2 Deployment Layers

The complete deployment architecture is documented in `DeploymentDiagram.puml`, covering:

#### 7.2.1 Client Devices
- **User Desktop/Laptop:** Web browser running React.js SPA (static files served from CloudFront CDN)
- **Mobile Devices (iOS/Android):** React Native apps installed from App Store/Play Store

#### 7.2.2 Load Balancing & CDN
- **Application Load Balancer (ALB):**
  - SSL/TLS termination (ACM certificates)
  - HTTP to HTTPS redirect
  - Health checks every 30 seconds
  - Sticky sessions for WebSocket connections
  - Cross-zone load balancing

- **CloudFront CDN:**
  - Static asset delivery (JS, CSS, images)
  - Edge locations for low-latency access
  - Automatic compression (Gzip, Brotli)

#### 7.2.3 API Gateway Tier
- **2× EC2 Instances (t3.medium):**
  - Docker containers running Express.js
  - IP addresses: 10.0.1.10, 10.0.1.11
  - Auto-scaling group (2-6 instances based on CPU >70%)
  - Health endpoint: `GET /health`

#### 7.2.4 Microservices Tier (Kubernetes EKS)
- **Kubernetes Cluster:** Managed EKS cluster (v1.28)
- **5× Worker Nodes (t3.large - t3.xlarge):**

  **Worker Node 1 (10.0.2.10):** Core Services
  - Auth Service (Port 3001)
  - User Service (Port 3002)
  - Farm Service (Port 3003)

  **Worker Node 2 (10.0.2.11):** IoT Services
  - Sensor Service (Port 3004)
  - Alert Service (Port 3005)
  - Threshold Service (Port 3006)

  **Worker Node 3 (10.0.2.12):** Marketplace Services
  - Marketplace Service (Port 3007)
  - Order Service (Port 3008)
  - Payment Service (Port 3009)

  **Worker Node 4 (10.0.2.13):** AI/ML Services
  - Pest Detection (Port 3010) - TensorFlow container
  - Crop Recommendation (Port 3011) - TensorFlow container
  - AI Chatbot (Port 3012)

  **Worker Node 5 (10.0.2.14):** Notification Services
  - Email Worker (Port 3013)
  - SMS Worker (Port 3014)
  - Push Notification Worker (Port 3015)

- **Kubernetes Configuration:**
  - Horizontal Pod Autoscaler (HPA): 2-10 pods per service
  - Resource Limits: CPU (500m-2000m), Memory (512Mi-4Gi)
  - Rolling updates with maxUnavailable: 1, maxSurge: 1
  - ConfigMaps for environment variables
  - Secrets for API keys and credentials
  - Ingress controller (NGINX)

#### 7.2.5 Database Tier

**PostgreSQL (Amazon RDS):**
- Instance: db.t3.large (2 vCPU, 8GB RAM)
- Primary: 10.0.3.10
- Read Replica: 10.0.3.11 (for read-heavy queries)
- Multi-AZ deployment for high availability
- Automated backups (7-day retention)
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Performance Insights enabled

**InfluxDB:**
- EC2 Instance: t3.large (10.0.3.20)
- Docker container
- Storage: 500GB EBS SSD (gp3)
- Automated daily backups to S3
- Retention: 2 years (raw), 10 years (aggregated)

**Redis (Amazon ElastiCache):**
- Cluster: 10.0.3.30
- 3 nodes (1 primary, 2 replicas)
- Instance type: cache.t3.medium
- Automatic failover enabled
- Cluster mode disabled (single shard)
- Encryption in transit enabled

**AWS S3:**
- Bucket: `sufms-storage`
- Versioning enabled
- Lifecycle policies (move to Glacier after 365 days)
- Server-side encryption (SSE-S3)
- CORS configuration for direct uploads
- CloudFront distribution for public assets

#### 7.2.6 IoT Infrastructure

**AWS IoT Core:**
- Managed MQTT broker (automatic scaling)
- Thing registry for device management
- Device certificates (X.509) for authentication
- IoT Rules Engine for message routing
- Integration with Lambda for data processing

**On-Premise Gateways:**
- Raspberry Pi 4 devices at farm locations
- MQTT over TLS (port 8883) to AWS IoT Core
- 4G LTE fallback connectivity
- Local data buffering (SQLite)
- Remote monitoring and OTA updates

#### 7.2.7 Monitoring & Logging

**Prometheus + Grafana (EC2 t3.medium, 10.0.4.10):**
- Prometheus scrapes metrics every 15 seconds
- Retention: 15 days
- Grafana dashboards:
  - System health (CPU, memory, network)
  - API latency and throughput
  - Database performance
  - Business metrics (orders, revenue)

**ELK Stack (EC2 t3.large, 10.0.4.20):**
- Elasticsearch: Log storage and indexing
- Logstash: Log parsing and enrichment
- Kibana: Log search and visualization
- Retention: 30 days
- Indexes: API logs, application logs, error logs

### 7.3 Network Architecture

**VPC Configuration:**
- CIDR: 10.0.0.0/16
- Subnets:
  - Public Subnets: 10.0.1.0/24, 10.0.2.0/24 (ALB, NAT Gateway)
  - Private Subnets: 10.0.3.0/24, 10.0.4.0/24 (EC2, RDS)
  - Data Subnets: 10.0.5.0/24, 10.0.6.0/24 (Databases)
- Internet Gateway for public access
- NAT Gateway for private instances
- VPC Peering for multi-region DR

**Security Groups:**
- ALB: Allow inbound 443 (HTTPS) from 0.0.0.0/0
- API Gateway: Allow inbound 4000 from ALB security group
- Microservices: Allow inbound 3001-3015 from API Gateway SG
- RDS PostgreSQL: Allow inbound 5432 from microservices SG
- Redis: Allow inbound 6379 from microservices SG

### 7.4 CI/CD Pipeline

**Version Control:** GitHub
**CI/CD Platform:** GitHub Actions

**Pipeline Stages:**
1. **Build:**
   - Lint code (ESLint, Prettier)
   - Run unit tests (Jest)
   - Build Docker images
   - Tag with commit SHA

2. **Test:**
   - Integration tests (Supertest)
   - Security scans (Snyk, Trivy)
   - Load tests (k6)

3. **Deploy to Staging:**
   - Push images to Amazon ECR
   - Deploy to staging EKS cluster
   - Run smoke tests

4. **Deploy to Production:**
   - Manual approval required
   - Blue-Green deployment
   - Health checks
   - Rollback on failure

**Secrets Management:** AWS Secrets Manager for API keys, database credentials

### 7.5 Disaster Recovery

**RTO (Recovery Time Objective):** 4 hours
**RPO (Recovery Point Objective):** 1 hour

**Backup Strategy:**
- PostgreSQL: Automated daily snapshots + continuous archiving (WAL)
- InfluxDB: Daily snapshots to S3
- Redis: RDB snapshots every 6 hours + AOF
- S3: Cross-region replication to us-west-2

**Failover Plan:**
- Active-Passive setup in us-west-2
- Route 53 health checks for automatic DNS failover
- Automated scripts for database restore and application deployment

---

## 8. Security Design

Security is implemented at every layer of the architecture, adhering to the principle of defense in depth.

### 8.1 Authentication & Authorization

**Authentication Mechanisms:**
- **Email/Password:** bcrypt hashing (cost factor: 12)
- **OAuth 2.0:** Google, Facebook integration
- **JWT Tokens:**
  - Access Token: 15 minutes expiry
  - Refresh Token: 7 days expiry (stored in httpOnly cookie)
  - HS256 algorithm with 256-bit secret
  - Claims: user_id, email, user_type, roles

**Authorization:**
- **Role-Based Access Control (RBAC):**
  - Roles: Admin, Farmer, Gardener, Consultant, Consumer, Restaurant
  - Permissions mapped to API endpoints
  - Middleware validation on every protected route

- **Resource Ownership:**
  - Users can only access/modify their own resources
  - Farm owners can delegate access to consultants
  - Order access restricted to buyer and seller

### 8.2 Data Security

**Encryption at Rest:**
- PostgreSQL: AWS RDS encryption (AES-256)
- InfluxDB: Encrypted EBS volumes
- Redis: ElastiCache encryption
- S3: Server-side encryption (SSE-S3)

**Encryption in Transit:**
- HTTPS/TLS 1.3 for all client-server communication
- TLS 1.3 for database connections
- MQTT over TLS for IoT devices
- Certificate pinning in mobile apps

**Sensitive Data Handling:**
- Passwords: Never logged, never returned in API responses
- Payment Information: PCI-DSS Level 1 compliance via Stripe (no card data stored)
- Personal Data: GDPR compliance (data minimization, right to erasure)
- API Keys: Stored in AWS Secrets Manager, rotated every 90 days

### 8.3 Application Security

**Input Validation:**
- Server-side validation on all inputs
- Parameterized queries (SQL injection prevention)
- Input sanitization (XSS prevention)
- File upload restrictions (type, size validation)

**API Security:**
- Rate Limiting: 100 requests/minute per user (Redis-based)
- CORS: Whitelist of allowed origins
- API Versioning: /v1/, /v2/ for backward compatibility
- Request size limits: 10MB max payload

**Vulnerability Management:**
- Automated dependency scanning (Snyk, Dependabot)
- Container image scanning (Trivy)
- Regular penetration testing (quarterly)
- Bug bounty program

### 8.4 Infrastructure Security

**Network Security:**
- Private subnets for databases and microservices
- Security groups (least privilege)
- Network ACLs for subnet-level filtering
- AWS Shield for DDoS protection

**Access Control:**
- IAM roles for EC2 instances (no hardcoded credentials)
- Multi-factor authentication (MFA) for AWS Console access
- Principle of least privilege for all IAM policies
- Regular access audits (monthly)

**Logging & Monitoring:**
- CloudTrail for AWS API logging
- GuardDuty for threat detection
- Security Hub for compliance monitoring
- Alerts for suspicious activity (failed logins, privilege escalation)

### 8.5 Compliance

- **GDPR:** Data protection, consent management, right to erasure
- **PCI-DSS:** Payment data security (via Stripe)
- **SOC 2:** Security controls and audit logging
- **ISO 27001:** Information security management (target certification)

---

## 9. Performance Considerations

### 9.1 Performance Requirements (from NFR)

- **Response Time:** API responses < 2 seconds (95th percentile)
- **Throughput:** Support 10,000 concurrent users
- **Availability:** 99.9% uptime (43 minutes downtime/month)
- **Scalability:** Horizontal scaling to handle 10× traffic

### 9.2 Optimization Strategies

**Frontend:**
- Code splitting and lazy loading (React.lazy)
- Image optimization (WebP, responsive images)
- CDN for static assets (CloudFront)
- Service Worker for offline support
- Virtual scrolling for long lists (react-window)

**Backend:**
- Database query optimization (indexes, query analysis)
- Caching strategy:
  - Redis for frequently accessed data (user profiles, product catalog)
  - TTL-based invalidation
  - Cache-aside pattern
- Connection pooling (PostgreSQL: 20-100 connections per service)
- Asynchronous processing (Redis queues for notifications, reports)

**Database:**
- Read replicas for read-heavy workloads (product search, analytics)
- Partitioning for large tables (sensor_readings by time)
- Down-sampling for historical data (InfluxDB)
- Materialized views for complex aggregations

**Microservices:**
- Horizontal pod autoscaling (2-10 replicas based on CPU/memory)
- Resource limits to prevent noisy neighbor issues
- Circuit breakers for external API calls (prevent cascade failures)
- Request timeouts (5 seconds for API calls, 30 seconds for ML inference)

### 9.3 Load Testing

**Tools:** k6, Artillery
**Scenarios:**
- Normal load: 1,000 concurrent users
- Peak load: 5,000 concurrent users
- Stress test: 10,000+ concurrent users

**Target Metrics:**
- P50 latency: < 500ms
- P95 latency: < 2000ms
- P99 latency: < 5000ms
- Error rate: < 0.1%

---

## 10. Traceability Matrix

This matrix maps Phase 4 design components to Phase 2 requirements and Phase 3 analysis artifacts.

| Requirement ID | Requirement | Phase 3 Artifact | Phase 4 Design Component |
|----------------|-------------|------------------|--------------------------|
| FR-001 | User Registration | UC-001, Class: UserBoundary | Authentication Service, PostgreSQL (users table) |
| FR-002 | User Login | UC-002, Class: AuthenticationControl | Authentication Service, JWT tokens, Redis (sessions) |
| FR-003 | Farm Registration | Use Case Diagram, Class: FarmBoundary | Farm Service, PostgreSQL (farms table) |
| FR-009 | Monitor Sensor Data | UC-009 (detailed), Activity Diagram, Sequence Diagram | Sensor Ingestion Service, InfluxDB, MQTT Broker, IoT Hardware |
| FR-010 | Set Thresholds | UC-009, Class: ThresholdControl | Threshold Manager, PostgreSQL (thresholds table) |
| FR-011 | Receive Alerts | UC-009, Class: AlertEntity | Alert Service, Notification Subsystem, Redis Queue |
| FR-013 | Register Sensors | Class: SensorRegistryControl | Sensor Registry, PostgreSQL (sensors table), IoT Gateway |
| FR-017 | Pest Detection | UC-017 (detailed), Activity Diagram, Sequence Diagram | Pest Detection Engine, TensorFlow, S3 (image storage) |
| FR-018 | Treatment Recommendations | UC-017, Class: TreatmentRecommendationEntity | Pest Detection Service, PostgreSQL (pest_detection_records) |
| FR-019 | Crop Recommendations | Class: CropRecommendationControl | Crop Recommendation Engine, ML Models |
| FR-020 | Irrigation Scheduling | Class: IrrigationControl | Irrigation Optimizer, PostgreSQL (irrigation_schedules) |
| FR-021 | AI Chatbot | Class: ChatbotBoundary | AI Chatbot Service, OpenAI API |
| FR-025 | Browse Products | UC-025 (detailed), Class: ProductCatalogBoundary | Product Service, Search Service, UI Mockup 4 |
| FR-026 | Search & Filter | UC-025, Activity Diagram | Search & Filter Service, Redis Cache, UI Mockup 4 |
| FR-027 | View Product Details | UC-025, Class: ProductEntity | Product Service, UI Mockup 5 |
| FR-028 | Add to Cart | UC-025, Sequence Diagram | Order Service (cart management), Redis Cache |
| FR-029 | Checkout & Payment | UC-025, Sequence Diagram | Order Service, Payment Service, Stripe API, UI Mockup 6 |
| FR-030 | Process Payment | UC-025, Class: PaymentControl | Payment Service, Stripe Adapter, PostgreSQL (payments table) |
| FR-031 | Order Tracking | Class: OrderEntity | Order Service, PostgreSQL (orders table) |
| FR-032 | Product Reviews | Class: ReviewBoundary | Review Service, PostgreSQL (reviews table), UI Mockup 5 |
| FR-033 | Email Notifications | Sequence Diagrams (all 3) | Email Notification Service, SendGrid, Redis Queue |
| FR-034 | SMS Notifications | Class: NotificationControl | SMS Notification Service, Twilio |
| FR-035 | Push Notifications | Class: NotificationControl | Push Notification Service, FCM |
| FR-036 | Generate Reports | Class: ReportBoundary | Report Generator, PostgreSQL, InfluxDB, UI Mockup 8 |
| FR-037 | View Analytics | Class: DashboardBoundary | Analytics Engine, Dashboard Service, UI Mockup 8 |
| NFR-001 | Response Time < 2s | Performance analysis | Redis Caching, CDN, Database Indexing, Load Balancer |
| NFR-002 | 99.9% Availability | Reliability requirements | Multi-AZ RDS, EKS Auto-scaling, Health Checks, Load Balancer |
| NFR-003 | 10,000 Concurrent Users | Scalability requirements | Kubernetes HPA, Multiple Worker Nodes, Load Balancer |
| NFR-005 | Password Encryption | Security requirements | bcrypt (cost 12), Authentication Service |
| NFR-006 | Data Encryption | Security requirements | TLS 1.3, RDS Encryption (AES-256), S3 SSE |
| NFR-007 | Role-Based Access | Security requirements | Authorization Service, RBAC Middleware |
| NFR-011 | Mobile Responsive | Usability requirements | React Native App, Responsive UI (all mockups) |
| NFR-015 | PCI-DSS Compliance | Compliance requirements | Stripe Integration (no card storage), Payment Service |
| NFR-020 | Horizontal Scaling | Scalability requirements | Kubernetes EKS, Auto-scaling Groups, Microservices Architecture |
| NFR-025 | 30-Day Log Retention | Maintainability requirements | ELK Stack, Elasticsearch Retention Policy |

---

## 11. Conclusion

This Phase 4 document provides a comprehensive system design for the Smart Urban Farming Management System (SUFMS), covering:

✅ **Software Architecture:** 3-tier architecture with microservices pattern, ensuring scalability and maintainability
✅ **Subsystem Decomposition:** 9 clearly defined subsystems with well-documented interfaces and responsibilities
✅ **Data Design:** Polyglot persistence strategy across PostgreSQL, InfluxDB, Redis, and S3
✅ **Hardware Design:** IoT gateway architecture with Raspberry Pi and Arduino for real-time sensor monitoring
✅ **User Interface Design:** 8 comprehensive UI mockups covering all major user workflows
✅ **Deployment Architecture:** Cloud-native deployment on AWS with Kubernetes orchestration
✅ **Security Design:** Multi-layered security following defense-in-depth principles
✅ **Performance Optimization:** Caching, load balancing, and auto-scaling strategies
✅ **Traceability:** Complete mapping to Phase 2 requirements and Phase 3 analysis

The design is ready for Phase 5 (Implementation), where the team will develop the system following this architecture, ensuring all functional and non-functional requirements are met.

**Next Steps:**
1. Review and approval of system design by stakeholders
2. Environment setup (AWS infrastructure via Terraform)
3. Database schema implementation and migration scripts
4. Microservices development (Sprint 1-8)
5. IoT gateway deployment and testing
6. Integration testing and performance validation
7. User acceptance testing (UAT)
8. Production deployment

---

## 12. References

1. **AWS Documentation**
   Amazon Web Services. (2025). *AWS Architecture Center*. Retrieved from https://aws.amazon.com/architecture/

2. **Kubernetes Documentation**
   Cloud Native Computing Foundation. (2025). *Kubernetes Documentation*. Retrieved from https://kubernetes.io/docs/

3. **React.js Documentation**
   Meta Open Source. (2025). *React Documentation*. Retrieved from https://react.dev/

4. **PostgreSQL Documentation**
   PostgreSQL Global Development Group. (2025). *PostgreSQL 15 Documentation*. Retrieved from https://www.postgresql.org/docs/15/

5. **InfluxDB Documentation**
   InfluxData. (2025). *InfluxDB 2.x Documentation*. Retrieved from https://docs.influxdata.com/

6. **Redis Documentation**
   Redis Ltd. (2025). *Redis Documentation*. Retrieved from https://redis.io/documentation

7. **MQTT Protocol Specification**
   OASIS. (2019). *MQTT Version 5.0*. Retrieved from https://docs.oasis-open.org/mqtt/mqtt/v5.0/

8. **Stripe API Documentation**
   Stripe, Inc. (2025). *Stripe API Reference*. Retrieved from https://stripe.com/docs/api

9. **Material Design Guidelines**
   Google. (2025). *Material Design 3*. Retrieved from https://m3.material.io/

10. **OWASP Top 10**
    OWASP Foundation. (2021). *OWASP Top Ten Web Application Security Risks*. Retrieved from https://owasp.org/www-project-top-ten/

11. **GDPR Compliance**
    European Commission. (2018). *General Data Protection Regulation*. Retrieved from https://gdpr.eu/

12. **PCI-DSS Standards**
    PCI Security Standards Council. (2022). *Payment Card Industry Data Security Standard v4.0*. Retrieved from https://www.pcisecuritystandards.org/

13. **Fowler, M.** (2018). *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional.

14. **Newman, S.** (2021). *Building Microservices: Designing Fine-Grained Systems* (2nd ed.). O'Reilly Media.

15. **Phase 1: Project Proposal** (Internal Document)
    Mail, A., Ahmed, S., Hassan, M. (2025). *SUFMS Project Proposal*. SWE 401 Course Project.

16. **Phase 2: Requirements Engineering** (Internal Document)
    Mail, A., Ahmed, S., Hassan, M. (2025). *SUFMS Requirements Engineering*. SWE 401 Course Project.

17. **Phase 3: System Analysis** (Internal Document)
    Mail, A., Ahmed, S., Hassan, M. (2025). *SUFMS System Analysis Diagrams*. SWE 401 Course Project.

---

**Document Version:** 1.0
**Last Updated:** November 9, 2025
**Authors:** Aniss Mail, Sarah Ahmed, Mohammed Hassan
**Course Instructor:** [Instructor Name]
**Institution:** [University Name]

---

*This document is part of the SWE 401 Software Engineering course project. All diagrams referenced in this document are provided as separate PlantUML (.puml) and Markdown (.md) files in the `docs/phase4/` directory.*
