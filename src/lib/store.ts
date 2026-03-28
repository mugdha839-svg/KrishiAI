import { create } from "zustand";

interface FarmerProfile {
  uid: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  acres: number;
  crops: string[];
  lang: string;
  aadhaar_last4: string;
  avatar: string;
}

interface AppState {
  profile: FarmerProfile | null;
  language: string;
  crisisActive: boolean;
  sidebarOpen: boolean;
  setProfile: (p: FarmerProfile) => void;
  setLanguage: (l: string) => void;
  setCrisisActive: (a: boolean) => void;
  setSidebarOpen: (o: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  language: "en",
  crisisActive: true,
  sidebarOpen: false,
  setProfile: (profile) => set({ profile }),
  setLanguage: (language) => set({ language }),
  setCrisisActive: (crisisActive) => set({ crisisActive }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
