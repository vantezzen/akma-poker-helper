export interface akmaLogicObject {
  player: Player[];
}

export interface Player {
  ranks: Rank[];
  pokerScore: number;
  isWinner: boolean;
}

export interface Rank {
  name: string;
  percentage: number;
}
