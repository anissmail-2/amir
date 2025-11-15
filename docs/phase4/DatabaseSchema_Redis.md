# Redis Cache & Queue Schema
## Smart Urban Farming Management System (SUFMS)

---

## Overview

**Database Type:** Redis 7.x (In-Memory Data Store)
**Purpose:** Caching, session management, rate limiting, and message queues
**Data Structure:** Key-Value store with support for Strings, Hashes, Lists, Sets, Sorted Sets

---

## Why Redis?

**Performance:**
- In-memory storage (sub-millisecond latency)
- 100,000+ operations per second
- Reduces database load by 80%+

**Use Cases:**
- Session caching (JWT tokens, user sessions)
- API response caching
- Rate limiting (prevent abuse)
- Notification queues (pub/sub messaging)
- Real-time data (latest sensor readings)

---

## Redis Data Structures Used

1. **String:** Session tokens, cached API responses
2. **Hash:** User sessions, cached objects
3. **List:** Message queues, notification queues
4. **Set:** Unique collections (online users)
5. **Sorted Set:** Leaderboards, time-ordered data
6. **TTL (Time-To-Live):** Automatic expiration

---

## 1. Session Management

### User Session Cache

**Key Pattern:** `session:<user_id>`
**Data Type:** Hash
**TTL:** 24 hours (auto-refresh on activity)

**Structure:**
```redis
HSET session:550e8400-e29b-41d4-a716-446655440000
  user_id "550e8400-e29b-41d4-a716-446655440000"
  email "farmer@example.com"
  user_type "Farmer"
  login_time "2025-11-15T10:30:00Z"
  ip_address "192.168.1.100"
  user_agent "Mozilla/5.0..."

EXPIRE session:550e8400-e29b-41d4-a716-446655440000 86400
```

**Commands:**
```redis
# Create session
HSET session:<user_id> <field> <value>
EXPIRE session:<user_id> 86400

# Get session
HGETALL session:<user_id>

# Update last activity
HSET session:<user_id> last_activity <timestamp>
EXPIRE session:<user_id> 86400

# Delete session (logout)
DEL session:<user_id>
```

---

### JWT Token Blacklist

**Key Pattern:** `jwt:blacklist:<token_id>`
**Data Type:** String
**TTL:** Token expiration time

**Purpose:** Invalidate JWT tokens on logout before expiration

```redis
# Add token to blacklist
SET jwt:blacklist:abc123def456 "revoked" EX 86400

# Check if token blacklisted
EXISTS jwt:blacklist:abc123def456
```

---

## 2. API Response Caching

### Product Search Cache

**Key Pattern:** `cache:products:search:<query_hash>`
**Data Type:** String (JSON)
**TTL:** 5 minutes

**Example:**
```redis
SET cache:products:search:md5(tomatoes_5miles)
  '[{"product_id":"...","name":"Tomatoes",...}]'
  EX 300

# Retrieve cached search results
GET cache:products:search:md5(tomatoes_5miles)
```

---

### Sensor Data Cache

**Key Pattern:** `cache:sensor:<sensor_id>:latest`
**Data Type:** Hash
**TTL:** 1 minute

**Purpose:** Cache latest sensor reading to avoid frequent InfluxDB queries

```redis
HSET cache:sensor:550e8400:latest
  value "42.5"
  timestamp "2025-11-15T10:35:00Z"
  battery_level "87"
  status "Online"

EXPIRE cache:sensor:550e8400:latest 60
```

---

### Farm Dashboard Cache

**Key Pattern:** `cache:dashboard:<farm_id>`
**Data Type:** String (JSON)
**TTL:** 2 minutes

```redis
SET cache:dashboard:123e4567-e89b-12d3-a456-426614174000
  '{"sensors":[...],"alerts":[...],"crops":[...]}'
  EX 120
```

---

## 3. Rate Limiting

### API Rate Limiting

**Key Pattern:** `ratelimit:api:<user_id>:<endpoint>:<time_window>`
**Data Type:** String (counter)
**TTL:** Time window duration

**Limits:**
- 1000 requests per hour per user
- 100 requests per minute for search endpoints

```redis
# Increment request count
INCR ratelimit:api:550e8400:/api/products/search:20251115_10
EXPIRE ratelimit:api:550e8400:/api/products/search:20251115_10 3600

# Check if limit exceeded
GET ratelimit:api:550e8400:/api/products/search:20251115_10
# If value >= 100, reject request
```

---

### Login Attempt Tracking

**Key Pattern:** `ratelimit:login:<ip_address>`
**Data Type:** String (counter)
**TTL:** 15 minutes

**Purpose:** Prevent brute force attacks (10 failed attempts = lockout)

```redis
# Track failed login
INCR ratelimit:login:192.168.1.100
EXPIRE ratelimit:login:192.168.1.100 900

# Check attempts
GET ratelimit:login:192.168.1.100

# Reset on successful login
DEL ratelimit:login:192.168.1.100
```

---

## 4. Notification Queue

### Email Queue

**Key Pattern:** `queue:notifications:email`
**Data Type:** List (FIFO queue)

**Purpose:** Decouple notification sending from business logic

```redis
# Producer: Add notification to queue
LPUSH queue:notifications:email '{
  "user_id": "550e8400",
  "recipient": "farmer@example.com",
  "subject": "Alert: Low Soil Moisture",
  "body": "...",
  "priority": "high"
}'

# Consumer: Process notifications
BRPOP queue:notifications:email 5
```

---

### SMS Queue

**Key Pattern:** `queue:notifications:sms`
**Data Type:** List

```redis
LPUSH queue:notifications:sms '{
  "user_id": "550e8400",
  "phone": "+1234567890",
  "message": "Critical: Soil moisture below 15%"
}'
```

---

### Push Notification Queue

**Key Pattern:** `queue:notifications:push`
**Data Type:** List

```redis
LPUSH queue:notifications:push '{
  "user_id": "550e8400",
  "title": "New Order",
  "body": "You received a new order for Tomatoes",
  "data": {"order_id": "abc123"}
}'
```

---

### Failed Notifications (Dead Letter Queue)

**Key Pattern:** `queue:notifications:failed`
**Data Type:** List

**Purpose:** Store failed notifications for retry or manual intervention

```redis
LPUSH queue:notifications:failed '{
  "type": "email",
  "error": "SMTP connection failed",
  "original_message": {...},
  "retry_count": 3,
  "failed_at": "2025-11-15T10:40:00Z"
}'
```

---

## 5. Real-Time Data (Pub/Sub)

### Sensor Reading Updates

**Channel:** `sensor:updates:<farm_id>`
**Purpose:** Real-time sensor data push to WebSocket clients

```redis
# Publisher (SensorDataIngestion service)
PUBLISH sensor:updates:123e4567 '{
  "sensor_id": "550e8400",
  "sensor_type": "SoilMoisture",
  "value": 42.5,
  "timestamp": "2025-11-15T10:45:00Z"
}'

# Subscriber (WebSocket server)
SUBSCRIBE sensor:updates:123e4567
```

---

### Alert Broadcasts

**Channel:** `alerts:<user_id>`

```redis
PUBLISH alerts:550e8400 '{
  "alert_id": "alert123",
  "severity": "Critical",
  "message": "Soil moisture critically low"
}'
```

---

## 6. Geospatial Queries (Redis Geo)

### Nearby Farms Cache

**Key:** `geo:farms`
**Data Type:** Geospatial index

**Purpose:** Fast "farms near me" queries

```redis
# Add farms to geospatial index
GEOADD geo:farms
  -122.4194 37.7749 "farm:123e4567"  # San Francisco
  -118.2437 34.0522 "farm:456e7890"  # Los Angeles

# Find farms within 5 miles (8046 meters)
GEORADIUS geo:farms -122.4194 37.7749 8046 m WITHDIST
```

---

## 7. Sorted Sets (Leaderboards)

### Top Farms by Rating

**Key:** `leaderboard:farms:rating`
**Data Type:** Sorted Set

```redis
# Add farm with rating score
ZADD leaderboard:farms:rating 4.8 "farm:123e4567"
ZADD leaderboard:farms:rating 4.5 "farm:456e7890"

# Get top 10 farms
ZREVRANGE leaderboard:farms:rating 0 9 WITHSCORES
```

---

### Most Active Users (Last 7 Days)

**Key:** `leaderboard:users:active:week`
**Data Type:** Sorted Set (score = activity count)

```redis
# Increment user activity
ZINCRBY leaderboard:users:active:week 1 "user:550e8400"

# Get top 10 active users
ZREVRANGE leaderboard:users:active:week 0 9 WITHSCORES
```

---

## 8. Caching Strategies

### Cache-Aside Pattern

```javascript
async function getProduct(productId) {
  // 1. Try cache first
  const cached = await redis.get(`cache:product:${productId}`);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss - query database
  const product = await db.query('SELECT * FROM products WHERE product_id = $1', [productId]);

  // 3. Store in cache
  await redis.setex(`cache:product:${productId}`, 300, JSON.stringify(product));

  return product;
}
```

---

### Write-Through Cache

```javascript
async function updateProduct(productId, data) {
  // 1. Update database
  await db.query('UPDATE products SET ... WHERE product_id = $1', [productId]);

  // 2. Update cache
  await redis.setex(`cache:product:${productId}`, 300, JSON.stringify(data));

  // 3. Invalidate related caches
  await redis.del(`cache:products:search:*`);
}
```

---

## 9. Key Naming Conventions

**Pattern:** `<namespace>:<entity>:<identifier>[:<attribute>]`

**Examples:**
- `session:550e8400` (user session)
- `cache:sensor:550e8400:latest` (latest sensor reading)
- `queue:notifications:email` (email notification queue)
- `ratelimit:api:550e8400:/products:20251115_10` (rate limit for user/endpoint/hour)

---

## 10. Data Retention & Expiration

| Key Pattern | TTL | Auto-Expire? |
|-------------|-----|--------------|
| session:* | 24 hours | Yes (EXPIRE) |
| cache:product:* | 5 minutes | Yes |
| cache:sensor:*:latest | 1 minute | Yes |
| ratelimit:* | 1 hour | Yes |
| queue:notifications:* | No TTL | No (consumed by workers) |
| geo:farms | No TTL | No (updated manually) |
| jwt:blacklist:* | Token lifetime | Yes |

---

## 11. Redis Configuration

### redis.conf Settings

```conf
# Max memory
maxmemory 4gb
maxmemory-policy allkeys-lru  # Evict least recently used keys

# Persistence (optional for caching)
save 900 1       # Save after 900 sec if 1 key changed
save 300 10      # Save after 300 sec if 10 keys changed
save 60 10000    # Save after 60 sec if 10000 keys changed

# AOF (Append-Only File) for durability
appendonly yes
appendfsync everysec

# Max clients
maxclients 10000
```

---

## 12. Monitoring & Performance

### Key Metrics to Monitor

```redis
# Memory usage
INFO memory

# Keyspace info (number of keys, expirations)
INFO keyspace

# Command statistics
INFO commandstats

# Slow queries
SLOWLOG GET 10
```

---

## 13. Redis Cluster (Scalability)

For high availability and scaling:

**Sharding Strategy:**
- Shard by user_id (user sessions)
- Shard by farm_id (farm data)
- Replicate notification queues across nodes

**Redis Sentinel:**
- Automatic failover
- High availability (3-node cluster minimum)

---

## 14. Security

**1. Authentication:**
```conf
requirepass your_strong_password_here
```

**2. Network Security:**
- Bind to localhost only (if single server)
- Use TLS for client-server communication

**3. Disable Dangerous Commands:**
```conf
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
```

---

## 15. Client Libraries

**Node.js:**
```javascript
const Redis = require('ioredis');
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'your_password',
  db: 0
});
```

**Python:**
```python
import redis
r = redis.Redis(host='localhost', port=6379, db=0, password='your_password')
```

---

**END OF REDIS SCHEMA**
