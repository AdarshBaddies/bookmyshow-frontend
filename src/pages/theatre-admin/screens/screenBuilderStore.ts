import { create } from 'zustand';

// Types matching the GraphQL Schema
export interface Seat {
    type: 0 | 1 | 2 | 3; // 0=Empty, 1=Standard, 2=Premium, 3=Diamond
    seatId: string;      // "A1", "A2", etc.
}

export interface CategoryBlock {
    id: string;          // Internal ID for UI
    catId: number;       // 1, 2, 3...
    name: string;        // "Diamond", "Gold"
    rows: number;
    columns: number;
    seats: Seat[];       // Flattened array of seats for this block
    price?: number;      // Store price metadata (separate from schema but useful)
}

interface ScreenBuilderState {
    screenName: string;
    theatreId: string;
    categories: CategoryBlock[];

    // Actions
    setName: (name: string) => void;
    setTheatreId: (id: string) => void;
    addCategory: (category: Omit<CategoryBlock, 'seats'>) => void;
    removeCategory: (id: string) => void;
    updateCategorySeats: (catId: string, seats: Seat[]) => void;
    reset: () => void;
}

export const useScreenBuilderStore = create<ScreenBuilderState>((set) => ({
    screenName: '',
    theatreId: '',
    categories: [],

    setName: (name) => set({ screenName: name }),
    setTheatreId: (id) => set({ theatreId: id }),

    addCategory: (category) => set((state) => ({
        categories: [...state.categories, {
            ...category,
            // Initialize seats based on rows * cols
            seats: Array(category.rows * category.columns).fill(null).map(() => ({
                type: 1, // Default to standard seat
                seatId: '-', // Placeholder
            }))
        }]
    })),

    removeCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
    })),

    updateCategorySeats: (catId, seats) => set((state) => ({
        categories: state.categories.map(c =>
            c.id === catId ? { ...c, seats } : c
        )
    })),

    reset: () => set({ screenName: '', theatreId: '', categories: [] })
}));
