import create from 'zustand'
import { CardData } from './components/Card'

export type CardStore = {
  desk: CardData[];
  hand: CardData[];
}

export type Pages = 'start' | 'game' | 'end';
export type AppStore = {
  page: Pages;
  setPage: (page: Pages) => void;

  isEnrolled: boolean;
  setIsEnrolled: (isEnrolled: boolean) => void;
  numPlayers: number;
  setPlayerCount: (numPlayers: number) => void;

  cards: CardStore;
  setCards: (cards: CardStore) => void;
}

const useStore = create<AppStore>((set: Function) => ({
  page: 'start',
  setPage: (page: Pages) => set((state: AppStore) => ({ ...state, page })),

  // General
  isEnrolled: false,
  setIsEnrolled: (isEnrolled: boolean) => set((state: AppStore) => ({ ...state, isEnrolled })),
  numPlayers: 3,
  setPlayerCount: (numPlayers: number) => set((state: AppStore) => ({ ...state, numPlayers })),

  // Cards
  cards: {
    desk: [],
    hand: [],
  },
  setCards: (cards: CardStore) => set(() => ({ cards })),
}))
export default useStore;