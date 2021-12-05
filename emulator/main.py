import threading

from Card import Card
from mqtt.MqttPublisherCard import MqttPublisherCard

mqttHost = "test.mosquitto.org"
mqttPublisherState = MqttPublisherCard(mqttHost)


def card_publisher():
    mqttPublisherState.connect_and_wait()


def reader():
    while True:
        suit = ""
        while suit == "":
            print('Write suit ["h","d","s","c"] or q to quit')
            value = input()
            if value == "q":
                return
            elif value == "h":
                suit = "hearts"
            elif value == "d":
                suit = "diamonds"
            elif value == "s":
                suit = "spades"
            elif value == "c":
                suit = "clubs"

        rank = ""
        while rank == "":
            print('Write rank ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] or q to quit')
            value = input()
            if value == "q":
                return
            elif value in ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]:
                rank = value

        mqttPublisherState.write_card(Card(suit, rank))


def main():
    """
    Main program function
    """
    t1 = threading.Thread(target=reader)
    t2 = threading.Thread(target=card_publisher)

    t1.start()
    t2.start()

    t1.join()
    t2.join()


if __name__ == "__main__":
    main()
