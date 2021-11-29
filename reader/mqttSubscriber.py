import paho.mqtt.client as mqtt


class MqttSubscriber:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client: mqtt.Client, userdata, flags, rc):
        print("Connected with result code " + str(rc))

        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        client.subscribe("$SYS/#")

    def on_message(self, client: mqtt.Client, userdata, msg: mqtt.MQTTMessage):
        print(msg.topic + " " + str(msg.payload))

    def connectAndWait(self, host: str, port: int):
        self.client.connect(host, port, 60)

        self.client.loop_forever()
