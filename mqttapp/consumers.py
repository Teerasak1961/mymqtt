# mqttapp/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .mqtt_service import MqttClient  # Note the dot (.) before mqtt_service

class MqttConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("mqtt_group", self.channel_name)
        await self.accept()
        print("WebSocket connection established")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("mqtt_group", self.channel_name)
        print(f"WebSocket disconnected with code: {close_code}")

    async def receive(self, text_data):
        print(f"Received message from client: {text_data}")
        try:
            # Parse the incoming message
            data = json.loads(text_data)
            topic = data.get('topic')
            message = data.get('message')
            
            if not topic:
                raise ValueError("Topic is required")

            # Split the topic into main topic and subtopic
            topic_parts = topic.split('/')
            if len(topic_parts) != 2:
                raise ValueError("Invalid topic format. Expected format: device/command")

            main_topic = topic_parts[0]
            subtopic = topic_parts[1]

            # Publish using your MQTT client
            success = MqttClient.publish_message(main_topic, subtopic, message)

            if success:
                response = {
                    'type': 'publish_response',
                    'status': 'success',
                    'topic': topic,
                    'message': message
                }
                print(f"Successfully published to {topic}: {message}")
            else:
                response = {
                    'type': 'publish_response',
                    'status': 'error',
                    'message': 'Failed to publish message'
                }
                print(f"Failed to publish to {topic}")

            # Send response back to WebSocket client
            await self.send(text_data=json.dumps(response))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'publish_response',
                'status': 'error',
                'message': 'Invalid JSON format'
            }))
        except ValueError as e:
            await self.send(text_data=json.dumps({
                'type': 'publish_response',
                'status': 'error',
                'message': str(e)
            }))
        except Exception as e:
            print(f"Error publishing message: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'publish_response',
                'status': 'error',
                'message': f'Unexpected error: {str(e)}'
            }))

    async def mqtt_message(self, event):
        print(f"Sending MQTT message to WebSocket: {event}")
        topic = event['topic']
        message = event['message']
        
        await self.send(text_data=json.dumps({
            'type': 'mqtt_message',
            'topic': topic,
            'message': message
        }))
        
        if topic in ['100M1/Data', '100Y1/Data', '100Y2/Data']:
            await self.handle_device_data(topic, message)
        elif topic == 'analog':
            await self.handle_analog_data(message)
        elif topic == 'recipe':
            await self.handle_recipe_data(message)


    async def handle_device_data(self, topic, data):
        device = topic.split('/')[0]
        print(f"Handling device data for {device}: {data}")

    async def handle_analog_data(self, data):
        print(f"Handling analog data: {data}")

    async def handle_recipe_data(self, data):
        print(f"Handling recipe data: {data}")    