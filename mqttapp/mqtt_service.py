import paho.mqtt.client as mqtt
import ssl
import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import time

BROKER = "628b16d470ab4ba7941574d76fb1e9a4.s1.eu.hivemq.cloud"
PORT = 8883
USERNAME = "Sisaket1961"
PASSWORD = "Kala1961"

SUBSCRIBE_TOPICS = ["100M1/Data", "100Y1/Data", "100Y2/Data", "analog", "recipe"]

channel_layer = get_channel_layer()

class MqttClient:
    client = mqtt.Client()
    connected = False

    @classmethod
    def on_connect(cls, client, userdata, flags, rc):
        if rc == 0:
            cls.connected = True
            print("Connected successfully to HiveMQ broker")
            for topic in SUBSCRIBE_TOPICS:
                client.subscribe(topic)
                print(f"Subscribed to topic: {topic}")
        else:
            cls.connected = False
            print(f"Connection failed with code {rc}")

    @classmethod
    def on_disconnect(cls, client, userdata, rc):
        cls.connected = False
        print("Disconnected from MQTT broker, trying to reconnect...")

    @classmethod
    def on_message(cls, client, userdata, msg):
        topic = msg.topic
        try:
            message = json.loads(msg.payload.decode())
            print(f"Received message on topic '{topic}': {message}")
            async_to_sync(channel_layer.group_send)(
                "mqtt_group",
                {
                    "type": "mqtt_message",
                    "topic": topic,
                    "message": message,
                }
            )
        except json.JSONDecodeError:
            print(f"Failed to decode JSON message on topic '{topic}': {msg.payload.decode()}")

    @classmethod
    def publish_message(cls, topic, subtopic, value):
        if not cls.connected:
            print("Attempting to reconnect...")
            cls.start()
            time.sleep(1)  # Give time to reconnect

        if cls.connected:
            full_topic = f"{topic}/{subtopic}"
            message = json.dumps(value) if isinstance(value, (bool, dict)) else str(value)
            result = cls.client.publish(full_topic, message)
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(f"Message published successfully to {full_topic}: {message}")
                return True
            else:
                print(f"Failed to publish message to {full_topic}")
                return False
        else:
            print("Failed to publish: Client not connected")
            return False

   
    @classmethod
    def start(cls):
    # Check if the client is already connected to avoid reconfiguration
        if cls.connected:
           print("MQTT client already connected.")
           return

    # Check if the client has already been initialized with SSL/TLS to prevent reconfiguration errors
        if not hasattr(cls.client, '_tls_configured'):
           cls.client.username_pw_set(USERNAME, PASSWORD)
           cls.client.tls_set(cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLS)
           cls.client.tls_insecure_set(False)
           cls.client._tls_configured = True  # Custom attribute to mark SSL/TLS as configured

        cls.client.on_connect = cls.on_connect
        cls.client.on_disconnect = cls.on_disconnect
        cls.client.on_message = cls.on_message

        try:
           cls.client.connect(BROKER, PORT, 60)
           cls.client.loop_start()  # Start loop in a non-blocking way
           print("Started MQTT client loop, waiting for connection...")

        # Wait until connected, with a timeout
           start_time = time.time()
           while not cls.connected and time.time() - start_time < 10:
              time.sleep(0.5)  # Check connection status every 0.5 seconds

           if cls.connected:
              print("Connection established")
           else:
              print("Failed to establish connection within timeout")
            
        except Exception as e:
           print(f"Failed to connect to MQTT broker: {e}")
 

    @classmethod
    def stop(cls):
        if cls.connected:
            cls.client.loop_stop()
            cls.client.disconnect()
            cls.connected = False
            print("Disconnected from MQTT broker")
