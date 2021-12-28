import MQTT from 'async-mqtt';

const mqtt = MQTT.connect('mqtt://broker.hivemq.com');

const sendTestData = async () => {

	console.log("Starting");
	try {
		await mqtt.publish("akma/poker/state", JSON.stringify({
      desk: [
        {
          suit: 'clubs',
          rank: 'A',
        },
        {
          suit: 'diamonds',
          rank: '10',
        },
        {
          suit: 'hearts',
          rank: '5',
        },
        {
          suit: 'spades',
          rank: 'K',
        },
      ],
      hand: {
        // Karten in der Hand von Player 1
        1: [
          {
            suit: 'hearts',
            rank: 'A',
          },
          {
            suit: 'spades',
            rank: 'A',
          }
        ],
      },
      nextCard: "desk"
    },));
		await mqtt.end();
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}

mqtt.on("connect", sendTestData);