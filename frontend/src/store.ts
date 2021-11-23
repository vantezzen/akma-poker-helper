import { Socket } from 'socket.io-client';
import create from 'zustand'
import { CardData } from './components/Card'

export type CardStore = {
  desk: CardData[];
  hand: CardData[];
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
  },
  setCards: (cards: CardStore) => set(() => ({ cards })),
}))
export default useStore;