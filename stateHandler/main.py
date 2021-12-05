import threading

from SessionManager import SessionManager
from mqtt.MqttPublisherState import MqttPublisherState
from mqtt.MqttSubscriberCards import MqttSubscriberCards
from mqtt.MqttSubscriberCommands import MqttSubscriberCommands

mqttHost = "broker.hivemq.com"
mqttPublisherState = MqttPublisherState(mqttHost)
sessionManager = SessionManager(mqttPublisherState)


def state_publisher():
    mqttPublisherState.connect_and_wait()


def card_subscriber():
    mqtt_subscriber_cards = MqttSubscriberCards(sessionManager, mqttHost)
    mqtt_subscriber_cards.connect_and_wait()


def command_subscriber():
    mqtt_subscriber_commands = MqttSubscriberCommands(sessionManager, mqttHost)
    mqtt_subscriber_commands.connect_and_wait()


def main():
    """
    Main program function
    """
    t1 = threading.Thread(target=card_subscriber)
    t2 = threading.Thread(target=command_subscriber)
    t3 = threading.Thread(target=state_publisher)

    t1.start()
    t2.start()
    t3.start()

    t1.join()
    t2.join()
    t3.join()


if __name__ == "__main__":
    main()
