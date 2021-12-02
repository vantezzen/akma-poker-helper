import json

from paho.mqtt.client import MQTTMessage, Client

from SessionManager import SessionManager
from mqtt.MqttSubscriber import MqttSubscriber


class MqttSubscriberCommands(MqttSubscriber):
    topics = ["akma/poker/command/revertLast",
              "akma/poker/command/startRound",
              "akma/poker/command/endRound"]

    def __init__(self, session_manager: SessionManager, host: str, port: int = 1883):
        super().__init__(host, MqttSubscriberCommands.topics, port)
        self.__sessionManager = session_manager

    def __on_message(self, client: Client, userdata, msg: MQTTMessage):
        print(msg.topic + " " + str(msg.payload))
        if msg.topic == MqttSubscriberCommands.topics[0]:
            self.__sessionManager.revert_last()
            print()
        elif msg.topic == MqttSubscriberCommands.topics[1]:
            self.__sessionManager.start_round(json.load(msg.payload))
            print()
        elif msg.topic == MqttSubscriberCommands.topics[2]:
            print()
        else:
            raise RuntimeError("wrong topic received")
