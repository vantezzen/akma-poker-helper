export interface AkmaMqttPokerObject {
  desk: Card[];
  hands: Map<string, Card[]>;
  foldedPlayers: Map<string, boolean>;
  nextCard: number;
}

export interface Card {
  suit: string;
  rank: string;
}
