import MQTT from "async-mqtt";

const mqttAdress: string = "mqtt://broker.hivemq.com";
const mqtt = MQTT.connect(mqttAdress);

const sendTestData = async () => {
  console.log("Starting");
  try {
    await mqtt.publish(
      "akma/poker/state",
      JSON.stringify({
        desk: [
          {
            suit: "diamonds",
            rank: "A",
          },
          {
            suit: "diamonds",
            rank: "6",
          },
          {
            suit: "diamonds",
            rank: "Q",
          },
          {
            suit: "diamonds",
            rank: "K",
          },
          {
            suit: "clubs",
            rank: "4",
          },
        ],
        hands: {
          "1": [
            {
              suit: "spades",
              rank: "A",
            },
            {
              suit: "clubs",
              rank: "8",
            },
          ],
          "2": [
            {
              suit: "diamonds",
              rank: "J",
            },
            {
              suit: "diamonds",
              rank: "10",
            },
          ],
          "3": [
            {
              suit: "clubs",
              rank: "A",
            },
            {
              suit: "spades",
              rank: "8",
            },
          ],
          "4": [
            {
              suit: "spades",
              rank: "J",
            },
            {
              suit: "clubs",
              rank: "7",
            },
          ],
        },
        foldedPlayers: {
          "1": false,
          "2": true,
          "3": false,
          "4": false,
        },
        nextCard: -1, //-1 keine mehr, 0 desk, 1-16 player
        smallBlind: 1,
        bigBlind: 2,
      })
    );
    await mqtt.end();
    console.log("Done");
  } catch (e: any) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
};

mqtt.on("connect", sendTestData);
