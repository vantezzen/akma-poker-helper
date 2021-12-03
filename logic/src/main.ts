import { TexasHoldem } from "poker-odds-calc";
import MQTT from "async-mqtt";
import { MqttPayloadConverter } from "./MqttPayloadConverter";
import { AkmaMqttPokerObject } from "./AkmaMqttPokerObject";
import { AkmaLogicObject } from "./AkmaLogicObject";
import Result from "poker-odds-calc/dts/lib/Result";

console.log("AKMA starting...");

const mqtt = MQTT.connect("mqtt://test.mosquitto.org");
const payloadConverter = new MqttPayloadConverter();

let pokerObject: AkmaMqttPokerObject;
let logicObject: AkmaLogicObject = { player: [] };
let akmaBoard: Array<string> = [];
const akmaHands = new Map();

mqtt.subscribe("akma/poker/state");
console.log("subscribed to MQTT");

mqtt.on("message", function (topic, payload) {
  if (topic == "akma/poker/state") {
    pokerObject = JSON.parse(payload.toString());

    // console.log("PokerObj: ");
    // console.log(pokerObj);
    // console.log("");
    // console.log("PokerObj.stringify(): ");
    // console.log(JSON.stringify(pokerObj, null, 2));

    for (let index = 0; index < pokerObject.desk.length; index++) {
      akmaBoard[index] = convertMqttCardToAkmaCard(pokerObject.desk, index);
    }
    // console.log("AKMA Board:");
    // console.log(akmaBoard);

    const player = Object.values(pokerObject.hands);

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
  if (akmaBoard.length >= 3 && akmaBoard.length <= 5) {
    main();
  } else {
    console.log("Wrong number of Boardcards!");
  }
});

function main() {
  const Table = new TexasHoldem();
  Table.setBoard(akmaBoard);
  akmaHands.forEach((value) => Table.addPlayer(value));

  const TableResult = Table.calculate();

  fillLogicObject(TableResult);
  // pokerScoreConsole(TableResult);
  // bestPossibleHandConsole(TableResult);
  // testBoardConsole(TableResult);
  //TODO send Winner if WinsPercentage is 100%

  console.log("logicObject:");
  console.log(logicObject);
}

function fillLogicObject(TableResult: Result) {
  const Ranks = Object.keys(TableResult.getPlayers()[0].getRanks());
  TableResult.getPlayers().forEach((player) =>
    logicObject.player.push({
      name: player.getName(),
      ranks: [],
      pokerScore: addPokerScore(TableResult, player.getName(), Ranks),
      isWinner: player.isWinner(),
    })
  );
}

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

function addPokerScore(
  result: Result,
  playerName: string,
  ranks: string[]
): number {
  let player = result
    .getPlayers()
    .find((player) => player.getName() == playerName);
  let currentRank = 42;
  let totalScore = 0;
  let partialScore = 0;
  let percentage = 0;

  ranks.forEach((rank) => {
    (percentage = player!.getRanks()[rank].getCount() / result.getIterations()),
      (partialScore = (10 - currentRank) * percentage * 10),
      (totalScore += partialScore);
    currentRank++;
  });

  return totalScore;
}

function pokerScoreConsole(result: Result) {
  let players = result.getPlayers();
  let ranks = Object.keys(players[0].getRanks());
  let iterations = result.getIterations();
  let currentRank = 42;
  let totalScore = 0;
  let partialScore = 0;
  let percentage = 0;

  console.log("Total Iterations: " + iterations);
  console.log("Ranks:");
  players.forEach((player) => {
    console.log(`${player.getName()}: `), (totalScore = 0), (currentRank = 0);
    ranks.forEach((rank) => {
      (percentage = player.getRanks()[rank].getCount() / iterations),
        (partialScore = (10 - currentRank) * percentage * 10),
        console.log(
          `Rank: ${10 - currentRank} - ${player
            .getRanks()
            [rank].getName()} - %: ${player
            .getRanks()
            [rank].getCount()}/${iterations} = ${Math.round(
            percentage * 100
          )} - Score: ${Math.round(partialScore)}`
        );
      totalScore += partialScore;
      currentRank++;
    });
    console.log(
      "TotalScore for " + player.getName() + ": " + Math.round(totalScore)
    );
  });
}

function checkForVictory(result: Result) {
  let players = result.getPlayers();
  let ranks = Object.keys(players[0].getRanks());
  // console.log(`Board: ${Result.getBoard()}`);

  ranks.forEach((rank) => {
    //let str = players[0].getRanks()[rank].getName();
    let str = "";
    players.forEach((player) => {
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

  result.getPlayers().forEach((player) => {
    console.log(
      `${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`
    );
  });

  console.log(`Iterations: ${result.getIterations()}`);
  console.log(`Time takes: ${result.getTime()}ms`);

  // Outputs:
  // Player #1 - QsKs - Wins: 20.45% - Ties: 79.55%
  // Player #2 - QdKd - Wins: 0.00% - Ties: 79.55%
  // Board: JsTs5hTd
  // Iterations: 44
  // Time takes: 8ms
}

function testBoardConsole(result: Result) {
  let players = result.getPlayers();
  let ranks = Object.keys(players[0].getRanks());
  // console.log(`Board: ${Result.getBoard()}`);

  ranks.forEach((rank) => {
    //let str = players[0].getRanks()[rank].getName();
    let str = "";
    players.forEach((player) => {
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

  result.getPlayers().forEach((player) => {
    console.log(
      `${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`
    );
  });

  console.log(`Iterations: ${result.getIterations()}`);
  console.log(`Time takes: ${result.getTime()}ms`);

  // Outputs:
  // Player #1 - QsKs - Wins: 20.45% - Ties: 79.55%
  // Player #2 - QdKd - Wins: 0.00% - Ties: 79.55%
  // Board: JsTs5hTd
  // Iterations: 44
  // Time takes: 8ms
}

function addRanks(result: Result) {
  let players = result.getPlayers();
  let ranks = Object.keys(players[0].getRanks());
  let iterations = result.getIterations();
  let currentRank = 42;
  let bestRank = 1;
  let bestScore = 10;
  let percentage = 0;
  let bestRankName = "Fail";

  console.log("");
  players.forEach((player) => {
    console.log(`${player.getName()}: `),
      (currentRank = 0),
      (bestRank = 1),
      (bestScore = 10);
    ranks.forEach((rank) => {
      if (player.getRanks()[rank].getCount() != 0) {
        (percentage = player.getRanks()[rank].getCount() / iterations),
          console.log(
            `PokerScore: ${(10 - currentRank) * 10} - ${player
              .getRanks()
              [rank].getName()} - ${(percentage * 100).toPrecision(4)}%`
          );
        if (bestRank < 10 - currentRank) {
          bestRankName = player.getRanks()[rank].getName();
          bestRank = 10 - currentRank;
          bestScore = bestRank * 10;
        }
      }
      currentRank++;
    });
    console.log(
      "For " +
        player.getName() +
        ' the best possible Rank ist: "' +
        bestRankName +
        '" and the best Possible Score is: ' +
        bestScore
    );
  });
}
function bestPossibleHandConsole(result: Result) {
  let players = result.getPlayers();
  let ranks = Object.keys(players[0].getRanks());
  let iterations = result.getIterations();
  let currentRank = 42;
  let bestRank = 1;
  let bestScore = 10;
  let percentage = 0;
  let bestRankName = "Fail";

  console.log("");
  players.forEach((player) => {
    console.log(`${player.getName()}: `),
      (currentRank = 0),
      (bestRank = 1),
      (bestScore = 10);
    ranks.forEach((rank) => {
      if (player.getRanks()[rank].getCount() != 0) {
        (percentage = player.getRanks()[rank].getCount() / iterations),
          console.log(
            `PokerScore: ${(10 - currentRank) * 10} - ${player
              .getRanks()
              [rank].getName()} - ${(percentage * 100).toPrecision(4)}%`
          );
        if (bestRank < 10 - currentRank) {
          bestRankName = player.getRanks()[rank].getName();
          bestRank = 10 - currentRank;
          bestScore = bestRank * 10;
        }
      }
      currentRank++;
    });
    console.log(
      "For " +
        player.getName() +
        ' the best possible Rank ist: "' +
        bestRankName +
        '" and the best Possible Score is: ' +
        bestScore
    );
  });
}
