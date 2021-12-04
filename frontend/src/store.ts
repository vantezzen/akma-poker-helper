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
  ranks: {
    name: string;
    percentage: number;
  }[],
  pokerScore: number;
  isWinner: boolean;
  name: string;
}

export type Pages = 'start' | 'game' | 'end' | 'cantjoin' | 'modeselect';
export type AppStore = {
  page: Pages;
  setPage: (page: Pages) => void;

  setMode: (mode: string) => void;
  mode: "normal" | "glass" | null;

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
  page: 'modeselect',
  setPage: (page: Pages) => set((state: AppStore) => ({ ...state, page })),

  mode: null,
  setMode: (mode: string) => set((state: AppStore) => ({ ...state, mode })),

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
    ranks: [],
    pokerScore: 0,
    isWinner: false,
    name: ""
  },
  setLogic: (logic: Gamelogic) => set(() => ({ logic })),
}))
export default useStore;