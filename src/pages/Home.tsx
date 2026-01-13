import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_MOVIES } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Default Location (Mumbai) if geolocation fails/denied
const DEFAULT_LAT = 19.0760;
const DEFAULT_LON = 72.8777;

function Home() {
    const navigate = useNavigate();

    // State for Location & Radius
    const [coords, setCoords] = useState<{ lat: number, lon: number }>({
        lat: DEFAULT_LAT,
        lon: DEFAULT_LON
    });
    const [radius, setRadius] = useState(40); // Default 40km
    const [locationStatus, setLocationStatus] = useState('Using Default Location');

    // Movie Data
    const [movies, setMovies] = useState<any[]>([]);

    // Query: getMovies(input: {lat, lon, rad})
    const [fetchMovies, { loading, error }] = useLazyQuery(GET_MOVIES, {
        onCompleted: (data) => {
            setMovies(data.getMovies || []);
        }
    });

    // 1. Get User Location on Mount
    useEffect(() => {
        if ("geolocation" in navigator) {
            setLocationStatus('Locating...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                    setLocationStatus('Using Your Location');
                },
                (err) => {
                    console.warn("Geolocation warning:", err.message);
                    setLocationStatus('Location Denied - Using Default');
                    // Keep default Mumbai coords
                }
            );
        } else {
            setLocationStatus('Geolocation Not Supported');
        }
    }, []);

    // 2. Fetch Movies whenever Coords or Radius changes
    useEffect(() => {
        fetchMovies({
            variables: {
                input: {
                    lat: coords.lat,
                    lon: coords.lon,
                    rad: radius
                }
            }
        });
    }, [coords, radius, fetchMovies]);

    return (
        <div className="home-page">
            {/* Hero / Filter Bar */}
            <section className="hero-section">
                <div className="hero-content">
                    {/* DEBUG BANNER: Remove after confirming fix */}
                    <div style={{ background: 'red', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
                        <strong>DEBUG MODE:</strong>
                        Coords: {coords.lat.toFixed(2)}, {coords.lon.toFixed(2)} |
                        Radius: {radius} |
                        Movies Found: {movies.length} |
                        Loading: {String(loading)} |
                        Error: {error ? error.message : 'None'}
                    </div>

                    <h1>It All Starts Here!</h1>

                    <div className="location-controls">
                        <div className="location-badge">
                            📍 {locationStatus} ({coords.lat.toFixed(2)}, {coords.lon.toFixed(2)})
                        </div>

                        <div className="radius-selector">
                            <label>Search Radius: {radius} km</label>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="cta-buttons" style={{ marginTop: '20px' }}>
                        <button className="btn-secondary" onClick={() => navigate('/theatre-admin')}>
                            Theatre Admin
                        </button>
                        <button className="btn-secondary" style={{ marginLeft: '10px' }} onClick={() => navigate('/movie-admin')}>
                            Movie Admin
                        </button>
                    </div>
                </div>
            </section>

            {/* Movies Grid */}
            <section className="movies-section">
                <h2>Recommended Movies Nearby</h2>

                {loading && <div className="loading-state">Finding movies near you...</div>}

                {error && <div className="error-state">Error: {error.message}</div>}

                {!loading && !error && movies.length === 0 && (
                    <div className="empty-state">
                        No movies found within {radius}km. Try increasing the radius!
                    </div>
                )}

                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div key={movie.movieId} className="movie-card" onClick={() => navigate(`/movie/${movie.movieId}`)}>
                            <div className="poster-placeholder" style={{ backgroundColor: stringToColor(movie.title) }}>
                                {/* Random Placeholder Image Logic or Initials */}
                                <span>{movie.title[0]}</span>
                            </div>
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <div className="tags">
                                    <span className="lang-tag">{movie.langs?.[0] || 'English'}</span>
                                    <span className="rating-tag">⭐ 8.5</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// Helper for consistent random colors
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}

export default Home;
