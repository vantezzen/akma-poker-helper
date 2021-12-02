import MQTT from 'async-mqtt';

const mqtt = MQTT.connect('mqtt://test.mosquitto.org');

const sendTestData = async () => {

	console.log("Starting");
	try {
		await mqtt.publish("akma/poker/state", JSON.stringify({
      desk: [
        {
          suit: 'diamonds',
          rank: 'A',
        },
        {
          suit: 'spades',
          rank: '10',
        },
        {
          suit: 'hearts',
          rank: '5',
        },
      ],
      hands: {
        "1": [
          {
            suit: 'spades',
            rank: 'A',
          },
          {
            suit: 'clubs',
            rank: 'A',
          }
        ],
        "2": [
          {
            suit: 'diamonds',
            rank: '4',
          },
          {
            suit: 'diamonds',
            rank: '3',
          }
        ],
      },
      nextCard: -1 //-1 keine mehr, 0 desk, 1-16 player
    },));
		await mqtt.end();
		console.log("Done");
	} catch (e:any){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}

mqtt.on("connect", sendTestData);