from typing import List

from paho.mqtt.client import Client, MQTTMessage

from mqtt.MqttClient import MqttClient


class MqttSubscriber(MqttClient):
    def __init__(self, host: str, topics: List[str], port: int = 1883):
        super().__init__(host, port)
        self.__topics = topics
        self.__client.on_connect = self.__on_connect
        self.__client.on_message = self.__on_message

    def __on_connect(self, client: Client, userdata, flags, rc):
        print("Connected with result code " + str(rc))

        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        for topic in self.__topics:
            self.__client.subscribe(topic)

    def __on_message(self, client: Client, userdata, msg: MQTTMessage):
        print(msg.topic + " " + str(msg.payload))

    def connect_and_wait(self):
        super()._connect()
        self.__client.loop_forever()
