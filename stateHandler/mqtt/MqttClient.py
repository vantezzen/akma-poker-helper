from paho.mqtt.client import Client


class MqttClient:
    def __init__(self, host: str, port: int = 1883):
        self.__port = port
        self.__host = host
        self.__client = Client()

    def get_client(self):
        return self.__client

    def connect_and_wait(self):
        self.__client.connect(self.__host, self.__port, 60)
        self.get_client().loop_forever(60)
