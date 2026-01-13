import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SHOWS_FOR_ADMIN, GET_SHOW_DETAILS } from '../../../graphql/queries';
import { Link } from 'react-router-dom';
import './ShowList.css';
import { format, isValid } from 'date-fns';

function ShowList() {
    const [searchTheatreId, setSearchTheatreId] = useState('');
    const [shows, setShows] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);

    // HELPER: Robust Date Parsing
    // Backend might return "seconds:1768230000" or ISO string
    const parseShowTime = (rawTime: any): Date | null => {
        if (!rawTime) return null;

        // 1. Handle string "seconds:12345"
        if (typeof rawTime === 'string' && rawTime.includes('seconds:')) {
            const match = rawTime.match(/seconds:(\d+)/);
            if (match && match[1]) {
                const seconds = parseInt(match[1], 10);
                return new Date(seconds * 1000);
            }
        }

        // 2. Handle number (timestamp)
        if (typeof rawTime === 'number') {
            return new Date(rawTime);
        }

        // 3. Handle standard ISO Date
        const date = new Date(rawTime);
        if (isValid(date)) return date;

        return null; // Failed to parse
    };

    // Helper for rendering
    const safeFormat = (rawTime: any, fmt: string) => {
        const date = parseShowTime(rawTime);
        return date ? format(date, fmt) : 'Invalid Date';
    };

    // Selection State
    const [selectedShow, setSelectedShow] = useState<any>(null);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);

    const [getShows, { loading: listLoading, error: listError }] = useLazyQuery(GET_SHOWS_FOR_ADMIN, {
        onCompleted: (data) => {
            const rawShows = data.getShowsForAdmin || [];
            // Sort by parsed date
            const sorted = [...rawShows].sort((a: any, b: any) => {
                const tA = parseShowTime(a.showTime)?.getTime() || 0;
                const tB = parseShowTime(b.showTime)?.getTime() || 0;
                return tA - tB;
            });
            setShows(sorted);
            setSearched(true);
            setSelectedShow(null);
            setSelectedDetails(null);
        },
        onError: () => {
            setShows([]);
            setSearched(true);
        }
    });

    const [getShowDetails, { loading: detailsLoading, error: detailsError }] = useLazyQuery(GET_SHOW_DETAILS, {
        onCompleted: (data) => {
            if (data?.getShowDetails) {
                setSelectedDetails(data.getShowDetails);
            }
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTheatreId.trim()) {
            getShows({
                variables: { theatreId: searchTheatreId.trim() }
            });
        }
    };

    const handleShowClick = (show: any) => {
        setSelectedShow(show);

        // CRITICAL: Convert parsed date back to strict ISO for backend query
        const validDate = parseShowTime(show.showTime);

        // If parsing fails, fall back to original (though likely to fail)
        // If parsing works, ensure we send "2025-11-22T09:00:00.000Z"
        const isoTime = validDate ? validDate.toISOString() : show.showTime;

        getShowDetails({
            variables: {
                theatreId: show.theatreId,
                showId: parseInt(show.showId), // Ensure Int
                showTime: isoTime
            }
        });
    };

    const closeDetails = () => {
        setSelectedShow(null);
        setSelectedDetails(null);
    };

    const getStatusLabel = (status: number | undefined) => {
        // Handle missing status gracefully
        if (status === undefined || status === null) return <span className="status-badge unknown">Unknown</span>;

        switch (status) {
            case 0: return <span className="status-badge pending">Pending</span>;
            case 1: return <span className="status-badge open">Open</span>;
            case 2: return <span className="status-badge full">Full</span>;
            case 3: return <span className="status-badge fast-filling">Fast Filling</span>;
            default: return <span className="status-badge unknown">Unknown</span>;
        }
    };

    return (
        <div className="show-list-page">
            <div className="page-header">
                <h2>Manage Shows</h2>
                <Link to="/theatre-admin/shows/add" className="btn-primary">
                    + Add New Show
                </Link>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={searchTheatreId}
                            onChange={(e) => setSearchTheatreId(e.target.value)}
                            placeholder="Enter Theatre ID (e.g., PVRAH)"
                            className="search-input"
                        />
                        <button type="submit" className="btn-search" disabled={listLoading}>
                            {listLoading ? 'Searching...' : '🔍 Find Shows'}
                        </button>
                    </div>
                </form>
            </div>

            {listError && (
                <div className="error-message">
                    <strong>Error:</strong> {listError.message}
                </div>
            )}

            {searched && shows.length === 0 && !listError && (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>No Shows Found</h3>
                    <p>No shows scheduled for Theatre ID: <strong>{searchTheatreId}</strong></p>
                </div>
            )}

            {/* Show List Table */}
            {shows.length > 0 && (
                <div className="shows-grid-container">
                    <table className="shows-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Show ID</th>
                                <th>Movie ID</th>
                                <th>Screen</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shows.map((show) => (
                                <tr
                                    key={`${show.showId}-${safeFormat(show.showTime, 'yyyyMMddHHmm')}`}
                                    onClick={() => handleShowClick(show)}
                                    className={selectedShow?.showId === show.showId ? 'active-row' : ''}
                                >
                                    <td>
                                        <div className="datetime">
                                            <span className="date">{safeFormat(show.showTime, 'MMM dd, yyyy')}</span>
                                            <span className="time">{safeFormat(show.showTime, 'hh:mm a')}</span>
                                        </div>
                                    </td>
                                    <td>#{show.showId}</td>
                                    <td>{show.movieId}</td>
                                    <td>{show.screenId}</td>
                                    <td>{getStatusLabel(show.status)}</td>
                                    <td>
                                        <span className="action-hint">View 👉</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details Panel (Like Screen List) */}
            {selectedShow && (
                <div className="details-panel">
                    <div className="details-header">
                        <h3>Show Details #{selectedShow.showId}</h3>
                        <button onClick={closeDetails} className="btn-close">✖</button>
                    </div>

                    {detailsLoading && <div className="loading">Loading details...</div>}

                    {detailsError && (
                        <div className="error-message">Error: {detailsError.message}</div>
                    )}

                    {selectedDetails && (
                        <div className="details-content">
                            <div className="stats-row">
                                <div className="stat-card">
                                    <label>Total Revenue</label>
                                    <div className="value">
                                        {/* Calculate Total Revenue from Bookings */}
                                        ₹ {selectedDetails.bookingDetails?.reduce((sum: any, b: any) => sum + b.total_price, 0) || 0}
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <label>Bookings</label>
                                    <div className="value">
                                        {selectedDetails.bookingDetails?.length || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="section-title">Pricing</div>
                            <div className="pricing-chips">
                                {selectedDetails.categoryDetails?.map((cat: any) => (
                                    <div key={cat.categoryName} className="price-chip">
                                        <span className="cat-name">{cat.categoryName}</span>
                                        <span className="cat-price">₹{cat.price}</span>
                                    </div>
                                ))}
                            </div>

                            {selectedDetails.bookingDetails?.length > 0 && (
                                <>
                                    <div className="section-title">Recent Bookings</div>
                                    <table className="mini-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedDetails.bookingDetails.map((b: any) => (
                                                <tr key={b.booking_id}>
                                                    <td>{b.user_id}</td>
                                                    <td>₹{b.total_price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!searched && (
                <div className="empty-state-large">
                    <div className="empty-icon">🎥</div>
                    <h3>Manage Your Shows</h3>
                    <p>Search by Theatre ID to see schedules, revenue, and bookings.</p>
                </div>
            )}
        </div>
    );
}

export default ShowList;
