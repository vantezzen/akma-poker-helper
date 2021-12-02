export interface AkmaMqttPokerObject {
  desk: Card[];
  hands: Map<string, Card[]>;
  nextCard: number;
}

export interface Card {
  suit: string;
  rank: string;
}
