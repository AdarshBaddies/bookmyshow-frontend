import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_SCREEN, GET_AVAILABLE_SEATS, GET_SHOWS } from '../../graphql/queries';
import { useUserStore } from '../../store/userStore';
import './SeatSelection.css';

// Types for seat rendering
interface RenderSeat {
    id: string; // The backend seatId (e.g., "A1")
    type: number; // 0: Gap, 1: Standard, 2: Premium, 3: Diamond
    status: 'available' | 'booked' | 'selected' | 'gap';
    price: number;
    categoryName: string;
}

function SeatSelection() {
    const { movieId, showId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const userStoreLocation = useUserStore((s) => s.location);

    // Metadata from previous page (Passed Context)
    const {
        theatreId,
        theatreName: passedTheatreName,
        date: passedDate,
        movieTitle: passedMovieTitle,
        layoutId: passedLayoutId
    } = state || {};

    // State
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // 1. CRITICAL: Fetch All Shows for this Movie+Date (To build Time Slider)
    // We use the passed date to get all shows for this movie on this day.
    const { data: showsData, loading: loadingShows } = useQuery(GET_SHOWS, {
        variables: {
            user: {
                lat: userStoreLocation?.lat || 19.1197, // Fallback if store empty
                lon: userStoreLocation?.lon || 72.8424,
                radius: userStoreLocation?.radius || 50,
                movieId: movieId
            },
            d: passedDate || '20251122' // Fallback date for dev testing
        },
        skip: !movieId
    });

    // 2. Extract Sibling Shows (Time Slider) & Current Show Details
    const { currentShow, siblings, theatreName } = useMemo(() => {
        if (!showsData?.getShows) return { currentShow: null, siblings: [], theatreName: passedTheatreName };

        // We need to filter for the specific theatre we are currently in.
        // If theatreId is passed, use it. If not, try to find the theatre containing the current showID.
        let theatreGroup;
        if (theatreId) {
            theatreGroup = showsData.getShows.find((t: any) => t.TID === theatreId);
        } else {
            // Fallback: Find any theatre that has this showId
            theatreGroup = showsData.getShows.find((t: any) => t.SHS?.some((s: any) => String(s.showId) === String(showId)));
        }

        if (!theatreGroup) return { currentShow: null, siblings: [], theatreName: passedTheatreName };

        const show = theatreGroup.SHS?.find((s: any) => String(s.showId) === String(showId));

        return {
            currentShow: show,
            siblings: theatreGroup.SHS || [], // These are the shows for the Time Slider
            theatreName: theatreGroup.TN
        };
    }, [showsData, theatreId, showId, passedTheatreName]);


    // 3. Fetch Screen Layout
    const effectiveLayoutId = currentShow?.layoutId || passedLayoutId;

    const { data: screenData, loading: loadingScreen } = useQuery(GET_SCREEN, {
        variables: { layoutId: effectiveLayoutId || '' },
        skip: !effectiveLayoutId
    });

    // 4. Fetch Real-time Availability
    const { data: availabilityData, startPolling } = useQuery(GET_AVAILABLE_SEATS, {
        variables: { show_id: parseInt(showId || '0') },
        skip: !showId
    });

    useEffect(() => {
        startPolling(5000);
    }, [startPolling]);


    // --- Logic to Merge Layout + Availability + Prices ---
    const categories = useMemo(() => {
        if (!screenData?.getScreen?.categories) return [];

        const statusMap = new Map<string, number>();
        if (availabilityData?.getAvailableSeats) {
            availabilityData.getAvailableSeats.forEach((s: any) => {
                statusMap.set(s.seatID, s.Status);
            });
        }

        // Helper to find price using match on catId
        const getPrice = (catId: number) => {
            if (currentShow?.categoryDetails) {
                const catDet = currentShow.categoryDetails.find((c: any) => c.categoryId === catId);
                if (catDet) return catDet.price;
            }
            return 0; // Default if not found
        };

        return screenData.getScreen.categories.map((cat: any) => {
            const price = getPrice(cat.catId);
            const grid: RenderSeat[][] = [];
            const rowLabels: string[] = [];

            let seatIndex = 0;
            for (let r = 0; r < cat.rows; r++) {
                const rowSeats: RenderSeat[] = [];
                let rowLabel = '';

                for (let c = 0; c < cat.columns; c++) {
                    const seatData = cat.seats[seatIndex];
                    seatIndex++;

                    if (!seatData || seatData.type === 0) {
                        rowSeats.push({ id: `gap-${cat.catId}-${r}-${c}`, type: 0, status: 'gap', price: 0, categoryName: cat.name });
                        continue;
                    }

                    // Determine Row Label (A, B, C...) from the first actual valid seat in the row
                    if (!rowLabel && seatData.seatId) {
                        const match = seatData.seatId.match(/[A-Z]+/); // Extract "A" from "A1"
                        if (match) rowLabel = match[0];
                    }

                    // Check availability: 0 = Booked, 1 = Available/Free
                    // NOTE: BMS usually treats '1' as Available. 
                    // Let's assume API follows: 0=Booked, 1=Available.
                    const availStatus = statusMap.get(seatData.seatId);

                    // If availStatus is undefined, we assume available (for now) unless explicitly 0
                    const isBooked = availStatus === 0;
                    const isSelected = selectedSeats.includes(seatData.seatId);

                    rowSeats.push({
                        id: seatData.seatId,
                        type: seatData.type,
                        status: isBooked ? 'booked' : (isSelected ? 'selected' : 'available'),
                        price: price,
                        categoryName: cat.name
                    });
                }
                grid.push(rowSeats);
                rowLabels.push(rowLabel); // Push label for this row
            }

            return { ...cat, grid, price, rowLabels };
        });
    }, [screenData, availabilityData, currentShow, selectedSeats]);


    // Handlers
    const handleSeatClick = (seat: RenderSeat) => {
        if (seat.status === 'booked' || seat.status === 'gap') return;

        if (selectedSeats.includes(seat.id)) {
            setSelectedSeats(prev => prev.filter(id => id !== seat.id));
        } else {
            if (selectedSeats.length >= 10) {
                alert("You can only select up to 10 seats.");
                return;
            }
            setSelectedSeats(prev => [...prev, seat.id]);
        }
    };

    const formatTime = (isoString: string) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleTimeChange = (newShow: any) => {
        // Switch to new show by navigating
        navigate(`/buy/${movieId}/${newShow.showId}`, {
            state: {
                ...state,
                screenId: newShow.screenId,
                layoutId: newShow.layoutId
            }
        });
        setSelectedSeats([]);
    };

    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((sum, seatId) => {
            for (const cat of categories) {
                for (const row of cat.grid) {
                    const seat = row.find((s: RenderSeat) => s.id === seatId);
                    if (seat) return sum + seat.price;
                }
            }
            return sum;
        }, 0);
    }, [selectedSeats, categories]);

    return (
        <div className="seat-selection-page">
            {/* Header + Time Slider */}
            <div className="seat-header-wrapper">
                <div className="seat-nav-bar container">
                    <div className="nav-left">
                        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                        <div className="movie-details">
                            <h2>{passedMovieTitle || 'Movie Title'}</h2>
                            <p>{theatreName || 'Theatre Name'}</p>
                        </div>
                    </div>
                    <div className="nav-right">
                        <button className="close-btn" onClick={() => navigate('/')}>✕</button>
                    </div>
                </div>

                {/* THE TIME SLIDER */}
                <div className="time-slider-bar">
                    <div className="container time-scroll">
                        {siblings && siblings.length > 0 ? (
                            siblings.map((show: any) => (
                                <button
                                    key={show.showId}
                                    className={`time-chip ${String(show.showId) === String(showId) ? 'active' : ''}`}
                                    onClick={() => handleTimeChange(show)}
                                >
                                    <span className="time-text">{formatTime(show.showTime)}</span>
                                    <span className="info-text">{show.screenConfig || 'DOLBY'}</span>
                                </button>
                            ))
                        ) : (
                            // If no siblings loaded yet, show at least the current one or a loader
                            <div className="time-chip active">
                                <span className="time-text">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Layout Canvas */}
            <div className="layout-container">
                {loadingScreen && <div className="loading-state">Loading Seat Layout...</div>}

                {/* Categories with Prices */}
                {categories.map((cat: any) => (
                    <div key={cat.catId} className="category-section">
                        {/* Price Separator */}
                        <div className="category-header">
                            Rs. {cat.price} {cat.name}
                        </div>

                        <div className="grid-with-labels">
                            {/* Left Row Labels */}
                            <div className="row-labels-col">
                                {cat.rowLabels.map((label: string, idx: number) => (
                                    <div key={idx} className="row-label-cell">
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* The Grid */}
                            <div className="seats-grid" style={{
                                gridTemplateColumns: `repeat(${cat.columns}, 1fr)`
                            }}>
                                {cat.grid.map((row: RenderSeat[], rIndex: number) => (
                                    row.map((seat: RenderSeat, cIndex: number) => (
                                        <div
                                            key={`${rIndex}-${cIndex}`}
                                            className="seat-container"
                                        >
                                            <div
                                                className={`seat-cell ${seat.status} type-${seat.type}`}
                                                onClick={() => handleSeatClick(seat)}
                                                // tooltip
                                                title={seat.price > 0 ? `Rs. ${seat.price} | ${seat.id}` : seat.id}
                                            >
                                                {/* Logic to hide text if booked or gap */}
                                                {seat.status !== 'gap' && seat.status !== 'booked' && (
                                                    <span className="seat-num">{seat.id.replace(/[A-Z]/g, '')}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="screen-direction">
                    <div className="screen-svg-container">
                        <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 20 Q 50 0 100 20" fill="#dce4ed" opacity="0.6" />
                        </svg>
                    </div>
                    <p>All eyes this way please!</p>
                </div>

                <div className="seat-legend">
                    <div className="legend-item"><span className="legend-box available"></span> Available</div>
                    <div className="legend-item"><span className="legend-box selected"></span> Selected</div>
                    <div className="legend-item"><span className="legend-box sold"></span> Sold</div>
                </div>
            </div>

            {/* Footer */}
            {selectedSeats.length > 0 && (
                <div className="pay-footer">
                    <button className="pay-btn" onClick={() => navigate('/payment')}>
                        Pay Rs. {totalPrice}
                    </button>
                </div>
            )}
        </div>
    );
}

export default SeatSelection;
