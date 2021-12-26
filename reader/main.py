import threading

from pirc522 import RFID

from ReadHelper import ReadHelper
from mqtt.MqttPublisherCard import MqttPublisherCard

mqttHost = "broker.hivemq.com"
mqttPublisherCard = MqttPublisherCard(mqttHost)


def card_publisher():
    mqttPublisherCard.connect_and_wait()


def card_reader():
    reader = RFID(bus=3)
    print("Start waiting for cards")
    helper = ReadHelper(MqttPublisherCard(mqttHost))
    try:
        while True:
            reader.wait_for_tag()
            (error, data) = reader.request()
            if not error:
                (error, uid) = reader.anticoll()
                if not error:
                    if not reader.select_tag(uid):
                        helper.got_card(reader, uid)

    finally:
        # Calls GPIO cleanup
        reader.cleanup()


def main():
    """
    Main program function
    """
    t1 = threading.Thread(target=card_reader)
    t2 = threading.Thread(target=card_publisher)

    t1.start()
    t2.start()

    t1.join()
    t2.join()


if __name__ == "__main__":
    main()
