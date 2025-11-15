# PostgreSQL Database Schema Design
## Smart Urban Farming Management System (SUFMS)

---

## Database Overview

**Database Name:** `sufms_db`
**Database Engine:** PostgreSQL 15+
**Character Set:** UTF-8
**Collation:** en_US.UTF-8

---

## Table Definitions

### 1. **users**
Stores user account information for all user types.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **user_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique user identifier |
| email | VARCHAR(254) | NOT NULL, UNIQUE | User email address (RFC 5322) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password (cost=12) |
| first_name | VARCHAR(50) | NULL | User first name |
| last_name | VARCHAR(50) | NULL | User last name |
| user_type | VARCHAR(20) | NOT NULL, CHECK (user_type IN ('Farmer', 'Gardener', 'Consultant', 'Consumer', 'Restaurant', 'Admin')) | User role |
| profile_photo_url | TEXT | NULL | S3 URL to profile image |
| location | VARCHAR(255) | NULL | User location (city, state) |
| latitude | DECIMAL(10,8) | NULL | Latitude for geospatial queries |
| longitude | DECIMAL(11,8) | NULL | Longitude for geospatial queries |
| phone_number | VARCHAR(20) | NULL | Contact phone number |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Pending', CHECK (status IN ('Active', 'Pending', 'Suspended', 'Deleted')) | Account status |
| email_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Email verification status |
| verification_token | UUID | NULL | Email verification token |
| verification_token_expires | TIMESTAMP | NULL | Token expiration time |
| failed_login_attempts | INTEGER | NOT NULL, DEFAULT 0 | Failed login counter |
| account_locked_until | TIMESTAMP | NULL | Account lockout expiration |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |
| last_login | TIMESTAMP | NULL | Last successful login |

**Indexes:**
- `idx_users_email` ON email (for login queries)
- `idx_users_user_type` ON user_type (for filtering)
- `idx_users_location` ON (latitude, longitude) USING gist (for geospatial searches)

**Relationships:**
- One-to-Many with `farms` (user_id)
- One-to-Many with `orders` (buyer_id)
- One-to-Many with `reviews` (user_id)
- One-to-Many with `tasks` (user_id)

---

### 2. **farms**
Stores farm/garden plot information.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **farm_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique farm identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(user_id) ON DELETE CASCADE | Farm owner |
| name | VARCHAR(100) | NOT NULL | Farm name |
| size_sqm | DECIMAL(10,2) | NOT NULL, CHECK (size_sqm > 0) | Farm size in square meters |
| latitude | DECIMAL(10,8) | NOT NULL | Farm latitude |
| longitude | DECIMAL(11,8) | NOT NULL | Farm longitude |
| farm_type | VARCHAR(20) | NOT NULL, CHECK (farm_type IN ('Indoor', 'Outdoor', 'Rooftop', 'Vertical', 'Greenhouse')) | Type of farm |
| description | TEXT | NULL | Farm description |
| photos | TEXT[] | NULL | Array of S3 URLs |
| soil_type | VARCHAR(50) | NULL | Soil type (e.g., 'Clay', 'Sandy', 'Loam') |
| certifications | TEXT[] | NULL | Array of certifications (e.g., 'Organic', 'Pesticide-Free') |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_farms_user_id` ON user_id (for user's farms)
- `idx_farms_location` ON (latitude, longitude) USING gist (for nearby farms)

**Relationships:**
- Many-to-One with `users` (user_id)
- One-to-Many with `crops` (farm_id)
- One-to-Many with `sensors` (farm_id)
- One-to-Many with `products` (farm_id)
- One-to-Many with `pest_detection_records` (farm_id)

---

### 3. **crops**
Stores crop planting and management information.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **crop_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique crop identifier |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Associated farm |
| crop_type | VARCHAR(100) | NOT NULL | Crop type (e.g., 'Tomato', 'Lettuce') |
| variety | VARCHAR(100) | NULL | Crop variety (e.g., 'Cherry Tomato') |
| planting_date | DATE | NOT NULL | Date planted |
| expected_harvest_date | DATE | NOT NULL | Expected harvest date |
| actual_harvest_date | DATE | NULL | Actual harvest date |
| quantity_planted | DECIMAL(10,2) | NULL | Quantity planted (in units) |
| quantity_harvested | DECIMAL(10,2) | NULL | Quantity harvested (in units) |
| unit | VARCHAR(20) | NOT NULL, DEFAULT 'lb' | Unit of measurement (lb, kg, etc.) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Planted', CHECK (status IN ('Planted', 'Growing', 'Harvested', 'Failed')) | Crop status |
| notes | TEXT | NULL | Additional notes |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_crops_farm_id` ON farm_id
- `idx_crops_status` ON status
- `idx_crops_harvest_date` ON expected_harvest_date

**Relationships:**
- Many-to-One with `farms` (farm_id)
- One-to-Many with `irrigation_schedules` (crop_id)
- One-to-One with `products` (via crop_id reference - optional)

---

### 4. **sensors**
Stores IoT sensor device metadata.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **sensor_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique sensor identifier |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Associated farm |
| sensor_type | VARCHAR(20) | NOT NULL, CHECK (sensor_type IN ('SoilMoisture', 'pH', 'Temperature', 'Humidity', 'Light')) | Type of sensor |
| model | VARCHAR(100) | NULL | Sensor model name |
| installation_date | DATE | NOT NULL | Installation date |
| calibration_date | DATE | NULL | Last calibration date |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Online', CHECK (status IN ('Online', 'Offline', 'Error', 'Maintenance')) | Sensor status |
| last_reading_time | TIMESTAMP | NULL | Timestamp of last received reading |
| battery_level | INTEGER | NULL, CHECK (battery_level BETWEEN 0 AND 100) | Battery percentage (if applicable) |
| device_id | VARCHAR(100) | NULL, UNIQUE | Physical device identifier (MAC address, serial number) |
| mqtt_topic | VARCHAR(255) | NULL | MQTT topic for this sensor |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_sensors_farm_id` ON farm_id
- `idx_sensors_sensor_type` ON sensor_type
- `idx_sensors_status` ON status

**Relationships:**
- Many-to-One with `farms` (farm_id)
- One-to-Many with `sensor_readings` (sensor_id) - **stored in InfluxDB**
- One-to-One with `thresholds` (sensor_id)
- One-to-Many with `alerts` (sensor_id)

---

### 5. **thresholds**
Stores sensor alert thresholds.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **threshold_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique threshold identifier |
| sensor_id | UUID | NOT NULL, UNIQUE, FOREIGN KEY → sensors(sensor_id) ON DELETE CASCADE | Associated sensor |
| crop_type | VARCHAR(100) | NULL | Crop-specific threshold (if applicable) |
| min_value | DECIMAL(10,4) | NULL | Minimum acceptable value |
| max_value | DECIMAL(10,4) | NULL | Maximum acceptable value |
| alert_enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Enable/disable alerts |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_thresholds_sensor_id` ON sensor_id

**Relationships:**
- One-to-One with `sensors` (sensor_id)

**Constraints:**
- CHECK: At least one of min_value or max_value must be set
- CHECK: If both set, min_value < max_value

---

### 6. **alerts**
Stores sensor threshold violation alerts.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **alert_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique alert identifier |
| sensor_id | UUID | NOT NULL, FOREIGN KEY → sensors(sensor_id) ON DELETE CASCADE | Sensor that triggered alert |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Associated farm |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(user_id) ON DELETE CASCADE | Alert recipient |
| alert_type | VARCHAR(50) | NOT NULL | Alert type (e.g., 'LowMoisture', 'HighTemperature') |
| severity | VARCHAR(20) | NOT NULL, CHECK (severity IN ('Warning', 'Critical')) | Alert severity |
| message | TEXT | NOT NULL | Human-readable alert message |
| sensor_value | DECIMAL(10,4) | NOT NULL | Value that triggered alert |
| threshold_min | DECIMAL(10,4) | NULL | Threshold minimum (for reference) |
| threshold_max | DECIMAL(10,4) | NULL | Threshold maximum (for reference) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Active', CHECK (status IN ('Active', 'Acknowledged', 'Resolved')) | Alert status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Alert creation time |
| acknowledged_at | TIMESTAMP | NULL | Time user acknowledged alert |
| resolved_at | TIMESTAMP | NULL | Time alert was resolved |

**Indexes:**
- `idx_alerts_sensor_id` ON sensor_id
- `idx_alerts_user_id` ON user_id
- `idx_alerts_status` ON status
- `idx_alerts_created_at` ON created_at DESC

**Relationships:**
- Many-to-One with `sensors` (sensor_id)
- Many-to-One with `farms` (farm_id)
- Many-to-One with `users` (user_id)

---

### 7. **tasks**
Stores farm management tasks.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **task_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique task identifier |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Associated farm |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(user_id) ON DELETE CASCADE | Task owner |
| title | VARCHAR(200) | NOT NULL | Task title |
| description | TEXT | NULL | Task description |
| task_type | VARCHAR(50) | NOT NULL, CHECK (task_type IN ('Watering', 'Fertilizing', 'Pruning', 'Harvesting', 'Pest Control', 'Planting', 'Other')) | Task category |
| due_date | TIMESTAMP | NOT NULL | Task due date/time |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| completed_at | TIMESTAMP | NULL | Completion timestamp |
| recurring | BOOLEAN | NOT NULL, DEFAULT FALSE | Is this a recurring task? |
| recurrence_pattern | VARCHAR(100) | NULL | Recurrence pattern (e.g., 'daily', 'weekly') |
| priority | VARCHAR(20) | NULL, CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) | Task priority |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_tasks_farm_id` ON farm_id
- `idx_tasks_user_id` ON user_id
- `idx_tasks_due_date` ON due_date
- `idx_tasks_completed` ON completed

**Relationships:**
- Many-to-One with `farms` (farm_id)
- Many-to-One with `users` (user_id)

---

### 8. **products**
Stores marketplace product listings.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **product_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique product identifier |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Farm selling product |
| crop_id | UUID | NULL, FOREIGN KEY → crops(crop_id) ON DELETE SET NULL | Source crop (optional) |
| name | VARCHAR(200) | NOT NULL | Product name |
| description | TEXT | NULL | Product description |
| price | DECIMAL(10,2) | NOT NULL, CHECK (price >= 0) | Price per unit |
| quantity_available | DECIMAL(10,2) | NOT NULL, CHECK (quantity_available >= 0) | Available quantity |
| unit | VARCHAR(20) | NOT NULL | Unit of sale (lb, kg, oz, bunch) |
| photos | TEXT[] | NULL | Array of S3 URLs |
| category | VARCHAR(50) | NOT NULL | Product category (e.g., 'Vegetables', 'Fruits', 'Herbs') |
| certifications | TEXT[] | NULL | Certifications (e.g., 'Organic', 'Non-GMO') |
| availability_date | DATE | NOT NULL | Date product available for purchase |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'InStock', CHECK (status IN ('InStock', 'PreOrder', 'SoldOut', 'Delisted')) | Product status |
| growing_method | VARCHAR(50) | NULL | Growing method (e.g., 'Hydroponic', 'Soil') |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Listing creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Indexes:**
- `idx_products_farm_id` ON farm_id
- `idx_products_category` ON category
- `idx_products_status` ON status
- `idx_products_name_fulltext` ON name USING gin(to_tsvector('english', name)) (full-text search)

**Relationships:**
- Many-to-One with `farms` (farm_id)
- Many-to-One with `crops` (crop_id, optional)
- One-to-Many with `order_items` (product_id)
- One-to-Many with `reviews` (product_id)

---

### 9. **orders**
Stores marketplace orders.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **order_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique order identifier |
| buyer_id | UUID | NOT NULL, FOREIGN KEY → users(user_id) ON DELETE RESTRICT | Buyer user ID |
| order_date | TIMESTAMP | NOT NULL, DEFAULT NOW() | Order creation time |
| subtotal | DECIMAL(10,2) | NOT NULL, CHECK (subtotal >= 0) | Order subtotal |
| tax | DECIMAL(10,2) | NOT NULL, DEFAULT 0, CHECK (tax >= 0) | Tax amount |
| total_amount | DECIMAL(10,2) | NOT NULL, CHECK (total_amount >= 0) | Total order amount |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Pending', CHECK (status IN ('Pending', 'Confirmed', 'Ready', 'Completed', 'Cancelled')) | Order status |
| delivery_method | VARCHAR(20) | NOT NULL, CHECK (delivery_method IN ('Pickup', 'Delivery')) | Delivery type |
| delivery_address | TEXT | NULL | Delivery address (if applicable) |
| delivery_date | DATE | NULL | Requested delivery/pickup date |
| delivery_phone | VARCHAR(20) | NULL | Contact phone for delivery |
| special_instructions | TEXT | NULL | Customer notes |
| payment_status | VARCHAR(20) | NOT NULL, DEFAULT 'Pending', CHECK (payment_status IN ('Pending', 'Completed', 'Failed', 'Refunded')) | Payment status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Indexes:**
- `idx_orders_buyer_id` ON buyer_id
- `idx_orders_status` ON status
- `idx_orders_order_date` ON order_date DESC

**Relationships:**
- Many-to-One with `users` (buyer_id)
- One-to-Many with `order_items` (order_id)
- One-to-One with `payments` (order_id)

---

### 10. **order_items**
Stores line items for each order.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **order_item_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique order item identifier |
| order_id | UUID | NOT NULL, FOREIGN KEY → orders(order_id) ON DELETE CASCADE | Associated order |
| product_id | UUID | NOT NULL, FOREIGN KEY → products(product_id) ON DELETE RESTRICT | Ordered product |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE RESTRICT | Seller farm |
| quantity | DECIMAL(10,2) | NOT NULL, CHECK (quantity > 0) | Quantity ordered |
| unit | VARCHAR(20) | NOT NULL | Unit of measure |
| price_at_purchase | DECIMAL(10,2) | NOT NULL, CHECK (price_at_purchase >= 0) | Price per unit at time of purchase |
| subtotal | DECIMAL(10,2) | NOT NULL, CHECK (subtotal >= 0) | Line item subtotal |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_order_items_order_id` ON order_id
- `idx_order_items_product_id` ON product_id
- `idx_order_items_farm_id` ON farm_id

**Relationships:**
- Many-to-One with `orders` (order_id)
- Many-to-One with `products` (product_id)
- Many-to-One with `farms` (farm_id)

---

### 11. **payments**
Stores payment transaction records.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **payment_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique payment identifier |
| order_id | UUID | NOT NULL, UNIQUE, FOREIGN KEY → orders(order_id) ON DELETE RESTRICT | Associated order |
| amount | DECIMAL(10,2) | NOT NULL, CHECK (amount >= 0) | Payment amount |
| payment_method | VARCHAR(20) | NOT NULL, CHECK (payment_method IN ('CreditCard', 'DebitCard')) | Payment method |
| stripe_payment_intent_id | VARCHAR(255) | NOT NULL, UNIQUE | Stripe PaymentIntent ID |
| stripe_token | VARCHAR(255) | NULL | Stripe token (tokenized card) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Pending', CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')) | Payment status |
| failure_reason | TEXT | NULL | Reason for failure (if failed) |
| refund_amount | DECIMAL(10,2) | NULL, CHECK (refund_amount >= 0) | Refund amount (if refunded) |
| refund_reason | TEXT | NULL | Reason for refund |
| platform_fee | DECIMAL(10,2) | NOT NULL, DEFAULT 0, CHECK (platform_fee >= 0) | Platform commission (10%) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Payment attempt time |
| completed_at | TIMESTAMP | NULL | Payment completion time |
| refunded_at | TIMESTAMP | NULL | Refund timestamp |

**Indexes:**
- `idx_payments_order_id` ON order_id
- `idx_payments_stripe_payment_intent_id` ON stripe_payment_intent_id
- `idx_payments_status` ON status

**Relationships:**
- One-to-One with `orders` (order_id)

**Security:**
- **NEVER** store raw credit card numbers
- Only store Stripe tokens (tokenized references)

---

### 12. **reviews**
Stores product and farm reviews.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **review_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique review identifier |
| product_id | UUID | NULL, FOREIGN KEY → products(product_id) ON DELETE CASCADE | Reviewed product (nullable if farm review) |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Reviewed farm |
| order_id | UUID | NOT NULL, FOREIGN KEY → orders(order_id) ON DELETE CASCADE | Order this review is for |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(user_id) ON DELETE CASCADE | Reviewer |
| rating | INTEGER | NOT NULL, CHECK (rating BETWEEN 1 AND 5) | Star rating (1-5) |
| comment | TEXT | NULL | Review text |
| helpful_count | INTEGER | NOT NULL, DEFAULT 0 | Number of users who found helpful |
| verified_purchase | BOOLEAN | NOT NULL, DEFAULT TRUE | Is this a verified purchase? |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Review submission time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_reviews_product_id` ON product_id
- `idx_reviews_farm_id` ON farm_id
- `idx_reviews_user_id` ON user_id
- `idx_reviews_rating` ON rating

**Relationships:**
- Many-to-One with `products` (product_id, optional)
- Many-to-One with `farms` (farm_id)
- Many-to-One with `orders` (order_id)
- Many-to-One with `users` (user_id)

**Constraints:**
- UNIQUE (user_id, order_id, product_id) - one review per product per order

---

### 13. **pest_detection_records**
Stores AI pest detection history.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **record_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique detection record ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(user_id) ON DELETE CASCADE | User who uploaded image |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Associated farm |
| crop_id | UUID | NULL, FOREIGN KEY → crops(crop_id) ON DELETE SET NULL | Associated crop (optional) |
| image_url | TEXT | NOT NULL | S3 URL to uploaded image |
| pest_name | VARCHAR(200) | NULL | Identified pest/disease name |
| confidence | DECIMAL(5,4) | NULL, CHECK (confidence BETWEEN 0 AND 1) | ML model confidence (0-1) |
| top_predictions | JSONB | NULL | Top 3 predictions with scores |
| treatment_applied | TEXT | NULL | Treatment user applied |
| user_feedback | VARCHAR(50) | NULL, CHECK (user_feedback IN ('Correct', 'Incorrect', 'Unsure')) | User verification feedback |
| anonymized_for_training | BOOLEAN | NOT NULL, DEFAULT FALSE | Image used for ML retraining? |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Detection timestamp |

**Indexes:**
- `idx_pest_records_user_id` ON user_id
- `idx_pest_records_farm_id` ON farm_id
- `idx_pest_records_created_at` ON created_at DESC

**Relationships:**
- Many-to-One with `users` (user_id)
- Many-to-One with `farms` (farm_id)
- Many-to-One with `crops` (crop_id, optional)

---

### 14. **irrigation_schedules**
Stores automated irrigation recommendations.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **schedule_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique schedule identifier |
| farm_id | UUID | NOT NULL, FOREIGN KEY → farms(farm_id) ON DELETE CASCADE | Associated farm |
| crop_id | UUID | NULL, FOREIGN KEY → crops(crop_id) ON DELETE SET NULL | Associated crop (optional) |
| scheduled_time | TIMESTAMP | NOT NULL | Recommended watering time |
| water_amount_liters | DECIMAL(10,2) | NOT NULL, CHECK (water_amount_liters > 0) | Recommended water amount |
| reason | TEXT | NULL | Reason for recommendation (e.g., "Low soil moisture") |
| weather_forecast | JSONB | NULL | Weather data used for calculation |
| soil_moisture_reading | DECIMAL(10,4) | NULL | Soil moisture at time of calculation |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Was watering completed? |
| completed_at | TIMESTAMP | NULL | Completion timestamp |
| actual_amount_liters | DECIMAL(10,2) | NULL | Actual amount user watered |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Schedule creation time |

**Indexes:**
- `idx_irrigation_farm_id` ON farm_id
- `idx_irrigation_crop_id` ON crop_id
- `idx_irrigation_scheduled_time` ON scheduled_time
- `idx_irrigation_completed` ON completed

**Relationships:**
- Many-to-One with `farms` (farm_id)
- Many-to-One with `crops` (crop_id, optional)

---

### 15. **notification_logs**
Stores notification delivery history.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| **notification_id** | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique notification ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(user_id) ON DELETE CASCADE | Recipient user |
| notification_type | VARCHAR(50) | NOT NULL, CHECK (notification_type IN ('Email', 'SMS', 'Push')) | Channel type |
| subject | VARCHAR(255) | NULL | Email subject (if email) |
| message | TEXT | NOT NULL | Notification content |
| related_entity_type | VARCHAR(50) | NULL | Entity type (e.g., 'Alert', 'Order') |
| related_entity_id | UUID | NULL | Entity ID |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Pending', CHECK (status IN ('Pending', 'Sent', 'Failed', 'Bounced')) | Delivery status |
| failure_reason | TEXT | NULL | Failure reason (if failed) |
| retry_count | INTEGER | NOT NULL, DEFAULT 0 | Number of retry attempts |
| sent_at | TIMESTAMP | NULL | Successful delivery time |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_notifications_user_id` ON user_id
- `idx_notifications_status` ON status
- `idx_notifications_created_at` ON created_at DESC

**Relationships:**
- Many-to-One with `users` (user_id)

**Data Retention:**
- Notifications older than 90 days should be archived/deleted (GDPR compliance)

---

## Database Relationships Summary

### Relationship Types

**One-to-Many (1:N):**
1. users → farms (A user owns many farms)
2. users → orders (A user places many orders)
3. users → reviews (A user writes many reviews)
4. farms → crops (A farm has many crops)
5. farms → sensors (A farm has many sensors)
6. farms → products (A farm lists many products)
7. orders → order_items (An order contains many items)
8. products → order_items (A product appears in many order items)
9. products → reviews (A product has many reviews)

**One-to-One (1:1):**
1. sensors → thresholds (A sensor has one threshold configuration)
2. orders → payments (An order has one payment record)

**Many-to-Many (M:N):** *(Implemented via junction tables)*
None directly, but order_items serves as junction between orders and products

---

## Constraints Summary

**NOT NULL Constraints:** Applied to all critical fields (emails, IDs, timestamps)
**UNIQUE Constraints:** email (users), device_id (sensors), stripe_payment_intent_id (payments)
**CHECK Constraints:**
- Enum validations (user_type, status fields)
- Range validations (rating BETWEEN 1 AND 5, battery_level BETWEEN 0 AND 100)
- Positive number checks (price >= 0, quantity > 0)
**FOREIGN KEY Constraints:** All relationships enforced with ON DELETE CASCADE or RESTRICT
**DEFAULT Values:** Timestamps (NOW()), status fields ('Active', 'Pending'), boolean flags (FALSE)

---

## Indexes Strategy

**Primary Indexes:** All primary keys (UUID) automatically indexed
**Foreign Key Indexes:** All FK columns indexed for JOIN performance
**Search Indexes:** Full-text search on product names (GIN index)
**Geospatial Indexes:** GIST indexes on (latitude, longitude) for location queries
**Composite Indexes:** Created for common query patterns (e.g., user_id + status)

---

## Security Considerations

1. **Password Storage:** Bcrypt hash with cost factor 12
2. **Payment Data:** Never store raw credit card numbers; use Stripe tokens only
3. **Email Verification:** Token-based with expiration
4. **Account Lockout:** After 10 failed login attempts, lock for 15 minutes
5. **Soft Deletes:** Important records (orders, payments) use DELETE RESTRICT
6. **Audit Trails:** created_at and updated_at on all tables

---

## Performance Optimizations

1. **Partitioning:** sensor_readings table (if stored in PostgreSQL) partitioned by month
2. **Connection Pooling:** Use PgBouncer for connection management
3. **Query Optimization:** Avoid SELECT *; use specific column selection
4. **Materialized Views:** For complex analytics queries (e.g., farm performance dashboards)
5. **Prepared Statements:** Use parameterized queries to prevent SQL injection

---

## Data Integrity Rules

1. **Cascading Deletes:**
   - Delete user → cascade to farms, orders, reviews
   - Delete farm → cascade to crops, sensors, products
   - Delete order → cascade to order_items

2. **Restrict Deletes:**
   - Cannot delete order if payment exists
   - Cannot delete product if order_items reference it

3. **Referential Integrity:**
   - All foreign keys enforced at database level
   - No orphaned records allowed

---

**END OF POSTGRESQL SCHEMA**
