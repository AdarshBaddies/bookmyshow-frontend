import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    userId: string | null;
    location: {
        lat: number;
        lon: number;
        locationName: string;
        radius: number;
    } | null;
    isLocationModalOpen: boolean; // UI State
    setUserId: (id: string) => void;
    setLocation: (location: { lat: number; lon: number; locationName: string; radius?: number }) => void;
    setModalOpen: (isOpen: boolean) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userId: null,
            location: null,
            isLocationModalOpen: false,
            setUserId: (id) => set({ userId: id }),
            setLocation: (loc) => set(state => ({
                location: {
                    ...loc,
                    radius: loc.radius || (state.location?.radius || 40)
                }
            })),
            setModalOpen: (isOpen) => set({ isLocationModalOpen: isOpen }),
            clearUser: () => set({ userId: null, location: null }),
        }),
        {
            name: 'user-storage',
            // Don't persist UI state
            partialize: (state) => ({ userId: state.userId, location: state.location }),
        }
    )
);
