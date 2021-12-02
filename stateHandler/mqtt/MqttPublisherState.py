import json

from paho.mqtt.client import Client

from mqtt.MqttClient import MqttClient
from sessionDTO import SessionDTO


class MqttPublisherState(MqttClient):
    topic = "akma/poker/state"

    def __init__(self, host: str):
        super().__init__(host)
        self.get_client().on_connect = self.__on_connect

    def __on_connect(self, client: Client, userdata, flags, rc):
        print("MqttPublisherState Connected to Mqtt with result code " + str(rc))

    def write_state(self, state: SessionDTO):
        self.get_client().publish(MqttPublisherState.topic, json.dumps(state))
