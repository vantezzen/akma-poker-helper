import json

from paho.mqtt.client import Client

from Card import Card
from mqtt.MqttClient import MqttClient


class MqttPublisherCard(MqttClient):
    topic = "akma/poker/card"

    def __init__(self, host: str):
        super().__init__(host)
        self.get_client().on_connect = self.__on_connect

    def __on_connect(self, client: Client, userdata, flags, rc):
        print("MqttPublisherState Connected to Mqtt with result code " + str(rc))

    def write_card(self, card: Card):
        print("Send Data: { suit:" + card.suit + ", rank:" + card.rank + " }")
        self.get_client().publish(MqttPublisherCard.topic, json.dumps(card.__dict__))
