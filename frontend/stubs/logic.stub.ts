import MQTT from "async-mqtt";

const mqtt = MQTT.connect("mqtt://test.mosquitto.org");

const sendTestData = async () => {
  console.log("Starting");
  try {
    await mqtt.publish(
      "akma/poker/logic",
      JSON.stringify({
        bestHand: {
          // Für Player 1
          1: {
            name: "Full House",
            cards: [
              {
                rank: "A",
                suit: "Hearts",
              },
              {
                rank: "A",
                suit: "Diamonds",
              },
              {
                rank: "A",
                suit: "Spades",
              },
              {
                rank: "K",
                suit: "Clubs",
              },
              {
                rank: "K",
                suit: "Diamonds",
              },
            ],
          },
        },
        // Beste Karte, die kommen kann
        hopeFor: {
          // Für Player 1
          1: {
            // Dadurch erreichte Hand
            name: "Full House",
            card: {
              rank: "A",
              suit: "Hearts",
            },
          },
        },
        // Flags
        flags: {
          // Für Player 1
          1: ["big blind"],
          2: ["small blind"],
        },
      })
    );
    await mqtt.end();
    console.log("Done");
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
};

mqtt.on("connect", sendTestData);
