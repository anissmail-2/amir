# COLLEGE OF ENGINEERING
## SWE 401: SOFTWARE ENGINEERING
## COURSE PROJECT - PHASE 3
## SYSTEM ANALYSIS DIAGRAMS

---

**Course:** SWE 401 - Software Engineering
**Semester:** Fall 2025
**Instructor:** Dr. Murad Al-Rajab
**Submission Date:** November 2, 2025

**Team Members:**
- Student 1: [ID: XXXXX] - Full Stack Developer
- Student 2: [ID: XXXXX] - Backend Developer & Database Specialist
- Student 3: [ID: XXXXX] - UI/UX Designer & AI Integration Specialist

**Project Title:** Smart Urban Farming Management System (SUFMS)

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Activity Diagrams](#2-activity-diagrams)
   - 2.1 Monitor Real-Time Sensor Data
   - 2.2 Detect Pest/Disease from Photo
   - 2.3 Purchase Product from Marketplace
3. [Class Diagram](#3-class-diagram)
   - 3.1 Entity Classes
   - 3.2 Boundary Classes
   - 3.3 Control Classes
   - 3.4 Relationships and Multiplicities
4. [Sequence Diagrams](#4-sequence-diagrams)
   - 4.1 Monitor Real-Time Sensor Data
   - 4.2 Detect Pest/Disease from Photo
   - 4.3 Purchase Product from Marketplace
5. [Analysis Summary](#5-analysis-summary)

---

## 1. INTRODUCTION

This document presents the **System Analysis Models** for the Smart Urban Farming Management System (SUFMS) as required for Phase 3 of the SWE 401 course project. Building upon the requirements engineering completed in Phase 2, this phase focuses on creating UML diagrams that model the system's dynamic behavior and static structure.

### 1.1 Purpose

The purpose of this phase is to:
- Model key system workflows using **Activity Diagrams**
- Define the system's object-oriented structure using a comprehensive **Class Diagram**
- Illustrate object interactions and message flows using **Sequence Diagrams**
- Bridge the gap between requirements (Phase 2) and design (Phase 4)

### 1.2 Scope

This analysis phase covers:
- **3 Activity Diagrams** representing critical use cases identified in Phase 2
- **1 Comprehensive Class Diagram** showing entity, boundary, and control classes
- **3 Sequence Diagrams** demonstrating object collaborations for the same use cases

### 1.3 Methodology

The analysis models are based on:
- **Use Cases** documented in Phase 2 (UC-009, UC-017, UC-025)
- **Functional Requirements** (FR-001 through FR-037)
- **Non-Functional Requirements** (NFR-001 through NFR-032)
- **Stakeholder input** from requirements elicitation

All diagrams follow **UML 2.5 standards** and are created using PlantUML notation.

---

## 2. ACTIVITY DIAGRAMS

Activity diagrams model the workflows and decision points within key system processes. We have selected three critical use cases that represent core functionalities of SUFMS:

1. **Monitor Real-Time Sensor Data** (UC-009) - IoT monitoring workflow
2. **Detect Pest/Disease from Photo** (UC-017) - AI-powered analysis workflow
3. **Purchase Product from Marketplace** (UC-025) - E-commerce transaction workflow

---

### 2.1 Activity Diagram: Monitor Real-Time Sensor Data

**Use Case Reference:** UC-009
**Actors:** Urban Farmer, Home Gardener, IoT Sensor (external system)
**Description:** This workflow models how users monitor real-time sensor data from their farms, including data retrieval, threshold checking, alert generation, and historical data visualization.

#### Key Workflow Elements:

**1. User Actions:**
- Navigate to monitoring dashboard
- Select farm from dropdown
- View sensor readings
- Click on sensors for detailed charts
- Create tasks for critical conditions
- Troubleshoot offline sensors

**2. System Processing:**
- Query InfluxDB for latest sensor readings
- Retrieve sensor configurations and thresholds
- Calculate status (green/yellow/red) based on thresholds
- Generate alerts for violations
- Render historical trend charts
- Perform sensor diagnostics

**3. Decision Points:**
- Is sensor data available?
- Are thresholds exceeded?
- Is historical data sufficient?
- Is sensor online or offline?
- Does user want to create a task?

**4. Parallel Activities:**
- Displaying multiple sensor readings simultaneously (fork/join)
- Auto-refresh dashboard every 60 seconds

**5. Exception Handling:**
- No sensor data available → Prompt to register sensors
- Sensor offline → Display last known value + diagnostics
- Insufficient historical data → Show collection message
- Critical threshold exceeded → Highlight + recommend action

#### Workflow Highlights:

- **Real-time Updates:** Dashboard auto-refreshes via WebSocket every 60 seconds
- **Color Coding:** Green (optimal), Yellow (warning), Red (critical)
- **Multi-farm Support:** Users can switch between farms seamlessly
- **Proactive Alerts:** System recommends tasks for critical conditions (e.g., "Water plants")
- **Diagnostics:** Built-in sensor health checks and troubleshooting

**Diagram File:** `ActivityDiagram_MonitorSensorData.puml`

---

### 2.2 Activity Diagram: Detect Pest/Disease from Photo

**Use Case Reference:** UC-017
**Actors:** Urban Farmer, Home Gardener, AI/ML Service (external system)
**Description:** This workflow models the AI-powered pest and disease detection feature, from image capture through identification to treatment recommendations.

#### Key Workflow Elements:

**1. User Actions:**
- Navigate to pest detection feature
- Capture photo with smartphone camera OR upload existing photo
- Review identification results
- Choose whether to create treatment task
- Consent to save image for model improvement
- Decide on alternative actions (retake photo, post to forum)

**2. System Processing:**
- Validate image (format: JPG/PNG/HEIC, size <10MB, resolution ≥300x300px)
- Preprocess image (resize, normalize)
- Upload to cloud storage (AWS S3)
- Send to AI/ML service (TensorFlow)

**3. AI/ML Processing:**
- Load ResNet-50 CNN model
- Extract image features
- Run classification
- Generate top 3 predictions with confidence scores
- Return results

**4. Decision Points:**
- Is image format/size valid?
- Is ML service available?
- Is confidence score ≥70%?
- Does user want to create treatment task?
- Does user consent to save image?
- What alternative action (retake, forum, try later)?

**5. Result Branches:**

**High Confidence (≥70%):**
- Display primary identification (e.g., "Aphid Infestation - 92% confidence")
- Show pest details (appearance, lifecycle, damage pattern)
- Provide treatment recommendations (organic, chemical, preventive)
- Offer to create task in calendar
- Save detection record to farm history

**Low Confidence (<70%):**
- Display "Unable to confidently identify"
- Show top 3 possible matches
- Suggest actions: retake photo, post to forum, try later

**6. Exception Handling:**
- Invalid image → Error message + retry
- ML service unavailable → Queue for later processing + alternative options
- User can post to community forum for human expert review

#### Workflow Highlights:

- **Performance Target:** Image analysis <10 seconds
- **ML Model:** ResNet-50 architecture trained on 10,000+ images covering 50+ pests/diseases
- **Treatment Options:** Prioritizes organic methods for certified organic farms
- **User Consent:** Anonymized images stored only with user permission for model retraining
- **Fallback Options:** Community forum, queue for later processing
- **Task Integration:** Seamlessly creates treatment tasks from recommendations

**Diagram File:** `ActivityDiagram_PestDetection.puml`

---

### 2.3 Activity Diagram: Purchase Product from Marketplace

**Use Case Reference:** UC-025
**Actors:** Consumer/Buyer, Urban Farmer (seller), Payment Gateway (Stripe)
**Description:** This comprehensive workflow models the end-to-end e-commerce purchase process, from product search through payment processing to order confirmation.

#### Key Workflow Elements:

**1. Product Discovery:**
- Navigate to marketplace
- Search with keywords (e.g., "tomatoes")
- Apply filters (location: "within 5 miles", certifications, price range)
- Sort results (relevance, distance, rating, price)
- View product details (photos, description, farm profile, reviews)

**2. Shopping Cart:**
- Select quantity and delivery method
- Check inventory availability
- Add items to cart
- Review cart contents
- Calculate subtotal

**3. Checkout Process:**
- Proceed to checkout
- Enter delivery details (pickup date, phone number)
- Validate form inputs
- Calculate tax and total
- Select payment method

**4. Payment Processing:**
- Display Stripe payment form
- Enter card details (number, expiry, CVV)
- Validate payment inputs
- Create order (atomic transaction begins)
- Validate inventory (final stock check)
- Reserve inventory
- Process payment via Stripe
- Handle payment success/failure

**5. Order Completion:**
- Update order status to "Confirmed"
- Commit database transaction
- Send confirmation email to buyer
- Notify farmers of new orders
- Display order confirmation page
- Clear shopping cart
- Provide order tracking

**6. Critical Decision Points:**
- Are products found matching search?
- Is requested quantity available?
- Are form inputs valid?
- Are payment details valid?
- Is payment successful?
- Are items still in stock (race condition check)?

**7. Exception Handling:**

**No Products Found:**
- Suggest adjusting filters or browse all products

**Quantity Exceeds Stock:**
- Show error with maximum available quantity
- Allow user to adjust

**Product Sold Out During Checkout:**
- Detect inventory change
- Remove unavailable items
- Update cart and retry

**Form Validation Fails:**
- Highlight error fields in red
- Show specific error messages
- Allow user to correct

**Payment Declined:**
- Display error message
- Do NOT create order
- Release inventory reservation
- Rollback transaction
- Allow retry with different payment method

**Payment Service Unavailable:**
- Show error message
- Save cart for later
- Log error for admin review

#### Workflow Highlights:

- **Business Rules:**
  - Platform charges 10% commission on sales
  - Minimum order: $5
  - Farmers must confirm orders within 24 hours
  - Buyers can cancel before farmer confirmation

- **Security Measures:**
  - PCI-DSS compliant payment processing
  - Card details tokenized (never stored)
  - TLS 1.3 encryption for all transactions
  - Atomic database transactions prevent overselling

- **Performance:**
  - Search results within 2 seconds
  - Checkout process within 30 seconds
  - Real-time inventory validation

- **Notifications:**
  - Buyer: Order confirmation email with farmer contact info
  - Farmer: New order alert with buyer details
  - Status update notifications throughout fulfillment

**Diagram File:** `ActivityDiagram_PurchaseProduct.puml`

---

## 3. CLASS DIAGRAM

The Class Diagram provides a comprehensive object-oriented model of the SUFMS, organized into three categories following **Boundary-Control-Entity (BCE)** architectural pattern:

- **Entity Classes:** Domain objects representing core business data
- **Boundary Classes:** Interfaces between actors and the system (UI controllers, APIs)
- **Control Classes:** Business logic coordinators and service managers

---

### 3.1 Entity Classes

Entity classes represent the persistent business objects in the system.

#### **User** (Core Entity)
**Attributes:**
- `userId: UUID` (Primary Key)
- `email: String` (Unique)
- `passwordHash: String` (Encrypted)
- `firstName: String`
- `lastName: String`
- `userType: UserType` (Enum: Farmer, Gardener, Consultant, Consumer, Restaurant, Admin)
- `profilePhoto: String` (URL)
- `location: String`
- `createdAt: DateTime`
- `lastLogin: DateTime`
- `status: AccountStatus` (Enum: Active, Pending, Suspended)

**Operations:**
- `+ register(): boolean`
- `+ login(email: String, password: String): AuthToken`
- `+ updateProfile(data: ProfileData): boolean`
- `+ resetPassword(newPassword: String): boolean`
- `+ verifyEmail(token: String): boolean`

**Relationships:**
- 1 User owns 0..* Farms
- 1 User places 0..* Orders
- 1 User writes 0..* Reviews
- 1 User creates 0..* Tasks
- 1 User receives 0..* Alerts

---

#### **Farm** (Core Entity)
**Attributes:**
- `farmId: UUID`
- `userId: UUID` (Foreign Key)
- `name: String`
- `size: float` (in square meters)
- `location: GeoCoordinates` (latitude, longitude)
- `farmType: FarmType` (Enum: Indoor, Outdoor, Rooftop, Vertical)
- `description: String`
- `photos: List<String>`
- `createdAt: DateTime`

**Operations:**
- `+ create(): boolean`
- `+ update(data: FarmData): boolean`
- `+ delete(): boolean`
- `+ addPhoto(photoUrl: String): boolean`
- `+ getActiveSeasons(): List<Season>`

**Relationships:**
- 1 Farm contains 0..* Crops (Composition)
- 1 Farm has 0..* Sensors (Composition)
- 1 Farm lists 0..* Products
- 1 Farm records 0..* PestDetectionRecords
- 1 Farm has 0..* IrrigationSchedules

---

#### **Crop** (Entity)
**Attributes:**
- `cropId: UUID`
- `farmId: UUID`
- `cropType: String` (e.g., "Tomato", "Lettuce")
- `variety: String` (e.g., "Cherry Tomato")
- `plantingDate: Date`
- `expectedHarvestDate: Date`
- `actualHarvestDate: Date`
- `quantity: float`
- `status: CropStatus` (Enum: Planted, Growing, Harvested, Failed)

**Operations:**
- `+ plant(): boolean`
- `+ harvest(actualQuantity: float): boolean`
- `+ updateStatus(newStatus: CropStatus): boolean`
- `+ getDaysToHarvest(): int`
- `+ predictYield(): float`

**Relationships:**
- 1 Crop has 0..* IrrigationSchedules
- 1 Crop becomes 0..1 Product

---

#### **Sensor** (Entity)
**Attributes:**
- `sensorId: UUID`
- `farmId: UUID`
- `sensorType: SensorType` (Enum: SoilMoisture, pH, Temperature, Humidity, Light)
- `model: String`
- `installationDate: Date`
- `calibrationDate: Date`
- `status: SensorStatus` (Enum: Online, Offline, Error)
- `lastReading: DateTime`

**Operations:**
- `+ register(): boolean`
- `+ calibrate(): boolean`
- `+ updateStatus(status: SensorStatus): void`
- `+ getLatestReading(): SensorReading`
- `+ checkHealth(): SensorHealthStatus`

**Relationships:**
- 1 Sensor generates 0..* SensorReadings
- 1 Sensor configured with 1 Threshold
- 1 Sensor triggers 0..* Alerts

---

#### **SensorReading** (Entity)
**Attributes:**
- `readingId: UUID`
- `sensorId: UUID`
- `value: float`
- `timestamp: DateTime`
- `unit: String` (e.g., "%", "°C", "pH")

**Operations:**
- `+ store(): boolean`
- `+ validate(): boolean`
- `+ isOutlier(): boolean`

---

#### **Threshold** (Entity)
**Attributes:**
- `thresholdId: UUID`
- `sensorId: UUID`
- `cropType: String`
- `minValue: float`
- `maxValue: float`
- `alertEnabled: boolean`

**Operations:**
- `+ set(min: float, max: float): boolean`
- `+ isViolated(value: float): boolean`
- `+ getDefaultForCrop(cropType: String): Threshold`

---

#### **Alert** (Entity)
**Attributes:**
- `alertId: UUID`
- `sensorId: UUID`
- `farmId: UUID`
- `userId: UUID`
- `alertType: AlertType` (Enum: LowMoisture, HighTemperature, etc.)
- `severity: Severity` (Enum: Warning, Critical)
- `message: String`
- `timestamp: DateTime`
- `status: AlertStatus` (Enum: Active, Resolved)

**Operations:**
- `+ create(): boolean`
- `+ resolve(): boolean`
- `+ escalate(): boolean`
- `+ acknowledge(): boolean`

---

#### **Product** (Entity)
**Attributes:**
- `productId: UUID`
- `farmId: UUID`
- `cropType: String`
- `name: String`
- `description: String`
- `price: float`
- `quantity: float`
- `unit: String` (e.g., "lb", "kg")
- `photos: List<String>`
- `certifications: List<Certification>` (e.g., Organic, Pesticide-Free)
- `availabilityDate: Date`
- `status: ProductStatus` (Enum: InStock, PreOrder, SoldOut)

**Operations:**
- `+ list(): boolean`
- `+ update(data: ProductData): boolean`
- `+ updateInventory(quantity: float): boolean`
- `+ delist(): boolean`
- `+ getAverageRating(): float`

**Relationships:**
- 1 Product has 0..* Reviews

---

#### **Order** (Entity)
**Attributes:**
- `orderId: UUID`
- `buyerId: UUID`
- `orderDate: DateTime`
- `totalAmount: float`
- `tax: float`
- `status: OrderStatus` (Enum: Pending, Confirmed, Ready, Completed, Cancelled)
- `deliveryMethod: DeliveryMethod` (Enum: Pickup, Delivery)
- `deliveryDate: Date`
- `paymentStatus: PaymentStatus`

**Operations:**
- `+ create(): boolean`
- `+ updateStatus(newStatus: OrderStatus): boolean`
- `+ cancel(): boolean`
- `+ calculateTotal(): float`
- `+ sendNotification(recipient: User): boolean`

**Relationships:**
- 1 Order contains 1..* OrderItems (Composition)
- 1 Order paid by 1 Payment
- * OrderItem references 1 Product

---

#### **Payment** (Entity)
**Attributes:**
- `paymentId: UUID`
- `orderId: UUID`
- `amount: float`
- `paymentMethod: PaymentMethod` (Enum: CreditCard, DebitCard)
- `stripeToken: String` (Tokenized, not actual card number)
- `status: PaymentStatus` (Enum: Pending, Completed, Failed, Refunded)
- `timestamp: DateTime`

**Operations:**
- `+ process(): boolean`
- `+ refund(): boolean`
- `+ getReceipt(): Receipt`

---

#### **Additional Entity Classes:**
- **Task:** Farm management tasks (watering, fertilizing, pruning, harvesting)
- **Review:** Product/farm ratings and reviews
- **PestDetectionRecord:** AI pest detection history
- **IrrigationSchedule:** Automated watering schedules
- **OrderItem:** Line items in orders

---

### 3.2 Boundary Classes (UI Controllers & APIs)

Boundary classes handle interactions between actors and the system.

#### **UI Boundary Classes:**

**AuthenticationUI**
- Displays login/registration forms
- Handles password reset flows
- Redirects to dashboard after successful login

**DashboardUI**
- Displays farm list, sensor data, alerts
- Real-time updates via WebSocket

**MonitoringUI**
- Sensor dashboard with real-time readings
- Historical charts and threshold configuration
- Critical sensor highlighting

**PestDetectionUI**
- Camera interface for photo capture
- Analysis progress indicator
- Detection results and treatment recommendations

**MarketplaceUI**
- Product listings and search
- Shopping cart and checkout
- Order confirmation and tracking

**FarmManagementUI**
- Farm creation/editing forms
- Crop planning calendar
- Task list management

**ReportsUI**
- Performance dashboards
- Sustainability metrics
- PDF/CSV export functionality

---

#### **API Boundary Classes:**

**SensorAPI**
- `+ receiveSensorData(data: SensorData): Response`
- `+ getSensorReadings(sensorId: UUID, range: DateRange): List<SensorReading>`
- `+ registerSensor(sensorData: SensorRegistration): Response`
- `+ updateSensorStatus(sensorId: UUID, status: SensorStatus): Response`

**MarketplaceAPI**
- `+ searchProducts(criteria: SearchCriteria): List<Product>`
- `+ getProductDetails(productId: UUID): Product`
- `+ createOrder(orderData: OrderData): Order`
- `+ processPayment(paymentData: PaymentData): PaymentResult`

**AIAPI**
- `+ detectPest(imageData: ImageData): PestDetectionResult`
- `+ recommendCrops(farmData: FarmData): List<CropRecommendation>`
- `+ predictYield(cropData: CropData): YieldPrediction`
- `+ chatWithAssistant(query: String, context: ChatContext): String`

---

### 3.3 Control Classes (Business Logic)

Control classes coordinate business logic and orchestrate entity operations.

#### **AuthenticationManager**
**Responsibilities:**
- User authentication and registration
- JWT token generation and validation
- Password hashing (bcrypt)
- Email verification

**Key Operations:**
- `+ authenticateUser(email, password): AuthToken`
- `+ registerUser(userData): User`
- `+ validateToken(token): boolean`
- `+ sendVerificationEmail(user): boolean`

---

#### **SensorDataProcessor**
**Responsibilities:**
- Ingest and validate sensor readings
- Detect outliers (>3 standard deviations)
- Store data in InfluxDB
- Check threshold violations
- Aggregate historical data

**Key Operations:**
- `+ ingestSensorData(reading): boolean`
- `+ checkThresholds(reading): ThresholdStatus`
- `+ aggregateReadings(sensorId, period): AggregatedData`

---

#### **AlertManager**
**Responsibilities:**
- Evaluate threshold violations
- Create and manage alerts
- Send multi-channel notifications (email, SMS, push)
- Handle quiet hours and severity escalation

**Key Operations:**
- `+ evaluateThreshold(reading, threshold): Alert`
- `+ sendNotification(alert, channels): boolean`
- `+ checkQuietHours(user): boolean`
- `+ escalateAlert(alertId): boolean`

---

#### **PestDetectionManager**
**Responsibilities:**
- Preprocess images for ML model
- Interface with TensorFlow ML service
- Classify pests/diseases
- Retrieve treatment recommendations
- Save detection records
- Improve model with user feedback

**Key Operations:**
- `+ analyzeImage(image): PestDetectionResult`
- `+ getTreatmentRecommendations(pestName): List<Treatment>`
- `+ improveModel(feedback): boolean`

---

#### **IrrigationScheduler**
**Responsibilities:**
- Generate watering schedules based on sensor data and weather forecasts
- Adjust schedules dynamically
- Calculate crop-specific water needs
- Send watering reminders

**Key Operations:**
- `+ generateSchedule(farm, weatherData): IrrigationSchedule`
- `+ adjustScheduleForWeather(schedule, forecast): IrrigationSchedule`
- `+ optimizeWaterUsage(farm): WaterOptimizationPlan`

---

#### **OrderManager**
**Responsibilities:**
- Create and manage orders
- Validate inventory availability
- Calculate totals (subtotal + tax)
- Update order status
- Notify buyers and sellers
- Handle order cancellations

**Key Operations:**
- `+ createOrder(buyerId, items): Order`
- `+ validateInventory(items): boolean`
- `+ notifyStakeholders(order): boolean`

---

#### **PaymentProcessor**
**Responsibilities:**
- Process payments via Stripe API
- Validate payment data
- Handle payment success/failure
- Issue refunds
- Ensure PCI-DSS compliance

**Key Operations:**
- `+ processPayment(paymentData): PaymentResult`
- `+ handlePaymentSuccess(payment): boolean`
- `+ handlePaymentFailure(payment, error): boolean`

---

#### **SearchEngine**
**Responsibilities:**
- Full-text product search
- Apply filters (location, price, certifications)
- Rank results by relevance, distance, rating
- Geospatial filtering (Haversine distance)

**Key Operations:**
- `+ searchProducts(query, filters): List<Product>`
- `+ rankResults(results, criteria): List<Product>`
- `+ applyLocationFilter(products, location, radius): List<Product>`

---

#### **Additional Control Classes:**
- **CropRecommendationEngine:** ML-based crop recommendations
- **YieldPredictor:** Harvest yield prediction
- **InventoryManager:** Stock management and reservation
- **NotificationService:** Multi-channel notifications
- **ReportGenerator:** PDF/CSV report generation

---

### 3.4 Relationships and Multiplicities

The class diagram includes comprehensive relationships:

**Association** (solid line):
- User — Farm: 1 to 0..*
- User — Order: 1 to 0..*
- Product — Review: 1 to 0..*

**Aggregation** (hollow diamond):
- Farm ◇— Sensor: 1 to 0..*
  (Sensors can exist independently)

**Composition** (filled diamond):
- Farm ◆— Crop: 1 to 0..*
  (Crops cannot exist without farm)
- Order ◆— OrderItem: 1 to 1..*
  (Order items only exist within orders)

**Dependency** (dashed arrow):
- UI classes ..> Control classes (use)
- Control classes ..> Entity classes (manage)

**Multiplicity Notation:**
- `1` = exactly one
- `0..1` = zero or one
- `0..*` = zero or many
- `1..*` = one or many

**Diagram File:** `ClassDiagram.puml`

---

## 4. SEQUENCE DIAGRAMS

Sequence diagrams illustrate the temporal sequence of messages exchanged between objects to accomplish specific use cases.

---

### 4.1 Sequence Diagram: Monitor Real-Time Sensor Data

**Participants:**
- **Actor:** Urban Farmer
- **Boundary:** MonitoringUI
- **Control:** SensorDataProcessor, AlertManager
- **Entity:** Farm, Sensor, SensorReading, Threshold, Alert
- **Database:** InfluxDB, PostgreSQL

#### Message Flow:

**1. Dashboard Access (Steps 1-5):**
```
User → UI: Navigate to Monitoring Dashboard
UI → DB: getFarmsByUser(userId)
DB → UI: List<Farm>
UI → User: Display farm list
User → UI: Select farm (farmId)
```

**2. Sensor Data Retrieval (Steps 6-12):**
```
UI → Processor: getSensorData(farmId)
Processor → DB: getSensorsByFarm(farmId)
DB → Processor: List<Sensor>

[Loop for each sensor]:
  Processor → InfluxDB: getLatestReading(sensorId)
  InfluxDB → Processor: SensorReading
  Processor → Processor: validateReading(reading)
  Processor → DB: getThreshold(sensorId)
  DB → Processor: Threshold
  Processor → Processor: checkThreshold(reading, threshold)
```

**3. Threshold Violation Handling (Steps 13-25):**
```
[Alt: Reading exceeds threshold]:
  Processor → AlertManager: evaluateThreshold(reading, threshold)
  AlertManager → DB: checkActiveAlert(sensorId)

  [Alt: No active alert OR last alert >1 hour ago]:
    AlertManager → AlertManager: determineSeverity(reading, threshold)
    AlertManager → Alert: create(sensorId, severity, message)
    AlertManager → DB: saveAlert(alert)
    AlertManager → AlertManager: sendNotification(alert, channels)
  [Else: Active alert exists]:
    AlertManager → DB: updateAlert(alertId, latestReading)
```

**4. Dashboard Rendering (Steps 26-32):**
```
Processor → UI: SensorDataResponse(readings, status, alerts)
UI → UI: renderDashboard(sensorData)

[Loop for each sensor]:
  UI → UI: displayReading(sensor, value, timestamp)
  UI → UI: applyColorCoding(status)

[Alt: Critical threshold exceeded]:
  UI → UI: highlightCriticalSensor(sensorId)
  UI → UI: showAlertMessage(message)
  UI → UI: displayRecommendedAction()

UI → User: Display dashboard with real-time sensor data
```

**5. Historical Data Viewing (Optional Flow):**
```
[Alt: User clicks sensor for details]:
  User → UI: Click sensor (sensorId)
  UI → Processor: getHistoricalData(sensorId, last24Hours)
  Processor → InfluxDB: queryReadings(sensorId, timeRange)
  InfluxDB → Processor: List<SensorReading>

  [Alt: Sufficient data]:
    Processor → Processor: aggregateData(readings)
    Processor → UI: HistoricalDataResponse
    UI → UI: renderTrendChart(data)
    UI → User: Display historical chart
  [Else: Insufficient data]:
    Processor → UI: InsufficientDataError
    UI → User: "Collecting data... Charts available after 1 hour"
```

**6. Task Creation (Optional Flow):**
```
[Alt: User creates task]:
  User → UI: Click "Create Task"
  UI → DB: createTask(farmId, userId, taskData)
  DB → UI: taskId
  UI → User: Task created: "Water plants"
```

#### Key Characteristics:

- **Activation Boxes:** Show object lifespans during interactions
- **Alt Fragments:** Model conditional logic (threshold violations, data availability)
- **Loop Fragments:** Iterate over multiple sensors
- **Auto-Update Note:** Dashboard refreshes every 60 seconds via WebSocket

**Diagram File:** `SequenceDiagram_MonitorSensorData.puml`

---

### 4.2 Sequence Diagram: Detect Pest/Disease from Photo

**Participants:**
- **Actor:** Urban Farmer
- **Boundary:** PestDetectionUI
- **Control:** PestDetectionManager, NotificationService
- **Entity:** PestDetectionRecord, Task, Farm
- **Database:** PostgreSQL
- **External:** AI/ML Service (TensorFlow), Cloud Storage (AWS S3)

#### Message Flow:

**1. Image Capture/Upload (Steps 1-6):**
```
User → UI: Navigate to Pest Detection feature
UI → UI: displayCameraInterface()
UI → User: Show camera/upload options
User → UI: Capture or upload photo
UI → UI: receiveImage(imageData)
UI → UI: validateImage(format, size, resolution)
```

**2. Image Processing and Analysis (Steps 7-15):**
```
[Alt: Valid image]:
  UI → UI: showProgress("Analyzing...")
  UI → Manager: analyzeImage(imageData, userId, farmId)
  Manager → Manager: preprocessImage(imageData)
  Manager → Storage: uploadImage(processedImage)
  Storage → Manager: imageUrl

  Manager → AI: sendImageForAnalysis(imageUrl)
  AI → AI: loadResNet50Model()
  AI → AI: extractFeatures(image)
  AI → AI: runClassification()
  AI → AI: generatePredictions()
  AI → Manager: PestDetectionResult(predictions, confidenceScores)
```

**3. High Confidence Result (≥70%):**
```
[Alt: Highest confidence ≥70%]:
  Manager → Manager: extractPrimaryIdentification()
  Manager → DB: getPestDetails(pestName)
  DB → Manager: PestDetails(appearance, lifecycle, damage)
  Manager → Manager: getTreatmentRecommendations(pestName)

  Manager → Record: create(userId, farmId, imageUrl, pestName, confidence, timestamp)
  Manager → DB: savePestDetectionRecord(record)
  DB → Manager: recordId

  Manager → UI: DetectionResponse(pestName, confidence, details, treatments)
  UI → UI: displayIdentification(pestName, confidence)
  UI → UI: displayPestDetails(details)
  UI → UI: displayTreatmentRecommendations()

  [Loop for each treatment category]:
    UI → UI: showTreatmentOption(treatment)

  UI → User: Show detection results and treatment options
```

**4. Task Creation (Optional):**
```
[Alt: User creates treatment task]:
  User → UI: Click "Create Task" and select treatment
  UI → Task: create(farmId, userId, "Apply neem oil spray")
  UI → DB: saveTask(task)
  DB → UI: taskId
  UI → Notifier: scheduleReminder(task)
  Notifier → UI: reminderScheduled
  UI → User: Task created successfully
```

**5. Model Improvement (Optional):**
```
[Alt: User consents to save image]:
  User → UI: Agree to improve model
  UI → DB: markImageForTraining(recordId)
  DB → UI: success
[Else: User declines]:
  UI → Storage: deleteImage(imageUrl)
  Storage → UI: deleted
```

**6. Low Confidence Result (<70%):**
```
[Alt: Confidence <70%]:
  Manager → Manager: extractTopPredictions(3)
  Manager → Record: create(userId, farmId, imageUrl, "Unidentified", topConfidence, timestamp)
  Manager → DB: savePestDetectionRecord(record)
  Manager → UI: LowConfidenceResponse(topPredictions, suggestions)

  UI → UI: displayMessage("Unable to confidently identify")
  UI → UI: showTopPossibilities(predictions)
  UI → UI: suggestActions()
  UI → User: Show low confidence results and suggestions

  [Alt branches: Retake photo, Post to forum, Try later]
```

**7. Service Unavailable:**
```
[Else: ML Service unavailable]:
  AI → Manager: ServiceUnavailableError
  UI → UI: displayError("Service temporarily unavailable")
  UI → DB: queueImageForLaterProcessing(imageUrl, userId)
  DB → UI: queueId
  UI → User: Show error and alternatives
```

#### Key Characteristics:

- **External System Integration:** TensorFlow ML service and AWS S3
- **Nested Alt Fragments:** Multiple confidence thresholds and user choices
- **User Consent Handling:** Privacy-aware image storage
- **Fallback Mechanisms:** Queue for later processing, community forum
- **Performance Target:** Image analysis completes within 10 seconds

**Diagram File:** `SequenceDiagram_PestDetection.puml`

---

### 4.3 Sequence Diagram: Purchase Product from Marketplace

**Participants:**
- **Actor:** Consumer
- **Boundary:** MarketplaceUI
- **Control:** SearchEngine, OrderManager, InventoryManager, PaymentProcessor, NotificationService
- **Entity:** Product, Order, OrderItem, Payment, User (Farmer)
- **Database:** PostgreSQL
- **External:** Payment Gateway (Stripe)

#### Message Flow (Comprehensive E-Commerce Flow):

**1. Product Discovery (Steps 1-18):**
```
User → UI: Navigate to Marketplace
UI → DB: getAllProducts()
DB → UI: List<Product>
UI → User: Display product listings

User → UI: Enter search "tomatoes" and filter "within 5 miles"
UI → Search: searchProducts(query, location, radius)
Search → DB: queryProducts(criteria)
DB → Search: filteredProducts
Search → Search: applyLocationFilter(products, location, radius)
Search → Search: calculateDistances()
Search → UI: SearchResults(products)
UI → UI: displayResults(products)

User → UI: Sort by "Highest Rated"
UI → UI: sortProducts(criteria=rating)
UI → User: Display sorted products
```

**2. Product Details (Steps 19-25):**
```
User → UI: Click on product "Organic Cherry Tomatoes"
UI → DB: getProductDetails(productId)
DB → UI: ProductDetails
UI → DB: getFarmDetails(farmId)
DB → UI: FarmProfile
UI → DB: getProductReviews(productId)
DB → UI: List<Review>
UI → UI: displayProductDetails(product, farm, reviews)
UI → User: Show detailed product page
```

**3. Add to Cart (Steps 26-32):**
```
User → UI: Select quantity (2 lbs) and delivery method (pickup)
UI → InvMgr: checkAvailability(productId, quantity=2)
InvMgr → DB: getProductStock(productId)
DB → InvMgr: availableQuantity=10

[Alt: Quantity available]:
  InvMgr → UI: available=true
  User → UI: Click "Add to Cart"
  UI → UI: addToCart(productId, quantity, deliveryMethod)
  UI → UI: updateCartBadge()
  UI → User: Item added to cart
```

**4. Checkout Initiation (Steps 33-40):**
```
[After adding multiple items]:
  User → UI: Click cart icon
  UI → UI: getCartItems()
  UI → UI: calculateSubtotal()
  UI → User: Display cart (2 items, $14 subtotal)

  User → UI: Click "Proceed to Checkout"
  UI → UI: displayCheckoutForm()
  UI → User: Show checkout page

  User → UI: Enter delivery details (pickup date, phone)
  UI → UI: validateForm(formData)
```

**5. Payment Processing (Steps 41-60+):**
```
[Alt: Form validation passes]:
  UI → UI: calculateTax(location)
  UI → UI: calculateTotal()  # Subtotal + Tax = Total
  UI → User: Show payment form (Total: $15.12)

  User → UI: Select "Credit Card"
  UI → UI: displayStripePaymentForm()
  UI → User: Payment form

  User → UI: Enter card details and click "Place Order"
  UI → UI: validatePaymentInputs()

  [Alt: Payment inputs valid]:
    UI → OrderMgr: createOrder(buyerId, cartItems, deliveryDetails)
    OrderMgr → DB: beginTransaction()

    # ATOMIC TRANSACTION BEGINS
    OrderMgr → InvMgr: validateInventory(cartItems)
    InvMgr → DB: checkStockLevels(productIds)

    [Alt: All items still in stock]:
      InvMgr → InvMgr: reserveInventory(cartItems)
      InvMgr → DB: updateInventory(productId, -quantity)
      InvMgr → OrderMgr: inventoryReserved

      OrderMgr → Order: create(buyerId, totalAmount, status="Pending")
      OrderMgr → DB: insertOrder(order)
      DB → OrderMgr: orderId

      [Loop for each cart item]:
        OrderMgr → OrderItem: create(orderId, productId, quantity, price)
        OrderMgr → DB: insertOrderItem(orderItem)

      OrderMgr → UI: OrderCreated(orderId)

      UI → PaymentProc: processPayment(orderId, amount, cardDetails)
      PaymentProc → PaymentProc: validatePaymentData(cardDetails)
      PaymentProc → Stripe: createPaymentIntent(amount, currency)

      [Alt: Payment successful]:
        Stripe → Stripe: processCard(cardDetails)
        Stripe → PaymentProc: PaymentSuccess(stripeToken)

        PaymentProc → Payment: create(orderId, amount, stripeToken, status="Completed")
        PaymentProc → DB: savePayment(payment)
        DB → PaymentProc: paymentId

        PaymentProc → OrderMgr: confirmPayment(orderId, paymentId)
        OrderMgr → Order: updateStatus("Confirmed")
        OrderMgr → DB: updateOrderStatus(orderId, "Confirmed")

        OrderMgr → DB: commitTransaction()
        # TRANSACTION COMMITTED

        OrderMgr → PaymentProc: paymentConfirmed
        PaymentProc → UI: PaymentSuccess(orderId, paymentId)
```

**6. Notifications (Steps 61-70):**
```
        UI → Notifier: sendOrderConfirmation(buyerId, orderId)
        Notifier → DB: getUserEmail(buyerId)
        DB → Notifier: email
        Notifier → Notifier: renderEmailTemplate(orderDetails)
        Notifier → Notifier: sendEmail(email, subject, body)

        UI → Notifier: notifyFarmers(order)
        [Loop for each unique farm in order]:
          Notifier → DB: getFarmerContact(farmId)
          DB → Notifier: farmerEmail
          Notifier → Notifier: sendNewOrderNotification(farmerEmail)

        OrderMgr → UI: OrderCompleted
        UI → UI: displayOrderConfirmation(orderId)
        UI → UI: clearCart()
        UI → User: "Order placed successfully! Order #12345"
```

**7. Order Tracking:**
```
        User → UI: View order status
        UI → DB: getOrderDetails(orderId)
        DB → UI: orderDetails
        UI → User: Display order tracking ("Pending farmer confirmation")
```

**8. Payment Failure Handling:**
```
      [Else: Payment declined]:
        Stripe → PaymentProc: PaymentDeclinedError
        PaymentProc → Payment: create(orderId, amount, status="Failed")
        PaymentProc → DB: savePayment(payment)
        PaymentProc → PaymentProc: logFailure(error)

        PaymentProc → OrderMgr: paymentFailed(orderId)
        OrderMgr → InvMgr: releaseReservation(cartItems)
        InvMgr → DB: updateInventory(productId, +quantity)

        OrderMgr → DB: rollbackTransaction()
        # TRANSACTION ROLLED BACK

        PaymentProc → UI: PaymentFailedError("Payment declined")
        UI → User: Display error "Payment declined. Please try another card."

        [Alt: User tries different payment method]
        [Else: User saves cart and exits]
```

**9. Out of Stock Handling:**
```
    [Else: Product out of stock]:
      InvMgr → InvMgr: detectStockChange()
      InvMgr → OrderMgr: InsufficientStockError
      OrderMgr → DB: rollbackTransaction()
      OrderMgr → UI: StockError("Item sold out")
      UI → UI: removeUnavailableItems(cart)
      UI → User: "Sorry, item now sold out"
```

#### Key Characteristics:

- **Atomic Transactions:** Database transaction ensures order creation, inventory update, and payment processing all succeed or all fail
- **Race Condition Handling:** Final inventory check during checkout prevents overselling
- **Payment Security:** PCI-DSS compliant, card details tokenized via Stripe
- **Multi-stakeholder Notifications:** Buyers and sellers notified at appropriate times
- **Rollback Mechanisms:** Failed payments release inventory reservations
- **Business Logic:** 10% platform commission, minimum order $5, 24-hour farmer confirmation window

**Diagram File:** `SequenceDiagram_PurchaseProduct.puml`

---

## 5. ANALYSIS SUMMARY

### 5.1 Coverage Matrix

| Use Case | Activity Diagram | Class Diagram | Sequence Diagram |
|----------|------------------|---------------|------------------|
| UC-009: Monitor Real-Time Sensor Data | ✓ | ✓ | ✓ |
| UC-017: Detect Pest/Disease | ✓ | ✓ | ✓ |
| UC-025: Purchase Product | ✓ | ✓ | ✓ |

**Total Diagrams:** 7 UML diagrams (3 Activity, 1 Class, 3 Sequence)

---

### 5.2 Key Design Patterns Identified

**1. Boundary-Control-Entity (BCE) Pattern:**
- **Boundary:** UI controllers and API endpoints separate user interaction from business logic
- **Control:** Manager classes coordinate business processes
- **Entity:** Domain objects represent persistent data
- **Benefits:** Separation of concerns, easier testing, maintainability

**2. Model-View-Controller (MVC):**
- Evident in UI structure (MonitoringUI → SensorDataProcessor → Sensor entities)

**3. Repository Pattern:**
- Database access abstracted through control classes
- Entities don't directly query databases

**4. Strategy Pattern (Potential):**
- Multiple notification channels (email, SMS, push)
- Multiple payment methods

**5. Observer Pattern (Potential):**
- Real-time dashboard updates via WebSocket
- Alert notifications to multiple channels

---

### 5.3 Object-Oriented Principles Applied

**Encapsulation:**
- Private attributes (e.g., `- userId`, `- passwordHash`)
- Public operations provide controlled access

**Abstraction:**
- Complex business logic hidden behind simple interfaces
- Example: `OrderManager.createOrder()` abstracts transaction management, inventory, payment

**Separation of Concerns:**
- UI, business logic, and data persistence clearly separated
- Single Responsibility Principle evident in control classes

**Modularity:**
- System decomposed into cohesive packages (User Management, Monitoring, Marketplace, etc.)
- Low coupling between packages

---

### 5.4 Traceability to Requirements

All diagrams trace back to Phase 2 requirements:

**Activity Diagrams → Use Cases:**
- Monitor Sensor Data → UC-009
- Detect Pest/Disease → UC-017
- Purchase Product → UC-025

**Class Diagram → Functional Requirements:**
- User entity → FR-001 to FR-004 (User Management)
- Sensor classes → FR-009 to FR-015 (IoT Monitoring)
- Product/Order classes → FR-024 to FR-029 (Marketplace)

**Sequence Diagrams → Requirements Specifications:**
- Monitor Sensor Data → Spec 5 (Threshold Alert System)
- Detect Pest/Disease → Spec 2 (Pest Detection Image Recognition)
- Purchase Product → Spec 3 (Multi-Criteria Product Search)

---

### 5.5 System Characteristics Demonstrated

**Scalability:**
- Modular architecture supports horizontal scaling
- Separation of concerns allows independent service scaling

**Maintainability:**
- Clear class responsibilities
- Well-defined interfaces between layers
- Comprehensive operations documented

**Extensibility:**
- New sensor types easily added (SensorType enum)
- New payment methods can be integrated (PaymentMethod enum)
- Additional AI features can leverage existing AIAPI boundary

**Reliability:**
- Atomic transactions prevent data inconsistency
- Rollback mechanisms handle failures gracefully
- Alert manager ensures critical notifications delivered

**Security:**
- Authentication via JWT tokens
- Password hashing (bcrypt)
- Payment tokenization (Stripe)
- Input validation at boundary layers

---

### 5.6 Next Steps (Phase 4: System Design)

The analysis models created in Phase 3 will inform:

1. **Software Architecture Design:**
   - 3-tier architecture (Presentation, Business Logic, Data)
   - Microservices decomposition
   - API gateway design

2. **Database Schema Design:**
   - PostgreSQL relational schema (entities from class diagram)
   - InfluxDB time-series schema (sensor readings)
   - Redis cache schema (sessions, real-time data)

3. **UI/UX Mockups:**
   - Dashboard interface (from MonitoringUI)
   - Pest detection flow (from PestDetectionUI)
   - Marketplace checkout (from MarketplaceUI)

4. **Component and Deployment Diagrams:**
   - Subsystem decomposition
   - Hardware/software mapping
   - Cloud infrastructure design

---

## REFERENCES

1. Rumbaugh, J., Jacobson, I., & Booch, G. (2004). *The Unified Modeling Language Reference Manual* (2nd ed.). Addison-Wesley.
2. Larman, C. (2004). *Applying UML and Patterns: An Introduction to Object-Oriented Analysis and Design* (3rd ed.). Prentice Hall.
3. Fowler, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language* (3rd ed.). Addison-Wesley.
4. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.
5. PlantUML Documentation: https://plantuml.com/
6. OMG UML Specification 2.5: https://www.omg.org/spec/UML/2.5/

---

**END OF PHASE 3 DOCUMENT**

*This analysis document provides a comprehensive object-oriented model of the Smart Urban Farming Management System, bridging requirements (Phase 2) and design (Phase 4). All diagrams follow UML 2.5 standards and are traceable to documented requirements.*
