# InfluxDB Time-Series Database Schema
## Smart Urban Farming Management System (SUFMS)

---

## Overview

**Database Type:** InfluxDB 2.x (Time-Series Database)
**Purpose:** Store high-frequency IoT sensor readings optimized for time-based queries
**Retention Policy:** 2 years (then archive to cold storage)

---

## Why InfluxDB?

**Time-Series Optimized:**
- Designed for time-stamped data (sensor readings)
- Efficient storage and compression
- Fast aggregation queries (AVG, MIN, MAX over time ranges)
- Down-sampling and continuous queries

**Performance:**
- 10x faster than PostgreSQL for time-series data
- Handles millions of data points per second
- Optimized for write-heavy workloads

---

## InfluxDB Data Model

InfluxDB uses **measurements** (similar to tables), **tags** (indexed metadata), and **fields** (actual data values).

---

## Measurement: `sensor_readings`

Stores all IoT sensor readings with timestamps.

### Tags (Indexed, for querying)

| Tag Key | Data Type | Description | Example Values |
|---------|-----------|-------------|----------------|
| **sensor_id** | String | UUID of sensor | "550e8400-e29b-41d4-a716-446655440000" |
| **farm_id** | String | UUID of farm | "123e4567-e89b-12d3-a456-426614174000" |
| **sensor_type** | String | Type of sensor | "SoilMoisture", "pH", "Temperature", "Humidity", "Light" |
| **location** | String | Sensor location | "Plot-A", "Greenhouse-1", "Rooftop-North" |

### Fields (Actual measured values)

| Field Key | Data Type | Description | Unit | Range |
|-----------|-----------|-------------|------|-------|
| **value** | Float | Sensor reading | Varies by type | Sensor-specific |
| **battery_level** | Integer | Sensor battery % | % | 0-100 |
| **signal_strength** | Integer | MQTT signal strength | dBm | -120 to 0 |

### Timestamp

- Automatically stored by InfluxDB
- Nanosecond precision
- UTC timezone

---

## Measurement Schema Example

```
sensor_readings,sensor_id=550e8400-e29b-41d4-a716-446655440000,farm_id=123e4567-e89b-12d3-a456-426614174000,sensor_type=SoilMoisture,location=Plot-A value=42.5,battery_level=87,signal_strength=-45 1699200000000000000
```

**Breakdown:**
- **Measurement:** `sensor_readings`
- **Tags:** `sensor_id`, `farm_id`, `sensor_type`, `location`
- **Fields:** `value=42.5`, `battery_level=87`, `signal_strength=-45`
- **Timestamp:** `1699200000000000000` (nanoseconds since Unix epoch)

---

## Common Queries

### 1. Get Latest Reading for a Sensor

```flux
from(bucket: "sufms")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_id"] == "550e8400-e29b-41d4-a716-446655440000")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()
```

### 2. Get Sensor Data for Last 24 Hours

```flux
from(bucket: "sufms")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_id"] == "550e8400-e29b-41d4-a716-446655440000")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 15m, fn: mean, createEmpty: false)
```

### 3. Get All Sensors for a Farm

```flux
from(bucket: "sufms")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["farm_id"] == "123e4567-e89b-12d3-a456-426614174000")
  |> group(columns: ["sensor_id", "sensor_type"])
  |> last()
```

### 4. Detect Threshold Violations

```flux
from(bucket: "sufms")
  |> range(start: -15m)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_type"] == "SoilMoisture")
  |> filter(fn: (r) => r["_field"] == "value")
  |> filter(fn: (r) => r["_value"] < 20.0 or r["_value"] > 80.0)
```

### 5. Calculate Daily Averages

```flux
from(bucket: "sufms")
  |> range(start: -7d)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["sensor_id"] == "550e8400-e29b-41d4-a716-446655440000")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
```

---

## Buckets (Data Retention)

InfluxDB organizes data into **buckets** with retention policies.

### Bucket Configuration

| Bucket Name | Retention Period | Purpose |
|-------------|------------------|---------|
| **sufms** | 2 years | Primary sensor data |
| **sufms_downsampled_1h** | 5 years | Hourly aggregates (for long-term trends) |
| **sufms_downsampled_1d** | 10 years | Daily aggregates (for historical analysis) |

---

## Down-Sampling Tasks

Continuous queries that pre-aggregate data for faster queries.

### Task: Hourly Down-sampling

```flux
option task = {name: "downsample_1h", every: 1h}

from(bucket: "sufms")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
  |> set(key: "_measurement", value: "sensor_readings_1h")
  |> to(bucket: "sufms_downsampled_1h")
```

### Task: Daily Down-sampling

```flux
option task = {name: "downsample_1d", every: 1d}

from(bucket: "sufms")
  |> range(start: -1d)
  |> filter(fn: (r) => r["_measurement"] == "sensor_readings")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
  |> set(key: "_measurement", value: "sensor_readings_1d")
  |> to(bucket: "sufms_downsampled_1d")
```

---

## Data Ingestion

### MQTT → InfluxDB Pipeline

**1. Sensor publishes to MQTT:**
```
Topic: sufms/farm/<farm_id>/sensor/<sensor_id>
Payload: {"value": 42.5, "battery": 87, "signal": -45}
```

**2. SensorDataIngestion Service subscribes:**
```javascript
mqttClient.on('message', async (topic, message) => {
  const data = JSON.parse(message.toString());
  const sensorId = extractSensorId(topic);
  const farmId = extractFarmId(topic);

  // Write to InfluxDB
  const point = new Point('sensor_readings')
    .tag('sensor_id', sensorId)
    .tag('farm_id', farmId)
    .tag('sensor_type', getSensorType(sensorId))
    .floatField('value', data.value)
    .intField('battery_level', data.battery)
    .intField('signal_strength', data.signal)
    .timestamp(new Date());

  await writeApi.writePoint(point);
  await writeApi.flush();
});
```

---

## Indexing Strategy

InfluxDB automatically indexes:
- **Time** (primary index)
- **Tags** (secondary indexes: sensor_id, farm_id, sensor_type)

**Do NOT index:**
- **Fields** (value, battery_level, signal_strength) - not indexed in InfluxDB

---

## Query Performance Optimization

**1. Use Time Ranges:**
Always specify time ranges to limit scan scope
```flux
|> range(start: -24h, stop: now())
```

**2. Filter on Tags Early:**
Filter by tags before processing fields
```flux
|> filter(fn: (r) => r["sensor_id"] == "...")
|> filter(fn: (r) => r["_field"] == "value")
```

**3. Use Down-sampled Data:**
For long time ranges, query pre-aggregated buckets
```flux
from(bucket: "sufms_downsampled_1d")  // Instead of "sufms"
  |> range(start: -1y)
```

**4. Limit Result Size:**
Use `limit()` or `aggregateWindow()` to reduce data points
```flux
|> aggregateWindow(every: 15m, fn: mean)
|> limit(n: 1000)
```

---

## Data Model Best Practices

**✅ Good Practices:**
1. Use tags for metadata that you filter/group by (sensor_id, farm_id, sensor_type)
2. Use fields for actual measured values (value, battery_level)
3. Keep tag cardinality low (< 100,000 unique combinations)
4. Use consistent measurement names across sensors

**❌ Bad Practices:**
1. Don't use high-cardinality tags (e.g., timestamp strings as tags)
2. Don't store metadata in field names
3. Avoid storing JSON in fields
4. Don't use spaces in measurement/tag/field names

---

## Backup & Recovery

**Backup Strategy:**
```bash
# Daily backups
influx backup /backups/sufms-$(date +%Y%m%d) \
  --bucket sufms \
  --token $INFLUX_TOKEN

# Retention: Keep 30 days of backups
```

**Restore:**
```bash
influx restore /backups/sufms-20251101 \
  --bucket sufms \
  --token $INFLUX_TOKEN
```

---

## Capacity Planning

**Storage Calculation:**

**Assumptions:**
- 100 farms
- 5 sensors per farm = 500 sensors total
- 1 reading per sensor every 15 minutes = 4 readings/hour
- 500 sensors × 4 readings/hour × 24 hours = 48,000 readings/day

**Storage per reading:** ~100 bytes (with compression)
**Daily storage:** 48,000 × 100 bytes = 4.8 MB/day
**Monthly storage:** 4.8 MB × 30 = 144 MB/month
**Yearly storage:** 144 MB × 12 = 1.7 GB/year
**2-year retention:** 1.7 GB × 2 = **3.4 GB**

**With 1,000 farms (scale 10x):** ~34 GB for 2 years

---

## Integration with PostgreSQL

**Metadata in PostgreSQL, Time-Series in InfluxDB:**

1. **Sensor metadata** stored in PostgreSQL (sensor_id, sensor_type, farm_id, calibration_date)
2. **Sensor readings** stored in InfluxDB (time-stamped values)
3. **Thresholds** stored in PostgreSQL (min_value, max_value)
4. **Alerts** generated in PostgreSQL when InfluxDB readings violate thresholds

**Hybrid Query Example:**
```javascript
// 1. Get sensor metadata from PostgreSQL
const sensor = await db.query(
  'SELECT sensor_id, sensor_type, farm_id FROM sensors WHERE sensor_id = $1',
  [sensorId]
);

// 2. Get latest reading from InfluxDB
const reading = await influxQuery(`
  from(bucket: "sufms")
    |> range(start: -1h)
    |> filter(fn: (r) => r["sensor_id"] == "${sensorId}")
    |> last()
`);

// 3. Get threshold from PostgreSQL
const threshold = await db.query(
  'SELECT min_value, max_value FROM thresholds WHERE sensor_id = $1',
  [sensorId]
);

// 4. Compare and create alert if needed
if (reading.value < threshold.min_value || reading.value > threshold.max_value) {
  await db.query(
    'INSERT INTO alerts (sensor_id, farm_id, user_id, alert_type, severity, message, sensor_value) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [sensorId, farmId, userId, alertType, severity, message, reading.value]
  );
}
```

---

**END OF INFLUXDB SCHEMA**
