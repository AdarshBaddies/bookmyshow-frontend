import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_SHOW_DATES, GET_SHOWS, GET_MOVIE } from '../../graphql/queries';
import { useUserStore } from '../../store/userStore';
import './ShowSelection.css';

function ShowSelection() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { location } = useUserStore();

    // State
    const [selectedDate, setSelectedDate] = useState<string>('');

    // 1. Fetch Movie Basics (Title/Genere) for Header
    const { data: movieData } = useQuery(GET_MOVIE, {
        variables: { id: movieId || '' },
        skip: !movieId
    });

    // 2. Fetch Available Dates
    const { data: datesData, loading: loadingDates } = useQuery(GET_SHOW_DATES, {
        variables: {
            locID: location?.locationName?.includes("Mumbai") ? "MUM1" : "MUM1", // Fallback/Hack for now until locId is robust
            movieID: movieId || ''
        },
        skip: !movieId || !location,
        onCompleted: (data) => {
            if (data?.getShowDates?.length > 0) {
                // Select first available date by default
                setSelectedDate(data.getShowDates[0]);
            } else {
                // Fallback to today if no dates from API (for dev/testing)
                // const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
                // setSelectedDate(today);
            }
        }
    });

    // 3. Fetch Shows for Selected Date
    const [fetchShows, { data: showsData, loading: loadingShows, error: showsError }] = useLazyQuery(GET_SHOWS);

    useEffect(() => {
        if (selectedDate && location && movieId) {
            fetchShows({
                variables: {
                    user: {
                        lat: location.lat,
                        lon: location.lon,
                        radius: location.radius || 40,
                        movieId: movieId
                    },
                    d: selectedDate
                }
            });
        }
    }, [selectedDate, location, movieId, fetchShows]);


    // Helpers
    const formatDate = (dateString: string) => {
        // Expected format: YYYYMMDD
        if (!dateString || dateString.length !== 8) return { day: 'MON', date: '01', month: 'JAN' };

        const year = parseInt(dateString.substring(0, 4));
        const month = parseInt(dateString.substring(4, 6)) - 1;
        const day = parseInt(dateString.substring(6, 8));

        const d = new Date(year, month, day);
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        return {
            day: days[d.getDay()],
            date: day.toString().padStart(2, '0'),
            month: months[month]
        };
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleTimeClick = (showId: number, screenId: string, layoutId: string) => {
        // Construct booking object (or just pass IDs)
        navigate(`/buy/${movieId}/${showId}`, {
            state: { screenId, layoutId } // Pass extra context if needed
        });
    };

    // Derived Data
    const movie = movieData?.movie;
    const availableDates = datesData?.getShowDates || [];
    const theatres = showsData?.getShows || [];

    return (
        <div className="show-selection-page">
            {/* Header */}
            <header className="show-header">
                <div className="container">
                    <h1>{movie?.title || 'Loading...'}</h1>
                    <div className="sub-info">
                        <span className="sc-badge">UA</span>
                        <span className="genres">{movie?.genres?.join(', ')}</span>
                    </div>
                </div>
            </header>

            {/* Date Slider */}
            <div className="date-slider-container">
                <div className="container">
                    <div className="date-slider">
                        {availableDates.length > 0 ? (
                            availableDates.map((dateStr: string) => {
                                const { day, date, month } = formatDate(dateStr);
                                const isSelected = selectedDate === dateStr;
                                return (
                                    <button
                                        key={dateStr}
                                        className={`date-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedDate(dateStr)}
                                    >
                                        <span className="day">{day}</span>
                                        <span className="date">{date}</span>
                                        <span className="month">{month}</span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="no-dates">No dates available</div>
                        )}
                        {/* Mock dates for visual testing if API empty */}
                        {availableDates.length === 0 && !loadingDates && [0, 1, 2].map(i => {
                            // Just for UI dev if api fails
                            const d = new Date();
                            d.setDate(d.getDate() + i);
                            const dayName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];
                            const dateNum = d.getDate();
                            const mName = ['JAN', 'FEB', 'MAR'][d.getMonth()] || 'JAN';
                            return (
                                <button key={i} className={`date-card ${i === 0 ? 'selected' : ''}`}>
                                    <span className="day">{dayName}</span>
                                    <span className="date">{dateNum}</span>
                                    <span className="month">{mName}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Theatre & Shows List */}
            <div className="shows-container container">
                <div className="filters-bar">
                    <div className="filter-item">Hindi - 2D</div>
                    <div className="filter-item dropdown">Price Range</div>
                    <div className="filter-item dropdown">Show Timings</div>
                </div>

                {loadingShows && <div className="loading-state">Loading cinemas...</div>}

                {!loadingShows && theatres.length === 0 && (
                    <div className="empty-state">No shows available for this date.</div>
                )}

                <div className="theatre-list">
                    {theatres.map((theatre: any) => (
                        <div key={theatre.TID} className="theatre-card">
                            <div className="theatre-info">
                                <div className="heart-section">
                                    <span className="heart-icon">♡</span>
                                </div>
                                <div>
                                    <h3 className="theatre-name">{theatre.TN}</h3>
                                    <div className="theatre-location">
                                        <span className="m-ticket-icon">📱 M-Ticket</span>
                                        <span className="f-and-b-icon">🍔 F&B</span>
                                    </div>
                                </div>
                                <div className="info-icon">ⓘ</div>
                            </div>

                            <div className="show-times-grid">
                                {theatre.SHS?.map((show: any) => (
                                    <div key={show.showId} className="time-slot-wrapper">
                                        <button
                                            className="time-btn"
                                            onClick={() => handleTimeClick(show.showId, show.screenId, show.layoutId)}
                                        >
                                            {formatTime(show.showTime)}
                                        </button>
                                        <div className="price-tooltip">
                                            {/* Logic to show price range if multiple categories */}
                                            Rs. {show.categoryDetails?.[0]?.price || '200'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShowSelection;
