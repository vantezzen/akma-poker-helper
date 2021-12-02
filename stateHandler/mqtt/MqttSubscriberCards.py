from paho.mqtt.client import MQTTMessage, Client

from SessionManager import SessionManager
from mqtt.MqttSubscriber import MqttSubscriber


class MqttSubscriberCards(MqttSubscriber):
    topics = ["akma/poker/card"]

    def __init__(self, session_manager: SessionManager, host: str, port: int = 1883):
        super().__init__(host, MqttSubscriberCards.topics, port)
        self.__sessionManager = session_manager

    def __on_message(self, client: Client, userdata, msg: MQTTMessage):
        print(msg.topic + " " + str(msg.payload))
