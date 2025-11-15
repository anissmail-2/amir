#!/usr/bin/env python3
"""
SUFMS IoT Sensor Simulator
Simulates multiple farm sensors publishing data via MQTT
"""

import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime
import sys

# MQTT Configuration
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC_PATTERN = "sensors/{farm_id}/{sensor_id}/data"

# Simulated sensors configuration
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
    {
        "id": "sensor-ph-1",
        "farm_id": "farm-demo-1",
        "name": "pH Sensor 1",
        "type": "ph",
        "unit": "pH",
        "min": 6.0,
        "max": 7.5,
    },
    {
        "id": "sensor-temp-1",
        "farm_id": "farm-demo-1",
        "name": "Temperature Sensor 1",
        "type": "temperature",
        "unit": "°C",
        "min": 15,
        "max": 30,
    },
    {
        "id": "sensor-humidity-1",
        "farm_id": "farm-demo-1",
        "name": "Humidity Sensor 1",
        "type": "humidity",
        "unit": "%",
        "min": 40,
        "max": 80,
    },
    {
        "id": "sensor-light-1",
        "farm_id": "farm-demo-1",
        "name": "Light Sensor 1",
        "type": "light",
        "unit": "lux",
        "min": 1000,
        "max": 50000,
    },
]


class SensorSimulator:
    def __init__(self, broker, port):
        self.broker = broker
        self.port = port
        self.client = mqtt.Client(client_id="sufms-iot-simulator")
        self.connected = False

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"✅ Connected to MQTT broker at {self.broker}:{self.port}")
            self.connected = True
        else:
            print(f"❌ Failed to connect to MQTT broker. Return code: {rc}")
            self.connected = False

    def on_disconnect(self, client, userdata, rc):
        print(f"⚠️  Disconnected from MQTT broker. Return code: {rc}")
        self.connected = False

    def on_publish(self, client, userdata, mid):
        pass  # Message published successfully

    def connect(self):
        """Connect to MQTT broker"""
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        self.client.on_publish = self.on_publish

        try:
            self.client.connect(self.broker, self.port, 60)
            self.client.loop_start()
            time.sleep(2)  # Wait for connection
            return self.connected
        except Exception as e:
            print(f"❌ Error connecting to MQTT broker: {e}")
            return False

    def disconnect(self):
        """Disconnect from MQTT broker"""
        self.client.loop_stop()
        self.client.disconnect()
        print("👋 Disconnected from MQTT broker")

    def generate_reading(self, sensor):
        """Generate realistic sensor reading"""
        # Add some variation and noise
        base_value = random.uniform(sensor["min"], sensor["max"])

        # Round based on sensor type
        if sensor["type"] == "ph":
            value = round(base_value, 2)
        elif sensor["type"] in ["soil_moisture", "humidity"]:
            value = round(base_value, 1)
        elif sensor["type"] == "temperature":
            value = round(base_value, 1)
        elif sensor["type"] == "light":
            value = round(base_value, 0)
        else:
            value = round(base_value, 2)

        return value

    def publish_reading(self, sensor):
        """Publish sensor reading to MQTT"""
        if not self.connected:
            print("⚠️  Not connected to MQTT broker")
            return False

        value = self.generate_reading(sensor)

        message = {
            "sensor_id": sensor["id"],
            "sensor_type": sensor["type"],
            "value": value,
            "unit": sensor["unit"],
            "battery_level": round(random.uniform(70, 100), 1),
            "signal_strength": random.randint(-70, -40),
            "timestamp": datetime.now().isoformat(),
        }

        topic = MQTT_TOPIC_PATTERN.format(
            farm_id=sensor["farm_id"], sensor_id=sensor["id"]
        )

        try:
            result = self.client.publish(topic, json.dumps(message), qos=1)
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(
                    f"📡 [{datetime.now().strftime('%H:%M:%S')}] {sensor['name']}: {value} {sensor['unit']}"
                )
                return True
            else:
                print(f"❌ Failed to publish message. Error code: {result.rc}")
                return False
        except Exception as e:
            print(f"❌ Error publishing message: {e}")
            return False

    def run(self, sensors, interval=10):
        """Run sensor simulation loop"""
        print("\n🚀 Starting SUFMS IoT Sensor Simulator")
        print(f"📍 Broker: {self.broker}:{self.port}")
        print(f"⏱️  Interval: {interval} seconds")
        print(f"🔢 Sensors: {len(sensors)}\n")

        for i, sensor in enumerate(sensors, 1):
            print(
                f"  {i}. {sensor['name']} ({sensor['type']}) - {sensor['id']}"
            )

        print("\n🔄 Publishing sensor data...\n")

        iteration = 0
        try:
            while True:
                iteration += 1
                print(f"\n--- Iteration {iteration} ---")

                for sensor in sensors:
                    self.publish_reading(sensor)
                    time.sleep(0.5)  # Small delay between sensors

                print(f"\n⏳ Waiting {interval} seconds...")
                time.sleep(interval)

        except KeyboardInterrupt:
            print("\n\n⛔ Stopping simulator...")
        except Exception as e:
            print(f"\n❌ Error in simulation loop: {e}")
        finally:
            self.disconnect()


def main():
    """Main function"""
    print("=" * 60)
    print("SUFMS IoT Sensor Simulator")
    print("=" * 60)

    simulator = SensorSimulator(MQTT_BROKER, MQTT_PORT)

    if not simulator.connect():
        print("\n❌ Failed to connect to MQTT broker.")
        print(f"   Make sure Mosquitto is running on {MQTT_BROKER}:{MQTT_PORT}")
        print("\n   To install and run Mosquitto:")
        print("   - Ubuntu/Debian: sudo apt-get install mosquitto")
        print("   - macOS: brew install mosquitto")
        print("   - Docker: docker run -d -p 1883:1883 eclipse-mosquitto")
        sys.exit(1)

    # Run simulator with 10-second interval
    simulator.run(SENSORS, interval=10)


if __name__ == "__main__":
    main()
