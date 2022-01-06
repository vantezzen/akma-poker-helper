import MQTT from 'async-mqtt';

const mqtt = MQTT.connect('mqtt://broker.hivemq.com');

const sendTestData = async () => {

	console.log("Starting");
	try {
		await mqtt.publish("akma/poker/state", `{"desk":[{"suit":"diamonds","rank":"A"},{"suit":"diamonds","rank":"6"},{"suit":"diamonds","rank":"Q"},{"suit":"diamonds","rank":"K"}],"hands":{"1":[{"suit":"spades","rank":"A"},{"suit":"clubs","rank":"8"}],"2":[{"suit":"diamonds","rank":"J"},{"suit":"diamonds","rank":"10"}],"3":[{"suit":"clubs","rank":"A"},{"suit":"spades","rank":"8"}],"4":[{"suit":"spades","rank":"J"},{"suit":"clubs","rank":"7"}]},"foldedPlayers":{"1":false,"2":true,"3":true,"4":true},"nextCard":-1,"smallBlind":1,"bigBlind":2}`);
		await mqtt.end();
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}

mqtt.on("connect", sendTestData);