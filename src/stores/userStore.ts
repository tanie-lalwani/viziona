import { create } from 'zustand';

export interface Manifestation {
  id: string;
  text: string;
  category: 'career' | 'relationship' | 'general';
  status: 'dreaming' | 'focusing' | 'manifested';
  focusTime: number; // seconds spent focusing
  orbColor: string;
  orbSize: number;
  position: [number, number, number];
}

export interface PurchasedItem {
  id: string;
  name: string;
  price: number;
  category: string;
  datePurchased: string;
  shippingStatus: string;
  description: string;
}

interface UserState {
  netWorth: number;
  manifestationPoints: number;
  manifestations: Manifestation[];
  selectedId: string | null;
  purchasedItems: PurchasedItem[];
  infiniteBalance: boolean;
  setNetWorth: (amount: number) => void;
  setSelectedId: (id: string | null) => void;
  addManifestation: (text: string, category?: 'career' | 'relationship' | 'general') => void;
  updateManifestationStatus: (id: string, status: 'dreaming' | 'focusing' | 'manifested') => void;
  incrementFocusTime: (id: string, seconds: number) => void;
  addPoints: (amount: number) => void;
  buyItem: (name: string, price: number, description: string, category: string) => void;
  toggleInfiniteBalance: () => void;
  clearPurchases: () => void;
}

const initialManifestations: Manifestation[] = [
  {
    id: 'm1',
    text: 'getting foreign clients and one gets so happy he offers job and helps me move in her country with a visa',
    category: 'career',
    status: 'dreaming',
    focusTime: 0,
    orbColor: '#4facfe',
    orbSize: 1.2,
    position: [-2.5, 1, 0],
  },
  {
    id: 'm2',
    text: 'getting a good bf who cares for me',
    category: 'relationship',
    status: 'dreaming',
    focusTime: 0,
    orbColor: '#ff0844',
    orbSize: 1.0,
    position: [2.5, 0.5, 1],
  },
];

const categoryColors = {
  career: '#00f2fe',
  relationship: '#f857a6',
  general: '#f9d423',
};

const shippingStatuses = [
  'Manifested',
  'Warping to Coordinates',
  'Orbiting Earth',
  'Departing Wormhole',
  'Awaiting Quantum Transit'
];

export const useUserStore = create<UserState>((set) => ({
  netWorth: 1000000000, // Starts with $1 Billion
  manifestationPoints: 100,
  manifestations: initialManifestations,
  selectedId: null,
  purchasedItems: [],
  infiniteBalance: true,
  setNetWorth: (amount) => set({ netWorth: amount }),
  setSelectedId: (id) => set({ selectedId: id }),
  addPoints: (amount) => set((state) => ({ manifestationPoints: state.manifestationPoints + amount })),
  addManifestation: (text, category = 'general') =>
    set((state) => {
      const id = 'm-' + Math.random().toString(36).substr(2, 9);
      // Random position around center
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      const x = Math.cos(angle) * radius;
      const y = -0.5 + Math.random() * 2;
      const z = Math.sin(angle) * radius;

      const newManifestation: Manifestation = {
        id,
        text,
        category,
        status: 'dreaming',
        focusTime: 0,
        orbColor: categoryColors[category] || '#a18cd1',
        orbSize: 0.8 + Math.random() * 0.4,
        position: [x, y, z],
      };
      return {
        manifestations: [...state.manifestations, newManifestation],
      };
    }),
  updateManifestationStatus: (id, status) =>
    set((state) => ({
      manifestations: state.manifestations.map((m) =>
        m.id === id ? { ...m, status } : m
      ),
    })),
  incrementFocusTime: (id, seconds) =>
    set((state) => {
      let pointsEarned = 0;
      let netWorthGained = 0;

      const updated = state.manifestations.map((m) => {
        if (m.id === id) {
          const newFocusTime = m.focusTime + seconds;
          pointsEarned = seconds * 10;
          netWorthGained = seconds * 250;
          return { ...m, focusTime: newFocusTime };
        }
        return m;
      });

      return {
        manifestations: updated,
        manifestationPoints: state.manifestationPoints + pointsEarned,
        netWorth: state.netWorth + netWorthGained,
      };
    }),
  buyItem: (name, price, description, category) =>
    set((state) => {
      const id = 'p-' + Math.random().toString(36).substr(2, 9);
      const status = shippingStatuses[Math.floor(Math.random() * shippingStatuses.length)];
      const date = new Date().toLocaleString();
      const newItem: PurchasedItem = {
        id,
        name,
        price,
        category,
        datePurchased: date,
        shippingStatus: status,
        description
      };
      
      const newNetWorth = state.infiniteBalance 
        ? state.netWorth 
        : Math.max(0, state.netWorth - price);
        
      return {
        purchasedItems: [newItem, ...state.purchasedItems],
        netWorth: newNetWorth,
        manifestationPoints: state.manifestationPoints + 50 // positive vibe boost
      };
    }),
  toggleInfiniteBalance: () => set((state) => ({ infiniteBalance: !state.infiniteBalance })),
  clearPurchases: () => set({ purchasedItems: [] })
}));
