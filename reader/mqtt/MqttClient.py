from paho.mqtt.client import Client


class MqttClient:
    def __init__(self, host: str, port: int = 1883):
        self.__port = port
        self.__host = host
        self.__client = Client()

    def _connect(self):
        self.__client.connect(self.__host, self.__port, 60)

    def get_client(self):
        return self.__client
