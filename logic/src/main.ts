import { TexasHoldem, SixPlusHoldem, Omaha } from "poker-odds-calc";
import MQTT from "async-mqtt";
import { MqttPayloadConverter } from "./MqttPayloadConverter";
import { AkmaMqttPokerObject } from "../src/akmaMqttPokerObject";

console.log("AKMA running");

const mqtt = MQTT.connect("mqtt://test.mosquitto.org");
const payloadConverter = new MqttPayloadConverter();

let pokerObj: AkmaMqttPokerObject;
let akmaBoard: Array<string> = [];
const akmaHands = new Map();

mqtt.subscribe("akma/poker/state");

mqtt.on("message", function (topic, payload) {
  if (topic == "akma/poker/state") {
    pokerObj = JSON.parse(payload.toString());

    // console.log("PokerObj: ");
    // console.log(pokerObj);
    // console.log("");
    // console.log("PokerObj.stringify(): ");
    // console.log(JSON.stringify(pokerObj, null, 2));

    for (let index = 0; index < pokerObj.desk.length; index++) {
      akmaBoard[index] = convertMqttCardToAkmaCard(pokerObj.desk, index);
    }
    // console.log("AKMA Board:");
    // console.log(akmaBoard);

    const player = Object.values(pokerObj.hands);

    for (let playerIndex = 0; playerIndex < player.length; playerIndex++) {
      let currentHand = player[playerIndex];
      if (currentHand != undefined) {
        setHand(playerIndex, currentHand);
      }
    }
    // console.log("AKMA Hands:");
    // console.log(akmaHands);

    //console.log(`received message: ${topic} ${payload}`)
  }
  testBoard();
});

function setHand(playerIndex: number, currentHand: any) {
  akmaHands.set(playerIndex, [
    convertMqttCardToAkmaCard(currentHand, 0),
    convertMqttCardToAkmaCard(currentHand, 1),
  ]);
}

function convertMqttCardToAkmaCard(card: any, index: number): any {
  return payloadConverter.convertMqttCardToAkma(
    card[index].suit,
    card[index].rank
  );
}

function pokerScore() {
  const Table = new TexasHoldem();
  Table.setBoard(akmaBoard);
  akmaHands.forEach((player) => Table.addPlayer(player));

  const Result = Table.calculate();

  let players = Result.getPlayers();
  let ranks = Object.keys(players[0].getRanks());
  ranks.forEach((rank) => {
    let str = "";
    players.forEach((player, i) => {
      if (player.getRanks()[rank].getCount() > 0)
        str +=
          "               " +
          player.getRanks()[rank].getCount() +
          " (" +
          player.getRanks()[rank].getPercentage(true) +
          ")";
      else str += "               _";
    });
    console.log(str);
  });

  Result.getPlayers().forEach((player) => {
    console.log(
      `${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`
    );
  });
}

function testBoard() {
  const Table = new TexasHoldem();
  Table.setBoard(akmaBoard);
  akmaHands.forEach((value) => Table.addPlayer(value));

  const Result = Table.calculate();

  let players = Result.getPlayers();
  let ranks = Object.keys(players[0].getRanks());
  let iterations = Result.getIterations();
  let currentRank = 42;
  let totalScore = 0;
  let partialScore = 0;
  let percentage = 0;

  console.log("Total Iterations: " + iterations);
  console.log("Ranks:");
  players.forEach((player) => {
    console.log(`Player: ${player.getName()}: `),
      (totalScore = 0),
      (currentRank = 0);
    ranks.forEach((rank) => {
      (percentage = (player.getRanks()[rank].getCount() / iterations) * 10),
        (partialScore = (10 - currentRank) * percentage),
        console.log(
          `Rank: ${10 - currentRank} - RankName: ${player
            .getRanks()
            [rank].getName()} - Percentage: ${player
            .getRanks()
            [
              rank
            ].getCount()}/${iterations} = ${percentage} - PartialScore: ${partialScore}`
        );
      totalScore += partialScore;
      currentRank++;
    });
    console.log("Score for " + player.getName() + ": " + totalScore);
  });
  // console.log(`Board: ${Result.getBoard()}`);

  ranks.forEach((rank) => {
    //let str = players[0].getRanks()[rank].getName();
    let str = "";
    players.forEach((player, i) => {
      if (player.getRanks()[rank].getCount() > 0)
        str +=
          "               " +
          player.getRanks()[rank].getCount() +
          " (" +
          player.getRanks()[rank].getPercentage(true) +
          ")";
      else str += "               _";
    });
    console.log(str);
  });

  Result.getPlayers().forEach((player) => {
    console.log(
      `${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`
    );
  });

  console.log(`Iterations: ${Result.getIterations()}`);
  console.log(`Time takes: ${Result.getTime()}ms`);

  // Outputs:
  // Player #1 - QsKs - Wins: 20.45% - Ties: 79.55%
  // Player #2 - QdKd - Wins: 0.00% - Ties: 79.55%
  // Board: JsTs5hTd
  // Iterations: 44
  // Time takes: 8ms
}
