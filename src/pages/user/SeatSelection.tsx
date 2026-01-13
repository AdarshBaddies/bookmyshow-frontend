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

    // Metadata from previous page
    const {
        theatreId,
        theatreName: passedTheatreName,
        date: passedDate,
        movieTitle: passedMovieTitle,
        layoutId: passedLayoutId
    } = state || {};

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // 1. Fetch Shows for Time Slider & Details
    const { data: showsData, loading: loadingShows } = useQuery(GET_SHOWS, {
        variables: {
            user: {
                lat: userStoreLocation?.lat || 19.1197,
                lon: userStoreLocation?.lon || 72.8424,
                radius: userStoreLocation?.radius || 50,
                movieId: movieId
            },
            d: passedDate || '20251122' // Fallback for dev
        },
        skip: !movieId
    });

    // 2. Derive Current Context
    const { currentShow, siblings, theatreName } = useMemo(() => {
        if (!showsData?.getShows) return { currentShow: null, siblings: [], theatreName: passedTheatreName };

        // Find relevant theatre group
        let theatreGroup;
        if (theatreId) {
            theatreGroup = showsData.getShows.find((t: any) => t.TID === theatreId);
        } else {
            // Fallback search by showId
            theatreGroup = showsData.getShows.find((t: any) => t.SHS?.some((s: any) => String(s.showId) === String(showId)));
        }

        if (!theatreGroup) return { currentShow: null, siblings: [], theatreName: passedTheatreName };

        const show = theatreGroup.SHS?.find((s: any) => String(s.showId) === String(showId));

        return {
            currentShow: show,
            siblings: theatreGroup.SHS || [],
            theatreName: theatreGroup.TN
        };
    }, [showsData, theatreId, showId, passedTheatreName]);


    // 3. Layout Fetch
    const effectiveLayoutId = currentShow?.layoutId || passedLayoutId;
    const { data: screenData, loading: loadingScreen } = useQuery(GET_SCREEN, {
        variables: { layoutId: effectiveLayoutId || '' },
        skip: !effectiveLayoutId
    });

    // 4. Availability Fetch
    const { data: availabilityData, startPolling } = useQuery(GET_AVAILABLE_SEATS, {
        variables: { show_id: parseInt(showId || '0') },
        skip: !showId
    });

    useEffect(() => { startPolling(5000); }, [startPolling]);


    // --- Merge Logic ---
    const categories = useMemo(() => {
        if (!screenData?.getScreen?.categories) return [];

        const statusMap = new Map<string, number>();
        if (availabilityData?.getAvailableSeats) {
            availabilityData.getAvailableSeats.forEach((s: any) => {
                statusMap.set(s.seatID, s.Status);
            });
        }

        const getPrice = (catId: number) => {
            // Check if currentShow has pricing for this category
            if (currentShow?.categoryDetails) {
                const catDet = currentShow.categoryDetails.find((c: any) => c.categoryId === catId);
                if (catDet) return catDet.price;
            }
            return 0;
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

                    if (!rowLabel && seatData.seatId) {
                        const match = seatData.seatId.match(/[A-Z]+/);
                        if (match) rowLabel = match[0];
                    }

                    const availStatus = statusMap.get(seatData.seatId);
                    // 0 = Booked, 1 = Available (Assuming)
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
                rowLabels.push(rowLabel);
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
                        <div key={cat.catId} className="category-section">
                            <div className="category-header">
                                {/* Exact BMS Format: ₹190 PLATINUM */}
                                ₹{cat.price} {cat.name}
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
                                                    title={seat.price > 0 ? `Rs. ${seat.price} | ${seat.id}` : seat.id}
                                                >
                                                    {/* Only show number if not booked */}
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

            {/* Footer */ }
            {
                        selectedSeats.length > 0 && (
                            <div className="pay-footer">
                                <button className="pay-btn" onClick={() => navigate('/payment')}>
                                    Pay ₹{totalPrice}
                                </button>
                            </div>
                        )
                    }
        </div>
            );
}

            export default SeatSelection;
