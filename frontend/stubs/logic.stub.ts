import MQTT from 'async-mqtt';

const mqtt = MQTT.connect('mqtt://broker.hivemq.com');

const sendTestData = async () => {

  console.log("Starting");
  try {
    await mqtt.publish("akma/poker/logic", `{"player":[{"name":"Player #1","ranks":[{"name":"Royal Flush","percentage":0},{"name":"Straight Flush","percentage":0},{"name":"4 of a kind","percentage":0},{"name":"Full House","percentage":56},{"name":"Flush","percentage":17.5},{"name":"Straight","percentage":0},{"name":"3 of a kind","percentage":2.5},{"name":"Two Pairs","percentage":25},{"name":"One Pair","percentage":55.00000000000001},{"name":"High Card","percentage":0}],"pokerScore":30,"isWinner":false,"hasTied":false,"hasFolded":false},{"name":"Player #2","ranks":[{"name":"Royal Flush","percentage":100},{"name":"Straight Flush","percentage":0},{"name":"4 of a kind","percentage":0},{"name":"Full House","percentage":0},{"name":"Flush","percentage":0},{"name":"Straight","percentage":0},{"name":"3 of a kind","percentage":0},{"name":"Two Pairs","percentage":0},{"name":"One Pair","percentage":0},{"name":"High Card","percentage":0}],"pokerScore":100,"isWinner":false,"hasTied":false,"hasFolded":true},{"name":"Player #3","ranks":[{"name":"Royal Flush","percentage":0},{"name":"Straight Flush","percentage":0},{"name":"4 of a kind","percentage":0},{"name":"Full House","percentage":0},{"name":"Flush","percentage":17.5},{"name":"Straight","percentage":0},{"name":"3 of a kind","percentage":2.5},{"name":"Two Pairs","percentage":25},{"name":"One Pair","percentage":55.00000000000001},{"name":"High Card","percentage":0}],"pokerScore":30,"isWinner":false,"hasTied":false,"hasFolded":true},{"name":"Player #4","ranks":[{"name":"Royal Flush","percentage":0},{"name":"Straight Flush","percentage":0},{"name":"4 of a kind","percentage":0},{"name":"Full House","percentage":0},{"name":"Flush","percentage":17.5},{"name":"Straight","percentage":7.5},{"name":"3 of a kind","percentage":0},{"name":"Two Pairs","percentage":0},{"name":"One Pair","percentage":35},{"name":"High Card","percentage":40}],"pokerScore":25.25,"isWinner":false,"hasTied":false,"hasFolded":true}]}`);
    await mqtt.end();
    console.log("Done");
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

mqtt.on("connect", sendTestData);