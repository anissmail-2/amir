# SUFMS IoT Sensor Simulator

Python script that simulates multiple farm sensors publishing data via MQTT.

## Features

- Simulates 5 different sensor types
- Realistic value generation with randomization
- MQTT protocol for communication
- Configurable publish interval
- Auto-reconnection on connection loss

## Simulated Sensors

1. **Soil Moisture Sensor** - 30-60%
2. **pH Sensor** - 6.0-7.5 pH
3. **Temperature Sensor** - 15-30°C
4. **Humidity Sensor** - 40-80%
5. **Light Sensor** - 1000-50000 lux

## Prerequisites

- Python 3.7+
- MQTT broker (Mosquitto) running on `localhost:1883`

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

## Running the Simulator

```bash
# Make script executable
chmod +x sensor_simulator.py

# Run simulator
python sensor_simulator.py
```

The simulator will publish sensor readings every 10 seconds to topics following the pattern:
```
sensors/{farm_id}/{sensor_id}/data
```

## MQTT Message Format

```json
{
  "sensor_id": "sensor-soil-1",
  "sensor_type": "soil_moisture",
  "value": 45.2,
  "unit": "%",
  "battery_level": 87.5,
  "signal_strength": -65,
  "timestamp": "2025-11-15T10:30:00.123456"
}
```

## Configuration

Edit the `SENSORS` list in `sensor_simulator.py` to configure simulated sensors:

```python
SENSORS = [
    {
        "id": "sensor-soil-1",
        "farm_id": "farm-demo-1",
        "name": "Soil Moisture Sensor 1",
        "type": "soil_moisture",
        "unit": "%",
        "min": 30,
        "max": 60,
    },
    # Add more sensors...
]
```

## Installing Mosquitto MQTT Broker

**Ubuntu/Debian:**
```bash
sudo apt-get install mosquitto mosquitto-clients
sudo systemctl start mosquitto
```

**macOS:**
```bash
brew install mosquitto
brew services start mosquitto
```

**Docker:**
```bash
docker run -d -p 1883:1883 --name mosquitto eclipse-mosquitto
```

## Testing MQTT Connection

```bash
# Subscribe to all sensor topics
mosquitto_sub -h localhost -t "sensors/#" -v

# In another terminal, run the simulator
python sensor_simulator.py
```

## Stopping the Simulator

Press `Ctrl+C` to gracefully stop the simulator.

## Integration with SUFMS Backend

The backend automatically subscribes to the `sensors/+/+/data` topic and:
- Saves sensor readings to the database
- Checks thresholds and generates alerts
- Updates sensor status

## Troubleshooting

**Connection refused:**
- Make sure Mosquitto is running: `sudo systemctl status mosquitto`
- Check if port 1883 is open: `netstat -an | grep 1883`

**No data in backend:**
- Check backend MQTT service is connected
- Verify sensor IDs exist in the database
- Check backend logs for errors

## License

MIT
