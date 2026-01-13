import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
    GET_SHOWS,
    GET_SHOW_DATES,
    FETCH_THEATRE,
    GET_SCREENS,
    GET_SCREEN,
    GET_SHOWS_FOR_ADMIN,
    GET_AVAILABLE_SEATS,
    GET_BOOKINGS_FOR_SHOW,
} from '../graphql/queries';
import {
    ADD_THEATRE,
    ADD_SCREEN,
    ADD_SHOW,
    LOCK_SEATS,
    RELEASE_SEATS,
} from '../graphql/mutations';
import './TestEndpoint.css';

function TestEndpoint() {
    const [activeTab, setActiveTab] = useState<'theatre' | 'screen' | 'show' | 'booking'>('theatre');
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

    // Check connection on mount
    useEffect(() => {
        fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: '{ __typename }' }),
        })
            .then((res) => {
                if (res.ok) {
                    setConnectionStatus('connected');
                } else {
                    setConnectionStatus('disconnected');
                }
            })
            .catch(() => setConnectionStatus('disconnected'));
    }, []);

    // Theatre state
    const [theatreData, setTheatreData] = useState({
        name: 'PVR Andheri',
        lon: 72.8424,
        lat: 19.1197,
        locId: 'MUM1',
        locationName: 'Andheri, Mumbai',
        pan: 'AAACP1234A',
        link: 'https://www.pvrcinemas.com/theatre/andheri-mumbai',
    });
    const [theatreId, setTheatreId] = useState('PVRAH');

    // Screen state
    const [screenData, setScreenData] = useState({
        name: 'Screen 1 (100 Seater)',
        theatreId: 'PVRAH',
    });
    const [layoutId, setLayoutId] = useState('100007');

    // Show state
    const [showData, setShowData] = useState({
        date: '2025-11-22T00:00:00Z',
        movieID: 'MV001_MOVIE',
        theatreId: 'PVRAH',
        screenId: '',
        showTime: '2025-11-22T02:00:00Z',
        publishTime: '2025-11-22T01:00:00Z',
        lang: 'Hindi',
        layoutId: '100007',
    });
    const [showId, setShowId] = useState(10014);
    const [queryDate, setQueryDate] = useState('20251122');
    const [locID, setLocID] = useState('MUM1');

    // Booking state
    const [bookingData, setBookingData] = useState({
        showID: 10014,
        userID: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        categoryId: 2,
        seatIDs: ['B10', 'B11', 'C10', 'C11'],
    });

    // Location for getShows
    const [location, setLocation] = useState({
        lon: 72.8424,
        lat: 19.1197,
        radius: 10,
        movieId: 'MV001_MOVIE',
    });

    // Mutations
    const [addTheatre, { loading: addTheatreLoading, error: addTheatreError, data: addTheatreData }] =
        useMutation(ADD_THEATRE);
    const [addScreen, { loading: addScreenLoading, error: addScreenError, data: addScreenData }] =
        useMutation(ADD_SCREEN);
    const [addShow, { loading: addShowLoading, error: addShowError, data: addShowData }] = useMutation(ADD_SHOW);
    const [lockSeats, { loading: lockSeatsLoading, error: lockSeatsError, data: lockSeatsData }] =
        useMutation(LOCK_SEATS);
    const [releaseSeats, { loading: releaseSeatsLoading, error: releaseSeatsError, data: releaseSeatsData }] =
        useMutation(RELEASE_SEATS);

    // Queries
    const [fetchTheatre, { loading: fetchTheatreLoading, error: fetchTheatreError, data: fetchTheatreData }] =
        useLazyQuery(FETCH_THEATRE);
    const [getScreens, { loading: getScreensLoading, error: getScreensError, data: getScreensData }] =
        useLazyQuery(GET_SCREENS);
    const [getScreen, { loading: getScreenLoading, error: getScreenError, data: getScreenData }] =
        useLazyQuery(GET_SCREEN);
    const [getShows, { loading: getShowsLoading, error: getShowsError, data: getShowsData }] = useLazyQuery(GET_SHOWS);
    const [getDates, { loading: getDatesLoading, error: getDatesError, data: getDatesData }] =
        useLazyQuery(GET_SHOW_DATES);
    const [getAdminShows, { loading: adminShowsLoading, error: adminShowsError, data: adminShowsData }] =
        useLazyQuery(GET_SHOWS_FOR_ADMIN);
    const [getAvailableSeats, { loading: seatsLoading, error: seatsError, data: seatsData }] =
        useLazyQuery(GET_AVAILABLE_SEATS);
    const [getBookings, { loading: bookingsLoading, error: bookingsError, data: bookingsData }] =
        useLazyQuery(GET_BOOKINGS_FOR_SHOW);

    // Handlers
    const handleAddTheatre = () => {
        addTheatre({
            variables: {
                theatre: {
                    name: theatreData.name,
                    location: { lon: theatreData.lon, lat: theatreData.lat },
                    locId: theatreData.locId,
                    locationName: theatreData.locationName,
                    pan: theatreData.pan,
                    link: theatreData.link,
                },
            },
        });
    };

    const handleAddScreen = () => {
        // Sample screen with simplified layout
        const sampleScreen = {
            name: screenData.name,
            theatreId: screenData.theatreId,
            categories: [
                {
                    catId: 3,
                    name: 'Diamond (Row A)',
                    rows: 1,
                    columns: 13,
                    seats: [
                        { type: 0, seatId: '-' },
                        { type: 0, seatId: '-' },
                        { type: 0, seatId: '-' },
                        { type: 3, seatId: 'A1' },
                        { type: 3, seatId: 'A2' },
                        { type: 3, seatId: 'A3' },
                        { type: 3, seatId: 'A4' },
                        { type: 3, seatId: 'A5' },
                        { type: 3, seatId: 'A6' },
                        { type: 0, seatId: '-' },
                        { type: 0, seatId: '-' },
                        { type: 3, seatId: 'A7' },
                        { type: 3, seatId: 'A8' },
                    ],
                },
                {
                    catId: 2,
                    name: 'Premium (Row B)',
                    rows: 1,
                    columns: 10,
                    seats: [
                        { type: 2, seatId: 'B1' },
                        { type: 2, seatId: 'B2' },
                        { type: 2, seatId: 'B3' },
                        { type: 2, seatId: 'B4' },
                        { type: 2, seatId: 'B5' },
                        { type: 0, seatId: '-' },
                        { type: 2, seatId: 'B6' },
                        { type: 2, seatId: 'B7' },
                        { type: 2, seatId: 'B8' },
                        { type: 2, seatId: 'B9' },
                    ],
                },
            ],
            seatIDs: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
        };

        addScreen({ variables: { screen: sampleScreen } });
    };

    const handleAddShow = () => {
        addShow({
            variables: {
                date: showData.date,
                movieID: showData.movieID,
                theatreId: showData.theatreId,
                shs: [
                    {
                        screenId: showData.screenId || '35nxabhz88hGvRnUzESF9jjIlvb',
                        status: 1,
                        publishTime: showData.publishTime,
                        showTime: showData.showTime,
                        lang: showData.lang,
                        layoutId: showData.layoutId,
                        categoryDetails: [
                            { categoryId: 3, rowCount: 1, columnsCount: 13, categoryName: 'Diamond', price: 400.0, currency: 'INR' },
                            { categoryId: 2, rowCount: 1, columnsCount: 10, categoryName: 'Premium', price: 300.0, currency: 'INR' },
                        ],
                    },
                ],
            },
        });
    };

    return (
        <div className="test-page">
            <div className="test-container">
                <h1>🎬 Complete GraphQL Test Suite</h1>
                <p className="subtitle">Test all theatre, screen, show, and booking operations</p>

                {/* Connection Status */}
                <div className={`connection-status ${connectionStatus}`}>
                    <span className="status-dot"></span>
                    {connectionStatus === 'checking' && '⏳ Checking connection...'}
                    {connectionStatus === 'connected' && '✅ Connected to GraphQL server (http://localhost:8080/graphql)'}
                    {connectionStatus === 'disconnected' && (
                        <>
                            ❌ Cannot connect to GraphQL server
                            <div className="help-text">
                                Make sure your backend is running on port 8080. Check console for details.
                            </div>
                        </>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="tabs">
                    <button className={activeTab === 'theatre' ? 'tab active' : 'tab'} onClick={() => setActiveTab('theatre')}>
                        🏢 Theatre
                    </button>
                    <button className={activeTab === 'screen' ? 'tab active' : 'tab'} onClick={() => setActiveTab('screen')}>
                        🎭 Screen
                    </button>
                    <button className={activeTab === 'show' ? 'tab active' : 'tab'} onClick={() => setActiveTab('show')}>
                        🎥 Show
                    </button>
                    <button className={activeTab === 'booking' ? 'tab active' : 'tab'} onClick={() => setActiveTab('booking')}>
                        🎫 Booking
                    </button>
                </div>

                {/* Theatre Tab */}
                {activeTab === 'theatre' && (
                    <div className="tab-content">
                        <div className="test-section">
                            <h2>1. Add Theatre</h2>
                            <div className="input-grid">
                                <input value={theatreData.name} onChange={(e) => setTheatreData({ ...theatreData, name: e.target.value })} placeholder="Name" />
                                <input type="number" step="0.0001" value={theatreData.lon} onChange={(e) => setTheatreData({ ...theatreData, lon: parseFloat(e.target.value) })} placeholder="Longitude" />
                                <input type="number" step="0.0001" value={theatreData.lat} onChange={(e) => setTheatreData({ ...theatreData, lat: parseFloat(e.target.value) })} placeholder="Latitude" />
                                <input value={theatreData.locId} onChange={(e) => setTheatreData({ ...theatreData, locId: e.target.value })} placeholder="Location ID (e.g., MUM1)" />
                                <input value={theatreData.locationName} onChange={(e) => setTheatreData({ ...theatreData, locationName: e.target.value })} placeholder="Location Name" />
                                <input value={theatreData.pan} onChange={(e) => setTheatreData({ ...theatreData, pan: e.target.value })} placeholder="PAN Number" />
                            </div>
                            <input className="full-width" value={theatreData.link} onChange={(e) => setTheatreData({ ...theatreData, link: e.target.value })} placeholder="Website Link" />
                            <button className="btn-test" onClick={handleAddTheatre} disabled={addTheatreLoading}>
                                {addTheatreLoading ? 'Adding...' : 'Add Theatre'}
                            </button>
                            {addTheatreError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(addTheatreError.message, null, 2)}</pre></div>}
                            {addTheatreData && <div className="success-box"><strong>✅ Theatre Added!</strong><pre>{JSON.stringify(addTheatreData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>2. Fetch Theatre</h2>
                            <input value={theatreId} onChange={(e) => setTheatreId(e.target.value)} placeholder="Theatre ID (e.g., PVRAH)" />
                            <button className="btn-test" onClick={() => fetchTheatre({ variables: { id: theatreId } })} disabled={fetchTheatreLoading}>
                                {fetchTheatreLoading ? 'Loading...' : 'Fetch Theatre'}
                            </button>
                            {fetchTheatreError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(fetchTheatreError.message, null, 2)}</pre></div>}
                            {fetchTheatreData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(fetchTheatreData, null, 2)}</pre></div>}
                        </div>
                    </div>
                )}

                {/* Screen Tab */}
                {activeTab === 'screen' && (
                    <div className="tab-content">
                        <div className="test-section">
                            <h2>1. Add Screen (Sample Layout)</h2>
                            <p className="info-text">This will create a screen with Diamond (Row A) and Premium (Row B) categories</p>
                            <div className="input-grid">
                                <input value={screenData.name} onChange={(e) => setScreenData({ ...screenData, name: e.target.value })} placeholder="Screen Name" />
                                <input value={screenData.theatreId} onChange={(e) => setScreenData({ ...screenData, theatreId: e.target.value })} placeholder="Theatre ID" />
                            </div>
                            <button className="btn-test" onClick={handleAddScreen} disabled={addScreenLoading}>
                                {addScreenLoading ? 'Adding...' : 'Add Screen'}
                            </button>
                            {addScreenError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(addScreenError.message, null, 2)}</pre></div>}
                            {addScreenData && <div className="success-box"><strong>✅ Screen Added!</strong><pre>{JSON.stringify(addScreenData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>2. Get Screens by Theatre</h2>
                            <input value={theatreId} onChange={(e) => setTheatreId(e.target.value)} placeholder="Theatre ID" />
                            <button className="btn-test" onClick={() => getScreens({ variables: { theatreId } })} disabled={getScreensLoading}>
                                {getScreensLoading ? 'Loading...' : 'Get Screens'}
                            </button>
                            {getScreensError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(getScreensError.message, null, 2)}</pre></div>}
                            {getScreensData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(getScreensData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>3. Get Screen Layout</h2>
                            <input value={layoutId} onChange={(e) => setLayoutId(e.target.value)} placeholder="Layout ID" />
                            <button className="btn-test" onClick={() => getScreen({ variables: { layoutId } })} disabled={getScreenLoading}>
                                {getScreenLoading ? 'Loading...' : 'Get Screen'}
                            </button>
                            {getScreenError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(getScreenError.message, null, 2)}</pre></div>}
                            {getScreenData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(getScreenData, null, 2)}</pre></div>}
                        </div>
                    </div>
                )}

                {/* Show Tab */}
                {activeTab === 'show' && (
                    <div className="tab-content">
                        <div className="test-section">
                            <h2>1. Add Show</h2>
                            <div className="input-grid">
                                <input value={showData.movieID} onChange={(e) => setShowData({ ...showData, movieID: e.target.value })} placeholder="Movie ID" />
                                <input value={showData.theatreId} onChange={(e) => setShowData({ ...showData, theatreId: e.target.value })} placeholder="Theatre ID" />
                                <input value={showData.screenId} onChange={(e) => setShowData({ ...showData, screenId: e.target.value })} placeholder="Screen ID (optional)" />
                                <input value={showData.layoutId} onChange={(e) => setShowData({ ...showData, layoutId: e.target.value })} placeholder="Layout ID" />
                                <input value={showData.lang} onChange={(e) => setShowData({ ...showData, lang: e.target.value })} placeholder="Language" />
                            </div>
                            <div className="input-grid">
                                <input type="datetime-local" value={showData.date.slice(0, 16)} onChange={(e) => setShowData({ ...showData, date: e.target.value + ':00Z' })} placeholder="Date" />
                                <input type="datetime-local" value={showData.publishTime.slice(0, 16)} onChange={(e) => setShowData({ ...showData, publishTime: e.target.value + ':00Z' })} placeholder="Publish Time" />
                                <input type="datetime-local" value={showData.showTime.slice(0, 16)} onChange={(e) => setShowData({ ...showData, showTime: e.target.value + ':00Z' })} placeholder="Show Time" />
                            </div>
                            <button className="btn-test" onClick={handleAddShow} disabled={addShowLoading}>
                                {addShowLoading ? 'Adding...' : 'Add Show'}
                            </button>
                            {addShowError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(addShowError.message, null, 2)}</pre></div>}
                            {addShowData && <div className="success-box"><strong>✅ Show Added!</strong><pre>{JSON.stringify(addShowData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>2. Get Show Dates</h2>
                            <div className="input-grid">
                                <input value={locID} onChange={(e) => setLocID(e.target.value)} placeholder="Location ID" />
                                <input value={location.movieId} onChange={(e) => setLocation({ ...location, movieId: e.target.value })} placeholder="Movie ID" />
                            </div>
                            <button className="btn-test" onClick={() => getDates({ variables: { locID, movieID: location.movieId } })} disabled={getDatesLoading}>
                                {getDatesLoading ? 'Loading...' : 'Get Show Dates'}
                            </button>
                            {getDatesError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(getDatesError.message, null, 2)}</pre></div>}
                            {getDatesData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(getDatesData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>3. Get Shows by Location</h2>
                            <div className="input-grid">
                                <input type="number" step="0.0001" value={location.lon} onChange={(e) => setLocation({ ...location, lon: parseFloat(e.target.value) })} placeholder="Longitude" />
                                <input type="number" step="0.0001" value={location.lat} onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })} placeholder="Latitude" />
                                <input type="number" value={location.radius} onChange={(e) => setLocation({ ...location, radius: parseFloat(e.target.value) })} placeholder="Radius (km)" />
                                <input value={queryDate} onChange={(e) => setQueryDate(e.target.value)} placeholder="Date (YYYYMMDD)" />
                            </div>
                            <button className="btn-test" onClick={() => getShows({ variables: { user: { lon: location.lon, lat: location.lat, radius: location.radius, movieId: location.movieId }, d: queryDate } })} disabled={getShowsLoading}>
                                {getShowsLoading ? 'Loading...' : 'Get Shows'}
                            </button>
                            {getShowsError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(getShowsError.message, null, 2)}</pre></div>}
                            {getShowsData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(getShowsData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>4. Get Shows for Admin</h2>
                            <input value={theatreId} onChange={(e) => setTheatreId(e.target.value)} placeholder="Theatre ID" />
                            <button className="btn-test" onClick={() => getAdminShows({ variables: { theatreId } })} disabled={adminShowsLoading}>
                                {adminShowsLoading ? 'Loading...' : 'Get Admin Shows'}
                            </button>
                            {adminShowsError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(adminShowsError.message, null, 2)}</pre></div>}
                            {adminShowsData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(adminShowsData, null, 2)}</pre></div>}
                        </div>
                    </div>
                )}

                {/* Booking Tab */}
                {activeTab === 'booking' && (
                    <div className="tab-content">
                        <div className="test-section">
                            <h2>1. Get Available Seats</h2>
                            <input type="number" value={showId} onChange={(e) => setShowId(parseInt(e.target.value))} placeholder="Show ID" />
                            <button className="btn-test" onClick={() => getAvailableSeats({ variables: { show_id: showId } })} disabled={seatsLoading}>
                                {seatsLoading ? 'Loading...' : 'Get Available Seats'}
                            </button>
                            {seatsError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(seatsError.message, null, 2)}</pre></div>}
                            {seatsData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(seatsData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>2. Lock Seats</h2>
                            <div className="input-grid">
                                <input type="number" value={bookingData.showID} onChange={(e) => setBookingData({ ...bookingData, showID: parseInt(e.target.value) })} placeholder="Show ID" />
                                <input value={bookingData.userID} onChange={(e) => setBookingData({ ...bookingData, userID: e.target.value })} placeholder="User ID" />
                                <input type="number" value={bookingData.categoryId} onChange={(e) => setBookingData({ ...bookingData, categoryId: parseInt(e.target.value) })} placeholder="Category ID" />
                            </div>
                            <input className="full-width" value={bookingData.seatIDs.join(', ')} onChange={(e) => setBookingData({ ...bookingData, seatIDs: e.target.value.split(',').map((s) => s.trim()) })} placeholder="Seat IDs (comma separated)" />
                            <button className="btn-test" onClick={() => lockSeats({ variables: { lock: bookingData } })} disabled={lockSeatsLoading}>
                                {lockSeatsLoading ? 'Locking...' : 'Lock Seats'}
                            </button>
                            {lockSeatsError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(lockSeatsError.message, null, 2)}</pre></div>}
                            {lockSeatsData && <div className="success-box"><strong>✅ Seats Locked!</strong><pre>{JSON.stringify(lockSeatsData, null, 2)}</pre></div>}
                        </div>

                        <div className="test-section">
                            <h2>3. Get Bookings for Show</h2>
                            <input type="number" value={showId} onChange={(e) => setShowId(parseInt(e.target.value))} placeholder="Show ID" />
                            <button className="btn-test" onClick={() => getBookings({ variables: { show_id: showId } })} disabled={bookingsLoading}>
                                {bookingsLoading ? 'Loading...' : 'Get Bookings'}
                            </button>
                            {bookingsError && <div className="error-box"><strong>❌ Error:</strong><pre>{JSON.stringify(bookingsError.message, null, 2)}</pre></div>}
                            {bookingsData && <div className="success-box"><strong>✅ Success:</strong><pre>{JSON.stringify(bookingsData, null, 2)}</pre></div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TestEndpoint;
