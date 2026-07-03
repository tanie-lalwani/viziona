import { create } from 'zustand';

interface UserState {
  netWorth: number;
  setNetWorth: (amount: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  netWorth: 1000000,
  setNetWorth: (amount) => set({ netWorth: amount }),
}));
