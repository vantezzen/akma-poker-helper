from mqtt.MqttSubscriber import MqttSubscriber


def main():
    """
    Main program function
    """
    mqtt_subscriber = MqttSubscriber("test.mosquitto.org", "akma/poker/cards")
    mqtt_subscriber.connect_and_wait()


if __name__ == "__main__":
    main()
