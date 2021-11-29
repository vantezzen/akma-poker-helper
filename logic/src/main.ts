import {TexasHoldem, SixPlusHoldem, Omaha} from 'poker-odds-calc';
import MQTT from 'async-mqtt';

const mqtt = MQTT.connect('mqtt://test.mosquitto.org');
mqtt.subscribe('akma/poker/state');

mqtt.on("message", function (topic, payload) {
    if (topic == 'akma/poker/state') {
      console.log(`received message: ${topic} ${payload}`);
    
    }
  })

const Table = new TexasHoldem();
Table
  .addPlayer(["As", "Ac"])
  .addPlayer(["4d", "3d"])

  .setBoard(["Ad","Ts","5h"]);

const Result = Table.calculate();

console.log(`Board: ${Result.getBoard()}`);

let players = Result.getPlayers();
let ranks = Object.keys(players[0].getRanks());
ranks.forEach(rank => {
    //let str = players[0].getRanks()[rank].getName();
    let str = "";
    players.forEach((player, i) => {
      if (player.getRanks()[rank].getCount() > 0)
        str += "               " + player.getRanks()[rank].getCount() + " (" + player.getRanks()[rank].getPercentage(true) + ")";
      else
        str += "               _";
    });
    console.log(str);
  });

Result.getPlayers().forEach(player => {
  console.log(`${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`);
});

console.log(`Iterations: ${Result.getIterations()}`);
console.log(`Time takes: ${Result.getTime()}ms`);

// Outputs:
// Player #1 - QsKs - Wins: 20.45% - Ties: 79.55%
// Player #2 - QdKd - Wins: 0.00% - Ties: 79.55%
// Board: JsTs5hTd
// Iterations: 44
// Time takes: 8ms

