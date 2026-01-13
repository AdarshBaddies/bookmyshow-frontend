import { create } from 'zustand';

interface BookingState {
    movieId: string | null;
    showId: number | null;
    layoutId: string | null;
    selectedSeats: string[];
    bookingId: string | null;
    expiresAt: Date | null;
    totalPrice: number;
    setMovieId: (id: string) => void;
    setShowId: (id: number) => void;
    setLayoutId: (id: string) => void;
    setSelectedSeats: (seats: string[]) => void;
    setBookingId: (id: string, expiresAt: Date) => void;
    setTotalPrice: (price: number) => void;
    clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    movieId: null,
    showId: null,
    layoutId: null,
    selectedSeats: [],
    bookingId: null,
    expiresAt: null,
    totalPrice: 0,
    setMovieId: (id) => set({ movieId: id }),
    setShowId: (id) => set({ showId: id }),
    setLayoutId: (id) => set({ layoutId: id }),
    setSelectedSeats: (seats) => set({ selectedSeats: seats }),
    setBookingId: (id, expiresAt) => set({ bookingId: id, expiresAt }),
    setTotalPrice: (price) => set({ totalPrice: price }),
    clearBooking: () =>
        set({
            movieId: null,
            showId: null,
            layoutId: null,
            selectedSeats: [],
            bookingId: null,
            expiresAt: null,
            totalPrice: 0,
        }),
}));
