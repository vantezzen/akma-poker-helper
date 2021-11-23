import { Socket } from 'socket.io-client';
import create from 'zustand'
import { CardData } from './components/Card'

export type CardStore = {
  desk: CardData[];
  hand: CardData[];
  nextCard: "desk" | number;
}

export type Flag = "big blind" | "small blind";
export type Gamelogic = {
  bestHand: {
    name: string;
    cards: CardData[];
  },
  hopeFor: {
    name: string;
    card: CardData;
  },
  flags: Flag[];
}

export type Pages = 'start' | 'game' | 'end' | 'cantjoin';
export type AppStore = {
  page: Pages;
  setPage: (page: Pages) => void;

  isEnrolled: boolean;
  setIsEnrolled: (isEnrolled: boolean) => void;
  numPlayers: number;
  setPlayerCount: (numPlayers: number) => void;

  socket: Socket | null;
  setSocket: (socket: Socket) => void;

  cards: CardStore;
  setCards: (cards: CardStore) => void;

  logic: Gamelogic;
  setLogic: (logic: Gamelogic) => void;
}

const useStore = create<AppStore>((set: Function) => ({
  page: 'start',
  setPage: (page: Pages) => set((state: AppStore) => ({ ...state, page })),

  // General
  isEnrolled: false,
  setIsEnrolled: (isEnrolled: boolean) => set((state: AppStore) => ({ ...state, isEnrolled })),
  numPlayers: 0,
  setPlayerCount: (numPlayers: number) => set((state: AppStore) => ({ ...state, numPlayers })),

  // Socket.io client
  socket: null,
  setSocket: (socket: Socket) => set((state: AppStore) => ({ ...state, socket })),

  // Cards
  cards: {
    desk: [],
    hand: [],
    nextCard: "desk"
  },
  setCards: (cards: CardStore) => set(() => ({ cards })),

  // Logic
  logic: {
    bestHand: {
      name: '',
      cards: [],
    },
    hopeFor: {
      name: '',
      card: { suit: 'clubs', rank: 'A' },
    },
    flags: [],
  },
  setLogic: (logic: Gamelogic) => set(() => ({ logic })),
}))
export default useStore;