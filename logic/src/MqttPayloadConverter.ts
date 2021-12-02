import BiMap from "bidirectional-map";

export class MqttPayloadConverter {
  parseMap: BiMap<string>;

  constructor() {
    let newMap = new BiMap({
      clubs: "c",
      diamonds: "d",
      hearts: "h",
      spades: "s",
      "10": "T",
    });

    this.parseMap = newMap;
  }

  public convertMqttCardToAkma(suit: string, rank: string): string{
    let cardString: string = "";
    if (rank=="10") {
      cardString += this.parseMap.get(rank);
    } else {
      cardString += rank;
    }
    cardString += this.parseMap.get(suit);

    return cardString
  }
}
