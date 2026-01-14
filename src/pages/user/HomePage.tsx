import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_MOVIES } from '../../graphql/queries';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();
    const { location, setModalOpen } = useUserStore(); // Use global location & modal control

    // Open modal on first visit to home if no location set
    useEffect(() => {
        if (!location) {
            setModalOpen(true);
        }
    }, [location, setModalOpen]);

    const [movies, setMovies] = useState<any[]>([]);

    // Query - Fixed 40km radius
    const [fetchMovies, { loading, error }] = useLazyQuery(GET_MOVIES, {
        onCompleted: (data) => {
            setMovies(data.getMovies || []);
        }
    });

    // Fetch Movies whenever Global Location Changes
    useEffect(() => {
        if (location) {
            fetchMovies({
                variables: {
                    user: { // Changed from input to user
                        lat: location.lat,
                        lon: location.lon,
                        radius: location.radius || 40 // Changed from rad to radius
                    }
                }
            });
        }
    }, [location, fetchMovies]);

    return (
        <div className="home-page">
            {/* Hero Carousel Section (Simplified for now) */}
            <section className="hero-carousel">
                {/* Placeholder for actual carousel */}
                <div style={{ height: '300px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2>Promotional Carousel / Featured Events</h2>
                </div>
            </section>

            {/* Movies Grid Section */}
            <section className="movies-section">
                <div className="section-header">
                    <div>
                        <h2>Recommended Movies</h2>
                        {location && <p>Movies in {location.locationName}</p>}
                        {!location && <p>Please select a location to see movies</p>}
                    </div>
                    <span className="see-all">See All ›</span>
                </div>

                {loading && <div className="loading-state">Finding movies...</div>}

                {error && <div className="error-state">Unable to load movies.</div>}

                {!loading && !error && movies.length === 0 && location && (
                    <div className="empty-state">
                        No movies found in {location.locationName}.
                    </div>
                )}

                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div key={movie.movieId} className="movie-card" onClick={() => navigate(`/movie/${movie.movieId}`)}>
                            <div className="movie-poster" style={{ backgroundColor: stringToColor(movie.title) }}>
                                <span className="poster-initial">{movie.title[0]}</span>
                            </div>
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <div className="movie-meta">
                                    <span className="genre-tag">{movie.genres?.[0] || 'Movie'}</span>
                                    {/* <span className="rating-tag">⭐ 8.5</span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// Helper for vibrant random colors
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}

export default HomePage;
