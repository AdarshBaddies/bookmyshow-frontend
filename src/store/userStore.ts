import { create } from 'zustand';

interface UserState {
    userId: string | null;
    location: {
        lat: number;
        lon: number;
        locationName: string;
        radius: number; // Added radius
    } | null;
    setUserId: (id: string) => void;

    // Updated signature to accept partial location updates or full object
    setLocation: (location: { lat: number; lon: number; locationName: string; radius?: number }) => void;

    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    userId: null,
    location: null,
    setUserId: (id) => set({ userId: id }),
    setLocation: (loc) => set(state => ({
        location: {
            ...loc,
            radius: loc.radius || (state.location?.radius || 40) // Default 40 if not provided
        }
    })),
    clearUser: () => set({ userId: null, location: null }),
}));
