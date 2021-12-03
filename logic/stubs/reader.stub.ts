import MQTT from "async-mqtt";

const mqtt = MQTT.connect("mqtt://test.mosquitto.org");

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
        ],
        hands: {
          "1": [
            {
              suit: "spades",
              rank: "A",
            },
            {
              suit: "clubs",
              rank: "A",
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
              suit: "diamonds",
              rank: "7",
            },
            {
              suit: "diamonds",
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
              rank: "10",
            },
          ],
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
