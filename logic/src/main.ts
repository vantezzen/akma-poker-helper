import { TexasHoldem } from "poker-odds-calc";
import MQTT from "async-mqtt";
import { MqttPayloadConverter } from "./MqttPayloadConverter";
import { AkmaMqttPokerObject, Card } from "./AkmaMqttPokerObject";
import { AkmaLogicObject, Rank } from "./AkmaLogicObject";
import Result from "poker-odds-calc/dts/lib/Result";

console.log("Starting AKMA...");
const mqttAdress: string = "mqtt://broker.hivemq.com";
const mqttChannel: string = "akma/poker/state";

const mqtt = MQTT.connect(mqttAdress);
const payloadConverter = new MqttPayloadConverter();

let pokerObject: AkmaMqttPokerObject;
let logicObject: AkmaLogicObject = { player: [] };
let akmaBoard: Array<string> = [];
const akmaHands = new Map();

mqtt.subscribe(mqttChannel);
console.log('subscribed to MQTT on channel "' + mqttChannel + '"');

mqtt.on("message", function (topic, payload) {
  if (topic == mqttChannel) {
    pokerObject = JSON.parse(payload.toString());

    if (pokerObject.desk.length >= 3 && pokerObject.desk.length <= 5) {
      logicObject.player = [];
      akmaBoard = [];
      for (let index = 0; index < pokerObject.desk.length; index++) {
        akmaBoard[index] = convertMqttCardToAkmaCard(pokerObject.desk, index);
      }

      const player: Card[][] = Object.values(pokerObject.hands);
      const foldedPlayer: boolean[] = Object.values(pokerObject.foldedPlayers);

      for (let playerIndex = 0; playerIndex < player.length; playerIndex++) {
        let currentHand = player[playerIndex];
        let currentFoldedPlayer = foldedPlayer[playerIndex];
        if (currentHand != undefined && currentFoldedPlayer != undefined) {
          setHand(playerIndex, currentHand, currentFoldedPlayer);
        }
      }
      main();
    } else {
      console.log("Wrong number of Boardcards!");
    }
  }
});

function main() {
  const TableWithFolded = new TexasHoldem();
  const TableWithoutFolded = new TexasHoldem();
  TableWithFolded.setBoard(akmaBoard);
  TableWithoutFolded.setBoard(akmaBoard);

  akmaHands.forEach((value) => {
    TableWithFolded.addPlayer(value.hand);
  });
  let playerStillInGame: number = 0;
  akmaHands.forEach((value) => {
    if (!value.hasFolded) {
      TableWithoutFolded.addPlayer(value.hand);
      playerStillInGame++;
    }
  });
  const TableResultWithFolded = TableWithFolded.calculate();
  let TableResultWithoutFolded: Result;

  if (playerStillInGame != 0) {
    if (playerStillInGame >= 2) {
      TableResultWithoutFolded = TableWithoutFolded.calculate();
      fillLogicObjectNormal(TableResultWithFolded, TableResultWithoutFolded);
    } else {
      fillLogicOnlyOnePlayerLeft(TableResultWithFolded, TableWithoutFolded);
    }
  }

  sendLogicObject(logicObject);
  // Debugging
  // console.log("succecfully send logicObject:");
  // console.log(JSON.stringify(logicObject, null, 2));
  logicObject.player = [];
}

function fillLogicObjectNormal(
  ResultWithFolded: Result,
  ResultWithoutFolded: Result
) {
  const Ranks = Object.keys(ResultWithFolded.getPlayers()[0].getRanks());
  const FoldedPlayers: boolean[] = Object.values(pokerObject.foldedPlayers);

  let handOfWinningUnfoldedPlayer: string = "";
  let thereIsAWinner = ResultWithoutFolded.getPlayers().some(
    (player) => player.getWinsPercentage() == 100
  );
  if (thereIsAWinner) {
    handOfWinningUnfoldedPlayer = ResultWithoutFolded.getPlayers()
      .find((player) => player.getWinsPercentage() == 100)!
      .getPlayer()
      .getHand()!;
  }

  let handsOfTiedUnfoldedPlayer: string[] = [];
  ResultWithoutFolded.getPlayers()
    .filter((player) => player.getTiesPercentage() == 100)
    .map((player) => handsOfTiedUnfoldedPlayer.push(player.getHand()!));

  ResultWithFolded.getPlayers().forEach((player, index) =>
    logicObject.player.push({
      name: player.getName(),
      ranks: addRanks(ResultWithFolded, player.getName(), Ranks),
      pokerScore: addPokerScore(ResultWithFolded, player.getName(), Ranks),
      isWinner: checkForVictory(
        ResultWithFolded,
        player.getName(),
        handOfWinningUnfoldedPlayer,
        FoldedPlayers[index],
        isLastPlayer(FoldedPlayers, FoldedPlayers[index])
      ),
      hasTied: checkForTie(
        ResultWithFolded,
        player.getName(),
        handsOfTiedUnfoldedPlayer,
        FoldedPlayers[index]
      ),
      hasFolded: FoldedPlayers[index],
    })
  );
}

function fillLogicOnlyOnePlayerLeft(
  ResultWithFolded: Result,
  TableWithoutFolded: TexasHoldem
) {
  const Ranks = Object.keys(ResultWithFolded.getPlayers()[0].getRanks());
  const FoldedPlayers: boolean[] = Object.values(pokerObject.foldedPlayers);

  let handOfWinningUnfoldedPlayer: string = "";
  handOfWinningUnfoldedPlayer =
    TableWithoutFolded.getPlayersInHand()[0].getHand()!;

  ResultWithFolded.getPlayers().forEach((player, index) =>
    logicObject.player.push({
      name: player.getName(),
      ranks: addRanks(ResultWithFolded, player.getName(), Ranks),
      pokerScore: addPokerScore(ResultWithFolded, player.getName(), Ranks),
      isWinner: checkForVictory(
        ResultWithFolded,
        player.getName(),
        handOfWinningUnfoldedPlayer,
        FoldedPlayers[index],
        isLastPlayer(FoldedPlayers, FoldedPlayers[index])
      ),
      hasTied: false,
      hasFolded: FoldedPlayers[index],
    })
  );
}

function setHand(
  playerIndex: number,
  currentHand: Card[],
  currentFoldedPlayer: boolean
) {
  akmaHands.set(playerIndex, {
    hand: [
      convertMqttCardToAkmaCard(currentHand, 0),
      convertMqttCardToAkmaCard(currentHand, 1),
    ],
    hasFolded: currentFoldedPlayer,
  });
}

function convertMqttCardToAkmaCard(card: Card[], index: number): any {
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
  let currentRank = 0;
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

function addRanks(result: Result, playerName: string, ranks: string[]): Rank[] {
  let player = result
    .getPlayers()
    .find((player) => player.getName() == playerName);
  let iterations = result.getIterations();
  let currentRank = 0;
  let percentage = 0;
  let finalRanks: Rank[] = [];

  ranks.forEach((rank) => {
    (percentage = player!.getRanks()[rank].getCount() / iterations),
      finalRanks.push({
        name: player!.getRanks()[rank].getName(),
        percentage: percentage * 100,
      });
    currentRank++;
  });

  return finalRanks;
}

function checkForVictory(
  ResultWithFolded: Result,
  playerName: string,
  handOfWinner: string,
  hasFolded: boolean,
  lastPlayer: boolean
): boolean {
  let player = ResultWithFolded.getPlayers().find(
    (player) => player.getName() == playerName
  );

  return (
    player!.getHand() == handOfWinner &&
    !hasFolded &&
    (akmaBoard.length == 5 || lastPlayer)
  );
}

function checkForTie(
  result: Result,
  playerName: string,
  handOfTied: string[],
  hasFolded: boolean
): boolean {
  let player = result
    .getPlayers()
    .find((player) => player.getName() == playerName);

  return (
    handOfTied.some((currentplayer) => currentplayer == player!.getHand()) &&
    !hasFolded &&
    akmaBoard.length == 5
  );
}

async function sendLogicObject(logicObjectToSend: AkmaLogicObject) {
  console.log("Starting");
  try {
    await mqtt.publish("akma/poker/logic", JSON.stringify(logicObjectToSend));
    console.log("Done");
  } catch (e: any) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

function isLastPlayer(foldedPlayers: boolean[], hasFolded: boolean): boolean {
  return (
    !hasFolded && foldedPlayers.filter((value) => value == false).length == 1
  );
}
