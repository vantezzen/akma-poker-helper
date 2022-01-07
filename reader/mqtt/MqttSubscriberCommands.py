from paho.mqtt.client import MQTTMessage, Client

from ReadHelper import ReadHelper
from mqtt.MqttSubscriber import MqttSubscriber


class MqttSubscriberCommands(MqttSubscriber):
    topics = ["akma/poker/command/revertLast",
              "akma/poker/command/startRound",
              "akma/poker/command/endRound",
              "akma/poker/command/fold"]

    def __init__(self, read_helper: ReadHelper, host: str, port: int = 1883):
        super().__init__(host, MqttSubscriberCommands.topics, port)
        self.__readHelper = read_helper
        self.get_client().on_message = self.__on_message

    def __on_message(self, client: Client, userdata, msg: MQTTMessage):
        print("MqttSubscriberCommands: " + msg.topic + " " + str(msg.payload))
        if msg.topic == MqttSubscriberCommands.topics[0]:
            pass
        elif msg.topic == MqttSubscriberCommands.topics[1]:
            self.__readHelper.clear_cards()
        elif msg.topic == MqttSubscriberCommands.topics[2]:
            pass
        elif msg.topic == MqttSubscriberCommands.topics[3]:
            pass
        else:
            raise RuntimeError("wrong topic received")
