# mqttapp/apps.py
from django.apps import AppConfig

class MqttappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mqttapp'

    def ready(self):
        from .mqtt_service import MqttClient
        MqttClient.start()